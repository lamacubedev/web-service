export function onRequestGet({ request }) {
  const country = String(request.cf?.country || "").toUpperCase();
  return Response.json(
    { country },
    { headers: { "Cache-Control": "private, max-age=300" } },
  );
}
