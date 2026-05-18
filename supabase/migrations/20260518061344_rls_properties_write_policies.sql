-- RLS write policies for public.properties
-- Activated because RLS was enabled without write policies,
-- causing all INSERT/UPDATE/DELETE to be silently blocked.

-- Admins and agents can INSERT new properties
CREATE POLICY "admins_agents_insert_properties"
ON public.properties
FOR INSERT
TO public
WITH CHECK (get_my_role() IN ('admin', 'agent'));

-- Admins and agents can UPDATE existing properties
CREATE POLICY "admins_agents_update_properties"
ON public.properties
FOR UPDATE
TO public
USING (get_my_role() IN ('admin', 'agent'))
WITH CHECK (get_my_role() IN ('admin', 'agent'));

-- Only admins can DELETE properties
CREATE POLICY "admins_delete_properties"
ON public.properties
FOR DELETE
TO public
USING (get_my_role() = 'admin');
