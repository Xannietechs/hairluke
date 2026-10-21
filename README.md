# Hairluke

Custom HTML/CSS/JavaScript storefront, Vite build, Node/Express backend, Supabase PostgreSQL/Auth/Storage, and Yoco hosted checkout. No WordPress or site builder.

## Run

Requires Node 22 or newer. Run `npm install`, then `npm run dev` and open http://localhost:5173. The server serves both the API and frontend. `npm test` checks webhook authentication. `npm run build` creates the frontend production bundle. Run with `NODE_ENV=production` through your hosting environment after building.

The supplied public Supabase connection is saved in ignored `.env.local`. See `SETUP.md` for the remaining account-side setup. No service-role or Yoco secrets are included. Checkout remains unavailable until configuration is complete. A missing database shows a clearly marked sample catalogue, never purchasable demo inventory.

## Layout

- `src/`: storefront, shopping bag, delivery form, payment status and admin dashboard.
- `server/`: checkout, order status, admin endpoints and signed webhook verification.
- `supabase/migrations/001_hairluke.sql`: schema, stock reservation, RLS and photo storage policies.
- `tests/`: payment signature security tests.
- `public/images/`: original illustrative SVG artwork; replace with actual product photography.

## Operational limits

Stock is reserved atomically when a checkout is started. Abandoned or failed checkouts retain their reservations to prevent overselling; automated expiry/reconciliation is not implemented. Review pending orders in Supabase and Yoco before restoring stock. Do not blindly delete pending orders or release stock while a Yoco checkout can still be paid. A network failure during Yoco creation needs manual reconciliation using the order UUID as the Yoco idempotency key/external ID.

Refunds are performed in Yoco and must be reconciled manually in the database. Confirmation emails, tracking emails, discount codes, shipping-provider integration and customer accounts are not implemented. Admin login uses Supabase Auth; it does not provide public account signup. The dashboard shows the newest 100 orders. Prices, shipping and catalogue content need the owner's approval before launch. The policy page is a blocked-launch draft.

## Deployment

Use Vercel with GitHub; see VERCEL.md for the exact import and environment settings. No manual dist upload is needed. The backend is exported as a Vercel Function while local development uses the Node server. A standalone Node host is also supported with npm ci, npm run build, NODE_ENV=production and npm start.
