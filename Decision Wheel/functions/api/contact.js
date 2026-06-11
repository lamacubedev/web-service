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

  let response;
  try {
    response = await fetch(env.GOOGLE_SHEETS_WEB_APP_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      redirect: "follow",
    });
  } catch (error) {
    console.error("Google Sheets request failed.", error);
    return json({ error: "Inquiry storage request failed.", code: "UPSTREAM_REQUEST_FAILED" }, 502);
  }

  const responseText = await response.text();
  if (!response.ok) {
    console.error("Google Sheets returned an HTTP error.", response.status, responseText.slice(0, 500));
    return json({ error: "Inquiry storage failed.", code: "UPSTREAM_HTTP_ERROR" }, 502);
  }

  let result;
  try {
    result = JSON.parse(responseText);
  } catch {
    console.error("Google Sheets returned a non-JSON response.", responseText.slice(0, 500));
    return json({ error: "Inquiry storage returned an invalid response.", code: "UPSTREAM_INVALID_RESPONSE" }, 502);
  }
  if (result.ok !== true) {
    console.error("Google Sheets rejected the inquiry.", result.error || result);
    return json({ error: "Inquiry storage failed.", code: "UPSTREAM_REJECTED" }, 502);
  }
  return json({ ok: true });
}
