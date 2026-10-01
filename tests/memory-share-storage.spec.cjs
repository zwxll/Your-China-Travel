const {test}=require('node:test');
const assert=require('node:assert/strict');
const {pathToFileURL}=require('node:url');
const path=require('node:path');
const modulePromise=import(pathToFileURL(path.resolve('supabase/functions/memory-shelf-share/storage-validation.mjs')));
const id='12345678-1234-4234-8234-123456789abc';
const fixture=()=>({provinces:['河南省','浙江省'].map(name=>({name,account:'private',cities:[{name:'城市',photos:[{name:'照片',fileId:'photo-1'}]}]})),files:[{fileId:'photo-1',bytes:100,sha256:'a'.repeat(64)}]});
test('多省清单白名单、计量与文件引用',async()=>{
  const {sanitizeManifest}=await modulePromise,value=sanitizeManifest(fixture(),id);
  assert.equal(value.version,2);assert.equal(value.provinces.length,2);assert.equal(value.totalBytes,100);
  assert.equal(value.provinces[0].account,undefined);
  for(const mutate of [v=>v.provinces=Array(35).fill(v.provinces[0]),v=>v.files[0].fileId='../x',v=>v.provinces[0].cities[0].photos[0].fileId='missing',v=>v.files[0].bytes=307201,v=>v.files.push({...v.files[0]})]){
    const input=fixture();mutate(input);assert.throws(()=>sanitizeManifest(input,id));
  }
  const unused=fixture();unused.files.push({fileId:'unused',bytes:1,sha256:'b'.repeat(64)});assert.throws(()=>sanitizeManifest(unused,id));
});
test('JPEG 验证拒绝 MIME 伪装、截断及超额',async()=>{
  const {validateJpeg}=await modulePromise;
  for(const data of ['data:image/jpeg;base64,'+Buffer.from('not a jpeg').toString('base64'),'data:image/png;base64,abcd','data:image/jpeg;base64,'+Buffer.alloc(307201).toString('base64')])await assert.rejects(()=>validateJpeg(data));
});
test('JPEG 拒绝零组件帧和不匹配的扫描段',async()=>{
  const {validateJpeg}=await modulePromise;
  const zeroComponents=[255,216,255,192,0,11,8,0,1,0,1,0,1,17,0,255,218,0,8,1,1,0,0,63,0,1,255,217];
  await assert.rejects(()=>validateJpeg('data:image/jpeg;base64,'+Buffer.from(zeroComponents).toString('base64')));
  const wrongScan=[...zeroComponents];wrongScan[11]=1;wrongScan[20]=2;
  await assert.rejects(()=>validateJpeg('data:image/jpeg;base64,'+Buffer.from(wrongScan).toString('base64')));
  const dataUrl='data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAoHBwgHBgoICAgLCgoLDhgQDg0NDh0VFhEYIx8lJCIfIiEmKzcvJik0KSEiMEExNDk7Pj4+JS5ESUM8SDc9Pjv/2wBDAQoLCw4NDhwQEBw7KCIoOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozv/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAf/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFAEBAAAAAAAAAAAAAAAAAAAAAP/EABQRAQAAAAAAAAAAAAAAAAAAAAD/2gAMAwEAAhEDEQA/AIyAD//Z';
  await validateJpeg(dataUrl);
  const valid=Buffer.from(dataUrl.slice(23),'base64'),scan=valid.indexOf(Buffer.from([255,218]));
  valid[scan+5]=99;
  await assert.rejects(()=>validateJpeg('data:image/jpeg;base64,'+valid.toString('base64')),/扫描组件/);
});
