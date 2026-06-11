const MEAL_SCHEDULES = {
  standard: [["breakfast", 5, 10], ["lunch", 10, 15], ["snack", 15, 17], ["dinner", 17, 21], ["lateNight", 21, 5]],
  late: [["breakfast", 6, 11], ["brunch", 11, 14], ["lunch", 14, 17], ["snack", 17, 20], ["dinner", 20, 24], ["lateNight", 0, 6]],
  early: [["breakfast", 5, 9], ["lunch", 10, 14], ["tea", 14, 17], ["dinner", 17, 20], ["supper", 20, 5]],
  tea: [["breakfast", 5, 10], ["lunch", 10, 14], ["tea", 14, 18], ["dinner", 18, 22], ["lateNight", 22, 5]],
};

const BREAKFAST_WORDS = [
  "breakfast", "toast", "egg", "pancake", "waffle", "porridge", "cereal", "bagel", "croissant", "brioche",
  "omelette", "omelet", "yogurt", "muesli", "idli", "dosa", "poha", "congee", "죽", "토스트", "달걀", "계란",
  "粥", "豆浆", "油条", "朝", "納豆", "卵", "syrniki", "kasha", "kahvalt", "menemen",
];
const SWEET_WORDS = [
  "cake", "pie", "tart", "cookie", "biscuit", "pudding", "ice cream", "gelato", "chocolate", "candy", "sweet",
  "dessert", "donut", "doughnut", "pastry", "waffle", "churro", "macaron", "brownie", "flan", "baklava",
  "kunafa", "halva", "pavlova", "빙수", "붕어빵", "호떡", "과자", "케이크", "떡", "糖", "糕", "甜",
  "団子", "焼き", "餅", "tiram", "cannoli", "strudel", "kueh", "kuih",
];
const LIGHT_WORDS = [
  "sandwich", "burger", "pizza", "taco", "wrap", "roll", "dumpling", "noodle", "ramen", "udon", "soba",
  "fried", "fries", "wings", "kebab", "shawarma", "falafel", "hotdog", "sausage", "snack", "street",
  "김밥", "라면", "국수", "만두", "떡볶이", "치킨", "순대", "전", "튀김", "面", "粉", "饺", "包", "串",
  "麺", "丼", "餃子", "焼き鳥", "takoyaki", "samosa", "pakora", "empanada", "croquette", "börek",
];
const CAFFEINE_WORDS = [
  "coffee", "café", "cafe", "espresso", "cappuccino", "latte", "flat white", "kopi", "tea", "chai", "matcha",
  "커피", "카페", "차", "咖啡", "茶", "قهوة", "شاي",
];

function includesAny(value, words) {
  return words.some((word) => value.includes(word));
}

function categorizeDishes(dishes) {
  const menus = {
    breakfast: [], brunch: [], lunch: [], snack: [], tea: [],
    dinner: [], tapas: [], supper: [], lateNight: [],
  };

  dishes.forEach((dish, index) => {
    const value = dish.normalize("NFKC").toLocaleLowerCase();
    const breakfast = includesAny(value, BREAKFAST_WORDS) || [0, 1, 10, 11].includes(index);
    const sweet = includesAny(value, SWEET_WORDS);
    const light = includesAny(value, LIGHT_WORDS);
    const caffeine = includesAny(value, CAFFEINE_WORDS);
    const savory = !sweet && !caffeine;

    if (breakfast || caffeine) menus.breakfast.push(dish);
    if (breakfast || light || sweet) menus.brunch.push(dish);
    if (savory) menus.lunch.push(dish);
    if (sweet || light || caffeine) menus.snack.push(dish);
    if (sweet || caffeine) menus.tea.push(dish);
    if (savory && !breakfast) menus.dinner.push(dish);
    if ((light || sweet) && !caffeine) menus.tapas.push(dish);
    if (savory && !breakfast) menus.supper.push(dish);
    if (light && savory && !caffeine) menus.lateNight.push(dish);
  });

  for (const [key, items] of Object.entries(menus)) {
    if (!items.length) menus[key] = dishes.slice(0, Math.min(12, dishes.length));
  }
  return menus;
}

// Dish order: breakfast 2, lunch 3, snack 2, dinner 3, then 10 extra dishes.
function createCulture({ name, nativeName, language, timezone, flag, schedule = "standard", dishes }) {
  return {
    name,
    nativeName,
    languages: [language],
    timezone,
    flag,
    meals: MEAL_SCHEDULES[schedule],
    dishes,
    menus: categorizeDishes(dishes),
  };
}

