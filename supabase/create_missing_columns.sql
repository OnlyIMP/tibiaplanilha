-- Criar todas as colunas necessárias para o sistema de farms
-- Este SQL adiciona as colunas se elas não existirem

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

-- Verificar se as colunas foram criadas
SELECT 
    column_name,
    data_type,
    column_default
FROM 
    information_schema.columns 
WHERE 
    table_name = 'farm_entries'
ORDER BY 
    ordinal_position;