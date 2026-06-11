function json(data, status = 200) {
  return Response.json(data, {
    status,
    headers: { "Cache-Control": status === 200 ? "public, max-age=86400" : "no-store" },
  });
}

const PEXELS_LOCALES = {
  en: "en-US", pt: "pt-BR", es: "es-ES", de: "de-DE", it: "it-IT",
  fr: "fr-FR", sv: "sv-SE", id: "id-ID", pl: "pl-PL", ja: "ja-JP",
  zh: "zh-CN", ko: "ko-KR", th: "th-TH", nl: "nl-NL", vi: "vi-VN",
  da: "da-DK", uk: "uk-UA", el: "el-GR", no: "nb-NO", tr: "tr-TR",
  ru: "ru-RU",
};

async function requestUnsplash(query, key, language) {
  const url = new URL("https://api.unsplash.com/search/photos");
  url.searchParams.set("query", query);
  url.searchParams.set("per_page", "5");
  url.searchParams.set("order_by", "relevant");
  url.searchParams.set("orientation", "squarish");
  url.searchParams.set("content_filter", "high");
  if (language && language !== "en") url.searchParams.set("lang", language);
  return fetch(url, {
    headers: {
      Authorization: `Client-ID ${key}`,
      "Accept-Version": "v1",
    },
  });
}

async function searchUnsplash(query, accessKey, language) {
  const key = accessKey?.trim();
  if (!key) return { items: [], configured: false, status: 0 };
  let response = await requestUnsplash(query, key, language);
  if (!response.ok && language && language !== "en") {
    response = await requestUnsplash(query, key, "");
  }
  if (!response.ok) return { items: [], configured: true, status: response.status };
  const payload = await response.json();
  const items = (payload.results || []).slice(0, 5).map((photo) => ({
    provider: "Unsplash",
    title: photo.alt_description || photo.description || query,
    thumbnailUrl: photo.urls?.small,
    sourceUrl: photo.links?.html
      ? `${photo.links.html}${photo.links.html.includes("?") ? "&" : "?"}utm_source=menu_rush&utm_medium=referral`
      : "",
    photographer: photo.user?.name || "",
    photographerUrl: photo.user?.links?.html || "",
  }));
  return { items, configured: true, status: response.status };
}

async function searchPexels(query, apiKey, language) {
  const key = apiKey?.trim();
  if (!key) return { items: [], configured: false, status: 0 };
  const url = new URL("https://api.pexels.com/v1/search");
  url.searchParams.set("query", query);
  url.searchParams.set("per_page", "5");
  url.searchParams.set("orientation", "square");
  const locale = PEXELS_LOCALES[language];
  if (locale) url.searchParams.set("locale", locale);
  const response = await fetch(url, {
    headers: { Authorization: key },
  });
  if (!response.ok) return { items: [], configured: true, status: response.status };
  const payload = await response.json();
  const items = (payload.photos || []).slice(0, 5).map((photo) => ({
    provider: "Pexels",
    title: photo.alt || query,
    thumbnailUrl: photo.src?.medium,
    sourceUrl: photo.url,
    photographer: photo.photographer || "",
    photographerUrl: photo.photographer_url || "",
  }));
  return { items, configured: true, status: response.status };
}

export async function onRequestGet({ request, env }) {
  const url = new URL(request.url);
  const query = url.searchParams.get("q")?.trim();
  const language = url.searchParams.get("lang")?.trim().toLowerCase() || "en";
  if (!query) return json({ error: "Missing search query." }, 400);

  const results = await Promise.allSettled([
    searchUnsplash(query, env.UNSPLASH_ACCESS_KEY, language),
    searchPexels(query, env.PEXELS_API_KEY, language),
  ]);
  const unsplash = results[0].status === "fulfilled"
    ? results[0].value
    : { items: [], configured: Boolean(env.UNSPLASH_ACCESS_KEY), status: 0 };
  const pexels = results[1].status === "fulfilled"
    ? results[1].value
    : { items: [], configured: Boolean(env.PEXELS_API_KEY), status: 0 };
  const items = [...unsplash.items, ...pexels.items].filter((item) => item.thumbnailUrl && item.sourceUrl);
  const providers = {
    Unsplash: { configured: unsplash.configured, status: unsplash.status, count: unsplash.items.length },
    Pexels: { configured: pexels.configured, status: pexels.status, count: pexels.items.length },
  };
  if (!items.length) {
    return json({ error: "Image providers are not configured or returned no results.", providers }, 503);
  }
  return json({ query, items, providers });
}
