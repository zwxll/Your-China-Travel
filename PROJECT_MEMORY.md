# 项目记忆交接文档：「记录我的中国行」

> 本文档供 Agent 间记忆传递使用。包含项目代码结构、各模块功能、本次会话全部修改记录、以及 GitHub 推送全流程。

---

## 一、项目概览

- **项目名称**：记录我的中国行（Chinese Footprint）
- **技术栈**：单文件 HTML（内联 CSS/JS，无构建步骤），8544 行
- **核心依赖**（CDN 运行时加载，无打包）：
  - ECharts 5.4.3 — 中国地图渲染（4 重 CDN 回退）
  - globe.gl — 3D 地球首屏
  - GSAP 3.12.5 — 动画引擎
  - Inter 可变字体（self-host）— Variable Proximity 标题动画
  - 中国 GeoJSON — 省份边界数据（geo.datav.aliyun.com）
- **数据存储**：IndexedDB（浏览器本地，照片 + 城市元数据）
- **工作目录**：`f:\trae\1\Your-China-Travel`

---

## 二、项目文件结构

```
f:\trae\1\Your-China-Travel\
├── index.html              # 主页面（8544行，含全部内联 CSS/JS/动画）
├── china-geo.js            # 中国地理数据（城市坐标等）
├── china-geo.json          # 地理 JSON 数据
├── china-provinces-geo.js  # 省份边界数据
├── assets/fonts/           # 自托管字体（Inter、Playfair、Figtree）
├── vercel.json             # Vercel 部署配置
├── nginx.conf              # Nginx 配置
├── Dockerfile              # Docker 容器化
├── docker-compose.yml      # 一键编排
├── .gitignore
└── README.md               # 部署文档
```

---

## 三、index.html 代码结构与各部分功能

### 1. `<head>` 区（第 1-2836 行）

| 行范围 | 内容 |
|--------|------|
| 1-12 | meta 标签、DNS 预解析、标题 |
| 14-48 | Inter 可变字体 @font-face self-host |
| 49-66 | 全局配色变量（纯黑科技基底 + 青蓝主色）|
| 67-74 | 圆角系统（Shape Consistency Lock）|
| 75-85 | Z-Index 层级系统 |
| 268-324 | Star Border 星际边缘效果（reactbits）|
| 325-660 | 地图搜索框（Gooey 黏稠效果 + 圆锥渐变边框）|
| 668-750 | 加载动画（9柱放射小球弹跳）|
| 752-815 | 弹窗滚动隔离核心 |
| 816-918 | 城市卡片 3D 浮空透视 + 缩略图 |
| 919-960 | 切换按钮组 + Variable Proximity 可变字体 |
| 1040-1140 | 已点亮城市卡片（3D 卡牌 + 流星 + Border Glow）|

### 2. `<body>` 区（第 2837-3661 行）

| 行范围 | 模块 | 功能说明 |
|--------|------|----------|
| 2838-2867 | 首屏 3D 地球入口 | globe.gl 渲染旋转地球 + "开始记录"按钮 |
| 2868-2869 | 页面过渡遮罩 | GSAP 控制黑屏淡入淡出 |
| 2871-2881 | Gooey SVG Filter | 搜索框黏稠效果滤镜定义 |
| 2882-2900 | header 品牌区 | Chinese Footprint 品牌标识 |
| 2901 | `#map` | ECharts 中国地图主容器 |
| 2968-3002 | 搜索框 + 城市网格 | `#cityGrid` 已点亮城市卡片列表 |
| 3007-3037 | 地图加载器/错误提示 | `#mapLoader`、`#mapError` |
| **3147-3188** | **`#attDetailOverlay`** | **城市详情页（本次会话重点修改区）** |
| 3190-3197 | `#attEditOverlay` | 景点编辑面板 |
| 3198-3240 | 外部脚本引入 | china-geo、ECharts、globe.gl、GSAP |
| 3242-3661 | 主逻辑 JS | 数据层、地图、交互、动画 |

### 3. 核心 JS 模块（`<script>` 区）

