// Fetch only the reusable components and their licenses; never the demo app.
const fs=require('node:fs'),path=require('node:path'),https=require('node:https');
async function get(url){
  return new Promise((resolve,reject)=>https.get(url,{headers:{'User-Agent':'TravelCanopy'}},res=>{
    let data='';res.on('data',chunk=>data+=chunk);res.on('end',()=>res.statusCode===200?resolve(JSON.parse(data)):reject(Error('HTTP '+res.statusCode+' '+url)));
  }).on('error',reject));
}
(async()=>{
  for(const [repo,name,prefix] of [
    ['Steve245270533/three-stylized','meadow','src/grass/'],
    ['boona13/threejs-grass-water-shaders','water','src/water/'],
  ]){
    const base='https://api.github.com/repos/'+repo;
    const tree=await get(base+'/git/trees/HEAD?recursive=1');
    const files=tree.tree.filter(file=>file.type==='blob'&&(file.path.startsWith(prefix)||['LICENSE','package.json'].includes(file.path)));
    const folder=path.join(__dirname,'vendor/garden',name);
    for(const file of files){
      const blob=await get(base+'/git/blobs/'+file.sha);
      const target=path.join(folder,file.path);fs.mkdirSync(path.dirname(target),{recursive:true});
      fs.writeFileSync(target,Buffer.from(blob.content,'base64'));
    }
    fs.writeFileSync(path.join(folder,'UPSTREAM.json'),JSON.stringify({repo,tree:tree.sha,files:files.map(({path,sha})=>({path,sha}))},null,2));
    console.log('Downloaded '+repo+' ('+files.length+' files, tree '+tree.sha+')');
  }
})().catch(error=>{console.error(error);process.exitCode=1;});
