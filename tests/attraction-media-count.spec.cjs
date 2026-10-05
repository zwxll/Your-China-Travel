const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');

const html=fs.readFileSync(path.join(__dirname,'../index.html'),'utf8');
const countStart=html.indexOf('  function countMedia(items){');
const countEnd=html.indexOf('  function formatMediaCounts',countStart);
const badgeStart=html.indexOf('  function attractionMediaBadgeHtml(items){');
const badgeEnd=html.indexOf('\n  function ',badgeStart+3);

assert.ok(countStart>=0&&countEnd>countStart,'应保留统一的媒体计数函数');
assert.ok(badgeStart>=0&&badgeEnd>badgeStart,'应提供景点卡片媒体计数渲染函数');

const createBadge=new Function(
  html.slice(countStart,countEnd)+html.slice(badgeStart,badgeEnd)+'return attractionMediaBadgeHtml;'
)();

const mixed=createBadge([
  {},
  {kind:'image'},
  {kind:'image'},
  {kind:'image'},
  {kind:'video'},
]);
assert.match(mixed,/data-media-kind="image"[^>]*aria-label="4 张照片"/,'照片图标应显示照片数量');
assert.match(mixed,/data-media-kind="video"[^>]*aria-label="1 个视频"/,'视频图标应显示视频数量');

const empty=createBadge([]);
assert.match(empty,/aria-label="0 张照片"/,'无照片时仍明确显示 0');
assert.match(empty,/aria-label="0 个视频"/,'无视频时仍明确显示 0');

assert.match(html,/pcount\.innerHTML=attractionMediaBadgeHtml\(att\.photos\|\|\[\]\)/,'景点卡片应使用分类后的媒体计数');
console.log('PASS: 景点卡片分别显示照片与视频图标和数量');
