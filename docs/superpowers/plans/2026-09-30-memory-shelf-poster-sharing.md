# 记忆书架海报分享 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 为已登录用户生成包含二维码的记忆书架海报，并让任何扫码访客无需登录即可浏览生成时的只读照片书架快照。

**Architecture:** 保持现有单文件前端和私有 OSS；新增一张每用户一行的分享快照表及一个 Supabase Edge Function。发布端把现有记忆书架转换成最小快照，公开读取端只为快照内的用户 OSS 对象签发短时 URL，前端通过 `?memoryShare=<share-id>` 复用现有书架阅读界面。

**Tech Stack:** 原生 HTML/CSS/JavaScript、Canvas、qrcodejs 1.0.0、Node.js `node:test`、Supabase PostgreSQL/RLS、Supabase Edge Functions（Deno/TypeScript）、私有阿里云 OSS

**Spec:** `docs/superpowers/specs/2026-09-30-memory-shelf-poster-sharing-design.md`

## Global Constraints

- 用户界面只有“分享书架 → 预览海报 → 保存海报”，不增加密码、有效期或令牌管理界面。
- 一次分享整个书架，只包含照片；视频必须排除。
- 每个用户只有一个稳定 `share_id`，再次生成海报只覆盖快照，旧二维码继续有效。
- 访客无需登录，但始终只读；不得触发访问者的 IndexedDB、本地文件夹或账号数据加载。
- OSS Bucket 保持私有，公开访问只通过 Edge Function 返回的短时签名 URL。
- 不重构 `index.html`，只在现有记忆书架与云端辅助函数附近做外科手术式修改。
- 不修改或恢复当前工作树中与本功能无关的已删除文件和未跟踪旅行资料。

## Review Focus

- URL 中 `memoryShare` 缺失、格式非法或数据库无记录时，必须显示分享失效状态，不能加载本机书架。
- 发布快照含其他用户路径、Data URL、视频或超限照片时，Edge Function 必须拒绝或清理，绝不能签名越权路径。
- 用户照片尚未同步到 OSS 时，必须先同步成功再发布，不能生成指向残缺快照的二维码。
- QR 依赖或 Canvas 导出失败时，页面必须保留可复制的公开链接与明确错误，不得下载空白文件。
- 分享模式下通过键盘、深层事件或空状态都不能进入编辑、删除、登录和城市管理流程。

---

### Task 1: 分享表和 Edge Function 安全边界

**Files:**
- Modify: `supabase-setup.sql`
- Create: `supabase/functions/memory-shelf-share/index.ts`
- Create: `supabase/functions/memory-shelf-share/index.test.ts`

**Interfaces:**
- Consumes: `SUPABASE_URL`、`SUPABASE_ANON_KEY`、`SUPABASE_SERVICE_ROLE_KEY`、`ALIYUN_OSS_*` 环境变量和前端 `MemoryShelfShareSnapshot` JSON。
- Produces: `POST {action:'publish',snapshot}` → `{shareId}`；`POST {action:'read',shareId}` → `{snapshot}`，其中照片和封面路径已经替换为短时 HTTPS URL。

- [ ] **Step 1: 写失败的 Edge Function 单元测试**

在 `index.test.ts` 覆盖：`sanitizeSnapshot(snapshot,userId)` 排除视频/Data URL/未知字段；`ownsSharePath(path,userId)` 只接受 `users/<userId>/...`；快照外路径不能进入签名列表；省份、城市、照片数量上限会返回验证错误。

- [ ] **Step 2: 运行测试并确认失败**

Run: `deno test supabase/functions/memory-shelf-share/index.test.ts`

Expected: FAIL，原因是模块或导出函数尚不存在。

- [ ] **Step 3: 增加最小数据库结构**

在 `supabase-setup.sql` 新增 `public.memory_shelf_shares(user_id,share_id,snapshot,created_at,updated_at)`；启用 RLS，撤销 `anon`/`authenticated` 全部权限，不添加公开 SELECT 策略。

- [ ] **Step 4: 实现 Edge Function**

在 `index.ts` 导出 `ownsSharePath(path:string,userId:string):boolean` 和 `sanitizeSnapshot(snapshot:unknown,userId:string):MemoryShelfShareSnapshot`。`publish` 用登录令牌确定用户并 upsert；`read` 只按 UUID `shareId` 查询，用服务端已保存路径生成 300 秒 OSS GET URL。CORS 仅允许 `https://zwxll.github.io` 与 `http://127.0.0.1:8765`。

