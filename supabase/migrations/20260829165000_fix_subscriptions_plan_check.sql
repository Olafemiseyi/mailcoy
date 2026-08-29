-- Migration: Allow canonical lowercase and uppercase plan names in subscriptions
ALTER TABLE subscriptions DROP CONSTRAINT IF EXISTS subscriptions_plan_check;
ALTER TABLE subscriptions ADD CONSTRAINT subscriptions_plan_check CHECK (lower(plan) = ANY (ARRAY['free', 'starter', 'starter pro', 'growth', 'scale', 'enterprise', 'pro', 'custom']));