| 功能模块 | 关键函数/变量 | 说明 |
|----------|--------------|------|
| 数据层 | `IndexedDB`（TravelPhotosDB）| 照片存储，`cityMeta` 仓库存城市元数据 |
| 城市元数据 | `getCityMeta()`/`setCityMeta()`/`cityMetaCache` | 字段：`coverImage`、`description`、`visitMonth`(YYYY-MM)、`rating`(0-5)、`attractions[]` |
| 景点数据 | `attractions[].{id,name,photos[],notes,visitDate(YYYY-MM-DD)}` | 每个景点含照片数组、备注、游玩日期 |
| 地图渲染 | `myChart`(ECharts实例)、`updateScatterData()` | 散点图叠加地图，已点亮城市高亮 |
| 地图交互 | `myChart.on('click'/'dblclick')` | 单击→城市弹窗；双击已点亮→详情页 |
| 状态刷新 | `refreshState()` | 遍历照片统计 `photoCountByCity`、`totalAttractionCount` |
| 详情页 | `openAttractionDetail(city)` | 加载城市 meta，渲染封面/简介/景点网格 |
| 景点渲染 | `renderAttractionDetailList(attractions)` | 生成卡片，绑定单击编辑/双击轮播 |
| 照片查看器 | `openPhotoViewer(photos,idx,loop,opts)` | 1.1倍旋转木马，虚化封面背景 |
| 城市弹窗 | `openCityModal(cityData)` | 城市编辑（简介、星级、年月、景点增删） |

---

## 四、城市详情页（`#attDetailOverlay`）当前结构

这是本次会话的核心修改区域。当前 HTML 结构（第 3147-3188 行）：

```
#attDetailOverlay（详情页根容器）
├── .att-detail-bg #attDetailBg          ← 虚化城市封面背景（保留不动）
├── #attDetailCloseBtn                     ← 右上角关闭按钮（保留不动）
├── .att-tech-deco                         ← 科技装饰层（z-index:5）
│   ├── .att-tech-grid                     ← 极低透明度网格辅助线
│   ├── .att-tech-side-l / -r             ← 左右竖向流动蓝光条
│   └── .att-tech-particles #attTechParticles ← 12个GSAP漂浮粒子
└── .att-detail-inner                      ← 内容容器（z-index:10）
    ├── h1.att-detail-city-name           ← 金色城市大标题（保留不动）
    ├── .att-desc-wrap #attDescWrap       ← 城市简介（透明无背景边框）
    │   └── .att-detail-desc #attDetailDesc
    ├── .att-info-bar #attInfoBar         ← 数据信息栏（玻璃面板，横向4项）
    │   ├── 游玩年月 / 推荐星级 / 景点总数 / 相册影像
    ├── .att-grid-title（隐藏占位）
    └── .att-grid #attDetailBody          ← 景点网格卡片（无外层包装）
```

---

## 五、本次会话全部修改记录（按时间顺序）

### 修改 1：景点卡片视觉增强
**目标**：封面背景更清晰、文字更醒目、新增游玩日期显示

| 修改点 | 修改前 | 修改后 |
|--------|--------|--------|
| 背景模糊 | `blur(8px)` | `blur(4px)` |
| 背景亮度 | `brightness(0.65)` | `brightness(0.70)` |
| 城市简介字号 | 15px / weight 500 | 17px / weight 600 |
| 简介颜色 | `rgba(255,255,255,.78)` | `rgba(255,255,255,.92)` |
| 城市名字号 | 12px | 13px→14px |
| 景点名字号 | 22px | 24px→26px |
| 新增 | — | `.att-card-date` 游玩年月日显示（YYYY年M月D日）|

### 修改 2：Shiny Text 闪光效果 + 缓慢呈现
**目标**：参照 reactbits.dev/shiny-text，景点文字应用闪光扫过效果

- 新增 `.shiny-text` CSS 类：`linear-gradient` + `background-clip:text` + `shinySweep` 动画（110°渐变，金色基底+白色高光带循环扫过）
- 景点标题应用 Shiny Text，景点名应用白底金光 Shiny
- 城市简介新增 `descReveal` 动画：`clip-path` 从左到右逐字呈现（1.6s）
- 删除标题英文 `ATTRACTIONS`

