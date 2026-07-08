# GitHub Trending 开源化整理 — 设计文档

日期：2026-07-08

## 背景

本项目基于 GitHub Trending 榜单信息，抓取并整理 daily/weekly/monthly 三个周期的上榜项目数据，统计展示各项目的历史 Star 增长趋势，方便更直观地查看和追踪热门项目的走势。项目计划开源发布到 GitHub，此设计文档覆盖开源前的整理范围。

## 目标

1. 清理项目中所有开发过程文档、AI 工具配置等与最终代码无关的内容
2. 补齐开源项目标准文件（LICENSE、.gitignore、README）
3. README 面向普通开发者，能照着操作跑起来项目

不涉及：反编译保护、打包分发、多用户部署、git 初始化与推送（用户自行操作）。

## 变更范围

### 删除
- `PROGRESS.md` — 内部开发进度表（含 "UI Designer/Backend Engineer" 分工痕迹）
- `DELIVERY.md` — 交付报告
- `github-trending-dev-plan.md` — 明确提及 "Claude Code" 的开发计划文档
- `.claude/` — 整个目录（AI 开发工具配置，含 `team-and-dev-plan.md`、`settings.local.json`）
- `.traces/` — 空目录
- `frontend/DESIGN.md` — UI 设计规范文档（开发期工具，对开源使用者无价值）

### 新增
- `LICENSE` — MIT，署名 `michaelzph`，年份 2026
- `.gitignore`（根目录）— 补充 Python 相关忽略规则：`venv/`、`__pycache__/`、`*.db`、`logs/`、`.DS_Store`（frontend 已有独立 `.gitignore`，不改动）
- `frontend/.env.example` — 内容取自现有 `frontend/.env`；`.env` 本身加入根 `.gitignore`
- `README.en.md` — 英文版 README，结构与中文版一致

### 重写
- `README.md` — 标准开源项目结构：
  1. 项目简介 + 语言切换链接（指向 `README.en.md`）+ License badge
  2. 功能特性
  3. 技术栈
  4. 截图区（引用 `docs/screenshots/` 下的图片）
  5. 快速开始（后端 venv/pip/uvicorn，前端 npm install/npm run dev，均给出可复制命令）
  6. 项目结构（目录树）
  7. License 声明

### 核查后保留（视内容微调）
- `start.sh`、`start-frontend.sh` — 确认无开发期残留路径/注释，与 README 快速开始步骤保持一致
- `backend/`、`frontend/src/` 下的实际源码 — 已核查无 AI/agent 相关注释痕迹，无需改动

## 不做的事

- 不执行 `git init` / `git commit` / `git push`（用户自行操作）
- 不删除本地 `venv/`、`*.db`、`logs/` 等运行产物（仅通过 `.gitignore` 排除，不影响本地继续开发/运行）
- 不生成截图（用户已自行准备好截图，放入 `docs/screenshots/` 后由本次改动在 README 中引用）
