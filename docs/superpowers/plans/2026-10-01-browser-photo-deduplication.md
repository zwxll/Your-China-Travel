# 匿名照片复用与管理分享 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 同一匿名浏览器的相同照片仅上传、计费一次；允许删除单份分享或清空全部云端分享，只有真实清理成功才释放 50MB 额度，不修改本地旅行资料。

**Architecture:** 在现有分享会话之上增加浏览器级照片登记和引用关系。SQL 事务负责授权、引用与容量；Edge Function 负责实际 Storage 上传、删除和旧分享迁移；前端沿用现有匿名凭证与分享选择流程。

**Tech Stack:** 原生 JavaScript、Supabase Edge Functions、PostgreSQL、私有 Supabase Storage、Node test runner、Playwright。

**Spec:** `docs/superpowers/specs/2026-10-01-browser-photo-deduplication-design.md`

## Global Constraints

- 只改分享相关文件；保留工作区已有的翻页、景点统计、photo-stream 和个人旅行资料修改。不得整文件覆盖或混入提交。
- 单选省份的稳定链接、多选/全选的独立链接、匿名身份、照片顺序和重复展示位置保持不变。
- 单浏览器 50,000,000 bytes、全局 800,000,000 bytes、现有每日生成限额保持不变；清理不能重置每日限额。
- SHA-256 基于实际压缩 JPEG 字节；仅同一 owner 的字节完全相同照片复用。封面与正文也可复用。
- 旧 v1/v2 二维码可读；数据库内部 v3 对外返回现有 v2 目录格式，不修改读者相册与翻页表现。
- 所有管理操作须验证匿名凭证；客户端不能提交可信 Storage 路径、容量值或其他用户 owner。
- 数据库使用既有锁序：全局容量 → 浏览器容量 → 按 hash 排序的照片；事务内不访问 Storage。
- 删除只针对云端副本。测试使用独立 JPEG fixtures；真实并发测试只能运行在显式声明的一次性数据库，拒绝生产项目。
- 本计划不授权删除线上现有分享、部署或推送。先本地实现和验证，再单独报告部署需求。

## Review Focus

1. 删除后迟到的 finish / migrate 是否复活旧二维码：任务 4 的 tombstone 测试覆盖。
2. 清空时上传仍在进行、删除失败或响应丢失是否虚假恢复容量：任务 2、4 的故障注入测试覆盖。
3. 旧分享迁移、共用文件及重复旧路径是否误删或少计容量：任务 3 的兼容性测试覆盖。
4. 缺失凭证、取消确认或清理失败是否影响本地资料与匿名身份：任务 5 的浏览器测试覆盖。
5. 并发相同照片是否重复预留；满额时纯复用是否被拒绝：任务 1 的真实数据库并发及任务 5 的客户端测试覆盖。

## 接口与数据约定

新增 `memory_share_dedup_transaction(p_action text, p_input jsonb)`，仅 service_role 可调用。沿用 `memory_share_sessions`，标记会话协议版本；旧 RPC 不允许继续写已迁移的会话。新客户端写请求携带 `protocolVersion: 3`，旧写客户端返回明确的刷新提示，旧读取不受影响。

- `memory_share_objects`：id、owner_id、sha256、bytes、storage_path、state、upload_session_id；state 为 pending / ready / deleting / deleted。活跃记录唯一 `(owner_id, sha256)`，并保存真实上传归属。删除中的照片不能新增引用。
- `memory_share_object_refs`：session_id、file_id、object_id，主键 `(session_id, file_id)`；object_id 外键建立索引。逻辑照片位置仍存目录，不能因复用而删掉展示位置。
- `memory_share_cleanup`：owner_id、真实路径、bytes、计入 used/reserved 的类型、关联 object/target、状态。仅用于本功能的可重试清理，含旧重复路径。
- `memory_share_revoked_targets`：target_id、owner_id、撤销时间。防止迟到请求重新发布已删除目标。
- `memory_share_capacity` 增加 clearing 状态；清空期间禁止新 begin / migrate / finish。已有上传可完成记账后进入清理，不能盲目抢占上传归属。

外部接口沿用 begin / upload / finish / cancel / quota / read / read-city，新增 migrate / list / revoke / clear / retry-cleanup。

- begin 返回 `{shareId, uploadedIds, reusedIds, newBytes}`；ready 照片无需上传。其他会话正在上传时返回可重试状态，不重复预留。
- finish 返回 `{shareId, cleanupPending}`；丢失响应后可幂等确认已发布。
- list 返回 `{shares, quota}`，每份含 shareId、published/draft、省份、照片数、更新时间和状态；quota 基于物理容量，不叠加每份逻辑照片字节。
- revoke / clear / retry-cleanup 返回 `{revokedIds, cleanupPending, freedBytes, quota}`；clear 还报告 clearing。只有实际删除完成才能 freedBytes 增加。
- migrate 每次处理一个文件，返回 `{shareId, done, processed, total, cleanupPending}`，进度存服务端，可重试；不暴露管理密钥或真实路径。

