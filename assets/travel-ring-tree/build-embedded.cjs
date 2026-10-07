const fs=require('node:fs'),path=require('node:path');
const esbuild=require(process.argv[2]||'esbuild');
(async()=>{
  const result=await esbuild.build({entryPoints:[path.join(__dirname,'main.js')],bundle:true,format:'iife',minify:true,write:false,legalComments:'inline',alias:{three:path.join(__dirname,'../umbrella-canopy/vendor/three.module.min.js')}});
  const license=['../umbrella-canopy/vendor/garden/meadow/LICENSE','vendor/ez-tree/LICENSE'].map(file=>'/*! '+fs.readFileSync(path.join(__dirname,file),'utf8')+' */\n').join('');
  const script=license+result.outputFiles[0].text;
  const template=fs.readFileSync(path.join(__dirname,'template.html'),'utf8').replace(/<script type="importmap">[\s\S]*?<\/script>/,'').replace('<link rel="stylesheet" href="style.css">',()=>'<style>'+fs.readFileSync(path.join(__dirname,'style.css'),'utf8')+'</style>');
  const output=`// Travel ring tree; read-only reuse of Umbrella Canopy. See README.md.\nwindow.TravelRingTreeDocument=function(records){\nconst template=${JSON.stringify(template)},script=${JSON.stringify(script)};\nconst data=JSON.stringify(records).replace(/</g,'\\\\u003c');\nreturn template.replace('<script type="module" src="main.js"></script>',()=>'<script>window.travelRingTreeRecords='+data+';'+script.replace(/<\\/script/gi,'<\\\\/script')+'</script>');\n};\n`;
  fs.writeFileSync(path.join(__dirname,'embedded.js'),output);console.log('Built local travel ring tree ('+Buffer.byteLength(output)+' bytes)');
})().catch(e=>{console.error(e);process.exitCode=1;});
