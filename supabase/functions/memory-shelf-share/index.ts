import {createClient} from 'npm:@supabase/supabase-js@2.49.8';
import {handleStorageAction,ShareError} from './storage-handler.mjs';
import {handleDedupAction} from './dedup-handler.mjs';
import {hash} from './storage-validation.mjs';

const headers={'Access-Control-Allow-Origin':'*','Access-Control-Allow-Headers':'content-type, apikey','Access-Control-Allow-Methods':'POST, OPTIONS','Cache-Control':'no-store'};
const reply=(body:unknown,status=200)=>Response.json(body,{status,headers});
Deno.serve(async request=>{
  if(request.method==='OPTIONS')return new Response(null,{status:204,headers});
  if(request.method!=='POST')return reply({error:'不支持的请求'},405);
  try{
    const reader=request.body?.getReader();if(!reader)return reply({error:'请求不能为空'},400);
    let bytes=0;const chunks:Uint8Array[]=[];
    while(true){const {done,value}=await reader.read();if(done)break;bytes+=value.length;if(bytes>2*1024*1024){await reader.cancel();return reply({error:'单次请求过大，请更新网页后重试'},413);}chunks.push(value);}
    const body=new Uint8Array(bytes);let offset=0;for(const chunk of chunks){body.set(chunk,offset);offset+=chunk.length;}
    let input;try{input=JSON.parse(new TextDecoder().decode(body));}catch{return reply({error:'请求格式无效'},400);}
    if(!input||typeof input!=='object')return reply({error:'请求格式无效'},400);
    const secret=Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')||'';
    const db=createClient(Deno.env.get('SUPABASE_URL')||'',secret,{auth:{persistSession:false,autoRefreshToken:false}});
    // Gateway-supplied source, never a source identifier from the request body.
    const sourceHash=await hash(secret+'|'+(request.headers.get('x-forwarded-for')||'unknown').split(',')[0].trim());
    if(['read','read-city'].includes(input.action))return reply(await handleStorageAction(input,db,sourceHash));
    if(input.protocolVersion!==3)throw new ShareError('请更新网页后重试，新版分享使用共用照片存储');
    return reply(await handleDedupAction(input,db,sourceHash));
  }catch(error){
    if(error instanceof ShareError)return reply({error:error.message},error.status);
    if(error instanceof Error&&/书架清单|照片清单|城市章节|照片列表|分享暂不|照片数量|JPEG|照片尺寸|照片编码|仅支持/.test(error.message))return reply({error:error.message},400);
    console.error('Memory shelf share failed');return reply({error:'分享服务暂时不可用，请稍后重试'},503);
  }
});
