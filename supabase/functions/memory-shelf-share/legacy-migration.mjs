import {sanitizeDedupManifest,validateJpeg} from './storage-validation.mjs';
import {ShareError} from './storage-handler.mjs';

// Each request verifies/imports one physical file. The old public snapshot remains
// readable until SQL atomically swaps the complete directory at migrate-finish.
export async function migrateLegacyShare(db,auth,transaction,upload){
  const previous=await transaction('migrate-read',auth);
  if(previous.done)return {done:true,processed:0,total:0};
  const snapshot=previous.snapshot,originals=new Map();let candidate=snapshot;
  if(snapshot.version===1){
    candidate={provinces:[],files:[]};
    const add=async src=>{
      const {bytes,sha256}=await validateJpeg(src),fileId='legacy-'+(originals.size+1);
      originals.set(fileId,src);candidate.files.push({fileId,bytes:bytes.length,sha256});return fileId;
    };
    for(const p of snapshot.provinces){
      const province={name:p.name,review:p.review,coverId:p.cover?await add(p.cover):'',cities:[]};
      for(const c of p.cities){const city={name:c.name,description:c.description,firstMonth:c.firstMonth,photos:[]};
        for(const photo of c.photos)city.photos.push({name:photo.name,fileId:await add(photo.dataUrl)});
        province.cities.push(city);
      }
      candidate.provinces.push(province);
    }
  }
  const manifest=sanitizeDedupManifest(candidate,auth.shareId);
  const session=await transaction('migrate-start',{...auth,manifest,expectedSnapshot:snapshot});
  const ready=new Set(session.uploadedIds),next=manifest.files.find(f=>!ready.has(f.fileId));
  if(next){
    let src=originals.get(next.fileId);
    if(snapshot.version===2){
      const stored=await db.storage.from('memory-share-photos').download(snapshot.storagePrefix+'/'+next.fileId+'.jpg');
      if(stored.error||!stored.data)throw new ShareError('旧照片无法读取，原分享保持不变，请重试',503);
      const bytes=new Uint8Array(await stored.data.arrayBuffer());
      src='data:image/jpeg;base64,'+btoa(Array.from(bytes,b=>String.fromCharCode(b)).join(''));
    }
    const verified=await validateJpeg(src);
    if(verified.bytes.length!==next.bytes||verified.sha256!==next.sha256)throw new ShareError('旧照片与清单不符，原分享保持不变');
    const stepAuth={...auth,shareId:session.shareId};
    const file=await transaction('migrate-file',{...stepAuth,...next});
    if(!file.ready)await upload(stepAuth,next.fileId,src);
    ready.add(next.fileId);
  }
  if(ready.size===manifest.files.length)await transaction('migrate-finish',{...auth,shareId:session.shareId});
  return {done:ready.size===manifest.files.length,processed:ready.size,total:manifest.files.length};
}
