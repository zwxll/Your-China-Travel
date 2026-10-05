// Mechanical bundle: no modules/fetch are required when index.html is opened via file://.
const fs=require('node:fs'),path=require('node:path');
const read=name=>fs.readFileSync(path.join(__dirname,name),'utf8');
const template=read('template.html').replace('<link rel="stylesheet" href="styles.css">','<style>'+read('styles.css')+'</style>');
const script=read('app.js');
const bundle=`/* Image Atlas by Haichao Li, MIT. See assets/image-atlas/LICENSE. */
window.ImageAtlasDocument=function(records,journey=[]){
 const template=${JSON.stringify(template)},script=${JSON.stringify(script)};
 const data=JSON.stringify(records).replace(/</g,'\\\\u003c');
 const visits=JSON.stringify(journey).replace(/</g,'\\\\u003c');
 return template.replace('<script type="module" src="app.js"></script>',()=>'<script>window.atlasImages='+data+';window.atlasJourney='+visits+';'+script.replace(/<\\/script/gi,'<\\\\/script')+'</script>');
};\n`;
fs.writeFileSync(path.join(__dirname,'embedded.js'),bundle);
