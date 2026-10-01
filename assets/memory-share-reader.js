/* 只读省份相册，沿用相册技能的 PageFlip HTML 运行时。 */
(()=>{
  const content=document.getElementById('content'),viewer=document.getElementById('viewer');
  let snapshot,photos=[],index=0,reader=null;
  const el=(tag,text,className)=>{const node=document.createElement(tag);if(text)node.textContent=text;if(className)node.className=className;return node;};
  function dispose(){if(reader){reader.destroy();reader=null;}}
  function showPhoto(i){index=i;document.getElementById('large').src=photos[i].dataUrl;document.getElementById('count').textContent=(i+1)+' / '+photos.length;document.getElementById('prev').disabled=i===0;document.getElementById('next').disabled=i===photos.length-1;}
  document.getElementById('prev').onclick=()=>showPhoto(index-1);document.getElementById('next').onclick=()=>showPhoto(index+1);document.getElementById('close').onclick=()=>viewer.close();
  document.addEventListener('keydown',event=>{
    if(event.key!=='ArrowLeft'&&event.key!=='ArrowRight')return;
    if(viewer.open){if(event.key==='ArrowLeft'&&index>0)showPhoto(index-1);if(event.key==='ArrowRight'&&index<photos.length-1)showPhoto(index+1);}
    else if(reader&&reader.getState()==='read'){event.preventDefault();event.key==='ArrowLeft'?reader.flipPrev('bottom'):reader.flipNext('bottom');}
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
    for(const [i,photo]of photos.entries()){
      const leaf=el('article','','book-page'),head=el('div','','shared-page-head'),button=el('button','','shared-photo'),image=el('img');
      head.append(el('strong',chapter.name),el('span','旅行影像'));image.src=photo.dataUrl;image.alt=photo.name||chapter.name+'旅行照片';image.draggable=false;
      button.type='button';button.setAttribute('aria-label','查看第 '+(i+1)+' 张照片');button.append(image);
      button.onclick=()=>{if(reader?.getState()!=='read')return;showPhoto(i);viewer.showModal();};
      leaf.append(head,button,el('div',String(i+1).padStart(2,'0'),'shared-page-foot'));book.append(leaf);
    }
    const back=el('article','','book-page shared-cover');back.dataset.density='hard';back.append(el('h2','旅行记忆'),el('p',chapter.name),el('small','记录一座城，也记录那时的自己。'));book.append(back);
    const controls=el('div','','shared-book-controls'),previous=el('button','‹ 上一页','back'),next=el('button','下一页 ›','back'),status=el('span');
    previous.setAttribute('aria-label','上一页');next.setAttribute('aria-label','下一页');status.id='page-status';status.setAttribute('role','status');
    controls.append(previous,status,next);rig.append(book);body.append(rig,controls,el('p','左右滑动或点击按钮翻页 · 点击照片放大','shared-book-hint'));
    reader=new St.PageFlip(book,{width:420,height:560,size:'stretch',minWidth:250,maxWidth:420,minHeight:333,maxHeight:560,usePortrait:true,autoSize:true,showCover:true,startPage:1,drawShadow:true,maxShadowOpacity:.3,flippingTime:matchMedia('(prefers-reduced-motion: reduce)').matches?1:650,mobileScrollSupport:false,clickEventForward:true,useMouseEvents:true,swipeDistance:24,showPageCorners:true,disableFlipByClick:true});
    const current=reader;let turning=false;
    function update(){
      if(reader!==current)return;const page=current.getCurrentPageIndex(),busy=turning;
      book.dataset.layout=current.getOrientation();book.setAttribute('aria-busy',String(busy));
      book.dataset.edge=page===0?'front':page===current.getPageCount()-1?'back':'inside';
      const lastVisible=page+(current.getOrientation()==='landscape'&&page>0?1:0);
      previous.disabled=page===0||busy;next.disabled=lastVisible>=current.getPageCount()-1||busy;
      status.textContent=(page+1)+' / '+current.getPageCount()+' 页';
    }
    current.on('flip',update);current.on('changeState',event=>{turning=event.data!=='read';update();});current.on('init',update);current.on('changeOrientation',update);
    current.loadFromHTML(book.querySelectorAll('.book-page'));update();
    previous.onclick=()=>{if(current.getState()==='read')current.flipPrev('bottom');};next.onclick=()=>{if(current.getState()==='read')current.flipNext('bottom');};
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
