# Ahmed El Sayed Platform

A deployment-neutral Vite + React personal brand and business ecosystem website for Ahmed El Sayed.

## Local development

```bash
pnpm install
pnpm --filter @workspace/ahmed-el-sayed-platform run dev
```

The frontend runs on port `4173` by default. The build is written to `artifacts/ahmed-el-sayed-platform/dist/public`.

## Vercel

The repository includes `vercel.json` for a Vite deployment from the monorepo root:

```bash
pnpm install --frozen-lockfile
pnpm --filter @workspace/ahmed-el-sayed-platform run build
```

Set these optional environment variables in Vercel when the real links are available:

- `VITE_WHATSAPP_NUMBER`
- `VITE_INSTAGRAM_URL`
- `VITE_YOUTUBE_URL`
- `VITE_LINKEDIN_URL`
- `VITE_TIKTOK_URL`
- `VITE_VIDEO_CATALOG_URL`

### Form storage without a custom API

The website sends every form submission directly to a Google Apps Script webhook. The generic payload includes `formType`, so the same sheet can receive `consultation`, `course`, and future registration forms.

1. Create a Google Sheet and open **Extensions → Apps Script**.
2. Copy `integrations/google-sheets/Code.gs` into the script editor.
3. Deploy it as a **Web app**, execute as you, and allow access to anyone with the link.
4. Add the deployment URL to Vercel as `VITE_GOOGLE_SHEETS_WEBHOOK_URL`.

Optional direct Supabase storage uses these public frontend variables:

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

Run `supabase/schema.sql` in the Supabase SQL editor before enabling them. The schema permits anonymous **insert only** and blocks public reads, updates, and deletes. Never put a Supabase service-role key in frontend variables.

## Optional Modal API

Modal is not a static-site host, so the Vite frontend belongs on Vercel. `modal_app.py` provides a small serverless health endpoint that can later become the backend/API layer.

After installing the Modal CLI and authenticating:

```bash
python3 -m pip install modal
modal token new
modal deploy modal_app.py
```

The Starter plan is free to start and includes monthly compute credits; usage beyond included credits is billed by compute time.
