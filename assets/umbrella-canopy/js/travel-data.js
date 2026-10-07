export {extractPalette} from './data.js';
// Same city-album records as the year atlas; no demo photographs or database writes.
export async function loadCatalog(){
  const colors=['#e8ad3e','#5fb062','#2fb3b0','#e0483f','#5b84dc','#e57fa6'];
  const groups=new Map(),photos=[];
  // Decode sequentially; only small thumbnails go to the GPU, originals stay unchanged.
  for(const record of window.canopyRecords||[]){
    const key=record.cityKey||record.title;
    if(!groups.has(key))groups.set(key,{id:String(key),title:record.title,color:colors[groups.size%colors.length],intro:'',photos:[]});
    const story=groups.get(key),image=new Image();image.src=record.src;
    let thumb=record.src,aspect=1/record.aspect;
    try{
      await image.decode();aspect=image.naturalHeight/image.naturalWidth;
      const ratio=Math.min(1,768/Math.max(image.naturalWidth,image.naturalHeight));
      const canvas=document.createElement('canvas');canvas.width=Math.max(1,Math.round(image.naturalWidth*ratio));canvas.height=Math.max(1,Math.round(image.naturalHeight*ratio));
      canvas.getContext('2d').drawImage(image,0,0,canvas.width,canvas.height);thumb=canvas.toDataURL('image/jpeg',.85);
    }catch{ /* Original source remains usable by the upstream missing-image fallback. */ }
    const photo={id:record.id,description:record.title,date:record.date==='年份未确定'?'尚未记录':record.date,photographer:'',full:record.full,thumb,aspect,story,indexInStory:story.photos.length};
    story.photos.push(photo);photos.push(photo);
  }
  return {photos,stories:[...groups.values()]};
}
