from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from sqlalchemy import func, desc
from typing import List
from datetime import datetime, timedelta
from db.database import get_db
from db.models import Repository, TrendingRecord
from scraper.service import scrape_and_save
from scraper.scheduler import scheduler
from pydantic import BaseModel

router = APIRouter()


class TrendingItem(BaseModel):
    id: int
    name: str
    url: str
    description: str | None = None
    language: str | None = None
    stars: int = 0
    forks: int = 0
    rank: int
    stars_today: int = 0
    recorded_at: datetime
    history: List[int] = []

    class Config:
        from_attributes = True


class TrendingResponse(BaseModel):
    period: str
    total: int
    items: List[TrendingItem]


class HistoryPoint(BaseModel):
    recorded_at: datetime
    stars: int
    stars_today: int

    class Config:
        from_attributes = True


class RepoHistoryResponse(BaseModel):
    name: str
    history: List[HistoryPoint]


@router.get("/trending/{period}", response_model=TrendingResponse)
def get_trending(
    period: str,
    db: Session = Depends(get_db)
):
    if period not in ["daily", "weekly", "monthly"]:
        raise HTTPException(status_code=400, detail="Invalid period. Use daily, weekly, or monthly.")

    latest = db.query(func.max(TrendingRecord.recorded_at)).filter(
        TrendingRecord.period == period
    ).scalar()

    if not latest:
        return TrendingResponse(period=period, total=0, items=[])

    records = (
        db.query(TrendingRecord)
        .join(Repository)
        .filter(TrendingRecord.period == period, TrendingRecord.recorded_at == latest)
        .order_by(TrendingRecord.rank)
        .all()
    )

    if not records:
        return TrendingResponse(period=period, total=0, items=[])

    # Get history for each repo (last 7 unique dates)
    items = []
    for record in records:
        repo_id = record.repository.id
        history_records = (
            db.query(TrendingRecord)
            .filter(TrendingRecord.repository_id == repo_id, TrendingRecord.period == period)
            .order_by(desc(TrendingRecord.recorded_at))
            .limit(14)
            .all()
        )
        # 同一天只取最新一条
        seen_dates = {}
        for r in history_records:
            date_key = r.recorded_at.strftime("%Y-%m-%d")
            if date_key not in seen_dates or r.recorded_at > seen_dates[date_key].recorded_at:
                seen_dates[date_key] = r
        deduped = sorted(seen_dates.values(), key=lambda r: r.recorded_at)
        deduped = deduped[-7:]  # 取最近7天
        history = [r.stars_today for r in deduped]

        items.append(TrendingItem(
            id=repo_id,
            name=record.repository.name,
            url=record.repository.url,
            description=record.repository.description,
            language=record.repository.language,
            stars=record.repository.stars,
            forks=record.repository.forks,
            rank=record.rank,
            stars_today=record.stars_today,
            recorded_at=record.recorded_at,
            history=history
        ))

    return TrendingResponse(period=period, total=len(items), items=items)


@router.get("/repo/{repo_id}/history")
def get_repo_history(
    repo_id: int,
    period: str = Query("daily"),
    days: int = Query(90, ge=1, le=365),
    db: Session = Depends(get_db)
):
    repo = db.query(Repository).filter(Repository.id == repo_id).first()
    if not repo:
        raise HTTPException(status_code=404, detail="Repository not found")

    since = datetime.utcnow() - timedelta(days=days)
    records = (
        db.query(TrendingRecord)
        .filter(
            TrendingRecord.repository_id == repo_id,
            TrendingRecord.period == period,
            TrendingRecord.recorded_at >= since
        )
        .order_by(TrendingRecord.recorded_at)
        .all()
    )

    # 同一天多条记录只取最新一条
    seen_dates = {}
    for r in records:
        date_key = r.recorded_at.strftime("%Y-%m-%d")
        if date_key not in seen_dates or r.recorded_at > seen_dates[date_key].recorded_at:
            seen_dates[date_key] = r

    deduped = sorted(seen_dates.values(), key=lambda r: r.recorded_at)

    history = [
        {
            "date": r.recorded_at.strftime("%Y-%m-%d"),
            "stars": r.stars,  # 使用 TrendingRecord 中保存的 stars
            "stars_today": r.stars_today
        }
        for r in deduped
    ]

    return {
        "id": repo.id,
        "name": repo.name,
        "url": repo.url,
        "description": repo.description,
        "language": repo.language,
        "history": history
    }


@router.post("/trending/{period}/scrape")
def trigger_scrape(
    period: str,
    db: Session = Depends(get_db)
):
    if period not in ["daily", "weekly", "monthly"]:
        raise HTTPException(status_code=400, detail="Invalid period. Use daily, weekly, or monthly.")

    try:
        saved_count = scrape_and_save(period, db)
        return {"message": f"Successfully scraped and saved {saved_count} repositories"}
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/languages")
def get_languages(db: Session = Depends(get_db)):
    languages = db.query(Repository.language).distinct().all()
    return {"languages": [lang[0] for lang in languages if lang[0]]}


@router.get("/scheduler/status")
def scheduler_status():
    if not scheduler.running:
        return {"running": False, "jobs": []}
    jobs = []
    for job in scheduler.get_jobs():
        jobs.append({
            "id": job.id,
            "next_run_time": str(job.next_run_time) if job.next_run_time else None,
            "trigger": str(job.trigger),
        })
    return {"running": True, "jobs": jobs}
