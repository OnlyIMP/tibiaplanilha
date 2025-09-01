-- EXECUTE ESTE SQL NO SUPABASE PARA ADICIONAR AS NOVAS COLUNAS

-- 1. Adicionar colunas de horas e taxa por hora na tabela farm_entries
ALTER TABLE farm_entries 
ADD COLUMN IF NOT EXISTS hours DECIMAL(10, 2) DEFAULT 0,
ADD COLUMN IF NOT EXISTS rate_per_hour DECIMAL(10, 2) DEFAULT 0;

-- 2. Adicionar política de update para farm_entries (se não existir)
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'farm_entries' 
        AND policyname = 'Enable update for all users'
    ) THEN
        CREATE POLICY "Enable update for all users" ON farm_entries
            FOR UPDATE USING (true);
    END IF;
END $$;

-- 3. Atualizar registros existentes com valores padrão
UPDATE farm_entries 
SET 
    hours = COALESCE(hours, 2),
    rate_per_hour = CASE 
        WHEN COALESCE(hours, 2) > 0 THEN reais_value / COALESCE(hours, 2)
        ELSE 0
    END
WHERE hours IS NULL OR rate_per_hour IS NULL;