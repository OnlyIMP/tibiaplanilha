-- Criar tabela de imbuements
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
  cost_per_hour NUMERIC DEFAULT 0, -- Custo por hora (considerando 20h de duração)
  
  -- Link com farm entry
  farm_entry_id UUID REFERENCES farm_entries(id) ON DELETE CASCADE
);

-- Criar índices
CREATE INDEX idx_imbuements_player_id ON imbuements(player_id);
CREATE INDEX idx_imbuements_created_at ON imbuements(created_at);
CREATE INDEX idx_imbuements_farm_entry ON imbuements(farm_entry_id);

-- RLS (Row Level Security)
ALTER TABLE imbuements ENABLE ROW LEVEL SECURITY;

-- Política para permitir todas as operações (ajustar conforme necessário)
CREATE POLICY "Enable all operations for imbuements" ON imbuements
  FOR ALL USING (true) WITH CHECK (true);