const CULTURES = {
  KR: createCulture({ name: "South Korea", nativeName: "대한민국", language: "ko", timezone: "Asia/Seoul", flag: "🇰🇷", dishes: ["전복죽", "토스트와 달걀", "비빔밥", "김치찌개", "냉면", "떡볶이", "김밥", "삼겹살", "불고기", "라면"] }),
  US: createCulture({ name: "United States", nativeName: "United States", language: "en", timezone: "America/New_York", flag: "🇺🇸", dishes: ["Pancakes", "Bagel & eggs", "Cheeseburger", "Mac and cheese", "BBQ ribs", "Apple pie", "Buffalo wings", "Steak", "Fried chicken", "Pizza"] }),
  JP: createCulture({ name: "Japan", nativeName: "日本", language: "ja", timezone: "Asia/Tokyo", flag: "🇯🇵", dishes: ["焼き鮭定食", "おにぎり", "ラーメン", "カツ丼", "うどん", "たい焼き", "たこ焼き", "寿司", "すき焼き", "焼き鳥"] }),
  CN: createCulture({ name: "China", nativeName: "中国", language: "zh", timezone: "Asia/Shanghai", flag: "🇨🇳", dishes: ["豆浆油条", "小笼包", "兰州拉面", "麻婆豆腐", "炒饭", "煎饼果子", "糖葫芦", "北京烤鸭", "火锅", "烤串"] }),
  ES: createCulture({ name: "Spain", nativeName: "España", language: "es", timezone: "Europe/Madrid", flag: "🇪🇸", schedule: "late", dishes: ["Pan con tomate", "Tortilla española", "Paella", "Cocido madrileño", "Bocadillo", "Churros", "Croquetas", "Gambas al ajillo", "Pulpo a la gallega", "Patatas bravas"] }),
  FR: createCulture({ name: "France", nativeName: "France", language: "fr", timezone: "Europe/Paris", flag: "🇫🇷", dishes: ["Croissant", "Pain au chocolat", "Croque monsieur", "Quiche lorraine", "Salade niçoise", "Crêpe", "Macaron", "Boeuf bourguignon", "Ratatouille", "Soupe à l'oignon"] }),
  DE: createCulture({ name: "Germany", nativeName: "Deutschland", language: "de", timezone: "Europe/Berlin", flag: "🇩🇪", schedule: "early", dishes: ["Brötchen", "Müsli", "Currywurst", "Schnitzel", "Kartoffelsalat", "Brezel", "Apfelstrudel", "Sauerbraten", "Bratwurst", "Döner kebab"] }),
  GB: createCulture({ name: "United Kingdom", nativeName: "United Kingdom", language: "en", timezone: "Europe/London", flag: "🇬🇧", schedule: "tea", dishes: ["Full English", "Porridge", "Fish and chips", "Shepherd's pie", "Cornish pasty", "Scones", "Tea sandwich", "Sunday roast", "Chicken tikka masala", "Kebab"] }),
  IN: createCulture({ name: "India", nativeName: "भारत", language: "hi", timezone: "Asia/Kolkata", flag: "🇮🇳", schedule: "tea", dishes: ["Masala dosa", "Poha", "Biryani", "Thali", "Chole bhature", "Samosa", "Jalebi", "Butter chicken", "Palak paneer", "Pav bhaji"] }),
  ID: createCulture({ name: "Indonesia", nativeName: "Indonesia", language: "id", timezone: "Asia/Jakarta", flag: "🇮🇩", dishes: ["Bubur ayam", "Nasi uduk", "Nasi goreng", "Soto ayam", "Gado-gado", "Pisang goreng", "Martabak", "Rendang", "Sate ayam", "Mie goreng"] }),
  VN: createCulture({ name: "Vietnam", nativeName: "Việt Nam", language: "vi", timezone: "Asia/Ho_Chi_Minh", flag: "🇻🇳", dishes: ["Phở", "Bánh mì", "Bún chả", "Cơm tấm", "Bánh xèo", "Gỏi cuốn", "Chè", "Bò kho", "Cá kho tộ", "Hủ tiếu"] }),
  TH: createCulture({ name: "Thailand", nativeName: "ประเทศไทย", language: "th", timezone: "Asia/Bangkok", flag: "🇹🇭", dishes: ["Jok", "Khao tom", "Pad thai", "Khao pad", "Som tam", "Mango sticky rice", "Moo ping", "Tom yum", "Green curry", "Pad kra pao"] }),
  IT: createCulture({ name: "Italy", nativeName: "Italia", language: "it", timezone: "Europe/Rome", flag: "🇮🇹", schedule: "late", dishes: ["Cornetto", "Frittata", "Panini", "Risotto", "Lasagna", "Gelato", "Arancini", "Pizza margherita", "Carbonara", "Piadina"] }),
  PT: createCulture({ name: "Portugal", nativeName: "Portugal", language: "pt", timezone: "Europe/Lisbon", flag: "🇵🇹", schedule: "late", dishes: ["Pastel de nata", "Torrada", "Bifana", "Caldo verde", "Bacalhau", "Croquete", "Queijada", "Francesinha", "Arroz de marisco", "Prego"] }),
  MX: createCulture({ name: "Mexico", nativeName: "México", language: "es", timezone: "America/Mexico_City", flag: "🇲🇽", dishes: ["Chilaquiles", "Huevos rancheros", "Tacos al pastor", "Pozole", "Enchiladas", "Elote", "Churros", "Mole poblano", "Birria", "Quesadilla"] }),
  BR: createCulture({ name: "Brazil", nativeName: "Brasil", language: "pt", timezone: "America/Sao_Paulo", flag: "🇧🇷", dishes: ["Pão de queijo", "Açaí bowl", "Feijoada", "Moqueca", "Prato feito", "Coxinha", "Brigadeiro", "Churrasco", "Bobó de camarão", "Pastel"] }),
  TR: createCulture({ name: "Türkiye", nativeName: "Türkiye", language: "tr", timezone: "Europe/Istanbul", flag: "🇹🇷", schedule: "late", dishes: ["Menemen", "Simit", "Döner", "Pide", "Mantı", "Baklava", "Börek", "İskender kebap", "Köfte", "Lahmacun"] }),
  GR: createCulture({ name: "Greece", nativeName: "Ελλάδα", language: "el", timezone: "Europe/Athens", flag: "🇬🇷", schedule: "late", dishes: ["Bougatsa", "Greek yogurt", "Gyros", "Souvlaki", "Moussaka", "Spanakopita", "Loukoumades", "Pastitsio", "Gemista", "Koulouri"] }),
  CA: createCulture({ name: "Canada", nativeName: "Canada", language: "en", timezone: "America/Toronto", flag: "🇨🇦", dishes: ["Maple pancakes", "Montreal bagel", "Poutine", "Peameal sandwich", "Tourtière", "Butter tart", "Nanaimo bar", "Smoked meat", "Salmon", "Donair"] }),
  AU: createCulture({ name: "Australia", nativeName: "Australia", language: "en", timezone: "Australia/Sydney", flag: "🇦🇺", dishes: ["Avocado toast", "Vegemite toast", "Meat pie", "Chicken parmigiana", "Barramundi", "Lamington", "Sausage roll", "Grilled steak", "Fish and chips", "HSP"] }),
  NZ: createCulture({ name: "New Zealand", nativeName: "Aotearoa", language: "en", timezone: "Pacific/Auckland", flag: "🇳🇿", dishes: ["Eggs benedict", "Marmite toast", "Mince pie", "Green-lipped mussels", "Hāngi", "Pavlova", "Cheese roll", "Lamb roast", "Fish and chips", "Whitebait fritter"] }),
  SG: createCulture({ name: "Singapore", nativeName: "Singapore", language: "en", timezone: "Asia/Singapore", flag: "🇸🇬", dishes: ["Kaya toast", "Chwee kueh", "Hainanese chicken rice", "Laksa", "Char kway teow", "Curry puff", "Ice kacang", "Chilli crab", "Bak kut teh", "Satay"] }),
  MY: createCulture({ name: "Malaysia", nativeName: "Malaysia", language: "ms", timezone: "Asia/Kuala_Lumpur", flag: "🇲🇾", dishes: ["Nasi lemak", "Roti canai", "Char kuey teow", "Curry laksa", "Nasi kandar", "Kuih", "Pisang goreng", "Beef rendang", "Hokkien mee", "Satay"] }),
  PH: createCulture({ name: "Philippines", nativeName: "Pilipinas", language: "tl", timezone: "Asia/Manila", flag: "🇵🇭", dishes: ["Tapsilog", "Champorado", "Chicken adobo", "Sinigang", "Pancit", "Turon", "Halo-halo", "Lechon", "Kare-kare", "Sisig"] }),
  RU: createCulture({ name: "Russia", nativeName: "Россия", language: "ru", timezone: "Europe/Moscow", flag: "🇷🇺", schedule: "early", dishes: ["Syrniki", "Kasha", "Borscht", "Pelmeni", "Beef stroganoff", "Pirozhki", "Blini", "Shashlik", "Golubtsy", "Solyanka"] }),
  UA: createCulture({ name: "Ukraine", nativeName: "Україна", language: "uk", timezone: "Europe/Kyiv", flag: "🇺🇦", schedule: "early", dishes: ["Syrnyky", "Deruny", "Borshch", "Varenyky", "Holubtsi", "Pampushky", "Nalysnyky", "Chicken Kyiv", "Banosh", "Kholodets"] }),
  PL: createCulture({ name: "Poland", nativeName: "Polska", language: "pl", timezone: "Europe/Warsaw", flag: "🇵🇱", schedule: "early", dishes: ["Jajecznica", "Kanapki", "Pierogi", "Żurek", "Bigos", "Pączki", "Zapiekanka", "Kotlet schabowy", "Gołąbki", "Kiełbasa"] }),
  NL: createCulture({ name: "Netherlands", nativeName: "Nederland", language: "nl", timezone: "Europe/Amsterdam", flag: "🇳🇱", schedule: "early", dishes: ["Ontbijtkoek", "Uitsmijter", "Broodje kroket", "Erwtensoep", "Stamppot", "Stroopwafel", "Bitterballen", "Haring", "Kibbeling", "Kapsalon"] }),
  BE: createCulture({ name: "Belgium", nativeName: "België", language: "nl", timezone: "Europe/Brussels", flag: "🇧🇪", schedule: "tea", dishes: ["Pistolet", "Waffle", "Moules-frites", "Waterzooi", "Stoemp", "Speculoos", "Croquettes", "Carbonnade flamande", "Vol-au-vent", "Mitraillette"] }),
  SE: createCulture({ name: "Sweden", nativeName: "Sverige", language: "sv", timezone: "Europe/Stockholm", flag: "🇸🇪", schedule: "early", dishes: ["Filmjölk", "Open sandwich", "Köttbullar", "Gravlax", "Ärtsoppa", "Kanelbulle", "Semla", "Janssons frestelse", "Raggmunk", "Tunnbrödsrulle"] }),
  NO: createCulture({ name: "Norway", nativeName: "Norge", language: "no", timezone: "Europe/Oslo", flag: "🇳🇴", schedule: "early", dishes: ["Brunost toast", "Havregrøt", "Smørbrød", "Fiskesuppe", "Kjøttkaker", "Vaffel", "Skolebrød", "Laks", "Fårikål", "Pølse"] }),
  DK: createCulture({ name: "Denmark", nativeName: "Danmark", language: "da", timezone: "Europe/Copenhagen", flag: "🇩🇰", schedule: "early", dishes: ["Rugbrød", "Wienerbrød", "Smørrebrød", "Frikadeller", "Stegt flæsk", "Æbleskiver", "Kanelsnegl", "Flæskesteg", "Fiskefrikadeller", "Hotdog"] }),
  SA: createCulture({ name: "Saudi Arabia", nativeName: "السعودية", language: "ar", timezone: "Asia/Riyadh", flag: "🇸🇦", schedule: "late", dishes: ["Foul medames", "Tamees", "Kabsa", "Mandi", "Jareesh", "Mutabbaq", "Luqaimat", "Saleeg", "Shawarma", "Kebda"] }),
  AE: createCulture({ name: "United Arab Emirates", nativeName: "الإمارات", language: "ar", timezone: "Asia/Dubai", flag: "🇦🇪", schedule: "late", dishes: ["Balaleet", "Chebab", "Machboos", "Thareed", "Harees", "Luqaimat", "Manakish", "Grilled hammour", "Shuwaa", "Shawarma"] }),
  IL: createCulture({ name: "Israel", nativeName: "ישראל", language: "he", timezone: "Asia/Jerusalem", flag: "🇮🇱", schedule: "late", dishes: ["Shakshuka", "Bourekas", "Falafel", "Sabich", "Hummus plate", "Malabi", "Bamba", "Grilled fish", "Chicken schnitzel", "Jerusalem mixed grill"] }),
  EG: createCulture({ name: "Egypt", nativeName: "مصر", language: "ar", timezone: "Africa/Cairo", flag: "🇪🇬", schedule: "late", dishes: ["Foul", "Ta'ameya", "Koshari", "Molokhia", "Hawawshi", "Basbousa", "Roz bel laban", "Fattah", "Mahshi", "Shawarma"] }),
  MA: createCulture({ name: "Morocco", nativeName: "المغرب", language: "ar", timezone: "Africa/Casablanca", flag: "🇲🇦", schedule: "late", dishes: ["Msemen", "Bissara", "Couscous", "Harira", "Pastilla", "Chebakia", "Baghrir", "Lamb tagine", "Rfissa", "Brochettes"] }),
  ZA: createCulture({ name: "South Africa", nativeName: "South Africa", language: "en", timezone: "Africa/Johannesburg", flag: "🇿🇦", dishes: ["Rusks", "Vetkoek", "Bunny chow", "Bobotie", "Boerewors roll", "Koeksister", "Melktert", "Braai", "Potjiekos", "Gatsby"] }),
  AR: createCulture({ name: "Argentina", nativeName: "Argentina", language: "es", timezone: "America/Argentina/Buenos_Aires", flag: "🇦🇷", schedule: "late", dishes: ["Medialunas", "Tostadas", "Milanesa", "Locro", "Empanadas", "Alfajor", "Facturas", "Asado", "Provoleta", "Choripán"] }),
  PE: createCulture({ name: "Peru", nativeName: "Perú", language: "es", timezone: "America/Lima", flag: "🇵🇪", dishes: ["Pan con chicharrón", "Tamales", "Ceviche", "Lomo saltado", "Ají de gallina", "Picarones", "Anticuchos", "Pollo a la brasa", "Arroz con mariscos", "Salchipapa"] }),
};

