function json(data, status = 200) {
  return Response.json(data, {
    status,
    headers: {
      "Cache-Control": "no-store",
      "Content-Type": "application/json; charset=utf-8",
    },
  });
}

function clean(value, maxLength) {
  return String(value || "").trim().slice(0, maxLength);
}

export async function onRequestPost({ request, env }) {
  if (!env.GOOGLE_SHEETS_WEB_APP_URL || !env.CONTACT_SHARED_SECRET) {
    return json({ error: "Contact service is not configured." }, 503);
  }

  let input;
  try {
    input = await request.json();
  } catch {
    return json({ error: "Invalid request body." }, 400);
  }

  if (input.website) return json({ ok: true });

  const payload = {
    secret: env.CONTACT_SHARED_SECRET,
    serviceId: clean(input.serviceId, 80),
    serviceName: clean(input.serviceName, 120),
    pageUrl: clean(input.pageUrl, 500),
    category: clean(input.category, 80),
    name: clean(input.name, 120),
    email: clean(input.email, 200),
    subject: clean(input.subject, 200),
    message: clean(input.message, 5000),
  };

  if (!payload.serviceId || !payload.name || !payload.email || !payload.subject || !payload.message) {
    return json({ error: "Required fields are missing." }, 400);
  }

  const response = await fetch(env.GOOGLE_SHEETS_WEB_APP_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
    redirect: "follow",
  });

  if (!response.ok) return json({ error: "Inquiry storage failed." }, 502);

  const result = await response.json().catch(() => ({ ok: true }));
  if (result.ok === false) return json({ error: "Inquiry storage failed." }, 502);
  return json({ ok: true });
}
