# 🔴 EXECUTE ESTE SQL AGORA NO SUPABASE

## Problema Identificado:
- `loot_gp` está como **BIGINT** ❌
- `waste_gp` está como **BIGINT** ❌  
- `balance_gp` está como **BIGINT** ❌

BIGINT não aceita decimais (como 885054.55), por isso dá erro!

## Solução - Execute este SQL:

```sql
-- Converter as 3 colunas problemáticas de BIGINT para NUMERIC
ALTER TABLE farm_entries
    ALTER COLUMN loot_gp TYPE NUMERIC USING COALESCE(loot_gp::numeric, 0),
    ALTER COLUMN waste_gp TYPE NUMERIC USING COALESCE(waste_gp::numeric, 0),
    ALTER COLUMN balance_gp TYPE NUMERIC USING COALESCE(balance_gp::numeric, 0);
```

## Após executar:
✅ Você poderá inserir "2kk" (2000000)  
✅ Poderá usar 0.3 horas  
✅ O erro será resolvido definitivamente!

## Se ainda houver problemas:
Execute o arquivo `SOLUCAO_FINAL.sql` que verifica e corrige TODAS as colunas numéricas.