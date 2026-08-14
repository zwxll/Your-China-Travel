# 记录我的中国行 · Chinese Footprint

一个纯前端单文件交互式中国旅行足迹记录应用。点亮你去过的每一座城市，上传旅行照片，记录游玩年月与景点，在 3D 地球与 ECharts 中国地图上可视化你的足迹。

无需构建，开箱即用。

## 功能一览

### 地图与可视化
- **3D 地球启动页**：Three.js + globe.gl 渲染真实地球纹理，相机镜头推近动画过渡到主界面
- **ECharts 中国地图**：4 重 CDN 回退保障加载，支持城市视图 / 省份视图切换、缩放、拖拽
- **城市点亮**：点击地图标记点亮城市，金色高亮区分已记录 / 未记录
- **旅行轨迹动画**：弯曲时间曲线节点，点击播放可回放城市点亮顺序；全览模式展示轨迹 + 照片缩略图
- **城市搜索**：右栏内嵌模糊搜索框，输入城市名快速定位高亮

### 城市记录
- **照片管理**：多张同时上传，拖拽交换位置，灯箱大图预览
- **城市封面**：上传自定义封面图，16:7 固定宽高比防变形
- **推荐星级**：1-5 星评分
- **城市简介**：最多 200 字文字描述
- **游玩年月**：记录到月份粒度
- **标签管理**：按景点 / 美食 / 其他分类添加自定义标签
- **景点管理**：添加景点条目，点击进入城市详情页

### 城市详情页
- 虚化城市封面背景 + 金色标题
- 科技装饰层（网格线 / 侧边光带 / 浮动粒子）
- 玻璃信息栏（游玩年月 / 推荐星级 / 照片数 / 景点数）
- 景点网格卡片 + 3D 旋转木马照片查看器

### 引力相册
- Matter.js 物理引擎驱动的照片画廊
- 照片从顶部掉落、碰撞堆叠、可拖拽抛掷、点击放大

### 视觉特效
| 特效 | 来源 | 位置 |
|------|------|------|
| SmokyText 烟雾文字 | originkit smokytex | 启动页主标题 "Chinese Footprint" |
| Dust Text Reveal 粒尘文字 | originkit dust-text-reveal | 启动页副标题（hover 聚合成文字） |
| ShinyButton 渐变边框 | 21st.dev ShinyButton | 启动页"开始记录"按钮（conic-gradient 旋转边框） |
| Variable Proximity 可变字体 | reactbits variable-proximity | 侧栏 "Chinese Footprint" 标题（鼠标距离驱动字重） |
| Ferrofluid 铁磁流体 | 自研 | 底层背景氛围层 |
| Gooey 黏稠滤镜 | aceternity gooey-input | SVG 滤镜效果 |

## 技术栈

| 技术 | 用途 |
|------|------|
| 原生 HTML / CSS / JS | 单文件内联，零构建依赖 |
| ECharts 5.4.3 | 中国地图渲染（4 重 CDN 回退） |
| Three.js + globe.gl | 3D 地球渲染与镜头动画 |
| GSAP 3.12.5 | 入场动画 / 过渡时间轴 |
| Matter.js 0.20.0 | 引力相册物理引擎 |
| IndexedDB | 照片与城市数据浏览器本地持久化 |
| Supabase Auth / Database / Edge Functions | 账号登录、旅行数据同步与 OSS 安全签名 |
| 阿里云 OSS | 私有照片文件存储与跨设备读取 |
| 可变字体 | Inter / Figtree / Playfair Display（self-host） |

## 项目结构

```
Your-China-Travel/
├── index.html                  # 主页面（全部内联 CSS/JS/动画）
├── assets/
│   └── fonts/                  # 可变字体（self-host，规避外域依赖）
│       ├── InterVariable.woff2
│       ├── InterVariable-Italic.woff2
│       ├── Figtree-Variable.ttf
│       └── PlayfairDisplay-Variable.ttf
├── china-geo.js                # 中国 GeoJSON 数据（本地回退）
├── china-geo.json
├── china-provinces-geo.js
├── supabase-config.js            # Supabase 浏览器端公开配置
├── supabase-setup.sql            # 云端数据表及旧照片桶兼容配置
├── supabase/
│   └── functions/oss-media/      # 登录鉴权与 OSS 临时签名函数
├── vercel.json                 # Vercel 云端部署配置
├── nginx.conf                  # Nginx 服务器配置
├── Dockerfile                  # Docker 容器化部署
├── docker-compose.yml          # 一键编排
└── README.md
```

## 快速开始

直接用浏览器打开 `index.html` 即可运行，或启动本地静态服务器：

```bash
# Python
python -m http.server 8765

# Node.js
npx serve

# Docker
docker-compose up
```

然后访问 `http://localhost:8765`（或对应端口）。

## 部署

### Vercel
项目已含 `vercel.json`，导入仓库后自动部署，默认支持单页回退。

### Docker
```bash
docker-compose up -d
```
基于 Nginx 镜像，`nginx.conf` 已配置 `try_files` 回退。

### Nginx / 静态服务器
将项目文件放到 Web 根目录，确保 `try_files $uri $uri/ /index.html` 回退配置生效。

