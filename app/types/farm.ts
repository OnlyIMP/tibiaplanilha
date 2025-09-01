export interface ConfigSettings {
  tcValue: number; // Valor de 1 TC em gold (ex: 38000)
  tcPriceReais: number; // Preço em reais para um lote de TC
  tcAmount: number; // Quantidade de TC no lote (ex: 250)
}

export interface FarmEntry {
  id: string;
  date: string;
  playerId: string;
  playerName: string;
  loot?: number;
  waste?: number;
  balance?: number;
  tcValue: number;
  tcQuantity: number;
  reaisValue: number;
  hours?: number;
  reaisPerHour?: number;
}