-- Adicionar colunas de horas e taxa por hora na tabela farm_entries
ALTER TABLE farm_entries 
ADD COLUMN IF NOT EXISTS hours DECIMAL(10, 2),
ADD COLUMN IF NOT EXISTS rate_per_hour DECIMAL(10, 2);

-- Adicionar política de update para farm_entries
CREATE POLICY "Enable update for all users" ON farm_entries
  FOR UPDATE USING (true);