### Task 1：共享文件模型与事务

**Files:** 新增 `supabase/memory-shelf-dedup.sql`、`tests/memory-share-dedup.integration.spec.cjs`；扩展 `supabase/functions/memory-shelf-share/storage-validation.mjs` 及其测试。

- [ ] 先写失败测试：同 owner 相同 hash 只预留一次、其他 owner 不复用、不同字节不合并、相同照片不同展示位置保留。
- [ ] 新增 `sanitizeDedupManifest`，对 fileId 到共享照片的映射去重，按唯一字节总量检查 50MB；沿用文字、JPEG、数量验证。不接受客户端路径。
- [ ] 添加上述表、索引、RLS、最小权限与 v3 RPC。沿用已有全局计数，不重新初始化或凭空归零。
- [ ] 实现 begin、upload-start/done/failed、finish、cancel 的数据库阶段；上传完成或失败响应重试不重复扣费。
- [ ] 用独立数据库真实连接并发验证相同 hash 与不同 hash，确认无超额、重复预留、负数；没有测试环境时明确标记未验证，不用内存 mock 替代并发证据。
- [ ] 验证：`node --test tests/memory-share-dedup.integration.spec.cjs` 及验证模块测试。集成测试沿用 DISPOSABLE=yes 和生产项目拒绝检查。
- [ ] 单独提交本任务相关文件：`feat: add browser-scoped shared photo registry`。

### Task 2：上传、读取与实际清理

**Files:** 新增 `supabase/functions/memory-shelf-share/dedup-handler.mjs`、`tests/memory-share-dedup-handler.spec.cjs`；修改该函数的 `index.ts`、`storage-handler.mjs`（仅路由/兼容部分）。

- [ ] 先写失败测试：纯复用没有 Storage upload；新文件一次上传；上传成功但登记响应丢失可恢复；Storage remove 失败不释放容量。
- [ ] 实现 `handleDedupAction(input, db, sourceHash)`，使用既有 ShareError。index 按协议分发，并禁止旧协议的破坏性写入触碰 v3。
- [ ] 上传由 SQL 独占归属授权，仍以实际下载校验恢复重复对象；禁止以客户端声明的 hash 直接标记 ready。
- [ ] 清理先事务标记 deleting，再事务外删除真实路径，最后确认释放计数；失败保留记录与额度，可重试。删除不影响仍有有效引用的照片。
- [ ] v3 读取根据对象引用签名，返回现有 v2 reader 结构；read-city 保持照片顺序及名称。v1/v2 原读取保持兼容。
- [ ] 验证：`node --test tests/memory-share-dedup-handler.spec.cjs tests/memory-share-storage-handler.spec.cjs tests/memory-share-storage-reader.spec.cjs`。
- [ ] 单独提交：`feat: reuse uploaded photos across share links`。

### Task 3：旧分享安全迁移

**Files:** 新增 `supabase/functions/memory-shelf-share/legacy-migration.mjs`、`tests/memory-share-dedup-migration.spec.cjs`；修改新 RPC 与 dedup-handler。

- [ ] 先写失败测试：错误旧管理凭证不能认领、迁移中旧二维码可读、空间不足/中断不覆盖旧快照、重复旧路径实际删除前仍计费。
- [ ] 验证浏览器身份与原分享管理凭证后认领。服务器验证旧 v2 文件真实字节/hash，再选择原路径或已存在对象作为 canonical，不复制无需复制的照片。
- [ ] v1 使用原嵌入 JPEG 字节逐个导入，不再次压缩；导入新增占用必须同时遵守浏览器和全局额度。
- [ ] 所有照片就绪后原 shareId 原子切换到 v3；此前旧目录保持完整。旧重复路径进入清理，成功删除后才释放占用。
- [ ] 迁移步骤持久化并校验原快照版本，避免迟到迁移覆盖用户后续更新；可重复请求，不重新上传完成文件。
- [ ] 验证：`node --test tests/memory-share-dedup-migration.spec.cjs`，并在一次性数据库覆盖 v1/v2 迁移的计数变化。
- [ ] 单独提交：`feat: migrate existing shares without changing QR links`。

### Task 4：管理分享后端

**Files:** 修改 `supabase/memory-shelf-dedup.sql`、dedup-handler；新增 `tests/memory-share-management.spec.cjs`，扩展真实数据库测试。

