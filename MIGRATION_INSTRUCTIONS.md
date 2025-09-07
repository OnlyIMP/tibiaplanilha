# Instruções para aplicar a migração do banco de dados

## IMPORTANTE: Execute TODOS estes SQLs no Supabase

1. Acesse o Supabase Dashboard
2. Vá para SQL Editor
3. Execute os seguintes comandos SQL em ordem:

### 1. Adicionar coluna de custo de imbuement nos farms
```sql
-- Adicionar coluna para armazenar o custo de imbuement por hora nos farms
ALTER TABLE farm_entries 
ADD COLUMN IF NOT EXISTS imbuement_cost_per_hour NUMERIC DEFAULT 0;
```

### 2. Adicionar colunas de preços dos itens de imbuement

```sql
-- Adicionar campos para armazenar os preços dos itens de imbuement
ALTER TABLE imbuements 
-- Life Leech prices
ADD COLUMN IF NOT EXISTS vampire_teeth_price NUMERIC DEFAULT 1898,
ADD COLUMN IF NOT EXISTS bloody_pincers_price NUMERIC DEFAULT 9988,
ADD COLUMN IF NOT EXISTS piece_of_dead_brain_price NUMERIC DEFAULT 18999,

-- Mana Leech prices  
ADD COLUMN IF NOT EXISTS rope_belt_price NUMERIC DEFAULT 4800,
ADD COLUMN IF NOT EXISTS silencer_claws_price NUMERIC DEFAULT 2995,
ADD COLUMN IF NOT EXISTS grimeleech_wings_price NUMERIC DEFAULT 1436,

-- Critical prices
ADD COLUMN IF NOT EXISTS protective_charm_price NUMERIC DEFAULT 780,
ADD COLUMN IF NOT EXISTS sabretooth_price NUMERIC DEFAULT 390,
ADD COLUMN IF NOT EXISTS vexclaw_talon_price NUMERIC DEFAULT 1274,

-- Skill Sword prices
ADD COLUMN IF NOT EXISTS lions_mane_price NUMERIC DEFAULT 150,
ADD COLUMN IF NOT EXISTS moohtah_shell_price NUMERIC DEFAULT 4300,
ADD COLUMN IF NOT EXISTS war_crystal_price NUMERIC DEFAULT 970,

-- Fire Protection prices
ADD COLUMN IF NOT EXISTS green_dragon_leather_price NUMERIC DEFAULT 16000,
ADD COLUMN IF NOT EXISTS blazing_bone_price NUMERIC DEFAULT 1554,
ADD COLUMN IF NOT EXISTS draken_sulphur_price NUMERIC DEFAULT 1998,

-- Death Protection prices
ADD COLUMN IF NOT EXISTS flask_embalming_price NUMERIC DEFAULT 8874,
ADD COLUMN IF NOT EXISTS gloom_wolf_fur_price NUMERIC DEFAULT 21587,
ADD COLUMN IF NOT EXISTS mystical_hourglass_price NUMERIC DEFAULT 700;
```

## Após executar a migração:

1. Faça F5 na página
2. Vá para a aba "Imbuements"
3. Configure seus imbuements e preços
4. Clique em "Salvar Configuração"
5. Faça F5 novamente para verificar que os dados persistiram
6. Ao adicionar um farm, o custo de imbuement por hora será automaticamente descontado