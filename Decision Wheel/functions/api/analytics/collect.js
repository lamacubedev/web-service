function clean(value, maxLength) {
  return String(value || "").trim().slice(0, maxLength);
}

async function hashVisitor(visitorId, salt) {
  const bytes = new TextEncoder().encode(`${salt}:${visitorId}`);
  const digest = await crypto.subtle.digest("SHA-256", bytes);
  return [...new Uint8Array(digest)]
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
}

function referrerHost(value) {
  try {
    const text = String(value || "").trim();
    if (!text) return "";
    return new URL(text.includes("://") ? text : `https://${text}`).hostname.slice(0, 200);
  } catch {
    return "";
  }
}

export async function onRequestPost(context) {
  const { request, env } = context;
  if (!env.ANALYTICS_DB || !env.ANALYTICS_SALT) {
    return Response.json({ ok: false, error: "Analytics is not configured." }, { status: 503 });
  }

  let input;
  try {
    input = await request.json();
  } catch {
    return Response.json({ ok: false }, { status: 400 });
  }

  const visitorId = clean(input.visitorId, 120);
  const path = clean(input.path, 300);
  if (!visitorId || !path || path.startsWith("/admin")) {
    return Response.json({ ok: false }, { status: 400 });
  }

  const now = new Date();
  const visitorHash = await hashVisitor(visitorId, env.ANALYTICS_SALT);
  const countryCode = clean(request.cf?.country, 2).toUpperCase();
  const insert = env.ANALYTICS_DB.prepare(`
    INSERT INTO analytics_events (
      occurred_at, event_date, visitor_hash, path, referrer_host,
      country_code, language, culture
    ) VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7, ?8)
  `).bind(
    now.toISOString(),
    now.toISOString().slice(0, 10),
    visitorHash,
    path,
    referrerHost(input.referrer),
    countryCode,
    clean(input.language, 12),
    clean(input.culture, 8),
  );
  const retentionDate = new Date(now.getTime() - 396 * 86400000).toISOString().slice(0, 10);
  const cleanup = env.ANALYTICS_DB.prepare(
    "DELETE FROM analytics_events WHERE event_date < ?1",
  ).bind(retentionDate);

  context.waitUntil(
    env.ANALYTICS_DB.batch([insert, cleanup])
      .catch((error) => console.error("Analytics insert failed.", error)),
  );
  return Response.json({ ok: true }, { status: 202 });
}
