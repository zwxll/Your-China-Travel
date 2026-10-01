const {test}=require('node:test'),assert=require('node:assert/strict'),{randomUUID}=require('node:crypto');
// Dedicated disposable Supabase test project ONLY; never point this at the user's
// share backend. Install both SQL scripts first. Credentials are environment-only.
const url=process.env.MEMORY_SHARE_TEST_URL,key=process.env.MEMORY_SHARE_TEST_SERVICE_KEY;
test('真实 PostgreSQL：边界、并发预留、幂等与凭证校验',{
  skip:!url||!key||process.env.MEMORY_SHARE_TEST_DISPOSABLE!=='yes'
},async()=>{
  assert.ok(!url.includes('zpqbbawremufcxxszgde'),'禁止使用线上个人项目作配额测试');
  const headers={'Content-Type':'application/json',apikey:key,Authorization:'Bearer '+key};
  async function api(endpoint,body,method='POST'){const r=await fetch(url+'/rest/v1/'+endpoint,{method,headers,body:body?JSON.stringify(body):undefined});const text=await r.text();return {ok:r.ok,data:text?JSON.parse(text):null};}
  const rpc=(action,input)=>api('rpc/memory_share_transaction',{p_action:action,p_input:input});
  const global=(await api('memory_share_capacity?id=eq.global',null,'GET')).data[0],browserId=randomUUID(),browserHash='a'.repeat(64),managementHash='b'.repeat(64),sourceHash=randomUUID(),sessions=[];
  const make=bytes=>{const shareId=randomUUID();sessions.push(shareId);return {browserId,browserHash,shareId,managementHash,sourceHash,manifest:{version:2,provinces:[],files:[{fileId:'photo-1',bytes,sha256:'c'.repeat(64)}],totalBytes:bytes}};};
  try{
    assert.equal((await rpc('quota',{browserId,browserHash})).ok,true);
    await api('memory_share_capacity?id=eq.'+browserId,{used_bytes:49999900},'PATCH');
    await api('memory_share_capacity?id=eq.global',{used_bytes:0,reserved_bytes:0},'PATCH');
    const first=make(100);assert.equal((await rpc('begin',first)).ok,true);assert.equal((await rpc('begin',first)).ok,true);
    assert.equal((await rpc('begin',make(1))).ok,false);assert.equal((await rpc('quota',{browserId,browserHash:'d'.repeat(64)})).ok,false);
    await rpc('cancel-start',first);await rpc('cancel-done',first);
    await api('memory_share_capacity?id=eq.'+browserId,{used_bytes:0,reserved_bytes:0},'PATCH');
    const publication=make(100);assert.equal((await rpc('begin',publication)).ok,true);
    assert.equal((await rpc('upload-done',{...publication,fileId:'photo-1',bytes:100,sha256:'c'.repeat(64)})).ok,true);
    assert.equal((await rpc('finish',publication)).ok,true);assert.equal((await rpc('finish',publication)).ok,true);
    const resumed=await rpc('begin',publication);assert.equal(resumed.ok,true);assert.deepEqual(resumed.data.uploadedIds,['photo-1'],'发布响应丢失后可以恢复而不重扣额度');
    assert.equal((await rpc('quota',{browserId,browserHash})).data.browserUsed,100);
    await api('memory_share_capacity?id=eq.'+browserId,{used_bytes:0,reserved_bytes:0},'PATCH');
    await api('memory_share_capacity?id=eq.global',{used_bytes:799999900,reserved_bytes:0},'PATCH');
    const concurrent=await Promise.all([rpc('begin',make(100)),rpc('begin',make(100))]);assert.equal(concurrent.filter(r=>r.ok).length,1);
    const quota=(await rpc('quota',{browserId,browserHash})).data;assert.equal(quota.globalUsed+quota.globalReserved,800000000);
  }finally{
    for(const sid of sessions){await api('memory_shelf_shares?share_id=eq.'+sid,null,'DELETE');await api('memory_share_sessions?share_id=eq.'+sid,null,'DELETE');}
    await api('memory_share_capacity?id=eq.'+browserId,null,'DELETE');
    await api('memory_share_quota?source_hash=eq.'+sourceHash,null,'DELETE');
    await api('memory_share_capacity?id=eq.global',{used_bytes:global.used_bytes,reserved_bytes:global.reserved_bytes},'PATCH');
  }
});
