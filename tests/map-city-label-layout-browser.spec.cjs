const {test}=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const {chromium}=require('C:/Users/86177/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const root=path.resolve(__dirname,'..'),source=fs.readFileSync(path.join(root,'index.html'),'utf8');

test('电脑端主页密集城市名变淡、不重叠，放大恢复且空旷处优先右侧',async()=>{
  const browser=await chromium.launch({channel:'msedge',headless:true});
  try{
    const page=await browser.newPage({viewport:{width:1440,height:1000},javaScriptEnabled:false});
    await page.route(/^https?:/,route=>route.abort());
    await page.goto(require('node:url').pathToFileURL(path.join(root,'index.html')).href);
    const from=source.indexOf('     function computeLabelPositions(){'),end=source.indexOf('     recomputeLabelPositions=computeLabelPositions;',from);
    const refresh=source.indexOf('  function refreshCityNameLabels('),refreshEnd=source.indexOf('\n  }',refresh)+4;
    await page.evaluate(`
      const host=document.createElement('div');host.style.cssText='position:fixed;left:0;top:0;width:1000px;height:700px';document.body.replaceChildren(host);
      let scale=1,currentZoom=2,selectedProvinceName='';const NORMAL_LABEL_ZOOM_THRESHOLD=8,FULL_VISITED_LABEL_ZOOM_THRESHOLD=5;
      const points=Array.from({length:12},(_,i)=>({cityKey:'c'+i,name:'城市'+i,adcode:'test',value:[200+i*2,180+(i%3)*2]}));
      points.push({cityKey:'alone',name:'独立城市',adcode:'test',value:[850,480]});
      const option={geo:[{},{},{}],series:[{data:[]},{data:points},{data:[]}]};
      const myChart={getOption:()=>option,getDom:()=>host,convertToPixel:(_,v)=>v[0]===850?v:[200+(v[0]-200)*scale,180+(v[1]-180)*scale],setOption:patch=>patch.series.forEach((s,i)=>Object.assign(option.series[i],s))};
      const markerScale=()=>1,isCapital=()=>false,getFootprintHome=()=>null,visitedNameShouldShow=()=>currentZoom>=1.5,provinceOf=()=>'';
      const chartThemeColors=()=>({cityLabel:'#38bdf8',cityLabelShadow:'rgba(0,0,0,.9)'});
      ${source.slice(from,end)}
      ${source.slice(refresh,refreshEnd)}
      window.mapLabels={run:computeLabelPositions,refresh:refreshCityNameLabels,zoom:(n,z=2)=>{scale=n;currentZoom=z;},labels:()=>option.series[2].data};
    `);
    await page.evaluate(()=>document.fonts.load('700 11.5px "Noto Serif SC"'));
    const noOverlap=async scale=>{
      const boxes=await page.evaluate(scale=>mapLabels.labels().filter(d=>d.label.show).map(d=>{
        const ctx=document.createElement('canvas').getContext('2d');ctx.font='700 11.5px "Noto Serif SC",serif';
        const i=Number(d.cityKey.slice(1)),x=d.cityKey==='alone'?850:200+i*2*scale,y=d.cityKey==='alone'?480:180+(i%3)*2*scale,l=d.label,w=ctx.measureText(d.name).width,h=l.lineHeight||16;
        const left=l.position==='left'?x-l.distance-w:l.position==='right'?x+l.distance:x-w/2;
        const top=l.position==='top'?y-l.distance-h:l.position==='bottom'?y+l.distance:y-h/2;
        return {left,top,right:left+w,bottom:top+h};
      }),scale);
      for(let i=0;i<boxes.length;i++)for(let j=i+1;j<boxes.length;j++){const a=boxes[i],b=boxes[j];assert.ok(a.right<=b.left||b.right<=a.left||a.bottom<=b.top||b.bottom<=a.top,'实际输出的标签框不能重叠');}
    };
    await page.evaluate(()=>mapLabels.run());
    const dense=await page.evaluate(()=>mapLabels.labels().map(d=>({id:d.cityKey,label:d.label})));
    assert.ok(dense.filter(d=>d.label.show).length<13,'密集处无法排开的名称暂时隐藏');
    assert.ok(dense.every(d=>d.label.opacity===.6),'只降低城市标签的不透明度');
    assert.ok(dense.every(d=>d.label.overflow!=='truncate'&&d.label.width==null),'完整城市名不能再用测量宽度截断');
    assert.equal(dense.find(d=>d.id==='alone').label.position,'right');
    await noOverlap(1);
    await page.evaluate(()=>mapLabels.run());
    assert.deepEqual(await page.evaluate(()=>mapLabels.labels().map(d=>({id:d.cityKey,label:d.label}))),dense,'相同视图重复计算不应跳换位置');
    await page.evaluate(()=>mapLabels.refresh());
    assert.deepEqual(await page.evaluate(()=>mapLabels.labels().map(d=>d.label.show)),dense.map(d=>d.label.show),'显隐刷新不能重新显示避让隐藏的文字');
    await page.evaluate(()=>{mapLabels.zoom(20);mapLabels.run();});
    assert.equal(await page.evaluate(()=>mapLabels.labels().filter(d=>d.label.show).length),13,'空间充足后全部恢复');
    await noOverlap(20);
    await page.evaluate(()=>{mapLabels.zoom(1,4.99);mapLabels.run();});
    assert.ok(await page.evaluate(()=>mapLabels.labels().filter(d=>d.label.show).length<13),'充分放大前仍保留遮挡隐藏');
    await page.evaluate(()=>{mapLabels.zoom(1,5);mapLabels.run();mapLabels.refresh();});
    assert.equal(await page.evaluate(()=>mapLabels.labels().filter(d=>d.label.show).length),13,'达到充分放大阈值即使拥挤也不隐藏已点亮名称');
    await page.evaluate(()=>{mapLabels.zoom(1,2);mapLabels.run();});
    assert.ok(await page.evaluate(()=>mapLabels.labels().filter(d=>d.label.show).length<13),'缩小后重新启用避让隐藏');
  }finally{await browser.close();}
});