const EXTRA_DISHES = {
  KR: ["콩나물국밥", "길거리 토스트", "제육볶음", "순두부찌개", "칼국수", "붕어빵", "호떡", "닭갈비", "갈비탕", "족발"],
  US: ["Waffles", "Breakfast burrito", "Club sandwich", "Clam chowder", "Pulled pork", "Brownie", "Corn dog", "Meatloaf", "Lobster roll", "Philly cheesesteak"],
  JP: ["納豆ご飯", "卵焼き", "天丼", "親子丼", "そば", "団子", "今川焼き", "しゃぶしゃぶ", "お好み焼き", "餃子"],
  CN: ["粥", "包子", "担担面", "宫保鸡丁", "水饺", "月饼", "肉夹馍", "红烧肉", "酸菜鱼", "螺蛳粉"],
  ES: ["Tostada con aceite", "Huevos rotos", "Fideuà", "Fabada", "Gazpacho", "Turrón", "Empanada gallega", "Albóndigas", "Calamares", "Pimientos de padrón"],
  FR: ["Baguette tartine", "Omelette", "Jambon-beurre", "Cassoulet", "Coq au vin", "Éclair", "Madeleine", "Confit de canard", "Bouillabaisse", "Steak frites"],
  DE: ["Bauernfrühstück", "Quarkbrötchen", "Maultaschen", "Spätzle", "Eintopf", "Lebkuchen", "Käsekuchen", "Rouladen", "Schweinshaxe", "Leberkäse"],
  GB: ["Beans on toast", "Crumpets", "Ploughman's lunch", "Bangers and mash", "Steak pie", "Sticky toffee pudding", "Scotch egg", "Beef Wellington", "Toad in the hole", "Chip butty"],
  IN: ["Idli sambar", "Aloo paratha", "Rajma chawal", "Dal makhani", "Kathi roll", "Pakora", "Gulab jamun", "Tandoori chicken", "Rogan josh", "Vada pav"],
  ID: ["Lontong sayur", "Ketoprak", "Bakso", "Rawon", "Ayam penyet", "Klepon", "Pempek", "Ikan bakar", "Opor ayam", "Seblak"],
  VN: ["Bánh cuốn", "Xôi", "Bún bò Huế", "Cao lầu", "Mì Quảng", "Bánh cam", "Bánh tráng trộn", "Chả cá", "Lẩu", "Ốc"],
  TH: ["Khai kata", "Pa thong ko", "Khao soi", "Boat noodles", "Massaman curry", "Khanom krok", "Thai roti", "Grilled fish", "Larb", "Yum woon sen"],
  IT: ["Cappuccino e brioche", "Pane e marmellata", "Gnocchi", "Parmigiana", "Minestrone", "Cannoli", "Tiramisù", "Osso buco", "Bistecca fiorentina", "Supplì"],
  PT: ["Pão com manteiga", "Omelete", "Arroz de pato", "Polvo à lagareiro", "Sardinhas assadas", "Bola de Berlim", "Rissóis", "Cataplana", "Leitão", "Cachorrinho"],
  MX: ["Molletes", "Tamales", "Tostadas", "Sopa de tortilla", "Carnitas", "Pan dulce", "Esquites", "Cochinita pibil", "Chile relleno", "Torta"],
  BR: ["Tapioca", "Cuscuz nordestino", "Virado à paulista", "Escondidinho", "Arroz carreteiro", "Pão de mel", "Empada", "Galinhada", "Vaca atolada", "X-tudo"],
  TR: ["Kahvaltı tabağı", "Gözleme", "Kuru fasulye", "İmam bayıldı", "Mercimek çorbası", "Lokum", "Kumpir", "Hünkar beğendi", "Testi kebabı", "Çiğ köfte"],
  GR: ["Dakos", "Strapatsada", "Fasolada", "Dolmades", "Horiatiki", "Baklava", "Tiropita", "Stifado", "Kleftiko", "Pita gyro"],
  CA: ["Breakfast poutine", "Bannock", "Split pea soup", "Halifax donair", "Lobster roll", "BeaverTails", "Ketchup chips", "Maple salmon", "Alberta beef", "Poutine râpée"],
  AU: ["Brekkie roll", "Weet-Bix", "Pumpkin soup", "Aussie burger", "Salt and pepper squid", "Tim Tam", "Fairy bread", "Lamb chops", "Moreton Bay bug", "Dim sim"],
  NZ: ["Pikelets", "Creamed pāua toast", "Southland cheese roll", "Seafood chowder", "Kūmara soup", "Afghan biscuit", "Hokey pokey ice cream", "Roast pork", "Crayfish", "Mince and cheese pie"],
  SG: ["Soft-boiled eggs", "Carrot cake", "Nasi lemak", "Fishball noodles", "Mee rebus", "Kueh", "Rojak", "Black pepper crab", "Sambal stingray", "Murtabak"],
  MY: ["Half-boiled eggs", "Thosai", "Asam laksa", "Mee goreng mamak", "Hainanese chicken rice", "Cendol", "Karipap", "Ikan bakar", "Ayam percik", "Ramly burger"],
  PH: ["Longsilog", "Pandesal", "Lumpia", "Bulalo", "Bicol express", "Bibingka", "Banana cue", "Crispy pata", "Inasal", "Batchoy"],
  RU: ["Оладьи", "Buterbrod", "Okroshka", "Kotleta po-kievski", "Olivier salad", "Medovik", "Chebureki", "Zharkoye", "Kulebyaka", "Khachapuri"],
  UA: ["Kasha", "Yushka", "Kapusniak", "Kotlety", "Kulesha", "Medivnyk", "Bilyashi", "Salo plate", "Pechenia", "Kyiv perepichka"],
  PL: ["Owsianka", "Twarożek", "Barszcz", "Placki ziemniaczane", "Kopytka", "Sernik", "Obwarzanek", "Golonka", "Zrazy", "Oscypek"],
  NL: ["Hagelslag toast", "Poffertjes", "Kroket", "Hutspot", "Saté", "Appeltaart", "Oliebollen", "Draadjesvlees", "Lekkerbekje", "Frikandel"],
  BE: ["Pain au chocolat", "Omelette", "Gentse waterzooi", "Chicons au gratin", "Filet américain", "Liège waffle", "Cuberdon", "Rabbit in beer", "Eel in green", "Belgian fries"],
  SE: ["Havregrynsgröt", "Knäckebröd", "Pyttipanna", "Wallenbergare", "Kroppkakor", "Kladdkaka", "Chokladboll", "Laxpudding", "Kalops", "Korv med mos"],
  NO: ["Frokostblanding", "Eggesmørbrød", "Lapskaus", "Raspeballer", "Reker", "Krumkake", "Lefse", "Pinnekjøtt", "Bacalao", "Pølse i lompe"],
  DK: ["Havregrød", "Boller", "Flæskestegssandwich", "Høns i asparges", "Brændende kærlighed", "Drømmekage", "Romkugle", "Andesteg", "Tarteletter", "Pølsemix"],
  SA: ["Shakshuka", "Areeka", "Samboosa", "Haneeth", "Qursan", "Kunafa", "Ma'amoul", "Madghout", "Samak mashwi", "Falafel"],
  AE: ["Khameer", "Regag", "Biryani", "Madrooba", "Jesheed", "Khanfaroosh", "Samboosa", "Lamb ouzi", "Camel meat", "Hassan mathar"],
  IL: ["Israeli salad", "Jachnun", "Shawarma", "Ptitim", "Kubeh", "Knafeh", "Rugelach", "Me'orav Yerushalmi", "Cholent", "Toast sabich"],
  EG: ["Feteer meshaltet", "Shakshuka", "Macarona béchamel", "Feseekh", "Kebda iskandarani", "Kunafa", "Om ali", "Hamam mahshi", "Kofta", "Sogoq"],
  MA: ["Khobz with amlou", "Berber omelette", "Tanjia", "Zaalouk", "Kefta tagine", "Sellou", "Briouat", "Mechoui", "Chermoula fish", "Maakouda"],
  ZA: ["Mealie pap", "Eggs and boerewors", "Pap en vleis", "Cape Malay curry", "Snoek", "Malva pudding", "Biltong", "Oxtail potjie", "Denningvleis", "Kota"],
  AR: ["Mate y tostadas", "Tortilla", "Humita", "Pastel de papa", "Ñoquis", "Chocotorta", "Pastelitos", "Matambre", "Carbonada", "Lomito"],
  PE: ["Quinua con leche", "Humitas", "Causa limeña", "Tacu tacu", "Seco de res", "Mazamorra morada", "Papa rellena", "Pachamanca", "Jalea", "Chifa"],
};

