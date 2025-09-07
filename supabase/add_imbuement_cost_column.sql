-- Adicionar coluna para armazenar o custo de imbuement por hora nos farms
ALTER TABLE farm_entries 
ADD COLUMN IF NOT EXISTS imbuement_cost_per_hour NUMERIC DEFAULT 0;

-- Verificar que a coluna foi adicionada
SELECT 
    column_name,
    data_type,
    column_default
FROM 
    information_schema.columns 
WHERE 
    table_name = 'farm_entries' 
    AND column_name = 'imbuement_cost_per_hour';