- [ ] **Step 5: 运行单元测试**

Run: `deno test supabase/functions/memory-shelf-share/index.test.ts`

Expected: PASS。

- [ ] **Step 6: 运行 Supabase 安全检查**

Run: `supabase db advisors`

Expected: 新表没有缺失 RLS、匿名公开策略或 `SECURITY DEFINER` 风险；若本机 CLI 不可用，记录为部署前人工检查项，不伪报通过。

- [ ] **Step 7: 提交本任务**

```bash
git add supabase-setup.sql supabase/functions/memory-shelf-share/index.ts supabase/functions/memory-shelf-share/index.test.ts
git commit -m "feat: add memory shelf sharing backend"
```

### Task 2: 生成最小书架快照并读取公开分享

**Files:**
- Modify: `index.html`（云端辅助函数、记忆书架初始化和公开分享启动分支）
- Modify: `supabase-config.js`
- Create: `tests/memory-shelf-share.spec.cjs`

**Interfaces:**
- Consumes: Task 1 的 `publish`/`read` 接口；现有 `buildCloudSnapshot()`、`collectMemoryShelfData()`、`renderMemoryShelf()`、`memoryOpenChapters()`、`memoryOpenAlbum()`。
- Produces: `buildMemoryShelfShareSnapshot(): Promise<MemoryShelfShareSnapshot>`、`publishMemoryShelfShare(): Promise<string>`、`loadMemoryShelfShare(shareId:string): Promise<MemoryShelfShareSnapshot>`、`isMemoryShelfShareMode():boolean`。

- [ ] **Step 1: 写失败的 Node 测试**

在 `tests/memory-shelf-share.spec.cjs` 用现有源码切片 + `vm` 模式断言：构建结果只含照片 OSS 路径且不含 `dataUrl`、邮箱和视频；未登录拒绝发布；`memoryShare` 模式不会调用本地 `refreshState()`；无效分享显示分享失效状态。

- [ ] **Step 2: 运行测试并确认失败**

Run: `node --test tests/memory-shelf-share.spec.cjs`

Expected: FAIL，原因是分享函数尚不存在。

- [ ] **Step 3: 固定正式分享根地址**

在 `supabase-config.js` 的公开配置增加 `shareBaseUrl:'https://zwxll.github.io/Your-China-Travel/'`；二维码 URL 固定为该地址加 `?memoryShare=<share-id>`，不得从 `file://` 或 localhost 推导正式链接。

- [ ] **Step 4: 实现快照发布函数**

在 `index.html` 云端辅助函数附近实现四个已定义接口。`buildMemoryShelfShareSnapshot()` 先完成现有云同步，再从 IndexedDB 元数据和 OSS `storagePath` 组装版本 1 快照；遇到未上传照片、空书架或视频时按规格处理。`publishMemoryShelfShare()` 只在已登录状态调用 Edge Function。

- [ ] **Step 5: 实现公开分享启动分支**

页面启动时优先检测 `memoryShare`。命中时调用 `loadMemoryShelfShare()`，把数据适配为现有 `memoryShelfState.provinces` 后直接打开记忆书架；设置 `body.memory-share-mode`，禁止执行本地资料恢复和账号态写操作，并移除所有编辑入口。

- [ ] **Step 6: 运行测试**

Run: `node --test tests/memory-shelf-share.spec.cjs tests/logout-choice.spec.cjs`

Expected: 全部 PASS，退出登录既有行为没有回归。

- [ ] **Step 7: 提交本任务**

```bash
git add index.html supabase-config.js tests/memory-shelf-share.spec.cjs
git commit -m "feat: add read-only memory shelf sharing"
```

### Task 3: 分享海报和二维码交互

**Files:**
- Modify: `index.html`（固定版本 QR 脚本、分享按钮、海报弹窗、Canvas 绘制及样式）
- Modify: `tests/memory-shelf-share.spec.cjs`

