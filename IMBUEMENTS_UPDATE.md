# Atualização de Imbuements - Tibia Farm Calculator

## Alterações Implementadas

### 1. Nova Funcionalidade: Calculadora de Imbuements
- Adicionada uma nova aba "Imbuements" no sistema
- Permite calcular o custo total dos imbuements e o custo por hora
- Salva configurações por jogador no localStorage

### 2. Imbuements Disponíveis

#### Life Leech (Vampirism)
- 6 Gold Tokens + 250k de aplicação
- Ícone: ![Life Leech](https://www.tibiawiki.com.br/images/6/6e/Vampirism_%28Roubo_de_Vida%29.gif)

#### Mana Leech (Void)
- 2 Gold Tokens
- 25 Silence Claws (3k cada)
- 7 Some Grimeleach (1431 cada)
- 250k de aplicação
- Ícone: ![Mana Leech](https://www.tibiawiki.com.br/images/4/40/Void_%28Roubo_de_Mana%29.gif)

#### Critical Strike
- 4 Gold Tokens
- 8 Vexclaw Talons (1274 cada)
- 250k de aplicação
- Ícone: ![Critical](https://www.tibiawiki.com.br/images/1/14/Strike_%28Dano_Cr%C3%ADtico%29.gif)

#### Skill Sword
- 25 Lion's Mane (150 cada)
- 25 Mooh'tah Shell (4300 cada)
- 5 War Crystal (970 cada)
- 250k de aplicação

#### Proteção de Fogo (Dragon Hide)
- 20 Green Dragon Leather (16k cada)
- 10 Blazing Bone (1554 cada)
- 5 Draken Sulphur (1998 cada)
- 250k de aplicação
- Ícone: ![Fire Protection](https://www.tibiawiki.com.br/images/3/3b/Dragon_Hide_%28Prote%C3%A7%C3%A3o_de_Fogo%29.gif)

#### Proteção de Morte (Lich Shroud)
- 25 Flask of Embalming Fluid (8874 cada)
- 20 Gloom Wolf Fur (21587 cada)
- 5 Mystical Hourglass
- 250k de aplicação
- Ícone: ![Death Protection](https://www.tibiawiki.com.br/images/4/4a/Lich_Shroud_%28Prote%C3%A7%C3%A3o_de_Morte%29.gif)

### 3. Integração com Farms
- O custo dos imbuements por hora agora é considerado no cálculo do farm
- Aparece como "waste" no registro do farm
- O lucro líquido é calculado subtraindo o custo dos imbuements

### 4. Alterações no Banco de Dados

Execute os seguintes comandos SQL no Supabase:

```sql
-- 1. Adicionar coluna para custo de imbuement por hora na tabela farm_entries
ALTER TABLE farm_entries 
ADD COLUMN IF NOT EXISTS imbuement_cost_per_hour NUMERIC DEFAULT 0;

-- 2. Criar tabela de imbuements (opcional - para futuras expansões)
CREATE TABLE IF NOT EXISTS imbuements (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  player_id TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  
  -- Configuração de Gold Token
  gold_token_price NUMERIC DEFAULT 50000,
  
  -- Life Leech
  life_leech_enabled BOOLEAN DEFAULT false,
  life_leech_gold_tokens INTEGER DEFAULT 0,
  life_leech_cost NUMERIC DEFAULT 0,
  
  -- Mana Leech  
  mana_leech_enabled BOOLEAN DEFAULT false,
  mana_leech_gold_tokens INTEGER DEFAULT 0,
  mana_leech_silence_claws INTEGER DEFAULT 0,
  mana_leech_grimeleech INTEGER DEFAULT 0,
  mana_leech_cost NUMERIC DEFAULT 0,
  
  -- Critical
  critical_enabled BOOLEAN DEFAULT false,
  critical_gold_tokens INTEGER DEFAULT 0,
  critical_vexclaw_talons INTEGER DEFAULT 0,
  critical_cost NUMERIC DEFAULT 0,
  
  -- Skill Sword
  skill_sword_enabled BOOLEAN DEFAULT false,
  skill_sword_lions_mane INTEGER DEFAULT 0,
  skill_sword_moohtah_shell INTEGER DEFAULT 0,
  skill_sword_war_crystal INTEGER DEFAULT 0,
  skill_sword_cost NUMERIC DEFAULT 0,
  
  -- Proteção (Fire ou Death - apenas um por vez)
  protection_type TEXT CHECK (protection_type IN ('fire', 'death', NULL)),
  
  -- Fire Protection
  fire_protection_green_dragon_leather INTEGER DEFAULT 0,
  fire_protection_blazing_bone INTEGER DEFAULT 0,
  fire_protection_draken_sulphur INTEGER DEFAULT 0,
  fire_protection_cost NUMERIC DEFAULT 0,
  
  -- Death Protection
  death_protection_flask_embalming INTEGER DEFAULT 0,
  death_protection_gloom_wolf_fur INTEGER DEFAULT 0,
  death_protection_mystical_hourglass INTEGER DEFAULT 0,
  death_protection_cost NUMERIC DEFAULT 0,
  
  -- Totais
  total_imbuement_cost NUMERIC DEFAULT 0,
  cost_per_hour NUMERIC DEFAULT 0,
  
  -- Link com farm entry
  farm_entry_id UUID REFERENCES farm_entries(id) ON DELETE CASCADE
);

-- Criar índices
CREATE INDEX idx_imbuements_player_id ON imbuements(player_id);
CREATE INDEX idx_imbuements_created_at ON imbuements(created_at);
CREATE INDEX idx_imbuements_farm_entry ON imbuements(farm_entry_id);

-- RLS (Row Level Security)
ALTER TABLE imbuements ENABLE ROW LEVEL SECURITY;

-- Política para permitir todas as operações
CREATE POLICY "Enable all operations for imbuements" ON imbuements
  FOR ALL USING (true) WITH CHECK (true);
```

### 5. Como Usar

1. **Configurar Imbuements:**
   - Acesse a aba "Imbuements"
   - Configure o preço do Gold Token (padrão: 50k)
   - Selecione os imbuements que você usa clicando nos cards
   - Escolha entre proteção de fogo ou morte (apenas uma por vez)

2. **Salvar Configuração:**
   - Clique em "Salvar Config" para manter suas preferências
   - As configurações são salvas localmente no navegador

3. **Registrar Farm:**
   - Volte para a aba do jogador (Imp ou Juan)
   - O custo dos imbuements será automaticamente considerado
   - Você verá o "Farm Bruto", "Custo Imbuement" e "Farm Líquido"

4. **Análise:**
   - O sistema calcula automaticamente o custo por hora dos imbuements
   - Considera duração de 20 horas por aplicação
   - Subtrai o custo do lucro total para mostrar o lucro real

### 6. Valores Padrão dos Itens

Os preços dos itens podem ser ajustados conforme necessário:

- Gold Token: 50k
- Silence Claw: 3k
- Some Grimeleach: 1431
- Vexclaw Talon: 1274
- Lion's Mane: 150
- Mooh'tah Shell: 4300
- War Crystal: 970
- Green Dragon Leather: 16k
- Blazing Bone: 1554
- Draken Sulphur: 1998
- Flask of Embalming Fluid: 8874
- Gloom Wolf Fur: 21587
- Mystical Hourglass: (configurável)

Todos os imbuements têm custo base de aplicação de 250k gold.