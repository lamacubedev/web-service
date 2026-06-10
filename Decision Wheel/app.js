const SUPPORTED_LANGUAGES = [
  ["ko", "한국어"], ["en", "English"], ["ja", "日本語"], ["zh", "中文"],
  ["es", "Español"], ["fr", "Français"], ["de", "Deutsch"], ["pt", "Português"],
  ["it", "Italiano"], ["ru", "Русский"], ["ar", "العربية"], ["hi", "हिन्दी"],
  ["id", "Bahasa Indonesia"], ["vi", "Tiếng Việt"], ["th", "ไทย"], ["tr", "Türkçe"],
  ["el", "Ελληνικά"], ["ms", "Bahasa Melayu"], ["tl", "Filipino"], ["uk", "Українська"],
  ["pl", "Polski"], ["nl", "Nederlands"], ["sv", "Svenska"], ["no", "Norsk"],
  ["da", "Dansk"], ["he", "עברית"],
];

const MEAL_LABELS = {
  ko: { auto: "자동", all: "전체", breakfast: "아침", brunch: "브런치", lunch: "점심", snack: "간식", tea: "티타임", dinner: "저녁", tapas: "타파스", supper: "가벼운 저녁", lateNight: "야식" },
  en: { auto: "Auto", all: "All", breakfast: "Breakfast", brunch: "Brunch", lunch: "Lunch", snack: "Snack", tea: "Tea", dinner: "Dinner", tapas: "Tapas", supper: "Supper", lateNight: "Late night" },
  ja: { auto: "自動", all: "すべて", breakfast: "朝食", brunch: "ブランチ", lunch: "昼食", snack: "軽食", tea: "ティー", dinner: "夕食", lateNight: "深夜食" },
  zh: { auto: "自动", all: "全部", breakfast: "早餐", brunch: "早午餐", lunch: "午餐", snack: "点心", tea: "下午茶", dinner: "晚餐", lateNight: "夜宵" },
  es: { auto: "Auto", all: "Todo", breakfast: "Desayuno", brunch: "Brunch", lunch: "Comida", snack: "Merienda", tea: "Té", dinner: "Cena", lateNight: "Madrugada" },
  fr: { auto: "Auto", all: "Tout", breakfast: "Petit-déjeuner", brunch: "Brunch", lunch: "Déjeuner", snack: "Goûter", tea: "Thé", dinner: "Dîner", lateNight: "Nuit" },
  de: { auto: "Auto", all: "Alle", breakfast: "Frühstück", brunch: "Brunch", lunch: "Mittag", snack: "Snack", tea: "Teezeit", dinner: "Abendessen", supper: "Abendbrot", lateNight: "Spät" },
  pt: { auto: "Auto", all: "Tudo", breakfast: "Café da manhã", brunch: "Brunch", lunch: "Almoço", snack: "Lanche", tea: "Chá", dinner: "Jantar", lateNight: "Madrugada" },
  it: { auto: "Auto", all: "Tutto", breakfast: "Colazione", brunch: "Brunch", lunch: "Pranzo", snack: "Spuntino", tea: "Tè", dinner: "Cena", lateNight: "Notte" },
  ru: { auto: "Авто", all: "Все", breakfast: "Завтрак", brunch: "Бранч", lunch: "Обед", snack: "Перекус", tea: "Чай", dinner: "Ужин", supper: "Легкий ужин", lateNight: "Ночь" },
  ar: { auto: "تلقائي", all: "الكل", breakfast: "فطور", brunch: "برانش", lunch: "غداء", snack: "وجبة خفيفة", tea: "شاي", dinner: "عشاء", supper: "عشاء خفيف", lateNight: "آخر الليل" },
  hi: { auto: "ऑटो", all: "सभी", breakfast: "नाश्ता", brunch: "ब्रंच", lunch: "दोपहर", snack: "स्नैक", tea: "चाय", dinner: "रात का खाना", lateNight: "देर रात" },
  id: { auto: "Otomatis", all: "Semua", breakfast: "Sarapan", brunch: "Brunch", lunch: "Makan siang", snack: "Camilan", tea: "Teh", dinner: "Makan malam", lateNight: "Larut malam" },
  vi: { auto: "Tự động", all: "Tất cả", breakfast: "Bữa sáng", brunch: "Brunch", lunch: "Bữa trưa", snack: "Ăn nhẹ", tea: "Trà", dinner: "Bữa tối", lateNight: "Đêm muộn" },
  th: { auto: "อัตโนมัติ", all: "ทั้งหมด", breakfast: "มื้อเช้า", brunch: "บรันช์", lunch: "มื้อกลางวัน", snack: "ของว่าง", tea: "น้ำชา", dinner: "มื้อเย็น", lateNight: "ดึก" },
};