**Interfaces:**
- Consumes: Task 2 的 `publishMemoryShelfShare()` 和配置中的 `shareBaseUrl`。
- Produces: `openMemoryShelfSharePoster():Promise<void>`、`drawMemoryShelfPoster(snapshot:MemoryShelfShareSnapshot,shareUrl:string):Promise<HTMLCanvasElement>`、`downloadMemoryShelfPoster(canvas:HTMLCanvasElement):void`。

- [ ] **Step 1: 扩展失败测试**

断言正常模式存在“分享书架”按钮，公开分享模式不渲染该按钮；海报尺寸为 `1080 × 1440`；分享 URL 被传入 QR 生成器；下载文件名为 `旅行记忆书架.png`；QR 或 Canvas 失败时仍显示可复制链接。

- [ ] **Step 2: 运行测试并确认失败**

Run: `node --test tests/memory-shelf-share.spec.cjs`

Expected: FAIL，原因是海报接口或 DOM 尚不存在。

- [ ] **Step 3: 增加分享按钮和海报弹窗**

在记忆书架顶栏加入“分享书架”，在关闭按钮左侧布局且不遮挡标题。弹窗只含进度、海报预览、公开链接、“保存海报”和“关闭”；公开分享模式通过 CSS 和渲染条件双重隐藏入口。

- [ ] **Step 4: 实现二维码和 Canvas 海报**

固定加载 `qrcodejs@1.0.0`。`drawMemoryShelfPoster()` 使用项目纸张色、书脊配色、最多 6 张代表封面及省份/城市/照片统计，绘制清晰二维码和“微信扫码 · 翻阅我的旅行记忆”；所有远程图片设置跨域并在绘制前完成加载。

- [ ] **Step 5: 实现保存与失败降级**

优先用 `canvas.toBlob()` 下载 PNG；失败时显示公开链接及“复制链接”，不触发空文件下载。重复点击分享时禁用按钮，防止并发覆盖和重复上传。

- [ ] **Step 6: 运行测试**

Run: `node --test tests/memory-shelf-share.spec.cjs tests/logout-choice.spec.cjs`

Expected: 全部 PASS。

- [ ] **Step 7: 提交本任务**

```bash
git add index.html tests/memory-shelf-share.spec.cjs
git commit -m "feat: generate memory shelf sharing poster"
```

### Task 4: 部署说明与端到端验收

**Files:**
- Modify: `README.md`
- Modify: `项目交接文档.md`

**Interfaces:**
- Consumes: Tasks 1-3 的数据库、Edge Function、公开 URL 和海报 UI。
- Produces: 可复现的部署步骤、回滚边界和验收记录。

- [ ] **Step 1: 更新部署文档**

记录运行 `supabase-setup.sql`、部署 `memory-shelf-share`、配置所需 secrets、保持 OSS 私有、GitHub Pages 正式分享根地址以及分享内容公开可见的隐私提示。

- [ ] **Step 2: 运行自动化回归**

Run: `node --test tests/*.spec.cjs`

Expected: 全部 PASS。

- [ ] **Step 3: 本地 HTTP 手工验收**

Run: `python -m http.server 8765`

依次验证：登录用户生成海报；PNG 尺寸与二维码清晰；无痕窗口打开分享链接；省份→城市→照片册→全屏照片可用；分享模式无编辑入口；再次生成后同一 URL 显示新快照；手机窄屏没有按钮重叠。

- [ ] **Step 4: 线上验收**

部署 SQL 与 Edge Function 后推送 GitHub Pages，在微信内扫码测试正式 URL。确认照片可加载、页面无需登录、OSS ACL 仍为私有，并记录失败时的 Edge Function 日志。

- [ ] **Step 5: 提交文档**

```bash
git add README.md 项目交接文档.md
git commit -m "docs: document memory shelf poster sharing"
```

## Self-Review Result

- Spec coverage：海报、二维码、整书架快照、匿名只读浏览、重复生成覆盖、排除视频和私有 OSS 均有对应任务。
- Step scan：每个实现步骤只负责一个可验证结果，未包含与本功能无关的重构。
- Type consistency：`MemoryShelfShareSnapshot`、`shareId`、`memoryShare` 查询参数和四个前端接口在任务间保持一致。
- Review Focus：五项高风险条件分别落入 Tasks 1-3 的自动化测试和 Task 4 的端到端验证。
- Proportion：计划沿用现有单页结构，只新增一个表、一个 Edge Function、一个测试文件和两处文档更新。
