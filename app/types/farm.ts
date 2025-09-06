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
  imbuementCostPerHour?: number;
}

export interface ImbuementPrices {
  goldToken: number;
  silenceClaw: number;
  grimeleech: number;
  vexclawTalon: number;
  lionsMane: number;
  moohtahShell: number;
  warCrystal: number;
  greenDragonLeather: number;
  blazingBone: number;
  drakenSulphur: number;
  flaskEmbalming: number;
  gloomWolfFur: number;
  mysticalHourglass: number;
}

export interface ImbuementItem {
  name: string;
  quantity: number;
  price: number;
}

export interface ImbuementConfig {
  id?: string;
  playerId: string;
  goldTokenPrice: number;
  
  // Life Leech
  lifeLeechEnabled: boolean;
  lifeLeechGoldTokens: number;
  lifeLeechCost?: number;
  vampireTeethPrice?: number;
  bloodyPincersPrice?: number;
  pieceOfDeadBrainPrice?: number;
  
  // Mana Leech
  manaLeechEnabled: boolean;
  manaLeechGoldTokens: number;
  manaLeechSilenceClaws: number;
  manaLeechGrimeleech: number;
  manaLeechCost?: number;
  ropeBeltPrice?: number;
  silencerClawsPrice?: number;
  grimeleechWingsPrice?: number;
  
  // Critical
  criticalEnabled: boolean;
  criticalGoldTokens: number;
  criticalVexclawTalons: number;
  criticalCost?: number;
  protectiveCharmPrice?: number;
  sabretoothPrice?: number;
  vexclawTalonPrice?: number;
  
  // Skill Sword
  skillSwordEnabled: boolean;
  skillSwordLionsMane: number;
  skillSwordMoohtahShell: number;
  skillSwordWarCrystal: number;
  skillSwordCost?: number;
  lionsManePrice?: number;
  moohtahShellPrice?: number;
  warCrystalPrice?: number;
  
  // Fire Protection
  fireProtectionGreenDragonLeather: number;
  fireProtectionBlazingBone: number;
  fireProtectionDrakenSulphur: number;
  fireProtectionCost?: number;
  greenDragonLeatherPrice?: number;
  blazingBonePrice?: number;
  drakenSulphurPrice?: number;
  
  // Death Protection
  deathProtectionFlaskEmbalming: number;
  deathProtectionGloomWolfFur: number;
  deathProtectionMysticalHourglass: number;
  deathProtectionCost?: number;
  flaskEmbalmingPrice?: number;
  gloomWolfFurPrice?: number;
  mysticalHourglassPrice?: number;
  
  // Protection Type
  protectionType: 'fire' | 'death' | null;
  
  // Calculated totals
  totalImbuementCost?: number;
  costPerHour?: number;
  farmEntryId?: string;
}