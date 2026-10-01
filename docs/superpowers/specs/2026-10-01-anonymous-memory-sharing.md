# 匿名记忆书架海报分享（当前实现）

本文件替代 2026-09-30 的登录分享设计和计划。用户已确认分享者与访问者均无需登录。

## 使用流程

记忆书架 → 分享书架 → 确认全部照片公开 → 上传压缩副本 → 预览并保存 1080 × 1440 PNG 海报 → 微信扫码进入只读省份书架 → 选择城市和照片。

仅分享照片，不含视频、账号、本地路径或私有 OSS 地址。内容是生成时快照，新增照片不会自动公开；同一浏览器再次生成更新原链接。管理凭证保存在 `localStorage.memoryShelfShareManagement`，不进入二维码，清除浏览器数据后可能无法管理旧分享。

## 文件与接口

- `assets/memory-share.js`：最长边 900px / JPEG 0.7 压缩、匿名上传、海报生成、PNG 下载及二维码库本地加载。
- `assets/memory-share.css`：按钮、海报弹窗样式。
- `memory-share.html`：独立纸本只读书架，省份→城市→照片网格→全屏前后切换；不加载主应用、账号或 IndexedDB。
- `supabase/memory-shelf-share.sql`：快照与发布配额表，RLS 开启，撤销客户端直接访问。
- `supabase/functions/memory-shelf-share/`：`publish` 使用 256 位浏览器管理凭证，数据库只存 SHA-256；`read` 按随机 UUID 获取公开快照。服务端流式限制 12MB，并通过数据库唯一键限制每个来源每天 20 次发布。
- `validation.mjs`：清理未知字段，拒绝视频、外部图片地址；最多 34 省份、400 城市、1500 照片和 12MB。

为简化匿名流程，压缩照片副本直接保存在独立 JSON 快照中，不更改 OSS ACL，不使用 Supabase 匿名账号。超过上限明确失败，不截断内容；大书架以后需改为分文件对象存储。

## 部署与验证

2026-10-01 已在 `zpqbbawremufcxxszgde` 创建两表并部署 `memory-shelf-share` v1，`verify_jwt=false`，更新使用管理凭证鉴权。真实线上匿名发布/读取/错误凭证拒绝已通过，自动生成的测试快照已删除。

前端按用户确认改用现有 GitHub Pages，来源为 `main` 分支根目录。默认链接根地址是 `https://zwxll.github.io/Your-China-Travel/`；更换域名时设置 `TRAVEL_SUPABASE_CONFIG.shareBaseUrl`。必须先发布 `memory-share.html`、`assets/memory-share*`、`assets/vendor/qrcode*` 和更新的 `index.html`，等待部署成功，再进行实际微信扫码验收。

不创建 Sites 网站；GitHub Pages 部署不会上传工作区的 `1/`、`旅行资料/`，照片只在用户确认生成分享时上传到分享后端。

验证命令：`node --test tests/memory-share.spec.cjs tests/memory-share-browser.spec.cjs`；涵盖隐私字段清洗、非法媒体拒绝、数量限制、匿名生成、固定二维码、海报下载和手机只读浏览。
