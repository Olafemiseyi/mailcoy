ALTER TABLE "public"."gmail_connections" DROP CONSTRAINT IF EXISTS "gmail_connections_health_status_check";
ALTER TABLE "public"."gmail_connections" ADD CONSTRAINT "gmail_connections_health_status_check" CHECK (health_status IN ('healthy','degraded','revoked','error','paused'));
