# GitHub Trending 开源化整理 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 把项目从"个人本地工具"整理成可以直接发布到 GitHub 的开源项目：清除开发过程痕迹，补齐开源标准文件，重写面向开发者的 README（中英双语 + 截图）。

**Architecture:** 纯文件层面的整理工作，不涉及后端/前端源码逻辑改动。删除过程文档和 AI 工具配置，新增 LICENSE/.gitignore/.env.example/README.en.md，重写 README.md。

**Tech Stack:** 无新增依赖，沿用现有 FastAPI + SQLAlchemy + SQLite 后端、React + Vite 前端。

## Global Constraints

- 不执行 `git init` / `git add` / `git commit` / `git push`（用户自行操作）
- 不修改 `backend/`、`frontend/src/` 下的任何源码文件（已核查无需清理）
- 不删除本地 `venv/`、`*.db`、`logs/` 等运行产物，仅通过 `.gitignore` 排除
- LICENSE 署名使用 GitHub 用户名 `michaelzph`，年份 `2026`
- README 语言：中文为主（`README.md`），英文版单独文件（`README.en.md`），两者顶部互相链接
- 截图已就绪于 `docs/screenshots/`：`daily-ranking.png`、`dark-mode.png`、`star-trend-modal.png`
- 完成后删除 `docs/superpowers/`（本设计文档和本计划文档本身也一并删除，属于最后一步）

---

### Task 1: 删除开发过程文档与 AI 工具配置

**Files:**
- Delete: `PROGRESS.md`
- Delete: `DELIVERY.md`
- Delete: `github-trending-dev-plan.md`
- Delete: `.claude/`（整个目录）
- Delete: `.traces/`（整个目录）
- Delete: `frontend/DESIGN.md`

**Interfaces:** 无（纯文件删除，不影响其他任务）

- [ ] **Step 1: 删除文件和目录**

```bash
cd /Users/zhang/claude_proj/github-trending
rm -f PROGRESS.md DELIVERY.md github-trending-dev-plan.md frontend/DESIGN.md
rm -rf .claude .traces
```

- [ ] **Step 2: 验证已删除**

Run: `ls PROGRESS.md DELIVERY.md github-trending-dev-plan.md .claude .traces frontend/DESIGN.md 2>&1`
Expected: 每个路径都输出 `No such file or directory`

---

### Task 2: 新增 LICENSE

**Files:**
- Create: `LICENSE`

**Interfaces:** 无

- [ ] **Step 1: 写入 MIT License**

```
MIT License

Copyright (c) 2026 michaelzph

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

- [ ] **Step 2: 验证文件存在**

Run: `test -f LICENSE && echo OK`
Expected: `OK`

---

### Task 3: 新增根目录 .gitignore 和 frontend/.env.example

**Files:**
- Create: `.gitignore`（根目录）
- Create: `frontend/.env.example`
- Modify: `frontend/.gitignore:1`（在文件开头补充忽略 `.env`，保留原有内容不变）

**Interfaces:**
- Consumes: `frontend/.env` 现有内容（`VITE_API_URL=http://localhost:8000`）作为 `.env.example` 的模板

- [ ] **Step 1: 创建根目录 .gitignore**

```
# Python
venv/
__pycache__/
*.pyc

# Database
*.db

# Logs
logs/
*.log

# OS
.DS_Store

# Editor
.vscode/*
!.vscode/extensions.json
.idea
```

- [ ] **Step 2: 创建 frontend/.env.example**

```
VITE_API_URL=http://localhost:8000
```

- [ ] **Step 3: 在 frontend/.gitignore 顶部补充 .env**

在 `frontend/.gitignore` 文件最前面插入以下两行（原有内容整体后移，不做其他改动）：

```
# Environment
.env
```

- [ ] **Step 4: 验证**

Run: `test -f .gitignore && test -f frontend/.env.example && grep -q "^.env$" frontend/.gitignore && echo OK`
Expected: `OK`

---

### Task 4: 重写 README.md（中文，含截图）

**Files:**
- Modify: `README.md`（整体重写）

**Interfaces:**
- Consumes: `docs/screenshots/daily-ranking.png`、`docs/screenshots/dark-mode.png`、`docs/screenshots/star-trend-modal.png`
- Consumes: 现有 `README.md` 中的项目结构树、快速开始命令、API 接口表、定时任务说明（内容核对后沿用）
- Produces: `README.en.md`（Task 5）需要与本文件章节结构一一对应，并互相链接

- [ ] **Step 1: 写入新 README.md**

