const {test}=require('node:test'),assert=require('node:assert/strict');
const api=import('../supabase/functions/memory-shelf-share/dedup-handler.mjs');
const id='12345678-1234-4234-8234-123456789abc',key='a'.repeat(64);
const jpeg='data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAoHBwgHBgoICAgLCgoLDhgQDg0NDh0VFhEYIx8lJCIfIiEmKzcvJik0KSEiMEExNDk7Pj4+JS5ESUM8SDc9Pjv/2wBDAQoLCw4NDhwQEBw7KCIoOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozv/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAf/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFAEBAAAAAAAAAAAAAAAAAAAAAP/EABQRAQAAAAAAAAAAAAAAAAAAAAD/2gAMAwEAAhEDEQA/AIyAD//Z';
const auth={browserId:id,browserKey:key,shareId:id,managementKey:key,protocolVersion:3};
test('复用文件不发 Storage 上传，返回原照片编号',async()=>{
  const {handleDedupAction}=await api;let uploads=0;
  const db={rpc:async(name,{p_action})=>({data:p_action==='upload-start'?{ready:true,path:'server.jpg'}:{},error:null}),storage:{from:()=>({upload:async()=>{uploads++;}})}};
  const result=await handleDedupAction({...auth,action:'upload',fileId:'a',dataUrl:jpeg},db);
  assert.equal(result.fileId,'a');assert.equal(uploads,0);
});
test('撤销返回失效 ID，删除失败保留额度且不给提前成功提示',async()=>{
  const {handleDedupAction}=await api;let released=0;
  const db={rpc:async(name,{p_action})=>{
    if(p_action==='cleanup-done')released++;
    return {data:p_action==='revoke'?{revokedIds:[id]}:p_action==='cleanup-list'?{files:[{id,path:'server.jpg'}]}:{browserUsed:100,browserReserved:0,browserLimit:50000000},error:null};
  },storage:{from:()=>({remove:async()=>({error:{message:'offline'}})})}};
  const result=await handleDedupAction({...auth,action:'revoke'},db);
  assert.deepEqual(result.revokedIds,[id]);assert.equal(result.cleanupPending,true);assert.equal(result.freedBytes,0);assert.equal(released,0);assert.equal(result.quota.browserUsed,100);
});
test('匿名管理拒绝公开二维码和未升级写请求',async()=>{
  const {handleDedupAction}=await api;
  await assert.rejects(handleDedupAction({action:'clear',shareId:id},{ }),/匿名凭证/);
  await assert.rejects(handleDedupAction({...auth,protocolVersion:2,action:'begin'},{}),/更新网页/);
});
test('Storage 传输结果不明时保留上传归属，不让清理早于远端写入',async()=>{
  const {handleDedupAction}=await api;let unlocked=false;
  const db={rpc:async(name,{p_action})=>{if(p_action==='upload-failed')unlocked=true;return {data:{ready:false,path:'server.jpg'},error:null};},storage:{from:()=>({upload:async()=>{throw new TypeError('network lost');}})}};
  await assert.rejects(handleDedupAction({...auth,action:'upload',fileId:'a',dataUrl:jpeg},db),/network lost/);
  assert.equal(unlocked,false,'传输异常不能证明 HTTP 写入已结束');
});
