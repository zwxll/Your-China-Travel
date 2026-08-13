import OSS from "npm:ali-oss@6.20.0";
import { createClient } from "npm:@supabase/supabase-js@2";

const allowedOrigins = new Set([
  "https://zwxll.github.io",
  "http://127.0.0.1:8765",
]);

function corsHeaders(request: Request) {
  const origin = request.headers.get("Origin") || "";
  return {
    "Access-Control-Allow-Origin": allowedOrigins.has(origin) ? origin : "https://zwxll.github.io",
    "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Vary": "Origin",
  };
}

const json = (request: Request, body: unknown, status = 200) =>
  Response.json(body, { status, headers: corsHeaders(request) });

function ownsPath(path: unknown, userId: string): path is string {
  return typeof path === "string" &&
    path.startsWith(`users/${userId}/`) &&
    !path.includes("..") &&
    !path.includes("\\") &&
    path.length <= 1024;
}

export default {
  async fetch(request: Request) {
    if (request.method === "OPTIONS") {
      return new Response(null, { status: 204, headers: corsHeaders(request) });
    }
    if (request.method !== "POST") return json(request, { error: "Method not allowed" }, 405);

    const authorization = request.headers.get("Authorization") || "";
    const token = authorization.replace(/^Bearer\s+/i, "");
    if (!token) return json(request, { error: "登录状态无效" }, 401);

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") || "",
      Deno.env.get("SUPABASE_ANON_KEY") || "",
      { auth: { persistSession: false, autoRefreshToken: false } },
    );
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    if (authError || !user) {
      console.error("Supabase auth error", authError);
      return json(request, { error: "登录状态无效" }, 401);
    }
    const userId = user.id;

    try {
      const payload = await request.json();
      const client = new OSS({
        accessKeyId: Deno.env.get("ALIYUN_OSS_ACCESS_KEY_ID") || "",
        accessKeySecret: Deno.env.get("ALIYUN_OSS_ACCESS_KEY_SECRET") || "",
        bucket: Deno.env.get("ALIYUN_OSS_BUCKET") || "",
        region: Deno.env.get("ALIYUN_OSS_REGION") || "",
        authorizationV4: true,
        secure: true,
      });

      if (payload.action === "put" || payload.action === "get") {
        if (!ownsPath(payload.path, userId)) return json(request, { error: "无权访问该照片" }, 403);
        const method = payload.action === "put" ? "PUT" : "GET";
        const extension = payload.path.split(".").pop()?.toLowerCase();
        const inferredContentType = extension === "png" ? "image/png" : extension === "webp" ? "image/webp" : extension === "gif" ? "image/gif" : "image/jpeg";
        const headers = payload.action === "put" ? { "content-type": payload.contentType || inferredContentType } : {};
        const url = await client.signatureUrlV4(method, 300, { headers }, payload.path);
        return json(request, { url, expiresIn: 300 });
      }

      if (payload.action === "delete") {
        const paths = Array.isArray(payload.paths) ? payload.paths : [];
        if (!paths.length || paths.length > 50 || paths.some((path) => !ownsPath(path, userId))) {
          return json(request, { error: "照片路径无效" }, 400);
        }
        await Promise.all(paths.map((path) => client.delete(path)));
        return json(request, { deleted: paths.length });
      }

      return json(request, { error: "不支持的操作" }, 400);
    } catch (error) {
      console.error("OSS media error", error);
      return json(request, { error: error instanceof Error ? error.message : "OSS 请求失败" }, 500);
    }
  },
};
