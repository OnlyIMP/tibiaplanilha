import { ConfigSettings } from '../types/farm';

export const calculateFarmValues = (farmGold: number, hours: number, config: ConfigSettings) => {
  const farmInTC = farmGold / config.tcValue;
  const farmInReais = (farmInTC / config.tcAmount) * config.tcPriceReais;
  const farmPerHour = hours > 0 ? farmInReais / hours : 0;

  return {
    farmInTC,
    farmInReais,
    farmPerHour
  };
};

export const formatGold = (gold: number): string => {
  if (gold >= 1000000) {
    return `${(gold / 1000000).toFixed(3)}kk`;
  } else if (gold >= 1000) {
    return `${(gold / 1000).toFixed(0)}k`;
  }
  return gold.toString();
};

export const formatCurrency = (value: number): string => {
  return `R$ ${value.toFixed(2)}`;
};

export const formatTC = (value: number): string => {
  return `${value.toFixed(2)} TC`;
};