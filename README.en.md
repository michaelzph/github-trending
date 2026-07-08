# GitHub Trending Star Tracker

[中文](README.md)

Scrapes the GitHub Trending page (daily / weekly / monthly) and tracks each listed repository's historical star growth over time, so you can see trends at a glance instead of just a point-in-time snapshot.

## Features

- Scrapes GitHub Trending for daily / weekly / monthly periods
- Filter by language, star count bar chart per ranking
- Click a repo to view its star growth over the last 90/180/365 days (window depends on period)
- Dark mode
- Automatic daily scrape at 08:00, no manual refresh needed

## Screenshots

### Ranking page

![daily ranking](docs/screenshots/daily-ranking.png)

### Star trend chart

![star trend modal](docs/screenshots/star-trend-modal.png)

### Dark mode

![dark mode](docs/screenshots/dark-mode.png)

## Project Structure

```
github-trending/
├── backend/
│   ├── scraper/
│   │   ├── github_trending.py   # scraping logic
│   │   └── scheduler.py         # scheduled jobs (APScheduler)
│   ├── api/
│   │   ├── main.py              # FastAPI entrypoint
│   │   └── routes.py            # /trending/{period} endpoints
│   ├── db/
│   │   ├── models.py            # SQLAlchemy models
│   │   └── database.py          # connection config
│   └── requirements.txt
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── TrendingTable.jsx
│   │   │   ├── PeriodTabs.jsx
│   │   │   └── StarChart.jsx
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── package.json
│   └── vite.config.js
└── README.md
```

## Quick Start

### Backend

```bash
cd backend
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
uvicorn api.main:app --reload --port 8000
```

### Frontend

```bash
cd frontend
npm install
cp .env.example .env
npm run dev
```

Open the address printed in the terminal (defaults to `http://localhost:5173`).

You can also run `start.sh` (backend) and `start-frontend.sh` (frontend) from the repo root — equivalent convenience scripts that additionally bind to a LAN-accessible address (`--host`), useful if you want to reach the app from another device on the same network.

## API

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/trending/{period}` | Get trending list (daily/weekly/monthly) |
| POST | `/api/trending/{period}/scrape` | Manually trigger a scrape |
| GET | `/api/languages` | Get all available languages |

## Scheduled Jobs

- Daily trending scraped at 08:00 every day
- Weekly trending scraped at 08:00 every Monday
- Monthly trending scraped at 08:00 on the 1st of each month

(Only runs while the backend process is running.)

## License

[MIT](LICENSE)
