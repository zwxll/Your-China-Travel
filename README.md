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

## 常见问题

**Q：刷新页面 404？**
A：nginx.conf 已配置 `try_files $uri $uri/ /index.html` 回退；Vercel 默认支持单页回退，不会 404。

**Q：地图不显示？**
A：检查网络能否访问 `geo.datav.aliyun.com`（中国地图数据 CDN）。内网无外网时地图数据无法加载。

**Q：照片在另一台电脑看不到？**
A：照片存 IndexedDB（浏览器本地），属设计如此。换电脑需重新添加。

**Q：ECharts 加载失败？**
A：4 个 CDN 均已配置回退。若全失败（极端网络环境），可将 ECharts 下载到本地并在 index.html 中改用相对路径引用。