const COPY = {
  ko: {
    brand: "Menu Rush", navHow: "기능 소개", navAbout: "사이트 소개", navPrivacy: "개인정보처리방침", languageLabel: "언어",
    heroTitle: "오늘 뭐 먹지?",
    heroDescription: "선택한 나라의 현지 음식과 식사 시간을 반영해 지금 먹기 좋은 메뉴를 추천합니다. 직접 식사 시간을 고르거나 모든 메뉴를 한 번에 섞을 수도 있습니다.",
    spinButton: "추천 시작", shuffleButton: "메뉴 섞기", resultLabel: "추천 메뉴", mealMode: "식사 시간", countryProfile: "식사 문화 기준",
    shareButton: "결과 공유", copyButton: "링크 복사", shareSuccess: "공유 메뉴를 열었습니다.", copySuccess: "링크와 추천 결과를 복사했습니다.", sharePrompt: "오늘 뭐 먹지? Menu Rush가 {dish}을(를) 골랐어요!",
    howEyebrow: "기능", howTitle: "음식 선택을 빠르고 가볍게", feature1Title: "시간대 기반 추천", feature1Text: "브라우저의 시간대 정보를 활용해 현재 시각에 어울리는 식사 구간을 자동으로 선택합니다.",
    feature2Title: "40개 국가별 현지 메뉴", feature2Text: "국가를 바꾸면 식사 시간뿐 아니라 추천 후보도 해당 지역의 대표 음식으로 즉시 변경됩니다.",
    feature3Title: "직접 선택과 전체 보기", feature3Text: "원하는 식사 시간만 고르거나 전체 메뉴를 섞어 더 넓은 후보에서 추천받을 수 있습니다.",
    aboutEyebrow: "소개", aboutTitle: "사이트 소개",
    aboutText1: "이 웹사이트는 매일 반복되는 메뉴 고민을 줄이기 위해 만든 슬롯형 음식 추천 도구입니다. 별도의 가입이나 앱 설치 없이 바로 사용할 수 있습니다.",
    aboutText2: "추천 결과는 일반적인 식사 시간, 지역별 식문화, 메뉴 후보 목록을 바탕으로 무작위 생성됩니다. 실제 영업 여부, 알레르기, 건강 상태, 종교적 식단 제한과 개인 선호도는 사용자가 확인해야 합니다.",
    privacyEyebrow: "개인정보", privacyTitle: "개인정보처리방침",
    privacyText1: "본 사이트는 회원가입, 이름, 이메일, 전화번호 등 직접 식별 가능한 개인정보를 요구하지 않습니다. 언어, 시간대, 현지 시각 정보는 사용자의 기기 안에서 메뉴 추천을 위해 처리됩니다. 번역 요청에는 공개된 화면 문구와 메뉴명만 포함되며 개인 식별 정보는 포함되지 않습니다.",
    privacyText2: "향후 Google AdSense, Google Analytics 또는 유사한 제3자 서비스가 도입될 수 있습니다. 이 경우 쿠키 또는 광고 식별자가 사용될 수 있으며 브라우저 설정에서 제한하거나 삭제할 수 있습니다.",
    privacyText3: "본 사이트는 Cloudflare Pages와 같은 정적 호스팅 환경에서 제공될 수 있습니다. 호스팅 사업자는 보안과 오류 대응을 위해 표준 서버 로그를 처리할 수 있습니다.",
    footer: "Menu Rush는 간단한 참고용 메뉴 추천 도구입니다.", footerPrivacy: "개인정보처리방침",
    insight: "{time} 기준 {meal} 메뉴입니다.", region: "{region} 식사 문화 기준", ready: "준비", running: "선택 중", done: "결정", candidateCount: "메뉴 {count}개",
    imageEyebrow: "이미지 검색", imageTitle: "추천 메뉴 이미지", imageProviders: "Unsplash + Pexels", imageEmpty: "메뉴가 결정되면 관련 이미지가 표시됩니다.", imageLoading: "Unsplash와 Pexels에서 메뉴 이미지를 검색하고 있습니다.", imageUnavailable: "Unsplash 또는 Pexels API 설정이 필요합니다.", imageError: "이미지를 불러오지 못했습니다.",
  },
  en: {
    brand: "Menu Rush", navHow: "Features", navAbout: "About", navPrivacy: "Privacy", languageLabel: "Language",
    heroTitle: "What should I eat today?",
    heroDescription: "Menu Rush uses the selected country's local foods and meal schedule to suggest what fits now. Choose a meal period or mix every menu.",
    spinButton: "Start recommendation", shuffleButton: "Shuffle menus", resultLabel: "Recommendation", mealMode: "Meal time", countryProfile: "Dining culture",
    shareButton: "Share result", copyButton: "Copy link", shareSuccess: "The share menu is open.", copySuccess: "Link and result copied.", sharePrompt: "What should I eat today? Menu Rush picked {dish}!",
    howEyebrow: "Feature", howTitle: "A faster way to decide food", feature1Title: "Time-aware picks", feature1Text: "Browser time-zone information automatically selects a suitable meal period.",
    feature2Title: "Local menus from 40 countries", feature2Text: "Changing the country instantly changes both meal times and candidates to representative local foods.",
    feature3Title: "Manual or all-in mode", feature3Text: "Choose one meal period or mix every menu for a broader recommendation.",
    aboutEyebrow: "About", aboutTitle: "About this site", aboutText1: "This is a slot-style food suggestion tool designed to reduce everyday menu indecision. No account or installation is required.",
    aboutText2: "Results are randomly generated from general meal times, regional food culture, and menu lists. Please check opening hours, allergies, health needs, dietary restrictions, and preferences.",
    privacyEyebrow: "Privacy", privacyTitle: "Privacy Policy", privacyText1: "This site does not request directly identifiable personal data. Language, time zone, and local time are processed on your device. Translation requests contain only public interface text and food names, never personal identifiers.",
    privacyText2: "Google AdSense, Google Analytics, or similar services may be added later and may use cookies or advertising identifiers.",
    privacyText3: "This site may be hosted on Cloudflare Pages. Hosting providers may process standard server logs for security and reliability.",
    footer: "Menu Rush is a lightweight food suggestion tool.", footerPrivacy: "Privacy Policy",
    insight: "{meal} picks for {time}.", region: "{region} dining culture", ready: "READY", running: "PICKING", done: "SELECTED", candidateCount: "{count} menus",
    imageEyebrow: "Image search", imageTitle: "Recommended menu images", imageProviders: "Unsplash + Pexels", imageEmpty: "Related images appear after a menu is selected.", imageLoading: "Searching Unsplash and Pexels for menu images.", imageUnavailable: "Unsplash or Pexels API configuration is required.", imageError: "Images could not be loaded.",
  },
};

