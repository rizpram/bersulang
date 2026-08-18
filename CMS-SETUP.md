# Bersulang CMS Setup

CMS admin URL:

```text
https://bersulang.id/admin/
```

CMS engine: Decap CMS with GitHub backend.

## What is already installed

- `admin/index.html` — Decap CMS admin app.
- `admin/config.yml` — CMS content schema.
- `content/site.json` — editable website content.
- `script.js` — loads `content/site.json` into the static website.
- `api/auth.js` — starts GitHub OAuth login.
- `api/callback.js` — exchanges GitHub OAuth code for token and returns it to Decap CMS.

## GitHub OAuth App setup

Create a GitHub OAuth App:

GitHub → Settings → Developer settings → OAuth Apps → New OAuth App

Recommended values:

```text
Application name: Bersulang CMS
Homepage URL: https://bersulang.id
Authorization callback URL: https://bersulang.id/api/callback
```

After creating the OAuth App, copy:

- Client ID
- Client Secret

## Vercel Environment Variables

Add these in Vercel Project Settings → Environment Variables:

```text
GITHUB_CLIENT_ID=<GitHub OAuth App Client ID>
GITHUB_CLIENT_SECRET=<GitHub OAuth App Client Secret>
CMS_ALLOWED_LOGINS=rizpram
```

Optional:

```text
GITHUB_REDIRECT_URI=https://bersulang.id/api/callback
```

`CMS_ALLOWED_LOGINS` is a comma-separated allowlist. Example:

```text
CMS_ALLOWED_LOGINS=rizpram,anothergithubuser
```

After adding env vars, redeploy production.

## Editing flow

1. Open `https://bersulang.id/admin/`.
2. Login with GitHub.
3. Edit `Bersulang Site Content`.
4. Save / Publish.
5. Decap CMS commits to GitHub `main`.
6. Vercel auto-deploys the updated content.

## Notes

- Do not commit raw `.otf`, `.ttf`, `.woff`, or `.woff2` font files unless the web/public license is confirmed.
- This Phase 1 CMS updates visible page content through `content/site.json` and `script.js`.
- For fully server-rendered SEO from CMS data, migrate the site to a build step or Next.js later.
