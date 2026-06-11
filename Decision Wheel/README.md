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

#### 1. Configure the spreadsheet and Apps Script

1. Use the spreadsheet whose ID is
   `1oKz2_lROM9tmj2dd9aytDybf6tdg2PvxyxhYDA1IIZw`.
2. Confirm that the destination tab is named exactly `문의내용`.
3. Open Extensions > Apps Script and replace the editor contents with
   `google-apps-script/Code.gs`.
4. Open Apps Script > Project Settings > Script properties and add both values:
   - `CONTACT_SPREADSHEET_ID`:
     `1oKz2_lROM9tmj2dd9aytDybf6tdg2PvxyxhYDA1IIZw`
   - `CONTACT_SHARED_SECRET`: a long random value containing letters, numbers,
     and symbols
5. The secret value must be identical to the Cloudflare
   `CONTACT_SHARED_SECRET` value. Do not add quotation marks or extra spaces.
6. In the Apps Script function list, select `testConfiguration` and click Run.
   Approve the requested spreadsheet permission. A successful run logs the
   spreadsheet name and `문의내용`.

`CONTACT_SHARED_SECRET` alone is not enough. Apps Script also needs
`CONTACT_SPREADSHEET_ID` so `SpreadsheetApp.openById()` knows where to write.

#### 2. Deploy the Apps Script web app

1. Click Deploy > New deployment.
2. Select Web app.
3. Set Execute as to `Me`.
4. Set Who has access to `Anyone`.
5. Deploy and complete the Google authorization prompt.
6. Copy the deployed URL ending in `/exec`. Do not use the `/dev` test URL.
7. After every Apps Script code change, open Deploy > Manage deployments, edit
   the deployment, select `New version`, and deploy again.
8. Open the `/exec` URL in a browser. The diagnostic response should contain
   `"ok":true` and `"configured":true`. It never exposes the secret or sheet
   contents.

#### 3. Configure Cloudflare Pages

In Cloudflare Pages > Settings > Variables and Secrets, add these values to the
Production environment:

- `GOOGLE_SHEETS_WEB_APP_URL`: the Apps Script deployed URL ending in `/exec`
- `CONTACT_SHARED_SECRET`: exactly the same value stored in Apps Script

Add the same variables to Preview as well if testing a preview deployment. Save
the variables and trigger a new Cloudflare Pages deployment; an existing
deployment does not automatically receive newly added values.

#### 4. Troubleshoot

- `Contact service is not configured`: one of the two Cloudflare variables is
  missing from the environment serving the page.
- `UPSTREAM_INVALID_RESPONSE`: the Apps Script URL is commonly a `/dev` URL, a
  login page, or a deployment that is not accessible to `Anyone`.
- `UPSTREAM_REJECTED`: the shared secrets differ, or
  `CONTACT_SPREADSHEET_ID` is missing or incorrect.
- A successful form response but no row: update to the current Pages Function;
  older code could treat a non-JSON Google login response as success.
- Check Apps Script > Executions for the exact server-side error and Cloudflare
  Pages > Functions > Logs for the upstream error code.

The sheet stores inquiries in the `문의내용` tab with submission time, service ID,
service name, page URL, category, name, reply email, subject, message, visitor
country code, and country name. Redeploy Apps Script as a new version after
adding the country columns.

### Private visitor analytics

The project includes a first-party analytics collector and the private
`admin.html` dashboard. It stores no raw IP address. A random browser identifier
is hashed in the Pages Function with a server-side secret before it reaches D1.
Events older than 396 days are deleted automatically.

1. In Cloudflare, create a D1 database such as `menu-rush-analytics`.
2. Open the D1 console and execute `analytics-schema.sql`.
3. In Pages > Settings > Bindings, add the D1 database with variable name
   `ANALYTICS_DB`.
4. In Pages > Settings > Variables and Secrets, add:
   - `ANALYTICS_SALT`: a long random secret used only for visitor hashing
   - `ADMIN_STATS_TOKEN`: a different long random secret used to open the
     administrator dashboard
5. Add the binding and secrets to both Production and Preview if both
   environments need analytics, then redeploy the Pages project.
6. Open `/admin.html`, enter `ADMIN_STATS_TOKEN`, and choose a 7, 30, or 90-day
   range. The token is stored only in the current tab's `sessionStorage`.

The statistics API rejects requests without the administrator token. For an
additional login layer, protect `/admin.html` and `/api/analytics/stats*` with a
Cloudflare Access self-hosted application restricted to the administrator's
email address. Do not protect `/api/analytics/collect`, because visitors need to
send anonymous page views to that endpoint.

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
