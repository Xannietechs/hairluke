-- Run once in the Supabase SQL Editor. No sample products are published.
begin;
create table if not exists public.products (
 id uuid primary key default gen_random_uuid(), name text not null, category text not null check(category in ('Wigs','Bundles','Closures')),
 texture text not null, length text not null, colour text not null, description text not null default '',
 price_cents integer not null check(price_cents>=200), stock integer not null default 0 check(stock>=0),
 image_url text not null default '/images/bob.svg', active boolean not null default false, created_at timestamptz not null default now()
);
create table if not exists public.orders (
 id uuid primary key default gen_random_uuid(), lookup_token text not null unique,
 customer jsonb not null, items jsonb not null, shipping_cents integer not null check(shipping_cents>=0),
 total_cents integer not null check(total_cents>=200), status text not null default 'pending' check(status in ('pending','paid','shipped','cancelled','refunded')),
 checkout_id text unique, payment_id text unique, payment_mode text check(payment_mode in ('test','live')),
 created_at timestamptz not null default now(), paid_at timestamptz
);
create table if not exists public.store_settings (
 id integer primary key default 1 check(id=1), shipping_cents integer not null check(shipping_cents>=0 and shipping_cents<=1000000), contact_email text not null
);
insert into public.store_settings(id,shipping_cents,contact_email) values(1,8000,'tumzena@gmail.com') on conflict(id) do nothing;
alter table public.store_settings enable row level security;
revoke all on public.store_settings from anon,authenticated;
grant select on public.store_settings to anon,authenticated;
create policy "Public store settings" on public.store_settings for select to anon,authenticated using(true);
alter table public.products enable row level security;
alter table public.orders enable row level security;
revoke all on public.products,public.orders from anon,authenticated;
grant select on public.products to anon,authenticated;
create policy "Visitors read visible products" on public.products for select to anon,authenticated using(active=true);
-- Orders and administrative mutations are accessible only through the authenticated server.
create or replace function public.create_order(p_items jsonb,p_customer jsonb,p_shipping integer,p_token text,p_expected integer)
returns jsonb language plpgsql security definer set search_path=public,pg_temp as $$
declare item jsonb; product public.products; lines jsonb:='[]'::jsonb; total bigint:=p_shipping; order_id uuid;
begin
 if p_shipping<0 or jsonb_array_length(p_items)<1 or jsonb_array_length(p_items)>30 then raise exception 'Invalid cart'; end if;
 -- Stable locking order prevents concurrent checkouts from overselling or deadlocking.
 for item in select value from jsonb_array_elements(p_items) order by value->>'id' loop
   if (item->>'qty')::int<1 or (item->>'qty')::int>20 then raise exception 'Invalid quantity'; end if;
   select * into product from public.products where id=(item->>'id')::uuid for update;
   if not found or not product.active or product.stock<(item->>'qty')::int then raise exception 'Unavailable stock'; end if;
   total:=total+product.price_cents*(item->>'qty')::int;
   lines:=lines||jsonb_build_array(jsonb_build_object('id',product.id,'name',product.name,'length',product.length,'colour',product.colour,'qty',(item->>'qty')::int,'price_cents',product.price_cents));
   update public.products set stock=stock-(item->>'qty')::int where id=product.id;
 end loop;
 if total<>p_expected or total>100000000 then raise exception 'Cart total changed'; end if;
 insert into public.orders(lookup_token,customer,items,shipping_cents,total_cents) values(p_token,p_customer,lines,p_shipping,total::int) returning id into order_id;
 return jsonb_build_object('id',order_id,'total_cents',total);
end; $$;
create or replace function public.confirm_payment(p_checkout text,p_amount integer,p_payment text,p_mode text)
returns boolean language plpgsql security definer set search_path=public,pg_temp as $$
declare o public.orders;
begin
 select * into o from public.orders where checkout_id=p_checkout for update;
 if not found then return false; end if;
 if o.total_cents<>p_amount or (p_mode is not null and o.payment_mode<>p_mode) then raise exception 'Payment mismatch'; end if;
 if o.status in ('paid','shipped') then return o.payment_id=p_payment; end if;
 if o.status<>'pending' then raise exception 'Order is not pending'; end if;
 update public.orders set status='paid',payment_id=p_payment,paid_at=now() where id=o.id;
 return true;
end; $$;
-- Deliberately server-only. Do not grant these functions to browser roles.
revoke all on function public.create_order(jsonb,jsonb,integer,text,integer) from public,anon,authenticated;
revoke all on function public.confirm_payment(text,integer,text,text) from public,anon,authenticated;
grant execute on function public.create_order(jsonb,jsonb,integer,text,integer) to service_role;
grant execute on function public.confirm_payment(text,integer,text,text) to service_role;
insert into storage.buckets(id,name,public,file_size_limit,allowed_mime_types)
 values('product-images','product-images',true,5242880,array['image/jpeg','image/png','image/webp']) on conflict(id) do nothing;
create policy "Public product photos" on storage.objects for select to anon,authenticated using(bucket_id='product-images');
create policy "Admins upload product photos" on storage.objects for insert to authenticated
 with check(bucket_id='product-images' and (auth.jwt()->'app_metadata'->>'role')='admin');
create index orders_created_idx on public.orders(created_at desc);
commit;
