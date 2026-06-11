(() => {
const infoElements = {
  trigger: document.querySelector("#infoMenuButton"),
  drawer: document.querySelector("#infoDrawer"),
  overlay: document.querySelector("#infoOverlay"),
  close: document.querySelector("#infoCloseButton"),
};

const SITE_LANGUAGE_OPTIONS = [
  ["ko", "한국어"], ["en", "English"], ["ja", "日本語"], ["zh", "中文"],
  ["es", "Español"], ["fr", "Français"], ["de", "Deutsch"], ["pt", "Português"],
  ["it", "Italiano"], ["ru", "Русский"], ["ar", "العربية"], ["hi", "हिन्दी"],
  ["id", "Bahasa Indonesia"], ["vi", "Tiếng Việt"], ["th", "ไทย"], ["tr", "Türkçe"],
  ["el", "Ελληνικά"], ["ms", "Bahasa Melayu"], ["tl", "Filipino"], ["uk", "Українська"],
  ["pl", "Polski"], ["nl", "Nederlands"], ["sv", "Svenska"], ["no", "Norsk"],
  ["da", "Dansk"], ["he", "עברית"],
];
const SITE_LANGUAGES = new Set(SITE_LANGUAGE_OPTIONS.map(([code]) => code));
const COUNTRY_LANGUAGES = {
  KR: "ko", US: "en", JP: "ja", CN: "zh", ES: "es", FR: "fr", DE: "de", GB: "en",
  IN: "hi", ID: "id", VN: "vi", TH: "th", IT: "it", PT: "pt", MX: "es", BR: "pt",
  TR: "tr", GR: "el", CA: "en", AU: "en", NZ: "en", SG: "en", MY: "ms", PH: "tl",
  RU: "ru", UA: "uk", PL: "pl", NL: "nl", BE: "nl", SE: "sv", NO: "no", DK: "da",
  SA: "ar", AE: "ar", IL: "he", EG: "ar", MA: "ar", ZA: "en", AR: "es", PE: "es",
  AT: "de", CH: "de", IE: "en", CL: "es", CO: "es", TW: "zh", HK: "zh",
};
const TRANSLATION_SEPARATOR = "\n[[[MENU_RUSH_SITE_SPLIT]]]\n";
const BRAND_PLACEHOLDER = "[[[MENU_RUSH_BRAND]]]";
const SITE_LANGUAGE_STORAGE_KEY = "menu-rush-language";
const originalText = new WeakMap();
const originalAttributes = new WeakMap();
let visitorCountry = "";
let activeSiteLanguage = "ko";

function createInfoLanguageSelect() {
  if (document.querySelector("#languageSelect")) return null;
  const actions = document.querySelector(".info-page-actions");
  if (!actions) return null;

  const wrapper = document.createElement("label");
  wrapper.className = "language-picker info-language-control";

  const label = document.createElement("span");
  label.textContent = "언어";

  const select = document.createElement("select");
  select.id = "infoLanguageSelect";
  select.setAttribute("data-no-translate", "");
  select.setAttribute("aria-label", "Language");
  SITE_LANGUAGE_OPTIONS.forEach(([code, label]) => {
    const option = document.createElement("option");
    option.value = code;
    option.textContent = label;
    select.appendChild(option);
  });
  select.addEventListener("change", async (event) => {
    const language = event.target.value;
    try {
      localStorage.setItem(SITE_LANGUAGE_STORAGE_KEY, language);
    } catch {
      // The current page still uses the selected language.
    }
    await localizeSiteContent(language);
  });

  wrapper.append(label, select);
  actions.prepend(wrapper);
  return select;
}

const infoLanguageSelect = createInfoLanguageSelect();

function browserLanguage() {
  const language = (navigator.language || "en").split("-")[0].toLowerCase();
  return SITE_LANGUAGES.has(language) ? language : "en";
}

async function detectSiteLocale() {
  const searchParams = new URLSearchParams(window.location.search);
  const requestedLanguage = searchParams.get("lang")?.toLowerCase();
  const requestedCountry = searchParams.get("country")?.toUpperCase();
  if (requestedCountry && COUNTRY_LANGUAGES[requestedCountry]) visitorCountry = requestedCountry;
  let preferredLanguage = requestedLanguage && SITE_LANGUAGES.has(requestedLanguage)
    ? requestedLanguage
    : "";
  try {
    const savedLanguage = localStorage.getItem(SITE_LANGUAGE_STORAGE_KEY);
    if (!preferredLanguage && savedLanguage && SITE_LANGUAGES.has(savedLanguage)) {
      preferredLanguage = savedLanguage;
    }
  } catch {
    // Private browsing can make storage unavailable.
  }
  try {
    if (visitorCountry) return preferredLanguage || COUNTRY_LANGUAGES[visitorCountry] || browserLanguage();
    const response = await fetch("/api/locale", { headers: { Accept: "application/json" } });
    if (response.ok) {
      const data = await response.json();
      visitorCountry = String(data.country || "").toUpperCase();
    }
  } catch {
    // Local previews and file hosting use the browser language fallback.
  }
  return preferredLanguage || COUNTRY_LANGUAGES[visitorCountry] || browserLanguage();
}

function translationLanguage(language) {
  return language === "zh" ? "zh-CN" : language === "he" ? "iw" : language;
}

function cacheRead(language) {
  try {
    return JSON.parse(localStorage.getItem(`menu-rush-site-copy-v3:${language}`)) || {};
  } catch {
    return {};
  }
}

function cacheWrite(language, value) {
  try {
    localStorage.setItem(`menu-rush-site-copy-v3:${language}`, JSON.stringify(value));
  } catch {
    // Translation still works when storage is unavailable.
  }
}

async function translateChunk(texts, target) {
  if (target === "ko" || !texts.length) return texts;
  const protectedTexts = texts.map((text) => text.replaceAll("Menu Roulette Rush", BRAND_PLACEHOLDER));
  const endpoint = new URL("https://translate.googleapis.com/translate_a/single");
  endpoint.searchParams.set("client", "gtx");
  endpoint.searchParams.set("sl", "ko");
  endpoint.searchParams.set("tl", translationLanguage(target));
  endpoint.searchParams.set("dt", "t");
  endpoint.searchParams.set("q", protectedTexts.join(TRANSLATION_SEPARATOR));
  const response = await fetch(endpoint);
  if (!response.ok) throw new Error(`Site translation failed: ${response.status}`);
  const payload = await response.json();
  const translated = payload[0].map((part) => part[0]).join("");
  const parts = translated.split(/\s*\[\[\[MENU_RUSH_SITE_SPLIT\]\]\]\s*/);
  if (parts.length !== texts.length) {
    if (texts.length === 1) {
      return [translated.trim().replaceAll(BRAND_PLACEHOLDER, "Menu Roulette Rush")];
    }
    return Promise.all(
      texts.map(async (text) => (await translateChunk([text], target))[0]),
    );
  }
  return parts.map((part) => part.trim().replaceAll(BRAND_PLACEHOLDER, "Menu Roulette Rush"));
}

async function translateTexts(texts, target) {
  if (target === "ko") return texts;
  const cache = cacheRead(target);
  const unique = [...new Set(texts)];
  const missing = unique.filter((text) => !cache[text]);
  const chunks = [];
  let chunk = [];
  let length = 0;
  for (const text of missing) {
    const nextLength = length + text.length + TRANSLATION_SEPARATOR.length;
    if (chunk.length && nextLength > 1300) {
      chunks.push(chunk);
      chunk = [];
      length = 0;
    }
    chunk.push(text);
    length += text.length + TRANSLATION_SEPARATOR.length;
  }
  if (chunk.length) chunks.push(chunk);
  const translatedChunks = await Promise.all(chunks.map((items) => translateChunk(items, target)));
  chunks.forEach((items, chunkIndex) => {
    items.forEach((source, itemIndex) => {
      cache[source] = translatedChunks[chunkIndex][itemIndex];
    });
  });
  cacheWrite(target, cache);
  return texts.map((text) => cache[text] || text);
}

function homeTranslationRoots() {
  return [
    ...document.querySelectorAll(".editorial-section, .footer-links, #infoDrawer"),
    infoElements.trigger,
  ].filter(Boolean);
}

function collectTranslationTargets() {
  const isHome = Boolean(document.querySelector("#languageSelect"));
  const roots = isHome ? homeTranslationRoots() : [document.body];
  const textTargets = [];
  const attributeTargets = [];
  const excluded = ".brand, .info-brand, script, style, noscript, [data-no-translate], [data-i18n], #tagCloudScene, #mealControls, #countryPicker, #slotMachine, #imageGrid";

  for (const root of roots) {
    const elements = [root, ...root.querySelectorAll("*")].filter((element) => !element.matches(excluded) && !element.closest(excluded));
    for (const element of elements) {
      for (const node of element.childNodes) {
        if (node.nodeType !== Node.TEXT_NODE) continue;
        const text = node.textContent.trim();
        if (!originalText.has(node) && !/[가-힣]/.test(text)) continue;
        if (!originalText.has(node)) originalText.set(node, text);
        textTargets.push({ node, source: originalText.get(node) });
      }
      const names = ["placeholder", "title", "aria-label", "data-loading", "data-success", "data-error", "data-unavailable"];
      for (const name of names) {
        const value = element.getAttribute?.(name)?.trim();
        const savedSources = originalAttributes.get(element);
        if (!value || (!savedSources?.[name] && !/[가-힣]/.test(value))) continue;
        if (!originalAttributes.has(element)) originalAttributes.set(element, {});
        const sources = originalAttributes.get(element);
        if (!sources[name]) sources[name] = value;
        attributeTargets.push({ element, name, source: sources[name] });
      }
    }
  }
  return { textTargets, attributeTargets };
}

async function localizeSiteContent(language, country = visitorCountry) {
  const target = SITE_LANGUAGES.has(language) ? language : "en";
  activeSiteLanguage = target;
  if (infoLanguageSelect) infoLanguageSelect.value = target;
  document.documentElement.lang = target;
  document.documentElement.dir = ["ar", "he"].includes(target) ? "rtl" : "ltr";
  document.documentElement.setAttribute("aria-busy", "true");

  try {
    for (const element of document.querySelectorAll("[data-jurisdiction-notice]")) {
      let region = country;
      try {
        region = new Intl.DisplayNames(["ko"], { type: "region" }).of(country) || country;
      } catch {
        region = country;
      }
      element.textContent = country
        ? `이 안내는 ${region}에서 적용되는 관련 법령과 이용자 권리를 함께 고려해 해석됩니다. 지역에 따라 열람, 정정, 삭제, 처리 제한 또는 동의 철회 권리가 달라질 수 있습니다.`
        : "이 안내는 이용자의 지역에서 적용되는 관련 법령과 이용자 권리를 함께 고려해 해석됩니다. 지역에 따라 개인정보 관련 권리가 달라질 수 있습니다.";
    }

    const { textTargets, attributeTargets } = collectTranslationTargets();
    const titleSource = document.documentElement.dataset.sourceTitle || document.title;
    const descriptionElement = document.querySelector('meta[name="description"]');
    const descriptionSource = document.documentElement.dataset.sourceDescription || descriptionElement?.content || "";
    document.documentElement.dataset.sourceTitle = titleSource;
    if (descriptionElement) document.documentElement.dataset.sourceDescription = descriptionSource;

    const sources = [
      ...textTargets.map((item) => item.source),
      ...attributeTargets.map((item) => item.source),
      ...(document.querySelector("#languageSelect") ? [] : [titleSource, descriptionSource].filter((text) => /[가-힣]/.test(text))),
    ];
    const translated = await translateTexts(sources, target);
    let index = 0;
    textTargets.forEach((item) => { item.node.textContent = target === "ko" ? item.source : translated[index++]; });
    attributeTargets.forEach((item) => { item.element.setAttribute(item.name, target === "ko" ? item.source : translated[index++]); });
    if (!document.querySelector("#languageSelect")) {
      if (/[가-힣]/.test(titleSource)) document.title = target === "ko" ? titleSource : translated[index++];
      if (descriptionElement && /[가-힣]/.test(descriptionSource)) {
        descriptionElement.content = target === "ko" ? descriptionSource : translated[index++];
      }
    }
  } finally {
    document.documentElement.removeAttribute("aria-busy");
  }
}

window.addEventListener("menu-rush-language-change", (event) => {
  localizeSiteContent(event.detail?.lang || browserLanguage()).catch((error) => console.warn("Static content translation unavailable.", error));
});

detectSiteLocale()
  .then(async (language) => {
    try {
      await localizeSiteContent(language);
    } finally {
      trackAnonymousPageView();
    }
  })
  .catch((error) => console.warn("Site localization unavailable.", error));

function openInfoDrawer() {
  if (!infoElements.drawer) return;
  infoElements.overlay.hidden = false;
  infoElements.drawer.hidden = false;
  requestAnimationFrame(() => {
    infoElements.overlay.classList.add("is-open");
    infoElements.drawer.classList.add("is-open");
  });
  infoElements.trigger?.setAttribute("aria-expanded", "true");
  document.body.classList.add("info-lock");
  infoElements.close?.focus();
}

function closeInfoDrawer() {
  if (!infoElements.drawer) return;
  infoElements.overlay.classList.remove("is-open");
  infoElements.drawer.classList.remove("is-open");
  infoElements.trigger?.setAttribute("aria-expanded", "false");
  document.body.classList.remove("info-lock");
  window.setTimeout(() => {
    infoElements.overlay.hidden = true;
    infoElements.drawer.hidden = true;
  }, 200);
}

infoElements.trigger?.addEventListener("click", () => {
  if (infoElements.drawer.classList.contains("is-open")) closeInfoDrawer();
  else openInfoDrawer();
});
infoElements.close?.addEventListener("click", closeInfoDrawer);
infoElements.overlay?.addEventListener("click", closeInfoDrawer);
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") closeInfoDrawer();
});

