-- SOLUÇÃO COMPLETA - Altera tipos de colunas existentes e adiciona faltantes

-- 1. Primeiro, alterar o tipo das colunas que já existem para NUMERIC
DO $$
BEGIN
    -- Tentar alterar cada coluna se ela existir
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'farm_entries' AND column_name = 'loot') THEN
        ALTER TABLE farm_entries ALTER COLUMN loot TYPE NUMERIC USING loot::numeric;
    END IF;
    
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'farm_entries' AND column_name = 'waste') THEN
        ALTER TABLE farm_entries ALTER COLUMN waste TYPE NUMERIC USING waste::numeric;
    END IF;
    
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'farm_entries' AND column_name = 'balance') THEN
        ALTER TABLE farm_entries ALTER COLUMN balance TYPE NUMERIC USING balance::numeric;
    END IF;
    
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
    
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'farm_entries' AND column_name = 'reais_per_hour') THEN
        ALTER TABLE farm_entries ALTER COLUMN reais_per_hour TYPE NUMERIC USING reais_per_hour::numeric;
    END IF;
END $$;

-- 2. Adicionar colunas que não existem
ALTER TABLE farm_entries 
ADD COLUMN IF NOT EXISTS loot NUMERIC DEFAULT 0,
ADD COLUMN IF NOT EXISTS waste NUMERIC DEFAULT 0,
ADD COLUMN IF NOT EXISTS balance NUMERIC DEFAULT 0,
ADD COLUMN IF NOT EXISTS tc_value NUMERIC DEFAULT 0,
ADD COLUMN IF NOT EXISTS tc_quantity NUMERIC DEFAULT 0,
ADD COLUMN IF NOT EXISTS reais_value NUMERIC DEFAULT 0,
ADD COLUMN IF NOT EXISTS hours NUMERIC DEFAULT 1,
ADD COLUMN IF NOT EXISTS reais_per_hour NUMERIC DEFAULT 0,
ADD COLUMN IF NOT EXISTS imbuement_cost_per_hour NUMERIC DEFAULT 0;

-- 3. Verificar o resultado
SELECT 
    column_name,
    data_type,
    CASE 
        WHEN data_type = 'numeric' THEN '✅ OK'
        WHEN data_type = 'bigint' THEN '❌ PRECISA CORRIGIR'
        ELSE '⚠️ VERIFICAR'
    END as status
FROM 
    information_schema.columns 
WHERE 
    table_name = 'farm_entries'
    AND column_name IN ('loot', 'waste', 'balance', 'tc_value', 'tc_quantity', 'reais_value', 'hours', 'reais_per_hour', 'imbuement_cost_per_hour')
ORDER BY 
    column_name;