const LANGUAGE_BY_COUNTRY = {
  KR: "ko", US: "en", JP: "ja", CN: "zh", ES: "es", FR: "fr", DE: "de", GB: "en",
  IN: "hi", ID: "id", VN: "vi", TH: "th", IT: "it", PT: "pt", MX: "es", BR: "pt",
  TR: "tr", GR: "el", CA: "en", AU: "en", NZ: "en", SG: "en", MY: "ms", PH: "tl",
  RU: "ru", UA: "uk", PL: "pl", NL: "nl", BE: "nl", SE: "sv", NO: "no", DK: "da",
  SA: "ar", AE: "ar", IL: "he", EG: "ar", MA: "ar", ZA: "en", AR: "es", PE: "es",
};

const SHARE_COPY = {
  ko: { title: "오늘 뭐 먹지?", result: "추천 메뉴는 {dish}입니다.", fallback: "40개 국가의 식사 문화와 현지 메뉴에서 오늘의 메뉴를 골라보세요." },
  en: { title: "What should I eat today?", result: "The recommended menu is {dish}.", fallback: "Pick today's meal from dining cultures and local menus across 40 countries." },
  ja: { title: "今日は何を食べよう？", result: "おすすめメニューは「{dish}」です。", fallback: "40か国の食文化と現地メニューから、今日の一品を選びましょう。" },
  zh: { title: "今天吃什么？", result: "推荐菜单是{dish}。", fallback: "从40个国家的饮食文化和当地菜单中选择今天的一餐。" },
  es: { title: "¿Qué como hoy?", result: "El menú recomendado es {dish}.", fallback: "Elige tu comida de hoy entre culturas gastronómicas y menús locales de 40 países." },
  fr: { title: "Qu'est-ce qu'on mange aujourd'hui ?", result: "Le menu recommandé est {dish}.", fallback: "Choisissez le repas du jour parmi les cultures culinaires et les menus locaux de 40 pays." },
  de: { title: "Was soll ich heute essen?", result: "Das empfohlene Gericht ist {dish}.", fallback: "Wähle dein heutiges Essen aus Esskulturen und lokalen Gerichten aus 40 Ländern." },
  pt: { title: "O que vou comer hoje?", result: "O menu recomendado é {dish}.", fallback: "Escolha a refeição de hoje entre culturas e menus locais de 40 países." },
  it: { title: "Cosa mangio oggi?", result: "Il menu consigliato è {dish}.", fallback: "Scegli il pasto di oggi tra culture gastronomiche e menu locali di 40 paesi." },
  ru: { title: "Что сегодня поесть?", result: "Рекомендуемое блюдо: {dish}.", fallback: "Выберите блюдо на сегодня из местных меню и культур питания 40 стран." },
  ar: { title: "ماذا آكل اليوم؟", result: "الطبق المقترح هو {dish}.", fallback: "اختر وجبة اليوم من ثقافات الطعام والقوائم المحلية في 40 دولة." },
  hi: { title: "आज क्या खाऊँ?", result: "सुझाया गया मेनू {dish} है।", fallback: "40 देशों की भोजन संस्कृतियों और स्थानीय मेनू में से आज का भोजन चुनें।" },
  id: { title: "Makan apa hari ini?", result: "Menu yang direkomendasikan adalah {dish}.", fallback: "Pilih makanan hari ini dari budaya makan dan menu lokal 40 negara." },
  vi: { title: "Hôm nay ăn gì?", result: "Món được đề xuất là {dish}.", fallback: "Chọn món hôm nay từ văn hóa ẩm thực và thực đơn địa phương của 40 quốc gia." },
  th: { title: "วันนี้กินอะไรดี?", result: "เมนูแนะนำคือ {dish}", fallback: "เลือกอาหารวันนี้จากวัฒนธรรมและเมนูท้องถิ่นของ 40 ประเทศ" },
  tr: { title: "Bugün ne yesem?", result: "Önerilen menü: {dish}.", fallback: "Bugünün yemeğini 40 ülkenin yemek kültürü ve yerel menülerinden seçin." },
  el: { title: "Τι να φάω σήμερα;", result: "Το προτεινόμενο μενού είναι {dish}.", fallback: "Διαλέξτε το σημερινό γεύμα από κουλτούρες και τοπικά μενού 40 χωρών." },
  ms: { title: "Nak makan apa hari ini?", result: "Menu yang disyorkan ialah {dish}.", fallback: "Pilih hidangan hari ini daripada budaya dan menu tempatan 40 negara." },
  tl: { title: "Ano ang kakainin ko ngayon?", result: "Ang inirerekomendang menu ay {dish}.", fallback: "Pumili ng pagkain mula sa kultura at lokal na menu ng 40 bansa." },
  uk: { title: "Що сьогодні поїсти?", result: "Рекомендована страва: {dish}.", fallback: "Оберіть сьогоднішню страву з місцевих меню та культур харчування 40 країн." },
  pl: { title: "Co dziś zjeść?", result: "Polecane danie to {dish}.", fallback: "Wybierz dzisiejszy posiłek spośród kultur i lokalnych menu 40 krajów." },
  nl: { title: "Wat zal ik vandaag eten?", result: "Het aanbevolen gerecht is {dish}.", fallback: "Kies je maaltijd uit eetculturen en lokale menu's van 40 landen." },
  sv: { title: "Vad ska jag äta idag?", result: "Den rekommenderade rätten är {dish}.", fallback: "Välj dagens måltid bland matkulturer och lokala menyer från 40 länder." },
  no: { title: "Hva skal jeg spise i dag?", result: "Den anbefalte retten er {dish}.", fallback: "Velg dagens måltid blant matkulturer og lokale menyer fra 40 land." },
  da: { title: "Hvad skal jeg spise i dag?", result: "Den anbefalede ret er {dish}.", fallback: "Vælg dagens måltid blandt madkulturer og lokale menuer fra 40 lande." },
  he: { title: "מה לאכול היום?", result: "המנה המומלצת היא {dish}.", fallback: "בחרו את הארוחה של היום מתרבויות ותפריטים מקומיים של 40 מדינות." },
};