```markdown
# GitHub Trending 趋势统计

[English](README.en.md)

基于 GitHub Trending 榜单，抓取并整理 daily / weekly / monthly 三个周期的上榜项目，统计展示各项目的历史 Star 增长趋势，方便直观地追踪热门项目的走势。

## 功能特性

- 抓取 GitHub Trending daily / weekly / monthly 三个周期的榜单
- 榜单内按语言筛选、Star 数柱状图展示
- 点击项目查看近 90/180/365 天（按周期区分）的 Star 增长趋势图
- Dark Mode
- 每日 08:00 定时自动抓取，无需手动刷新

## 截图

### 榜单页面

![daily ranking](docs/screenshots/daily-ranking.png)

### Star 趋势图

![star trend modal](docs/screenshots/star-trend-modal.png)

### Dark Mode

![dark mode](docs/screenshots/dark-mode.png)

## 技术栈

**后端**
- FastAPI — Python Web 框架
- SQLAlchemy 2.0 — ORM，SQLite 数据库
- BeautifulSoup4 — HTML 解析，抓取 GitHub Trending
- APScheduler — 定时任务调度

**前端**
- React 19 — UI 框架
- Vite 8 — 构建工具
- Tailwind CSS v4 — 样式框架
- Recharts — 图表库

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
cp .env.example .env
npm run dev
```

启动后访问终端输出的地址（默认 `http://localhost:5173`）。

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

（仅在后端服务持续运行时生效）

## License

[MIT](LICENSE)
```

- [ ] **Step 2: 验证图片链接有效**

Run: `for f in docs/screenshots/daily-ranking.png docs/screenshots/dark-mode.png docs/screenshots/star-trend-modal.png; do test -f "$f" && echo "OK: $f"; done`
Expected: 三行 `OK: ...`

---

### Task 5: 新增 README.en.md（英文版）

**Files:**
- Create: `README.en.md`

**Interfaces:**
- Consumes: Task 4 完成后的 `README.md` 章节结构（一一对应翻译）

- [ ] **Step 1: 写入英文版 README**

```markdown
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

## Tech Stack

**Backend**
- FastAPI — Python web framework
- SQLAlchemy 2.0 — ORM, SQLite database
- BeautifulSoup4 — HTML parsing for scraping GitHub Trending
- APScheduler — scheduled jobs

**Frontend**
- React 19 — UI framework
- Vite 8 — build tool
- Tailwind CSS v4 — styling
- Recharts — charting library

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
```

- [ ] **Step 2: 验证文件存在且互链正确**

Run: `grep -q "README.md" README.en.md && grep -q "README.en.md" README.md && echo OK`
Expected: `OK`

---

### Task 6: 端到端验证快速开始步骤可用

**Files:** 无新增/修改，仅验证 Task 4/5 中写的命令真实可跑

**Interfaces:** 无

- [ ] **Step 1: 验证后端能启动**

```bash
cd /Users/zhang/claude_proj/github-trending/backend
source venv/bin/activate
python -c "import fastapi, sqlalchemy, bs4, apscheduler; print('deps OK')"
```

Expected: `deps OK`（说明 `requirements.txt` 里的依赖在现有 venv 里可用，README 里的 pip install 步骤描述准确）

- [ ] **Step 2: 验证前端能装依赖并构建**

```bash
cd /Users/zhang/claude_proj/github-trending/frontend
test -d node_modules && echo "node_modules OK"
```

Expected: `node_modules OK`（已有依赖，说明 `npm install` 步骤描述准确；不重复执行安装避免耗时）

- [ ] **Step 3: 确认 start.sh / start-frontend.sh 内容与 README 快速开始一致**

Run: `cat /Users/zhang/claude_proj/github-trending/start.sh /Users/zhang/claude_proj/github-trending/start-frontend.sh`
Expected: 与 README.md「快速开始」中的端口（8000 后端 / 5173 前端默认）、目录结构一致，无需修改

---

### Task 7: 清理设计文档和计划文档

**Files:**
- Delete: `docs/superpowers/`（整个目录，含本计划文件自身和设计文档）

**Interfaces:** 无（收尾步骤，在所有前置任务验证通过后执行）

- [ ] **Step 1: 确认前面所有任务已完成且验证通过**

人工确认 Task 1-6 的验证步骤均已通过。

- [ ] **Step 2: 删除 docs/superpowers**

```bash
cd /Users/zhang/claude_proj/github-trending
rm -rf docs/superpowers
```

- [ ] **Step 3: 验证 docs 目录只剩 screenshots**

Run: `ls docs/`
Expected: 仅 `screenshots`
