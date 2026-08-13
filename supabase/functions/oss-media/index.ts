import OSS from "npm:ali-oss@6.20.0";
import { withSupabase } from "jsr:@supabase/server@^1";

function ownsPath(path: unknown, userId: string): path is string {
  return typeof path === "string" &&
    path.startsWith(`users/${userId}/`) &&
    !path.includes("..") &&
    !path.includes("\\") &&
    path.length <= 1024;
}

export default {
  fetch: withSupabase({ auth: "user" }, async (request, ctx) => {
    if (request.method !== "POST") return Response.json({ error: "Method not allowed" }, { status: 405 });
    const userId = String(ctx.userClaims?.sub || "");
    if (!userId) return Response.json({ error: "登录状态无效" }, { status: 401 });

    try {
      const payload = await request.json();
      const client = new OSS({
        accessKeyId: Deno.env.get("ALIYUN_OSS_ACCESS_KEY_ID") || "",
        accessKeySecret: Deno.env.get("ALIYUN_OSS_ACCESS_KEY_SECRET") || "",
        bucket: Deno.env.get("ALIYUN_OSS_BUCKET") || "",
        region: Deno.env.get("ALIYUN_OSS_REGION") || "",
        endpoint: Deno.env.get("ALIYUN_OSS_ENDPOINT") || "",
        authorizationV4: true,
        secure: true,
      });

      if (payload.action === "put" || payload.action === "get") {
        if (!ownsPath(payload.path, userId)) return Response.json({ error: "无权访问该照片" }, { status: 403 });
        const method = payload.action === "put" ? "PUT" : "GET";
        const url = await client.signatureUrlV4(method, 300, { headers: {} }, payload.path);
        return Response.json({ url, expiresIn: 300 });
      }

      if (payload.action === "delete") {
        const paths = Array.isArray(payload.paths) ? payload.paths : [];
        if (!paths.length || paths.length > 50 || paths.some((path) => !ownsPath(path, userId))) {
          return Response.json({ error: "照片路径无效" }, { status: 400 });
        }
        await Promise.all(paths.map((path) => client.delete(path)));
        return Response.json({ deleted: paths.length });
      }

      return Response.json({ error: "不支持的操作" }, { status: 400 });
    } catch (error) {
      console.error("OSS media error", error);
      return Response.json({ error: error instanceof Error ? error.message : "OSS 请求失败" }, { status: 500 });
    }
  }),
};
