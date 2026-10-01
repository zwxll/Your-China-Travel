# 匿名记忆书架海报分享（当前实现）

> 最新调整：用户确认不再分享整个书架。省份信息的「编辑」旁新增「分享」，移除顶部整架分享按钮；仅提交一个省份的城市、照片和封面。各省使用 `localStorage` 键 `memoryProvinceShareManagement:省份名` 保存独立管理凭证，重复分享更新本省链接，不覆盖其他省份。旧整架凭证和旧分享不删除、不自动迁移。海报标题显示该省名称；12 MiB 上限按单省计算。用户已要求将省份分享、超时修复和只读书本相册一并发布至现有 GitHub Pages；部署是否成功以对应发布任务及线上检查为准。

本文件替代 2026-09-30 的登录分享设计和计划。用户已确认分享者与访问者均无需登录。

## 只读分享页的书本相册

分享页不再将城市照片全部平铺；选择城市后打开纸本相册，保留城市封面和封底。照片分组与原记忆相册一致：首个跨页为城市简介与首图；后续通常每跨页三张，最后一组最多五张，按原规则分配左右页。每页支持单图、双图和四图；双竖图并排，其他双图上下排列。复用相册技能的 PageFlip HTML 运行时（`assets/vendor/page-flip.browser.js`，MIT 许可随文件附带），匹配主项目米色纸张、页边和装订阴影。手机窄屏单页，可左右滑动和拖动纸页；电脑宽屏双页。提供上一页、下一页、页码和键盘方向键，点击任意照片仍可放大查看。切换城市或返回书架会销毁当前阅读器；暂无照片的城市显示说明。访客始终只读，无登录、编辑或上传入口。

文件：`assets/memory-share-reader.js`、`assets/memory-share-reader.css`、`memory-share.html`，连同 `assets/vendor/page-flip*` 一并发布。回归测试：`node --test tests/memory-share-reader.spec.cjs`，覆盖本地入口、移动端滑动、按钮翻页、城市切换、空相册、照片放大与电脑双页布局。微信内仍需真机验收。原分享 ID 和链接不变，无需重新生成二维码。

## 使用流程

记忆书架 → 选中省份 → 省份信息旁点击分享 → 确认本省照片公开 → 上传压缩副本 → 预览并保存 1080 × 1440 PNG 海报 → 微信扫码进入只读省份书架 → 选择城市 → 滑动翻阅照片册。

仅分享照片，不含视频、账号、本地路径或私有 OSS 地址。内容是生成时快照，新增照片不会自动公开；同一浏览器再次生成更新本省原链接。各省管理凭证不进入二维码，清除浏览器数据后可能无法管理旧分享。历史整架凭证 `localStorage.memoryShelfShareManagement` 保留，不用于新省份分享。

## 文件与接口

- `assets/memory-share.js`：最长边 900px / JPEG 0.7 压缩、匿名上传、海报生成、PNG 下载及二维码库本地加载。
- `assets/memory-share.css`：按钮、海报弹窗样式。
- `memory-share.html`：独立纸本只读书架，省份→城市→翻页相册→照片放大；不加载主应用、账号或 IndexedDB。
- `supabase/memory-shelf-share.sql`：快照与发布配额表，RLS 开启，撤销客户端直接访问。
- `supabase/functions/memory-shelf-share/`：`publish` 使用 256 位浏览器管理凭证，数据库只存 SHA-256；`read` 按随机 UUID 获取公开快照。服务端流式限制 12MB，并通过数据库唯一键限制每个来源每天 20 次发布。
- `validation.mjs`：清理未知字段，拒绝视频、外部图片地址；最多 34 省份、400 城市、1500 照片和 12MB。

为简化匿名流程，压缩照片副本直接保存在独立 JSON 快照中，不更改 OSS ACL，不使用 Supabase 匿名账号。超过上限明确失败，不截断内容；大书架以后需改为分文件对象存储。

## 部署与验证

2026-10-01 已在 `zpqbbawremufcxxszgde` 创建两表并部署 `memory-shelf-share` v1，`verify_jwt=false`，更新使用管理凭证鉴权。真实线上匿名发布/读取/错误凭证拒绝已通过，自动生成的测试快照已删除。

前端按用户确认改用现有 GitHub Pages，来源为 `main` 分支根目录。默认链接根地址是 `https://zwxll.github.io/Your-China-Travel/`；更换域名时设置 `TRAVEL_SUPABASE_CONFIG.shareBaseUrl`。必须先发布 `memory-share.html`、`assets/memory-share*`、`assets/vendor/qrcode*` 和更新的 `index.html`，等待部署成功，再进行实际微信扫码验收。

不创建 Sites 网站；GitHub Pages 部署不会上传工作区的 `1/`、`旅行资料/`，照片只在用户确认生成分享时上传到分享后端。

验证命令：`node --test tests/memory-share.spec.cjs tests/memory-share-browser.spec.cjs`；涵盖隐私字段清洗、非法媒体拒绝、数量限制、匿名生成、固定二维码、海报下载和手机只读浏览。

## 生成等待修复

书架标题下方直接显示照片读取、整理、上传、海报生成进度和失败原因。城市照片读取限时 10 秒、图片加载 20 秒、分享接口（含响应读取）60 秒；接口超时会取消请求，按钮恢复后可再次点击重试。二维码加载限时 15 秒；外部字体等待超过 3 秒则使用当前字体继续生成。失败信息保留在书架中，避免短暂通知消失后无法判断原因。

回归测试：`node --test tests/memory-share-timeout.spec.cjs`。本地 `file://` 生成、海报保存及只读浏览也已使用模拟分享接口验证，不读取或公开个人旅行资料。
