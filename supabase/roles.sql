-- Role passwords for the local docker-compose stack.
-- Mounted to /docker-entrypoint-initdb.d/init-scripts/99-roles.sql, which the
-- supabase/postgres entrypoint explicitly calls after running migrate.sh.
-- Passwords must match what the service containers use in their connection URLs.
alter user authenticator          with password 'postgres';
alter user pgbouncer              with password 'postgres';
alter user supabase_auth_admin    with password 'postgres';
alter user supabase_storage_admin with password 'postgres';
alter user supabase_replication_admin with password 'postgres';
alter user supabase_read_only_user    with password 'postgres';
