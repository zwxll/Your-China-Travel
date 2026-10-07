const {test}=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const root=path.resolve(__dirname,'..');
test('年轮树使用已有相册：去除视频、重复到访，年份沿用手动/日期/首次到访优先级',async()=>{
  const file=path.join(root,'assets/travel-ring-tree/data.js');
  assert.ok(fs.existsSync(file),'独立年轮树目录适配尚未实现');
  const {createTreeCatalog}=await import(require('node:url').pathToFileURL(file).href);
  const context={window:{}};vm.runInNewContext(fs.readFileSync(path.join(root,'assets/image-atlas/data.js'),'utf8'),context);
  const entries=[{city:{cityKey:'a',name:'北京'},month:'2026-06'},{city:{cityKey:'a',name:'北京'},month:'2025-06'},{city:{cityKey:'b',name:'杭州'},month:''}];
  let reads=0;
  const records=await context.window.TravelImageAtlas.collect(entries,async key=>{reads++;return key==='a'?[
    {id:1,dataUrl:'photo:first',timestamp:2030000000000},{id:2,dataUrl:'photo:date',travelDate:'2023-02'},
    {id:3,dataUrl:'photo:manual',travelDate:'2024-04'},{id:4,dataUrl:'video',kind:'video'}]:[{id:5,dataUrl:'photo:unknown'}];},{'a:3':2022});
  const catalog=createTreeCatalog(records.map(r=>({...r,cityKey:r.id.split(':')[0]})));
  assert.equal(reads,2);assert.equal(catalog.photos.length,4);assert.equal(catalog.cities.length,2);
  assert.deepEqual(catalog.years,[2022,2023,2025]);
  assert.deepEqual(catalog.photos.map(p=>p.year),[2025,2023,2022,'年份未确定']);
  assert.equal(catalog.photos[2].full,'photo:manual');assert.equal(catalog.cities[0].photos[0],catalog.photos[0]);
  assert.deepEqual(createTreeCatalog([]),{photos:[],cities:[],years:[]});
  assert.equal(createTreeCatalog([records[0],records[0]]).photos.length,1,'同一记录不重复挂上树');
});
