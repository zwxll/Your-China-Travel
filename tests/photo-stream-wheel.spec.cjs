const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const vm=require('node:vm');
const dir=path.join(__dirname,'../assets/photo-stream/js');
const app=fs.readFileSync(path.join(dir,'app.js'),'utf8');
function scene(){
  const handlers={};
  const context=vm.createContext({Math,Float32Array,Float64Array,Map,performance:{now:()=>1000},
    innerWidth:1280,innerHeight:900,matchMedia:()=>({matches:true}),NF:30,IDLE:0,
    canvas:{addEventListener:(type,handler)=>{handlers[type]=handler;}},
    body:{classList:{toggle(){},remove(){}}},$meter:{style:{setProperty(){}}}});
  vm.runInContext(fs.readFileSync(path.join(dir,'math.js'),'utf8').replace(/^export /gm,'')+'\n'+
    app.slice(app.indexOf('const SEG ='),app.indexOf('// ────────────────────────────────────────────────────────────── world'))+'\n'+
    app.slice(app.indexOf('function disp('),app.indexOf('// ────────────────────────────────────────────────────────────── stories'))+'\n'+
    app.slice(app.indexOf('function markInput()'),app.indexOf("canvas.addEventListener('pointerdown'"))+'\n'+
    app.slice(app.indexOf('function step('),app.indexOf('function bindCommon('))+'\n'+`
    view={isOpen:false}; stories=Array.from({length:NF},()=>({chapters:[{}]}));
    for(const key of ['x0','speed','o','v','py','hold','phase','flow'])fib[key]=new Float64Array(NF);
    for(let i=0;i<NF;i++){fib.x0[i]=-9+(i+.5)*.6;fib.speed[i]=1;fib.py[i]=7;}
    T.fibD={data:new Float32Array(NF*4)};
    cam.y=HOME_Y;cam.ls=cam.lsT=LS_MIN()+.4;
    pointer.x=640;pointer.y=450;pointer.inside=true;pointer.lastX=640;
    globalThis.state={cam,fib,pointer}; globalThis.tick=(now)=>step(1/60,now);
  `,context);
  return {state:context.state,tick:context.tick,wheel:deltaY=>handlers.wheel({preventDefault(){},deltaMode:0,deltaY,clientX:640,clientY:450,ctrlKey:false}),context};
}
test('滚轮缩放不应因静止鼠标反复拨动光线',()=>{
  const s=scene();
  for(let i=0;i<45;i++){if(i%5===0)s.wheel(-20);s.tick(1000+i*16);}
  assert.ok(Math.max(...Array.from(s.state.fib.o,Math.abs))<1e-8,'仅滚动滚轮却产生了横向光线位移');
});
test('滚轮缩放结束后不应重新释放旧拖动惯性',()=>{
  const s=scene();s.state.pointer.inside=false;s.state.cam.vx=3;s.state.cam.vy=-2;
  s.wheel(-50);
  for(let i=0;i<150;i++)s.tick(1000+i*16);
  assert.ok(Math.abs(s.state.cam.x)<1e-8,'缩放后旧的横向惯性使镜头漂移');
});
test('不滚动时保留鼠标悬停拨动光线',()=>{
  const s=scene();for(let i=0;i<45;i++)s.tick(3000+i*16);
  assert.ok(Math.max(...Array.from(s.state.fib.o,Math.abs))>.001);
});