const SHORT_COPY = {
  ja: ["メニュー開始", "候補を混ぜる", "食事時間", "食文化", "今日、何を食べよう？"],
  zh: ["开始选择", "重新混合", "用餐时段", "饮食文化", "今天吃什么？"],
  es: ["Iniciar", "Mezclar", "Momento", "Cultura gastronómica", "¿Qué como hoy?"],
  fr: ["Démarrer", "Mélanger", "Moment du repas", "Culture alimentaire", "Qu'est-ce qu'on mange aujourd'hui ?"],
  de: ["Starten", "Neu mischen", "Mahlzeit", "Esskultur", "Was soll ich heute essen?"],
  pt: ["Iniciar", "Misturar", "Refeição", "Cultura alimentar", "O que vou comer hoje?"],
  it: ["Avvia", "Mescola", "Pasto", "Cultura alimentare", "Cosa mangio oggi?"],
  ru: ["Запустить", "Перемешать", "Прием пищи", "Пищевая культура", "Что сегодня поесть?"],
  ar: ["ابدأ", "خلط", "وقت الوجبة", "الثقافة الغذائية", "ماذا آكل اليوم؟"],
  hi: ["शुरू करें", "विकल्प मिलाएँ", "भोजन समय", "भोजन संस्कृति", "आज क्या खाऊँ?"],
  id: ["Mulai", "Acak opsi", "Waktu makan", "Budaya makan", "Makan apa hari ini?"],
  vi: ["Bắt đầu", "Trộn lựa chọn", "Thời điểm ăn", "Văn hóa ăn uống", "Hôm nay ăn gì?"],
  th: ["เริ่ม", "สลับตัวเลือก", "ช่วงมื้อ", "วัฒนธรรมการกิน", "วันนี้กินอะไรดี?"],
  tr: ["Başlat", "Karıştır", "Öğün zamanı", "Yemek kültürü", "Bugün ne yesem?"],
  el: ["Έναρξη", "Ανάμιξη", "Ώρα γεύματος", "Διατροφική κουλτούρα", "Τι να φάω σήμερα;"],
  ms: ["Mula", "Kocok pilihan", "Waktu makan", "Budaya makan", "Nak makan apa hari ini?"],
  tl: ["Simulan", "Paghaluin", "Oras ng pagkain", "Kultura ng pagkain", "Ano ang kakainin ko ngayon?"],
  uk: ["Запустити", "Перемішати", "Час їжі", "Культура харчування", "Що сьогодні поїсти?"],
  pl: ["Uruchom", "Wymieszaj", "Pora posiłku", "Kultura jedzenia", "Co dziś zjeść?"],
  nl: ["Start", "Opnieuw mixen", "Maaltijd", "Eetcultuur", "Wat zal ik vandaag eten?"],
  sv: ["Starta", "Blanda", "Måltid", "Matkultur", "Vad ska jag äta idag?"],
  no: ["Start", "Bland", "Måltid", "Matkultur", "Hva skal jeg spise i dag?"],
  da: ["Start", "Bland", "Måltid", "Madkultur", "Hvad skal jeg spise i dag?"],
  he: ["התחלה", "ערבוב", "זמן ארוחה", "תרבות אוכל", "מה לאכול היום?"],
};

for (const [lang, values] of Object.entries(SHORT_COPY)) {
  COPY[lang] = {
    ...COPY.en,
    spinButton: values[0],
    shuffleButton: values[1],
    mealMode: values[2],
    countryProfile: values[3],
    heroTitle: values[4],
  };
}

const state = {
  lang: detectLanguage(),
  culture: detectCulture(),
  mealMode: "auto",
  items: [],
  running: false,
  languageRequest: 0,
};

const DISH_TRANSLATIONS = {
  en: {
    "전복죽": "Abalone porridge", "토스트와 달걀": "Toast and eggs", "비빔밥": "Bibimbap", "김치찌개": "Kimchi stew",
    "냉면": "Cold noodles", "떡볶이": "Spicy rice cakes", "김밥": "Gimbap", "삼겹살": "Grilled pork belly",
    "불고기": "Bulgogi", "라면": "Korean ramen", "콩나물국밥": "Bean sprout soup with rice", "길거리 토스트": "Korean street toast",
    "제육볶음": "Spicy stir-fried pork", "순두부찌개": "Soft tofu stew", "칼국수": "Knife-cut noodles", "붕어빵": "Fish-shaped pastry",
    "호떡": "Sweet filled pancake", "닭갈비": "Spicy stir-fried chicken", "갈비탕": "Short rib soup", "족발": "Braised pig's trotters",
    "焼き鮭定食": "Grilled salmon set", "おにぎり": "Rice ball", "ラーメン": "Ramen", "カツ丼": "Pork cutlet rice bowl",
    "うどん": "Udon", "たい焼き": "Fish-shaped cake", "たこ焼き": "Takoyaki", "寿司": "Sushi", "すき焼き": "Sukiyaki",
    "焼き鳥": "Yakitori", "納豆ご飯": "Natto rice", "卵焼き": "Rolled omelet", "天丼": "Tempura rice bowl",
    "親子丼": "Chicken and egg rice bowl", "そば": "Soba", "団子": "Dango", "今川焼き": "Filled griddle cake",
    "しゃぶしゃぶ": "Shabu-shabu", "お好み焼き": "Okonomiyaki", "餃子": "Gyoza",
    "豆浆油条": "Soy milk and fried dough", "小笼包": "Soup dumplings", "兰州拉面": "Lanzhou noodles", "麻婆豆腐": "Mapo tofu",
    "炒饭": "Fried rice", "煎饼果子": "Chinese breakfast crepe", "糖葫芦": "Candied fruit skewers", "北京烤鸭": "Peking duck",
    "火锅": "Hot pot", "烤串": "Grilled skewers", "粥": "Rice porridge", "包子": "Steamed buns", "担担面": "Dan dan noodles",
    "宫保鸡丁": "Kung pao chicken", "水饺": "Boiled dumplings", "月饼": "Mooncake", "肉夹馍": "Chinese pork sandwich",
    "红烧肉": "Red-braised pork", "酸菜鱼": "Fish with pickled mustard greens", "螺蛳粉": "Luosifen noodles",
  },
  ko: {
    Pancakes: "팬케이크", "Bagel & eggs": "베이글과 달걀", Cheeseburger: "치즈버거", "Mac and cheese": "맥앤치즈",
    "BBQ ribs": "바비큐 립", "Apple pie": "애플파이", "Buffalo wings": "버펄로 윙", Steak: "스테이크",
    "Fried chicken": "프라이드치킨", Pizza: "피자", Waffles: "와플", "Breakfast burrito": "브렉퍼스트 부리토",
    "Club sandwich": "클럽 샌드위치", "Clam chowder": "클램 차우더", "Pulled pork": "풀드 포크", Brownie: "브라우니",
    "Corn dog": "콘도그", Meatloaf: "미트로프", "Lobster roll": "랍스터 롤", "Philly cheesesteak": "필리 치즈스테이크",
    "焼き鮭定食": "구운 연어 정식", "おにぎり": "주먹밥", "ラーメン": "라멘", "カツ丼": "가쓰동", "うどん": "우동",
    "たい焼き": "타이야키", "たこ焼き": "타코야키", "寿司": "스시", "すき焼き": "스키야키", "焼き鳥": "야키토리",
    "納豆ご飯": "낫토밥", "卵焼き": "달걀말이", "天丼": "텐동", "親子丼": "오야코동", "そば": "소바", "団子": "당고",
    "今川焼き": "이마가와야키", "しゃぶしゃぶ": "샤부샤부", "お好み焼き": "오코노미야키", "餃子": "교자",
    "豆浆油条": "두유와 유탸오", "小笼包": "샤오롱바오", "兰州拉面": "란저우 라몐", "麻婆豆腐": "마파두부",
    "炒饭": "볶음밥", "煎饼果子": "젠빙궈쯔", "糖葫芦": "탕후루", "北京烤鸭": "베이징 덕", "火锅": "훠궈",
    "烤串": "꼬치구이", "粥": "죽", "包子": "바오쯔", "担担面": "탄탄면", "宫保鸡丁": "궁바오지딩",
    "水饺": "물만두", "月饼": "월병", "肉夹馍": "로우자모", "红烧肉": "홍샤오러우", "酸菜鱼": "쏸차이위", "螺蛳粉": "뤄쓰펀",
  },
};

