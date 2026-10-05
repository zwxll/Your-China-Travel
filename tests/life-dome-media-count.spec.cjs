const {test}=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const html=fs.readFileSync(path.join(__dirname,'../index.html'),'utf8');
const start=html.indexOf('  async function collectLifeDomePhotos(entries){'),end=html.indexOf('  async function renderLifeJourneyArchive()',start);
const collectWith=getPhotosByCity=>new Function('getPhotosByCity',html.slice(start,end)+'return collectLifeDomePhotos;')(getPhotosByCity);

test('时间轴照片墙排除视频：157张照片加3个视频仍为157张照片',async()=>{
  const records=[...Array.from({length:157},(_,i)=>({kind:'image',dataUrl:'photo-'+i})),...Array.from({length:3},(_,i)=>({kind:'video',dataUrl:'video-'+i}))];
  const photos=await collectWith(async()=>records)([{city:{cityKey:'sample',name:'测试城市'}}]);
  assert.equal(photos.length,157);
  assert.equal(photos.some(photo=>photo.src.startsWith('video-')),false);
});

test('时间轴保持城市顺序，重复到访不重复加入，兼容历史照片和空相册',async()=>{
  const read=[],records={a:[{dataUrl:'legacy'},{kind:'video',dataUrl:'video'},{kind:'image',dataUrl:''}],b:[{kind:'image',dataUrl:'second'}],c:[]};
  const collect=collectWith(async key=>{read.push(key);return records[key];});
  const photos=await collect(['a','b','a','c'].map(cityKey=>({city:{cityKey,name:cityKey}})));
  assert.deepEqual(read,['a','b','c']);
  assert.deepEqual(photos.map(photo=>photo.src),['legacy','second']);
  assert.deepEqual(await collect([]),[]);
});
