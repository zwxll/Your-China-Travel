const {test}=require('node:test');
const assert=require('node:assert/strict');
const {pathToFileURL}=require('node:url');
const {createHash}=require('node:crypto');
const path=require('node:path');
const implementation=import(pathToFileURL(path.resolve('supabase/functions/memory-shelf-share/storage-handler.mjs')));
const shareId='12345678-1234-4234-8234-123456789abc',managementKey='a'.repeat(64);
// Browser-encoded 1px blank JPEG, independent of personal pictures.
const dataUrl='data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAoHBwgHBgoICAgLCgoLDhgQDg0NDh0VFhEYIx8lJCIfIiEmKzcvJik0KSEiMEExNDk7Pj4+JS5ESUM8SDc9Pjv/2wBDAQoLCw4NDhwQEBw7KCIoOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozv/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAf/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFAEBAAAAAAAAAAAAAAAAAAAAAP/EABQRAQAAAAAAAAAAAAAAAAAAAAD/2gAMAwEAAhEDEQA/AIyAD//Z';
function database(snapshot){
  const calls=[],objects=new Map();let failMark=false,failDelete=false;
  const db={calls,objects,set failMark(v){failMark=v;},set failDelete(v){failDelete=v;},from(){return {select(){return this;},eq(){return this;},async maybeSingle(){return {data:snapshot?{snapshot}:null};}};},async rpc(name,{p_action,p_input}){
    calls.push(p_action);
    if(p_input.managementHash&&p_input.managementHash!==createHash('sha256').update(managementKey).digest('hex'))return {error:{message:'分享管理凭证无效'}};
    if(p_action.startsWith('upload-')&&(p_input.fileId!=='photo-1'||p_input.sha256!==createHash('sha256').update(Buffer.from(dataUrl.slice(23),'base64')).digest('hex')))return {error:{message:'照片与上传清单不符'}};
    if(p_action==='upload-done'&&failMark)return {error:{message:'database unavailable'}};
    return {data:p_action==='cancel-start'?{files:[{fileId:'photo-1'}]}:{shareId,uploadedIds:[]}};
  },storage:{from(){return {async upload(key,bytes){if(objects.has(key))return {error:{statusCode:409}};objects.set(key,bytes);return {};},async download(key){return {data:new Blob([objects.get(key)])};},async remove(keys){if(failDelete)return {error:{message:'unavailable'}};keys.forEach(k=>objects.delete(k));return {};},async createSignedUrls(keys){return {data:keys.map(path=>({path,signedUrl:'https://test.invalid/'+path}))};}};}}};
  return db;
}
test('未发布不可读取、旧快照兼容、旧上传拒绝',async()=>{
  const {handleStorageAction}=await implementation;
  await assert.rejects(()=>handleStorageAction({action:'read',shareId},database()),/尚未分享/);
  const old={version:1,provinces:[]};assert.deepEqual((await handleStorageAction({action:'read',shareId},database(old))).snapshot,old);
  await assert.rejects(()=>handleStorageAction({action:'publish',shareId},database()),/更新网页/);
});
test('文件重试检查实际对象，登记失败和删除失败不释放容量',async()=>{
  const {handleStorageAction}=await implementation,db=database(),input={action:'upload',shareId,managementKey,fileId:'photo-1',dataUrl};
  await handleStorageAction(input,db);await handleStorageAction(input,db);assert.equal(db.objects.size,1);
  await assert.rejects(()=>handleStorageAction({...input,managementKey:'b'.repeat(64)},db),/凭证/);
  await assert.rejects(()=>handleStorageAction({...input,fileId:'photo-2'},db),/清单/);
  const changed=dataUrl.slice(0,23)+Buffer.from([...Buffer.from(dataUrl.slice(23),'base64').subarray(0,-3),2,255,217]).toString('base64');
  await assert.rejects(()=>handleStorageAction({...input,dataUrl:changed},db),/清单/);
  db.objects.set(shareId+'/photo-1.jpg',new Uint8Array([1]));await assert.rejects(()=>handleStorageAction(input,db),/已有照片/);
  db.objects.clear();db.failMark=true;await assert.rejects(()=>handleStorageAction(input,db),/暂时不可用/);assert.equal(db.objects.size,1);assert.ok(!db.calls.includes('cancel-done'));
  db.failDelete=true;await assert.rejects(()=>handleStorageAction({action:'cancel',shareId,managementKey},db),/清理/);assert.ok(!db.calls.includes('cancel-done'));
  await assert.rejects(()=>handleStorageAction({...input,fileId:'../escape'},db),/编号/);
});
test('v2 按城市签名、目录不下发全部照片，拒绝目录外城市',async()=>{
  const {handleStorageAction}=await implementation,db=database({version:2,storagePrefix:shareId,provinces:[{name:'省',coverId:'photo-1',cities:[{name:'城',photos:[{name:'图',fileId:'photo-1'}]}]}]});
  const directory=await handleStorageAction({action:'read',shareId},db);assert.equal(directory.snapshot.provinces[0].cities[0].photoCount,1);assert.equal(directory.snapshot.provinces[0].cities[0].photos,undefined);
  const chapter=await handleStorageAction({action:'read-city',shareId,provinceIndex:0,cityIndex:0},db);assert.match(chapter.chapter.photos[0].dataUrl,/photo-1.jpg/);
  await assert.rejects(()=>handleStorageAction({action:'read-city',shareId,provinceIndex:0,cityIndex:2},db),/城市/);
});