const TRANSLATION_CACHE_VERSION = "v5";
const TRANSLATION_SEPARATOR = "\n[[[MENU_RUSH_SPLIT]]]\n";
const API_LANGUAGE_CODES = { zh: "zh-CN", he: "iw" };
const dishTranslationsByLocale = new Map();

function translationLanguage(code) {
  return API_LANGUAGE_CODES[code] || code;
}

function cacheRead(key) {
  try {
    return JSON.parse(localStorage.getItem(`${TRANSLATION_CACHE_VERSION}:${key}`));
  } catch {
    return null;
  }
}

function cacheWrite(key, value) {
  try {
    localStorage.setItem(`${TRANSLATION_CACHE_VERSION}:${key}`, JSON.stringify(value));
  } catch {
    // The site still works when browser storage is disabled.
  }
}

async function translateBatch(texts, source, target) {
  if (source === target || !texts.length) return texts;
  const endpoint = new URL("https://translate.googleapis.com/translate_a/single");
  endpoint.searchParams.set("client", "gtx");
  endpoint.searchParams.set("sl", translationLanguage(source));
  endpoint.searchParams.set("tl", translationLanguage(target));
  endpoint.searchParams.set("dt", "t");
  endpoint.searchParams.set("q", texts.join(TRANSLATION_SEPARATOR));
  const response = await fetch(endpoint);
  if (!response.ok) throw new Error(`Translation request failed: ${response.status}`);
  const payload = await response.json();
  const translated = payload[0].map((part) => part[0]).join("");
  const parts = translated.split(/\s*\[\[\[MENU_RUSH_SPLIT\]\]\]\s*/);
  if (parts.length !== texts.length) throw new Error("Translation response could not be separated.");
  return parts.map((part) => part.trim());
}

async function ensureInterfaceTranslations(lang) {
  if (lang === "ko" || lang === "en") return;
  const keys = Object.keys(COPY.en).filter((key) => key !== "brand");
  const cached = cacheRead(`ui:${lang}`);
  if (cached && keys.every((key) => cached[key])) {
    COPY[lang] = { ...cached, brand: "Menu Rush" };
  } else {
    const translated = await translateBatch(keys.map((key) => COPY.en[key]), "en", lang);
    COPY[lang] = Object.fromEntries(keys.map((key, index) => [key, translated[index]]));
    COPY[lang].brand = "Menu Rush";
    cacheWrite(`ui:${lang}`, COPY[lang]);
  }
  await ensureMealTranslations(lang);
}

async function ensureMealTranslations(lang) {
  const keys = Object.keys(MEAL_LABELS.en);
  if (MEAL_LABELS[lang] && keys.every((key) => MEAL_LABELS[lang][key])) return;
  const cached = cacheRead(`meals:${lang}`);
  if (cached && keys.every((key) => cached[key])) {
    MEAL_LABELS[lang] = cached;
    return;
  }
  const translated = await translateBatch(keys.map((key) => MEAL_LABELS.en[key]), "en", lang);
  MEAL_LABELS[lang] = Object.fromEntries(keys.map((key, index) => [key, translated[index]]));
  cacheWrite(`meals:${lang}`, MEAL_LABELS[lang]);
}

