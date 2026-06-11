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

### Contact form and Google Sheets

The contact form posts to `functions/api/contact.js`. The Pages Function forwards
validated inquiries to a Google Apps Script web app, so the Apps Script URL and
shared secret are not exposed in browser code.

1. Create a private Google spreadsheet.
2. Open Extensions > Apps Script and paste `google-apps-script/Code.gs`.
3. In Apps Script Project Settings, add script properties:
   - `CONTACT_SPREADSHEET_ID`: the spreadsheet ID between `/d/` and `/edit`
   - `CONTACT_SHARED_SECRET`: a long random value
4. Deploy the script as a Web app:
   - Execute as: Me
   - Who has access: Anyone
5. Add Cloudflare Pages encrypted environment variables:
   - `GOOGLE_SHEETS_WEB_APP_URL`: the deployed URL ending in `/exec`
   - `CONTACT_SHARED_SECRET`: the same random value
6. Redeploy the Pages project.

The sheet creates an `Inquiries` tab and stores submission time, service ID,
service name, page URL, category, name, reply email, subject, and message.

For another website, reuse the same Apps Script and spreadsheet. Give that site
its own `serviceId` and `serviceName` in its contact configuration. All inquiries
will then share one sheet while remaining identifiable by service.

The default canonical, Open Graph, robots, and sitemap URLs use
`https://menu-rush.pages.dev`. Replace that origin across HTML files, `robots.txt`,
and `sitemap.xml` when connecting a custom domain.

## Structure

- `index.html`: semantic content, SEO metadata, policy and service information
- `styles.css`: responsive visual system
- `menu-data.js`: country profiles, meal schedules, and local menu data
- `app.js`: translations, country picker, meal filters, and slot machine behavior
- `about.html`, `guide.html`, `privacy.html`, `terms.html`, `contact.html`: service,
  guide, policy, and contact content
- `site-info.css`, `site-info.js`: shared information-page and drawer behavior
- `sitemap.xml`, `robots.txt`: search discovery configuration
- `_headers`: Cloudflare Pages security and cache headers
