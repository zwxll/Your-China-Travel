const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');

const html=fs.readFileSync(path.join(__dirname,'../index.html'),'utf8');
function productionFunction(name,next){
  const start=html.indexOf('  async function '+name+'(');
  const end=html.indexOf('  async function '+next+'(',start);
  assert.ok(start>=0&&end>start);
  return html.slice(start,end);
}

// Only the filesystem and browser database boundaries are substituted.
// Real export/import functions run against fresh browser stores and a shared archive.
function harness(){
  const dirs=new Set(['root']),files=new Map(),photos=[],metas=[],errors=[];
  const dataUrl=async blob=>'data:'+blob.type+';base64,'+Buffer.from(await blob.arrayBuffer()).toString('base64');
  const fileByPath=async(d,n)=>{
    const blob=files.get(d+'/'+n);
    return blob?{getFile:async()=>Object.assign(blob,{name:n.split('/').pop()})}:null;
  };
  const deps={Blob,folderCityName:()=> '测试城市',folderYearOf:()=> '2026',folderSafeName:v=>v,
    fsEnsureDir:async(d,n)=>{const p=d+'/'+n;dirs.add(p);return p;},
    fsSubDir:async(d,n)=>dirs.has(d+'/'+n)?d+'/'+n:null,
    fsFile:fileByPath,fsFileByPath:fileByPath,
    fsWriteFile:async(d,n,v)=>files.set(d+'/'+n,v instanceof Blob?v:new Blob([v],{type:'application/json'})),
    fsList:async d=>[...dirs,...files.keys()].filter(p=>p.startsWith(d+'/')&&!p.slice(d.length+1).includes('/')).map(p=>({name:p.slice(d.length+1),kind:dirs.has(p)?'directory':'file'})),
    fsRemove:async(d,n)=>{const p=d+'/'+n;for(const k of [...files.keys()])if(k===p||k.startsWith(p+'/'))files.delete(k);for(const k of [...dirs])if(k===p||k.startsWith(p+'/'))dirs.delete(k);},
    fsReadJson:async(d,n)=>files.has(d+'/'+n)?JSON.parse(await files.get(d+'/'+n).text()):null,
    fsReadDataUrl:async(d,n)=>files.has(d+'/'+n)?dataUrl(files.get(d+'/'+n)):'',
    folderVideoExt:()=>'.mp4',folderExtOf:()=> 'jpg',
    dataUrlToBlob:v=>new Blob([Buffer.from(v.split(',')[1],'base64')],{type:v.slice(5,v.indexOf(';'))}),
    blobToDataUrl:dataUrl,folderPointOf:()=>null,mimeOfVideoName:()=> 'video/mp4',
    folderSupported:()=>true,dataDirHandle:{},confirm:()=>true,
    setFolderStatus:()=>{},folderPermissionGranted:async()=>true,folderRoot:async()=> 'root',FOLDER_ROOT_NAME:'archive',
    clearLocalTravelData:async()=>{photos.length=0;metas.length=0;},
    putLocalMeta:async v=>metas.push(structuredClone(v)),addPhoto:async v=>{photos.push(structuredClone(v));return v.id;},
    saveLocalProfileOnly:()=>{},localStorage:{setItem:()=>{}},refreshState:async()=>{},loadProfileToUI:()=>{},updateAccountUI:()=>{},
    toast:(msg,error)=>{if(error)errors.push(msg);},console:{error:()=>{}},cloudSuppressDirty:false
  };
  const helperStart=html.indexOf('  async function readFolderMedia(');
  const helper=helperStart<0?'':html.slice(helperStart,html.indexOf('  async function mirrorCityToFolder(',helperStart));
  const functions=new Function(...Object.keys(deps),helper+
    productionFunction('mirrorCityToFolder','mirrorAllToFolder')+
    productionFunction('restoreFromFolder','initDataFolder')+
    ';return {mirrorCityToFolder,restoreFromFolder};')(...Object.values(deps));
  return {...functions,files,photos,metas,errors,info:async()=>JSON.parse(await files.get('root/2026/测试城市/info.json').text())};
}