async function ensureDishTranslations(cultureCode, lang) {
  const culture = CULTURES[cultureCode];
  const source = culture.languages[0];
  const mapKey = `${cultureCode}:${lang}`;
  if (source === lang) {
    dishTranslationsByLocale.set(mapKey, Object.fromEntries(culture.dishes.map((dish) => [dish, dish])));
    return;
  }
  if (dishTranslationsByLocale.has(mapKey)) return;
  const cached = cacheRead(`dishes:${mapKey}`);
  if (cached && culture.dishes.every((dish) => cached[dish])) {
    dishTranslationsByLocale.set(mapKey, cached);
    return;
  }
  const englishCacheKey = `dishes:${cultureCode}:en`;
  let englishNames = cacheRead(englishCacheKey);
  if (!englishNames || !culture.dishes.every((dish) => englishNames[dish])) {
    const detectedEnglish = source === "en"
      ? culture.dishes
      : await translateBatch(culture.dishes, "auto", "en");
    englishNames = Object.fromEntries(culture.dishes.map((dish, index) => [
      dish,
      DISH_TRANSLATIONS.en?.[dish] || detectedEnglish[index],
    ]));
    cacheWrite(englishCacheKey, englishNames);
  }
  if (lang === "en") {
    dishTranslationsByLocale.set(mapKey, englishNames);
    return;
  }
  const translated = await translateBatch(culture.dishes.map((dish) => englishNames[dish]), "en", lang);
  const localized = Object.fromEntries(culture.dishes.map((dish, index) => [
    dish,
    DISH_TRANSLATIONS[lang]?.[dish] || translated[index],
  ]));
  dishTranslationsByLocale.set(mapKey, localized);
  cacheWrite(`dishes:${mapKey}`, localized);
}

const elements = {
  languageSelect: document.querySelector("#languageSelect"),
  mealControls: document.querySelector("#mealControls"),
  resultText: document.querySelector("#resultText"),
  timeInsight: document.querySelector("#timeInsight"),
  detectedRegion: document.querySelector("#detectedRegion"),
  machine: document.querySelector("#slotMachine"),
  machineCountry: document.querySelector("#machineCountry"),
  machineStatus: document.querySelector("#machineStatus"),
  previous2: document.querySelector("#slotPrevious2"),
  previous: document.querySelector("#slotPrevious"),
  current: document.querySelector("#slotCurrent"),
  next: document.querySelector("#slotNext"),
  next2: document.querySelector("#slotNext2"),
  countryPicker: document.querySelector("#countryPicker"),
  countryTrigger: document.querySelector("#countryTrigger"),
  countryTriggerLabel: document.querySelector("#countryTriggerLabel"),
  countryMenu: document.querySelector("#countryMenu"),
  countryGrid: document.querySelector("#countryGrid"),
  spinButton: document.querySelector("#spinButton"),
  shuffleButton: document.querySelector("#shuffleButton"),
  shareButton: document.querySelector("#shareButton"),
  copyButton: document.querySelector("#copyButton"),
  shareFeedback: document.querySelector("#shareFeedback"),
  tagCloudScene: document.querySelector("#tagCloudScene"),
  imageGrid: document.querySelector("#imageGrid"),
  imageStatus: document.querySelector("#imageStatus"),
};

const tagCloud = {
  nodes: [],
  pointerX: -10000,
  pointerY: -10000,
  rotation: 0,
  frame: 0,
};


function detectCulture() {
  const localeRegion = (navigator.language || "").split("-")[1]?.toUpperCase();
  const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone || "";
  return REGION_TO_CULTURE[localeRegion] || TIMEZONE_TO_CULTURE.find(([zone]) => zone === timezone)?.[1] || "US";
}

function detectLanguage() {
  const browserLanguage = (navigator.language || "en").split("-")[0].toLowerCase();
  return SUPPORTED_LANGUAGES.some(([code]) => code === browserLanguage) ? browserLanguage : "en";
}

function t(key, params = {}) {
  let value = COPY[state.lang]?.[key] || COPY.en[key] || key;
  for (const [param, replacement] of Object.entries(params)) {
    value = value.replace(new RegExp(`\\{${param}\\}`, "gi"), replacement);
  }
  return value;
}

function mealLabel(key) {
  return MEAL_LABELS[state.lang]?.[key] || MEAL_LABELS.en[key] || key;
}

function getCurrentMeal() {
  const culture = CULTURES[state.culture];
  const hourText = new Intl.DateTimeFormat("en-US", {
    timeZone: culture.timezone,
    hour: "numeric",
    hourCycle: "h23",
  }).format(new Date());
  const hour = Number(hourText);
  return culture.meals.find(([, start, end]) => start < end ? hour >= start && hour < end : hour >= start || hour < end)?.[0] || "lunch";
}

function getActiveMealKeys() {
  if (state.mealMode === "all") return Object.keys(CULTURES[state.culture].menus);
  if (state.mealMode === "auto") return Object.keys(CULTURES[state.culture].menus);
  return [state.mealMode];
}

function shuffle(items) {
  return items
    .map((item) => [Math.random(), item])
    .sort((a, b) => a[0] - b[0])
    .map(([, item]) => item);
}

function buildItems({ preserveResult = false } = {}) {
  const culture = CULTURES[state.culture];
  const useAllMenus = state.mealMode === "auto" || state.mealMode === "all";
  const pool = useAllMenus ? culture.dishes : getActiveMealKeys().flatMap((key) => culture.menus[key] || []);
  const allMenus = uniqueDishes(culture.dishes);
  state.items = shuffle(uniqueDishes(pool.length ? pool : allMenus));
  elements.machine.dataset.candidateCount = String(state.items.length);
  elements.machine.dataset.uniqueCandidateCount = String(uniqueDishes(state.items).length);
  if (!preserveResult) {
    elements.resultText.textContent = "-";
    elements.resultText.removeAttribute("data-dish");
    elements.shareButton.disabled = true;
  }
  elements.shareFeedback.textContent = "";
  if (!preserveResult) {
    clearImageResults();
  }
  renderSlotPreview();
  renderTagCloud();
  updateInsight();
}

function uniqueDishes(items) {
  const unique = new Map();
  for (const item of items) {
    const key = item.normalize("NFKC").trim().toLocaleLowerCase();
    if (!unique.has(key)) unique.set(key, item.trim());
  }
  return [...unique.values()];
}

