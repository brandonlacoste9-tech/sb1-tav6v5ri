@@ .. @@
   created_at timestamptz default now()
 );
 
--- KPI Dashboard Views
-create or replace view kpi_dashboard as
-select 
-  -- Revenue Per Customer (RPC)
-  (
-    select coalesce(sum(amount), 0) / nullif(count(distinct user_id), 0)
-    from user_subscriptions 
-    where status = 'active'
-  ) as revenue_per_customer,
-  
-  -- Average Time to First Successful Ad (in minutes)
-  (
-    select avg(extract(epoch from (first_success - created_at)) / 60)
-    from (
-      select 
-        p.user_id,
-        p.created_at,
-        min(cs.created_at) as first_success
-      from profiles p
-      left join creative_scores cs on p.user_id = cs.user_id
-      where cs.prescore >= 0.7
-      group by p.user_id, p.created_at
-    ) ttfsa
-  ) as avg_time_to_first_success_minutes,
-  
-  -- Total Active Users
-  (
-    select count(*)
-    from profiles
-    where last_sign_in_at > now() - interval '30 days'
-  ) as active_users_30d,
-  
-  -- Switcher Conversion Rate
-  (
-    select 
-      count(case when acquisition_source like '%competitor%' then 1 end)::float / 
-      nullif(count(*), 0) * 100
-    from profiles
-    where created_at > now() - interval '30 days'
-  ) as switcher_percentage_30d;
-
 -- Row Level Security
 alter table migration_requests enable row level security;
 alter table creative_scores enable row level security;