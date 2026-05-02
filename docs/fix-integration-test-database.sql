-- Repair script for the integration-test Supabase project.
-- Run this in the Supabase SQL Editor for project manuzpfkmjcflcrizsmn.

begin;

alter table public.inventories
  drop constraint if exists inventories_name_not_blank;

alter table public.inventories
  add constraint inventories_name_not_blank
  check (length(btrim(name)) > 0);

drop function if exists public.create_restock_transaction(uuid, integer, text);

create or replace function public.create_restock_transaction(
  p_inventory_id uuid,
  p_quantity_added integer,
  p_notes text default null
)
returns table (
  id uuid,
  inventory_id uuid,
  inventory_name text,
  quantity_added integer,
  notes text,
  restocked_at timestamptz
)
language plpgsql
security invoker
set search_path = public
as $$
declare
  v_user_id uuid;
  v_inventory_name text;
  v_restock_id uuid;
  v_restock_inventory_id uuid;
  v_restock_quantity_added integer;
  v_restock_notes text;
  v_restocked_at timestamptz;
begin
  v_user_id := auth.uid();

  if v_user_id is null then
    raise exception 'You must be signed in to add a restock.';
  end if;

  if p_quantity_added is null or p_quantity_added <= 0 then
    raise exception 'Restock quantity must be greater than zero.';
  end if;

  update public.inventories as inv
  set quantity = inv.quantity + p_quantity_added
  where inv.id = p_inventory_id
    and inv.user_id = v_user_id
  returning inv.name into v_inventory_name;

  if not found then
    raise exception 'Inventory item not found or not owned by current user.';
  end if;

  insert into public.restocks as r (
    inventory_id,
    user_id,
    quantity_added,
    notes
  )
  values (
    p_inventory_id,
    v_user_id,
    p_quantity_added,
    nullif(trim(coalesce(p_notes, '')), '')
  )
  returning
    r.id,
    r.inventory_id,
    r.quantity_added,
    r.notes,
    r.restocked_at
  into
    v_restock_id,
    v_restock_inventory_id,
    v_restock_quantity_added,
    v_restock_notes,
    v_restocked_at;

  return query
  select
    v_restock_id,
    v_restock_inventory_id,
    v_inventory_name,
    v_restock_quantity_added,
    coalesce(v_restock_notes, ''),
    v_restocked_at;
end;
$$;

grant execute on function public.create_restock_transaction(uuid, integer, text)
to authenticated;

commit;
