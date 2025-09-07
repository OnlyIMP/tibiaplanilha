-- DIAGNÓSTICO COMPLETO - Execute este SQL para ver TODAS as colunas e seus tipos

SELECT 
    column_name,
    data_type,
    udt_name,
    is_nullable,
    column_default,
    CASE 
        WHEN data_type = 'numeric' THEN '✅ OK - NUMERIC'
        WHEN data_type = 'bigint' OR udt_name = 'int8' THEN '❌ PROBLEMA - É BIGINT!'
        WHEN data_type = 'integer' OR udt_name = 'int4' THEN '❌ PROBLEMA - É INTEGER!'
        ELSE '⚠️ TIPO: ' || data_type
    END as status
FROM 
    information_schema.columns 
WHERE 
    table_name = 'farm_entries'
ORDER BY 
    ordinal_position;

-- Se houver colunas BIGINT, execute este comando para corrigir TODAS de uma vez:
/*
ALTER TABLE farm_entries
    ALTER COLUMN id TYPE BIGINT USING id::bigint,  -- ID pode continuar BIGINT
    ALTER COLUMN player_id TYPE TEXT USING player_id::text,  -- player_id deve ser TEXT
    ALTER COLUMN player_name TYPE TEXT USING player_name::text,  -- player_name deve ser TEXT
    ALTER COLUMN loot_gp TYPE NUMERIC USING COALESCE(loot_gp::numeric, 0),
    ALTER COLUMN waste_gp TYPE NUMERIC USING COALESCE(waste_gp::numeric, 0),
    ALTER COLUMN balance_gp TYPE NUMERIC USING COALESCE(balance_gp::numeric, 0),
    ALTER COLUMN tc_value TYPE NUMERIC USING COALESCE(tc_value::numeric, 0),
    ALTER COLUMN tc_quantity TYPE NUMERIC USING COALESCE(tc_quantity::numeric, 0),
    ALTER COLUMN reais_value TYPE NUMERIC USING COALESCE(reais_value::numeric, 0),
    ALTER COLUMN hours TYPE NUMERIC USING COALESCE(hours::numeric, 1),
    ALTER COLUMN rate_per_hour TYPE NUMERIC USING COALESCE(rate_per_hour::numeric, 0),
    ALTER COLUMN imbuement_cost_per_hour TYPE NUMERIC USING COALESCE(imbuement_cost_per_hour::numeric, 0);
*/