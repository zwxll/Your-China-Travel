/* 匿名书架分享：仅在用户确认后上传公开副本。 */
window.MemoryShelfShare=(()=>{
  const config=window.TRAVEL_SUPABASE_CONFIG||{};
  const endpoint=config.url+'/functions/v1/memory-shelf-share';
  const FILE_LIMIT=300*1024;
  async function timed(promise,ms,message){
    let timer;
    try{return await Promise.race([promise,new Promise((_,reject)=>{timer=setTimeout(()=>reject(new Error(message)),ms);})]);}
    finally{clearTimeout(timer);}
  }
  async function request(body){
    const controller=new AbortController();
    try{return await timed((async()=>{
      const response=await fetch(endpoint,{method:'POST',signal:controller.signal,headers:{'Content-Type':'application/json',apikey:config.publishableKey},body:JSON.stringify({protocolVersion:3,...body})});
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
    const blob=await timed(new Promise(resolve=>canvas.toBlob(resolve,'image/jpeg',.7)),20000,'照片压缩超时');
    if(!blob)throw new Error('照片压缩失败');
    if(blob.size>FILE_LIMIT)throw new Error('压缩后单张照片超过 300KB，请减少照片尺寸后重试');
    return blob;
  }
  const uuid=value=>typeof value==='string'&&/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value);
  const secret=()=>Array.from(crypto.getRandomValues(new Uint8Array(32)),byte=>byte.toString(16).padStart(2,'0')).join('');
  function stored(key){try{return JSON.parse(localStorage.getItem(key)||'null');}catch{return null;}}
  function persist(key,value){try{localStorage.setItem(key,JSON.stringify(value));if(localStorage.getItem(key)!==JSON.stringify(value))throw new Error();}catch{throw new Error('浏览器无法保存匿名凭证，请允许本地存储后重试');}}
  function identity(){
    const key='memoryShareBrowserIdentity',previous=stored(key);
    if(previous&&uuid(previous.browserId)&&/^[a-f0-9]{64}$/.test(previous.browserKey||''))return {browserId:previous.browserId,browserKey:previous.browserKey};
    const value={browserId:crypto.randomUUID(),browserKey:secret()};persist(key,value);return value;
  }
  const digest=async bytes=>Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256',bytes)),byte=>byte.toString(16).padStart(2,'0')).join('');
  function forgetRevoked(ids){
    const revoked=new Set(ids||[]),keys=[];
    for(let i=0;i<localStorage.length;i++){
      const key=localStorage.key(i);
      if(!/^(memoryProvinceShareManagement:|memorySelectedShareManagement:|memorySharePending:)/.test(key||''))continue;
      const value=stored(key);if(value&&(revoked.has(value.shareId)||revoked.has(value.targetId)))keys.push(key);
    }
    keys.forEach(key=>localStorage.removeItem(key));
  }
  async function claimKnown(browser,migrate=false,onProgress=()=>{}){
    const entries=new Map();
    for(let i=0;i<localStorage.length;i++){
      const key=localStorage.key(i);if(!/^(memoryProvinceShareManagement:|memorySelectedShareManagement:)/.test(key||''))continue;
      const value=stored(key);if(value&&uuid(value.shareId)&&/^[a-f0-9]{64}$/.test(value.managementKey||''))entries.set(value.shareId,value);
    }
    for(const value of entries.values()){
      const claimed=await request({action:'claim',...browser,...value});
      if(claimed.revoked){forgetRevoked([value.shareId]);continue;}
      if(migrate&&claimed.claimed&&[1,2].includes(claimed.version)){
        let step;
        do{onProgress('正在复用旧分享照片…');step=await request({action:'migrate',...browser,...value});onProgress('旧分享照片 '+step.processed+' / '+step.total); }while(!step.done);
      }
    }
  }
  const dataUrl=blob=>timed(new Promise((resolve,reject)=>{const reader=new FileReader();reader.onload=()=>resolve(reader.result);reader.onerror=()=>reject(new Error('照片读取失败'));reader.readAsDataURL(blob);}),20000,'照片读取超时');
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
    ctx.fillStyle='#183846';ctx.font='bold 64px serif';ctx.fillText(snapshot.provinces.length===1?snapshot.provinces[0].name+'旅行记忆':'我的旅行记忆',76,198,928);
    const cities=snapshot.provinces.flatMap(p=>p.cities),count=cities.reduce((sum,c)=>sum+c.photos.length,0);
    ctx.font='26px sans-serif';ctx.fillText(snapshot.provinces.length+' 个省份 · '+cities.length+' 座城市 · '+count+' 张照片',76,260);
    if(snapshot.provinces.length>6){ctx.font='22px sans-serif';ctx.fillText('另有 '+(snapshot.provinces.length-6)+' 个省份，扫码查看完整书架',76,1018);}
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
  async function create(provinces,getPhotos,onProgress=()=>{},options={}){
    if(!Array.isArray(provinces)||!provinces.length||provinces.length>34)throw new Error('请选择 1–34 个省份进行分享');
    const checkCancelled=()=>{if(options.signal?.aborted)throw new Error('已取消上传');};
    const browser=identity();
    const pendingKey='memorySharePending:selection:'+provinces.map(p=>p.name).sort().join('|');
    let pending=stored(pendingKey);
    if(pending&&(!uuid(pending.shareId)||!uuid(pending.targetId)||!/^[a-f0-9]{64}$/.test(pending.managementKey||'')))pending=null;
    checkCancelled();onProgress('正在检查匿名分享容量…');
    await claimKnown(browser,true,onProgress);checkCancelled();
    pending=stored(pendingKey);
    if(pending&&(!uuid(pending.shareId)||!uuid(pending.targetId)||!/^[a-f0-9]{64}$/.test(pending.managementKey||'')))pending=null;
    const target=pending?{shareId:pending.targetId,managementKey:pending.managementKey}:{shareId:crypto.randomUUID(),managementKey:secret()};
    let quota=await request({action:'quota',...browser});options.onQuota?.(quota);
    const manifest={version:3,provinces:[],files:[]},blobs=new Map(),hashes=new Map();let images=0,totalBytes=0;
    async function add(src){
      checkCancelled();const blob=await compress(src),sha256=await digest(await blob.arrayBuffer());
      if(hashes.has(sha256))return hashes.get(sha256);
      const fileId='photo-'+(blobs.size+1);hashes.set(sha256,fileId);
      totalBytes+=blob.size;if(totalBytes>50000000)throw new Error('所选省份压缩后超过 50MB，请减少选择');
      blobs.set(fileId,blob);manifest.files.push({fileId,bytes:blob.size,sha256});return fileId;
    }
    for(const province of provinces){
      const book={name:province.name,review:province.review||'',coverId:'',cities:[]};
      for(const city of province.cities){
        checkCancelled();onProgress('正在读取'+city.name+'的照片…');
        const chapter={name:city.name,description:city.meta?.description||'',firstMonth:city.firstMonth||'',photos:[]};
        const photos=await timed(getPhotos(city),10000,'读取'+city.name+'照片超时，请重试');
        for(const photo of photos.filter(p=>p.kind!=='video')){
          if(!photo.dataUrl)throw new Error('部分照片尚未加载，请先恢复资料后重试');
          if(++images>1500)throw new Error('目前单次分享支持最多 1500 张照片');
          chapter.photos.push({name:photo.name||'',fileId:await add(photo.dataUrl)});onProgress('正在整理第 '+images+' 张照片…');
        }
        book.cities.push(chapter);
      }
      if(province.cover){onProgress('正在整理'+province.name+'封面…');book.coverId=await add(province.cover);}
      manifest.provinces.push(book);
    }
    if(!images)throw new Error('记忆书架中还没有可分享的照片');
    const manifestHash=await digest(new TextEncoder().encode(JSON.stringify(manifest)));
    if(pending&&pending.manifestHash!==manifestHash){
      await request({action:'cancel',...browser,shareId:pending.shareId,managementKey:pending.managementKey});
      localStorage.removeItem(pendingKey);pending=null;quota=await request({action:'quota',...browser});options.onQuota?.(quota);
    }
    if(!pending){
      pending={shareId:crypto.randomUUID(),targetId:target.shareId,managementKey:target.managementKey,manifestHash};
      persist('memorySelectedShareManagement:'+target.shareId,{shareId:target.shareId,managementKey:target.managementKey});
      persist(pendingKey,pending);
    }
    const auth={...browser,shareId:pending.shareId,managementKey:pending.managementKey};let started=false,finished=false,result;
    try{
      checkCancelled();onProgress('正在预留 '+(totalBytes/1000000).toFixed(1)+'MB 分享容量…');
      // Store before begin. A lost response can be resumed with the same draft ID.
      started=true;
      const session=await request({action:'begin',...browser,...auth,targetId:target.shareId,manifest});
      const uploaded=new Set(session.uploadedIds);
      onProgress('复用 '+uploaded.size+' 个文件，本次新增 '+((session.newBytes??totalBytes)/1000000).toFixed(1)+'MB');
      for(const file of manifest.files){
        checkCancelled();if(uploaded.has(file.fileId))continue;
        onProgress('正在上传 '+(uploaded.size+1)+' / '+manifest.files.length+' 个照片文件…');
        await request({action:'upload',...auth,fileId:file.fileId,dataUrl:await dataUrl(blobs.get(file.fileId))});uploaded.add(file.fileId);
      }
      checkCancelled();onProgress('照片上传完成，正在发布书架…');result=await request({action:'finish',...auth});finished=true;
      localStorage.removeItem(pendingKey);
    }catch(error){
      if(error.message==='上传会话已关闭'){localStorage.removeItem(pendingKey);throw new Error('此前上传会话已关闭，请再次分享；原已发布链接仍可查看。');}
      if(started&&!finished){
        try{await request({action:'cancel',...auth});localStorage.removeItem(pendingKey);}
        catch{throw new Error(error.message+'；草稿容量暂时保留，再次分享相同选择可重试或清理。');}
      }
      throw error;
    }
    const root=config.shareBaseUrl||'https://zwxll.github.io/Your-China-Travel/';
    const url=new URL('memory-share.html',root);url.searchParams.set('s',result.shareId);
    const preview=showPreview(url.href,provinces.length===1?provinces[0].name:'我的旅行记忆');
    onProgress('上传完成，正在生成海报…');const urls=[];
    try{
      const snapshot={provinces:manifest.provinces.map((p,i)=>{
        if(i>=6)return p;
        const fileId=p.coverId||p.cities.flatMap(c=>c.photos)[0]?.fileId;
        const cover=fileId?URL.createObjectURL(blobs.get(fileId)):'';if(cover)urls.push(cover);return {...p,cover};
      })};
      const canvas=await poster(snapshot,url.href),image=document.createElement('img');image.alt='记忆书架分享海报';image.src=canvas.toDataURL('image/png');preview.content.replaceChildren(image);preview.save.disabled=false;
      preview.save.onclick=()=>canvas.toBlob(blob=>{if(!blob){preview.status.textContent='海报保存失败，请截图保存';preview.content.append(preview.status);return;}const href=URL.createObjectURL(blob),a=document.createElement('a');a.href=href;a.download='旅行记忆书架.png';a.click();setTimeout(()=>URL.revokeObjectURL(href),30000);},'image/png');
      onProgress('分享海报已生成，可保存后发送到微信。'+(result.cleanupPending?'旧文件待清理，容量暂时保留。':''));
    }catch(error){preview.status.textContent=error.message;onProgress('分享链接已生成，海报生成失败：'+error.message);}
    finally{urls.forEach(url=>URL.revokeObjectURL(url));}
    return url.href;
  }
  function select(provinces,getPhotos,onProgress=()=>{}){
    const dialog=document.createElement('dialog');dialog.className='memory-share-dialog memory-share-selection';
    const title=document.createElement('h2');title.textContent='选择要分享的省份';
    const note=document.createElement('p');note.textContent='可单选、多选或全选。只上传照片压缩副本；任何拿到二维码的人都能查看。此匿名浏览器累计最多 50MB。';
    const list=document.createElement('div');list.className='memory-share-provinces';
    const rows=provinces.map(province=>{
      const label=document.createElement('label'),input=document.createElement('input'),name=document.createElement('span');
      const count=province.sharePhotoCount??province.photoCount??0;
      input.type='checkbox';input.disabled=!count;name.textContent=province.name+' · '+province.cities.length+' 座城市 · '+count+' 张照片';
      label.append(input,name);list.append(label);return {province,input};
    });
    const status=document.createElement('p');status.setAttribute('role','status');
    const capacity=document.createElement('p');capacity.className='memory-share-capacity';
    const controls=document.createElement('div');controls.className='memory-share-actions';
    const all=document.createElement('button'),none=document.createElement('button'),submit=document.createElement('button'),cancel=document.createElement('button');
    all.textContent='全选';none.textContent='取消全选';submit.textContent='上传并生成海报';cancel.textContent='取消';
    const update=()=>{const selected=rows.filter(r=>r.input.checked);submit.disabled=!selected.length;status.textContent='已选择 '+selected.length+' 个省份 · '+selected.reduce((n,r)=>n+(r.province.sharePhotoCount??r.province.photoCount??0),0)+' 张照片';};
    rows.forEach(r=>r.input.onchange=update);all.onclick=()=>{rows.forEach(r=>r.input.checked=!r.input.disabled);update();};none.onclick=()=>{rows.forEach(r=>r.input.checked=false);update();};
    let uploading=false,controller;
    const stop=()=>{if(uploading){controller.abort();status.textContent='正在取消，等待当前文件上传结束后清理…';cancel.disabled=true;}else dialog.close();};
    cancel.onclick=stop;dialog.addEventListener('cancel',event=>{event.preventDefault();stop();});
    submit.onclick=async()=>{
      if(uploading)return;uploading=true;controller=new AbortController();
      const chosen=rows.filter(r=>r.input.checked).map(r=>r.province);
      submit.disabled=all.disabled=none.disabled=true;rows.forEach(r=>r.input.disabled=true);
      const progress=message=>{status.textContent=message;onProgress(message);};
      try{await create(chosen,getPhotos,progress,{signal:controller.signal,onQuota:q=>{capacity.textContent='匿名浏览器：已用 '+((q.browserUsed+q.browserReserved)/1000000).toFixed(1)+' / 50MB，剩余 '+(Math.max(0,q.browserLimit-q.browserUsed-q.browserReserved)/1000000).toFixed(1)+'MB；全站剩余 '+(Math.max(0,q.globalLimit-q.globalUsed-q.globalReserved)/1000000).toFixed(1)+'MB';}});dialog.close();}
      catch(error){progress(error.message);}
      finally{uploading=false;cancel.disabled=false;all.disabled=none.disabled=false;rows.forEach(r=>r.input.disabled=!(r.province.sharePhotoCount??r.province.photoCount));submit.disabled=!rows.some(r=>r.input.checked);}
    };
    controls.append(all,none,submit,cancel);dialog.append(title,note,list,capacity,status,controls);document.body.append(dialog);dialog.addEventListener('close',()=>dialog.remove(),{once:true});update();dialog.showModal();
  }
  function manage(){
    const dialog=document.createElement('dialog');dialog.className='memory-share-dialog memory-share-management';
    const title=document.createElement('h2');title.textContent='管理分享';
    const note=document.createElement('p');note.textContent='仅管理此浏览器匿名身份的云端分享。照片被其他分享引用时，删除一份不会释放其容量。未保留管理凭证且未归属的旧分享无法纳入管理。';
    const capacity=document.createElement('p'),list=document.createElement('div'),status=document.createElement('p');status.setAttribute('role','status');
    const controls=document.createElement('div');controls.className='memory-share-actions';
    const clear=document.createElement('button'),retry=document.createElement('button'),close=document.createElement('button');
    clear.textContent='清空我的全部分享';retry.textContent='重试清理';close.textContent='关闭';
    clear.disabled=retry.disabled=true;close.onclick=()=>dialog.close();
    controls.append(clear,retry,close);dialog.append(title,note,capacity,list,status,controls);document.body.append(dialog);dialog.addEventListener('close',()=>dialog.remove(),{once:true});dialog.showModal();
    const browser=stored('memoryShareBrowserIdentity');let busy=false,initialReady=false;
    const showQuota=q=>{capacity.textContent='已用 '+(q.browserUsed/1000000).toFixed(2)+'MB · 预留 '+(q.browserReserved/1000000).toFixed(2)+'MB · 剩余 '+(Math.max(0,q.browserLimit-q.browserUsed-q.browserReserved)/1000000).toFixed(2)+' / 50MB';};
    async function refresh(){
      const result=await request({action:'list',...browser});showQuota(result.quota);list.replaceChildren();
      for(const share of result.shares){
        const row=document.createElement('section');row.className='memory-share-management-row';
        const heading=document.createElement('h3');heading.textContent=share.provinces.join('、');
        const details=document.createElement('p');details.textContent=(share.kind==='draft'?'未完成草稿':'已发布')+' · '+share.photoCount+' 张照片 · '+new Date(share.updatedAt).toLocaleString();
        const remove=document.createElement('button');remove.textContent='删除这份分享';remove.onclick=()=>operate('revoke',share.shareId);
        row.append(heading,details,remove);list.append(row);
      }
      if(!result.shares.length){const empty=document.createElement('p');empty.textContent='此浏览器没有可管理的分享';list.append(empty);}
      clear.disabled=busy||(!result.shares.length&&!result.cleanupPending&&!result.quota.clearing);retry.disabled=busy||(!result.cleanupPending&&!result.quota.clearing);
    }
    async function operate(action,shareId){
      if(busy)return;
      if(action!=='retry-cleanup'&&!window.confirm((action==='clear'?'清空此匿名身份的全部云端分享和草稿？':'删除这份云端分享？')+'原二维码将失效，只删除云端副本，本地照片不受影响。已下载的照片无法收回。'))return;
      busy=true;clear.disabled=retry.disabled=true;list.querySelectorAll('button').forEach(b=>b.disabled=true);status.textContent='正在处理云端分享…';
      try{
        const result=await request({action,...browser,...(shareId?{shareId}:{})});forgetRevoked(result.revokedIds);
        status.textContent=result.cleanupPending?'链接已失效，文件待清理，容量暂时保留；请重试清理。':'清理完成，释放 '+(result.freedBytes/1000000).toFixed(2)+'MB。';
      }catch(error){status.textContent=error.message;}
      finally{busy=false;try{await refresh();}catch(error){status.textContent=error.message;retry.disabled=false;}}
    }
    async function load(){
      if(busy)return;busy=true;retry.disabled=clear.disabled=true;status.textContent='正在读取分享列表…';
      try{await claimKnown(browser);busy=false;await refresh();initialReady=true;retry.textContent='重试清理';status.textContent='';}
      catch(error){initialReady=false;status.textContent=error.message;retry.textContent='重新加载';retry.disabled=false;}
      finally{busy=false;}
    }
    clear.onclick=()=>operate('clear');retry.onclick=()=>initialReady?operate('retry-cleanup'):load();
    if(!browser||!uuid(browser.browserId)||!/^[a-f0-9]{64}$/.test(browser.browserKey||'')){status.textContent='此浏览器没有可管理的分享';return;}
    load();
  }
  return {create,select,manage,request};
})();
