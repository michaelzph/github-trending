# GitHub Trending 本地统计页面 — 开发规划

## 技术栈

| 层级 | 技术 | 说明 |
|------|------|------|
| 数据抓取 | Python + requests + BeautifulSoup4 | 爬取 GitHub Trending 页面 |
| 数据存储 | SQLite + SQLAlchemy | 本地轻量，无需额外服务 |
| 后端服务 | FastAPI + APScheduler | REST API + 定时自动抓取 |
| 前端展示 | React + Vite + Tailwind CSS + Recharts | 响应式 UI + 迷你趋势图 |

---

## 项目目录结构

```
github-trending/
├── backend/
│   ├── scraper/
│   │   ├── github_trending.py   # 抓取逻辑
│   │   └── scheduler.py         # 定时任务（APScheduler）
│   ├── api/
│   │   ├── main.py              # FastAPI 入口
│   │   └── routes.py            # /api/trending 接口
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

---

## 核心数据模型

### `repositories` 表
- `repo_full_name`（主键）
- `description`
- `language`
- `total_stars`
- `forks`

### `trending_records` 表
- `period`（daily / weekly / monthly）
- `stars_gained`（本期新增 stars）
- `rank`
- `snapshot_date`

---

## Claude Code 开发步骤

### 第 1 步：初始化项目结构 + 依赖

创建所有目录、`requirements.txt`、`package.json`，配置 Vite + Tailwind。

**Prompt 示例：**

```
帮我创建一个 GitHub Trending 本地统计页面项目，目录名为 github-trending。

技术选型：
- 抓取：requests + BeautifulSoup4，抓取 https://github.com/trending?since=daily/weekly/monthly
- 存储：SQLite + SQLAlchemy，两张表：repositories（基本信息）和 trending_records（每次快照）
- 后端：FastAPI，接口为 GET /api/trending?period=daily&lang=all
- 调度：APScheduler，每天自动抓取一次
- 前端：React + Vite + Tailwind CSS，展示按天/周/月 tab 切换的排行榜卡片

请先完成：
1. 初始化所有目录和文件结构
2. 创建 backend/requirements.txt（包含 fastapi, uvicorn, sqlalchemy, requests, beautifulsoup4, apscheduler）
3. 创建 frontend/package.json 并配置 vite + tailwind
4. 创建根目录 README.md，说明如何启动项目
```

---

### 第 2 步：实现 GitHub Trending 抓取器

抓取 daily / weekly / monthly 三个粒度，解析 stars gained 字段。

- 目标 URL：`https://github.com/trending?since=daily&l=python`
- `stars_gained` 在页面中以 `"X stars today/this week/this month"` 格式出现
- HTML 元素：`<span class="d-inline-block float-sm-right">`
- 加入 `User-Agent` 请求头，控制请求频率，避免被封禁

---

### 第 3 步：设计数据库模型 + 存储逻辑

- SQLite + SQLAlchemy ORM
- `repositories` 表按 `repo_full_name` 去重，更新 `total_stars`
- `trending_records` 表按 `(repo_full_name, period, snapshot_date)` 唯一约束，支持历史快照查询

---

### 第 4 步：实现 FastAPI 后端接口

```
GET /api/trending?period=daily&lang=python&sort=stars_gained&page=1&size=25
```

返回字段：`rank`、`repo_full_name`、`description`、`language`、`stars_gained`、`total_stars`、`forks`、`history`（近期各次快照数据，用于前端折线图）

---

### 第 5 步：实现定时抓取调度

使用 APScheduler：

- `daily`：每天 08:00 自动抓取
- `weekly`：每周一 08:00 自动抓取
- `monthly`：每月 1 日 08:00 自动抓取
- 启动时立即执行一次全量抓取，避免首次访问数据为空

---

### 第 6 步：构建前端展示页面

参考以下 UI 设计：

- **顶栏**：logo + 上次更新时间 + 手动刷新按钮
- **工具栏**：今日 / 本周 / 本月 tab + 语言筛选下拉 + 排序切换（新增 stars / 总 stars）
- **统计摘要**：三个 metric card（上榜项目数、合计新增 stars、最热项目名）
- **项目列表**：每张卡片三栏布局
  - 左：排名（前三名高亮）
  - 中：`owner/repo` 名称 + 简介 + 语言色点 + stars + forks + topic 标签
  - 右：本期新增 stars 大数字 + 迷你折线图 + 总 stars

迷你折线图使用 Recharts 的 `ResponsiveContainer + LineChart` 实现，宽 160px、高 44px，无坐标轴，仅显示折线和淡色面积填充。折线图时间粒度随 tab 联动：今日显示近 7 天曲线，本周显示近 4 周，本月显示近 12 个月。

---

### 第 7 步：联调 + 一键启动脚本

提供 `start.sh`，同时启动后端（uvicorn）与前端（vite dev）：

```bash
#!/bin/bash
cd backend && uvicorn api.main:app --reload &
cd frontend && npm run dev
```

或用 Docker Compose 封装，便于部署。

---

## 关键注意事项

### 1. GitHub Trending 无官方 API

GitHub 未提供 Trending 官方接口，需爬取以下页面：

```
https://github.com/trending?since=daily
https://github.com/trending?since=weekly
https://github.com/trending?since=monthly
```

建议加入合理的请求间隔（如 2–5 秒），并设置 `User-Agent` 模拟浏览器，避免被封禁。如 HTML 结构变化导致解析失败，备选方案为第三方 Trending API（如 `gh-trending-api`）。

### 2. `stars_gained` 字段解析

`stars_gained` 在页面源码中以文本形式嵌在 `<span>` 标签内，需精确定位并解析数字，示例：

```python
span = repo.select_one("span.d-inline-block.float-sm-right")
stars_text = span.get_text(strip=True)  # e.g. "8,420 stars today"
stars_gained = int(stars_text.replace(",", "").split()[0])
```

### 3. 语言过滤

GitHub Trending 支持通过 URL 参数过滤语言：

```
https://github.com/trending/python?since=daily
```

前端语言下拉选择后，将参数传给后端，后端在请求 GitHub 时带上语言参数，避免在本地过滤（减少存储冗余）。

### 4. 本地开发调试建议

初期联调时，先让 Claude Code 实现一套 mock 数据模式（从本地 JSON 文件读取），前端可不依赖真实抓取即可开发调试。正式联调时再切换为真实数据接口。

---

## 启动方式（最终）

```bash
# 安装后端依赖
cd backend
pip install -r requirements.txt

# 启动后端
uvicorn api.main:app --reload --port 8000

# 安装前端依赖
cd ../frontend
npm install

# 启动前端
npm run dev
```

访问 `http://localhost:5173` 查看页面。