function escapeHtml(value) {
  return String(value || "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

export function onRequestGet({ request }) {
  const url = new URL(request.url);
  const requestedLanguage = url.searchParams.get("lang")?.toLowerCase();
  const country = String(url.searchParams.get("country") || request.cf?.country || "").toUpperCase();
  const language = SHARE_COPY[requestedLanguage]
    ? requestedLanguage
    : LANGUAGE_BY_COUNTRY[country] || "en";
  const copy = SHARE_COPY[language];
  const dish = String(url.searchParams.get("label") || url.searchParams.get("dish") || "").slice(0, 120);
  const description = dish ? copy.result.replace("{dish}", dish) : copy.fallback;
  const destination = new URL("/", url.origin);
  ["country", "meal", "dish"].forEach((key) => {
    const value = url.searchParams.get(key);
    if (value) destination.searchParams.set(key, value);
  });
  destination.searchParams.set("lang", language);
  const image = `${url.origin}/share-images/share-${language}.jpg?v=20260611`;
  const title = `${copy.title} | Menu Roulette Rush`;

  return new Response(`<!doctype html>
<html lang="${escapeHtml(language)}">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${escapeHtml(title)}</title>
  <meta name="description" content="${escapeHtml(description)}">
  <meta name="robots" content="noindex, follow">
  <meta property="og:type" content="website">
  <meta property="og:site_name" content="Menu Roulette Rush">
  <meta property="og:title" content="${escapeHtml(title)}">
  <meta property="og:description" content="${escapeHtml(description)}">
  <meta property="og:url" content="${escapeHtml(url.toString())}">
  <meta property="og:image" content="${escapeHtml(image)}">
  <meta property="og:image:secure_url" content="${escapeHtml(image)}">
  <meta property="og:image:type" content="image/jpeg">
  <meta property="og:image:width" content="1200">
  <meta property="og:image:height" content="630">
  <meta property="og:image:alt" content="${escapeHtml(copy.title)} - Menu Roulette Rush">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${escapeHtml(title)}">
  <meta name="twitter:description" content="${escapeHtml(description)}">
  <meta name="twitter:image" content="${escapeHtml(image)}">
  <meta name="twitter:image:alt" content="${escapeHtml(copy.title)} - Menu Roulette Rush">
  <meta http-equiv="refresh" content="0;url=${escapeHtml(destination.toString())}">
</head>
<body>
  <p><a href="${escapeHtml(destination.toString())}">Menu Roulette Rush</a></p>
  <script>location.replace(${JSON.stringify(destination.toString())});</script>
</body>
</html>`, {
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      "Cache-Control": "public, max-age=300",
    },
  });
}