function displayDish(dish) {
  const cultureLanguage = CULTURES[state.culture].languages[0];
  if (state.lang === cultureLanguage) return dish;
  const localized = dishTranslationsByLocale.get(`${state.culture}:${state.lang}`);
  return localized?.[dish] || DISH_TRANSLATIONS[state.lang]?.[dish] || DISH_TRANSLATIONS.en?.[dish] || dish;
}

function localizedCountryName(code) {
  try {
    return new Intl.DisplayNames([state.lang], { type: "region" }).of(code) || CULTURES[code].name;
  } catch {
    return CULTURES[code].name;
  }
}

function fitText(element) {
  if (!element || !element.clientWidth) return;
  element.style.fontSize = "";
  const maximum = Number.parseFloat(getComputedStyle(element).fontSize);
  const minimum = Number(element.dataset.fitMin || 14);
  let size = maximum;
  while (element.scrollWidth > element.clientWidth && size > minimum) {
    size -= 1;
    element.style.fontSize = `${size}px`;
  }
}

function fitVisibleText() {
  requestAnimationFrame(() => {
    document.querySelectorAll("[data-fit-text]").forEach(fitText);
  });
}

function renderSlotPreview() {
  const items = state.items.length ? state.items : Object.values(CULTURES[state.culture].menus).flat();
  const fallback = items[0] || "-";
  elements.previous2.textContent = displayDish(items[0] || fallback);
  elements.previous.textContent = displayDish(items[1] || fallback);
  elements.current.textContent = displayDish(items[2] || fallback);
  elements.next.textContent = displayDish(items[3] || fallback);
  elements.next2.textContent = displayDish(items[4] || fallback);
  const culture = CULTURES[state.culture];
  elements.machineCountry.textContent = `${culture.flag} ${localizedCountryName(state.culture)}`;
  elements.machineStatus.textContent = `${t("ready")} · ${t("candidateCount", { count: state.items.length })}`;
  fitVisibleText();
}

function renderTagCloud() {
  elements.tagCloudScene.innerHTML = "";
  tagCloud.nodes = CULTURES[state.culture].dishes.map((dish, index, dishes) => {
    const item = document.createElement("span");
    item.className = "tag-cloud-item";
    item.textContent = displayDish(dish);
    elements.tagCloudScene.appendChild(item);

    const offset = 2 / dishes.length;
    const y = (index * offset - 1) + offset / 2;
    const radius = Math.sqrt(1 - y * y);
    const angle = index * Math.PI * (3 - Math.sqrt(5));
    return {
      element: item,
      x: Math.cos(angle) * radius,
      y,
      z: Math.sin(angle) * radius,
      repelX: 0,
      repelY: 0,
    };
  });
}

function animateTagCloud() {
  const sceneRect = elements.tagCloudScene.getBoundingClientRect();
  const sphereRadius = Math.min(sceneRect.width * 0.42, sceneRect.height * 0.58, 520);
  const centerX = sceneRect.width / 2;
  const centerY = sceneRect.height / 2;
  tagCloud.rotation += 0.00065;
  const sin = Math.sin(tagCloud.rotation);
  const cos = Math.cos(tagCloud.rotation);

  for (const node of tagCloud.nodes) {
    const rotatedX = node.x * cos - node.z * sin;
    const rotatedZ = node.x * sin + node.z * cos;
    const depth = (rotatedZ + 1) / 2;
    const scale = 0.72 + depth * 0.55;
    const projectedX = centerX + rotatedX * sphereRadius;
    const projectedY = centerY + node.y * sphereRadius * 0.72;
    const screenX = sceneRect.left + projectedX;
    const screenY = sceneRect.top + projectedY;
    const dx = screenX - tagCloud.pointerX;
    const dy = screenY - tagCloud.pointerY;
    const distance = Math.hypot(dx, dy);
    const force = distance < 135 ? Math.pow((135 - distance) / 135, 2) * 3.5 : 0;
    if (force > 0 && distance > 0) {
      node.repelX += (dx / distance) * force;
      node.repelY += (dy / distance) * force;
    }
    node.repelX = Math.max(-22, Math.min(22, node.repelX));
    node.repelY = Math.max(-22, Math.min(22, node.repelY));
    node.repelX *= 0.86;
    node.repelY *= 0.86;
    node.element.style.transform = `translate3d(${projectedX + node.repelX}px, ${projectedY + node.repelY}px, 0) translate(-50%, -50%) scale(${scale})`;
    node.element.style.opacity = String(0.035 + depth * 0.075);
    node.element.style.zIndex = String(Math.round(depth * 10));
  }
  tagCloud.frame = requestAnimationFrame(animateTagCloud);
}

function clearImageResults(messageKey = "imageEmpty") {
  elements.imageGrid.innerHTML = "";
  elements.imageGrid.classList.remove("is-loading");
  elements.imageStatus.textContent = t(messageKey);
}