const contactForm = document.querySelector("#contactForm");
contactForm?.addEventListener("submit", async (event) => {
  event.preventDefault();
  const config = window.MENU_RUSH_CONTACT || {};
  const data = new FormData(contactForm);
  const submitButton = contactForm.querySelector("button[type='submit']");
  const status = document.querySelector("#contactStatus");

  if (!config.endpoint || !config.serviceId) {
    status.textContent = status.dataset.unavailable;
    status.dataset.state = "error";
    return;
  }

  submitButton.disabled = true;
  status.textContent = status.dataset.loading;
  status.dataset.state = "loading";
  try {
    const response = await fetch(config.endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        serviceId: config.serviceId,
        serviceName: config.serviceName || document.title,
        pageUrl: window.location.href,
        category: data.get("category"),
        name: data.get("name"),
        email: data.get("email"),
        subject: data.get("subject"),
        message: data.get("message"),
        website: data.get("website"),
      }),
    });
    const result = await response.json().catch(() => ({}));
    if (!response.ok || result.ok !== true) {
      throw new Error(`Contact request failed: ${response.status} ${result.code || ""}`.trim());
    }
    contactForm.reset();
    status.textContent = status.dataset.success;
    status.dataset.state = "success";
  } catch (error) {
    console.warn("Contact submission failed.", error);
    status.textContent = status.dataset.error;
    status.dataset.state = "error";
  } finally {
    submitButton.disabled = false;
  }
});

async function trackAnonymousPageView() {
  if (location.pathname.startsWith("/admin") || navigator.doNotTrack === "1") return;
  let visitorId = "";
  try {
    visitorId = localStorage.getItem("menu-rush-visitor-id") || crypto.randomUUID();
    localStorage.setItem("menu-rush-visitor-id", visitorId);
  } catch {
    visitorId = crypto.randomUUID();
  }

  const culture = new URLSearchParams(location.search).get("country")
    || document.querySelector(".country-option[aria-checked='true']")?.dataset.culture
    || "";
  let referrer = "";
  try {
    referrer = document.referrer ? new URL(document.referrer).hostname : "";
  } catch {
    referrer = "";
  }
  fetch("/api/analytics/collect", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      visitorId,
      path: location.pathname,
      referrer,
      language: document.documentElement.lang,
      culture,
    }),
    keepalive: true,
  }).catch(() => {
    // Analytics must never interrupt the menu experience.
  });
}
})();
