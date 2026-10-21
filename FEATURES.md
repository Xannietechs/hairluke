# Hairluke feature update

Customer: saved favourites (this browser), product quick view, texture and stock filters, price/name sorting, private-link order tracking and recent checkouts on this device, FAQs, responsive editorial design.

Admin: live revenue/fulfilment/stock overview; latest 100 orders; low-stock alerts; inventory and order filters; filtered CSV export with spreadsheet formula escaping; draft product duplication; publish/hide actions; photo preview; persistent admin section selection. Test orders are excluded from live revenue. No schema migration is required.

Generated hero asset: public/images/editorial-hero.png. Built-in image generation produced an aspirational studio portrait, not a photograph of listed stock. Prompt: adult Black woman with long black body-wave hair, ivory top, beige studio background, warm editorial lighting, no text or logos. Original product photos and listings are retained.

Favourites and recent checkout links are saved in browser local storage, not synced to accounts. Tracking requires the private checkout link; order UUID alone never reveals customer information. Refunds and reservation reconciliation remain manual, as documented in README.md.

Validation: 13 automated tests cover filters, statistics, safe CSV output, product payloads, webhook authentication and the Vercel API boundary. Browser checks cover favourites, quick view, tracking validation and the cart. The authenticated admin dashboard requires the owner's login for a final visual review.

## Stock, delivery and free colour studio

Run supabase/migrations/002_inventory_fulfilment.sql once to enable stock movements and delivery metadata. Admin can add supplier deliveries/returns, remove damage or make signed corrections; the database locks the stock row and records an audit entry. Editing existing product metadata never overwrites its stock count. The dashboard shows the latest 50 manual stock movements. Initial product stock and checkout reservations are not manual stock-adjustment events.

Only live paid orders can be dispatched; only dispatched orders can be marked delivered. Courier/tracking details are visible to private-link order holders. Delivery status does not deduct stock again. Test orders cannot be fulfilled. If the migration is missing, the added controls stay disabled and the old data remains readable.

A free, private browser-only colour preview is at /try-on. It changes the colour of existing hair only; a generated hairstyle/wig try-on is not implemented. See COLOUR-STUDIO.md for compatibility, privacy and hosting limits.
