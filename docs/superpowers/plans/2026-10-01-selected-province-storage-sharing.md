# 自选省份匿名分享 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task in the current session. Steps use checkbox syntax for tracking. Do not delegate implementation without user authorization.

**Goal:** 单选、多选或全选省份后分文件上传，生成一个可匿名浏览的书架二维码，匿名浏览器累计限制 50 MB、全站限制 800 MB。

**Architecture:** 在既有分享函数上增加匿名配额、上传会话和私有 Storage 文件。数据库事务预留容量，上传仅写会话指定文件，发布完整目录后才开放只读浏览。沿用旧分享读取及现有 PageFlip 相册。

**Tech Stack:** 原生 JavaScript/CSS、Postgres、Supabase Edge Functions（Deno）、固定版本 supabase-js、Node test、Playwright Chrome。

**Spec:** `docs/superpowers/specs/2026-10-01-selected-province-storage-sharing-design.md`

**本地实施状态（2026-10-01）**：任务 1–4 的代码及本地校验/浏览器回归已实现。任务 1 真实 PostgreSQL 集成用例已编写，但无独立测试库而跳过；SQL 并发/权限/迁移与 advisors 尚未验证。任务 5 本地全套 27 通过、0 失败、1 跳过，超过 12MiB 两省/一个二维码端到端测试通过，手机/电脑截图检查完成，交接已更新。最终只读审查发现的响应丢失恢复与 JPEG 组件校验问题已修复并回归。没有 Supabase 部署、个人图片上传、GitHub 推送或套餐升级。下面的复合步骤清单保留原验收范围，不能将线上未验内容标成完成。

实现差异：数据库统一为 service_role 独占 `memory_share_transaction(action,input)`，取代重复包装的 RPC；Edge Function action 不变。请求体上限收紧为 2MiB。全组织初始其他项目 Storage 必须由管理员核对并计入全站行，安装脚本不能跨项目自行扫描。

## Global Constraints

- 上传者与访客均无需登录；匿名 ID 和私有 256 位凭证保存在 localStorage，凭证不能进入海报或 URL。
- 每个匿名浏览器所有分享与草稿累计最大 50,000,000 字节；全站累计最大 800,000,000 字节；按实际 JPEG 字节计量，包含封面。
- 最多 34 省、400 城、1500 张照片；单张 JPEG 最大 300 KiB；压缩保持当前最长边 900px、质量 0.7。
- 图片逐文件上传，不通过解除旧 JSON 12 MiB 限制来解决；服务器验证额度，事务处理并发。
- 首尾摄影封面、多图布局、550ms 跟手翻页和旧二维码只读兼容。
- 单省分享原链接更新行为保留；多选生成独立链接，不覆盖旧单省二维码。
- 不读取或上传个人资料作测试，不提交 `1/`、`旅行资料/` 和照片流无关修改。
- 本计划只许可本地实现与验证；线上数据库、函数部署及 GitHub 发布单独确认，不自动升级套餐。

## Review Focus

1. Storage 写入成功、数据库登记失败：预留不能提前释放，否则实际空间被漏算（任务 2）。
2. 两个窗口同时上传最后一点容量：至少一个应明确拒绝，浏览器与全站总量均不超额（任务 1）。
3. 快速切换城市、旧签名过期：不呈现上一城市的照片，重新进入可刷新链接（任务 4）。
4. 同一省已有旧分享与新多选：有管理密钥才能归属，更新不影响其他省份二维码（任务 2、3）。
5. localStorage 无法保存、照片有视频或空省份：上传前明确失败或排除，不产生无法管理的分享（任务 3）。

## Task 1: 文件清单校验与事务配额

**Files:** 修改 `supabase/functions/memory-shelf-share/validation.mjs`；新增 `supabase/functions/memory-shelf-share/storage-validation.mjs`、`supabase/memory-shelf-storage.sql`、`tests/memory-share-storage.spec.cjs`、`tests/memory-share-quota.integration.spec.cjs`。