const poster='data:image/jpeg;base64,cG9zdGVy';
function fixture(){
  const image={id:11,kind:'image',name:'same.jpg',dataUrl:poster,order:1};
  const video={id:42,kind:'video',name:'same.jpg',mime:'video/mp4',blob:new Blob(['original-video'],{type:'video/mp4'}),dataUrl:poster,duration:12,size:14,order:2};
  return {image,video,meta:{attractions:[{id:'a',name:'景点',notes:'保留备注',photos:[image,video]}]}};
}

test('folder export retains attraction video source and poster instead of just a JPEG',async()=>{
  const h=harness(),{image,video,meta}=fixture();
  await h.mirrorCityToFolder('root','city',meta,[image,video]);
  const info=await h.info(),entry=info.attractions[0].photos[1];
  assert.equal(entry.kind,'video');
  assert.equal(entry.file,'videos/002-42.mp4');
  assert.equal(entry.poster,'videos/002-42.jpg');
  assert.equal(await h.files.get('root/2026/测试城市/'+entry.file).text(),'original-video');
});

test('a fresh browser restores playable attraction videos without changing city counts',async()=>{
  const h=harness(),{image,video,meta}=fixture();
  await h.mirrorCityToFolder('root','city',meta,[image,video]);
  await h.restoreFromFolder({silent:true});
  assert.deepEqual(h.errors,[]);
  assert.equal(h.photos.filter(p=>p.kind==='image').length,1);
  assert.equal(h.photos.filter(p=>p.kind==='video').length,1);
  const entries=h.metas[0].attractions[0].photos;
  assert.equal(entries[0].kind,'image');
  assert.equal(entries[1].kind,'video');
  assert.equal(await entries[1].blob.text(),'original-video');
  assert.equal(entries[1].dataUrl,poster);
  assert.equal(entries[1].duration,12);
  assert.equal(h.metas[0].attractions[0].notes,'保留备注');
});

test('legacy attraction posters recover videos by media ID, not matching name or poster',async()=>{
  const h=harness(),{image,video,meta}=fixture();
  await h.mirrorCityToFolder('root','city',meta,[image,video]);
  const info=await h.info();
  info.attractions[0].photos=[
    {id:11,name:'same.jpg',file:'photos/001-11.jpg'},
    {id:'42',name:'same.jpg',file:'legacy.jpg'},
    {name:'same.jpg',file:'legacy.jpg'}
  ];
  h.files.set('root/2026/测试城市/legacy.jpg',new Blob(['poster'],{type:'image/jpeg'}));
  h.files.set('root/2026/测试城市/info.json',new Blob([JSON.stringify(info)]));
  await h.restoreFromFolder({silent:true});
  assert.deepEqual(h.errors,[]);
  const entries=h.metas[0].attractions[0].photos;
  assert.equal(entries[0].kind,'image');
  assert.equal(entries[1].kind,'video');
  assert.equal(await entries[1].blob.text(),'original-video');
  assert.equal(entries[2].kind,'image');
  assert.equal(entries[2].blob,undefined);
});

test('attraction-only video exports its original blob even when absent from city album',async()=>{
  const h=harness(),{video,meta}=fixture();
  meta.attractions[0].photos=[video];
  await h.mirrorCityToFolder('root','city',meta,[]);
  await h.restoreFromFolder({silent:true});
  assert.deepEqual(h.errors,[]);
  const restored=h.metas[0].attractions[0].photos[0];
  assert.equal(restored.kind,'video');
  assert.equal(await restored.blob.text(),'original-video');
  assert.equal(h.photos.length,0);
});

test('missing video sources remain videos and produce a visible recovery warning',async()=>{
  const h=harness(),{image,video,meta}=fixture();
  await h.mirrorCityToFolder('root','city',meta,[image,video]);
  h.files.delete('root/2026/测试城市/videos/002-42.mp4');
  await h.restoreFromFolder({silent:true});
  assert.equal(h.metas[0].attractions[0].photos[1].kind,'video');
  assert.equal(h.metas[0].attractions[0].photos[1].blob,undefined);
  assert.ok(h.errors.some(message=>message.includes('缺失')));
});
