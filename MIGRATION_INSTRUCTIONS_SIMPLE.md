# INSTRUÇÕES SIMPLIFICADAS - Execute APENAS este SQL

## No Supabase, execute este comando único que resolve todos os problemas:

```sql
-- Criar todas as colunas necessárias (se não existirem)
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

-- Criar colunas de preços na tabela imbuements
ALTER TABLE imbuements 
ADD COLUMN IF NOT EXISTS vampire_teeth_price NUMERIC DEFAULT 1898,
ADD COLUMN IF NOT EXISTS bloody_pincers_price NUMERIC DEFAULT 9988,
ADD COLUMN IF NOT EXISTS piece_of_dead_brain_price NUMERIC DEFAULT 18999,
ADD COLUMN IF NOT EXISTS rope_belt_price NUMERIC DEFAULT 4800,
ADD COLUMN IF NOT EXISTS silencer_claws_price NUMERIC DEFAULT 2995,
ADD COLUMN IF NOT EXISTS grimeleech_wings_price NUMERIC DEFAULT 1436,
ADD COLUMN IF NOT EXISTS protective_charm_price NUMERIC DEFAULT 780,
ADD COLUMN IF NOT EXISTS sabretooth_price NUMERIC DEFAULT 390,
ADD COLUMN IF NOT EXISTS vexclaw_talon_price NUMERIC DEFAULT 1274,
ADD COLUMN IF NOT EXISTS lions_mane_price NUMERIC DEFAULT 150,
ADD COLUMN IF NOT EXISTS moohtah_shell_price NUMERIC DEFAULT 4300,
ADD COLUMN IF NOT EXISTS war_crystal_price NUMERIC DEFAULT 970,
ADD COLUMN IF NOT EXISTS green_dragon_leather_price NUMERIC DEFAULT 16000,
ADD COLUMN IF NOT EXISTS blazing_bone_price NUMERIC DEFAULT 1554,
ADD COLUMN IF NOT EXISTS draken_sulphur_price NUMERIC DEFAULT 1998,
ADD COLUMN IF NOT EXISTS flask_embalming_price NUMERIC DEFAULT 8874,
ADD COLUMN IF NOT EXISTS gloom_wolf_fur_price NUMERIC DEFAULT 21587,
ADD COLUMN IF NOT EXISTS mystical_hourglass_price NUMERIC DEFAULT 700;
```

## Pronto! 
Após executar este SQL, você poderá:
- ✅ Registrar farms com valores como "2kk" 
- ✅ Usar frações de hora como 0.3 (18 minutos) ou 0.5 (30 minutos)
- ✅ Salvar custos de imbuements
- ✅ Salvar preços personalizados dos itens