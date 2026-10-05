/* Travel data adapter; does not duplicate photo blobs or infer dates from upload time. */
(function(){
  const unknown='年份未确定';
  async function collect(entries,getPhotosByCity,overrides={}){
    const cities=new Map();
    for(const entry of entries){
      const key=entry.city.cityKey;
      if(!cities.has(key)) cities.set(key,{city:entry.city,years:new Set()});
      if(/^\d{4}-\d{2}/.test(entry.month||'')) cities.get(key).years.add(Number(entry.month.slice(0,4)));
    }
    const groups=await Promise.all([...cities.values()].map(async({city,years})=>{
      const photos=await getPhotosByCity(city.cityKey);
      return photos.flatMap((photo,index)=>{
        if(photo.kind==='video'||!photo.dataUrl) return [];
        const id=city.cityKey+':'+(photo.id??('order-'+(photo.order??index)));
        const explicit=photo.travelDate||photo.visitDate||'';
        const dated=/^\d{4}(?:-\d{2}(?:-\d{2})?)?$/.test(explicit);
        const manual=Object.prototype.hasOwnProperty.call(overrides,id);
        const year=manual?(overrides[id]===null?unknown:Number(overrides[id])):dated?Number(explicit.slice(0,4)):years.size?Math.min(...years):unknown;
        return [{id,title:city.name,tags:city.name,sourceFile:photo.name||'',
          src:photo.dataUrl,full:photo.dataUrl,aspect:photo.width&&photo.height?photo.width/photo.height:4/3,
          year,date:manual?String(year):dated?explicit:String(year),dateSource:manual?'manual':dated?'captured':'city',
          visitYears:[...years].sort((a,b)=>a-b)}];
      });
    }));
    return groups.flat();
  }
  window.TravelImageAtlas={collect};
})();
