const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),os=require('node:os');
const {chromium}=require('C:/Users/86177/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const deps='F:/03-agent项目/Zcode/002-Your-China-Travel/assets/vendor/album-3d-src/node_modules';
const esbuild=require(path.join(deps,'esbuild'));

test('展开书的装订与纸边使用纸张材质，关闭恢复布面，CSS备用内页不透出彩色边框',async()=>{
  const source=fs.readFileSync(path.join(__dirname,'../index.html'),'utf8');
  const bundle=esbuild.buildSync({stdin:{contents:'import * as THREE from "three";window.THREE=THREE;',resolveDir:deps},bundle:true,write:false,format:'iife',nodePaths:[deps]}).outputFiles[0].text;
  const browser=await chromium.launch({channel:'chrome',headless:true,args:['--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader']});
  try{
    const page=await browser.newPage({viewport:{width:1000,height:760}});
    await page.setContent(source.match(/<style[\s\S]*?<\/style>/g).join('')+'<div id="memoryShelfViewport"></div><div class="memory-book opening" style="--book-cover:#3d7285;--book-edge:#e8dfd0"><span class="memory-book-spine-face"></span><span class="memory-book-back"></span></div>');
    await page.addScriptTag({content:bundle});
    const definitions=source.slice(source.indexOf('  function memoryBookCoverTexture('),source.indexOf('  function memoryDisposeThreeShelf('));
    const palette=source.slice(source.indexOf('  const MEMORY_BOOK_COLORS='),source.indexOf('  const memoryShelfState='));
    await page.addScriptTag({content:palette+definitions+`
      function memoryBookPalette(index){return MEMORY_BOOK_COLORS[index%MEMORY_BOOK_COLORS.length];}
      const $=id=>document.getElementById(id),formatMonth=x=>x;
      const memoryShelfState={active:0,opening:false,bookRotation:null,pageShift:0};
      const memoryShelfLayout=()=>({capacity:3}),memoryPositionShelfMore=()=>{};
      const province={name:'浙江省',photoCount:30,cities:[{name:'杭州市',photoCount:5},{name:'金华市',photoCount:25}]};
      const rig=memoryCreateThreeBook(THREE,province,0),cloth=rig.spine.material;
      const memoryThreeShelf={THREE,rigs:[rig]};
    `});
    const result=await page.evaluate(()=>{
      memoryShelfState.opening=true;memoryUpdateThreeShelfTargets();
      const warm=material=>{
        const canvas=material.map?.image;
        const rgba=canvas?.getContext('2d').getImageData(canvas.width/2,canvas.height/2,1,1).data;
        return rgba?rgba[0]>rgba[1]&&rgba[1]>rgba[2]:material.color.r>material.color.g&&material.color.g>material.color.b;
      };
      const opening={spine:warm(rig.spine.material),back:warm(rig.back.material),separate:rig.spine.material!==cloth&&rig.back.material!==cloth};
      memoryShelfState.opening=false;memoryUpdateThreeShelfTargets();
      return {opening,restored:rig.spine.material===cloth&&rig.back.material===cloth&&rig.coverShell.material===rig.coverCloth};
    });
    assert.deepEqual(result.opening,{spine:true,back:true,separate:true},'展开内页不能继续使用青绿色布面');
    assert.equal(result.restored,true,'关闭后的封皮仍保留原布面色');
    const edges=await page.evaluate(()=>{
      const size=mesh=>{mesh.geometry.computeBoundingBox();return mesh.geometry.boundingBox.getSize(new THREE.Vector3());};
      const back=size(rig.back),page=size(rig.chapterPageArt),inside=size(rig.insideCoverArt),shell=size(rig.coverPivot.children[0]);
      return {width:back.x-page.x,height:back.y-page.y,insideWidth:shell.x-inside.x,insideHeight:shell.y-inside.y,center:rig.chapterPageArt.position.x};
    });
    assert.ok(edges.width<=.02&&edges.height<=.024,'封底实际外沿仅能比内页大约1%，不能形成实体外框：'+JSON.stringify(edges));
    assert.ok(edges.insideWidth<=.02&&edges.insideHeight<=.024,'左侧内衬也必须覆盖封面内侧');
    assert.ok(Math.abs(edges.center)<.005,'右页居中，不能偏移露出封底');
    const css=await page.locator('.memory-book-spine-face').evaluate(el=>getComputedStyle(el).backgroundImage);
    assert.ok(!css.includes('61, 114, 133'),'CSS备用模型也不能在展开时露出青绿色书脊');
    await page.evaluate(()=>{
      memoryShelfState.opening=true;memoryUpdateThreeShelfTargets();rig.coverPivot.rotation.y=-1.82;rig.root.position.x=.65;
      const renderer=new THREE.WebGLRenderer({antialias:true});renderer.setSize(1000,760);renderer.outputColorSpace=THREE.SRGBColorSpace;renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=.96;
      renderer.domElement.id='paperPreview';renderer.domElement.style.cssText='position:fixed;inset:0;z-index:9999';document.body.appendChild(renderer.domElement);
      const scene=new THREE.Scene();scene.background=new THREE.Color('#edf1f1');scene.add(rig.root);
      scene.add(new THREE.HemisphereLight(0xf7f8f4,0xc4c0b8,.78));
      const light=new THREE.DirectionalLight(0xfff8ea,1.12);light.position.set(-3.5,6.5,5.5);scene.add(light);
      const rim=new THREE.DirectionalLight(0xc3d6dd,.3);rim.position.set(5,2,-3);scene.add(rim);
      const camera=new THREE.PerspectiveCamera(31,1000/760,.1,30);camera.position.set(0,.2,6);camera.lookAt(0,0,0);
      renderer.render(scene,camera);
    });
    await page.locator('#paperPreview').screenshot({path:path.join(os.tmpdir(),'travel-book-warm-paper.png')});
  }finally{await browser.close();}
});
