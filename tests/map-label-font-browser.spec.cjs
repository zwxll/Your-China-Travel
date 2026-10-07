const {test}=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const {chromium}=require('C:/Users/86177/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const root=path.resolve(__dirname,'..'),source=fs.readFileSync(path.join(root,'index.html'),'utf8');

test('电脑端主页省市标签使用本地宋体，字号颜色及提示字体保持原样',async()=>{
  const browser=await chromium.launch({channel:'msedge',headless:true});
  try{
    const page=await browser.newPage({viewport:{width:1440,height:1000},javaScriptEnabled:false});
    await page.route(/^https?:/,route=>route.abort());
    await page.goto(require('node:url').pathToFileURL(path.join(root,'index.html')).href);
    const start=source.indexOf('    const option={',source.indexOf('  function initChart('));
    const end=source.indexOf('\n    myChart.setOption(option);',start);
    const result=await page.evaluate(async expression=>{
      const option=Function('tc','return '+expression)({label:'#38bdf8',cityLabel:'#38bdf8'});
      const family=option.geo[2].label.fontFamily||option.textStyle.fontFamily;
      await document.fonts.load('700 13px '+family,'浙江南昌');
      const canvas=document.createElement('canvas');canvas.width=240;canvas.height=50;
      const ctx=canvas.getContext('2d'),draw=font=>{ctx.clearRect(0,0,240,50);ctx.font='700 24px '+font;ctx.fillText('浙江 南昌',5,32);return Array.from(ctx.getImageData(0,0,240,50).data);};
      const serif=draw(family),sans=draw('"Microsoft YaHei",sans-serif');
      return {family,loaded:document.fonts.check('700 13px "Noto Serif SC"','浙江南昌'),different:serif.some((v,i)=>v!==sans[i]),province:option.geo[2].label.fontSize,city:option.series[2].label.fontSize,color:option.geo[2].label.color,tooltip:option.tooltip.textStyle.fontFamily||option.textStyle.fontFamily,cityOpacity:option.series[2].label.opacity,normalOpacity:option.series[0].label.opacity,provinceOpacity:option.geo[2].label.opacity??1,pointOpacity:option.series[0].itemStyle.opacity};
    },source.slice(start+'    const option='.length,end).trim().replace(/;$/,''));
    assert.ok(result.family.startsWith('"Noto Serif SC"'),'省市标注统一继承思源宋体');
    assert.equal(result.loaded,true);assert.equal(result.different,true,'实际中文字形应不同于原雅黑');
    assert.equal(result.province,13);assert.equal(result.city,11.5);assert.equal(result.color,'#38bdf8');
    assert.ok(result.tooltip.includes('Microsoft YaHei')&&!result.tooltip.includes('Noto Serif SC'),'悬浮提示仍使用原字体');
    assert.deepEqual([result.cityOpacity,result.normalOpacity,result.provinceOpacity,result.pointOpacity],[.6,.6,1,.9],'只弱化城市名，不改变省份文字或城市光点');
  }finally{await browser.close();}
});
