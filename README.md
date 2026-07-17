# 「记录我的中国行」部署文档

> 单文件 HTML 原生项目（内联 CSS/JS，322KB），无需构建。所有流星、星空、流体、镜面按钮、地图拖拽动画完整保留。

## 项目结构

```
deploy/
├── index.html          # 主页面（含全部内联 CSS/JS/动画）
├── vercel.json         # Vercel 云端部署配置
├── nginx.conf          # Nginx 服务器配置
├── Dockerfile          # Docker 容器化部署
├── docker-compose.yml  # 一键编排
└── README.md           # 本文档
```

## 外部依赖（运行时 CDN 加载，无需打包）

| 依赖 | 用途 | CDN 来源 |
|------|------|----------|
| Inter 可变字体 | Variable Proximity 标题动画 | fonts.googleapis.com |
| ECharts 5.4.3 | 中国地图渲染/缩放/拖拽 | jsdelivr / bootcdn / unpkg（4 重回退） |
| 中国 GeoJSON | 省份边界数据 | geo.datav.aliyun.com |

## 数据存储说明

照片与城市记录使用 **IndexedDB** 存储在浏览器本地。不同电脑/浏览器数据独立，属项目固有设计，部署方案不改变此特性。

---

## 方案一：Vercel 云端免费公网域名（推荐，5 分钟上线）

### 前置准备
- 注册 GitHub 账号（[github.com](https://github.com)）
- 注册 Vercel 账号（[vercel.com](https://vercel.com)，可用 GitHub 一键登录）

### 步骤 1：上传到 GitHub

1. 在 GitHub 新建仓库（例如 `china-travel`）
2. 将 `deploy/` 目录下所有文件上传到仓库根目录：
   ```
   china-travel/
   ├── index.html
   ├── vercel.json
   └── README.md
   ```

### 步骤 2：Vercel 导入部署

1. 登录 [vercel.com](https://vercel.com) → 点击 **Add New Project**
2. 选择刚创建的 GitHub 仓库 → **Import**
3. 部署配置（Vercel 会自动识别，无需手动填）：
   - Framework Preset: `Other`
   - Root Directory: `./`
   - Build Command: 留空（无需构建）
   - Output Directory: 留空
4. 点击 **Deploy** → 等待 30 秒部署完成

### 步骤 3：访问公网域名

- 部署完成后获得域名：`https://china-travel-xxx.vercel.app`
- 可在 Settings → Domains 绑定自定义域名

### vercel.json 关键配置说明

```json
{
  "cleanUrls": true,        // 自动去除 .html 后缀，/index.html → /
  "trailingSlash": false,   // 统一无尾斜杠，避免重复缓存
  "headers": [              // 安全头 + 缓存策略
    { "source": "/(.*)", "headers": [安全头] },
    { "source": "/", "headers": [禁用强缓存] }
  ]
}
```

### 部署修改点
- 如需修改页面：编辑 `index.html` → push 到 GitHub → Vercel 自动重新部署
- 如需自定义域名：Vercel 控制台 → Settings → Domains → 添加域名并配置 DNS

---

## 方案二：Nginx 局域网本地部署

### 方式 A：Docker 一键部署（推荐，最简单）

**前置**：安装 [Docker Desktop](https://www.docker.com/products/docker-desktop)

```bash
# 进入 deploy 目录
cd deploy

# 构建并启动容器
docker-compose up -d

# 访问
# 本机：    http://localhost:8080
# 局域网：  http://你的IP:8080（如 http://192.168.1.100:8080）
```

停止与更新：
```bash
# 停止
docker-compose down

# 修改 index.html 后重启（挂载了卷，无需重新构建）
docker-compose restart
```

### 方式 B：直接安装 Nginx

#### Windows 安装 Nginx

1. 下载 [nginx Windows 版](http://nginx.org/en/download.html) 解压到 `C:\nginx`
2. 复制文件：
   ```
   deploy\index.html   →  C:\nginx\html\index.html
   deploy\nginx.conf   →  C:\nginx\conf\conf.d\default.conf
   ```
   并修改 `nginx.conf` 第 18 行 root 路径为 `C:/nginx/html;`
3. 修改主配置 `C:\nginx\conf\nginx.conf`，在 `http {}` 块内引入：
   ```nginx
   include conf.d/*.conf;
   ```
4. 启动：
   ```bash
   cd C:\nginx
   start nginx.exe
   ```
5. 访问 `http://localhost`

#### Linux 安装 Nginx

```bash
# Ubuntu/Debian
sudo apt update && sudo apt install -y nginx

# 复制文件
sudo mkdir -p /var/www/china-travel
sudo cp deploy/index.html /var/www/china-travel/index.html
sudo cp deploy/nginx.conf /etc/nginx/conf.d/china-travel.conf

# 修改 nginx.conf 中的 root 路径
sudo sed -i 's|root  /usr/share/nginx/html;|root  /var/www/china-travel;|' /etc/nginx/conf.d/china-travel.conf

# 测试配置 + 重载
sudo nginx -t && sudo systemctl reload nginx

# 开放防火墙
sudo ufw allow 80

# 访问 http://服务器IP
```

### nginx.conf 关键配置说明

```nginx
gzip on;                    # 压缩 322KB 单文件，传输体积降至 ~60KB
gzip_comp_level 6;          # 压缩级别（1-9，6 平衡速度与体积）

location / {
    try_files $uri $uri/ /index.html;   # 静态回退，杜绝刷新 404
}

location = /index.html {
    add_header Cache-Control "no-cache"; # HTML 禁用强缓存，便于更新生效
}
```

---

## 性能与动画完整性保障

### 已优化项
1. **资源预连接**：HTML head 已添加 `dns-prefetch`，预解析 jsdelivr/unpkg/datav 域名，降低 ECharts 首屏加载耗时
2. **ECharts 4 重 CDN 回退**：主 CDN 失败自动切换备用，保障地图组件可用
3. **gzip 压缩**：nginx.conf 开启 level 6 压缩，322KB → ~60KB
4. **地图交互优化**：georoam 事件 rAF 节流 + 标签计算防抖 + 纯平移跳过 setOption（见 HTML 注释）
5. **背景降帧**：ferrofluid 流体背景 30fps，释放 GPU 给地图交互
6. **VP 标题缓存**：Variable Proximity 坐标缓存，消除每帧 getBoundingClientRect 强制重排

### 跨电脑动画完整性

所有动画均为**纯前端实现**，无服务端依赖，任何电脑打开均可完整运行：
- 流星动画：CSS keyframes + JS 动态注入（卡片内）
- 星空/流体：Canvas + requestAnimationFrame（ferrofluid 降帧版）
- 镜面按钮：CSS specular-button + tlSpecSweep 扫光动画
- 地图拖拽缩放：ECharts canvas renderer + roam

### 浏览器兼容性
- Chrome / Edge 90+（推荐）
- Firefox 88+
- Safari 14+
- 需启用 JavaScript + IndexedDB

---

## 常见问题

**Q：刷新页面 404？**
A：nginx.conf 已配置 `try_files $uri $uri/ /index.html` 回退；Vercel 默认支持单页回退，不会 404。

**Q：地图不显示？**
A：检查网络能否访问 `geo.datav.aliyun.com`（中国地图数据 CDN）。内网无外网时地图数据无法加载。

**Q：照片在另一台电脑看不到？**
A：照片存 IndexedDB（浏览器本地），属设计如此。换电脑需重新添加。

**Q：ECharts 加载失败？**
A：4 个 CDN 均已配置回退。若全失败（极端网络环境），可将 ECharts 下载到本地并在 index.html 中改用相对路径引用。
