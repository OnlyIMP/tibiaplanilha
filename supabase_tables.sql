-- Criar tabela de configurações
CREATE TABLE IF NOT EXISTS config_settings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  tc_value INTEGER NOT NULL DEFAULT 38000,
  tc_price_reais INTEGER NOT NULL DEFAULT 57,
  tc_amount INTEGER NOT NULL DEFAULT 250,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Criar tabela de entradas de farm
CREATE TABLE IF NOT EXISTS farm_entries (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  player_id TEXT NOT NULL,
  player_name TEXT NOT NULL,
  loot_gp BIGINT NOT NULL,
  waste_gp BIGINT NOT NULL,
  balance_gp BIGINT NOT NULL,
  tc_value INTEGER NOT NULL,
  tc_quantity DECIMAL(10, 2) NOT NULL,
  reais_value DECIMAL(10, 2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Criar índices para melhor performance
CREATE INDEX idx_farm_entries_player_id ON farm_entries(player_id);
CREATE INDEX idx_farm_entries_created_at ON farm_entries(created_at DESC);

-- Inserir configuração padrão se não existir
INSERT INTO config_settings (tc_value, tc_price_reais, tc_amount)
SELECT 38000, 57, 250
WHERE NOT EXISTS (SELECT 1 FROM config_settings LIMIT 1);

-- Habilitar Row Level Security (RLS)
ALTER TABLE config_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE farm_entries ENABLE ROW LEVEL SECURITY;

-- Criar políticas para permitir acesso público (anon)
CREATE POLICY "Enable read access for all users" ON config_settings
  FOR SELECT USING (true);

CREATE POLICY "Enable insert for all users" ON config_settings
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Enable update for all users" ON config_settings
  FOR UPDATE USING (true);

CREATE POLICY "Enable read access for all users" ON farm_entries
  FOR SELECT USING (true);

CREATE POLICY "Enable insert for all users" ON farm_entries
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Enable delete for all users" ON farm_entries
  FOR DELETE USING (true);