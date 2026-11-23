-- Proposed migration: company briefs and controlled admin review.
-- Test before applying to a live project. No client can grant itself admin access.
begin;
create schema injectyou_internal;
revoke all on schema injectyou_internal from public, anon, authenticated;
create table injectyou_internal.account_review_events (
 id bigint generated always as identity primary key,
 actor_id uuid not null references auth.users(id),
 company_id uuid not null references public.injectyou_accounts(id),
 old_status text not null,
 new_status text not null,
 created_at timestamptz not null default now()
);
alter table injectyou_internal.account_review_events enable row level security;
revoke all on injectyou_internal.account_review_events from public, anon, authenticated;

create function injectyou_internal.is_active_admin()
returns boolean language sql stable security definer set search_path = ''
as $$
 select exists (select 1 from public.injectyou_accounts a where a.id = (select auth.uid()) and a.role = 'admin' and a.status = 'active');
$$;
revoke all on function injectyou_internal.is_active_admin() from public, anon, authenticated;
grant usage on schema injectyou_internal to authenticated;
grant execute on function injectyou_internal.is_active_admin() to authenticated;

create policy account_read_admin on public.injectyou_accounts for select to authenticated
 using ((select injectyou_internal.is_active_admin()));

create function injectyou_internal.review_company(target_id uuid, desired_status text)
returns void language plpgsql security definer set search_path = ''
as $$
declare prior_status text;
begin
 if not (select injectyou_internal.is_active_admin()) then
  raise exception 'Not authorized' using errcode = '42501';
 end if;
 if desired_status not in ('active', 'blocked') then
  raise exception 'Invalid review status' using errcode = '22023';
 end if;
 select status into prior_status from public.injectyou_accounts where id = target_id and role = 'company' for update;
 if not found then raise exception 'Company account not found' using errcode = 'P0002'; end if;
 update public.injectyou_accounts set status = desired_status where id = target_id;
 insert into injectyou_internal.account_review_events(actor_id, company_id, old_status, new_status)
 values ((select auth.uid()), target_id, prior_status, desired_status);
end;
$$;
revoke all on function injectyou_internal.review_company(uuid,text) from public, anon, authenticated;
grant execute on function injectyou_internal.review_company(uuid,text) to authenticated;
create function public.injectyou_review_company(target_id uuid, desired_status text)
returns void language sql security invoker set search_path = ''
as $$ select injectyou_internal.review_company(target_id, desired_status); $$;
revoke all on function public.injectyou_review_company(uuid,text) from public, anon, authenticated;
grant execute on function public.injectyou_review_company(uuid,text) to authenticated;

create table public.injectyou_briefs (
 id uuid primary key default gen_random_uuid(),
 company_id uuid not null references public.injectyou_accounts(id),
 title text not null check (length(btrim(title)) between 1 and 120),
 description text not null check (length(btrim(description)) between 1 and 5000),
 field text not null check (field in ('Design','Data analysis','Cybersecurity','Management')),
 deadline date,
 status text not null default 'submitted' check (status in ('submitted','reviewed','archived')),
 created_at timestamptz not null default now()
);
alter table public.injectyou_briefs enable row level security;
revoke all on public.injectyou_briefs from public, anon, authenticated;
grant select on public.injectyou_briefs to authenticated;
grant insert(company_id,title,description,field,deadline) on public.injectyou_briefs to authenticated;
grant update(status) on public.injectyou_briefs to authenticated;
create policy brief_select on public.injectyou_briefs for select to authenticated using (
 (select injectyou_internal.is_active_admin()) or
 (company_id = (select auth.uid()) and exists (select 1 from public.injectyou_accounts a where a.id=(select auth.uid()) and a.role='company' and a.status='active'))
);
create policy brief_insert on public.injectyou_briefs for insert to authenticated with check (
 company_id = (select auth.uid()) and status = 'submitted' and
 exists (select 1 from public.injectyou_accounts a where a.id=(select auth.uid()) and a.role='company' and a.status='active')
);
create policy brief_update_admin on public.injectyou_briefs for update to authenticated
 using ((select injectyou_internal.is_active_admin())) with check ((select injectyou_internal.is_active_admin()));

create table public.injectyou_opportunities (
 id uuid primary key default gen_random_uuid(),
 title text not null check (length(btrim(title)) between 1 and 120),
 description text not null check (length(btrim(description)) between 1 and 5000),
 field text not null check (field in ('Design','Data analysis','Cybersecurity','Management')),
 fee_minor integer not null check (fee_minor >= 0 and fee_minor <= 100000000),
 currency text not null default 'USD' check (currency = 'USD'),
 deadline date,
 status text not null default 'open' check (status in ('open','closed')),
 created_at timestamptz not null default now()
);
alter table public.injectyou_opportunities enable row level security;
revoke all on public.injectyou_opportunities from public, anon, authenticated;
grant select on public.injectyou_opportunities to authenticated;
grant insert(title,description,field,fee_minor,deadline) on public.injectyou_opportunities to authenticated;
grant update(status) on public.injectyou_opportunities to authenticated;
create policy opportunity_select on public.injectyou_opportunities for select to authenticated using (
 (select injectyou_internal.is_active_admin()) or
 (status='open' and exists (select 1 from public.injectyou_accounts a where a.id=(select auth.uid()) and a.role='intern' and a.status='active'))
);
create policy opportunity_insert on public.injectyou_opportunities for insert to authenticated with check ((select injectyou_internal.is_active_admin()));
create policy opportunity_update on public.injectyou_opportunities for update to authenticated using ((select injectyou_internal.is_active_admin())) with check ((select injectyou_internal.is_active_admin()));

create table public.injectyou_applications (
 id uuid primary key default gen_random_uuid(),
 opportunity_id uuid not null references public.injectyou_opportunities(id),
 intern_id uuid not null references public.injectyou_accounts(id),
 message text not null check (length(btrim(message)) between 1 and 2000),
 status text not null default 'applied' check (status in ('applied','assigned','declined')),
 created_at timestamptz not null default now(),
 unique(opportunity_id, intern_id)
);
alter table public.injectyou_applications enable row level security;
revoke all on public.injectyou_applications from public, anon, authenticated;
grant select on public.injectyou_applications to authenticated;
grant insert(opportunity_id,intern_id,message) on public.injectyou_applications to authenticated;
grant update(status) on public.injectyou_applications to authenticated;
create policy application_select on public.injectyou_applications for select to authenticated using (
 (select injectyou_internal.is_active_admin()) or
 (intern_id=(select auth.uid()) and exists (select 1 from public.injectyou_accounts a where a.id=(select auth.uid()) and a.role='intern' and a.status='active'))
);
create policy application_insert on public.injectyou_applications for insert to authenticated with check (
 intern_id=(select auth.uid()) and status='applied' and
 exists (select 1 from public.injectyou_accounts a where a.id=(select auth.uid()) and a.role='intern' and a.status='active') and
 exists (select 1 from public.injectyou_opportunities o where o.id=opportunity_id and o.status='open')
);
create policy application_update on public.injectyou_applications for update to authenticated using ((select injectyou_internal.is_active_admin())) with check ((select injectyou_internal.is_active_admin()));

commit;