for (const [code, extras] of Object.entries(EXTRA_DISHES)) {
  const culture = CULTURES[code];
  culture.dishes = [...new Set([...culture.dishes, ...extras])];
  culture.menus = categorizeDishes(culture.dishes);
}

const MORE_DISHES = {
  KR: ["설렁탕", "감자탕", "부대찌개", "된장찌개", "청국장", "육개장", "순대국", "돼지국밥", "물회", "회덮밥", "보쌈", "찜닭", "해물파전", "빈대떡", "잡채", "쫄면", "잔치국수", "수제비", "오징어볶음", "아구찜", "곱창구이", "막창구이", "양념치킨", "간장게장", "코다리조림", "고등어구이", "돌솥비빔밥", "순대", "만두국", "팥빙수"],
  US: ["French toast", "Eggs Benedict", "Biscuits and gravy", "Cobb salad", "Caesar salad", "Reuben sandwich", "Sloppy joe", "Chili con carne", "Chicken pot pie", "New England clam bake", "Jambalaya", "Gumbo", "Po' boy", "Nashville hot chicken", "Texas brisket", "Baby back ribs", "Tater tots", "Onion rings", "Grilled cheese", "Chicken and waffles", "Key lime pie", "Cheesecake", "Chocolate chip cookies", "Banana split", "S'mores", "Pecan pie", "Crab cakes", "Shrimp and grits", "Hawaiian poke", "Chicago deep-dish pizza"],
  JP: ["味噌汁定食", "茶漬け", "牛丼", "海鮮丼", "うな重", "天ぷら", "とんかつ", "唐揚げ", "焼きそば", "ちゃんぽん", "カレーライス", "オムライス", "ハンバーグ", "味噌ラーメン", "つけ麺", "おでん", "もんじゃ焼き", "茶碗蒸し", "豚汁", "肉じゃが", "鯖の味噌煮", "焼肉", "串カツ", "コロッケ", "メロンパン", "あんみつ", "わらび餅", "どら焼き", "抹茶パフェ", "カステラ"],
  CN: ["馄饨", "豆腐脑", "热干面", "炸酱面", "牛肉面", "刀削面", "葱油拌面", "生煎包", "锅贴", "春卷", "叉烧包", "云吞面", "海南鸡饭", "回锅肉", "鱼香肉丝", "糖醋里脊", "东坡肉", "水煮鱼", "酸辣汤", "西红柿炒鸡蛋", "地三鲜", "干锅花菜", "羊肉泡馍", "凉皮", "桂林米粉", "过桥米线", "粽子", "绿豆糕", "蛋挞", "杨枝甘露"],
  ES: ["Salmorejo", "Arroz negro", "Arroz a banda", "Pisto manchego", "Callos a la madrileña", "Merluza a la gallega", "Bacalao al pil-pil", "Cochinillo asado", "Cordero asado", "Pollo al ajillo", "Sepia a la plancha", "Boquerones en vinagre", "Mejillones", "Ensaladilla rusa", "Huevos a la flamenca", "Migas", "Escalivada", "Pimientos rellenos", "Lentejas", "Crema catalana", "Flan", "Tarta de Santiago", "Leche frita", "Polvorones", "Buñuelos", "Porras", "Montaditos", "Pinchos morunos", "Jamón ibérico", "Queso manchego"],
  FR: ["Coq au vin", "Pot-au-feu", "Blanquette de veau", "Steak tartare", "Duck à l'orange", "Gratin dauphinois", "Tartiflette", "Fondue savoyarde", "Raclette", "Galette bretonne", "Croque madame", "Niçoise salad", "Lentilles saucisse", "Moules marinières", "Sole meunière", "Escargots", "Foie gras", "Pâté en croûte", "French onion tart", "Clafoutis", "Crème brûlée", "Profiteroles", "Mille-feuille", "Paris-Brest", "Tarte tatin", "Canelé", "Financier", "Pain perdu", "Madeleines", "Mont blanc"],
  DE: ["Weißwurst", "Königsberger Klopse", "Labskaus", "Gulaschsuppe", "Kartoffelpuffer", "Käsespätzle", "Schupfnudeln", "Semmelknödel", "Rinderroulade", "Zwiebelkuchen", "Flammkuchen", "Nürnberger Würstchen", "Bockwurst", "Frikadellen", "Matjes", "Backfisch", "Grünkohl mit Pinkel", "Linseneintopf", "Erbsensuppe", "Baumkuchen", "Schwarzwälder Kirschtorte", "Bienenstich", "Streuselkuchen", "Berliner", "Dampfnudel", "Rote Grütze", "Kaiserschmarrn", "Kartoffelklöße", "Toast Hawaii", "Fischbrötchen"],
  GB: ["English muffin", "Welsh rarebit", "Bubble and squeak", "Cottage pie", "Lancashire hotpot", "Beef and ale pie", "Steak and kidney pie", "Chicken and mushroom pie", "Pie and mash", "Jellied eels", "Haddock kedgeree", "Sausage casserole", "Gammon and eggs", "Roast beef", "Roast lamb", "Yorkshire pudding", "Cauliflower cheese", "Mushy peas", "Beans on toast", "Bacon butty", "Eccles cake", "Bakewell tart", "Victoria sponge", "Trifle", "Eton mess", "Bread and butter pudding", "Treacle tart", "Shortbread", "Hot cross bun", "Chelsea bun"],
  IN: ["Upma", "Uttapam", "Puri bhaji", "Misal pav", "Dhokla", "Khandvi", "Pani puri", "Bhel puri", "Aloo tikki", "Papdi chaat", "Matar paneer", "Shahi paneer", "Paneer tikka", "Malai kofta", "Dal tadka", "Sambar rice", "Curd rice", "Lemon rice", "Hyderabadi biryani", "Chicken tikka masala", "Korma", "Vindaloo", "Fish curry", "Goan prawn curry", "Naan", "Kulcha", "Rasmalai", "Kheer", "Lassi", "Kulfi"],
  ID: ["Nasi padang", "Nasi campur", "Nasi kuning", "Soto betawi", "Soto banjar", "Sop buntut", "Gulai kambing", "Gudeg", "Tongseng", "Nasi pecel", "Karedok", "Lotek", "Siomay Bandung", "Batagor", "Otak-otak", "Tahu gejrot", "Kerak telor", "Serabi", "Dadar gulung", "Es cendol", "Es teler", "Kolak", "Ayam goreng", "Bebek goreng", "Ikan asam pedas", "Cumi balado", "Sambal goreng ati", "Lemper", "Risol", "Bakmi ayam"],
  VN: ["Bún riêu", "Bún thịt nướng", "Bún mắm", "Bánh canh", "Mì vịt tiềm", "Cơm gà", "Cơm chiên", "Cơm hến", "Bánh khọt", "Bánh bèo", "Bánh bột lọc", "Bánh hỏi", "Nem nướng", "Chả giò", "Thịt kho trứng", "Canh chua", "Cá lóc nướng", "Gà kho gừng", "Lẩu mắm", "Lẩu thái", "Bò lúc lắc", "Bò lá lốt", "Bánh bao", "Bánh tiêu", "Bánh chuối", "Sữa chua nếp cẩm", "Tào phớ", "Sinh tố bơ", "Cà phê trứng", "Trà sữa"],
  TH: ["Khao man gai", "Khao kha moo", "Khao mok gai", "Rad na", "Pad see ew", "Pad kee mao", "Yen ta fo", "Tom kha gai", "Tom yum noodles", "Panang curry", "Red curry", "Yellow curry", "Jungle curry", "Pad prik king", "Kai med ma muang", "Gai yang", "Kor moo yang", "Sai ua", "Nam tok moo", "Laab gai", "Yam pla duk foo", "Pla rad prik", "Hoy tod", "Tod mun pla", "Khanom jeen", "Khao niew mamuang", "Tub tim grob", "Bua loy", "Kluay tod", "Cha yen"],
  IT: ["Bruschetta", "Caprese salad", "Panzanella", "Focaccia", "Calzone", "Cacio e pepe", "Amatriciana", "Pesto genovese", "Pasta alla norma", "Tagliatelle al ragù", "Tortellini", "Ravioli", "Orecchiette", "Polenta", "Risotto alla milanese", "Saltimbocca", "Vitello tonnato", "Chicken cacciatore", "Fritto misto", "Cioppino", "Melanzane ripiene", "Insalata di mare", "Zabaglione", "Panna cotta", "Affogato", "Sfogliatella", "Panettone", "Biscotti", "Zeppole", "Granita"],
  PT: ["Açorda", "Arroz de polvo", "Arroz de cabidela", "Carne de porco à alentejana", "Cozido à portuguesa", "Dobrada", "Alheira", "Chanfana", "Espetada", "Frango piri-piri", "Feijoada transmontana", "Sopa da pedra", "Canja", "Amêijoas à Bulhão Pato", "Lulas recheadas", "Peixe grelhado", "Pastéis de bacalhau", "Pataniscas", "Bolo do caco", "Broa", "Arroz doce", "Leite creme", "Bolo de bolacha", "Travesseiro", "Ovos moles", "Pão de ló", "Sonhos", "Farturas", "Tigelada", "Sericaia"],
  MX: ["Tlacoyos", "Gorditas", "Sopes", "Huaraches", "Tlayudas", "Flautas", "Taquitos", "Chiles en nogada", "Pambazo", "Cemita", "Menudo", "Caldo de res", "Sopa de lima", "Aguachile", "Ceviche mexicano", "Pescado a la veracruzana", "Barbacoa", "Cabrito", "Alambre", "Carne asada", "Frijoles charros", "Nopales", "Guacamole", "Arroz rojo", "Conchas", "Tres leches", "Flan napolitano", "Arroz con leche", "Paletas", "Agua de horchata"],
  BR: ["Bauru", "Misto quente", "Cuscuz paulista", "Picadinho", "Strogonoff brasileiro", "Frango com quiabo", "Tutu de feijão", "Feijão tropeiro", "Baião de dois", "Carne de sol", "Acarajé", "Vatapá", "Caruru", "Tacacá", "Pato no tucupi", "Caldeirada", "Bolinho de bacalhau", "Kibe brasileiro", "Cachorro-quente brasileiro", "Mandioca frita", "Farofa", "Paçoca", "Quindim", "Pudim de leite", "Beijinho", "Romeu e Julieta", "Canjica", "Curau", "Bolo de rolo", "Guaraná"],
  TR: ["Sucuklu yumurta", "Çılbır", "Mercimek köftesi", "İçli köfte", "Karnıyarık", "Etli ekmek", "Adana kebap", "Urfa kebap", "Cağ kebabı", "Beyti kebap", "Ali nazik", "Tas kebabı", "Güveç", "Hamsi tava", "Balık ekmek", "Midye dolma", "Kokoreç", "Kısır", "Ezogelin çorbası", "Yayla çorbası", "Aşure", "Sütlaç", "Kazandibi", "Künefe", "Revani", "Tulumba", "Dondurma", "Poğaça", "Açma", "Tantuni"],
  GR: ["Tzatziki", "Taramosalata", "Fava", "Greek salad", "Avgolemono", "Fasolakia", "Gigantes plaki", "Briam", "Imam bayildi", "Lahanodolmades", "Keftedes", "Bifteki", "Youvetsi", "Soutzoukakia", "Lamb souvlaki", "Octopus salad", "Grilled sardines", "Garides saganaki", "Kalamari", "Pork gyro", "Galaktoboureko", "Kataifi", "Rizogalo", "Portokalopita", "Karydopita", "Melomakarona", "Kourabiedes", "Revani", "Halva", "Freddo coffee"],
  CA: ["Tourtière du Lac-Saint-Jean", "Rappie pie", "Jiggs dinner", "Alberta beef burger", "Montreal smoked meat sandwich", "Saskatoon berry pie", "Blueberry grunt", "Sugar pie", "Maple taffy", "Maple baked beans", "Nanaimo bar", "Butter tart", "Date square", "Flapper pie", "BeaverTails", "Ketchup chips", "All-dressed chips", "Caesar cocktail", "Pouding chômeur", "Cretons", "Pâté chinois", "Acadian fricot", "Fish cakes", "Cod au gratin", "Pacific salmon", "Arctic char", "Bison stew", "Venison burger", "Pierogi", "Ginger beef"],
  AU: ["Aussie breakfast", "Smashed avo", "Chiko roll", "Dagwood dog", "Works burger", "Steak sandwich", "Chicken schnitzel", "Saltwater barramundi", "Grilled prawns", "Moreton Bay bugs", "Sydney rock oysters", "Tasmanian salmon", "Lamb roast", "Roast pumpkin salad", "Damper", "ANZAC biscuits", "Pavlova", "Vanilla slice", "Caramel slice", "Fairy bread", "Tim Tam slam", "Golden Gaytime", "Cherry Ripe", "Milo", "Flat white", "Iced coffee", "Potato scallops", "Dim sims", "Pie floater", "Halal snack pack"],
  NZ: ["Big breakfast", "Māori bread", "Rewena bread", "Boil-up", "Pork and pūhā", "Fry bread", "Kina", "Pāua fritters", "Bluff oysters", "Green-lipped mussel chowder", "Snapper", "Hoki fish and chips", "Lamb shanks", "Venison pie", "Mince pie", "Bacon and egg pie", "Potato-top pie", "Sausage sizzle", "Lolly cake", "Afghan biscuit", "Anzac biscuit", "Hokey pokey", "Feijoa crumble", "Kūmara chips", "Cheese scone", "Ginger crunch", "Custard square", "Lamington", "Flat white", "Lemon and Paeroa"],
  SG: ["Chee cheong fun", "Lor mee", "Prawn noodles", "Wanton mee", "Mee siam", "Mee soto", "Nasi biryani", "Nasi padang", "Duck rice", "Roast meat rice", "Claypot rice", "Yong tau foo", "Popiah", "Oyster omelette", "Sambal kangkong", "Fish head curry", "Cereal prawns", "Salted egg chicken", "Hokkien prawn mee", "Thunder tea rice", "Tau huay", "Chendol", "Kueh lapis", "Ondeh-ondeh", "Pandan cake", "Pineapple tart", "Milo dinosaur", "Bandung", "Sugar cane juice", "Kopi"],
  MY: ["Kaya toast", "Nasi kerabu", "Nasi dagang", "Nasi tomato", "Banana leaf rice", "Claypot chicken rice", "Pan mee", "Wantan mee", "Prawn mee", "Mee rebus", "Mee siam", "Fish head curry", "Bak kut teh", "Roti jala", "Murtabak", "Otak-otak", "Lok lok", "Pasembur", "Kerabu", "Sambal sotong", "Laksa Johor", "Sarawak laksa", "Kolo mee", "Kuih lapis", "Ondeh-ondeh", "Ais kacang", "Teh tarik", "Milo ais", "Apam balik", "Pulut panggang"],
  PH: ["Arroz caldo", "Pancit canton", "Pancit palabok", "Pancit bihon", "Mami", "Lomi", "Tinola", "Nilaga", "Caldereta", "Mechado", "Afritada", "Dinuguan", "Pinakbet", "Laing", "Ginataang gulay", "Daing na bangus", "Kinilaw", "Tokwa't baboy", "Dynamite lumpia", "Ukoy", "Kwek-kwek", "Fish balls", "Siopao", "Ensaymada", "Puto", "Kutsinta", "Leche flan", "Ube halaya", "Buko pie", "Taho"],
  RU: ["Draniki", "Vareniki", "Kholodets", "Ukha", "Rassolnik", "Shchi", "Herring under a fur coat", "Mimosa salad", "Vinegret", "Chicken tabaka", "Pozharsky cutlet", "Kulebyaka", "Rasstegai", "Solyanka", "Golubtsy", "Buckwheat with mushrooms", "Makarony po-flotski", "Potato zrazy", "Cabbage pie", "Sushki", "Pryaniki", "Ptichye moloko", "Napoleon cake", "Kartoshka cake", "Pastila", "Zefir", "Kvass", "Ryazhenka", "Kissel", "Mors"],
  UA: ["Borshch with pampushky", "Green borshch", "Deruny with sour cream", "Varenyky with potatoes", "Varenyky with cherries", "Nalysnyky", "Syrnyky", "Holubtsi", "Kapusniak", "Bograch", "Kulesha", "Banosh", "Chicken Kyiv", "Salo with rye bread", "Homemade sausage", "Kholodets", "Pechenia", "Kruchenyky", "Mlyntsi", "Pyrizhky", "Paska", "Kutia", "Medivnyk", "Kyiv cake", "Pampushky sweet", "Uzvar", "Kvas", "Yushka", "Fish kotleta", "Potato babka"],
  PL: ["Barszcz czerwony", "Barszcz biały", "Rosół", "Flaki", "Krupnik", "Pomidorowa", "Pierogi ruskie", "Pierogi z mięsem", "Pierogi z kapustą", "Łazanki", "Pyzy", "Kluski śląskie", "Babka ziemniaczana", "Kotlet mielony", "De volaille", "Gulasz", "Żeberka", "Kaczka z jabłkami", "Śledzie", "Ryba po grecku", "Sałatka jarzynowa", "Makowiec", "Piernik", "Kremówka", "Racuchy", "Faworki", "Babka wielkanocna", "Chałka", "Kompot", "Oranżada"],
  NL: ["Krentenbol", "Wentelteefjes", "Tosti", "Broodje gezond", "Broodje haring", "Huzarensalade", "Bami goreng", "Nasi goreng", "Gehaktbal", "Hachee", "Zuurkoolstamppot", "Boerenkoolstamppot", "Andijviestamppot", "Kapucijners", "Kibbeling", "Mosselen", "Paling", "Saucijzenbroodje", "Kaassoufflé", "Patat oorlog", "Speculaas", "Gevulde koek", "Tompouce", "Bossche bol", "Vla", "Poffertjes", "Drop", "Pepernoten", "Appelflap", "Oude kaas"],
  BE: ["Garnaalkroketten", "Kaaskroketten", "Tomaat-garnaal", "Paling in 't groen", "Konijn met pruimen", "Vlaamse stoverij", "Witloof met ham", "Luikse gehaktballen", "Gentse stoverij", "Kip met appelmoes", "Filet américain", "Martino sandwich", "Mitraillette", "Bicky burger", "Friet stoofvlees", "Gegratineerde mosselen", "Zeetong meunière", "Garnaalsoep", "Preisoep", "Mattentaart", "Rijsttaart", "Smoutebollen", "Lacquemant", "Geraardsbergse mattentaart", "Merveilleux", "Praline", "Chocolademousse", "Dame blanche", "Kriek", "Geuze"],
  SE: ["Toast Skagen", "Gubbröra", "Janssons frestelse", "Flygande Jacob", "Isterband", "Kåldolmar", "Kålpudding", "Pannbiff", "Biff Rydberg", "Raggmunk med fläsk", "Kroppkakor", "Pitepalt", "Ärtsoppa och pannkakor", "Laxpudding", "Inlagd sill", "Strömming", "Kräftor", "Västerbottenpaj", "Smörgåstårta", "Nyponsoppa", "Prinsesstårta", "Ostkaka", "Pepparkakor", "Lussekatter", "Dammsugare", "Hallongrotta", "Kladdkaka", "Semla", "Risgrynsgröt", "Julmust"],
  NO: ["Eggerøre med laks", "Karbonadesmørbrød", "Rekesmørbrød", "Sodd", "Kjøttsuppe", "Lapskaus", "Komle", "Raspeball", "Kjøttkaker i brun saus", "Medisterkaker", "Elggryte", "Reinsdyrstek", "Lutefisk", "Rakfisk", "Fiskeboller", "Fiskegrateng", "Klippfisk", "Stekt makrell", "Krabbe", "Svele", "Krumkake", "Multekrem", "Riskrem", "Tilslørte bondepiker", "Verdens beste", "Kvæfjordkake", "Skillingsboller", "Pepperkaker", "Lompe", "Solo"],
  DK: ["Øllebrød", "Ymer", "Dyrlægens natmad", "Sol over Gudhjem", "Pariserbøf", "Biksemad", "Millionbøf", "Forloren hare", "Boller i karry", "Medisterpølse", "Stegt lever", "Flæskesteg", "Andesteg", "Frikadeller", "Rødspættefilet", "Stjerneskud", "Fiskefrikadeller", "Tarteletter", "Kartoffelmad", "Leverpostejmad", "Risalamande", "Koldskål", "Rødgrød med fløde", "Drømmekage", "Brunsviger", "Hindbærsnitte", "Kransekage", "Pebernødder", "Fastelavnsbolle", "Cocio"],
  SA: ["Ful medames", "Fattah", "Masoob", "Ma'soub malaki", "Tharid", "Matazeez", "Marqooq", "Harees", "Saleeg", "Jareesh", "Kabsa chicken", "Kabsa lamb", "Mandi chicken", "Mandi lamb", "Madfoon", "Hashi rice", "Camel kabsa", "Grilled hammour", "Shrimp sayadiyah", "Kofta", "Shawarma chicken", "Shawarma beef", "Falafel sandwich", "Samboosa cheese", "Samboosa meat", "Kunafa", "Basbousa", "Luqaimat", "Ma'amoul", "Saudi coffee with dates"],
  AE: ["Emirati breakfast platter", "Dango", "Khobz khameer", "Khobz regag", "Balaleet", "Harees", "Thareed", "Madrooba", "Machboos chicken", "Machboos lamb", "Machboos fish", "Lamb ouzi", "Shuwaa", "Jesheed", "Saloona", "Margouga", "Thereed vegetables", "Grilled hammour", "Kingfish fry", "Prawn biryani", "Shawarma", "Falafel", "Manakish zaatar", "Manakish cheese", "Samboosa", "Luqaimat", "Khanfaroosh", "Khabeesa", "Date pudding", "Karak chai"],
  IL: ["Jachnun", "Malawach", "Kubaneh", "Labneh plate", "Israeli breakfast", "Hummus masabacha", "Hummus ful", "Falafel pita", "Sabich pita", "Shawarma laffa", "Jerusalem mixed grill", "Chicken schnitzel", "Ptitim", "Kubeh soup", "Cholent", "Gefilte fish", "Moroccan fish", "Stuffed peppers", "Bourekas cheese", "Bourekas potato", "Jerusalem bagel", "Knafeh", "Halva", "Rugelach", "Babka", "Malabi", "Sufganiyah", "Hamantaschen", "Arak lemonade", "Mint tea"],
  EG: ["Ful with eggs", "Feteer with honey", "Besara", "Alexandrian liver", "Sujuk sandwich", "Kofta sandwich", "Koshari", "Molokhia with rabbit", "Molokhia with chicken", "Fattah", "Hamam mahshi", "Mahshi kousa", "Mahshi waraq enab", "Bamia", "Torly", "Sayadeya fish", "Grilled mullet", "Feseekh", "Renga", "Macarona béchamel", "Roz meammar", "Hawawshi", "Shawarma", "Ta'ameya sandwich", "Om ali", "Basbousa", "Kunafa", "Qatayef", "Rice pudding", "Sugarcane juice"],
  MA: ["Amlou toast", "Khlii with eggs", "Berber omelette", "Harira", "Bissara", "Taktouka", "Zaalouk", "Couscous tfaya", "Seven-vegetable couscous", "Chicken tagine with olives", "Lamb tagine with prunes", "Kefta tagine", "Fish tagine", "Vegetable tagine", "Tanjia marrakchia", "Rfissa", "Pastilla chicken", "Pastilla seafood", "Mechoui lamb", "Brochettes", "Sardine balls", "Maakouda", "Msemen stuffed", "Briouat", "Chebakia", "Sellou", "Ghriba", "Kaab el ghazal", "Baghrir", "Mint tea"],
  ZA: ["Pap and wors", "Pap and chakalaka", "Boerewors", "Sosaties", "Peri-peri chicken", "Cape Malay bobotie", "Cape Malay curry", "Durban curry", "Bunny chow lamb", "Bunny chow chicken", "Vetkoek and mince", "Gatsby steak", "Kota", "Snoek braai", "Pickled fish", "Fish frikkadels", "Waterblommetjie bredie", "Tomato bredie", "Oxtail potjie", "Lamb potjie", "Mogodu", "Umngqusho", "Chakalaka", "Roosterkoek", "Biltong", "Droëwors", "Malva pudding", "Peppermint crisp tart", "Hertzoggie", "Amarula dessert"],
  AR: ["Tortas fritas", "Revuelto gramajo", "Provoleta", "Milanesa napolitana", "Milanesa a caballo", "Suprema de pollo", "Matambre arrollado", "Matambre a la pizza", "Vacío asado", "Entraña asada", "Bife de chorizo", "Ojo de bife", "Parrillada", "Locro", "Carbonada", "Humita en chala", "Tamales salteños", "Empanadas salteñas", "Empanadas tucumanas", "Pizza porteña", "Fugazzeta", "Ñoquis del 29", "Ravioles", "Sorrentinos", "Pastel de papa", "Dulce de leche flan", "Chocotorta", "Vigilante", "Helado argentino", "Mate cocido"],
  PE: ["Papa a la huancaína", "Ocopa arequipeña", "Tiradito", "Leche de tigre", "Choritos a la chalaca", "Cau cau", "Carapulcra", "Arroz con pato", "Seco de cabrito", "Olluquito con charqui", "Papa rellena", "Anticuchos", "Picarones", "Cuy chactado", "Rocoto relleno", "Adobo arequipeño", "Juane", "Tacacho con cecina", "Inchicapi", "Patarashca", "Chupe de camarones", "Parihuela", "Sudado de pescado", "Tallarines verdes", "Tallarines saltados", "Arroz chaufa", "Pollo saltado", "Suspiro limeño", "Arroz con leche", "Chicha morada"],
};

