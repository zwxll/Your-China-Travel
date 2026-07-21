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

照片与城市记录使用 **IndexedDB** 存储在浏览器本地。不同电脑 / 浏览器数据独立，换设备需重新添加。清除浏览器数据会删除所有记录，建议定期导出备份。

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
A：照片存 IndexedDB（浏览器本地），属设计如此。换电脑需重新添加。

**Q：ECharts 加载失败？**
A：4 个 CDN 均已配置回退。若全失败（极端网络环境），可将 ECharts 下载到本地并改用相对路径引用。

## License

MIT
