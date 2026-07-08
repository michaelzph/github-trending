import requests
from bs4 import BeautifulSoup
from typing import List, Dict, Optional


class GitHubTrendingScraper:
    BASE_URL = "https://github.com/trending"

    def __init__(self):
        self.session = requests.Session()
        self.session.headers.update({
            "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36"
        })

    def scrape(self, period: str = "daily", language: str = None) -> List[Dict]:
        url = f"{self.BASE_URL}?since={period}"
        if language and language != "all":
            url += f"&language={language}"

        response = self.session.get(url)
        response.raise_for_status()

        soup = BeautifulSoup(response.text, "lxml")
        articles = soup.select("article.Box-row")

        results = []
        for rank, article in enumerate(articles, 1):
            repo_data = self._parse_article(article, rank, period)
            if repo_data:
                results.append(repo_data)

        return results

    def _parse_article(self, article, rank: int, period: str) -> Optional[Dict]:
        try:
            h2 = article.select_one("h2 a")
            if not h2:
                return None

            repo_path = h2.get("href", "").strip("/")
            repo_url = f"https://github.com/{repo_path}"

            description_el = article.select_one("p.col-9")
            description = description_el.text.strip() if description_el else None

            lang_el = article.select_one("[itemprop='programmingLanguage']")
            language = lang_el.text.strip() if lang_el else None

            stars_text = article.select_one("a[href$='/stargazers']")
            stars = self._parse_count(stars_text.text.strip()) if stars_text else 0

            forks_text = article.select_one("a[href$='/forks']")
            forks = self._parse_count(forks_text.text.strip()) if forks_text else 0

            stars_today_el = article.select_one("span.d-inline-block.float-sm-right")
            stars_today = 0
            if stars_today_el:
                stars_today = self._parse_count(stars_today_el.text.strip())

            return {
                "name": repo_path,
                "url": repo_url,
                "description": description,
                "language": language,
                "stars": stars,
                "forks": forks,
                "stars_today": stars_today,
                "rank": rank,
                "period": period,
            }
        except Exception as e:
            print(f"Error parsing article: {e}")
            return None

    def _parse_count(self, text: str) -> int:
        text = text.replace(",", "").replace("stars", "").replace("forks", "").strip()
        # Handle "X this week" / "X this month" / "X today" formats
        for suffix in ["this week", "this month", "today", "this wee", "this mont"]:
            text = text.replace(suffix, "").strip()
        if "k" in text.lower():
            return int(float(text.lower().replace("k", "")) * 1000)
        try:
            return int(text)
        except ValueError:
            return 0
