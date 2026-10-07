# 旅途照片流

基于 Haichao Li 的 Undertow 模板修改：
https://github.com/HaichaoLihc/create-photo-flipbook-ui/tree/main/ui-collections/stream-implement-3d
原始代码 MIT 授权，见 LICENSE。

城市照片页面的星空改编自 React Bits Galaxy（David Haz，2026），
授权为 MIT + Commons Clause，完整授权及来源保留在 js/galaxy.js 和打包文件中。
仅作为本网站背景使用，不独立销售或分发该组件。
密度 1.1、闪烁强度 0.4，无鼠标扰动；背景位于照片下层且中央压暗。
空格暂停、查看大图、返回或页面隐藏时停止背景绘制，减少动态效果时使用静态星空。

总览页另使用 React Bits Lightfall，颜色为 #035bea、#370aea、#e60cdf。
完整授权及来源保留在 js/lightfall.js 与打包文件中。底景复用光瀑绘制流程，
限制绘制分辨率、降低亮度并保护前景照片，中央背景进一步压暗，不接收鼠标输入。
空格暂停时底景停止更新；减少动态效果时使用静态底景，进入城市相册后停止绘制总览背景。

从主页面“照片流”按钮进入。统一通过内嵌 srcdoc 读取主页面的 TravelPhotoStreamBridge，
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

可以直接双击项目根目录的 index.html，再点击“照片流”，不需要终端或本地服务。
请保留 assets/photo-stream/ 文件夹，不能只移动根目录 HTML。
运行时只使用预生成的 embedded.js，包含普通脚本、样式和画面结构，不加载 ES modules。
修改照片流源文件后，开发者执行 `node assets/photo-stream/build-embedded.cjs` 更新打包文件；用户无需执行。
旧的独立 HTML/模块加载入口已取消；HTTP / HTTPS 访问也复用同一份内嵌版本。
template.html、style.css、js/ 和 build-embedded.cjs 是打包维护源码，不是另一套运行入口。
file:// 与 localhost/网站的浏览器资料不互通，若看不到原资料，需要在新入口导入或同步。
照片流本地组件无需联网，云端照片及主站其他在线资源仍依赖网络。
部署时保留 assets/photo-stream/ 全部文件；现有 Docker COPY assets 已覆盖此目录。

滚轮 / 双指缩放，拖动平移，点击光线展开，方向键 / 回车选择，空格暂停。
“照片目录”列出全部城市照片，点击会定位到对应城市及照片；关闭会释放 GPU 资源。
不支持 WebGL 2 的设备自动显示照片目录，仍可查看和放大照片。
