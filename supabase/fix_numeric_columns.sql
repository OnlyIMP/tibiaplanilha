-- Corrigir tipos de dados para suportar valores decimais
-- Alterar colunas de BIGINT para NUMERIC para suportar valores decimais

ALTER TABLE farm_entries 
ALTER COLUMN loot TYPE NUMERIC USING loot::numeric,
ALTER COLUMN waste TYPE NUMERIC USING waste::numeric,
ALTER COLUMN balance TYPE NUMERIC USING balance::numeric,
ALTER COLUMN tc_value TYPE NUMERIC USING tc_value::numeric,
ALTER COLUMN tc_quantity TYPE NUMERIC USING tc_quantity::numeric,
ALTER COLUMN reais_value TYPE NUMERIC USING reais_value::numeric,
ALTER COLUMN hours TYPE NUMERIC USING hours::numeric,
ALTER COLUMN reais_per_hour TYPE NUMERIC USING reais_per_hour::numeric;

-- Verificar que as colunas foram alteradas
SELECT 
    column_name,
    data_type,
    numeric_precision,
    numeric_scale
FROM 
    information_schema.columns 
WHERE 
    table_name = 'farm_entries' 
    AND column_name IN ('loot', 'waste', 'balance', 'tc_value', 'tc_quantity', 'reais_value', 'hours', 'reais_per_hour')
ORDER BY 
    column_name;