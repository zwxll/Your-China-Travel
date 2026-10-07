const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const {chromium}=require('C:/Users/86177/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const source=fs.readFileSync(path.join(__dirname,'../index.html'),'utf8');
test('两种轨迹城市名称优先当前到站、避让密集名称，放大恢复、缩小隐藏、拖动同步，手机不溢出',async()=>{
  const browser=await chromium.launch({channel:'chrome',headless:true});
  try{
    const page=await browser.newPage({viewport:{width:900,height:600}});
    const styles=[...source.matchAll(/<style[^>]*>([\s\S]*?)<\/style>/g)].map(m=>m[1]).join('\n');
    await page.setContent('<style>'+styles+'</style><div id="testMap" style="position:relative;width:100%;height:500px"><svg id="names" style="width:100%;height:100%"></svg></div>');
    const from=source.indexOf('  function fpRenderCityLabels(');
    assert.ok(from>=0,'应提供共用城市名称布局');
    await page.evaluate(`
      const fpLinesEl=document.getElementById('names'),mapWrapEl=document.getElementById('testMap');
      const home={cityKey:'home',name:'家乡',value:[90,120]},
        a={cityKey:'a',name:'南昌市',value:[170,160]},b={cityKey:'b',name:'景德镇市',value:[190,160]},
        c={cityKey:'c',name:'上饶市',value:[210,160]},future={cityKey:'future',name:'未到站',value:[280,280]};
      let fpState={route:[home,a,b,c,future],arrived:[1,2,3]},fpYearState=null;
      let scale=1,offset=0;
      const myChart={convertToPixel(_,p){return [90+(p[0]-90)*scale+offset,p[1]];}};
      ${source.slice(from,source.indexOf('\n  }',from)+4)}
      window.labels={render:fpRenderCityLabels,zoom(v){scale=v;fpRenderCityLabels();},
        pan(v){offset=v;fpRenderCityLabels();},year(){fpState=null;fpYearState={home,cities:[a,b,c,future],arrived:[a,b,c],year:'2023'};fpRenderCityLabels();},
        all(){fpYearState.year='all';fpRenderCityLabels();}};
    `);
    const visible=()=>page.locator('.fp-city-name').evaluateAll(nodes=>nodes.filter(n=>getComputedStyle(n).display!=='none').map(n=>n.textContent));
    const noOverlap=async()=>{
      const boxes=await page.locator('.fp-city-name').evaluateAll(nodes=>nodes.filter(n=>getComputedStyle(n).display!=='none').map(n=>{
        const r=n.getBoundingClientRect();return {x:r.x,y:r.y,right:r.right,bottom:r.bottom};
      }));
      for(let i=0;i<boxes.length;i++)for(let j=i+1;j<boxes.length;j++){
        const a=boxes[i],b=boxes[j];assert.ok(a.right<=b.x||b.right<=a.x||a.bottom<=b.y||b.bottom<=a.y,'可见城市名不得重叠');
      }
    };
    await page.evaluate(()=>window.labels.render());
    assert.ok((await visible()).includes('上饶市'),'优先保留最新到站城市');
    assert.ok((await visible()).includes('家乡'),'家乡只显示原城市名称，不附加后缀');
    assert.equal(await page.locator('.fp-city-name').first().evaluate(el=>getComputedStyle(el).opacity),'0.6','名称降低不透明度，弱化视觉干扰');
    assert.ok((await visible()).length<4,'缩小时隐藏部分密集名称');
    assert.equal(await page.locator('.fp-city-name').filter({hasText:'未到站'}).count(),0);
    await noOverlap();
    await page.evaluate(()=>window.labels.zoom(5));
    assert.deepEqual((await visible()).sort(),['家乡','南昌市','景德镇市','上饶市'].sort());
    await noOverlap();
    const before=await page.locator('[data-city-key="c"]').boundingBox();
    await page.evaluate(()=>window.labels.pan(30));
    const after=await page.locator('[data-city-key="c"]').boundingBox();
    assert.ok(Math.abs(after.x-before.x-30)<1,'平移后名称跟随城市位置');
    await page.evaluate(()=>{window.labels.pan(0);window.labels.zoom(1);window.labels.year();});
    assert.ok((await visible()).length<4,'年份模式同样避让');
    await page.evaluate(()=>window.labels.zoom(5));assert.equal((await visible()).length,4);
    await page.setViewportSize({width:390,height:600});
    await page.evaluate(()=>{window.labels.zoom(1);window.labels.render();});
    await noOverlap();
    for(const box of await page.locator('.fp-city-name').evaluateAll(nodes=>nodes.filter(n=>getComputedStyle(n).display!=='none').map(n=>{
      const r=n.getBoundingClientRect();return {left:r.left,right:r.right};
    })))assert.ok(box.left>=0&&box.right<=390,'手机名称不能超出地图');
    await page.evaluate(()=>window.labels.all());
    assert.equal(await page.locator('.fp-city-name').filter({hasText:'未到站'}).count(),1,'全部概览仍可查看所有轨迹城市');
  }finally{await browser.close();}
});
