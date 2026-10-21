-- Run once in Supabase SQL Editor after 001_hairluke.sql.
begin;
alter table public.orders drop constraint if exists orders_status_check;
alter table public.orders add constraint orders_status_check check(status in ('pending','paid','shipped','delivered','cancelled','refunded'));
alter table public.orders add column if not exists shipped_at timestamptz;
alter table public.orders add column if not exists delivered_at timestamptz;
alter table public.orders add column if not exists courier text;
alter table public.orders add column if not exists tracking_number text;
create table if not exists public.stock_movements (
 id uuid primary key default gen_random_uuid(), product_id uuid not null references public.products(id),
 quantity integer not null check(quantity<>0), stock_before integer not null, stock_after integer not null check(stock_after>=0),
 reason text not null check(reason in ('received','returned','damaged','correction')), note text not null default '',
 admin_id uuid not null, created_at timestamptz not null default now()
);
alter table public.stock_movements enable row level security;
revoke all on public.stock_movements from public,anon,authenticated;
grant all on public.stock_movements to service_role;
create index if not exists stock_movements_created_idx on public.stock_movements(created_at desc);
create or replace function public.adjust_stock(p_product uuid,p_quantity integer,p_reason text,p_note text,p_admin uuid)
returns jsonb language plpgsql security definer set search_path=public,pg_temp as $$
declare before_stock integer; after_stock integer;
begin
 if p_quantity=0 or abs(p_quantity::bigint)>100000 or p_admin is null or p_reason not in ('received','returned','damaged','correction') or char_length(coalesce(p_note,''))>500 then raise exception 'Invalid adjustment'; end if;
 if (p_reason in ('received','returned') and p_quantity<0) or (p_reason='damaged' and p_quantity>0) then raise exception 'Invalid adjustment direction'; end if;
 select stock into before_stock from public.products where id=p_product for update;
 if not found then raise exception 'Product not found'; end if;
 after_stock:=before_stock+p_quantity;
 if after_stock<0 or after_stock>100000 then raise exception 'Stock outside permitted range'; end if;
 update public.products set stock=after_stock where id=p_product;
 insert into public.stock_movements(product_id,quantity,stock_before,stock_after,reason,note,admin_id) values(p_product,p_quantity,before_stock,after_stock,p_reason,coalesce(p_note,''),p_admin);
 return jsonb_build_object('stock_before',before_stock,'stock_after',after_stock);
end; $$;
revoke all on function public.adjust_stock(uuid,integer,text,text,uuid) from public,anon,authenticated;
grant execute on function public.adjust_stock(uuid,integer,text,text,uuid) to service_role;
-- Repeated payment notifications must not reverse a delivered order.
create or replace function public.confirm_payment(p_checkout text,p_amount integer,p_payment text,p_mode text)
returns boolean language plpgsql security definer set search_path=public,pg_temp as $$
declare o public.orders;
begin
 select * into o from public.orders where checkout_id=p_checkout for update;
 if not found then return false; end if;
 if o.total_cents<>p_amount or (p_mode is not null and o.payment_mode<>p_mode) then raise exception 'Payment mismatch'; end if;
 if o.status in ('paid','shipped','delivered') then return o.payment_id=p_payment; end if;
 if o.status<>'pending' then raise exception 'Order is not pending'; end if;
 update public.orders set status='paid',payment_id=p_payment,paid_at=now() where id=o.id;
 return true;
end; $$;
revoke all on function public.confirm_payment(text,integer,text,text) from public,anon,authenticated;
grant execute on function public.confirm_payment(text,integer,text,text) to service_role;
commit;
