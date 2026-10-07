const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
const source=fs.readFileSync(require('node:path').join(__dirname,'../index.html'),'utf8');
test('照片册横向或零位移滚轮不能被当作上一页，垂直滚轮保持原方向',()=>{
  const commands=[],state={wheelAt:0},context={memoryAlbum3DState:{reader:{}},memoryShelfState:state,performance:{now:()=>1000},memoryTurnAlbum:step=>commands.push(step)};
  vm.createContext(context);
  vm.runInContext(source.slice(source.indexOf('  function memoryAlbumStageWheel('),source.indexOf('  function memoryRenderAlbumSpread(')),context);
  context.memoryAlbumStageWheel({deltaX:80,deltaY:0,preventDefault(){}});
  assert.deepEqual(commands,[],'横向滚轮不能反向翻页');
  assert.equal(state.wheelAt,0,'无效滚轮不能消耗翻页节流窗口');
  for(const [deltaY,want] of [[120,1],[-120,-1]]){
    state.wheelAt=0;context.memoryAlbumStageWheel({deltaY,preventDefault(){}});
    assert.equal(commands.at(-1),want);
  }
});
