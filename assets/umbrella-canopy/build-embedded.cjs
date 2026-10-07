// Bundle original modules locally: no module fetches are needed with file://.
const fs=require('node:fs'),path=require('node:path');
const esbuild=require(process.argv[2]||'esbuild');
(async()=>{
  const result=await esbuild.build({entryPoints:[path.join(__dirname,'js/main.js')],bundle:true,format:'iife',minify:true,write:false,legalComments:'inline',alias:{three:path.join(__dirname,'vendor/three.module.min.js')}});
  const licenses=['meadow'].map(name=>'/*! '+fs.readFileSync(path.join(__dirname,'vendor/garden',name,'LICENSE'),'utf8')+' */').join('\n');
  const script=licenses+'\n'+result.outputFiles[0].text;
  const template=fs.readFileSync(path.join(__dirname,'template.html'),'utf8')
    .replace(/<script type="importmap">[\s\S]*?<\/script>/,'')
    .replace('<link rel="stylesheet" href="style.css?v=quiet-canopy-2">',()=>'<style>'+fs.readFileSync(path.join(__dirname,'style.css'),'utf8')+'</style>');
  const output=`// Adapted from Haichao Li's Umbrella Canopy; see README.md for provenance.\nwindow.TravelCanopyDocument=function(records){
    const template=${JSON.stringify(template)},script=${JSON.stringify(script)};
    const data=JSON.stringify(records).replace(/</g,'\\\\u003c');
    return template.replace('<script type="module" src="js/main.js?v=quiet-canopy-2"></script>',()=>'<script>window.canopyRecords='+data+';'+script.replace(/<\\/script/gi,'<\\\\/script')+'</script>');
  };\n`;
  fs.writeFileSync(path.join(__dirname,'embedded.js'),output);
  console.log('Built local canopy ('+Buffer.byteLength(output)+' bytes)');
})().catch(error=>{console.error(error);process.exitCode=1;});