**Interfaces:**
- `sanitizeManifest(value, shareId)` 返回 `{version:2,provinces:[{name,review,coverId,cities:[{name,description,firstMonth,photos:[{name,fileId}]}]}],files:[{fileId,bytes,sha256}],totalBytes}`；只白名单字段，照片与封面 ID 必须引用清单，拒绝任意对象路径、URL 和视频。
- `validateJpeg(dataUrl)` 返回 `{bytes:Uint8Array,sha256:string}`，验证 JPEG 结构、实际长度及 300 KiB 上限，不信任 MIME 声明或清单字节数。
- `memory_share_reserve(browser_id, browser_hash, share_id, management_hash, manifest, source_hash)` 返回会话及已用/预留；`memory_share_mark_uploaded(share_id,file_id,sha256,bytes)`、`memory_share_finish(share_id)` 和 `memory_share_cancel(share_id)` 为 service_role 独占调用的事务函数。
- 会话数据含 owner_id、manifest、管理哈希、state（draft/published/cancelled）、last_active；浏览器/global 配额表存实际已用与预留；文件表主键 `(share_id,file_id)`。

- [ ] 编写清单测试：2 个省份可通过、未知隐私字段剔除、35 省拒绝、路径穿越拒绝、文件引用缺失拒绝、JPEG 伪装及超过 307200 字节拒绝。运行 `node --test tests/memory-share-storage.spec.cjs`，确认缺少新校验实现而失败。
- [ ] 实现两个校验函数；运行上述命令确认通过，保留旧 version:1 测试。
- [ ] 编写真实测试数据库配额集成测试（由明确的测试环境变量启用，默认跳过且报告未验）：已用 49,999,900 加 100 成功、再加 1 失败；全站已用 799,999,900 的两个并发 100 字节请求只有一个成功；错误浏览器凭证拒绝；重复 reserve 不重扣额度。先在独立测试库确认缺少结构而失败，不用线上个人分享测试。
- [ ] 写可重复执行的 SQL 配置及事务函数，按统一顺序锁 global 行再锁 browser 行；reserve 事务检查后记录文件清单与预留，finish 移动预留到已用但总占用不变。所有表 RLS 开启，撤销 anon/authenticated；函数默认 PUBLIC 执行权限撤销，仅授予 service_role。不以 SECURITY DEFINER 绕过权限。
- [ ] 私有 bucket `memory-share-photos` 设置允许 JPEG 和 300 KiB 文件上限，不开放匿名直接写入；bucket 配置和测试库配置纳入任务的验证步骤。不能仅靠模拟计数器声称 SQL 并发验证成功。
- [ ] 运行校验和独立数据库测试；可用时检查数据库 advisors。仅提交本任务文件。

## Task 2: 后端上传、发布及兼容读取

**Files:** 修改 `supabase/functions/memory-shelf-share/index.ts`；新增 `supabase/functions/memory-shelf-share/storage-handler.mjs`、`tests/memory-share-storage-handler.spec.cjs`。

**Interfaces:** `handleStorageAction(input, db)` 由 Edge Function 分派，db 为实际 Supabase client；只通过正常接口依赖注入作测试，不增加测试专用生产方法。

