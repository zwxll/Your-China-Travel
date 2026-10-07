# 旅行年轮树 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans for native execution, or superpowers:subagent-driven-development if the user selects delegated execution. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 在功能菜单新增独立旅行年轮树，使用已有城市照片，支持年份强调与现有看图操作，原伞幕不变。

**Architecture:** 新增隔离的场景页面和离线 bundle，主页面只负责收集照片和打开/关闭。只读复用现有 Three.js、伞幕相机与看图机制、花园绘制；树形、照片枝条布局和年份状态在新模块实现，不改造伞幕接口。

**Tech Stack:** 原生 JavaScript、HTML/CSS、现有 Three.js 与 OrbitControls、本地 esbuild、Node test、Playwright/Edge。

**Spec:** `docs/superpowers/specs/2026-10-06-travel-ring-tree-design.md`

## Global Constraints

- 新模块放在 `assets/travel-ring-tree/`，原伞幕目录所有文件不改动。
- 不新增数据库，不修改照片和年份归属；年份手动归属优先，其次明确旅行日期，再取首次到访年份。
- 不增加路线回放、公里数、上传、编辑、生长动画或远程素材。
- 场景规模接近现有伞幕，暖木色树形、暖米色背景、紧凑花园，无河流和大片远景。
- 花朵最多桌面 2400 / 手机 800；保留减少动态效果与关闭暂停。
- 本地文件和 HTTP 均可运行；来源及许可证保留。
- 不提交、推送或发布；保留所有无关工作树改动。

## Review Focus

- 照片读取期间关闭或快速重开：旧请求不得重新挂载弹层；任务 3 测试。
- 所选年份与所选城市无交集：清晰提示，不让照片查看状态与强调状态互相覆盖；任务 2 测试。
- 竖幅照片与较多城市：照片不越过树枝布局边界，手机主要操作可用；任务 2 浏览器测试与截图。
- 图片解码失败或无 WebGL：仍可返回、按城市查看原图，不停留在无限加载；任务 2 测试。
- 原伞幕与年轮树分别打开关闭：状态独立、仅一个活动场景、伞幕文件未改；任务 3 测试与哈希比较。

## 文件与职责

- `assets/travel-ring-tree/data.js`：只读记录到城市/年份目录的适配。
- `assets/travel-ring-tree/scene.js`：独立树模型、照片枝条布局、年份强调；复用原相机与照片操作。
- `assets/travel-ring-tree/main.js`、`template.html`、`style.css`：独立页面、城市目录、年份按钮、原图、空状态及低能力降级。
- `assets/travel-ring-tree/host.js`：主页面挂载/关闭、异步请求隔离与焦点恢复。
- `assets/travel-ring-tree/build-embedded.cjs`、生成的 `embedded.js`、`README.md`：离线构建与来源记录。
- `index.html`：只新增 `travelRingTreeBtn`、`travelRingTreeOverlay`、`travelRingTreeHost`、`travelRingTreeClose` 及初始化接线。
- `tests/travel-ring-tree-data.spec.cjs`、`tests/travel-ring-tree-browser.spec.cjs`：真实数据与浏览器验收。

## Task 1：只读照片与年份目录

**Interfaces:**
- 消费现有 `TravelImageAtlas.collect(entries, getPhotosByCity, overrides)` 返回的记录；记录包含 `id/title/src/full/aspect/year/date/cityKey`。
- `createTreeCatalog(records)` 返回 `{photos, cities, years}`；保留原记录标识和原图地址，城市按 `cityKey` 分组，`years` 仅包含真实数字年份并升序排列，未知年份单独保留，不推断上传时间。

- [x] 在 `tests/travel-ring-tree-data.spec.cjs` 写失败测试：两次到访同城市只收集一次相册，视频不加入；手动年份、明确日期、首次到访、未知年份各使用固定样例断言。
- [x] 运行 `node --test tests/travel-ring-tree-data.spec.cjs`，确认失败由新目录适配尚未实现造成。
- [x] 在 `data.js` 实现目录适配，复用已有收集器，不复制照片 Blob，不写入设置；主页面接入时读取 `imageAtlasYears`。
- [x] 同命令验证通过；确认城市统计基于实际照片城市，年份不包含虚构空年份。

