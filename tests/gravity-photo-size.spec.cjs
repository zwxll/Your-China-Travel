const {test}=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const html=fs.readFileSync(path.join(__dirname,'../index.html'),'utf8');
const start=html.indexOf('    function addPhotoBody('),end=html.indexOf('    // 照片释放调度',start)>=0?html.indexOf('    // 照片释放调度',start):html.indexOf('    // 一次性创建所有刚体',start);

test('引力相册横图、竖图及最小尺寸照片显示和碰撞区域同步放大至此前120%',()=>{
  // Only the external physics/canvas boundaries are substituted; execute the real sizing and body setup.
  const bodies=[];
  const Bodies={rectangle:(x,y,width,height,options)=>({position:{x,y},width,height,...options})};
  class Path2D{moveTo(){} lineTo(){} quadraticCurveTo(){} closePath(){}}
  const add=new Function('Bodies','World','Path2D','gravityBodies','gravityEngine','n0','r8',html.slice(start,end)+'return addPhotoBody;')(
    Bodies,{add(){}},Path2D,bodies,{world:{}},4,8
  );
  for(const [width,height,wantW,wantH] of [[400,300,216,162],[300,400,162,216],[1000,100,216,64.8],[100,1000,64.8,216]]){
    bodies.length=0;
    add({img:{width,height}},0,0,800,0,800,200);
    const body=bodies.at(-1);
    assert.ok(Math.abs(body.imgW-wantW)<1e-9);
    assert.ok(Math.abs(body.imgH-wantH)<1e-9);
    assert.equal(body.width,body.imgW);
    assert.equal(body.height,body.imgH);
  }
});

test('所有照片预先位于画面上方，高度错开，横向位置不越过两侧边界',()=>{
  const bodies=[];
  const Bodies={rectangle:(x,y,width,height)=>({position:{x,y},width,height})};
  class Path2D{moveTo(){} lineTo(){} quadraticCurveTo(){} closePath(){}}
  const add=new Function('Bodies','World','Path2D','gravityBodies','gravityEngine','n0','r8',html.slice(start,end)+'return addPhotoBody;')(
    Bodies,{add(){}},Path2D,bodies,{world:{}},20,8
  );
  for(let i=0;i<20;i++){
    add({img:{width:400,height:300}},i,80,720,40,640,200);
    const body=bodies.at(-1);
    assert.ok(body.position.y+body.imgH/2<40,'照片必须从可视区上方自然落入');
    if(i) assert.ok(body.position.y<bodies[i-1].position.y,'后面的照片初始位置更高');
    assert.ok(body.position.x-body.imgW/2>=80);
    assert.ok(body.position.x+body.imgW/2<=720);
  }
});

test('一次性创建上方照片，全部落入后才封顶，不能提前挡住后面的照片',()=>{
  const releaseStart=html.indexOf('    // 照片释放调度',start);
  const releaseEnd=html.indexOf('    // 【修复项2-5】自定义渲染',start);
  // Exercise the production scheduling with a controlled engine clock.
  const source=releaseStart>=0?html.slice(releaseStart,releaseEnd):html.slice(end,releaseEnd);
  const released=[],engine={timing:{timestamp:0},world:{}},walls=[],bodies=[{bounds:{min:{y:-300}}},{bounds:{min:{y:-150}}}],topWall={label:'top'};
  const tick=new Function('allLoadedImages','addPhotoBody','Events','gravityEngine','playLeft','playRight','playTop','playW','bodySize','n0','World','gravityBodies','topWall',
    'let gravityReleaseCb=null,gravityTopWallCb=null;'+source+'return ()=>{if(gravityReleaseCb)gravityReleaseCb();if(gravityTopWallCb)gravityTopWallCb();};')(
      Array.from({length:8},(_,i)=>({img:{},id:i})),item=>released.push(item.id),
      {on(){},off(){}},engine,80,720,40,640,200,8,{add:(world,wall)=>walls.push(wall)},bodies,topWall
    );
  assert.deepEqual(released,[0,1,2,3,4,5,6,7]);
  tick();
  assert.equal(walls.length,0);
  bodies[0].bounds.min.y=60;tick();
  assert.equal(walls.length,0);
  bodies[1].bounds.min.y=60;tick();tick();
  assert.deepEqual(walls,[topWall]);
  assert.deepEqual(released,[0,1,2,3,4,5,6,7]);
});
