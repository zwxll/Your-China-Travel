# 年份旅行照片图谱

直接复用 [Haichao Li / Image Atlas](https://github.com/HaichaoLihc/create-photo-flipbook-ui/tree/main/ui-collections/image-atlas)，MIT，原版 app.js blob `bcbba3c6099ccf75ec40b1f7ced0002d8012a593`。

保留原版年轮位置计算、CSS 3D、相机缓动、拖动/滚轮/双指操作、年份导航、搜索、照片聚焦和键盘浏览。仅替换数据与文案，增加年份归属选择，移除示例专用 WebMCP 注册。

双击主 index.html → 人生足迹时间轴 → 按年份看照片。无需启动服务器，未复制示例照片。经典脚本 embedded.js 将模板、CSS、JS 注入 srcdoc，隔离现有页面样式。

data.js 读取主页面现有城市相册照片，排除视频；未明确标注照片日期时，按城市最早一次到访的年份归类，即使有多个时间段也取最早年份。完全没有旅行日期才放入“年份未确定”。不使用上传 timestamp。选中照片可修改归属年份，存于现有 IndexedDB settings / imageAtlasYears（本机设置，不新增表、不复制原图）。更换数据库或导入另一份数据后，ID 可能变化；该设置不作为云端或导出照片日期。

修改源码后运行 `node assets/image-atlas/build-embedded.cjs` 更新随项目分发的 embedded.js。最终用户不需要执行此步骤。
