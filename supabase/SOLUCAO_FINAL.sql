-- SOLUÇÃO FINAL - Corrigir as colunas que estão como BIGINT

-- Converter as colunas BIGINT para NUMERIC
ALTER TABLE farm_entries
    ALTER COLUMN loot_gp TYPE NUMERIC USING COALESCE(loot_gp::numeric, 0),
    ALTER COLUMN waste_gp TYPE NUMERIC USING COALESCE(waste_gp::numeric, 0),
    ALTER COLUMN balance_gp TYPE NUMERIC USING COALESCE(balance_gp::numeric, 0);

-- Verificar se ainda há outras colunas numéricas como BIGINT
DO $$
BEGIN
    -- tc_value
    IF EXISTS (SELECT 1 FROM information_schema.columns 
               WHERE table_name = 'farm_entries' 
               AND column_name = 'tc_value' 
               AND data_type = 'bigint') THEN
        ALTER TABLE farm_entries ALTER COLUMN tc_value TYPE NUMERIC USING COALESCE(tc_value::numeric, 0);
    END IF;
    
    -- tc_quantity
    IF EXISTS (SELECT 1 FROM information_schema.columns 
               WHERE table_name = 'farm_entries' 
               AND column_name = 'tc_quantity' 
               AND data_type = 'bigint') THEN
        ALTER TABLE farm_entries ALTER COLUMN tc_quantity TYPE NUMERIC USING COALESCE(tc_quantity::numeric, 0);
    END IF;
    
    -- reais_value
    IF EXISTS (SELECT 1 FROM information_schema.columns 
               WHERE table_name = 'farm_entries' 
               AND column_name = 'reais_value' 
               AND data_type = 'bigint') THEN
        ALTER TABLE farm_entries ALTER COLUMN reais_value TYPE NUMERIC USING COALESCE(reais_value::numeric, 0);
    END IF;
    
    -- hours
    IF EXISTS (SELECT 1 FROM information_schema.columns 
               WHERE table_name = 'farm_entries' 
               AND column_name = 'hours' 
               AND data_type = 'bigint') THEN
        ALTER TABLE farm_entries ALTER COLUMN hours TYPE NUMERIC USING COALESCE(hours::numeric, 1);
    END IF;
    
    -- rate_per_hour
    IF EXISTS (SELECT 1 FROM information_schema.columns 
               WHERE table_name = 'farm_entries' 
               AND column_name = 'rate_per_hour' 
               AND data_type = 'bigint') THEN
        ALTER TABLE farm_entries ALTER COLUMN rate_per_hour TYPE NUMERIC USING COALESCE(rate_per_hour::numeric, 0);
    END IF;
    
    -- imbuement_cost_per_hour
    IF EXISTS (SELECT 1 FROM information_schema.columns 
               WHERE table_name = 'farm_entries' 
               AND column_name = 'imbuement_cost_per_hour' 
               AND data_type = 'bigint') THEN
        ALTER TABLE farm_entries ALTER COLUMN imbuement_cost_per_hour TYPE NUMERIC USING COALESCE(imbuement_cost_per_hour::numeric, 0);
    END IF;
END $$;

-- Adicionar colunas faltantes (se não existirem)
ALTER TABLE farm_entries
    ADD COLUMN IF NOT EXISTS imbuement_cost_per_hour NUMERIC DEFAULT 0;

-- Verificar resultado final
SELECT 
    column_name,
    data_type,
    CASE 
        WHEN data_type = 'numeric' THEN '✅ CORRIGIDO - Agora é NUMERIC'
        WHEN data_type = 'bigint' THEN '❌ ERRO - Ainda é BIGINT!'
        WHEN data_type IN ('text', 'character varying') THEN '✅ OK - Texto'
        WHEN data_type LIKE 'timestamp%' THEN '✅ OK - Data/Hora'
        ELSE '⚠️ ' || data_type
    END as status
FROM 
    information_schema.columns 
WHERE 
    table_name = 'farm_entries'
    AND column_name IN ('loot_gp', 'waste_gp', 'balance_gp', 'tc_value', 'tc_quantity', 'reais_value', 'hours', 'rate_per_hour', 'imbuement_cost_per_hour')
ORDER BY 
    column_name;