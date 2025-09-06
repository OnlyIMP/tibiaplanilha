-- Adicionar constraint única para player_id na tabela imbuements
-- Isso garante que cada player tenha apenas um registro de imbuements

-- Primeiro remover duplicatas se existirem (mantém o mais recente)
DELETE FROM imbuements a
USING imbuements b
WHERE a.player_id = b.player_id
AND a.created_at < b.created_at;

-- Adicionar a constraint única
ALTER TABLE imbuements 
ADD CONSTRAINT imbuements_player_id_unique UNIQUE (player_id);

-- Adicionar trigger para atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = TIMEZONE('utc', NOW());
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_imbuements_updated_at
BEFORE UPDATE ON imbuements
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();