## 数据存储说明

未登录时，照片与城市记录使用 **IndexedDB** 存储在当前浏览器。登录账号后，旅行数据同步到 Supabase，照片文件保存在私有阿里云 OSS；IndexedDB 继续作为本机缓存。在同一设备刷新并恢复同一账号时，如果云端版本没有变化，页面直接使用本机缓存，不会重新下载全部照片；其他设备产生新版本时，也只下载本机缺少的图片。在另一台设备登录同一账号后，页面会自动恢复云端内容。每个账号只能访问自己的内容。

### 当前生产环境

- 正式网站：`https://zwxll.github.io/Your-China-Travel/`
- OSS Bucket：`your-china-travel-8877-hk`（中国香港，必须保持**私有**）
- Edge Function：`oss-media`
- 照片路径：`users/<Supabase user id>/photos/<uuid>.<ext>`
- 临时上传/读取地址有效期：300 秒

“私有 Bucket”不会妨碍注册用户使用：用户登录后，Edge Function 会验证 Supabase 账号，并且只为该用户自己的目录签发临时地址。不要为了让所有注册用户上传而设置“公共读写”；公共读写会绕过网站登录，允许未知第三方直接操作 OSS。

### 首次配置账号云端

1. 在 Supabase 项目中打开 **SQL Editor**。
2. 新建查询，完整粘贴 `supabase-setup.sql` 并运行一次。
3. 在 **Authentication → URL Configuration** 中，把正式网站地址设为 Site URL，并加入 Redirect URLs。
4. `supabase-config.js` 只能填写 Project URL 与 Publishable key，禁止填写 Secret key 或 service_role key。
5. 创建私有阿里云 OSS Bucket，并配置网站来源的 CORS；给专用 RAM 用户授予该 Bucket 中 `users/*` 的读取、上传和删除权限。
6. 在 Supabase **Edge Functions → Secrets** 中配置 `ALIYUN_OSS_ACCESS_KEY_ID`、`ALIYUN_OSS_ACCESS_KEY_SECRET`、`ALIYUN_OSS_BUCKET` 和 `ALIYUN_OSS_REGION`。密钥只能保存在 Secrets，禁止写入前端或 Git 仓库；OSS 外网地址由 Region 自动生成。
7. 部署 `supabase/functions/oss-media/index.ts` 为 `oss-media`，并关闭该函数的 **Verify JWT with legacy secret**。函数内部仍会验证 Supabase 登录用户，只为当前账号签发短时 OSS 地址。

当前浏览器已有本机资料时，首次登录空账号会自动上传迁移；若账号云端和设备本机同时已有资料，页面会让用户选择保留哪一份。

### 上线后验证

1. 电脑登录测试账号并新增一张测试照片。
2. 等待页面显示“已同步”。
3. 在 OSS 控制台确认 `users/<用户ID>/photos/` 出现对象。
4. 手机登录同一账号，确认照片自动出现。
5. 手机再新增一张照片，回到电脑刷新确认双向同步。
6. 确认 OSS 读写权限仍为“私有”。

不要在照片恢复过程中连续执行同步、退出和重新登录。云端出现 `404 NoSuchKey` 表示数据库记录存在但 OSS 文件已经缺失，需要重新上传原图，重新签名本身不能恢复文件。

## 外部依赖（运行时 CDN）

| 依赖 | 用途 | CDN 来源 |
|------|------|----------|
| ECharts 5.4.3 | 中国地图 | jsdelivr / bootcdn / fastly / unpkg（4 重回退） |
| Three.js 0.149.0 | 3D 地球云层与光照 | jsdelivr |
| globe.gl | 3D 地球渲染 | jsdelivr |
| GSAP 3.12.5 | 动画引擎 | jsdelivr |
| Matter.js 0.20.0 | 物理引擎 | jsdelivr |
| 中国 GeoJSON | 省份边界数据 | geo.datav.aliyun.com（含本地回退） |

> 可变字体已 self-host 在 `assets/fonts/`，无需外域请求。

## 常见问题

**Q：刷新页面 404？**
A：`nginx.conf` 已配置 `try_files $uri $uri/ /index.html` 回退；Vercel 默认支持单页回退。

**Q：地图不显示？**
A：检查网络能否访问 `geo.datav.aliyun.com`（中国地图数据 CDN）。项目含本地 GeoJSON 回退，但首次加载仍需网络。

**Q：照片在另一台电脑看不到？**
A：登录同一账号后，页面会从阿里云 OSS 自动恢复照片。首次启用 OSS 时，请先在照片最完整的设备刷新并等待“已同步”，再打开其他设备；若仍未出现，请查看 `oss-media` 的 Edge Function Logs。

**Q：为什么刷新后没有重新下载全部照片？**
A：这是正常的缓存行为。同一账号且云端版本未变化时，页面直接读取 IndexedDB；云端有新版本时，会按 OSS 文件路径复用本机已有照片，只下载新增或已更换的图片。

**Q：ECharts 加载失败？**
A：4 个 CDN 均已配置回退。若全失败（极端网络环境），可将 ECharts 下载到本地并改用相对路径引用。

## License

MIT
