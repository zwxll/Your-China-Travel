# 开发、部署与维护

本文保存原 README 的详细技术说明。当前版本、验证结果和待办以 [项目交接文档](../项目交接文档.md) 顶部为准；下方带日期的记录仅供历史参考。

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
│  ├─ image-atlas/                    # 年轮照片运行包与维护源码
│  ├─ umbrella-canopy/                # 伞幕照片运行包与维护源码（本地待提交）
│  ├─ tactile-button.js               # 年轮照片按钮效果
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

全套命令为 `node --test --test-concurrency=1 tests/*.spec.cjs`，但包含手机混合场景。当前用户只要求电脑端验证，执行前须检查用例范围，不能直接全套运行或只用文件名筛选便认为排除了手机。浏览器测试使用本机 Codex Playwright 路径，其他环境需调整导入路径并安装对应浏览器。

2026-10-07 最近字体、地图标签及按钮电脑专项 5/5 通过；最近非浏览器回归 32 通过、1 PostgreSQL 用例跳过（左上字体更新前）。最新专项命令及验证边界见 [当前交接](../项目交接文档.md)。本次仅更新文档，没有重跑代码测试，尚未完成当前版本全量浏览器验收。

### 字体维护

- 地图省市字库 `NotoSerifSC-Subset-*` 是精简资源，不能假定包含任意中文。启动页和左上标题额外使用 `NotoSerifSC-Launch-400/700.woff2`，覆盖两句文案、标题及引号，合计 11,596 字节；许可证为 `assets/fonts/NotoSerifSC-OFL.txt`，源来自 `@fontsource/noto-serif-sc@5.2.9`。
- 更换字体只改 `font-family`，不能顺手改字号、字重、字距、动画或位置。动画拆字元素必须继承字体。新增字符后用浏览器实际字体检查（见 `header-copy-font-browser.spec.cjs`、`launch-copy-font-browser.spec.cjs`），不能只检查 CSS 名称或字体加载成功；缺字会逐字回退系统字体。
- 字库本地托管，无在线字体请求和新运行依赖。裁剪工具及源文件在本机临时目录，不需随站点部署。修改这类 CSS/字体无需重建场景 embedded 包。

### 历史测试记录

最近完整回归 101 项：98 通过、1 失败、2 跳过。失败为 `tests/umbrella-canopy.spec.cjs` 的花草/河流场景断言；前一轮 `tests/memory-share-cover.spec.cjs` 的长城市名与时间重叠断言失败，最近一轮通过，仍需关注。照片墙、挂帘、按钮布局及年轮图谱相关 6 项定向测试通过。两项独立数据库测试因未配置环境跳过，不代表线上验收。本轮文档更新仅核对代码、路径及差异，未重新运行代码测试；下方 48 项结果为历史数据。

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
3. 将 [`supabase-setup.sql`](../supabase-setup.sql) 的完整内容粘贴并执行。
4. 确认相关数据表与 RLS 策略创建成功。

脚本使用兼容式 `alter table ... add column if not exists`，已有环境也可以运行，用于补齐人生寄语和公开旅行统计字段。

### 2. 配置浏览器端连接

修改 [`supabase-config.js`](../supabase-config.js)：

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

仓库包含 [`vercel.json`](../vercel.json)，导入项目即可部署。配置包含静态资源缓存与基础安全响应头。

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

更完整的配置、故障处理、迭代历史与交接信息请查看 [`项目交接文档.md`](../项目交接文档.md)。

## 安全提醒

- 不要提交 Supabase Secret/service_role key、阿里云 AccessKey Secret 或数据库连接密码。
- 不要将 OSS Bucket 设置为公共读写。
- 不要扩大 RAM 权限到整个阿里云账号。
- 发布前检查 Git diff，确认截图、HAR 文件和日志中没有临时签名或敏感信息。

---

如果这个项目对你有帮助，欢迎提交 Issue、建议反馈或继续完善自己的旅行故事。
