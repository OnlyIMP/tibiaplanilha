'use client';

import React, { useState, useEffect } from 'react';
import { Shield, Sword, Heart, Zap, Flame, Skull, Save } from 'lucide-react';

interface ImbuementCalculatorProps {
  onCostUpdate: (costPerHour: number) => void;
  playerId: string;
}

const IMBUEMENT_BASE_COST = 250000;
const IMBUEMENT_DURATION_HOURS = 20;

const DEFAULT_PRICES = {
  goldToken: 50000,
  silenceClaw: 3000,
  grimeleech: 1431,
  vexclawTalon: 1274,
  lionsMane: 150,
  moohtahShell: 4300,
  warCrystal: 970,
  greenDragonLeather: 16000,
  blazingBone: 1554,
  drakenSulphur: 1998,
  flaskEmbalming: 8874,
  gloomWolfFur: 21587,
  mysticalHourglass: 0
};

export default function ImbuementCalculator({ onCostUpdate, playerId }: ImbuementCalculatorProps) {
  const [goldTokenPrice, setGoldTokenPrice] = useState(50000);
  const [itemPrices, setItemPrices] = useState(DEFAULT_PRICES);
  const [savedConfig, setSavedConfig] = useState<string | null>(null);
  
  const [imbuements, setImbuements] = useState({
    lifeLeech: false,
    manaLeech: false,
    critical: false,
    skillSword: false,
    protectionType: null as 'fire' | 'death' | null
  });

  // Carregar configurações salvas do localStorage
  useEffect(() => {
    const saved = localStorage.getItem(`imbuements_${playerId}`);
    if (saved) {
      const config = JSON.parse(saved);
      setImbuements(config.imbuements);
      setGoldTokenPrice(config.goldTokenPrice);
      setItemPrices(config.itemPrices);
      setSavedConfig('Configurações carregadas');
      setTimeout(() => setSavedConfig(null), 2000);
    }
  }, [playerId]);

  const saveConfiguration = () => {
    const config = {
      imbuements,
      goldTokenPrice,
      itemPrices
    };
    localStorage.setItem(`imbuements_${playerId}`, JSON.stringify(config));
    setSavedConfig('Configurações salvas!');
    setTimeout(() => setSavedConfig(null), 2000);
  };

  const calculateLifeLeechCost = () => {
    if (!imbuements.lifeLeech) return 0;
    return (6 * goldTokenPrice) + IMBUEMENT_BASE_COST;
  };

  const calculateManaLeechCost = () => {
    if (!imbuements.manaLeech) return 0;
    const goldTokensCost = 2 * goldTokenPrice;
    const silenceClawsCost = 25 * itemPrices.silenceClaw;
    const grimeleechCost = 7 * itemPrices.grimeleech;
    return goldTokensCost + silenceClawsCost + grimeleechCost + IMBUEMENT_BASE_COST;
  };

  const calculateCriticalCost = () => {
    if (!imbuements.critical) return 0;
    const goldTokensCost = 4 * goldTokenPrice;
    const vexclawCost = 8 * itemPrices.vexclawTalon;
    return goldTokensCost + vexclawCost + IMBUEMENT_BASE_COST;
  };

  const calculateSkillSwordCost = () => {
    if (!imbuements.skillSword) return 0;
    const lionManeCost = 25 * itemPrices.lionsMane;
    const moohtahShellCost = 25 * itemPrices.moohtahShell;
    const warCrystalCost = 5 * itemPrices.warCrystal;
    return lionManeCost + moohtahShellCost + warCrystalCost + IMBUEMENT_BASE_COST;
  };

  const calculateFireProtectionCost = () => {
    if (imbuements.protectionType !== 'fire') return 0;
    const greenDragonLeatherCost = 20 * itemPrices.greenDragonLeather;
    const blazingBoneCost = 10 * itemPrices.blazingBone;
    const drakenSulphurCost = 5 * itemPrices.drakenSulphur;
    return greenDragonLeatherCost + blazingBoneCost + drakenSulphurCost + IMBUEMENT_BASE_COST;
  };

  const calculateDeathProtectionCost = () => {
    if (imbuements.protectionType !== 'death') return 0;
    const flaskCost = 25 * itemPrices.flaskEmbalming;
    const gloomWolfCost = 20 * itemPrices.gloomWolfFur;
    const mysticalHourglassCost = 5 * itemPrices.mysticalHourglass;
    return flaskCost + gloomWolfCost + mysticalHourglassCost + IMBUEMENT_BASE_COST;
  };

  const calculateTotalCost = () => {
    return (
      calculateLifeLeechCost() +
      calculateManaLeechCost() +
      calculateCriticalCost() +
      calculateSkillSwordCost() +
      calculateFireProtectionCost() +
      calculateDeathProtectionCost()
    );
  };

  const calculateCostPerHour = () => {
    return calculateTotalCost() / IMBUEMENT_DURATION_HOURS;
  };

  useEffect(() => {
    const costPerHour = calculateCostPerHour();
    onCostUpdate(costPerHour);
  }, [imbuements, goldTokenPrice, itemPrices]);

  return (
    <div className="space-y-6">
      <div className="bg-zinc-950 rounded-lg p-6 border border-zinc-900">
        <h3 className="text-lg font-medium text-white mb-4 flex items-center gap-2">
          <Shield className="w-5 h-5 text-purple-500" />
          Calculadora de Imbuements
        </h3>

        {/* Configuração do Gold Token */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-zinc-400 mb-2">
            Preço do Gold Token
          </label>
          <input
            type="number"
            value={goldTokenPrice}
            onChange={(e) => setGoldTokenPrice(Number(e.target.value))}
            className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 rounded-lg text-white focus:outline-none focus:border-purple-500"
            placeholder="50000"
          />
        </div>

        {/* Seleção de Imbuements */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          {/* Life Leech */}
          <div 
            className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
              imbuements.lifeLeech 
                ? 'bg-red-950/30 border-red-700' 
                : 'bg-zinc-900 border-zinc-800 hover:border-zinc-700'
            }`}
            onClick={() => setImbuements(prev => ({ ...prev, lifeLeech: !prev.lifeLeech }))}
          >
            <div className="flex items-center gap-3">
              <img 
                src="https://www.tibiawiki.com.br/images/6/6e/Vampirism_%28Roubo_de_Vida%29.gif" 
                alt="Life Leech" 
                className="w-8 h-8"
              />
              <div className="flex-1">
                <h4 className="text-white font-medium flex items-center gap-2">
                  <Heart className="w-4 h-4 text-red-500" />
                  Life Leech
                </h4>
                <p className="text-xs text-zinc-500 mt-1">6 Gold Tokens + 250k</p>
                <p className="text-sm text-yellow-400 mt-1">
                  Custo: {calculateLifeLeechCost().toLocaleString('pt-BR')} gold
                </p>
              </div>
            </div>
          </div>

          {/* Mana Leech */}
          <div 
            className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
              imbuements.manaLeech 
                ? 'bg-blue-950/30 border-blue-700' 
                : 'bg-zinc-900 border-zinc-800 hover:border-zinc-700'
            }`}
            onClick={() => setImbuements(prev => ({ ...prev, manaLeech: !prev.manaLeech }))}
          >
            <div className="flex items-center gap-3">
              <img 
                src="https://www.tibiawiki.com.br/images/4/40/Void_%28Roubo_de_Mana%29.gif" 
                alt="Mana Leech" 
                className="w-8 h-8"
              />
              <div className="flex-1">
                <h4 className="text-white font-medium flex items-center gap-2">
                  <Zap className="w-4 h-4 text-blue-500" />
                  Mana Leech
                </h4>
                <p className="text-xs text-zinc-500 mt-1">2 Gold Tokens + Items + 250k</p>
                <p className="text-sm text-yellow-400 mt-1">
                  Custo: {calculateManaLeechCost().toLocaleString('pt-BR')} gold
                </p>
              </div>
            </div>
          </div>

          {/* Critical */}
          <div 
            className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
              imbuements.critical 
                ? 'bg-orange-950/30 border-orange-700' 
                : 'bg-zinc-900 border-zinc-800 hover:border-zinc-700'
            }`}
            onClick={() => setImbuements(prev => ({ ...prev, critical: !prev.critical }))}
          >
            <div className="flex items-center gap-3">
              <img 
                src="https://www.tibiawiki.com.br/images/1/14/Strike_%28Dano_Cr%C3%ADtico%29.gif" 
                alt="Critical" 
                className="w-8 h-8"
              />
              <div className="flex-1">
                <h4 className="text-white font-medium flex items-center gap-2">
                  <Sword className="w-4 h-4 text-orange-500" />
                  Critical Strike
                </h4>
                <p className="text-xs text-zinc-500 mt-1">4 Gold Tokens + Vexclaw + 250k</p>
                <p className="text-sm text-yellow-400 mt-1">
                  Custo: {calculateCriticalCost().toLocaleString('pt-BR')} gold
                </p>
              </div>
            </div>
          </div>

          {/* Skill Sword */}
          <div 
            className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
              imbuements.skillSword 
                ? 'bg-cyan-950/30 border-cyan-700' 
                : 'bg-zinc-900 border-zinc-800 hover:border-zinc-700'
            }`}
            onClick={() => setImbuements(prev => ({ ...prev, skillSword: !prev.skillSword }))}
          >
            <div className="flex items-center gap-3">
              <Sword className="w-8 h-8 text-cyan-500" />
              <div className="flex-1">
                <h4 className="text-white font-medium">Skill Sword</h4>
                <p className="text-xs text-zinc-500 mt-1">Lion's Mane + Mooh'tah + War Crystal + 250k</p>
                <p className="text-sm text-yellow-400 mt-1">
                  Custo: {calculateSkillSwordCost().toLocaleString('pt-BR')} gold
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Proteção (Fire ou Death) */}
        <div className="mb-6">
          <h4 className="text-white font-medium mb-3">Proteção Elemental</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Fire Protection */}
            <div 
              className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                imbuements.protectionType === 'fire'
                  ? 'bg-red-950/30 border-red-700' 
                  : 'bg-zinc-900 border-zinc-800 hover:border-zinc-700'
              }`}
              onClick={() => setImbuements(prev => ({ 
                ...prev, 
                protectionType: prev.protectionType === 'fire' ? null : 'fire' 
              }))}
            >
              <div className="flex items-center gap-3">
                <img 
                  src="https://www.tibiawiki.com.br/images/3/3b/Dragon_Hide_%28Prote%C3%A7%C3%A3o_de_Fogo%29.gif" 
                  alt="Fire Protection" 
                  className="w-8 h-8"
                />
                <div className="flex-1">
                  <h4 className="text-white font-medium flex items-center gap-2">
                    <Flame className="w-4 h-4 text-red-500" />
                    Proteção de Fogo
                  </h4>
                  <p className="text-xs text-zinc-500 mt-1">Green Dragon Leather + Blazing Bone + 250k</p>
                  <p className="text-sm text-yellow-400 mt-1">
                    Custo: {calculateFireProtectionCost().toLocaleString('pt-BR')} gold
                  </p>
                </div>
              </div>
            </div>

            {/* Death Protection */}
            <div 
              className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                imbuements.protectionType === 'death'
                  ? 'bg-purple-950/30 border-purple-700' 
                  : 'bg-zinc-900 border-zinc-800 hover:border-zinc-700'
              }`}
              onClick={() => setImbuements(prev => ({ 
                ...prev, 
                protectionType: prev.protectionType === 'death' ? null : 'death' 
              }))}
            >
              <div className="flex items-center gap-3">
                <img 
                  src="https://www.tibiawiki.com.br/images/4/4a/Lich_Shroud_%28Prote%C3%A7%C3%A3o_de_Morte%29.gif" 
                  alt="Death Protection" 
                  className="w-8 h-8"
                />
                <div className="flex-1">
                  <h4 className="text-white font-medium flex items-center gap-2">
                    <Skull className="w-4 h-4 text-purple-500" />
                    Proteção de Morte
                  </h4>
                  <p className="text-xs text-zinc-500 mt-1">Flask + Gloom Wolf + Hourglass + 250k</p>
                  <p className="text-sm text-yellow-400 mt-1">
                    Custo: {calculateDeathProtectionCost().toLocaleString('pt-BR')} gold
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Resumo de Custos */}
        <div className="bg-gradient-to-br from-purple-950/30 to-zinc-900 rounded-lg p-4 border border-purple-800/50">
          <div className="flex justify-between items-start mb-3">
            <h4 className="text-white font-medium">Resumo de Custos</h4>
            <button
              onClick={saveConfiguration}
              className="px-3 py-1 bg-purple-800 hover:bg-purple-700 text-white text-sm rounded-lg flex items-center gap-2 transition-colors"
            >
              <Save className="w-4 h-4" />
              Salvar Config
            </button>
          </div>
          {savedConfig && (
            <div className="mb-3 p-2 bg-green-900/30 border border-green-700/50 rounded-lg text-green-400 text-sm">
              {savedConfig}
            </div>
          )}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-zinc-400">Custo Total dos Imbuements:</span>
              <span className="text-yellow-400 font-bold">
                {calculateTotalCost().toLocaleString('pt-BR')} gold
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-zinc-400">Duração:</span>
              <span className="text-white">{IMBUEMENT_DURATION_HOURS} horas</span>
            </div>
            <div className="pt-2 border-t border-zinc-800">
              <div className="flex justify-between">
                <span className="text-white font-medium">Custo por Hora:</span>
                <span className="text-green-400 font-bold text-lg">
                  {calculateCostPerHour().toLocaleString('pt-BR')} gold/h
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}