/* 只读省份相册，沿用相册技能的 PageFlip HTML 运行时。 */
(()=>{
  const content=document.getElementById('content'),viewer=document.getElementById('viewer');
  let snapshot,photos=[],index=0,reader=null;
  const el=(tag,text,className)=>{const node=document.createElement(tag);if(text)node.textContent=text;if(className)node.className=className;return node;};
  function dispose(){if(reader){reader.destroy();reader=null;}}
  function flipBook(previous){
    if(!reader||!['read','fold_corner'].includes(reader.getState()))return;
    // 按钮/手势翻页不是页角点击；仅在调用期间跳过库的页角限制。
    const settings=reader.getSettings(),restricted=settings.disableFlipByClick;
    settings.disableFlipByClick=false;
    try{previous?reader.flipPrev('bottom'):reader.flipNext('bottom');}finally{settings.disableFlipByClick=restricted;}
  }
  function showPhoto(i){index=i;document.getElementById('large').src=photos[i].dataUrl;document.getElementById('count').textContent=(i+1)+' / '+photos.length;document.getElementById('prev').disabled=i===0;document.getElementById('next').disabled=i===photos.length-1;}
  document.getElementById('prev').onclick=()=>showPhoto(index-1);document.getElementById('next').onclick=()=>showPhoto(index+1);document.getElementById('close').onclick=()=>viewer.close();
  document.addEventListener('keydown',event=>{
    if(event.key!=='ArrowLeft'&&event.key!=='ArrowRight')return;
    if(viewer.open){if(event.key==='ArrowLeft'&&index>0)showPhoto(index-1);if(event.key==='ArrowRight'&&index<photos.length-1)showPhoto(index+1);}
    else if(reader&&['read','fold_corner'].includes(reader.getState())){event.preventDefault();flipBook(event.key==='ArrowLeft');}
  });
  function shelf(){
    dispose();document.body.classList.remove('reader-open');const grid=el('div');grid.id='shelf';
    for(const province of snapshot.provinces){const book=el('button','','book'),photo=province.cover||province.cities.flatMap(c=>c.photos)[0]?.dataUrl;
      if(photo){const image=el('img');image.src=photo;image.alt=province.name+'旅行书籍封面';book.append(image);}
      book.append(el('strong',province.name),el('span',province.cities.length+' 座城市 · '+province.cities.reduce((n,c)=>n+c.photos.length,0)+' 张照片'));book.onclick=()=>chapters(province);grid.append(book);
    }content.replaceChildren(grid);
  }
  function album(body,chapter){
    dispose();photos=chapter.photos;
    body.replaceChildren();const info=[chapter.firstMonth,chapter.description].filter(Boolean).join(' · ');if(info)body.append(el('p',info));
    if(!photos.length){body.append(el('p','这个城市暂无照片。'));return;}
    const rig=el('div','','shared-book-rig'),book=el('div','','shared-book');book.id='book';
    const cover=el('article','','book-page shared-cover');cover.dataset.density='hard';
    cover.append(el('small','旅行照片册'),el('h2',chapter.name),el('p',chapter.firstMonth||'时间未记录'),el('span',photos.length+' 张照片'));book.append(cover);
    // 与原记忆相册一致：简介与首图成对，后续跨页通常三张，末组最多五张。
    const entries=photos.map((photo,index)=>({photo,index})),spreads=[[null,entries.shift()]];
    while(entries.length)spreads.push(entries.splice(0,entries.length<=5?entries.length:3));
    for(const [page,spread]of spreads.entries()){
      let sides;
      if(page===0)sides=[[null],[spread[1]]];
      else if(spread.length===1)sides=page%2===0?[spread,[]]:[[],spread];
      else if(spread.length===2)sides=[[spread[0]],[spread[1]]];
      else if(spread.length===3)sides=page%2===0?[[spread[0]],spread.slice(1)]:[spread.slice(0,2),[spread[2]]];
      else if(spread.length===4)sides=[spread.slice(0,2),spread.slice(2)];
      else sides=page%2===0?[[spread[0]],spread.slice(1)]:[spread.slice(0,4),[spread[4]]];
      for(const side of sides){
        const leaf=el('article','','book-page'),head=el('div','','shared-page-head'),grid=el('div','','shared-photo-grid');
        head.append(el('strong',chapter.name),el('span',side[0]===null?'城市简介':'旅行影像'));
        if(side[0]===null){grid.classList.add('shared-intro');grid.append(el('h3',chapter.name),el('p',chapter.description||'这座城市的简介尚未填写。'),el('small',(chapter.firstMonth||'时间未记录')+' · '+photos.length+' 张照片'));}
        else if(!side.length){grid.classList.add('shared-intro');grid.append(el('h3',chapter.name),el('p','这一页留给下一段影像。'));}
        else{
          grid.dataset.layout=side.length===1?'single':side.length===2?'two-landscape':'four';
          for(const {photo,index:i}of side){
            const button=el('button','','shared-photo'),image=el('img');
            image.onload=()=>{if(side.length===2)grid.dataset.layout=[...grid.querySelectorAll('img')].every(img=>img.naturalWidth/img.naturalHeight<.86)?'two-portrait':'two-landscape';};
            image.src=photo.dataUrl;image.alt=photo.name||chapter.name+'旅行照片';image.draggable=false;
            button.type='button';button.setAttribute('aria-label','查看第 '+(i+1)+' 张照片');button.append(image);
            button.onclick=()=>{if(!['read','fold_corner'].includes(reader?.getState()))return;showPhoto(i);viewer.showModal();};grid.append(button);
          }
        }
        const pageContent=el('div','','shared-page-content');
        pageContent.append(head,grid,el('div',String(book.children.length).padStart(2,'0'),'shared-page-foot'));leaf.append(pageContent);book.append(leaf);
      }
    }
    const back=el('article','','book-page shared-cover');back.dataset.density='hard';back.append(el('h2','旅行记忆'),el('p',chapter.name),el('small','记录一座城，也记录那时的自己。'));book.append(back);
    const controls=el('div','','shared-book-controls'),previous=el('button','‹ 上一页','back'),next=el('button','下一页 ›','back'),status=el('span');
    previous.setAttribute('aria-label','上一页');next.setAttribute('aria-label','下一页');status.id='page-status';status.setAttribute('role','status');
    controls.append(previous,status,next);rig.append(book);body.append(rig,controls,el('p','左右滑动或点击按钮翻页 · 点击照片放大','shared-book-hint'));
    reader=new St.PageFlip(book,{width:420,height:560,size:'stretch',minWidth:250,maxWidth:420,minHeight:333,maxHeight:560,usePortrait:true,autoSize:true,showCover:true,startPage:1,drawShadow:true,maxShadowOpacity:.3,flippingTime:matchMedia('(prefers-reduced-motion: reduce)').matches?1:450,mobileScrollSupport:false,clickEventForward:true,useMouseEvents:true,swipeDistance:24,showPageCorners:true,disableFlipByClick:true});
    const current=reader;let turning=false;
    function update(){
      if(reader!==current)return;const page=current.getCurrentPageIndex(),busy=turning;
      book.dataset.layout=current.getOrientation();book.setAttribute('aria-busy',String(busy));
      book.dataset.edge=page===0?'front':page===current.getPageCount()-1?'back':'inside';
      const lastVisible=page+(current.getOrientation()==='landscape'&&page>0?1:0);
      previous.disabled=page===0||busy;next.disabled=lastVisible>=current.getPageCount()-1||busy;
      status.textContent=(page+1)+' / '+current.getPageCount()+' 页';
    }
    current.on('flip',update);current.on('changeState',event=>{turning=event.data==='flipping'||event.data==='user_fold';update();});current.on('init',update);current.on('changeOrientation',update);
    current.loadFromHTML(book.querySelectorAll('.book-page'));update();
    previous.onclick=()=>flipBook(true);next.onclick=()=>flipBook(false);
    // 接管触摸翻页，避开库的 250ms 限制；保留鼠标拖页和纵向滚动。
    let touch=null;
    book.addEventListener('touchstart',event=>{
      event.stopPropagation();touch=null;
      if(event.touches.length===1&&['read','fold_corner'].includes(current.getState())){const point=event.touches[0];touch={x:point.clientX,y:point.clientY,time:Date.now()};}
    },{capture:true,passive:true});
    book.addEventListener('touchmove',event=>{
      event.stopPropagation();if(event.touches.length!==1){touch=null;return;}if(!touch)return;
      const point=event.touches[0],dx=Math.abs(point.clientX-touch.x),dy=Math.abs(point.clientY-touch.y);
      if(dx>16&&dx>dy*1.25&&event.cancelable)event.preventDefault();
    },{capture:true,passive:false});
    book.addEventListener('touchend',event=>{
      event.stopPropagation();const start=touch;touch=null;if(!start||!event.changedTouches.length)return;
      const point=event.changedTouches[0],dx=point.clientX-start.x,dy=Math.abs(point.clientY-start.y);
      if(Date.now()-start.time<=1200&&Math.abs(dx)>=24&&Math.abs(dx)>dy*1.25){if(event.cancelable)event.preventDefault();flipBook(dx>0);}
    },{capture:true,passive:false});
    book.addEventListener('touchcancel',event=>{event.stopPropagation();touch=null;},{capture:true,passive:true});
  }
  function chapters(province){
    dispose();document.body.classList.add('reader-open');const section=el('section','','chapter'),back=el('button','返回书架','back');back.onclick=shelf;section.append(back,el('h2',province.name+'旅行记忆'));if(province.review)section.append(el('p',province.review));
    const tabs=el('div','','cities'),body=el('div');
    function city(chapter){tabs.querySelectorAll('button').forEach(button=>button.setAttribute('aria-pressed',String(button.textContent===chapter.name)));album(body,chapter);}
    for(const chapter of province.cities){const button=el('button',chapter.name);button.onclick=()=>city(chapter);tabs.append(button);}
    section.append(tabs,body);content.replaceChildren(section);city(province.cities[0]);
  }
  const id=new URL(location.href).searchParams.get('s');
  if(!/^[a-f0-9-]{36}$/i.test(id||'')){content.replaceChildren(el('p','分享链接无效，请扫描完整的海报二维码。','notice'));return;}
  MemoryShelfShare.request({action:'read',shareId:id}).then(result=>{snapshot=result.snapshot;shelf();}).catch(error=>content.replaceChildren(el('p',error.message,'notice')));
})();
