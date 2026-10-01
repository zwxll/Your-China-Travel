const {test}=require('node:test'),assert=require('node:assert/strict'),{randomUUID}=require('node:crypto');
const url=process.env.MEMORY_SHARE_TEST_URL,key=process.env.MEMORY_SHARE_TEST_SERVICE_KEY;
test('真实多连接 PostgreSQL：相同 hash 并发只预留一次，取消不误清共用文件',{
  skip:!url||!key||process.env.MEMORY_SHARE_TEST_DISPOSABLE!=='yes'
},async()=>{
  assert.ok(!url.includes('zpqbbawremufcxxszgde'),'禁止使用线上个人项目');
  const owner={browserId:randomUUID(),browserHash:'a'.repeat(64)},sourceHash=randomUUID(),secret='b'.repeat(64);
  async function api(endpoint,body,method='POST'){
    const r=await fetch(url+'/rest/v1/'+endpoint,{method,headers:{'Content-Type':'application/json',apikey:key,Authorization:'Bearer '+key},body:body?JSON.stringify(body):undefined});
    const value=await r.json();if(!r.ok)throw new Error(value.message);return value;
  }
  const rpc=(action,input)=>api('rpc/memory_share_dedup_transaction',{p_action:action,p_input:input});
  const make=()=>{const shareId=randomUUID();return {...owner,shareId,targetId:shareId,managementHash:secret,sourceHash,manifest:{version:3,totalBytes:100,files:[{fileId:'a',bytes:100,sha256:'c'.repeat(64)}],provinces:[{name:'测试省',cities:[{name:'测试城',photos:[{fileId:'a'}]}]}]}};};
  const drafts=[make(),make()];
  try{
    const results=await Promise.all(drafts.map(d=>rpc('begin',d)));
    assert.equal(results.reduce((n,r)=>n+r.newBytes,0),100);
    assert.equal((await rpc('quota',owner)).browserReserved,100);
    await rpc('cancel',drafts[0]);assert.equal((await rpc('cleanup-list',owner)).files.length,0);
    await rpc('cancel',drafts[1]);const pending=(await rpc('cleanup-list',owner)).files;assert.equal(pending.length,1);
    // No upload-start was issued, so no Storage file exists. Tests confirm SQL
    // settlement only; actual Storage remove behavior belongs to handler tests.
    await rpc('cleanup-done',{...owner,cleanupId:pending[0].id});assert.equal((await rpc('quota',owner)).browserReserved,0);
  }finally{
    await rpc('clear',owner);
    for(const file of (await rpc('cleanup-list',owner)).files)await rpc('cleanup-done',{...owner,cleanupId:file.id});
    await api('memory_share_quota?source_hash=eq.'+sourceHash,null,'DELETE');
  }
});