### 修改 3：design-taste skill 配色检视
**目标**：修复纯白文字与暖金背景不搭的问题

- 城市简介文字色：`#ffffff`（纯白）→ `#f5e6c8`（暖香槟色），与金色标题 `#e8c068` 同色系
- text-shadow：纯黑 `rgba(0,0,0,...)` → 暖棕 `rgba(20,12,4,...)`

### 修改 4：删除"景点·数量"标题
- 移除详情页 `景点 · N` 字样，`#attGridTitle` 设为 `display:none`

### 修改 5：地图双击已点亮城市跳转详情页
**目标**：双击地图上已点亮城市散点直接进入详情页

- 新增 `myChart.on('dblclick')` 事件，判断 `photoCountByCity.has(cityKey)` 后调用 `openAttractionDetail()`
- **单击/双击冲突修复**：已点亮城市单击延迟 250ms（`pendingClickTimer`），dblclick 触发时 `clearTimeout` 取消挂起的单击，避免弹窗与详情页冲突
- 未点亮城市单击立即响应（无双击需求）

### 修改 6：城市详情页大幅增强（新增5大模块）
**目标**：补充内容、提升饱满度、强化深色科技质感

新增模块：
1. **数据信息栏** `.att-info-bar`：玻璃面板横向4项（游玩年月/推荐星级/景点总数/相册影像），金色数值带呼吸发光
2. **城市简介玻璃面板** `.att-desc-wrap`（后改为透明）
3. **景点网格玻璃包装** `.att-grid-wrap`（后删除）
4. **底部统计光条** `.att-stats-bar`（后删除）
5. **全局科技装饰层** `.att-tech-deco`：网格辅助线 + 竖向流动蓝光条 + 12个GSAP漂浮粒子

新增 JS 函数：
- `fillCityInfoBar(meta,attractions)` — 填充4项数据
- `fillCityStatsBar(meta,attractions)` — 填充底部统计（后移除调用）
- `initTechParticles()` — 生成12个粒子，GSAP yoyo 漂浮
- `playDetailEntrance()` — GSAP timeline 入场动画（标题→简介→数据栏→卡片）
- 全局变量 `window.totalAttractionCount` — 在 `refreshState()` 中计算

卡片增强：
- hover：`translateY(-8px) scale(1.02)` + 蓝色外发光 `rgba(100,170,255,.25)`
- 新增 `.att-card-photo-count`：右上角照片数量小字徽章

### 修改 7：布局调整（最终当前状态）
**目标**：精简视觉，调整顺序

| 调整项 | 操作 |
|--------|------|
| 景点卡片玻璃包装边框 | **删除** `.att-grid-wrap`，卡片直接展示 |
| 底部统计光条 | **删除** `.att-stats-bar` 及 `fillCityStatsBar` 调用 |
| 简介与数据栏位置 | **互换**：简介在上（紧接标题），数据栏在下 |
| 简介背景边框 | **删除**：`.att-desc-wrap` 改为全透明 `background:transparent;border:none` |
| 简介尺寸 | 字号 17→18px，行高 1.85→1.9 |
| GSAP动画顺序 | 标题→简介→数据栏→景点卡片（移除统计栏）|

---

## 六、关键代码位置索引

便于后续 Agent 快速定位：

| 功能 | 文件 | 行范围（约） |
|------|------|-------------|
| 详情页 HTML 结构 | index.html | 3147-3188 |
| 详情页 CSS | index.html | 1760-2010 |
| 科技装饰层 CSS | index.html | 1850-1880 |
| 数据信息栏 CSS | index.html | 1875-1900 |
| 简介容器 CSS | index.html | 1889-1900 |
| 景点卡片 CSS | index.html | 1960-2010 |
| `openAttractionDetail()` | index.html | 6344-6384 |
| `fillCityInfoBar()` | index.html | 6406-6430 |
| `initTechParticles()` | index.html | 6455-6475 |
| `playDetailEntrance()` | index.html | 6480-6490 |
| `renderAttractionDetailList()` | index.html | 6516-6600 |
| 地图 click/dblclick | index.html | 4306-4330 |
| `refreshState()` | index.html | 6296-6329 |

