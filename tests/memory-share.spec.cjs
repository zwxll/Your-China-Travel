const test=require('node:test');
const assert=require('node:assert/strict');
const path=require('node:path');
const {pathToFileURL}=require('node:url');
const validation=import(pathToFileURL(path.join(__dirname,'../supabase/functions/memory-shelf-share/validation.mjs')));
const image='data:image/jpeg;base64,/9j/AA==';
const fixture=()=>({email:'private@example.com',provinces:[{name:'湖北省',review:'旅行记录',cover:image,cities:[{name:'孝感市',description:'我的旅行',firstMonth:'2026-08',localPath:'F:/private',photos:[{name:'照片',dataUrl:image,storagePath:'users/private/photo.jpg',blob:'private'}]}]}]});
test('公开快照只保留书架与照片字段，不包含账号和本地路径',async()=>{
  const {sanitizeSnapshot}=await validation;
  const snapshot=sanitizeSnapshot(fixture());
  assert.deepEqual(snapshot,{version:1,provinces:[{name:'湖北省',review:'旅行记录',cover:image,cities:[{name:'孝感市',description:'我的旅行',firstMonth:'2026-08',photos:[{name:'照片',dataUrl:image}]}]}]});
});
test('拒绝视频、外部图片地址和空照片，避免公开页加载外部资源',async()=>{
  const {sanitizeSnapshot}=await validation;
  for(const media of [{kind:'video',dataUrl:image},{dataUrl:'https://example.com/private.jpg'},{dataUrl:''}]){
    const value=fixture();value.provinces[0].cities[0].photos=[media];assert.throws(()=>sanitizeSnapshot(value));
  }
});
test('拒绝没有照片的分享和超量省份',async()=>{
  const {sanitizeSnapshot}=await validation;
  const empty=fixture();empty.provinces[0].cities[0].photos=[];assert.throws(()=>sanitizeSnapshot(empty),/数量/);
  const tooMany=fixture();tooMany.provinces=Array(35).fill(tooMany.provinces[0]);assert.throws(()=>sanitizeSnapshot(tooMany),/书架内容无效/);
});
test('分享 ID 必须是随机 UUID，不能用账号或目录作分享标识',async()=>{
  const {validId}=await validation;
  assert.equal(validId('f8b86f68-a88d-4f09-96e6-91d117daef20'),true);
  assert.equal(validId('../private'),false);assert.equal(validId('user@example.com'),false);
});
