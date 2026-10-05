# 年份照片图谱 Implementation Plan

> 使用 superpowers:executing-plans 在当前已获授权的项目内实施。

**Goal:** 人生足迹时间轴新增“按年份看照片”，直接复用 Haichao Li 的 Image Atlas。
**Architecture:** 原版 HTML/CSS/JS 嵌入独立 iframe，经典脚本支持 file://；数据适配器读取现有城市照片，年份补充信息存入现有 settings，不复制照片。
**Tech Stack:** 原生 JavaScript、IndexedDB、CSS 3D、Node tests、Edge/Playwright。
**Spec:** 用户本次已批准的方案：保留时间轴和穹顶，不使用上传 timestamp 推断旅行年份；跨年城市无明确归属则标为“年份未确定”，允许手动指定。

## Global Constraints

- 不改书架、翻页组件、已有照片存储结构；不引入模板虚构照片/日期。
- 保留 MIT 许可证与来源；双击主 index.html 可用。
- 当前脏工作区保留；不提交、不合并、不删除其他任务文件。

## Review Focus

- 历史照片无 kind、空相册、视频、多次到访不可造成漏图或重复。
- 空图谱不得显示 undefined 或产生无限深度。
- 跨年且时间不明的照片不能被上传日期误分类。
- file:// 下 iframe 不依赖模块、fetch、远程字体。
- 关闭和重新打开释放 iframe，年份保存失败明确提示。

### Task 1: 年份数据适配器

Files: assets/image-atlas/data.js; tests/image-atlas.spec.cjs。
Interface: collect(entries,getPhotosByCity,overrides) -> Promise<upstream image records[]>。
- [x] 写并运行失败测试：单年、跨年、未记录、重复到访、视频排除、手动归属。
- [x] 最小实现并运行同一测试，预期全通过。

### Task 2: 上游运行时及页面入口

Files: assets/image-atlas/{app.js,template.html,styles.css,build-embedded.cjs,embedded.js,LICENSE,README.md}; index.html。
Interface: ImageAtlasDocument(records) -> srcdoc HTML；iframe 发送 atlas-year 消息（id/year），父页面验证来源与值后保存 settings 并重载。
- [x] 保留原版排布、动画、搜索、选择照片及输入事件，替换演示数据和文案。
- [x] 加入口、返回按钮和持久化；关闭 iframe 释放动画。
- [x] 运行 Edge file:// 测试，预期搜索、年份、看图、手动归属、手机和空数据均正常。
- [x] 运行现有 tests/*.spec.cjs 回归；检查任务范围 diff，记录验证结果。

## Execution ledger

- 已读取完整上游 app.js/template/styles 和 MIT 许可证；布局与交互直接复用。
- 采用用户已批准的当前项目直接修改方式；无自动提交。
- Task 1 complete: 数据适配单元测试 2/2，通过前已验证失败。
- Task 2: Edge 双击路径和穹顶回归 5/5；首轮全套 76 项中 74 通过、2 个既有数据库联机测试跳过、0 失败。
- Final review: 独立只读审查发现 2 项重要问题（空日期无法补年份，select 的方向键被截获），各自加入 Edge 回归并先失败后通过。已增加用户手填年份，父页面只接受 1000–9999 整数或 null，方向键排除 select。
- Review scope: 既有脏改动和上游布局架构不修改；全套回归单独验证。手动年份为当前浏览器设置，不改变云端/导出字段，按已批准复用存储、不复制照片的边界实施。
- Final verification after review fixes: `node --test tests/*.spec.cjs` → 76 项，74 通过、0 失败、2 个数据库联机测试跳过；Edge file:// 覆盖新增键盘选择、全无日期时手填年份。主页面 7 段内联脚本语法通过，git diff --check 无空白错误。
