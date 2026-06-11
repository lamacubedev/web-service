function json(data, status = 200) {
  return Response.json(data, {
    status,
    headers: { "Cache-Control": "no-store" },
  });
}

async function secureEqual(actual, expected) {
  if (!actual || !expected) return false;
  const encoder = new TextEncoder();
  const [actualHash, expectedHash] = await Promise.all([
    crypto.subtle.digest("SHA-256", encoder.encode(actual)),
    crypto.subtle.digest("SHA-256", encoder.encode(expected)),
  ]);
  const a = new Uint8Array(actualHash);
  const b = new Uint8Array(expectedHash);
  let difference = 0;
  for (let index = 0; index < a.length; index += 1) difference |= a[index] ^ b[index];
  return difference === 0;
}

export async function onRequestGet({ request, env }) {
  if (!env.ANALYTICS_DB || !env.ADMIN_STATS_TOKEN) {
    return json({ error: "Analytics dashboard is not configured." }, 503);
  }

  const authorization = request.headers.get("Authorization") || "";
  const token = authorization.startsWith("Bearer ") ? authorization.slice(7) : "";
  if (!(await secureEqual(token, env.ADMIN_STATS_TOKEN))) {
    return json({ error: "Unauthorized" }, 401);
  }

  const url = new URL(request.url);
  const requestedDays = Number(url.searchParams.get("days"));
  const days = [7, 30, 90].includes(requestedDays) ? requestedDays : 30;
  const since = new Date(Date.now() - (days - 1) * 86400000).toISOString().slice(0, 10);

  try {
    const [summary, daily, pages, countries, languages, referrers] = await env.ANALYTICS_DB.batch([
      env.ANALYTICS_DB.prepare(`
        SELECT COUNT(*) AS pageviews, COUNT(DISTINCT visitor_hash) AS visitors
        FROM analytics_events WHERE event_date >= ?1
      `).bind(since),
      env.ANALYTICS_DB.prepare(`
        SELECT event_date AS date, COUNT(*) AS pageviews,
          COUNT(DISTINCT visitor_hash) AS visitors
        FROM analytics_events WHERE event_date >= ?1
        GROUP BY event_date ORDER BY event_date
      `).bind(since),
      env.ANALYTICS_DB.prepare(`
        SELECT path, COUNT(*) AS pageviews,
          COUNT(DISTINCT visitor_hash) AS visitors
        FROM analytics_events WHERE event_date >= ?1
        GROUP BY path ORDER BY pageviews DESC LIMIT 12
      `).bind(since),
      env.ANALYTICS_DB.prepare(`
        SELECT country_code AS country, COUNT(*) AS pageviews,
          COUNT(DISTINCT visitor_hash) AS visitors
        FROM analytics_events WHERE event_date >= ?1
        GROUP BY country_code ORDER BY visitors DESC LIMIT 12
      `).bind(since),
      env.ANALYTICS_DB.prepare(`
        SELECT language, COUNT(*) AS pageviews
        FROM analytics_events WHERE event_date >= ?1
        GROUP BY language ORDER BY pageviews DESC LIMIT 12
      `).bind(since),
      env.ANALYTICS_DB.prepare(`
        SELECT referrer_host AS referrer, COUNT(*) AS pageviews
        FROM analytics_events
        WHERE event_date >= ?1 AND referrer_host <> ''
        GROUP BY referrer_host ORDER BY pageviews DESC LIMIT 12
      `).bind(since),
    ]);

    return json({
      days,
      since,
      generatedAt: new Date().toISOString(),
      summary: summary.results[0] || { pageviews: 0, visitors: 0 },
      daily: daily.results,
      pages: pages.results,
      countries: countries.results,
      languages: languages.results,
      referrers: referrers.results,
    });
  } catch (error) {
    console.error("Analytics query failed.", error);
    return json({ error: "Analytics query failed." }, 500);
  }
}
