# Complete your Hairluke setup

The app code is prepared. The following require access to your Supabase and Yoco accounts and cannot be completed using a Supabase publishable key.

1. In your Supabase project, open SQL Editor and run `supabase/migrations/001_hairluke.sql` once. It creates products, orders, server-only order/payment functions and the photo bucket. No sample products are inserted.
2. In Supabase Authentication, create an admin user with email/password. Set its **app_metadata** (not user_metadata) to `{"role":"admin"}` using a trusted management interface or the service-role Admin API. Never expose service-role credentials to the browser. For a newly created user, an alternative SQL Editor command is:

```sql
update auth.users
set raw_app_meta_data = coalesce(raw_app_meta_data, '{}'::jsonb) || '{"role":"admin"}'::jsonb
where id = 'REPLACE-WITH-THE-ADMIN-USER-UUID';
```

Sign out and in again after assigning the role.

3. Put your Supabase server secret/service-role key into `.env.local` as `SUPABASE_SERVICE_ROLE_KEY`. It is used only by Node. Keep your existing `VITE_` values. Never paste server secrets into chat or commit them.
4. In Yoco, enable the Checkout API and obtain a **test** secret key. Set `YOCO_SECRET_KEY` locally/on your host. Do not use live keys during development.
5. Give the backend a public HTTPS URL (a development tunnel is needed for local webhook testing). Register a webhook using Yoco's API at `POST https://payments.yoco.com/api/webhooks`, with a name and your HTTPS URL ending `/api/webhooks/yoco`. Save the one-time returned secret as `YOCO_WEBHOOK_SECRET`.
6. Set `APP_URL` to your public frontend/backend URL. For a local-only visual preview, keep `http://localhost:5173`. Restart after environment changes.
7. Open `/admin`, sign in, and add real products with prices, stock, photos, length and colour. Each product row represents one length/colour variant. Uncheck visibility to archive a product.
8. Delivery starts at R80 and contact email is tumzena@gmail.com. Change these under Shop settings in `/admin`. Update `src/main.js`'s `policies()` content with business identity, contact details, delivery coverage/times, return/refund terms and privacy details. Remove the draft notice after completing it.
9. Set `STORE_READY=true` for an end-to-end **test** purchase. Confirm that the order becomes paid only after the authentic webhook, including when the customer does not return to the website. Test repeated webhooks, failed/cancelled checkout and two buyers competing for the last item. Clean up test orders and stock before launch.
10. Verify your domain in Yoco, replace test secrets with live secrets, register the appropriate live webhook, deploy on a Node host and perform final checks. Do not fulfil test-mode orders; the database stores payment_mode for reconciliation.

## Required acceptance checks before launch

- Anonymous visitors cannot read orders, mutate products or execute order/payment database functions.
- A non-admin account cannot access `/api/admin` or upload product images.
- The browser cannot change the price; stale totals are rejected.
- Empty/malformed carts, unavailable stock and invalid delivery details fail safely.
- Yoco success-page redirects alone never mark orders paid.
- Review retention, backup and refund procedures, and pending stock reservations.

Official references: https://developer.yoco.com/guides/online-payments/accepting-a-payment and https://developer.yoco.com/guides/online-payments/webhooks/verifying-the-events
