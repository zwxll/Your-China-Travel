# 旅途照片流

基于 Haichao Li 的 Undertow 模板修改：
https://github.com/HaichaoLihc/create-photo-flipbook-ui/tree/main/ui-collections/stream-implement-3d
原始代码 MIT 授权，见 LICENSE。

从主页面“照片流”按钮进入。通过同源 iframe 读取主页面的 TravelPhotoStreamBridge，
汇集用户的城市照片、景点照片、城市封面和自定义省份书籍封面，排除视频，
按图片内容或存储路径去重。不读取示例图库，不写入或更改旅行资料。
每批最多 48 张，前后切换批次可以查看全部照片；GPU 只持有当前批次。
每八张形成一条照片流，48 张最多使用六条照片流；每个故事只出现一次，
画面内不会反复铺满同一批照片。每张照片都能从目录准确打开。
日期和景点笔记来自已有资料，没有内置示例日期或游记。

运行主站时需通过 HTTP / HTTPS 访问（ES modules 无法通过 file:// 加载）。
可在项目根目录执行 `python -m http.server 8766`，打开 http://localhost:8766/。
部署时保留 assets/photo-stream/ 全部文件；现有 Docker COPY assets 已覆盖此目录。

滚轮 / 双指缩放，拖动平移，点击光线展开，方向键 / 回车选择，空格暂停。
“照片目录”按当前批次列出全部照片；切换批次会释放上批 GPU 资源。
不支持 WebGL 2 的设备自动显示照片目录，仍可查看和放大照片。
