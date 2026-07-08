---
name: team-and-dev-plan
description: GitHub Trending 项目研发团队组建与开发规划
type: project
---

# GitHub Trending 项目 — 团队组建与开发规划

## 一、研发团队（4 人）

### 1. UI Designer（UI 设计师）
- **职责**：整体页面设计、交互规范、视觉一致性
- **工作范围**：
  - 制定页面布局规范（Header / Main / Sidebar 比例与间距）
  - 设计组件视觉规范（卡片样式、Tab 样式、图表配色、空状态、加载态）
  - 定义 Dark Mode 配色方案
  - 定义语言标签颜色映射规范
  - 输出设计稿（ASCII / CSS 变量 / Tailwind class 规范文档），供 Frontend Engineer 落地
  - 前端实现后进行视觉走查

### 2. Backend Engineer（后端工程师）
- **职责**：后端全部代码的编写、调试、运行验证
- **工作范围**：
  - 修复 Python 包缺少 `__init__.py` 导致的导入失败
  - 修复 SQLAlchemy 弃用 API（declarative_base → DeclarativeBase）
  - 修复 datetime.utcnow 弃用警告
  - 修复 trending 查询逻辑（当前取最新 25 条而非最新快照的 25 条）
  - 提取"抓取并入库"为共享服务函数，消除重复代码
  - 后端启动验证，确保 uvicorn 能正常运行
  - 手动触发抓取接口验证

### 3. Frontend Engineer（前端工程师）
- **职责**：前端全部代码的编写、调试、构建验证
- **工作范围**：
  - 根据 UI Designer 输出的规范实现页面
  - 修复 Tailwind CSS v4 配置兼容问题
  - 删除 Vite 脚手架残留文件（App.css, assets/ 等）
  - 配置 Vite 开发代理，避免跨域问题
  - 前端构建验证，确保 npm run build 通过
  - 前端开发服务器验证

### 4. QA Engineer（测试工程师）
- **职责**：端到端验证，确保项目可交付
- **工作范围**：
  - 后端 API 接口测试（启动服务 → 调用抓取 → 查询结果）
  - 前端页面功能测试（构建 → 页面渲染 → 交互）
  - 前后端联调验证
  - UI 视觉走查辅助
  - 交付检查清单

---

## 二、当前项目问题清单

### 严重（阻塞运行）
1. **缺少 `__init__.py`**：backend/api/、backend/db/、backend/scraper/ 三个包均无 `__init__.py`，Python 无法识别为包，所有跨包 import 都会失败
2. **Tailwind CSS v4 配置不兼容**：安装的是 tailwindcss v4，但使用的是 v3 的配置方式（tailwind.config.js + postcss.config.js），构建时样式不会生效

### 中等（功能缺陷）
3. **SQLAlchemy 弃用 API**：`declarative_base()` 在 SQLAlchemy 2.0 中已弃用，应使用 `DeclarativeBase`
4. **datetime.utcnow 弃用**：`datetime.utcnow()` 在 Python 3.12+ 中已弃用
5. **trending 查询逻辑错误**：当前 `order_by(recorded_at.desc()).limit(25)` 取的是所有记录中最新的 25 条，而非最新一次快照的 25 条。如果多次抓取，结果会混乱
6. **Vite 未配置开发代理**：前端请求后端 API 存在跨域风险

### 轻微（清理项）
7. **Vite 脚手架残留**：App.css、assets/ 目录等未清理
8. **scraper 与 routes 中存在重复的"抓取并入库"逻辑**：scheduler.py 和 routes.py 中的 trigger_scrape 代码几乎完全相同

---

## 三、开发计划

### Phase 0：UI 设计（UI Designer）— 与 Phase 1 并行
1. 设计页面整体布局（Header + Main 区域划分）
2. 设计 TrendingTable 卡片样式规范
3. 设计 PeriodTabs 交互与样式规范
4. 设计 StarChart 图表配色与尺寸规范
5. 设计空状态、加载态、错误态
6. 定义 Dark Mode 配色方案
7. 输出设计规范文档至 frontend/DESIGN.md

### Phase 1：后端修复与验证（Backend Engineer）
1. 补充 `__init__.py` 文件
2. 修复 SQLAlchemy 弃用 API
3. 修复 datetime.utcnow
4. 修复 trending 查询逻辑（按最新快照分组查询）
5. 提取"抓取并入库"为共享服务函数，消除重复代码
6. 创建虚拟环境、安装依赖、启动验证
7. 手动调用 POST /api/trending/daily/scrape 验证抓取
8. 手动调用 GET /api/trending/daily 验证查询

### Phase 2：前端修复与实现（Frontend Engineer）— 依赖 Phase 0 + Phase 1
1. 修复 Tailwind CSS 配置（适配 v4 或降级到 v3）
2. 配置 Vite 开发代理
3. 清理脚手架残留文件
4. 根据 DESIGN.md 规范调整组件样式
5. npm run build 验证构建通过
6. npm run dev 验证页面渲染

### Phase 3：联调与验收（QA Engineer + UI Designer 走查）
1. 同时启动后端和前端
2. 点击 Refresh 按钮触发抓取
3. 验证 Tab 切换、卡片列表、StarChart 图表
4. 验证定时任务配置正确
5. UI Designer 进行视觉走查
6. 输出交付检查报告

---

## 四、进度记录机制

- 进度文件：`PROGRESS.md`（项目根目录）
- 格式：按 Phase + 日期记录，每条包含：任务、负责人、状态、备注
- 更新时机：每个子任务完成时由对应 Agent 写入
- 目的：任何项目经理接手时，阅读 PROGRESS.md 即可了解完整进展