---

## 七、GitHub 推送全流程

### 前置条件
- 本地已安装 Git
- 已有 GitHub 账号
- 项目目录：`f:\trae\1\Your-China-Travel`

### 步骤 1：初始化本地 Git 仓库（若尚未初始化）

```powershell
cd f:\trae\1\Your-China-Travel
git init
git add .
git commit -m "feat: 记录我的中国行 - 城市详情页视觉增强与交互优化"
```

### 步骤 2：在 GitHub 创建远程仓库

1. 登录 GitHub → 点击 `+` → `New repository`
2. 仓库名填 `Your-China-Travel`
3. 选择 `Public` 或 `Private`
4. **不要**勾选 "Add a README"（本地已有）
5. 点击 `Create repository`

### 步骤 3：关联远程仓库并推送

```powershell
# 关联远程仓库（替换 YOUR_USERNAME 为你的 GitHub 用户名）
git remote add origin https://github.com/YOUR_USERNAME/Your-China-Travel.git

# 重命名主分支为 main（GitHub 默认）
git branch -M main

# 首次推送
git push -u origin main
```

### 步骤 4：后续修改的增量推送

每次修改 `index.html` 后：

```powershell
cd f:\trae\1\Your-China-Travel
git add index.html
git commit -m "style: 城市详情页布局调整 - 简介与数据栏互换、移除玻璃包装"
git push
```

### 步骤 5：使用 GitHub CLI（可选，更便捷）

若安装了 `gh` CLI：

```powershell
# 一键创建仓库并推送
cd f:\trae\1\Your-China-Travel
gh repo create Your-China-Travel --public --source=. --push
```

### 步骤 6：认证方式

- **HTTPS**：推送时输入 GitHub 用户名 + Personal Access Token（非密码）
  - Token 生成：GitHub → Settings → Developer settings → Personal access tokens → Generate new token（勾选 `repo` 权限）
- **SSH**（推荐）：配置 SSH key 后无需每次输入凭证
  ```powershell
  ssh-keygen -t ed25519 -C "your_email@example.com"
  # 将 ~/.ssh/id_ed25519.pub 内容添加到 GitHub → Settings → SSH and GPG keys
  git remote set-url origin git@github.com:YOUR_USERNAME/Your-China-Travel.git
  ```

### .gitignore 已有内容

项目根目录 `.gitignore` 已配置，无需额外修改。

---

## 八、本地预览方式

```powershell
# 方式1：Python 简易服务器
cd f:\trae\1\Your-China-Travel
python -m http.server 8765
# 浏览器打开 http://localhost:8765/

# 方式2：Node http-server
npx http-server -p 8765
```

---

## 九、注意事项

1. **IndexedDB 数据本地化**：照片和城市记录存浏览器本地，不同设备数据独立，这是项目固有设计
2. **地图数据依赖外网**：需能访问 `geo.datav.aliyun.com`，内网无外网时地图无法加载
3. **ECharts CDN 回退**：已配置 4 重 CDN 回退（jsdelivr / fastly / bootcdn / unpkg）
4. **修改原则**：所有修改均保留原有功能（虚化背景、金色标题、关闭按钮、卡片交互、旋转木马、编辑弹窗、3D地球、旅行轨迹等）
5. **动画引擎**：GSAP 3.12.5 已通过 CDN 加载（第 3218 行），新增动画均使用 GSAP timeline 管理

---

## 十、本次会话使用的工具与 Skill

- **solo-design skill**：页面编辑主流程规范
- **design-taste-frontend skill**：配色检视（taste-skill），修复纯白与暖金背景不搭问题
- **integrated_browser MCP**：浏览器自动化验证（导航、点击、截图、JS评估）
- **WebFetch**：获取 reactbits.dev/shiny-text 参考效果

---

*文档生成时间：2026-07-21*
*项目路径：f:\trae\1\Your-China-Travel*
*主文件：index.html（8544行）*
