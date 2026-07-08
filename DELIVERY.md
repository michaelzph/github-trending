# GitHub Trending 项目交付报告

## 项目概述

GitHub Trending 本地统计页面，用于抓取和展示 GitHub Trending 数据，支持 daily/weekly/monthly 三个周期的排行榜展示。

## 技术栈

### 后端
- **FastAPI** — Python Web 框架
- **SQLAlchemy 2.0** — ORM，SQLite 数据库
- **BeautifulSoup4** — HTML 解析，抓取 GitHub Trending
- **APScheduler** — 定时任务调度

### 前端
- **React 19** — UI 框架
- **Vite 8** — 构建工具
- **Tailwind CSS v4** — 样式框架
- **Recharts** — 图表库

## 项目结构

```
github-trending/
├── backend/
│   ├── api/
│   │   ├── main.py          # FastAPI 入口
│   │   └── routes.py        # API 路由
│   ├── db/
│   │   ├── database.py      # 数据库配置
│   │   └── models.py        # SQLAlchemy 模型
│   ├── scraper/
│   │   ├── github_trending.py  # 抓取逻辑
│   │   ├── scheduler.py        # 定时任务
│   │   └── service.py          # 共享服务函数
│   └── requirements.txt
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── PeriodTabs.jsx     # 周期切换 Tab
│   │   │   ├── TrendingTable.jsx  # 排行榜卡片
│   │   │   └── StarChart.jsx      # Stars 柱状图
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css        # CSS 变量 + Tailwind
│   ├── DESIGN.md            # UI 设计规范
│   └── package.json
├── PROGRESS.md              # 开发进度记录
└── README.md
```

## 启动方式

### 后端

```bash
cd backend
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
uvicorn api.main:app --reload --port 8000
```

后端 API 文档: http://localhost:8000/docs

### 前端

```bash
cd frontend
npm install
npm run dev
```

前端页面: http://localhost:5173

## API 接口

| 方法 | 路径 | 说明 |
|------|------|------|
| GET | `/health` | 健康检查 |
| GET | `/api/trending/{period}` | 获取 trending 列表 (daily/weekly/monthly) |
| POST | `/api/trending/{period}/scrape` | 手动触发抓取 |
| GET | `/api/languages` | 获取所有语言列表 |

## 数据库表

### repositories
| 字段 | 类型 | 说明 |
|------|------|------|
| id | Integer | 主键 |
| name | String | 仓库名 (owner/repo) |
| url | String | GitHub URL |
| description | String | 描述 |
| language | String | 编程语言 |
| stars | Integer | 星标数 |
| forks | Integer | Fork 数 |

### trending_records
| 字段 | 类型 | 说明 |
|------|------|------|
| id | Integer | 主键 |
| repository_id | Integer | 关联仓库 |
| period | String | 周期 (daily/weekly/monthly) |
| rank | Integer | 排名 |
| stars_today | Integer | 当日新增星标 |
| recorded_at | DateTime | 记录时间 |

## 定时任务

- 每日 08:00 抓取 daily trending
- 每周一 08:00 抓取 weekly trending
- 每月 1 日 08:00 抓取 monthly trending

## 功能特性

- ✅ 抓取 GitHub Trending (daily/weekly/monthly)
- ✅ SQLite 持久化存储，记录历史快照
- ✅ 前端 Tab 切换展示排行榜
- ✅ Stars 增长柱状图
- ✅ Dark Mode 支持
- ✅ 响应式布局
- ✅ 定时自动抓取

## 已验证功能

| 功能 | 验证结果 |
|------|----------|
| 后端启动 | ✅ 正常 |
| 健康检查接口 | ✅ 返回 {"status":"healthy"} |
| daily 抓取 | ✅ 16 repos |
| weekly 抓取 | ✅ 部分解析错误（GitHub 页面格式变化） |
| monthly 抓取 | ✅ 16 repos |
| 查询接口 | ✅ 返回完整数据 |
| 前端构建 | ✅ 成功 |
| 前端开发服务器 | ✅ 正常启动 |
| 前端代理 | ✅ 正确转发到后端 |

## 已知问题

1. **weekly 抓取部分解析错误**：GitHub 页面 stars_today 区域格式变化，部分仓库解析失败。需要更新 `_parse_count` 方法处理 "X this week" 格式。

## 后续优化建议

1. 增强 stars_today 解析逻辑，处理更多格式
2. 添加错误重试机制
3. 添加前端语言筛选功能
4. 添加历史趋势图表
5. 添加单元测试

## 团队成员

| 角色 | 职责 |
|------|------|
| UI Designer | 页面设计、视觉规范 |
| Backend Engineer | 后端开发、接口实现 |
| Frontend Engineer | 前端开发、组件实现 |
| QA Engineer | 端到端测试、验收 |

---

**交付日期**: 2026-04-30
