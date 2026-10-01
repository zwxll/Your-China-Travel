const {test}=require('node:test'),assert=require('node:assert/strict');
const modulePromise=import('../supabase/functions/memory-shelf-share/storage-validation.mjs');
const id='12345678-1234-4234-8234-123456789abc';
const manifest=()=>({provinces:[{name:'浙江省',coverId:'cover',cities:[{name:'杭州',photos:[{name:'一',fileId:'a'},{name:'二',fileId:'b'}]}]}],files:[{fileId:'a',bytes:100,sha256:'a'.repeat(64)},{fileId:'b',bytes:100,sha256:'a'.repeat(64)},{fileId:'cover',bytes:100,sha256:'a'.repeat(64)}]});
test('相同 JPEG 只计量一次，封面和重复照片位置仍保留',async()=>{
  const {sanitizeDedupManifest}=await modulePromise;
  assert.equal(typeof sanitizeDedupManifest,'function');
  const result=sanitizeDedupManifest(manifest(),id);
  assert.equal(result.version,3);assert.equal(result.totalBytes,100);assert.equal(result.files.length,1);
  assert.equal(result.provinces[0].coverId,'a');
  assert.deepEqual(result.provinces[0].cities[0].photos,[{name:'一',fileId:'a'},{name:'二',fileId:'a'}]);
});
test('同名不同字节不合并，同 hash 不同长度拒绝',async()=>{
  const {sanitizeDedupManifest}=await modulePromise;
  assert.equal(typeof sanitizeDedupManifest,'function');
  const value=manifest();value.files[1].sha256='b'.repeat(64);
  assert.equal(sanitizeDedupManifest(value,id).totalBytes,200);
  value.files[1].sha256='a'.repeat(64);value.files[1].bytes=101;
  assert.throws(()=>sanitizeDedupManifest(value,id),/长度/);
});
test('先按字节去重再检查 50MB，不能接受未引用或任意路径文件',async()=>{
  const {sanitizeDedupManifest}=await modulePromise;
  assert.equal(typeof sanitizeDedupManifest,'function');
  const value=manifest();value.files=Array.from({length:200},(_,i)=>({fileId:'p'+i,bytes:300000,sha256:'a'.repeat(64)}));
  value.provinces[0].coverId='p0';value.provinces[0].cities[0].photos=value.files.map(f=>({fileId:f.fileId}));
  assert.equal(sanitizeDedupManifest(value,id).totalBytes,300000);
  value.files.push({fileId:'unused',bytes:1,sha256:'b'.repeat(64)});
  assert.throws(()=>sanitizeDedupManifest(value,id));
  const unsafe=manifest();unsafe.files[0].fileId='../x';assert.throws(()=>sanitizeDedupManifest(unsafe,id));
});