for (const [code, additions] of Object.entries(MORE_DISHES)) {
  const culture = CULTURES[code];
  culture.dishes = [...new Set([...culture.dishes, ...additions])];
  culture.menus = categorizeDishes(culture.dishes);
}

const MENU_COMPLETIONS = {
  FR: ["Croque provençal"],
  GB: ["Black pudding"],
  CA: ["Toutons", "Poutine galvaude", "Salmon candy", "Montreal-style pizza"],
  AU: ["Balmain bug roll"],
  NZ: ["Muttonbird", "Kiwi onion dip"],
  RU: ["Belyashi", "Cabbage shchi", "Curd vatrushka"],
  UA: ["Hrechanyky", "Sichenyky", "Zrazy", "Vereshchaka", "Shpundra", "Mazuryky", "Knyshi", "Korovai", "Pliatsok", "Makivnyk", "Ryazhanka"],
  NL: ["Balkenbrij", "Kruidnoten"],
  BE: ["Boulet à la Liégeoise", "Tarte au riz"],
  SE: ["Skomakarlåda", "Dillkött", "Stekt fläsk", "Blodpudding", "Punsch rolls"],
  NO: ["Smalahove", "Mølje"],
  DK: ["Gule ærter", "Æggekage", "Skipperlabskovs", "Krebinetter", "Rullepølse", "Citronfromage"],
  SA: ["Mofطح", "Daghabees", "Asida", "Hinaini", "Kleeja"],
  AE: ["Fareed", "Maleh", "Muhammar", "Nashif", "Aseeda", "Batheet", "Date maamoul", "Emirati kebab", "Lamb saloona", "Fish saloona", "Chicken madfoon", "Jami"],
  IL: ["Mujaddara", "Shakshuka green", "Kreplach", "Latkes", "Charoset", "Couscous maftoul", "Schnitzel pita", "Tunisian sandwich"],
  EG: ["Kaware'", "Mombar", "Fatta shawarma", "Keshk", "Mesaqa'a", "Kofta dawood basha", "Kebda pane", "Feteer savory", "Goulash pastry", "Date kahk"],
  MA: ["Djaj mqualli", "Mrouzia", "Boulfaf", "Khliaa", "Seffa medfouna", "Couscous bidaoui", "Tagine makfoul", "Tagine sardines", "Harsha", "Sfenj", "Jben", "Avocado juice"],
  ZA: ["Bredie", "Skilpadjies", "Umleqwa", "Masala steak sandwich", "Cape snoek pâté"],
  AR: ["Mondongo", "Puchero", "Riñones al vino", "Mollejas", "Dulce de batata"],
  PE: ["Cabrito a la norteña", "Mondonguito a la italiana", "Sopa seca"],
};

for (const [code, additions] of Object.entries(MENU_COMPLETIONS)) {
  const culture = CULTURES[code];
  culture.dishes = [...new Set([...culture.dishes, ...additions])];
  culture.menus = categorizeDishes(culture.dishes);
}

const IMAGE_QUERY_BY_DISH = new Map();

for (const culture of Object.values(CULTURES)) {
  culture.dishes = [...new Set(culture.dishes.map((dish) => dish.trim()))];
  for (const dish of culture.dishes) {
    IMAGE_QUERY_BY_DISH.set(dish, dish);
  }
  culture.menus = categorizeDishes(culture.dishes);
}

const REGION_TO_CULTURE = Object.fromEntries(Object.keys(CULTURES).map((code) => [code, code]));
REGION_TO_CULTURE.UK = "GB";

const TIMEZONE_TO_CULTURE = Object.entries(CULTURES).map(([code, culture]) => [culture.timezone, code]);
