const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');
const source=fs.readFileSync(require('node:path').join(__dirname,'../assets/memory-share.js'),'utf8');
function runtime(extra={}){
  const context=vm.createContext({window:{TRAVEL_SUPABASE_CONFIG:{url:'https://example.test'}},AbortController,TextEncoder,URL,
    setTimeout:(fn,ms)=>setTimeout(fn,Math.min(ms,10)),clearTimeout,...extra});
  vm.runInContext(source,context);return context.window.MemoryShelfShare;
}
async function bounded(promise){return Promise.race([promise,new Promise((_,reject)=>setTimeout(()=>reject(new Error('流程未结束')),150))]);}
test('上传没有响应时结束等待并取消请求',async()=>{
  let signal;
  const share=runtime({fetch:(_url,options)=>{signal=options.signal;return new Promise(()=>{});}});
  await assert.rejects(bounded(share.request({action:'publish'})),/上传.*超时/);
  assert.equal(signal.aborted,true);
});
test('照片加载没有响应时显示读取超时',async()=>{
  const share=runtime({Image:class{set src(value){}},document:{}});
  await assert.rejects(bounded(share.create([{name:'省份',cities:[{name:'城市'}]}],async()=>[{dataUrl:'data:image/jpeg;base64,AA=='}],()=>{})),/照片.*超时/);
});
test('读取城市照片没有响应时结束等待',async()=>{
  const share=runtime();
  await assert.rejects(bounded(share.create([{name:'省份',cities:[{name:'城市'}]}],()=>new Promise(()=>{}),()=>{})),/读取.*超时/);
});
test('生成过程在页面显示进度，失败后按钮恢复且错误保留',async()=>{
  const html=fs.readFileSync(require('node:path').join(__dirname,'../index.html'),'utf8');
  const handler=html.slice(html.indexOf('  let memoryProvinceSharing='),html.indexOf('  function closeMemoryShelf()'));
  const button={disabled:false,textContent:'分享书架'},intro={textContent:'原始介绍',setAttribute(){}},nodes={memoryShelfShare:button,memoryShelfIntro:intro};
  let progress;const province={name:'湖北省',cities:[]};
  const context={button,province,$:id=>nodes[id],confirm:()=>true,getPhotosByCity:()=>{},toast:()=>{},
    MemoryShelfShare:{create:async(books,_photos,update)=>{assert.equal(books.length,1);assert.equal(books[0],province);update('正在上传分享内容…');progress=intro.textContent;throw new Error('上传超时，请重试');}}};
  await vm.runInNewContext(handler+'\nshareMemoryProvince(button,province);',context);
  assert.equal(progress,'正在上传分享内容…');assert.equal(button.disabled,false);
  assert.equal(button.textContent,'分享');assert.match(intro.textContent,/上传超时/);
});
test('分享接口拒绝一次上传多个省份',async()=>{
  await assert.rejects(runtime().create([{name:'湖北省'},{name:'浙江省'}],()=>{},()=>{}),/选择一个省份/);
});
