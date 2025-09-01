export interface ConfigSettings {
  tcValue: number; // Valor de 1 TC em gold (ex: 38000)
  tcPriceReais: number; // Preço em reais para um lote de TC
  tcAmount: number; // Quantidade de TC no lote (ex: 250)
}

export interface FarmEntry {
  id: string;
  date: string;
  playerId: 'player1' | 'player2';
  playerName: string;
  farmGold: number; // Farm em gold (ex: 4425000 = 4.425kk)
  hours: number; // Horas farmadas
}