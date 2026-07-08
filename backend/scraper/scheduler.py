from apscheduler.schedulers.background import BackgroundScheduler
from apscheduler.triggers.cron import CronTrigger
from db.database import SessionLocal
from db.models import TrendingRecord
from scraper.service import scrape_and_save
from datetime import datetime, timezone
import logging

logger = logging.getLogger(__name__)

scheduler = BackgroundScheduler(
    logger=logging.getLogger("apscheduler"),
    job_defaults={"misfire_grace_time": 3600, "coalesce": True},
)


def scheduled_scrape(period: str):
    logger.info(f"Starting scheduled scrape for period: {period}")
    db = SessionLocal()
    try:
        saved_count = scrape_and_save(period, db)
        logger.info(f"Completed scrape for {period}: {saved_count} repositories saved")
    except Exception as e:
        db.rollback()
        logger.error(f"Error during scrape for {period}: {e}", exc_info=True)
    finally:
        db.close()


def _needs_catchup(period: str) -> bool:
    """Check if a catch-up scrape is needed for the current period window."""
    from datetime import timedelta, date
    db = SessionLocal()
    try:
        record = db.query(TrendingRecord).filter(TrendingRecord.period == period).order_by(
            TrendingRecord.recorded_at.desc()
        ).first()
        if record is None:
            return True
        last = record.recorded_at
        if last.tzinfo is None:
            last = last.replace(tzinfo=timezone.utc)
        today = datetime.now(timezone.utc).date()
        last_date = last.date()
        return last_date < today
    finally:
        db.close()


def catchup_check():
    """Run every hour: scrape any period that hasn't been updated today."""
    for period in ["daily", "weekly", "monthly"]:
        if _needs_catchup(period):
            logger.info("Catch-up scrape triggered for %s", period)
            scheduled_scrape(period)


def init_scheduler():
    scheduler.add_job(
        lambda: scheduled_scrape("daily"),
        CronTrigger(hour=8, minute=0),
        id="scrape_daily",
        replace_existing=True,
    )
    scheduler.add_job(
        lambda: scheduled_scrape("weekly"),
        CronTrigger(hour=8, minute=0),
        id="scrape_weekly",
        replace_existing=True,
    )
    scheduler.add_job(
        lambda: scheduled_scrape("monthly"),
        CronTrigger(hour=8, minute=0),
        id="scrape_monthly",
        replace_existing=True,
    )
    # Hourly safety net: catches missed jobs due to machine sleep or late startup
    scheduler.add_job(
        catchup_check,
        CronTrigger(minute=0),
        id="catchup_check",
        replace_existing=True,
    )
    scheduler.start()
    logger.info("Scheduler started with jobs: %s", [j.id for j in scheduler.get_jobs()])

    # Also run immediately on startup
    catchup_check()


def shutdown_scheduler():
    scheduler.shutdown()
    logger.info("Scheduler shutdown")
