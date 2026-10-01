import {validId} from './validation.mjs';

export const FILE_LIMIT=300*1024;
export const BROWSER_LIMIT=50_000_000;
export const GLOBAL_LIMIT=800_000_000;
export const validKey=value=>typeof value==='string'&&/^[a-f0-9]{64}$/.test(value);
const text=(value,max)=>String(value||'').slice(0,max);
const fileId=value=>typeof value==='string'&&/^[a-zA-Z0-9_-]{1,80}$/.test(value);
export async function hash(value){
  const bytes=typeof value==='string'?new TextEncoder().encode(value):value;
  return Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256',bytes)),byte=>byte.toString(16).padStart(2,'0')).join('');
}
export function sanitizeManifest(value,shareId,deduplicate=false){
  if(!validId(shareId)||!value||!Array.isArray(value.provinces)||!value.provinces.length||value.provinces.length>34||!Array.isArray(value.files)||!value.files.length||value.files.length>1534)throw new Error('书架清单无效');
  const ids=new Set(),used=new Set(),aliases=new Map(),hashes=new Map();let totalBytes=0,photos=0,cities=0;
  const files=value.files.map(file=>{
    if(!fileId(file.fileId)||ids.has(file.fileId)||!Number.isInteger(file.bytes)||file.bytes<1||file.bytes>FILE_LIMIT||!validKey(file.sha256))throw new Error('照片清单无效或单张超过 300KB');
    ids.add(file.fileId);
    const previous=deduplicate&&hashes.get(file.sha256);
    if(previous){if(previous.bytes!==file.bytes)throw new Error('照片清单相同哈希长度不一致');aliases.set(file.fileId,previous.fileId);return null;}
    const clean={fileId:file.fileId,bytes:file.bytes,sha256:file.sha256};
    hashes.set(file.sha256,clean);totalBytes+=file.bytes;return clean;
  }).filter(Boolean);
  const reference=id=>{if(!ids.has(id))throw new Error('照片清单引用无效');used.add(id);return aliases.get(id)||id;};
  const provinces=value.provinces.map(province=>{
    if(!province||!Array.isArray(province.cities)||!province.cities.length)throw new Error('城市章节无效');
    return {name:text(province.name,60),review:text(province.review,180),coverId:province.coverId?reference(province.coverId):'',cities:province.cities.map(city=>{
      if(!city||!Array.isArray(city.photos))throw new Error('照片列表无效');cities++;
      return {name:text(city.name,60),description:text(city.description,1000),firstMonth:text(city.firstMonth,10),photos:city.photos.map(photo=>{
        if(!photo||photo.kind==='video')throw new Error('分享暂不包含视频');photos++;return {name:text(photo.name,80),fileId:reference(photo.fileId)};
      })};
    })};
  });
  if(!photos||photos>1500||cities>400||used.size!==ids.size||totalBytes>BROWSER_LIMIT)throw new Error('照片数量、引用或 50MB 容量不符合要求');
  return {version:deduplicate?3:2,provinces,files,totalBytes};
}
export const sanitizeDedupManifest=(value,shareId)=>sanitizeManifest(value,shareId,true);
export async function validateJpeg(dataUrl){
  if(typeof dataUrl!=='string'||dataUrl.length>FILE_LIMIT*4/3+40||!/^data:image\/jpeg;base64,[A-Za-z0-9+/]+={0,2}$/.test(dataUrl))throw new Error('仅支持 300KB 以内的 JPEG 照片');
  let bytes;try{bytes=Uint8Array.from(atob(dataUrl.slice(23)),c=>c.charCodeAt(0));}catch{throw new Error('照片编码无效');}
  if(bytes.length>FILE_LIMIT||bytes.length<4||bytes[0]!==255||bytes[1]!==216||bytes.at(-2)!==255||bytes.at(-1)!==217)throw new Error('JPEG 照片无效或已截断');
  // 检查 JPEG 段长度、尺寸和扫描段，不能仅凭 MIME 或文件头通过。
  let offset=2,frame=false,scan=false;const components=new Set(),quantizers=new Set(),huffman=new Set();
  while(offset<bytes.length-2){
    if(bytes[offset++]!==255)throw new Error('JPEG 段无效');
    while(bytes[offset]===255)offset++;
    const marker=bytes[offset++];
    if(marker===0||marker===216||marker===217)throw new Error('JPEG 段无效');
    const length=(bytes[offset]<<8)|bytes[offset+1];
    if(length<2||offset+length>bytes.length-2)throw new Error('JPEG 段已截断');
    if(marker===219){
      let position=offset+2;
      while(position<offset+length){const table=bytes[position++],precision=table>>4;if(precision>1||(table&15)>3)throw new Error('JPEG 量化表无效');quantizers.add(table&15);position+=precision?128:64;}
      if(position!==offset+length)throw new Error('JPEG 量化表已截断');
    }
    if(marker===196){
      let position=offset+2;
      while(position<offset+length){
        const table=bytes[position++];if(table>>4>1||(table&15)>3||position+16>offset+length)throw new Error('JPEG 编码表无效');
        let symbols=0,slots=1;for(let i=0;i<16;i++){const count=bytes[position++];symbols+=count;slots=slots*2-count;if(slots<0)throw new Error('JPEG 编码表无效');}
        if(!symbols||symbols>256||position+symbols>offset+length)throw new Error('JPEG 编码表已截断');position+=symbols;huffman.add(table);
      }
    }
    if([192,193,194].includes(marker)){
      const height=(bytes[offset+3]<<8)|bytes[offset+4],width=(bytes[offset+5]<<8)|bytes[offset+6];
      const count=bytes[offset+7];
      if(frame||bytes[offset+2]!==8||![1,3].includes(count)||length!==8+3*count)throw new Error('JPEG 图像组件无效');
      if(!height||!width||height>900||width>900)throw new Error('照片尺寸需在 900px 以内');
      for(let i=0;i<count;i++){
        const start=offset+8+i*3,id=bytes[start],sampling=bytes[start+1];
        if(components.has(id)||!(sampling>>4)||sampling>>4>4||!(sampling&15)||(sampling&15)>4||!quantizers.has(bytes[start+2]))throw new Error('JPEG 图像组件无效');components.add(id);
      }
      frame=true;
    }
    if(marker===218){
      const count=bytes[offset+2],seen=new Set();
      if(!frame||!count||count>components.size||length!==6+2*count)throw new Error('JPEG 扫描段无效');
      for(let i=0;i<count;i++){
        const id=bytes[offset+3+i*2],table=bytes[offset+4+i*2];
        if(!components.has(id)||seen.has(id)||!huffman.has(table>>4)||!huffman.has(16+(table&15)))throw new Error('JPEG 扫描组件无效');seen.add(id);
      }
      scan=true;offset+=length;
      while(offset<bytes.length-2){
        if(bytes[offset]===255){const next=bytes[offset+1];if(next===0||next>=208&&next<=215){offset+=2;continue;}break;}offset++;
      }
      continue;
    }
    offset+=length;
  }
  if(!frame||!scan)throw new Error('JPEG 缺少图像内容');
  return {bytes,sha256:await hash(bytes)};
}
