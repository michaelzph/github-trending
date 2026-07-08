from datetime import datetime, timezone
from db.models import Repository, TrendingRecord
from scraper.github_trending import GitHubTrendingScraper

scraper = GitHubTrendingScraper()


def scrape_and_save(period: str, db) -> int:
    """Scrape GitHub trending repos for the given period and save to database.

    Args:
        period: One of 'daily', 'weekly', 'monthly'.
        db: A SQLAlchemy Session instance.

    Returns:
        The number of repositories saved.
    """
    data = scraper.scrape(period=period)
    saved_count = 0
    recorded_at = datetime.now(timezone.utc)

    for item in data:
        repo = db.query(Repository).filter(Repository.name == item["name"]).first()
        if not repo:
            repo = Repository(
                name=item["name"],
                url=item["url"],
                description=item["description"],
                language=item["language"],
                stars=item["stars"],
                forks=item["forks"]
            )
            db.add(repo)
            db.flush()
        else:
            repo.stars = item["stars"]
            repo.forks = item["forks"]
            if item["description"]:
                repo.description = item["description"]

        record = TrendingRecord(
            repository_id=repo.id,
            period=item["period"],
            rank=item["rank"],
            stars=item["stars"],  # 保存当时的累计 stars 数
            stars_today=item["stars_today"],
            recorded_at=recorded_at
        )
        db.add(record)
        saved_count += 1

    db.commit()
    return saved_count
