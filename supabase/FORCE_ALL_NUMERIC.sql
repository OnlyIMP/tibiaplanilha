-- FORÇAR TODAS AS COLUNAS NUMÉRICAS PARA NUMERIC
-- Execute este SQL que converte TUDO de uma vez

-- Primeiro, vamos ver o que existe
SELECT column_name, data_type, udt_name 
FROM information_schema.columns 
WHERE table_name = 'farm_entries';

-- Depois execute isto para converter TUDO:
DO $$
DECLARE
    col_record RECORD;
BEGIN
    -- Loop por todas as colunas que precisam ser NUMERIC
    FOR col_record IN 
        SELECT column_name 
        FROM information_schema.columns 
        WHERE table_name = 'farm_entries'
        AND column_name IN (
            'loot_gp', 'waste_gp', 'balance_gp', 
            'tc_value', 'tc_quantity', 'reais_value', 
            'hours', 'rate_per_hour', 'imbuement_cost_per_hour'
        )
    LOOP
        -- Verifica se a coluna existe e não é NUMERIC
        IF EXISTS (
            SELECT 1 FROM information_schema.columns 
            WHERE table_name = 'farm_entries' 
            AND column_name = col_record.column_name
            AND data_type != 'numeric'
        ) THEN
            -- Altera para NUMERIC
            EXECUTE format('ALTER TABLE farm_entries ALTER COLUMN %I TYPE NUMERIC USING COALESCE(%I::numeric, 0)', 
                          col_record.column_name, col_record.column_name);
            RAISE NOTICE 'Convertido % para NUMERIC', col_record.column_name;
        END IF;
    END LOOP;
    
    -- Adicionar colunas faltantes
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'farm_entries' AND column_name = 'loot_gp') THEN
        ALTER TABLE farm_entries ADD COLUMN loot_gp NUMERIC DEFAULT 0;
        RAISE NOTICE 'Adicionada coluna loot_gp';
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'farm_entries' AND column_name = 'waste_gp') THEN
        ALTER TABLE farm_entries ADD COLUMN waste_gp NUMERIC DEFAULT 0;
        RAISE NOTICE 'Adicionada coluna waste_gp';
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'farm_entries' AND column_name = 'balance_gp') THEN
        ALTER TABLE farm_entries ADD COLUMN balance_gp NUMERIC DEFAULT 0;
        RAISE NOTICE 'Adicionada coluna balance_gp';
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'farm_entries' AND column_name = 'tc_value') THEN
        ALTER TABLE farm_entries ADD COLUMN tc_value NUMERIC DEFAULT 0;
        RAISE NOTICE 'Adicionada coluna tc_value';
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'farm_entries' AND column_name = 'tc_quantity') THEN
        ALTER TABLE farm_entries ADD COLUMN tc_quantity NUMERIC DEFAULT 0;
        RAISE NOTICE 'Adicionada coluna tc_quantity';
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'farm_entries' AND column_name = 'reais_value') THEN
        ALTER TABLE farm_entries ADD COLUMN reais_value NUMERIC DEFAULT 0;
        RAISE NOTICE 'Adicionada coluna reais_value';
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'farm_entries' AND column_name = 'hours') THEN
        ALTER TABLE farm_entries ADD COLUMN hours NUMERIC DEFAULT 1;
        RAISE NOTICE 'Adicionada coluna hours';
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'farm_entries' AND column_name = 'rate_per_hour') THEN
        ALTER TABLE farm_entries ADD COLUMN rate_per_hour NUMERIC DEFAULT 0;
        RAISE NOTICE 'Adicionada coluna rate_per_hour';
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'farm_entries' AND column_name = 'imbuement_cost_per_hour') THEN
        ALTER TABLE farm_entries ADD COLUMN imbuement_cost_per_hour NUMERIC DEFAULT 0;
        RAISE NOTICE 'Adicionada coluna imbuement_cost_per_hour';
    END IF;
END $$;

-- Verificar resultado final
SELECT 
    column_name,
    data_type,
    CASE 
        WHEN data_type = 'numeric' THEN '✅ CORRIGIDO'
        ELSE '❌ AINDA ' || data_type
    END as status
FROM information_schema.columns 
WHERE table_name = 'farm_entries'
AND column_name IN (
    'loot_gp', 'waste_gp', 'balance_gp', 
    'tc_value', 'tc_quantity', 'reais_value', 
    'hours', 'rate_per_hour', 'imbuement_cost_per_hour'
)
ORDER BY column_name;