- `quota` 输入 `{browserId,browserKey}`，返回 `{browserUsed,browserReserved,browserLimit,globalUsed,globalReserved,globalLimit}`。
- `begin` 输入 `{browserId,browserKey,shareId,managementKey,manifest}`，返回 `{shareId,uploadedIds}`。
- `upload` 输入 `{shareId,managementKey,fileId,dataUrl}`，返回 `{fileId,bytes}`；文件路径服务端固定为 `shareId/fileId.jpg`。
- `finish` 输入 `{shareId,managementKey}`，返回 `{shareId}`；未登记齐全时拒绝。
- `cancel` 输入 `{shareId,managementKey}`，仅取消草稿；先确认 Storage 删除完成，再释放预留，不取消 published 分享。
- `claim` 输入 `{browserId,browserKey,shareId,managementKey}`，凭原分享管理密钥归属旧份额；错误凭证拒绝，重复 claim 幂等，已被其他浏览器归属不可转移。
- `read` 旧格式不变，新格式返回仅含省份/城市目录、照片计数和封面 `dataUrl`（短期签名地址）的 snapshot。
- `read-city` 输入 `{shareId,provinceIndex,cityIndex}`，返回 `{chapter:{name,description,firstMonth,photos:[{name,dataUrl}]}}`；签名有效期 3600 秒，永久目录只保存对象路径。

- [ ] 编写真实 handler 边界测试：未完成读请求返回不可用；篡改文件编号/凭证/摘要拒绝；重传同文件不增容量；不同内容同编号拒绝；上传完成但标记故障保持预留；取消删除失败不释放；finish 幂等；旧 read 可用；旧 publish 返回升级提示；目录外城市请求拒绝。执行 `node --test tests/memory-share-storage-handler.spec.cjs`，观察预期失败。
- [ ] 实现 action handler。每次 upload 的实际 bytes/hash 与服务端会话清单一致，Storage 禁止覆盖；already exists 仅在校验已有对象匹配清单后承认重试，不能把任意冲突当成功。
- [ ] 单省更新用新草稿 shareId 写入文件，finish 后在事务中替换原公开 shareId 的目录，原管理密钥必须匹配；重试 finish 无副作用。旧文件在成功替换之后才删除，删除失败保留占用供维护清理，不能提前释放。预留计算包括更新期间的临时双份占用，空间不足明确提示。
- [ ] 新版 quota/claim 不能泄露管理哈希，所有异常消息剔除数据库内部信息。保留可信来源的原发布次数限制；不信任客户端传入 source_hash。
- [ ] 运行 handler 与旧只读校验测试。修改旧 publish 测试的预期为升级提示，不放松旧图片外链限制。仅提交任务文件。

## Task 3: 单选、多选、全选及上传海报

**Files:** 修改 `assets/memory-share.js`、`assets/memory-share.css`、`index.html` 的记忆书架分享入口；新增 `tests/memory-share-selection.spec.cjs`，更新 `tests/memory-share-browser.spec.cjs`、`tests/memory-share-timeout.spec.cjs`。

**Interfaces:** `MemoryShelfShare.select(provinces,getPhotos,onProgress)` 打开选择弹窗；`MemoryShelfShare.create(selected,getPhotos,onProgress)` 使用任务 2 API；`getPhotos(city)` 沿用当前 `getPhotosByCity(city.cityKey)`，不修改照片流。

- [ ] 编写浏览器测试：默认未选、单选一省、多选两省、全选全部有照片省份、取消全选、空省禁选、零选择禁提交、取消无上传。至少 3 个省份，断言未选省份不在真实请求清单中。运行 `node --test tests/memory-share-selection.spec.cjs` 确认缺少选择入口而失败。
- [ ] 增加顶部入口和米白选择弹窗；原省份旁分享直接调用 create 单元素数组。使用既有 collectMemoryShelfData 的照片数，视频不计为可分享照片。
- [ ] 新建 localStorage 键 `memoryShareBrowserIdentity` 保存 `{browserId,browserKey}`，写入成功才调用后端；只从存储中读取格式合法凭证。先向后端 quota 查询，再 compress，生成文件字节/hash 清单；封面同样计量。超过剩余个人或全站容量，在 begin 前明确拒绝。
- [ ] 压缩输出使用 Blob 逐张暂存，避免整套 Base64 长字符串副本；单张 upload 前转换为 dataUrl。开始会话后顺序上传（避免不必要并发），重试使用 begin 返回的 uploadedIds；发布后才生成海报。超时与取消均恢复按钮并保留进度原因。
- [ ] 原省份管理键保留并通过 claim 归属；多选使用新分享 UUID 与独立管理密钥，不复用省份键。控制台不打印凭证。海报保持 1080×1440；多省标题“我的旅行记忆”，最多六封面，其余数量在文字体现。
- [ ] 添加视频排除、存储无法保存、超额组合、上传中断及海报失败仍有链接的测试；断言二维码只有 shareId、不包含凭证；同一浏览器两次新分享计入同一身份。运行 selection/browser/timeout 三组测试通过。仅提交本任务相关 diff，`index.html` 已有其他修改不能整文件混入提交。