async function searchMenuImages(rawDish) {
  const query = displayDish(rawDish).trim();
  const config = window.MENU_RUSH_IMAGE_SEARCH || {};
  if (!config.proxyEndpoint) {
    clearImageResults("imageUnavailable");
    return;
  }

  elements.imageGrid.innerHTML = "";
  elements.imageGrid.classList.add("is-loading");
  elements.imageStatus.textContent = t("imageLoading");
  try {
    const endpoint = new URL(config.proxyEndpoint, window.location.href);
    endpoint.searchParams.set("q", query);
    endpoint.searchParams.set("hl", state.lang);
    endpoint.searchParams.set("gl", state.culture.toLowerCase());
    const response = await fetch(endpoint);
    if (!response.ok) {
      if (response.status === 404 || response.status === 503) {
        clearImageResults("imageUnavailable");
        return;
      }
      throw new Error(`Image search failed: ${response.status}`);
    }
    const payload = await response.json();
    const images = (payload.items || []).slice(0, 10);
    elements.imageGrid.classList.remove("is-loading");
    elements.imageGrid.innerHTML = "";
    for (const image of images) {
      const link = document.createElement("a");
      link.className = "image-result-link";
      link.href = image.sourceUrl || image.image?.contextLink || image.link;
      link.target = "_blank";
      link.rel = "noopener noreferrer";
      link.title = image.title || displayDish(rawDish);
      const img = document.createElement("img");
      img.src = image.thumbnailUrl || image.image?.thumbnailLink || image.link;
      img.alt = image.title || displayDish(rawDish);
      img.loading = "lazy";
      img.referrerPolicy = "no-referrer";
      link.appendChild(img);
      const provider = document.createElement("span");
      provider.className = "image-provider-badge";
      provider.textContent = [image.provider, image.photographer].filter(Boolean).join(" · ");
      link.appendChild(provider);
      elements.imageGrid.appendChild(link);
    }
    const unavailableProviders = Object.entries(payload.providers || {})
      .filter(([, provider]) => provider.configured && provider.count === 0)
      .map(([name, provider]) => provider.status && provider.status !== 200
        ? `${name} (${provider.status})`
        : `${name}: 0`);
    elements.imageStatus.textContent = images.length
      ? unavailableProviders.length ? `${unavailableProviders.join(", ")}: 0` : ""
      : t("imageError");
  } catch (error) {
    console.warn("Stock image search unavailable.", error);
    clearImageResults("imageError");
  }
}

function renderLanguageSelect() {
  elements.languageSelect.innerHTML = "";
  for (const [code, label] of SUPPORTED_LANGUAGES) {
    const option = document.createElement("option");
    option.value = code;
    option.textContent = label;
    elements.languageSelect.appendChild(option);
  }
  elements.languageSelect.value = state.lang;
}

function renderCountryPicker() {
  const selected = CULTURES[state.culture];
  elements.countryTriggerLabel.textContent = `${selected.flag} ${localizedCountryName(state.culture)}`;
  elements.countryGrid.innerHTML = "";

  for (const [code, culture] of Object.entries(CULTURES)) {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "country-option";
    button.dataset.culture = code;
    button.setAttribute("role", "radio");
    button.setAttribute("aria-checked", String(code === state.culture));
    button.innerHTML = `
      <span class="country-flag" aria-hidden="true">${culture.flag}</span>
      <span class="country-name"><strong>${localizedCountryName(code)}</strong><small>${code}</small></span>
    `;
    button.addEventListener("click", () => selectCulture(code));
    elements.countryGrid.appendChild(button);
  }
}

async function selectCulture(code) {
  if (state.running) return;
  state.culture = code;
  state.mealMode = "auto";
  closeCountryMenu();
  renderCountryPicker();
  renderMealControls();
  buildItems();
  await translateCurrentCulture();
}

function renderMealControls() {
  const meals = ["auto", ...new Set(CULTURES[state.culture].meals.map(([key]) => key)), "all"];
  elements.mealControls.innerHTML = "";
  for (const meal of meals) {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "segment-button";
    button.dataset.meal = meal;
    button.setAttribute("aria-pressed", String(meal === state.mealMode));
    button.textContent = mealLabel(meal);
    button.addEventListener("click", () => {
      if (state.running) return;
      state.mealMode = meal;
      renderMealControls();
      buildItems();
    });
    elements.mealControls.appendChild(button);
  }
}

