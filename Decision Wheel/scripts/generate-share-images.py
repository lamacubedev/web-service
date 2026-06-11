from pathlib import Path
from PIL import Image, ImageDraw, ImageFont

ROOT = Path(__file__).resolve().parents[1]
TEMPLATE = ROOT / "share-images" / "template.png"
OUTPUT = ROOT / "share-images"

TITLES = {
    "ko": ("오늘", "뭐 먹지?"),
    "en": ("What should I", "eat today?"),
    "ja": ("今日は", "何を食べよう？"),
    "zh": ("今天", "吃什么？"),
    "es": ("¿Qué voy a", "comer hoy?"),
    "fr": ("Qu'est-ce qu'on", "mange aujourd'hui ?"),
    "de": ("Was soll ich", "heute essen?"),
    "pt": ("O que vou", "comer hoje?"),
    "it": ("Cosa mangio", "oggi?"),
    "ru": ("Что сегодня", "поесть?"),
    "ar": ("ماذا آكل", "اليوم؟"),
    "hi": ("आज", "क्या खाऊँ?"),
    "id": ("Hari ini", "makan apa?"),
    "vi": ("Hôm nay", "ăn gì?"),
    "th": ("วันนี้", "กินอะไรดี?"),
    "tr": ("Bugün", "ne yesem?"),
    "el": ("Τι να φάω", "σήμερα;"),
    "ms": ("Hari ini", "nak makan apa?"),
    "tl": ("Ano ang kakainin", "ko ngayon?"),
    "uk": ("Що сьогодні", "поїсти?"),
    "pl": ("Co dziś", "zjeść?"),
    "nl": ("Wat zal ik", "vandaag eten?"),
    "sv": ("Vad ska jag", "äta idag?"),
    "no": ("Hva skal jeg", "spise i dag?"),
    "da": ("Hvad skal jeg", "spise i dag?"),
    "he": ("מה לאכול", "היום?"),
}

RTL = {"ar", "he"}
FONT_BY_LANGUAGE = {
    "ko": r"C:\Windows\Fonts\malgunbd.ttf",
    "ja": r"C:\Windows\Fonts\YuGothB.ttc",
    "zh": r"C:\Windows\Fonts\msyhbd.ttc",
    "ar": r"C:\Windows\Fonts\Nirmala.ttc",
    "hi": r"C:\Windows\Fonts\Nirmala.ttc",
    "th": r"C:\Windows\Fonts\LeelawUI.ttf",
    "he": r"C:\Windows\Fonts\arialbd.ttf",
}
DEFAULT_FONT = r"C:\Windows\Fonts\arialbd.ttf"
BRAND_FONT = r"C:\Windows\Fonts\arialbd.ttf"


def fit_line(draw, text, font_path, max_width, start_size):
    for size in range(start_size, 38, -2):
        font = ImageFont.truetype(font_path, size)
        if draw.textbbox((0, 0), text, font=font)[2] <= max_width:
            return font
    return ImageFont.truetype(font_path, 38)


def main():
    OUTPUT.mkdir(parents=True, exist_ok=True)
    source = Image.open(TEMPLATE).convert("RGB")
    source = source.resize((1200, 800), Image.Resampling.LANCZOS)
    source = source.crop((0, 85, 1200, 715))

    for language, (lead, question) in TITLES.items():
        image = source.copy()
        draw = ImageDraw.Draw(image)
        font_path = FONT_BY_LANGUAGE.get(language, DEFAULT_FONT)
        lead_font = fit_line(draw, lead, font_path, 560, 82)
        question_font = fit_line(draw, question, font_path, 570, 92)
        x = 615 if language in RTL else 58
        anchor = "ra" if language in RTL else "la"
        draw.text((x, 175), lead, font=lead_font, fill="#17201b", anchor=anchor)
        draw.text(
            (x, 285),
            question,
            font=question_font,
            fill="#137a5b",
            anchor=anchor,
            stroke_width=1,
            stroke_fill="#137a5b",
        )

        brand_font = ImageFont.truetype(BRAND_FONT, 27)
        draw.text(
            (60, 455),
            "MENU ROULETTE RUSH",
            font=brand_font,
            fill="#0b4b37",
        )
        image.save(OUTPUT / f"share-{language}.jpg", quality=88, optimize=True, progressive=True)


if __name__ == "__main__":
    main()
