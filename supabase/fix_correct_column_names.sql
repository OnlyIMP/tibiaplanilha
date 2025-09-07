-- SOLUÇÃO DEFINITIVA - Criar/alterar colunas com os NOMES CORRETOS que o código espera

-- 1. Alterar colunas existentes para NUMERIC (se existirem)
DO $$
BEGIN
    -- Colunas com _gp
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'farm_entries' AND column_name = 'loot_gp') THEN
        ALTER TABLE farm_entries ALTER COLUMN loot_gp TYPE NUMERIC USING loot_gp::numeric;
    END IF;
    
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'farm_entries' AND column_name = 'waste_gp') THEN
        ALTER TABLE farm_entries ALTER COLUMN waste_gp TYPE NUMERIC USING waste_gp::numeric;
    END IF;
    
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'farm_entries' AND column_name = 'balance_gp') THEN
        ALTER TABLE farm_entries ALTER COLUMN balance_gp TYPE NUMERIC USING balance_gp::numeric;
    END IF;
    
    -- Colunas sem _gp
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'farm_entries' AND column_name = 'tc_value') THEN
        ALTER TABLE farm_entries ALTER COLUMN tc_value TYPE NUMERIC USING tc_value::numeric;
    END IF;
    
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'farm_entries' AND column_name = 'tc_quantity') THEN
        ALTER TABLE farm_entries ALTER COLUMN tc_quantity TYPE NUMERIC USING tc_quantity::numeric;
    END IF;
    
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'farm_entries' AND column_name = 'reais_value') THEN
        ALTER TABLE farm_entries ALTER COLUMN reais_value TYPE NUMERIC USING reais_value::numeric;
    END IF;
    
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'farm_entries' AND column_name = 'hours') THEN
        ALTER TABLE farm_entries ALTER COLUMN hours TYPE NUMERIC USING hours::numeric;
    END IF;
    
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'farm_entries' AND column_name = 'rate_per_hour') THEN
        ALTER TABLE farm_entries ALTER COLUMN rate_per_hour TYPE NUMERIC USING rate_per_hour::numeric;
    END IF;
END $$;

-- 2. Adicionar colunas que não existem (com os nomes CORRETOS)
ALTER TABLE farm_entries 
ADD COLUMN IF NOT EXISTS loot_gp NUMERIC DEFAULT 0,
ADD COLUMN IF NOT EXISTS waste_gp NUMERIC DEFAULT 0,
ADD COLUMN IF NOT EXISTS balance_gp NUMERIC DEFAULT 0,
ADD COLUMN IF NOT EXISTS tc_value NUMERIC DEFAULT 0,
ADD COLUMN IF NOT EXISTS tc_quantity NUMERIC DEFAULT 0,
ADD COLUMN IF NOT EXISTS reais_value NUMERIC DEFAULT 0,
ADD COLUMN IF NOT EXISTS hours NUMERIC DEFAULT 1,
ADD COLUMN IF NOT EXISTS rate_per_hour NUMERIC DEFAULT 0,
ADD COLUMN IF NOT EXISTS imbuement_cost_per_hour NUMERIC DEFAULT 0;

-- 3. Verificar o resultado final
SELECT 
    column_name,
    data_type,
    CASE 
        WHEN data_type = 'numeric' THEN '✅ OK - NUMERIC'
        WHEN data_type = 'bigint' THEN '❌ ERRO - Ainda é BIGINT'
        ELSE '⚠️ ' || data_type
    END as status
FROM 
    information_schema.columns 
WHERE 
    table_name = 'farm_entries'
    AND column_name IN ('loot_gp', 'waste_gp', 'balance_gp', 'tc_value', 'tc_quantity', 'reais_value', 'hours', 'rate_per_hour', 'imbuement_cost_per_hour')
ORDER BY 
    column_name;