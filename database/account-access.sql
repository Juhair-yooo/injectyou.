-- Account bootstrap for Supabase Auth. No client may create an admin account,
-- modify its own role or approval status, or read another account's profile.
begin;
create table public.injectyou_accounts (
  id uuid primary key references auth.users(id) on delete cascade,
  role text not null check (role in ('intern','company','admin')),
  display_name text not null check (length(btrim(display_name)) between 1 and 120),
  contact_name text check (contact_name is null or length(btrim(contact_name)) between 1 and 120),
  status text not null check (status in ('active','pending','blocked')),
  created_at timestamptz not null default now(),
  check ((role = 'company' and contact_name is not null) or role <> 'company')
);
alter table public.injectyou_accounts enable row level security;
revoke all on public.injectyou_accounts from public, anon, authenticated;
grant select on public.injectyou_accounts to authenticated;
grant insert (id,role,display_name,contact_name,status) on public.injectyou_accounts to authenticated;
grant update (display_name,contact_name) on public.injectyou_accounts to authenticated;
create policy account_read_self on public.injectyou_accounts for select to authenticated
  using (id = (select auth.uid()));
create policy account_register_self on public.injectyou_accounts for insert to authenticated
  with check (id = (select auth.uid()) and ((role = 'intern' and status = 'active') or (role = 'company' and status = 'pending')));
create policy account_update_self on public.injectyou_accounts for update to authenticated
  using (id = (select auth.uid()) and status <> 'blocked')
  with check (id = (select auth.uid()) and status <> 'blocked');
commit;