## Task 4: 新旧只读书架与按城市加载

**Files:** 修改 `assets/memory-share-reader.js`；更新 `tests/memory-share-reader.spec.cjs`；新增 `tests/memory-share-storage-reader.spec.cjs`。

**Interfaces:** `chapters(province)` 保持现有省份入口；version:2 城市使用任务 2 `read-city` 返回的 chapter，交给既有 `album(body,chapter)`。v1 仍使用内嵌 chapter。

- [ ] 编写浏览器测试：read 返回两省的目录，初次不请求城市照片；打开指定城市只请求对应索引；多省切换不会串图；错误请求显示可重试说明；快速切城丢弃先前结果；旧数据仍无需 read-city。运行新 reader 测试确认预期失败。
- [ ] 新目录书籍用后端照片计数，不依赖内嵌 photos 数组。进入城市读取短期签名地址，用单调请求序号忽略过时响应；再次打开城市重新请求，不能长时间缓存已过期签名。
- [ ] loading/失败时不能残留上一个阅读器。保持仅 readonly，无上传/编辑入口。任务 2 保证链接来源，reader 不接受目录外图片地址。
- [ ] 运行 reader、cover、drag 及新 storage-reader 测试，确认 550ms 及“到边缘松手才完成”未回归。仅提交相关任务 diff；现有未提交封面/拖动改动不得遗漏或覆盖。

## Task 5: 全量验证、交接与上线清单

**Files:** 更新 `项目交接文档.md` 和本方案设计文档的当前状态；补充 `supabase/memory-shelf-storage.sql` 部署注释。

- [ ] 添加使用独立模拟图片的超过 12 MiB 总照片端到端用例：多个请求上传、一个二维码、两省相册可访问，未选第三省不可见，总量计算包含封面。
- [ ] 运行 `node --test tests/*.spec.cjs` 及 `git diff --check`；全部结果须报告。数据库并发验证未执行时明确标记，不能以 JS 模拟取代。
- [ ] 检查权限、秘密、JPEG 验证、Storage 对象只写指定路径、配额边界和事务异常；本地 390px 手机与 1280px 电脑截图验证，手势测试继续通过。
- [ ] 交接说明浏览器 50 MB、全站 800 MB 不是流量限制；匿名身份可重置，不能承诺真实每人额度或 40 人均有满额空间。超过上限不删除历史资料；维护清理仅针对过期草稿及更新后无引用文件。
- [ ] 准备上线顺序：只读统计已有 JPEG/封面及组织 Storage 用量作为全站初始占用；部署受保护 SQL 和 bucket；部署函数；独立模拟数据验证配额并清理；最后推送前端、等待 Pages 成功，验证原二维码和新二维码。实际上线先取得明确授权；没有权限时保留代码与脚本，不报已生效。
- [ ] 本地完成后给出测试结果和未部署状态；用户另行要求部署才执行上线动作。不自动提交无关修改、上传个人照片或升级套餐。

## 实施方式及审阅

建议由当前任务主代理按任务顺序执行，不创建额外任务或委派。用户审阅此计划后开始代码实现；每个任务先失败测试再最小实现，必要独立测试数据库不可用时报告限制并继续可验证本地部分。
