const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const {chromium}=require('C:/Users/86177/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
test('Lightfall背景明显提亮、边缘不受暗角削弱且不改变照片像素',async()=>{
  const browser=await chromium.launch({channel:'chrome',headless:true,args:['--use-angle=swiftshader','--enable-unsafe-swiftshader']});
  try{
    const page=await browser.newPage();
    const source=fs.readFileSync(path.resolve('assets/photo-stream/js/shaders.js'),'utf8').replace(/^import .*;\r?\n/gm,'').replace(/^export /gm,'');
    await page.addScriptTag({content:'const LAYER=128,ATLAS_GRID=4;\n'+source+'\nwindow.testShaders={vs:POST_VS,fs:COMPOSITE_FS};'});
    const result=await page.evaluate(()=>{
      const canvas=document.createElement('canvas');canvas.width=canvas.height=64;
      const gl=canvas.getContext('webgl2'),program=gl.createProgram();
      for(const [type,source] of [[gl.VERTEX_SHADER,testShaders.vs],[gl.FRAGMENT_SHADER,testShaders.fs]]){
        const shader=gl.createShader(type);gl.shaderSource(shader,source);gl.compileShader(shader);
        if(!gl.getShaderParameter(shader,gl.COMPILE_STATUS))throw Error(gl.getShaderInfoLog(shader));
        gl.attachShader(program,shader);
      }
      gl.linkProgram(program);gl.useProgram(program);
      gl.uniform2f(gl.getUniformLocation(program,'uRes'),64,64);
      const textures=['uScene','uBloom','uRefl','uLightfall'].map((name,i)=>{
        gl.activeTexture(gl.TEXTURE0+i);const texture=gl.createTexture();gl.bindTexture(gl.TEXTURE_2D,texture);
        gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MIN_FILTER,gl.NEAREST);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MAG_FILTER,gl.NEAREST);
        gl.uniform1i(gl.getUniformLocation(program,name),i);return texture;
      });
      function render(scene,background){
        textures.forEach((texture,i)=>{
          gl.activeTexture(gl.TEXTURE0+i);gl.bindTexture(gl.TEXTURE_2D,texture);const value=i===0?scene:i===3?background:0;
          gl.texImage2D(gl.TEXTURE_2D,0,gl.RGBA,1,1,0,gl.RGBA,gl.UNSIGNED_BYTE,new Uint8Array([value,value,value,255]));
        });
        gl.drawArrays(gl.TRIANGLES,0,3);const pixels=new Uint8Array(64*64*4);
        gl.readPixels(0,0,64,64,gl.RGBA,gl.UNSIGNED_BYTE,pixels);return pixels;
      }
      const backdrop=render(0,255);let center=0,edge=0;
      for(let y=28;y<36;y++)for(let x=28;x<36;x++)center+=backdrop[(y*64+x)*4];
      for(let y=28;y<36;y++)for(let x=0;x<8;x++)edge+=backdrop[(y*64+x)*4];
      return {center:center/64,edge:edge/64,photoDark:[...render(128,0)],photoBright:[...render(128,255)]};
    });
    assert.ok(result.center>=61&&result.center<=71,'中央白色测试底景应约66/255，比刚才约83/255再降低20%');
    assert.ok(result.edge>=140&&result.edge<=152,'两侧白色测试底景应约147/255，比刚才基础亮度再降低20%');
    assert.ok(result.edge>result.center*2,'中央区域仍显著低于两侧亮度');
    assert.deepEqual(result.photoBright,result.photoDark,'前景照片像素不受背景提亮影响');
  }finally{await browser.close();}
});