function updateInsight() {
  const culture = CULTURES[state.culture];
  const meal = state.mealMode === "auto" ? getCurrentMeal() : state.mealMode;
  const time = new Intl.DateTimeFormat(state.lang, {
    timeZone: culture.timezone,
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date());
  elements.timeInsight.textContent = t("insight", { time, meal: mealLabel(meal) });
  elements.detectedRegion.textContent = t("region", { region: localizedCountryName(state.culture) });
}

function setSlotTexts(centerIndex) {
  const items = state.items;
  const length = items.length;
  elements.previous2.textContent = displayDish(items[(centerIndex - 2 + length) % length]);
  elements.previous.textContent = displayDish(items[(centerIndex - 1 + length) % length]);
  elements.current.textContent = displayDish(items[centerIndex % length]);
  elements.next.textContent = displayDish(items[(centerIndex + 1) % length]);
  elements.next2.textContent = displayDish(items[(centerIndex + 2) % length]);
  const reels = [elements.previous2, elements.previous, elements.current, elements.next, elements.next2];
  for (const reel of reels) {
    reel.classList.add("is-ticking");
  }
  fitVisibleText();
  requestAnimationFrame(() => {
    for (const reel of reels) {
      reel.classList.remove("is-ticking");
    }
  });
}

async function runMenuMachine() {
  if (state.running || !state.items.length) return;
  await translateCurrentCulture();
  state.running = true;
  elements.machine.classList.add("is-running");
  elements.spinButton.disabled = true;
  elements.shuffleButton.disabled = true;
  elements.machineStatus.textContent = t("running");
  elements.resultText.textContent = "-";

  const winnerIndex = Math.floor(Math.random() * state.items.length);
  const duration = 2500;
  const start = performance.now();
  let visibleIndex = 0;
  let lastTick = 0;

  function animate(now) {
    const elapsed = now - start;
    const progress = Math.min(elapsed / duration, 1);
    const interval = 55 + Math.pow(progress, 3) * 260;
    if (now - lastTick >= interval) {
      visibleIndex = (visibleIndex + 1) % state.items.length;
      setSlotTexts(visibleIndex);
      lastTick = now;
    }
    if (progress < 1) {
      requestAnimationFrame(animate);
      return;
    }
    setSlotTexts(winnerIndex);
    const winningDish = state.items[winnerIndex];
    elements.resultText.textContent = displayDish(winningDish);
    elements.resultText.dataset.dish = winningDish;
    fitVisibleText();
    elements.shareButton.disabled = false;
    searchMenuImages(winningDish);
    elements.machineStatus.textContent = t("done");
    elements.machine.classList.remove("is-running");
    elements.spinButton.disabled = false;
    elements.shuffleButton.disabled = false;
    state.running = false;
  }

  requestAnimationFrame(animate);
}

function openCountryMenu() {
  elements.countryMenu.hidden = false;
  elements.countryTrigger.setAttribute("aria-expanded", "true");
}

function closeCountryMenu() {
  elements.countryMenu.hidden = true;
  elements.countryTrigger.setAttribute("aria-expanded", "false");
}

function applyTranslations() {
  document.documentElement.lang = state.lang;
  document.documentElement.dir = ["ar", "he"].includes(state.lang) ? "rtl" : "ltr";
  document.querySelectorAll("[data-i18n]").forEach((element) => {
    element.textContent = t(element.dataset.i18n);
  });
  document.title = `${t("heroTitle")} | Menu Rush`;
  renderMealControls();
  renderCountryPicker();
  if (elements.resultText.dataset.dish) {
    elements.resultText.textContent = displayDish(elements.resultText.dataset.dish);
    searchMenuImages(elements.resultText.dataset.dish);
  } else {
    renderSlotPreview();
  }
  renderTagCloud();
  updateInsight();
  fitVisibleText();
}

async function translateCurrentCulture() {
  if (CULTURES[state.culture].languages[0] === state.lang) {
    renderSlotPreview();
    return;
  }
  const request = state.languageRequest;
  elements.machine.setAttribute("aria-busy", "true");
  try {
    await ensureDishTranslations(state.culture, state.lang);
    if (request !== state.languageRequest) return;
    renderSlotPreview();
    renderTagCloud();
    if (elements.resultText.dataset.dish) {
      elements.resultText.textContent = displayDish(elements.resultText.dataset.dish);
      fitVisibleText();
    }
  } catch (error) {
    console.warn("Menu translation unavailable.", error);
  } finally {
    elements.machine.removeAttribute("aria-busy");
  }
}

async function setLanguage(lang) {
  const request = ++state.languageRequest;
  document.documentElement.setAttribute("aria-busy", "true");
  elements.languageSelect.disabled = true;
  try {
    await ensureInterfaceTranslations(lang);
    if (request !== state.languageRequest) return;
    state.lang = lang;
    await ensureMealTranslations(lang);
    applyTranslations();
    await translateCurrentCulture();
  } catch (error) {
    console.warn("Interface translation unavailable.", error);
    state.lang = lang;
    applyTranslations();
    await translateCurrentCulture();
  } finally {
    if (request === state.languageRequest) {
      elements.languageSelect.disabled = false;
      document.documentElement.removeAttribute("aria-busy");
    }
  }
}

function buildShareData() {
  const rawDish = elements.resultText.dataset.dish;
  const dish = rawDish ? displayDish(rawDish) : "";
  const url = new URL(window.location.href);
  url.search = "";
  url.searchParams.set("country", state.culture);
  url.searchParams.set("meal", state.mealMode);
  if (rawDish) url.searchParams.set("dish", rawDish);
  return {
    title: t("heroTitle"),
    text: t("sharePrompt", { dish }),
    url: url.toString(),
  };
}

async function shareResult() {
  const data = buildShareData();
  try {
    if (navigator.share) {
      await navigator.share(data);
      elements.shareFeedback.textContent = t("shareSuccess");
      return;
    }
    await navigator.clipboard.writeText(`${data.text}\n${data.url}`);
    elements.shareFeedback.textContent = t("copySuccess");
  } catch (error) {
    if (error.name !== "AbortError") await copyShareLink();
  }
}

async function copyShareLink() {
  const data = buildShareData();
  await navigator.clipboard.writeText(`${data.text}\n${data.url}`);
  elements.shareFeedback.textContent = t("copySuccess");
}

function applySharedState() {
  const params = new URLSearchParams(window.location.search);
  const country = params.get("country");
  const meal = params.get("meal");
  const dish = params.get("dish");
  if (country && CULTURES[country]) state.culture = country;
  if (meal) state.mealMode = meal;
  if (dish && CULTURES[state.culture].dishes.includes(dish)) {
    elements.resultText.textContent = displayDish(dish);
    elements.resultText.dataset.dish = dish;
    elements.shareButton.disabled = false;
    fitVisibleText();
  }
}

async function init() {
  renderLanguageSelect();
  applySharedState();
  await ensureInterfaceTranslations(state.lang).catch((error) => console.warn("Initial translation unavailable.", error));
  await ensureMealTranslations(state.lang).catch((error) => console.warn("Meal translation unavailable.", error));
  applyTranslations();
  buildItems({ preserveResult: Boolean(elements.resultText.dataset.dish) });
  await translateCurrentCulture();
  if (elements.resultText.dataset.dish) searchMenuImages(elements.resultText.dataset.dish);
  if (!tagCloud.frame) tagCloud.frame = requestAnimationFrame(animateTagCloud);

  elements.languageSelect.addEventListener("change", async (event) => {
    await setLanguage(event.target.value);
  });
  elements.countryTrigger.addEventListener("click", () => {
    elements.countryMenu.hidden ? openCountryMenu() : closeCountryMenu();
  });
  document.addEventListener("click", (event) => {
    if (!elements.countryPicker.contains(event.target)) closeCountryMenu();
  });
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeCountryMenu();
  });
  elements.spinButton.addEventListener("click", runMenuMachine);
  elements.shuffleButton.addEventListener("click", () => buildItems());
  elements.shareButton.addEventListener("click", shareResult);
  elements.copyButton.addEventListener("click", copyShareLink);
  window.addEventListener("pointermove", (event) => {
    tagCloud.pointerX = event.clientX;
    tagCloud.pointerY = event.clientY;
  }, { passive: true });
  window.addEventListener("pointerleave", () => {
    tagCloud.pointerX = -10000;
    tagCloud.pointerY = -10000;
  });
  window.addEventListener("resize", fitVisibleText, { passive: true });
}

init();
