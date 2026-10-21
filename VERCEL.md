# Deploy Hairluke from GitHub to Vercel

No manual dist upload is required. Push source to GitHub; Vercel runs npm ci and npm run build. The checked-in vercel.json serves dist as the frontend and api/index.js as the Express backend. Local development still uses npm run dev.

1. In Vercel, choose Add New → Project and import xannietechs/hairluke.
2. Use the repository root, Vite framework, npm run build and dist output. These are also declared in vercel.json. Use Node 22.
3. Add these environment variables before deploying. Copy values privately from your local .env.local; never add that file to GitHub:

| Name | Value |
| --- | --- |
| VITE_SUPABASE_URL | Your Supabase project URL |
| VITE_SUPABASE_PUBLISHABLE_KEY | Your public publishable key |
| SUPABASE_SERVICE_ROLE_KEY | Supabase server secret (server only) |
| YOCO_SECRET_KEY | Your Yoco test secret initially (server only) |
| STORE_READY | false |
| NODEJS_HELPERS | 0 (also supplied by vercel.json) |

4. Deploy. Vercel supplies an HTTPS address; no purchased domain is needed. After seeing its assigned production address, add APP_URL with that full HTTPS URL and redeploy. Without APP_URL the server uses Vercel's production URL, falling back to its deployment URL.
5. In Supabase Authentication URL Configuration, set your public Site URL to the Vercel address when ready and add any redirect URLs you intend to use. Password login currently does not use redirect-based auth.
6. Register the Yoco webhook at your production address plus /api/webhooks/yoco. Save its returned signing secret in Vercel as YOCO_WEBHOOK_SECRET and redeploy. A test-mode webhook must match your test secret; register the correct live-mode webhook before switching to live payments.
7. Finish real products, delivery/return/privacy terms and test checkout before setting STORE_READY=true. Add environment variables to the appropriate Production/Preview environments; do not give untrusted preview branches live payment secrets or production database access.

Public and private environment variables must also exist in Vercel, because .env.local is intentionally not pushed. VITE_ variables enter the browser bundle; server secrets must never use that prefix. Keep STORE_READY=false until the payment flow is verified.

Rate limiting uses per-instance memory. For a public launch, configure Vercel Firewall/rate limiting; the in-process counter is not a global distributed limit. Stock reservations and refunds still require the reconciliation process documented in README.md. This commit prepares deployment; it does not claim a successful Vercel deployment.

References: https://vercel.com/docs/frameworks/frontend/vite and https://vercel.com/docs/functions/runtimes/node-js/advanced-node-configuration
