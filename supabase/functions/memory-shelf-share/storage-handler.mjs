import {validId} from './validation.mjs';
import {validKey,hash,sanitizeManifest,validateJpeg} from './storage-validation.mjs';

export class ShareError extends Error{constructor(message,status=400){super(message);this.status=status;}}
const knownErrors=new Set(['匿名凭证无效','分享管理凭证无效','此分享已归属其他匿名浏览器','无权更新此书架','上传会话不匹配','此匿名浏览器累计分享超过 50MB','全站分享空间达到 800MB 上限','今天生成海报次数较多，请明天再试','上传会话已关闭','照片与上传清单不符','该照片正在上传，请稍后重试','照片尚未全部上传','已发布书架不能取消','上传尚未结束，暂不能清理草稿','草稿尚未开始清理','书架仍在使用，不能清理']);
async function transaction(db,action,input){
  const {data,error}=await db.rpc('memory_share_transaction',{p_action:action,p_input:input});
  if(error)throw new ShareError(knownErrors.has(error.message)?error.message:'分享服务暂时不可用，请稍后重试',knownErrors.has(error.message)?400:503);
  return data;
}
const validFile=value=>typeof value==='string'&&/^[a-zA-Z0-9_-]{1,80}$/.test(value);
export async function handleStorageAction(input,db,sourceHash=''){
  if(input.action==='publish')throw new ShareError('请更新网页后重试，新版分享使用分文件上传');
  if(!['quota','begin','claim','upload','finish','cancel','read','read-city'].includes(input.action))throw new ShareError('不支持的请求');
  const bucket=db.storage.from('memory-share-photos');
  if(['read','read-city'].includes(input.action)){
    if(!validId(input.shareId))throw new ShareError('分享链接无效');
    const {data,error}=await db.from('memory_shelf_shares').select('snapshot,updated_at').eq('share_id',input.shareId).maybeSingle();
    if(error)throw new ShareError('分享服务暂时不可用',503);
    if(!data)throw new ShareError('这份记忆书架尚未分享或已失效',404);
    if(data.snapshot.version!==2){if(input.action==='read-city')throw new ShareError('此城市请求无效');return data;}
    const snapshot=data.snapshot;
    const signed=async ids=>{
      const paths=[...new Set(ids)].map(id=>snapshot.storagePrefix+'/'+id+'.jpg');if(!paths.length)return new Map();
      const {data:urls,error}=await bucket.createSignedUrls(paths,3600);
      if(error||!urls||urls.some(url=>url.error||!url.signedUrl))throw new ShareError('照片暂时无法读取，请重试',503);
      return new Map(urls.map(url=>[url.path,url.signedUrl]));
    };
    const url=(urls,id)=>urls.get(snapshot.storagePrefix+'/'+id+'.jpg');
    if(input.action==='read-city'){
      if(!Number.isInteger(input.provinceIndex)||input.provinceIndex<0||!Number.isInteger(input.cityIndex)||input.cityIndex<0)throw new ShareError('城市请求无效');
      const city=snapshot.provinces[input.provinceIndex]?.cities[input.cityIndex];if(!city)throw new ShareError('城市请求无效');
      const urls=await signed(city.photos.map(p=>p.fileId));
      return {chapter:{name:city.name,description:city.description,firstMonth:city.firstMonth,photos:city.photos.map(p=>({name:p.name,dataUrl:url(urls,p.fileId)}))}};
    }
    const coverIds=snapshot.provinces.map(p=>p.coverId||p.cities.flatMap(c=>c.photos)[0]?.fileId),urls=await signed(coverIds.filter(Boolean));
    return {updated_at:data.updated_at,snapshot:{version:2,provinces:snapshot.provinces.map((p,i)=>({name:p.name,review:p.review,cover:url(urls,coverIds[i])||'',cities:p.cities.map(c=>({name:c.name,description:c.description,firstMonth:c.firstMonth,photoCount:c.photos.length}))}))}};
  }
  const auth={};
  if(['quota','begin','claim'].includes(input.action)){
    if(!validId(input.browserId)||!validKey(input.browserKey))throw new ShareError('匿名凭证无效');
    auth.browserId=input.browserId;auth.browserHash=await hash(input.browserKey);
  }
  if(input.action==='quota')return transaction(db,'quota',auth);
  if(!validId(input.shareId)||!validKey(input.managementKey))throw new ShareError('分享管理凭证无效');
  auth.shareId=input.shareId;auth.managementHash=await hash(input.managementKey);
  if(input.action==='claim')return transaction(db,'claim',auth);
  if(input.action==='begin'){
    if(input.targetId&&!validId(input.targetId))throw new ShareError('分享链接无效');
    if(!validKey(sourceHash))throw new ShareError('分享服务暂时不可用',503);
    return transaction(db,'begin',{...auth,targetId:input.targetId||input.shareId,manifest:sanitizeManifest(input.manifest,input.shareId),sourceHash});
  }
  if(input.action==='upload'){
    if(!validFile(input.fileId))throw new ShareError('照片编号无效');
    const {bytes,sha256}=await validateJpeg(input.dataUrl),file={...auth,fileId:input.fileId,bytes:bytes.length,sha256};
    await transaction(db,'upload-start',file);
    try{
      const path=input.shareId+'/'+input.fileId+'.jpg';
      const {error}=await bucket.upload(path,bytes,{contentType:'image/jpeg',upsert:false});
      if(error){
        if(!['409','400'].includes(String(error.statusCode))&&!/already exists|duplicate/i.test(error.message||''))throw new ShareError('照片上传失败，请重试',503);
        const existing=await bucket.download(path);
        if(existing.error||!existing.data)throw new ShareError('已有照片无法核对，请重试',503);
        const actual=new Uint8Array(await existing.data.arrayBuffer());
        if(actual.length!==bytes.length||await hash(actual)!==sha256)throw new ShareError('已有照片与清单不符，不能覆盖');
      }
      await transaction(db,'upload-done',file);return {fileId:input.fileId,bytes:bytes.length};
    }catch(error){
      // Stored object remains fully reserved even when registration fails.
      await transaction(db,'upload-failed',file).catch(()=>{});throw error;
    }
  }
  const remove=async(sid,files)=>{
    const paths=files.map(f=>sid+'/'+f.fileId+'.jpg');
    for(let offset=0;offset<paths.length;offset+=100){const {error}=await bucket.remove(paths.slice(offset,offset+100));if(error)throw new ShareError('草稿照片清理失败，容量暂时保留，请稍后重试',503);}
  };
  if(input.action==='cancel'){
    const draft=await transaction(db,'cancel-start',auth);
    if(draft.state!=='cancelled')await remove(input.shareId,draft.files);
    return transaction(db,'cancel-done',auth);
  }
  const result=await transaction(db,'finish',auth);let cleanupPending=false;
  for(const previous of result.cleanup||[]){
    try{await remove(previous.shareId,previous.files);await transaction(db,'cleanup-done',{...auth,shareId:previous.shareId});}catch{cleanupPending=true;}
  }
  return {shareId:result.shareId,cleanupPending};
}
