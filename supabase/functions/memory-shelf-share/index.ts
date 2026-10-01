import {createClient} from 'npm:@supabase/supabase-js@2.49.8';
import {MAX_BYTES, validId, sanitizeSnapshot} from './validation.mjs';

const headers = {'Access-Control-Allow-Origin':'*','Access-Control-Allow-Headers':'content-type, apikey','Access-Control-Allow-Methods':'POST, OPTIONS','Cache-Control':'no-store'};
const reply = (body: unknown, status=200) => Response.json(body,{status,headers});
const hash = async (value: string) => Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256',new TextEncoder().encode(value)))).map(byte=>byte.toString(16).padStart(2,'0')).join('');

Deno.serve(async request => {
  if (request.method === 'OPTIONS') return new Response(null,{status:204,headers});
  if (request.method !== 'POST') return reply({error:'不支持的请求'},405);
  try {
    // 流式限制请求体；不信任可伪造的 Content-Length。
    const reader=request.body?.getReader();
    if (!reader) return reply({error:'请求不能为空'},400);
    let bytes=0;const chunks:Uint8Array[]=[];
    while(true){const {done,value}=await reader.read();if(done) break;bytes+=value.length;if(bytes>MAX_BYTES){await reader.cancel();return reply({error:'分享内容超过 12MB'},413);}chunks.push(value);}
    const body=new Uint8Array(bytes);let offset=0;for(const chunk of chunks){body.set(chunk,offset);offset+=chunk.length;}
    const input=JSON.parse(new TextDecoder().decode(body));
    if (!validId(input.shareId)) return reply({error:'分享链接无效'},400);
    const secret=Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')||'';
    const db=createClient(Deno.env.get('SUPABASE_URL')||'',secret,{auth:{persistSession:false,autoRefreshToken:false}});
    if (input.action === 'read') {
      const {data,error}=await db.from('memory_shelf_shares').select('snapshot,updated_at').eq('share_id',input.shareId).maybeSingle();
      if(error) throw error;
      return data?reply(data):reply({error:'这份记忆书架尚未分享或已失效'},404);
    }
    if(input.action !== 'publish' || !/^[a-f0-9]{64}$/.test(input.managementKey||'')) return reply({error:'分享管理凭证无效'},403);
    const snapshot=sanitizeSnapshot(input.snapshot);
    const managementHash=await hash(input.managementKey);
    const {data:existing,error:lookupError}=await db.from('memory_shelf_shares').select('management_hash').eq('share_id',input.shareId).maybeSingle();
    if(lookupError) throw lookupError;
    if(existing && existing.management_hash !== managementHash) return reply({error:'无权更新此书架'},403);
    const sourceHash=await hash(secret+'|'+(request.headers.get('x-forwarded-for')||'unknown').split(',')[0].trim());
    const day=new Date().toISOString().slice(0,10);
    let reserved=false;
    for(let slot=0;slot<20;slot++) {
      const {error}=await db.from('memory_share_quota').insert({source_hash:sourceHash,day,slot});
      if(!error){reserved=true;break;}
      if(error.code !== '23505') throw error;
    }
    if(!reserved) return reply({error:'今天生成海报次数较多，请明天再试'},429);
    const row={share_id:input.shareId,management_hash:managementHash,snapshot,updated_at:new Date().toISOString()};
    const {error}=existing
      ?await db.from('memory_shelf_shares').update({snapshot,updated_at:row.updated_at}).eq('share_id',input.shareId).eq('management_hash',managementHash)
      :await db.from('memory_shelf_shares').insert(row);
    if(error) throw error;
    return reply({shareId:input.shareId});
  } catch(error) {
    console.error('Memory shelf share failed', error instanceof Error ? error.name : 'database');
    const validation=error instanceof Error && !(error as {code?:string}).code;
    return reply({error:validation?error.message:'分享服务暂时不可用，请稍后重试'},validation?400:500);
  }
});
