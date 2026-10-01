import {validId} from './validation.mjs';
import {validKey,hash,sanitizeDedupManifest,validateJpeg} from './storage-validation.mjs';
import {handleStorageAction,ShareError} from './storage-handler.mjs';
import {migrateLegacyShare} from './legacy-migration.mjs';

const errors=new Set(['匿名凭证无效','分享管理凭证无效','无权更新此书架','无权管理此分享','上传会话不匹配','此匿名浏览器累计分享超过 50MB','全站分享空间达到 800MB 上限','今天生成海报次数较多，请明天再试','上传会话已关闭','照片与上传清单不符','该照片正在上传，请稍后重试','照片尚未全部上传','已发布书架不能取消','上传尚未结束，暂不能清理草稿','云端分享正在清理中，请完成清理后重试','此分享链接已失效，请重新分享','照片正在清理，请稍后重试','请先完成旧分享迁移']);
export async function dedupTransaction(db,action,input){
  const {data,error}=await db.rpc('memory_share_dedup_transaction',{p_action:action,p_input:input});
  if(error)throw new ShareError(errors.has(error.message)?error.message:'分享服务暂时不可用，请稍后重试',errors.has(error.message)?400:503);
  return data;
}
export async function cleanSharedFiles(db,auth){
  const bucket=db.storage.from('memory-share-photos'),pending=await dedupTransaction(db,'cleanup-list',auth);
  let freedBytes=0,cleanupPending=false;
  for(const file of pending.files){
    try{
      const {error}=await bucket.remove([file.path]);if(error)throw error;
      const result=await dedupTransaction(db,'cleanup-done',{...auth,cleanupId:file.id});freedBytes+=result.freedBytes||0;
    }catch{cleanupPending=true;}
  }
  const quota=await dedupTransaction(db,'quota',auth);
  return {freedBytes,cleanupPending:cleanupPending||!!quota.clearing||!!quota.cleanupPending,quota};
}
export async function handleDedupAction(input,db,sourceHash=''){
  if(['read','read-city'].includes(input.action))return handleStorageAction(input,db,sourceHash);
  if(!validId(input.browserId)||!validKey(input.browserKey))throw new ShareError('匿名凭证无效');
  const auth={browserId:input.browserId,browserHash:await hash(input.browserKey)};
  if(input.protocolVersion!==3)throw new ShareError('请更新网页后重试，新版分享使用共用照片存储');
  if(!['quota','list','claim','migrate','begin','upload','finish','cancel','revoke','clear','retry-cleanup'].includes(input.action))throw new ShareError('不支持的请求');
  if(['begin','upload','finish','cancel','claim','migrate'].includes(input.action)){
    if(!validId(input.shareId)||!validKey(input.managementKey))throw new ShareError('分享管理凭证无效');
    auth.shareId=input.shareId;auth.managementHash=await hash(input.managementKey);
  }
  if(input.action==='revoke'){
    if(!validId(input.shareId))throw new ShareError('分享链接无效');auth.shareId=input.shareId;
  }
  if(['quota','list','claim'].includes(input.action))return dedupTransaction(db,input.action,auth);
  if(input.action==='begin'){
    if(input.targetId&&!validId(input.targetId))throw new ShareError('分享链接无效');
    if(!validKey(sourceHash))throw new ShareError('分享服务暂时不可用',503);
    return dedupTransaction(db,'begin',{...auth,targetId:input.targetId||input.shareId,manifest:sanitizeDedupManifest(input.manifest,input.shareId),sourceHash});
  }
  if(input.action==='upload'){
    if(typeof input.fileId!=='string'||!/^[a-zA-Z0-9_-]{1,80}$/.test(input.fileId))throw new ShareError('照片编号无效');
    const {bytes,sha256}=await validateJpeg(input.dataUrl),file={...auth,fileId:input.fileId,bytes:bytes.length,sha256};
    const start=await dedupTransaction(db,'upload-start',file);
    if(start.ready)return {fileId:input.fileId,bytes:bytes.length,reused:true};
    const bucket=db.storage.from('memory-share-photos');let settled=false;
    try{
      const {error}=await bucket.upload(start.path,bytes,{contentType:'image/jpeg',upsert:false});
      const status=Number(error?.statusCode);
      settled=!error||(status>=400&&status<500&&status!==408);
      if(error){
        if(!['400','409'].includes(String(error.statusCode))&&!/already exists|duplicate/i.test(error.message||''))throw new ShareError('照片上传失败，请重试',503);
        const existing=await bucket.download(start.path);
        if(existing.error||!existing.data)throw new ShareError('已有照片无法核对，请重试',503);
        const actual=new Uint8Array(await existing.data.arrayBuffer());
        if(actual.length!==bytes.length||await hash(actual)!==sha256)throw new ShareError('已有照片与清单不符，不能覆盖');
      }
      await dedupTransaction(db,'upload-done',file);
    }catch(error){
      // A transport/5xx failure may outlive this worker. Never let cancellation
      // release its reservation before an outstanding remote write has settled.
      if(settled)await dedupTransaction(db,'upload-failed',file).catch(()=>{});
      throw error;
    }
    return {fileId:input.fileId,bytes:bytes.length};
  }
  if(input.action==='migrate'){
    const result=await migrateLegacyShare(db,auth,(action,value)=>dedupTransaction(db,action,value),
      (step,fileId,dataUrl)=>handleDedupAction({...input,action:'upload',shareId:step.shareId,fileId,dataUrl},db,sourceHash));
    return {...result,...await cleanSharedFiles(db,auth)};
  }
  const result=input.action==='retry-cleanup'?{}:await dedupTransaction(db,input.action,auth);
  const cleaned=await cleanSharedFiles(db,auth);
  return {...result,...cleaned,freedBytes:(result.freedBytes||0)+cleaned.freedBytes};
}
