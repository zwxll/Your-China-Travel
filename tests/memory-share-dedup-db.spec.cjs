const {test}=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),{randomUUID}=require('node:crypto');
let PGlite;try{({PGlite}=require(process.env.MEMORY_SHARE_PGLITE_PATH||'../.superpowers/test-runtime/node_modules/@electric-sql/pglite'));}catch{}
// Executes the real SQL in embedded PostgreSQL, not a JavaScript replica.
// This is NOT a multi-connection lock/concurrency test; use a disposable server for that.
test('共享照片 SQL：复用、配额、引用清理、撤销和清空屏障',{skip:!PGlite},async t=>{
  const db=new PGlite();
  await db.exec("create role anon; create role authenticated; create role service_role bypassrls; create schema storage; create table storage.objects(metadata jsonb); create table storage.buckets(id text primary key,name text,public boolean,file_size_limit bigint,allowed_mime_types text[]); create table memory_shelf_shares(share_id uuid primary key,management_hash text,snapshot jsonb,updated_at timestamptz default now()); create table memory_share_quota(source_hash text,day date,slot integer,primary key(source_hash,day,slot));");
  await db.exec(fs.readFileSync(path.resolve('supabase/memory-shelf-storage.sql'),'utf8'));
  assert.ok(fs.existsSync('supabase/memory-shelf-dedup.sql'),'共享文件事务尚未实现');
  await db.exec(fs.readFileSync('supabase/memory-shelf-dedup.sql','utf8'));
  const rpc=async(action,input)=>(await db.query('select memory_share_dedup_transaction($1,$2::jsonb) as value',[action,JSON.stringify(input)])).rows[0].value;
  const owner={browserId:randomUUID(),browserHash:'a'.repeat(64)},secret='b'.repeat(64),sessions=[];
  function draft(hash='c'.repeat(64),bytes=100,targetId){
    const shareId=randomUUID(),file={fileId:'a',bytes,sha256:hash};
    const input={...owner,shareId,targetId:targetId||shareId,managementHash:secret,sourceHash:'d'.repeat(64),manifest:{version:3,files:[file],totalBytes:bytes,provinces:[{name:'浙江省',coverId:'a',cities:[{name:'杭州',photos:[{name:'照片',fileId:'a'}]}]}]}};
    sessions.push(input);return input;
  }
  const file=input=>({...input,...input.manifest.files[0]});
  async function ready(input){const start=await rpc('upload-start',file(input));assert.ok(start.path);await rpc('upload-done',file(input));await rpc('finish',input);}
  const first=draft(),second=draft();
  await t.test('两个会话预留同一文件一次，上传后第二份不新增占用',async()=>{
    assert.equal((await rpc('begin',first)).newBytes,100);
    assert.equal((await rpc('begin',second)).newBytes,0);
    assert.equal((await rpc('quota',owner)).browserReserved,100);
    const start=await rpc('upload-start',file(first));assert.ok(start.path);
    await assert.rejects(rpc('upload-start',file(second)),/正在上传/);
    await rpc('upload-done',file(first));await rpc('finish',first);
    assert.deepEqual((await rpc('begin',second)).uploadedIds,['a']);
    await rpc('finish',second);assert.equal((await rpc('quota',owner)).browserUsed,100);
  });
  await t.test('删一份不误删仍共用照片，最后引用删除失败时仍占额',async()=>{
    await rpc('revoke',{...owner,shareId:first.targetId});
    assert.equal((await rpc('cleanup-list',owner)).files.length,0);
    assert.equal((await rpc('quota',owner)).browserUsed,100);
    await rpc('revoke',{...owner,shareId:second.targetId});
    const files=(await rpc('cleanup-list',owner)).files;assert.equal(files.length,1);
    assert.equal((await rpc('quota',owner)).browserUsed,100);
    await rpc('cleanup-done',{...owner,cleanupId:files[0].id});
    await rpc('cleanup-done',{...owner,cleanupId:files[0].id});
    assert.equal((await rpc('quota',owner)).browserUsed,0);
    await assert.rejects(rpc('finish',second),/失效|关闭/);
    await assert.rejects(rpc('begin',second),/失效/);
  });
  await t.test('已满额度允许完全复用，但新增一个字节拒绝',async()=>{
    const keep=draft();await rpc('begin',keep);await ready(keep);
    await db.query('update memory_share_capacity set used_bytes=50000000 where id=$1',[owner.browserId]);
    const reuse=draft();assert.equal((await rpc('begin',reuse)).newBytes,0);
    await assert.rejects(rpc('begin',draft('e'.repeat(64),1)),/50MB/);
    await db.query('update memory_share_capacity set used_bytes=100 where id=$1',[owner.browserId]);
  });
  await t.test('另一匿名身份不能管理，或复用本身份照片',async()=>{
    const other={browserId:randomUUID(),browserHash:'f'.repeat(64)},own=draft();
    const different={...own,...other};assert.equal((await rpc('begin',different)).newBytes,100);
    await assert.rejects(rpc('revoke',{...other,shareId:sessions[2].targetId}),/无权/);
    await assert.rejects(rpc('list',{...owner,browserHash:'0'.repeat(64)}),/凭证/);
  });
  await t.test('清空期间在途上传必须结算，未实际删除不能恢复额度',async()=>{
    const active=draft('1'.repeat(64),20);await rpc('begin',active);await rpc('upload-start',file(active));
    await rpc('clear',owner);assert.equal((await rpc('quota',owner)).clearing,true);
    await assert.rejects(rpc('begin',draft('2'.repeat(64),1)),/清理中/);
    await rpc('upload-done',file(active));
    for(const item of (await rpc('cleanup-list',owner)).files)await rpc('cleanup-done',{...owner,cleanupId:item.id});
    const quota=await rpc('quota',owner);assert.equal(quota.browserUsed,0);assert.equal(quota.browserReserved,0);assert.equal(quota.clearing,false);
    await assert.rejects(rpc('finish',active),/失效|关闭/);
    const fresh=draft('3'.repeat(64),1);assert.equal((await rpc('begin',fresh)).newBytes,1);
  });
  await t.test('旧 v2 原地采纳不重复占额，切换前取消不能删除原照片',async()=>{
    const legacy=draft('4'.repeat(64),80),snapshot={...legacy.manifest,version:2,storagePrefix:legacy.shareId};
    await db.query("insert into memory_share_sessions(share_id,target_id,owner_id,management_hash,manifest,total_bytes,state) values($1,$1,$2,$3,$4,80,'published')",[legacy.shareId,owner.browserId,secret,JSON.stringify(snapshot)]);
    await db.query('insert into memory_shelf_shares(share_id,owner_id,management_hash,snapshot,stored_bytes) values($1,$2,$3,$4,80)',[legacy.shareId,owner.browserId,secret,JSON.stringify(snapshot)]);
    await db.query("update memory_share_capacity set used_bytes=used_bytes+80 where id in('global',$1)",[owner.browserId]);
    const migration=await rpc('migrate-start',{...legacy,expectedSnapshot:snapshot});
    const input={...legacy,shareId:migration.shareId,...legacy.manifest.files[0]};
    const adopted=await rpc('migrate-file',input);assert.equal(adopted.ready,true);
    assert.equal((await rpc('quota',owner)).browserUsed,80);
    await rpc('cancel',input);
    assert.equal((await rpc('cleanup-list',owner)).files.length,0,'旧目录仍在引用 canonical 路径');
    const again=await rpc('migrate-start',{...legacy,expectedSnapshot:snapshot});
    const resumed={...input,shareId:again.shareId};await rpc('migrate-file',resumed);await rpc('migrate-finish',resumed);
    const row=(await db.query('select snapshot from memory_shelf_shares where share_id=$1',[legacy.shareId])).rows[0];
    assert.equal(row.snapshot.version,3);assert.equal(row.snapshot.objects.a,legacy.shareId+'/a.jpg');
    assert.equal((await rpc('quota',owner)).browserUsed,80);
    await rpc('revoke',{...owner,shareId:legacy.shareId});
    const items=(await rpc('cleanup-list',owner)).files;assert.equal(items.length,1);
    await rpc('cleanup-done',{...owner,cleanupId:items[0].id});assert.equal((await rpc('quota',owner)).browserUsed,0);
  });
  await t.test('旧 RPC 不能绕过数据库撤销保护',async()=>{
    const stale=draft('5'.repeat(64),1,first.targetId);
    await db.exec('set role service_role');
    try{await assert.rejects(db.query('select memory_share_transaction($1,$2::jsonb)', ['begin',JSON.stringify(stale)]),/permission denied/);}
    finally{await db.exec('reset role');}
    assert.equal((await db.query('select count(*)::int n from memory_shelf_shares where share_id=$1',[first.targetId])).rows[0].n,0);
  });
  await t.test('旧 v1 迁移缺少临时容量时保留原目录，就绪后才替换并释放嵌入字节',async()=>{
    const legacy=draft('6'.repeat(64),30),snapshot={version:1,provinces:[{name:'测试省',cities:[{name:'测试城',photos:[{name:'旧图',dataUrl:'legacy-embedded'}]}]}]};
    await db.query('insert into memory_shelf_shares(share_id,owner_id,management_hash,snapshot,stored_bytes) values($1,$2,$3,$4,30)',[legacy.shareId,owner.browserId,secret,JSON.stringify(snapshot)]);
    await db.query("update memory_share_capacity set used_bytes=used_bytes+30 where id in('global',$1)",[owner.browserId]);
    const quotaBefore=await rpc('quota',owner),session=await rpc('migrate-start',{...legacy,expectedSnapshot:snapshot}),step={...file(legacy),shareId:session.shareId};
    await db.query('update memory_share_capacity set used_bytes=50000000-reserved_bytes where id=$1',[owner.browserId]);
    await assert.rejects(rpc('migrate-file',step),/50MB/);
    assert.equal((await db.query('select snapshot from memory_shelf_shares where share_id=$1',[legacy.shareId])).rows[0].snapshot.version,1);
    await db.query('update memory_share_capacity set used_bytes=$2 where id=$1',[owner.browserId,quotaBefore.browserUsed]);
    await rpc('migrate-file',step);await assert.rejects(rpc('migrate-finish',step),/尚未全部上传/);
    await rpc('upload-start',step);await rpc('upload-done',step);await rpc('migrate-finish',step);
    assert.equal((await rpc('quota',owner)).browserUsed,quotaBefore.browserUsed);
    assert.equal((await db.query('select snapshot from memory_shelf_shares where share_id=$1',[legacy.shareId])).rows[0].snapshot.version,3);
    await rpc('revoke',{...owner,shareId:legacy.shareId});for(const item of (await rpc('cleanup-list',owner)).files)await rpc('cleanup-done',{...owner,cleanupId:item.id});
  });
  await t.test('删除旧内嵌照片正确报告已释放的字节数',async()=>{
    const target=randomUUID();await db.query("insert into memory_shelf_shares(share_id,owner_id,management_hash,snapshot,stored_bytes) values($1,$2,$3,'{\"version\":1,\"provinces\":[]}',30)",[target,owner.browserId,secret]);
    await db.query("update memory_share_capacity set used_bytes=used_bytes+30 where id in('global',$1)",[owner.browserId]);
    assert.equal((await rpc('revoke',{...owner,shareId:target})).freedBytes,30);
  });
  await db.close();
});
