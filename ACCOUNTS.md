# Customer accounts

Local route: http://localhost:5173/account . Login, signup, email confirmation and password reset use Supabase Auth. Orders are matched on the server to the verified email returned by Supabase getUser, with literal escaped email matching. No email parameter is accepted. Customer signup cannot grant admin access. Guest checkout remains available.

Before public signup:
1. In Supabase Authentication URL Configuration, set Site URL to https://hairluke.vercel.app .
2. Add redirect URLs https://hairluke.vercel.app/account and https://hairluke.vercel.app/account?reset=1 . For local testing also add http://localhost:5173/account and http://localhost:5173/account?reset=1 .
3. Enable Email signup and keep Confirm email enabled.
4. Connect custom SMTP for customer confirmation/reset emails. Supabase's default sender is restricted to project team email addresses and is intended for testing. Never paste SMTP passwords into chat.
5. Test signup using your own email, follow confirmation, log in, request a reset, and verify your orders. No test accounts or emails were created automatically.

Stock deliveries and dispatch/delivered controls also require running supabase/migrations/002_inventory_fulfilment.sql once in Supabase SQL Editor. Account support itself requires no additional schema migration.

Docs: https://supabase.com/docs/guides/auth/auth-smtp and https://supabase.com/docs/guides/auth/redirect-urls .
