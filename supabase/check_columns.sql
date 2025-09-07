-- Verificar os nomes das colunas na tabela farm_entries
SELECT 
    column_name,
    data_type,
    numeric_precision,
    numeric_scale
FROM 
    information_schema.columns 
WHERE 
    table_name = 'farm_entries'
ORDER BY 
    ordinal_position;