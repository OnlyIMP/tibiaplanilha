-- Adicionar coluna para custo de imbuement por hora na tabela farm_entries
ALTER TABLE farm_entries 
ADD COLUMN IF NOT EXISTS imbuement_cost_per_hour NUMERIC DEFAULT 0;