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

// 基础频率限制：同一 IP 在窗口期内只允许一次提交（微隔离实例内有效，冷启动会重置）。
// 作为防连续快速提交/防重复的基础防线；配合客户端 loading + 去重逻辑使用。
const rateMap = new Map<string, number>();
const RATE_WINDOW_MS = 15_000;

const MAX_CONTENT = 1000;
const MAX_SCREENSHOTS = 3;
const MAX_SCREENSHOTS_TOTAL_LEN = 2_500_000; // base64 总长度粗略上限，约 1.8MB
const ALLOWED_TYPES = new Set([
  "功能建议", "页面体验", "UI/视觉", "地图交互", "数据问题", "Bug问题", "其他",
]);
const ALLOWED_CATEGORIES = new Set([
  "地图操作", "页面布局", "城市记录", "旅行轨迹", "照片管理", "游客点评", "页面速度", "手机端体验", "其他",
]);

export default {
  async fetch(request: Request) {
    if (request.method === "OPTIONS") {
      return new Response(null, { status: 204, headers: corsHeaders(request) });
    }
    if (request.method !== "POST") return json(request, { error: "Method not allowed" }, 405);

    const ip =
      request.headers.get("x-real-ip") ||
      request.headers.get("cf-connecting-ip") ||
      request.headers.get("x-forwarded-for") ||
      "";
    const now = Date.now();
    const last = rateMap.get(ip) || 0;
    if (ip && now - last < RATE_WINDOW_MS) {
      return json(request, { error: "提交太频繁，请稍后再试。" }, 429);
    }
    if (ip) rateMap.set(ip, now);

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") || "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || Deno.env.get("SUPABASE_ANON_KEY") || "",
      { auth: { persistSession: false, autoRefreshToken: false } },
    );

    // 可选登录用户：已登录则记录 userId；游客为空。
    let userId: string | null = null;
    try {
      const authorization = request.headers.get("Authorization") || "";
      const token = authorization.replace(/^Bearer\s+/i, "");
      if (token) {
        const { data } = await supabase.auth.getUser(token);
        userId = data?.user?.id || null;
      }
    } catch {
      userId = null;
    }

    let payload: Record<string, unknown>;
    try {
      payload = await request.json();
    } catch {
      return json(request, { error: "请求体无效" }, 400);
    }

    const content = typeof payload.content === "string" ? payload.content.trim() : "";
    if (content.length < 10 || content.length > MAX_CONTENT) {
      return json(request, { error: "建议内容需在 10~1000 字之间" }, 400);
    }

    const feedbackType = Array.isArray(payload.feedbackType)
      ? payload.feedbackType.filter((t): t is string => typeof t === "string" && ALLOWED_TYPES.has(t)).slice(0, 8)
      : [];

    const category = typeof payload.category === "string" && ALLOWED_CATEGORIES.has(payload.category)
      ? payload.category
      : "其他";

    const rating = Math.min(5, Math.max(0, Math.round(Number(payload.rating) || 0)));

    const screenshots = Array.isArray(payload.screenshots)
      ? payload.screenshots
          .filter((s): s is string => typeof s === "string" && s.startsWith("data:image/"))
          .slice(0, MAX_SCREENSHOTS)
      : [];
    if (screenshots.join("").length > MAX_SCREENSHOTS_TOTAL_LEN) {
      return json(request, { error: "截图总大小过大" }, 400);
    }

    const str = (v: unknown, max: number): string =>
      typeof v === "string" ? v.slice(0, max) : "";

    const contactEmail = str(payload.contact, 320);
    const contactAllowed = payload.contactAllowed === true;

    try {
      const { error } = await supabase.from("user_feedback").insert({
        user_id: userId,
        feedback_type: feedbackType,
        category,
        content: content.slice(0, MAX_CONTENT),
        rating,
        screenshots,
        page: str(payload.page, 120),
        route: str(payload.route, 200),
        module: str(payload.module, 120),
        viewport: str(payload.viewport, 40),
        browser: str(payload.browser, 200),
        app_version: str(payload.appVersion, 40),
        contact_email: contactEmail,
        contact_allowed: contactAllowed,
        status: "new",
      });
      if (error) {
        console.error("feedback insert error", error);
        return json(request, { error: "保存失败，请稍后再试" }, 500);
      }
      return json(request, { ok: true });
    } catch (error) {
      console.error("feedback error", error);
      return json(request, { error: error instanceof Error ? error.message : "提交失败" }, 500);
    }
  },
};