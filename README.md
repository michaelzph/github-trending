# GitHub Trending 本地统计页面

抓取和展示 GitHub Trending 的本地统计工具。

## 项目结构

```
github-trending/
├── backend/
│   ├── scraper/
│   │   ├── github_trending.py   # 抓取逻辑
│   │   └── scheduler.py         # 定时任务(APScheduler)
│   ├── api/
│   │   ├── main.py              # FastAPI 入口
│   │   └── routes.py            # /trending/{period} 接口
│   ├── db/
│   │   ├── models.py            # SQLAlchemy 模型
│   │   └── database.py          # 连接配置
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

## 快速开始

### 后端

```bash
cd backend
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
uvicorn api.main:app --reload --port 8000
```

### 前端

```bash
cd frontend
npm install
npm run dev
```

## API 接口

| 方法 | 路径 | 说明 |
|------|------|------|
| GET | `/api/trending/{period}` | 获取 trending 列表 (daily/weekly/monthly) |
| POST | `/api/trending/{period}/scrape` | 手动触发抓取 |
| GET | `/api/languages` | 获取所有语言列表 |

## 定时任务

- 每日 08:00 抓取 daily trending
- 每周一 08:00 抓取 weekly trending
- 每月 1 日 08:00 抓取 monthly trending
