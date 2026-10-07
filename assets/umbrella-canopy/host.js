// Host owns loading/closing; the source demo owns all 3D interaction.
window.initTravelCanopy=function({button,overlay,host,close,collectRecords}){
  let request=0,frame=null;
  function dismiss(){
    request++;frame?.contentWindow?.postMessage({type:'platform:visibility',active:false},'*');
    frame=null;host.replaceChildren();overlay.hidden=true;button.focus();
  }
  button.addEventListener('click',async()=>{
    const token=++request;overlay.hidden=false;close.focus();host.textContent='正在整理城市照片…';
    try{
      const records=await collectRecords();if(token!==request)return;
      frame=document.createElement('iframe');frame.title='伞幕照片';frame.style.cssText='display:block;width:100%;height:100%;border:0';
      frame.srcdoc=window.TravelCanopyDocument(records);host.replaceChildren(frame);
    }catch(error){if(token===request)host.textContent='照片加载失败，请返回后重试。';console.error('伞幕照片加载失败',error);}
  });
  close.addEventListener('click',dismiss);
  document.addEventListener('keydown',event=>{if(event.key==='Escape'&&!overlay.hidden){event.preventDefault();event.stopImmediatePropagation();dismiss();}},true);
  window.addEventListener('message',event=>{if(event.source===frame?.contentWindow&&event.data?.type==='canopy:close')dismiss();});
};
