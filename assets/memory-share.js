/* 匿名书架分享：仅在用户确认后上传公开副本。 */
window.MemoryShelfShare=(()=>{
  const config=window.TRAVEL_SUPABASE_CONFIG||{};
  const endpoint=config.url+'/functions/v1/memory-shelf-share';
  const LIMIT=12*1024*1024;
  async function timed(promise,ms,message){
    let timer;
    try{return await Promise.race([promise,new Promise((_,reject)=>{timer=setTimeout(()=>reject(new Error(message)),ms);})]);}
    finally{clearTimeout(timer);}
  }
  async function request(body){
    const controller=new AbortController();
    try{return await timed((async()=>{
      const response=await fetch(endpoint,{method:'POST',signal:controller.signal,headers:{'Content-Type':'application/json',apikey:config.publishableKey},body:JSON.stringify(body)});
      const result=await response.json();
      if(!response.ok) throw new Error(result.error||'分享服务暂时不可用');
      return result;
    })(),60000,'上传／读取分享内容超时，请检查网络后重试');}
    catch(error){controller.abort();throw error instanceof TypeError?new Error('无法连接分享服务，请检查网络后重试'):error;}
  }
  function loadImage(src){return timed(new Promise((resolve,reject)=>{const image=new Image();image.crossOrigin='anonymous';image.onload=()=>resolve(image);image.onerror=()=>reject(new Error('照片读取失败，请检查资料文件夹是否已连接'));image.src=src;}),20000,'照片读取超时，请检查资料文件夹后重试');}
  async function compress(src){
    const image=await loadImage(src),canvas=document.createElement('canvas'),ratio=Math.min(1,900/Math.max(image.width,image.height));
    canvas.width=Math.max(1,Math.round(image.width*ratio));canvas.height=Math.max(1,Math.round(image.height*ratio));
    const ctx=canvas.getContext('2d');ctx.fillStyle='#fff';ctx.fillRect(0,0,canvas.width,canvas.height);ctx.drawImage(image,0,0,canvas.width,canvas.height);
    return canvas.toDataURL('image/jpeg',.7);
  }
  function credentials(provinceName){
    const key='memoryProvinceShareManagement:'+provinceName;
    const stored=localStorage.getItem(key);
    if(stored){const value=JSON.parse(stored);if(/^[a-f0-9]{64}$/.test(value.managementKey||'')&&/^[a-f0-9-]{36}$/i.test(value.shareId||''))return value;}
    const bytes=crypto.getRandomValues(new Uint8Array(32));
    const value={shareId:crypto.randomUUID(),managementKey:Array.from(bytes).map(byte=>byte.toString(16).padStart(2,'0')).join('')};
    // 上传之前存储，若浏览器无法持久化凭证则不能创建无法管理的分享。
    localStorage.setItem(key,JSON.stringify(value));return value;
  }
  let qrReady;
  function ensureQr(){
    if(window.QRCode)return Promise.resolve();
    if(!qrReady)qrReady=timed(new Promise((resolve,reject)=>{const script=document.createElement('script');script.src='assets/vendor/qrcode-1.0.0.min.js';script.onload=()=>window.QRCode?resolve():reject(new Error('二维码加载失败'));script.onerror=()=>reject(new Error('二维码加载失败，可复制链接分享'));document.head.appendChild(script);}),15000,'二维码加载超时，可复制链接分享').catch(error=>{qrReady=null;throw error;});
    return qrReady;
  }
  async function poster(snapshot,url){
    await ensureQr();
    if(document.fonts)await timed(document.fonts.ready,3000,'字体加载超时').catch(()=>{});
    const canvas=document.createElement('canvas');canvas.width=1080;canvas.height=1440;
    const ctx=canvas.getContext('2d');ctx.fillStyle='#f4efe4';ctx.fillRect(0,0,1080,1440);
    ctx.fillStyle='#985627';ctx.font='24px sans-serif';ctx.fillText('旅行记忆书库',76,100);
    ctx.fillStyle='#183846';ctx.font='bold 64px serif';ctx.fillText(snapshot.provinces[0].name+'旅行记忆',76,198,928);
    const cities=snapshot.provinces.flatMap(p=>p.cities),count=cities.reduce((sum,c)=>sum+c.photos.length,0);
    ctx.font='26px sans-serif';ctx.fillText(snapshot.provinces.length+' 个省份 · '+cities.length+' 座城市 · '+count+' 张照片',76,260);
    const covers=snapshot.provinces.slice(0,6),columns=Math.min(3,covers.length),rows=Math.ceil(covers.length/columns),width=(928-(columns-1)*24)/columns,height=rows===1?625:295;
    for(let i=0;i<covers.length;i++){
      const p=covers[i],x=76+(i%columns)*(width+24),y=330+Math.floor(i/columns)*330;
      ctx.fillStyle=['#3d7285','#a4523a','#67754a'][i%3];ctx.fillRect(x,y,width,height);
      const src=p.cover||p.cities.flatMap(c=>c.photos)[0]?.dataUrl;
      if(src){const image=await loadImage(src),scale=Math.max((width-24)/image.width,(height-73)/image.height);ctx.save();ctx.beginPath();ctx.rect(x+12,y+58,width-24,height-73);ctx.clip();ctx.drawImage(image,x+12+(width-24-image.width*scale)/2,y+58+(height-73-image.height*scale)/2,image.width*scale,image.height*scale);ctx.restore();}
      ctx.fillStyle='#f5eee0';ctx.font='26px serif';ctx.fillText(p.name,x+16,y+39,width-32);
    }
    const qr=document.createElement('div');new QRCode(qr,{text:url,width:240,height:240,correctLevel:QRCode.CorrectLevel.M});
    const qrCanvas=qr.querySelector('canvas');if(!qrCanvas)throw new Error('二维码未能生成，请复制链接分享');
    ctx.fillStyle='#fff';ctx.fillRect(76,1060,272,272);ctx.drawImage(qrCanvas,92,1076,240,240);
    ctx.fillStyle='#183846';ctx.font='bold 33px serif';ctx.fillText('微信扫码',400,1160);ctx.font='29px serif';ctx.fillText('翻阅我的旅行记忆',400,1220);
    ctx.fillStyle='#657780';ctx.font='22px sans-serif';ctx.fillText('一省一卷，一城一章',400,1280);
    return canvas;
  }
  function showPreview(url,provinceName){
    const dialog=document.createElement('dialog');dialog.className='memory-share-dialog';
    const heading=document.createElement('h2');heading.textContent=provinceName+'分享海报';
    const note=document.createElement('p');note.textContent='保存海报后发送到微信，好友扫码即可查看照片。';
    const content=document.createElement('div'),status=document.createElement('p');status.textContent='正在生成海报…';content.append(status);
    const link=document.createElement('a');link.href=url;link.target='_blank';link.rel='noopener';link.textContent='打开只读书架';
    const controls=document.createElement('div');controls.className='memory-share-actions';
    const save=document.createElement('button');save.textContent='保存海报';save.disabled=true;
    const copy=document.createElement('button');copy.textContent='复制分享链接';copy.onclick=async()=>{try{await navigator.clipboard.writeText(url);copy.textContent='已复制';}catch{status.textContent='请长按下方链接复制：'+url;}};
    const close=document.createElement('button');close.textContent='关闭';close.onclick=()=>dialog.close();
    controls.append(save,copy,close);dialog.append(heading,note,content,link,controls);document.body.append(dialog);dialog.addEventListener('close',()=>dialog.remove(),{once:true});dialog.showModal();
    return {content,status,save};
  }
  async function create(provinces,getPhotos,onProgress){
    if(!provinces||provinces.length!==1)throw new Error('请选择一个省份进行分享');
    const snapshot={version:1,provinces:[]};let images=0;
    for(const province of provinces){
      const book={name:province.name,review:province.review||'',cover:'',cities:[]};
      for(const city of province.cities){
        onProgress('正在读取'+city.name+'的照片…');
        const chapter={name:city.name,description:city.meta?.description||'',firstMonth:city.firstMonth||'',photos:[]};
        for(const photo of (await timed(getPhotos(city),10000,'读取'+city.name+'照片超时，请重试')).filter(p=>p.kind!=='video')){
          if(!photo.dataUrl)throw new Error('部分照片尚未加载，请先恢复资料后重试');
          chapter.photos.push({name:photo.name||'',dataUrl:await compress(photo.dataUrl)});images++;onProgress('正在整理第 '+images+' 张照片…');
        }
        book.cities.push(chapter);
      }
      if(province.cover){onProgress('正在整理'+province.name+'封面…');book.cover=await compress(province.cover);}
      snapshot.provinces.push(book);
    }
    if(!images)throw new Error('记忆书架中还没有可分享的照片');
    if(images>1500)throw new Error('目前单次分享支持最多 1500 张照片');
    const auth=credentials(provinces[0].name),body={action:'publish',...auth,snapshot};
    if(new TextEncoder().encode(JSON.stringify(body)).length>LIMIT)throw new Error('该省份压缩后的照片超过 12MB，暂时无法生成分享');
    onProgress('正在上传分享内容…');await request(body);
    const root=config.shareBaseUrl||'https://zwxll.github.io/Your-China-Travel/';
    const url=new URL('memory-share.html',root);url.searchParams.set('s',auth.shareId);
    const preview=showPreview(url.href,provinces[0].name);
    onProgress('上传完成，正在生成海报…');
    try{
      const canvas=await poster(snapshot,url.href),image=document.createElement('img');image.alt='记忆书架分享海报';image.src=canvas.toDataURL('image/png');preview.content.replaceChildren(image);preview.save.disabled=false;
      preview.save.onclick=()=>canvas.toBlob(blob=>{if(!blob){preview.status.textContent='海报保存失败，请截图保存';preview.content.append(preview.status);return;}const href=URL.createObjectURL(blob),a=document.createElement('a');a.href=href;a.download='旅行记忆书架.png';a.click();setTimeout(()=>URL.revokeObjectURL(href),30000);},'image/png');
      onProgress('分享海报已生成，可保存后发送到微信。');
    }catch(error){preview.status.textContent=error.message;onProgress('分享链接已生成，海报生成失败：'+error.message);}
  }
  return {create,request};
})();
