window.initTravelRingTree=function({button,overlay,host,close,collectRecords}){
  let request=0,frame=null,inertNodes=[];
  function dismiss(){
    request++;frame?.contentWindow?.postMessage({type:'platform:visibility',active:false},'*');
    frame=null;host.replaceChildren();overlay.hidden=true;close.hidden=false;
    for(const [node,wasInert] of inertNodes)node.inert=wasInert;inertNodes=[];
    document.getElementById('headerMenuPanel').hidden=false;
    document.getElementById('headerMenuToggle').setAttribute('aria-expanded','true');button.focus();
  }
  button.addEventListener('click',async()=>{
    if(!document.getElementById('canopyOverlay').hidden)document.getElementById('canopyClose').click();
    if(overlay.hidden){
      inertNodes=[...document.body.children].filter(node=>node!==overlay).map(node=>[node,node.inert]);
      for(const [node] of inertNodes)node.inert=true;
    }
    frame?.contentWindow?.postMessage({type:'platform:visibility',active:false},'*');frame=null;
    const token=++request;overlay.hidden=false;close.hidden=false;close.focus();host.textContent='正在整理城市照片…';
    try{
      const records=await collectRecords();if(token!==request)return;
      frame=document.createElement('iframe');frame.title='旅行年轮树';frame.style.cssText='display:block;width:100%;height:100%;border:0';
      frame.srcdoc=window.TravelRingTreeDocument(records);host.replaceChildren(frame);
    }catch(error){if(token===request)host.textContent='照片加载失败，请关闭后重试。';console.error('旅行年轮树加载失败',error);}
  });
  close.addEventListener('click',dismiss);
  document.addEventListener('click',event=>{if(!overlay.hidden&&event.target.closest('#lifeCanopyBtn'))dismiss();},true);
  document.addEventListener('keydown',event=>{
    if(overlay.hidden)return;
    if(event.key==='Escape'){event.preventDefault();event.stopImmediatePropagation();dismiss();}
    if(event.key==='Tab'){
      event.preventDefault();
      const controls=[...(frame?.contentDocument?.querySelectorAll('button:not(:disabled)')||[])].filter(node=>node.getClientRects().length);
      (controls.length?(event.shiftKey?controls.at(-1):controls[0]):close).focus();
    }
  },true);
  window.addEventListener('message',event=>{
    if(event.source!==frame?.contentWindow)return;
    if(event.data?.type==='tree:photo-panel')close.hidden=event.data.open===true;
    if(event.data?.type==='tree:close')dismiss();
    if(event.data?.type==='tree:focus-close')close.focus();
  });
};
