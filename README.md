# Opportunity Radar（轻量版：Python + 静态 HTML）

你提出“希望避免复杂软件，主要用 Python 和静态 HTML”，因此当前仓库提供了一套更轻量、可运行、可扩展的实现：

- 后端：**Flask（Python）**
- 前端：**Jinja 模板 + 静态 HTML/CSS + 少量 Chart.js**
- 数据库：**SQLite（本地文件）**
- 认证：邮箱 + 密码（会话登录）
- 能力：关键词列表、详情、评分、推荐、提醒、mock ingestion

> 目录：`python_app/`

---

## 1) 快速启动

```bash
cd python_app
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
python init_db.py
python app.py
```

打开：`http://127.0.0.1:5000`

Demo 账号：

- 邮箱：`founder@opportunityradar.dev`
- 密码：`ChangeMe123!`

---

## 2) 页面能力

- `/login`：登录页
- `/dashboard`：总览卡片、趋势图、最近机会、低竞争机会、提醒
- `/keywords`：可筛选/排序的关键词列表
- `/keywords/<slug>`：关键词详情（变体、来源事件、评分、推荐）
- `/alerts`：提醒列表
- `/settings`：收藏关键词、最近 ingestion 记录、手动触发 mock ingestion

---

## 3) 数据结构（SQLite）

`python_app/schema.sql` 中定义了核心表：

- `users`
- `keywords`
- `keyword_variants`
- `keyword_metrics`
- `source_events`
- `keyword_clusters`
- `product_recommendations`
- `alerts`
- `saved_keywords`
- `ingestion_runs`

---

## 4) 核心服务设计（Python）

`python_app/services.py`：

- 关键词标准化：`normalize_keyword`
- canonical 聚合：`canonical_keyword`
- 聚类 key：`cluster_key`
- 去重：`dedupe`
- 评分引擎：`score_keyword`
- 推荐引擎：`recommendation`
- Mock collectors：Google Trends / Reddit / Product Hunt

---

## 5) 生产可演进方向（仍保持轻量）

你如果后续想继续“保持简单”，建议按下面顺序演进：

1. 把 SQLite 升级到 PostgreSQL（仅替换 DB 层）。
2. 把 mock collector 替换为真实采集脚本（同接口）。
3. 增加一个定时任务入口（cron 调 `POST /api/ingest/mock` 或单独脚本）。
4. 给登录、写接口加速率限制和审计日志。
5. 部署到最简单方案：一个 Python 容器 + 持久化卷。

---

## 6) 为什么这样改

相比之前 Next.js + Prisma 版本，这个版本：

- 更容易上手（纯 Python）
- 依赖更少（只需 Flask）
- 调试更直接（模板 + sqlite 文件）
- 仍保留了 SaaS MVP 的核心数据流（采集→标准化→评分→推荐→展示）

如果你愿意，我下一步可以继续把这套轻量版拆成：

- `app.py`（路由层）
- `repository.py`（数据访问层）
- `jobs.py`（采集任务层）

这样维护性会再提升，但不会引入复杂框架。