- [ ] 先写失败测试：删浙江分享但合并分享仍引用照片时不释放；最后引用删除成功才释放；删除后迟到 finish/migrate 被拒绝。
- [ ] list 只返回当前 owner 已认领的分享和草稿，不要求客户端列举全部 shareId；对未认领的旧内容不声称已管理或清空。
- [ ] revoke 原子撤销目标及其更新/迁移草稿、记录 tombstone、移除引用；原链接的新 read/read-city 立即失败。v1 直接撤销快照，不为删除先迁移上传。
- [ ] clear 设置持久 clearing 屏障并撤销全部目标、草稿和遗留待清理路径；处理在途上传结算后清理。只有 used/reserved 都为零且无待清理才完成并解除屏障。
- [ ] retry-cleanup 可重复执行；清理失败报告“链接已失效，文件待清理，容量暂时保留”。已签发的临时文件 URL 或别人下载的照片不能承诺立即收回。
- [ ] 验证删除中断、网络响应丢失、重复清空、另一个 owner 不受影响及每日生成计数不重置。
- [ ] 验证：`node --test tests/memory-share-management.spec.cjs tests/memory-share-dedup.integration.spec.cjs`。
- [ ] 单独提交：`feat: revoke shares and reclaim unreferenced storage`。

### Task 5：前端复用与管理入口

**Files:** 修改 `assets/memory-share.js`、`assets/memory-share.css`、`index.html`（仅分享入口）；新增 `tests/memory-share-management-browser.spec.cjs`，扩展 browser/selection 测试。

- [ ] 先写失败测试：满额但全复用仍可分享；浙江10MB再浙江+江苏8MB只新上传8MB；单选、多选、全选及照片展示顺序保留。
- [ ] 前端压缩后计算 hash，复用照片 fileId，删除按完整 manifest 字节与剩余额度比较的前置拒绝；由 begin 的 newBytes 判定新增容量。
- [ ] 扫描 `memoryProvinceShareManagement:*` 和 `memorySelectedShareManagement:*`，先认领旧凭证，再分步迁移；保持单省稳定 target 与多选独立 target 规则。
- [ ] 导出 `MemoryShelfShare.manage()`；在分享附近加入流式按钮组，桌面不挡标题/关闭按钮，375px 下可换行。不修改相册阅读布局。
- [ ] 弹窗显示分享/草稿、已用/预留/剩余容量、删除单份与清空全部；确认文字明确二维码失效、仅云端、不影响本地，取消不发送删除请求。
- [ ] 清理失败保持可重试，不显示额度已恢复。只在确认撤销后移除对应本地分享管理缓存；始终保留匿名身份、IndexedDB、本地照片和文件夹。
- [ ] 已删除省份再次分享生成新 target；无凭证显示友好空状态，不要求账号登录。
- [ ] 浏览器验证 375px/桌面按钮无重叠、键盘焦点与关闭、加载/失败/重试状态、取消无写请求和本地资料前后完全相同。
- [ ] 验证：`node --test tests/memory-share-management-browser.spec.cjs tests/memory-share-browser.spec.cjs tests/memory-share-selection.spec.cjs`。
- [ ] 仅暂存 index.html 的入口相关 hunk；单独提交：`feat: add anonymous cloud share management`。

### Task 6：整体验收与交接

**Files:** 更新设计状态与项目现有分享部署/交接文档，不修改无关文档。

- [ ] 运行 `node --test tests/memory-share*.spec.cjs` 与 `git diff --check`；列明真实并发测试是否运行及所有 skip 的原因。
- [ ] 复查五个 Review Focus，对每项给出测试名和结果；验证旧 v1/v2 链接响应兼容且 reader/550ms 翻页无回归。
- [ ] 复查所有 SQL 权限、Storage 路径来源、跨 owner 拒绝、容量释放依据与管理凭证不会进入 UI/日志。
- [ ] 使用 requesting-code-review 技能完成整项审核，再用 verification-before-completion 技能基于实际输出交付；不把 mock 结果称为线上验证。
- [ ] 更新交接记录：新增 SQL 安装顺序、函数与前端版本门禁、迁移/清理失败处理、回滚注意事项。不得简单回退到会整目录删除共用文件的旧函数。
- [ ] 交付本地结果与未验证项。经用户明确要求部署后，先应用数据库，再部署兼容函数，最后推送前端并验证 Pages；不拿用户现有分享做破坏性验收。

## 执行方式

执行记录（2026-10-01）：用户选择在当前目录 Native 执行，不创建工作树。任务 1–5 的本地功能已实现，SQL 关联部分合并实施以避免不安全中间版本；任务 6 的全量测试、独立审查及交接已完成。全项目 49 项测试：47 通过、2 项真实 Supabase 环境测试跳过、无失败。部署和推送尚未执行；真实多连接、线上 Storage 及微信真机验收仍待部署阶段进行。

建议 Native Execution：在当前对话顺序执行并逐任务验证；SQL、上传、迁移和清理的接口高度关联，不适合同时修改。也可经用户选择后使用分任务代理执行，仍遵循上述依赖顺序和整体验证。
