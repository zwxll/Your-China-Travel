const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');
const source=fs.readFileSync(require('node:path').join(__dirname,'../assets/memory-share.js'),'utf8');
function runtime(extra={}){
  const saved=new Map();
  const context=vm.createContext({window:{TRAVEL_SUPABASE_CONFIG:{url:'https://example.test'}},AbortController,TextEncoder,URL,crypto:require('node:crypto').webcrypto,
    localStorage:{getItem:key=>saved.get(key)||null,setItem:(key,value)=>saved.set(key,value),removeItem:key=>saved.delete(key)},
    fetch:async()=>({ok:true,json:async()=>({browserUsed:0,browserReserved:0,browserLimit:50000000,globalUsed:0,globalReserved:0,globalLimit:800000000})}),
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
test('分享接口允许多个省份，但没有照片时不上传',async()=>{
  await assert.rejects(runtime().create([{name:'湖北省',cities:[]},{name:'浙江省',cities:[]}],async()=>[],()=>{}),/还没有可分享/);
});
test('匿名凭证不能持久化时，上传前明确报错',async()=>{
  let calls=0;const share=runtime({localStorage:{getItem:()=>null,setItem:()=>{throw new Error('denied');}},fetch:()=>{calls++;}});
  await assert.rejects(share.create([{name:'省份',cities:[]}],async()=>[],()=>{}),/无法保存匿名凭证/);assert.equal(calls,0);
});
