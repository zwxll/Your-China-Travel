// Download the unchanged third-party dependencies shipped by the source demo.
const fs=require('node:fs'),path=require('node:path'),https=require('node:https');
const vendor=path.join(__dirname,'vendor');
fs.mkdirSync(vendor,{recursive:true});
async function download(name){
  const json=await new Promise((resolve,reject)=>{
    https.get('https://api.github.com/repos/HaichaoLihc/visual-experience-demo/contents/experiences/umbrella-canopy/vendor/'+name,{headers:{'User-Agent':'TravelCanopy'}},res=>{
      let data='';res.on('data',chunk=>data+=chunk);res.on('end',()=>res.statusCode===200?resolve(JSON.parse(data)):reject(Error('HTTP '+res.statusCode)));
    }).on('error',reject);
  });
  fs.writeFileSync(path.join(vendor,name),Buffer.from(json.content,'base64'));
  console.log('Downloaded '+name);
}
(async()=>{for(const name of ['three.core.min.js','three.module.min.js','OrbitControls.js'])await download(name);})().catch(error=>{console.error(error);process.exitCode=1;});
