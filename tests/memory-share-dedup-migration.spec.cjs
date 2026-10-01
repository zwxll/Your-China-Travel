const {test}=require('node:test'),assert=require('node:assert/strict');
const dataUrl='data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAoHBwgHBgoICAgLCgoLDhgQDg0NDh0VFhEYIx8lJCIfIiEmKzcvJik0KSEiMEExNDk7Pj4+JS5ESUM8SDc9Pjv/2wBDAQoLCw4NDhwQEBw7KCIoOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozv/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAf/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFAEBAAAAAAAAAAAAAAAAAAAAAP/EABQRAQAAAAAAAAAAAAAAAAAAAAD/2gAMAwEAAhEDEQA/AIyAD//Z';
test('旧 v1 原 JPEG 不重新编码，封面及重复位置复用，最后一步才切换',async()=>{
  const {migrateLegacyShare}=await import('../supabase/functions/memory-shelf-share/legacy-migration.mjs');
  const snapshot={version:1,provinces:[{name:'浙江省',cover:dataUrl,cities:[{name:'杭州',photos:[{name:'一',dataUrl},{name:'二',dataUrl}]}]}]},calls=[];let manifest,uploaded;
  const rpc=async(action,input)=>{calls.push(action);if(action==='migrate-read')return {snapshot};if(action==='migrate-start'){manifest=input.manifest;return {shareId:'draft',uploadedIds:[]};}if(action==='migrate-file')return {ready:false};return {};};
  const result=await migrateLegacyShare({}, {shareId:'12345678-1234-4234-8234-123456789abc'},rpc,async(auth,id,src)=>{uploaded=src;});
  assert.equal(uploaded,dataUrl);assert.equal(manifest.files.length,1);assert.equal(manifest.totalBytes,285);
  assert.equal(manifest.provinces[0].cities[0].photos.length,2);assert.equal(result.done,true);assert.equal(calls.at(-1),'migrate-finish');assert.equal(snapshot.version,1);
});
test('旧 v2 缺失对象时不能登记采纳或替换旧目录',async()=>{
  const {migrateLegacyShare}=await import('../supabase/functions/memory-shelf-share/legacy-migration.mjs');
  const snapshot={version:2,storagePrefix:'old',provinces:[{name:'浙江',cities:[{name:'杭州',photos:[{fileId:'a'}]}]}],files:[{fileId:'a',bytes:100,sha256:'a'.repeat(64)}]};
  const actions=[],rpc=async(action)=>{actions.push(action);return action==='migrate-read'?{snapshot}:{shareId:'draft',uploadedIds:[]};};
  const db={storage:{from:()=>({download:async()=>({error:{message:'missing'}})})}};
  await assert.rejects(()=>migrateLegacyShare(db,{shareId:'12345678-1234-4234-8234-123456789abc'},rpc,async()=>{}),/旧照片/);
  assert.equal(actions.includes('migrate-file'),false);assert.equal(actions.includes('migrate-finish'),false);
});
