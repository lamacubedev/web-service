function json(data, status = 200) {
  return Response.json(data, {
    status,
    headers: { "Cache-Control": status === 200 ? "public, max-age=86400" : "no-store" },
  });
}

async function searchUnsplash(query, accessKey) {
  if (!accessKey) return [];
  const url = new URL("https://api.unsplash.com/search/photos");
  url.searchParams.set("query", query);
  url.searchParams.set("per_page", "5");
  url.searchParams.set("orientation", "squarish");
  url.searchParams.set("content_filter", "high");
  const response = await fetch(url, {
    headers: {
      Authorization: `Client-ID ${accessKey}`,
      "Accept-Version": "v1",
    },
  });
  if (!response.ok) return [];
  const payload = await response.json();
  return (payload.results || []).slice(0, 5).map((photo) => ({
    provider: "Unsplash",
    title: photo.alt_description || photo.description || query,
    thumbnailUrl: photo.urls?.small,
    sourceUrl: photo.links?.html,
    photographer: photo.user?.name || "",
    photographerUrl: photo.user?.links?.html || "",
  }));
}

async function searchPexels(query, apiKey) {
  if (!apiKey) return [];
  const url = new URL("https://api.pexels.com/v1/search");
  url.searchParams.set("query", query);
  url.searchParams.set("per_page", "5");
  url.searchParams.set("orientation", "square");
  const response = await fetch(url, {
    headers: { Authorization: apiKey },
  });
  if (!response.ok) return [];
  const payload = await response.json();
  return (payload.photos || []).slice(0, 5).map((photo) => ({
    provider: "Pexels",
    title: photo.alt || query,
    thumbnailUrl: photo.src?.medium,
    sourceUrl: photo.url,
    photographer: photo.photographer || "",
    photographerUrl: photo.photographer_url || "",
  }));
}

export async function onRequestGet({ request, env }) {
  const url = new URL(request.url);
  const query = url.searchParams.get("q")?.trim();
  if (!query) return json({ error: "Missing search query." }, 400);

  const [unsplash, pexels] = await Promise.all([
    searchUnsplash(query, env.UNSPLASH_ACCESS_KEY),
    searchPexels(query, env.PEXELS_API_KEY),
  ]);
  const items = [...unsplash, ...pexels].filter((item) => item.thumbnailUrl && item.sourceUrl);
  if (!items.length) return json({ error: "Image providers are not configured or returned no results." }, 503);
  return json({ items });
}
