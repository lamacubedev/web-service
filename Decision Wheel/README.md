# Menu Rush

Static global food picker for Cloudflare Pages. The slot-style menu machine uses
country-specific meal schedules and 2,000 local menu entries from 40 countries.

All interface copy and active-country menu names pass through the selected-language
translation layer. Translations are cached in the visitor's browser so each
country/language combination is requested only once.

## Local preview

```powershell
python -m http.server 8787 --bind 127.0.0.1
```

Open `http://127.0.0.1:8787/`.

## Cloudflare Pages

- Framework preset: `None`
- Build command: leave empty
- Build output directory: `/`

### Menu images

The result panel displays up to five Unsplash photos and five Pexels photos.

1. Add `UNSPLASH_ACCESS_KEY` and `PEXELS_API_KEY` as encrypted Cloudflare Pages
   environment variables.
2. Keep `proxyEndpoint: "/api/images"` in `image-search-config.js`.
3. Deploy the included `functions/api/images.js` Pages Function.

The browser never receives either API key. Unsplash image URLs are hotlinked as
required by its API guidelines, and each image links to its provider source page.

Before production launch, replace the `example.com` canonical and Open Graph URLs in
`index.html` with the connected domain. Add the production sitemap URL to `robots.txt`
after a custom domain is connected.

## Structure

- `index.html`: semantic content, SEO metadata, policy and service information
- `styles.css`: responsive visual system
- `menu-data.js`: country profiles, meal schedules, and local menu data
- `app.js`: translations, country picker, meal filters, and slot machine behavior
- `_headers`: Cloudflare Pages security and cache headers
