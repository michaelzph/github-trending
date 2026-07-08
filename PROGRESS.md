# GitHub Trending 项目开发进度

> 最后更新：2026-04-30
> 项目状态：**功能开发完成，已上线运行**

---

## Phase 0：UI 设计 — UI Designer

| # | 任务 | 状态 | 备注 |
|---|------|------|------|
| 0.1 | 页面整体布局设计 | ✅ 已完成 | Header + Main 区域划分 |
| 0.2 | TrendingTable 卡片样式规范 | ✅ 已完成 | |
| 0.3 | PeriodTabs 交互与样式规范 | ✅ 已完成 | |
| 0.4 | StarChart 图表配色与尺寸规范 | ✅ 已完成 | |
| 0.5 | 空状态 / 加载态 / 错误态设计 | ✅ 已完成 | |
| 0.6 | Dark Mode 配色方案 | ✅ 已完成 | |
| 0.7 | 输出设计规范文档 DESIGN.md | ✅ 已完成 | frontend/DESIGN.md |

## Phase 1：后端修复与验证 — Backend Engineer

| # | 任务 | 状态 | 备注 |
|---|------|------|------|
| 1.1 | 补充 `__init__.py` 文件 | ✅ 已完成 | 阻塞级问题 |
| 1.2 | 修复 SQLAlchemy 弃用 API | ✅ 已完成 | DeclarativeBase 替代 declarative_base |
| 1.3 | 修复 datetime.utcnow 弃用 | ✅ 已完成 | datetime.now(timezone.utc) 替代 |
| 1.4 | 修复 trending 查询逻辑 | ✅ 已完成 | 按最新快照分组查询 |
| 1.5 | 提取共享服务函数，消除重复代码 | ✅ 已完成 | 新建 scraper/service.py |
| 1.6 | 创建虚拟环境、安装依赖 | ✅ 已完成 | |
| 1.7 | 启动 uvicorn 验证 | ✅ 已完成 | health 接口正常 |
| 1.8 | 手动调用抓取接口验证 | ✅ 已完成 | daily/weekly/monthly 均返回成功 |
| 1.9 | 手动调用查询接口验证 | ✅ 已完成 | 三个周期均返回完整数据 |

## Phase 2：前端修复与实现 — Frontend Engineer

| # | 任务 | 状态 | 备注 |
|---|------|------|------|
| 2.1 | 修复 Tailwind CSS 配置 | ✅ 已完成 | 升级到 Tailwind v4 + @tailwindcss/vite 插件 |
| 2.2 | 配置 Vite 开发代理 | ✅ 已完成 | /api 代理到 localhost:8000 |
| 2.3 | 清理脚手架残留文件 | ✅ 已完成 | 删除 App.css, assets/, public/ |
| 2.4 | 根据 DESIGN.md 调整组件样式 | ✅ 已完成 | CSS 变量 + 暗色模式 + 设计规范 |
| 2.5 | npm run build 构建验证 | ✅ 已完成 | 构建成功，输出 dist/ |
| 2.6 | npm run dev 页面渲染验证 | ✅ 已完成 | 开发服务器启动正常 |

## Phase 3：联调与验收 — QA Engineer

| # | 任务 | 状态 | 备注 |
|---|------|------|------|
| 3.1 | 前后端联合启动 | ✅ 已完成 | 后端 :8000 + 前端 :5173 |
| 3.2 | 抓取功能验证 | ✅ 已完成 | daily/weekly/monthly 抓取均成功 |
| 3.3 | Tab 切换 / 卡片列表 / 图表验证 | ✅ 已完成 | 查询接口返回完整数据 |
| 3.4 | 定时任务配置验证 | ✅ 已完成 | APScheduler 随后端启动 |
| 3.5 | 前端代理验证 | ✅ 已完成 | /api 请求正确转发到后端 |
| 3.6 | 输出交付检查报告 | ✅ 已完成 | DELIVERY.md |

## Phase 4：功能迭代

| # | 任务 | 状态 | 备注 |
|---|------|------|------|
| 4.1 | 修复 weekly 抓取解析问题 | ✅ 已完成 | 处理 "X this week" 格式 |
| 4.2 | 添加趋势图弹窗功能 | ✅ 已完成 | 点击 "Trend" 按钮查看历史趋势 |
| 4.3 | 不同维度时间范围配置 | ✅ 已完成 | daily:90天, weekly:180天, monthly:365天 |
| 4.4 | 同一天数据去重逻辑 | ✅ 已完成 | API 返回时同一天只取最新一条 |
| 4.5 | 取消手动 Refresh 按钮 | ✅ 已完成 | 改为定时自动更新 |
| 4.6 | 配置定时任务 | ✅ 已完成 | 每天 8:00 自动抓取 |

---

## 变更记录

| 日期 | 变更内容 |
|------|----------|
| 2026-04-30 | Phase 0 完成：UI 设计规范输出 DESIGN.md |
| 2026-04-30 | Phase 1 完成：后端修复全部完成，接口验证通过 |
| 2026-04-30 | Phase 2 完成：前端构建成功 |
| 2026-04-30 | Phase 3 完成：端到端联调验证通过 |
| 2026-04-30 | 修复 weekly 抓取解析问题 |
| 2026-04-30 | 添加趋势图弹窗功能，支持查看历史 stars 趋势 |
| 2026-04-30 | 配置不同维度的历史时间范围 |
| 2026-04-30 | 添加同一天数据去重逻辑 |
| 2026-04-30 | 取消手动刷新按钮，配置定时自动更新 |

---

## 当前运行状态

- 后端：http://localhost:8000 (APScheduler 每天 8:00 自动抓取)
- 前端：http://localhost:5173
- 数据库：backend/github_trending.db (已重置，从 2026-04-30 开始记录)

---

## 启动方式

```bash
# 后端
cd backend
source venv/bin/activate
uvicorn api.main:app --host 0.0.0.0 --port 8000

# 前端
cd frontend
npm run dev -- --host
```

或使用启动脚本：
```bash
./start.sh        # 启动后端
./start-frontend.sh  # 启动前端
```