# 记录我的中国行 · Chinese Footprint

> 记录一座城，也记录那时的自己。

一款以中国地图为核心的个人旅行足迹应用。你可以点亮到访城市、记录多次游玩年月、上传照片和城市封面、整理景点与标签，并通过地图边界、旅行轨迹和城市卡片回顾自己的旅程。

[在线体验](https://zwxll.github.io/Your-China-Travel/) · [部署说明](#部署) · [云端配置](#云端账号与跨设备同步)

## 项目特色

### 匿名分享记忆书架（更新于 2026-10-02）

无需登录，在顶部「分享书架」单选、多选、全选省份，生成海报和二维码；访客扫码只查看选中省份的城市和照片。旧的省份旁「分享」入口已移除。仅分享照片的压缩副本，不分享视频，不改变本机原始资料。最多 1500 张照片、最长边 900px、JPEG 0.7、单文件不超过 300 KiB；匿名浏览器累计额度为 50MB。

每次完成一次新分享都会生成独立链接，单选、多选和全选使用同一套流程，不覆盖此前已发布的分享；未完成上传的相同选择可恢复原草稿。管理凭证保存在本地浏览器，清除浏览器资料后可能失去历史分享管理权。旧分享及其凭证保留，可通过「管理分享」撤销并清理容量。拿到链接的人都能查看照片，请勿分享敏感内容。

新版支持同一浏览器相同照片只上传一次，不同分享链接共用；「管理分享」可删除某份分享或清空全部云端分享与草稿。二维码撤销后，仍被其他链接引用的照片不会删除；仅实际清理成功才恢复额度，本地旅行照片不受影响。2026-10-02 后端已部署，GitHub Pages 前端尚未更新，在线使用这些功能仍需发布新版前端；旧二维码读取保持兼容。部署状态和升级说明见 `项目交接文档.md`。

只读分享页采用书本相册：沿用原记忆相册的城市简介、单图、双图和四图分组排版；手机单页滑动翻阅，电脑双页，支持城市切换、页码和点击任意照片放大。旧链接和二维码不变，发布新版后即可使用新阅读方式。

后端 `memory-shelf-share` v4 已部署；新版写协议为 v3。前端采用现有 GitHub Pages，从 `main` 分支根目录自动发布，但本地新版前端尚未推送。发布文件包含 `memory-share.html`、`assets/memory-share.js`、`assets/memory-share.css`、`assets/memory-share-reader.js`、`assets/memory-share-reader.css` 和 `assets/vendor/`。二维码默认指向本项目 GitHub Pages 地址；更换域名时需在配置中设置实际的 `shareBaseUrl`。目前线上旧客户端不能生成新分享，需发布新版前端并等待 Pages 部署成功；已有二维码仍可读取。

新安装环境的分享数据库脚本依次为 `supabase/memory-shelf-share.sql` → `supabase/memory-shelf-storage.sql` → `supabase/memory-shelf-dedup.sql`。已有生产环境不要重复初始化或重置容量计数；当前部署与维护限制见 [项目交接文档](./项目交接文档.md)。

- **三种地图视图**：默认视图、城市视图和省份视图各自承担不同的信息密度。
- **城市边界高亮**：城市视图仅高亮已点亮城市，省份视图展示省内城市边界与跨城市足迹。
- **动态城市卡片**：卡片展示城市封面、推荐指数和简介，并通过曲线连接到地图坐标；拖动和缩放时会同步更新。
- **旅行资料管理**：支持城市封面、多张照片、游玩年月、星级、简介、标签和景点。
- **多次到访记录**：同一城市可以添加第二次、第三次及更多游玩年月。
- **旅行轨迹与引力相册**：可回放点亮顺序，并以 Matter.js 物理效果浏览照片。
- **我的家乡**：独立标记家乡，支持快速编辑和查看。
- **人生寄语与个人主页**：展示个性寄语、到达城市数、覆盖省份数和估算旅程里程。
- **游客点评与公开资料**：查看城市点评，也可通过点评头像访问对方公开旅行统计。
- **本机与云端双模式**：不想上传照片时可使用本机模式；登录账号后可跨设备同步。
- **可理解的同步状态**：针对网络、登录、OSS 文件和云端配置问题提供可重试提示。
- **深浅主题与响应式侧栏**：支持主题切换，左右信息卡片可折叠，为地图让出空间。

## 在线体验

正式地址：<https://zwxll.github.io/Your-China-Travel/>

首次进入时可以选择：

1. **本机模式**：资料只保存在当前浏览器，不上传云端。
2. **旅行账号**：使用 Supabase Auth 登录，旅行数据同步至 Supabase，照片存入私有阿里云 OSS。

> 本机模式的数据不会自动出现在其他设备。需要跨设备查看时，请登录同一个旅行账号并等待同步完成。

## 功能概览

### 地图与足迹

- ECharts 中国地图，支持拖动、缩放、搜索和快速定位。
- 默认视图保持简洁；城市视图突出已到访城市边界；省份视图展示省域及市级边界。
- 已点亮城市、未记录城市和家乡使用不同视觉标记。
- 城市卡片采用避让布局，连接线随地图移动和缩放更新。
- 旅行轨迹支持播放、暂停、重播和全览。

### 城市记录

- 上传城市封面和多张旅行照片。
- 拖拽调整照片顺序，灯箱查看原图。
- 设置 1–5 星推荐指数和城市简介。
- 添加多个游玩年月，保留重复到访经历。
- 使用“景点 / 美食 / 其他”标签整理内容。
- 添加景点条目并进入城市详情页查看。

### 个人与社区

- 编辑头像、昵称、家乡、家乡简介、出生年月、标签、景点与人生寄语。
- 个人主页统计到达城市、覆盖省份和估算旅行里程。
- 在城市点评中发布、编辑或删除自己的点评。
- 点击点评用户头像查看其公开资料和旅行统计。
- 通过“建议反馈”入口提交问题和功能建议。

### 照片体验

- IndexedDB 保存本机资料与云端照片缓存。
- 同一账号再次打开时优先复用本机缓存，只补充缺少或变更的照片。
- 引力相册使用 Matter.js 模拟掉落、碰撞、拖拽和抛掷。

## 技术架构

本项目不需要前端构建工具。页面主体集中在 `index.html`，通过静态托管即可运行；账号、公开资料、点评、反馈及照片同步由云服务提供。

```text
浏览器静态页面
├─ ECharts / Three.js / GSAP / Matter.js
├─ IndexedDB：本机资料与照片缓存
├─ Supabase Auth：注册、登录与会话
├─ Supabase Database：旅行快照、公开资料、点评与反馈
└─ Supabase Edge Functions
   ├─ oss-media：验证用户并签发 OSS 临时读写地址
   └─ feedback：接收建议反馈
        │
        └─ 阿里云 OSS：私有照片对象存储
```

| 技术 | 用途 |
| --- | --- |
| HTML / CSS / JavaScript | 单页应用与界面交互 |
| ECharts 5 | 中国地图、边界、散点及轨迹 |
| Three.js + globe.gl | 启动页 3D 地球 |
| GSAP | 页面过渡与动画时间轴 |
| Matter.js | 引力相册物理模拟 |
| IndexedDB | 浏览器端持久化与照片缓存 |
| Supabase | 认证、数据库与 Edge Functions |
| 阿里云 OSS | 私有照片存储与跨设备读取 |

## 项目结构

```text
Your-China-Travel/
├─ index.html                         # 主应用：HTML、CSS 与 JavaScript
├─ memory-share.html                  # 扫码访问的只读书本相册
├─ assets/
│  ├─ fonts/                          # 自托管字体
│  ├─ memory-share.js、.css           # 省份选择、分享海报与管理分享
│  ├─ memory-share-reader.js、.css    # 只读相册、照片放大与触摸翻页
│  ├─ vendor/                         # 二维码、翻页库及许可证
│  └─ photo-stream/                   # 照片流运行包及维护源码
├─ china-geo.js                       # 中国地图数据本地回退
├─ china-geo.json
├─ china-provinces-geo.js             # 省份与市级边界数据
├─ supabase-config.js                 # 浏览器端 Supabase 公开配置
├─ supabase-setup.sql                 # 数据表、约束、索引和 RLS 策略
├─ supabase/
│  ├─ memory-shelf-share.sql          # 分享初始表结构
│  ├─ memory-shelf-storage.sql        # 分文件上传与容量计量
│  ├─ memory-shelf-dedup.sql          # 共用照片、引用和清理事务
│  └─ functions/
│     ├─ memory-shelf-share/          # 匿名分享及管理接口
│     ├─ oss-media/index.ts           # OSS 临时签名与用户目录鉴权
│     └─ feedback/index.ts            # 建议反馈接口
├─ tests/                            # 自动化回归测试
├─ docs/superpowers/                  # 历史设计与实施计划
├─ vercel.json                        # Vercel 静态部署与缓存头
├─ nginx.conf                         # Nginx 配置
├─ Dockerfile
├─ docker-compose.yml
├─ 项目交接文档.md                    # 详细架构、迭代和运维记录
├─ PROJECT_MEMORY.md                 # 当前状态与交接摘要
└─ README.md
```

### 本地目录清理与维护

2026-10-02 已删除空 `.uploads/`、`.superpowers/npm-cache/`、部署测试脚本及测试身份文件，以及已提交功能的 `index-feature.patch`，释放约 8.75MB；没有删除照片、云端分享或未提交代码。

`1/` 和 `旅行资料/` 是本地旅行备份，合计约 79.6MB，并非程序依赖；核对备份完整后可移到项目外，但不要当缓存删除或混入公开仓库。`.superpowers/test-runtime/` 是可重装的本地数据库测试依赖，当前仍保留；`docs/`、`tests/`、共用资源与许可证也保留。

照片流运行使用 `assets/photo-stream/embedded.js`，其 `js/`、`style.css`、`template.html` 和 `build-embedded.cjs` 用于维护后重新生成，不是可随意删除的重复文件。字体均有页面引用；`china-geo.json` 仍被 Dockerfile 引用。Vercel、Docker/Nginx 配置是可选部署方式，本次没有删除。

### 开发验证

运行 `node --test tests/*.spec.cjs`。浏览器测试当前使用本机 Codex Playwright 路径，其他开发环境需要调整其导入路径并安装对应浏览器。

数据库本地测试使用 PGlite 0.5.8，可执行 `npm install --prefix .superpowers/test-runtime --cache .superpowers/npm-cache --no-audit --no-fund @electric-sql/pglite@0.5.8` 重装，或指定 `MEMORY_SHARE_PGLITE_PATH`；安装会重新生成已清理的 npm 缓存。独立 Supabase 集成测试需可丢弃测试项目及相应环境变量，未配置时跳过，禁止用生产项目代替。最近一次代码全量验证为 48 项：46 通过、0 失败、2 项独立数据库测试跳过；本轮仅更新文档，未重新运行代码测试。

## 本地运行

无需安装依赖或执行构建。推荐使用静态服务器访问，避免 `file://` 环境限制网络请求。

### Python

```bash
python -m http.server 8765
```

打开 <http://127.0.0.1:8765/>。

### Node.js

```bash
npx serve .
```

### Docker

```bash
docker compose up -d
```

## 云端账号与跨设备同步

只体验本机模式无需进行本节配置。要启用账号、公开资料、点评、反馈和跨设备照片同步，请完成以下步骤。

### 1. 初始化 Supabase 数据库

1. 创建 Supabase 项目。
2. 打开 **SQL Editor**。
3. 将 [`supabase-setup.sql`](./supabase-setup.sql) 的完整内容粘贴并执行。
4. 确认相关数据表与 RLS 策略创建成功。

脚本使用兼容式 `alter table ... add column if not exists`，已有环境也可以运行，用于补齐人生寄语和公开旅行统计字段。

### 2. 配置浏览器端连接

修改 [`supabase-config.js`](./supabase-config.js)：

```js
window.TRAVEL_SUPABASE_CONFIG = {
  url: 'https://YOUR_PROJECT.supabase.co',
  publishableKey: 'YOUR_PUBLISHABLE_KEY'
};
```

Publishable key 可以出现在浏览器中；**Secret key、service_role key 和阿里云 AccessKey Secret 绝不能写入前端或提交到 Git**。

### 3. 配置 Authentication

- 在 **Authentication → URL Configuration** 中填写正式站点地址与本地测试地址。
- 若希望注册后直接登录，可在 Email Provider 的 User Signups 中关闭 **Confirm email**。
- 正式开放注册前，请根据实际风险决定是否保留邮箱验证。

### 4. 配置阿里云 OSS

- 创建私有 Bucket；当前生产环境使用中国香港地域。
- 为网站来源配置 CORS，允许 `GET`、`PUT`、`DELETE`、`HEAD` 和预检请求。
- 使用独立 RAM 用户，并仅授权目标 Bucket 下的 `users/*` 路径。
- 不要把 Bucket 改成公共读写；登录用户通过短时签名地址访问自己的目录。

### 5. 配置与部署 Edge Functions

在 Supabase **Edge Functions → Secrets** 中配置：

```text
ALIYUN_OSS_ACCESS_KEY_ID
ALIYUN_OSS_ACCESS_KEY_SECRET
ALIYUN_OSS_BUCKET
ALIYUN_OSS_REGION
```

随后部署：

- `supabase/functions/oss-media/index.ts` → `oss-media`
- `supabase/functions/feedback/index.ts` → `feedback`

`oss-media` 应关闭 **Verify JWT with legacy secret**；函数内部仍会校验当前 Supabase 用户，并限制其只能访问自己的 `users/<user-id>/` 目录。

## 数据与隐私

| 使用方式 | 旅行资料 | 照片 | 跨设备 |
| --- | --- | --- | --- |
| 本机模式 | IndexedDB | IndexedDB | 不支持 |
| 登录账号 | Supabase + 本机缓存 | 私有阿里云 OSS + 本机缓存 | 支持 |

- OSS 对象路径：`users/<Supabase user id>/photos/<uuid>.<ext>`。
- OSS 临时上传和读取地址默认有效 300 秒。
- 删除 Supabase 用户不会自动删除 OSS 中已存在的对象，管理员仍需清理对应用户目录。
- 退出账号会清理该浏览器中的账号旅行资料，避免不同账号之间串数据。

## 部署

### GitHub Pages

仓库可直接通过 GitHub Pages 托管。当前线上地址：

<https://zwxll.github.io/Your-China-Travel/>

### Vercel

仓库包含 [`vercel.json`](./vercel.json)，导入项目即可部署。配置包含静态资源缓存与基础安全响应头。

### Docker / Nginx

```bash
docker compose up -d
```

也可以将文件复制到任意静态 Web 根目录；`nginx.conf` 已提供单页回退配置。

## 上线检查

1. 使用电脑登录测试账号并新增一座城市和一张照片。
2. 等待同步完成，在 OSS 中确认 `users/<用户ID>/photos/` 出现对象。
3. 使用另一台设备登录同一账号，确认城市资料和照片自动恢复。
4. 在第二台设备新增内容，再回到第一台设备刷新验证增量同步。
5. 查看个人主页，确认城市数、省份数、里程和人生寄语已经写入公开资料。
6. 提交一条测试反馈，在 Supabase Table Editor 中确认记录存在。
7. 再次确认 OSS Bucket 保持私有。

## 常见问题

<details>
<summary>地图没有显示怎么办？</summary>

检查浏览器控制台和网络请求。项目包含本地 GeoJSON 回退，但 ECharts、Three.js 等运行时库仍需要能够访问配置的 CDN。

</details>

<details>
<summary>为什么另一台设备没有显示全部照片？</summary>

先在照片最完整的设备登录并等待同步完成，再在另一台设备使用同一账号登录。若仍缺失，请检查 `oss-media` 调用、OSS 对象是否存在，以及数据库快照中的照片路径是否一致。

</details>

<details>
<summary>OSS 返回 404 NoSuchKey 是什么意思？</summary>

数据库中仍有照片路径，但对应 OSS 文件不存在。重新生成签名不能恢复已经缺失的对象，需要从保存原图的设备重新上传。

</details>

<details>
<summary>为什么刷新后没有重新下载全部照片？</summary>

这是预期行为。相同账号且云端版本没有变化时会复用 IndexedDB 缓存；云端有新增内容时只下载本机缺少的照片。

</details>

<details>
<summary>为什么本机直接双击 index.html 后云同步失败？</summary>

`file://` 页面可能受到浏览器跨域和安全策略限制。请使用 Python、Node.js 或其他静态服务器通过 `http://127.0.0.1` 访问。

</details>

## 维护文档

更完整的配置、故障处理、迭代历史与交接信息请查看 [`项目交接文档.md`](./项目交接文档.md)。

## 安全提醒

- 不要提交 Supabase Secret/service_role key、阿里云 AccessKey Secret 或数据库连接密码。
- 不要将 OSS Bucket 设置为公共读写。
- 不要扩大 RAM 权限到整个阿里云账号。
- 发布前检查 Git diff，确认截图、HAR 文件和日志中没有临时签名或敏感信息。

---

如果这个项目对你有帮助，欢迎提交 Issue、建议反馈或继续完善自己的旅行故事。
