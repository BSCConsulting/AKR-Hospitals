/*
# Lock down opd_sessions writes

If the earlier migration already applied open INSERT/UPDATE/DELETE policies for anon,
drop them so only SELECT remains for the public client. Staff must update the queue via
the Supabase service role / dashboard.
*/

DROP POLICY IF EXISTS "anon_insert_opd_sessions" ON opd_sessions;
DROP POLICY IF EXISTS "anon_update_opd_sessions" ON opd_sessions;
DROP POLICY IF EXISTS "anon_delete_opd_sessions" ON opd_sessions;
