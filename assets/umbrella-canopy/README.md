# 伞幕照片

原场景来自 Haichao Li 的 Umbrella Canopy：
https://github.com/HaichaoLihc/visual-experience-demo/tree/main/experiences/umbrella-canopy

保留原站 scene.js 的纸伞、水晶、花毯、镜头与拾取实现；环境改为河畔花园。main.js 适配本地照片加载、中文界面及 srcdoc 导航。
vendor/ 是原站同版本 Three.js / OrbitControls，保留其源码内版权信息。
原仓库根目录未发现独立 LICENSE 文件；不自行宣称该场景具有 MIT 授权。再次公开分发前请核对原作者授权。

照片只读取现有城市相册，与年轮照片共用 TravelImageAtlas.collect；排除视频，不增加景点或封面照片，不重复读取跨次到访城市。
临时缩略图最长边 768px，不修改原图，不写入数据库。没有照片时显示提示。

使用：双击项目 index.html → 旅途影像 → 右上角「伞幕照片」。不需要服务器。
返回关闭 iframe 并释放 WebGL 上下文。

修改源文件后：`node assets/umbrella-canopy/build-embedded.cjs <esbuild模块路径>`。
embedded.js 是生成的离线入口；运行网站无需 esbuild 或 Node。

## 伞下花园（2026-10-06）

花草复用 Steve245270533/three-stylized 的 Grass / Wildflowers：
https://github.com/Steve245270533/three-stylized

完整组件源码和 MIT 许可证位于 vendor/garden；UPSTREAM.json 保存下载时的 tree 和文件 SHA。离线 bundle 保留花草组件的完整许可证；水面源码留档但不再引入或绘制。
不引入示例应用、React、在线贴图或远程模块。garden.js 只负责紧凑花园、暖色天空和预算配置，上游源码保持原样。
移除河流和远景地面，使用半径 13、96 个三角形的小花园，边缘透明渐隐到暖米色背景。花草分布在半径 3.4～12.5，延伸到伞下。桌面草叶密度 12，手机初次打开时 4；野花分别最多 2400 / 800。
flowers.js 在接入层扩展原组件的纹理、实例颜色和尺寸：保留雏菊、花穗、分枝小花，新增波斯菊、铃铛花、勿忘草风格花型。六种轮廓使用同一个实例网格，奶白、浅粉、淡紫和浅蓝配色，黄色花心；高度约 0.36～1.0，按小花丛分布。第三方源码不改，风动画、释放机制沿用原组件。
中央花瓣毯半径缩小到原先 40%，实例从 9200 减少到 1800，留出自然花草空间。
背景使用伞幕现有时钟及暂停机制，减少动态效果时保持静止，不创建第二套动画循环。
旧展厅构建方法不再调用。照片关闭雾化，保留原图颜色；城市窗口、缩略图滚动及伞幕操作不变。