## Task 2：独立树场景和照片浏览

**Interfaces:**
- `TravelRingTreeScene` 消费任务 1 的目录；提供 `setYear(yearOrNull)`、`setRunning(active)` 以及既有城市/原图浏览需要的操作。
- `setYear(null)` 恢复全部；数字年份强调匹配照片、淡化其余照片并同步地面年轮，不销毁或重新创建照片 Mesh。
- `main.js` 从 `window.travelRingTreeRecords` 读取记录；关闭请求发送 `tree:close`，宿主可见性消息沿用 `platform:visibility`。

- [x] 在浏览器测试写失败断言：真实 3D 树场景、实际照片数量/比例保留、年份变化前后照片对象保持不变；城市与年份无交集有明确状态提示，返回全部可恢复。
- [x] 运行 `node --test tests/travel-ring-tree-browser.spec.cjs`，确认新页面或场景缺失时失败。
- [x] 实现 `scene.js`：优先继承/只读复用现有相机、照片焦点和点击逻辑；树模型及枝条布局由本模块负责，不调用伞形构建。暖木色曲线枝干、少量实例叶片，照片按城市沿枝条分组；花园保持现有预算。
- [x] 创建独立模板、样式与 `main.js`：标题及副文案遵循设计；城市浏览、原图查看、年份按钮和地面年轮同步。年份与城市强调使用同一状态规则，照片查看关闭后恢复当前筛选状态。
- [x] 实现无法创建 WebGL 时的城市照片列表和原图查看，空相册与加载失败提示；保持关闭按钮可用。
- [x] 增加离线构建脚本：本地 Three.js 和复用源码一起打包，保留许可证，生成 `embedded.js`；不要修改原伞幕构建脚本。
- [x] 增加浏览器断言并运行：手机 390px 无页面横向溢出；大量城市和竖幅照片仍可浏览；图片失败、禁用 WebGL、减少动态效果、暂停/恢复均可用；本地入口不发远程模块或图片请求。
- [x] 桌面和手机截图检查树形、枝条照片、花园边界、文字位置。不要以仅有测试通过代替视觉检查。

## Task 3：功能菜单接线和原功能回归

**Interfaces:**
- `initTravelRingTree({button,overlay,host,close,collectRecords})`，其中 `collectRecords()` 返回任务 1 使用的记录列表。
- `TravelRingTreeDocument(records)` 返回离线 iframe 文档；宿主只接收当前 iframe 的 `tree:close` 消息。

- [x] 执行前记录 `assets/umbrella-canopy/` 文件哈希，在浏览器测试中验证菜单独立入口、关闭焦点、快速关闭重开、旧读取请求丢弃。
- [x] 运行浏览器测试并确认入口断言失败。
- [x] 实现 `host.js` 和 `index.html` 接线：新增同风格按钮“旅行年轮树”，独立弹层；复用现有照片收集器，附带 `cityKey`，读取手动年份。避免原伞幕与树场景同时绘制。
- [x] 运行 `node --test tests/travel-ring-tree-data.spec.cjs tests/travel-ring-tree-browser.spec.cjs tests/umbrella-canopy.spec.cjs`，全部通过；比对伞幕文件哈希，任何差异均须撤销本任务造成的修改。
- [x] 在新模块 `README.md` 记录复用来源、构建方式、数据规则、验收入口：功能菜单 → 旅行年轮树。
- [x] 请求一次只读代码复核，重点检查年份/城市/大图状态、资源释放、异常返回和原伞幕隔离；修复有效的重要问题。
- [x] 运行 `node --test --test-concurrency=1 tests/*.spec.cjs` 和 `git diff --check`；报告实际通过、失败、跳过数量及失败名称，不修改无关问题。

## 执行选择

推荐在当前对话由主代理逐步实施，最后做一次独立只读复核。三个任务依赖同一照片接口和场景状态，不适合并行开发；这样也能减少重复上下文和代码冲突。若用户选择分工实施，再使用对应分工技能。

用户已确认并在当前对话实施完成。全套 106 项：104 通过、0 失败、2 项真实 PostgreSQL 环境测试跳过；原伞幕 43 文件哈希一致。修改保留当前工作目录，不提交、合并、推送或发布。
