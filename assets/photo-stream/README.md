# 旅途照片流

基于 Haichao Li 的 Undertow 模板修改：
https://github.com/HaichaoLihc/create-photo-flipbook-ui/tree/main/ui-collections/stream-implement-3d
原始代码 MIT 授权，见 LICENSE。

从主页面“照片流”按钮进入。通过同源 iframe 读取主页面的 TravelPhotoStreamBridge，
与主页共用城市相册记录来源，排除视频，不额外加入景点照片或城市封面。
不按图片内容或存储路径合并记录，保留相册中每条独立的照片记录。
有照片的城市各对应一条光线；每条只包含该城市的完整照片序列。
不分页，不限制每城照片数为 8 或 48，也不填充随机故事。
省份书籍封面没有城市归属，因此不混入城市光线。
不读取示例图库，不写入或更改旅行资料。
GPU 使用 128×128 缩略图，以 4×4 图集打包到纹理数组，
城市及章节索引使用可变长度数据纹理。打开城市相册及灯箱时读取原图。
照片数量若超过设备纹理容量，仍可通过全部照片目录浏览。
日期来自已有城市资料，没有内置示例日期或游记。

运行主站时需通过 HTTP / HTTPS 访问（ES modules 无法通过 file:// 加载）。
可在项目根目录执行 `python -m http.server 8766`，打开 http://localhost:8766/。
部署时保留 assets/photo-stream/ 全部文件；现有 Docker COPY assets 已覆盖此目录。

滚轮 / 双指缩放，拖动平移，点击光线展开，方向键 / 回车选择，空格暂停。
“照片目录”列出全部城市照片，点击会定位到对应城市及照片；关闭会释放 GPU 资源。
不支持 WebGL 2 的设备自动显示照片目录，仍可查看和放大照片。
