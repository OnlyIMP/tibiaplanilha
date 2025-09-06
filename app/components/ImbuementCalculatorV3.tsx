'use client';

import { useState, useEffect } from 'react';
import { Calculator, Coins, Shield, Flame, Skull, Save, TrendingUp, TrendingDown } from 'lucide-react';
import { useImbuements } from '../hooks/useSupabase';

interface ImbuementItem {
  name: string;
  quantity: number;
  price: number;
  icon?: string;
}

interface ImbuementType {
  enabled: boolean;
  useGoldTokens: boolean; // Se deve usar gold tokens ou itens
  goldTokensNeeded: number; // Quantos gold tokens são necessários
  items: ImbuementItem[];
  baseCost: number;
  totalCost?: number;
}

interface ImbuementCalculatorV3Props {
  onCostUpdate?: (costPerHour: number) => void;
  playerId?: string;
}

export default function ImbuementCalculatorV3({ onCostUpdate, playerId = 'general' }: ImbuementCalculatorV3Props) {
  const { imbuements: savedImbuements, saveImbuements } = useImbuements(playerId);
  const [goldTokenPrice, setGoldTokenPrice] = useState(45800);
  const [activeTab, setActiveTab] = useState<'combat' | 'skills' | 'protection'>('combat');
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  
  // Life Leech (Vampirism) - Powerful
  const [lifeLeech, setLifeLeech] = useState<ImbuementType>({
    enabled: false,
    useGoldTokens: false,
    goldTokensNeeded: 6,
    items: [
      { name: 'Vampire Teeth', quantity: 25, price: 1898 },
      { name: 'Bloody Pincers', quantity: 15, price: 9988 },
      { name: 'Piece of Dead Brain', quantity: 5, price: 18999 }
    ],
    baseCost: 250000,
  });

  // Mana Leech (Void) - Powerful
  const [manaLeech, setManaLeech] = useState<ImbuementType>({
    enabled: false,
    useGoldTokens: false,
    goldTokensNeeded: 2,
    items: [
      { name: 'Rope Belt', quantity: 25, price: 4800 },
      { name: 'Silencer Claws', quantity: 15, price: 2995 },
      { name: 'Some Grimeleech Wings', quantity: 5, price: 1436 }
    ],
    baseCost: 250000,
  });

  // Critical (Strike) - Powerful
  const [critical, setCritical] = useState<ImbuementType>({
    enabled: false,
    useGoldTokens: false,
    goldTokensNeeded: 4,
    items: [
      { name: 'Protective Charm', quantity: 20, price: 780 },
      { name: 'Sabretooth', quantity: 25, price: 390 },
      { name: 'Vexclaw Talon', quantity: 5, price: 1274 }
    ],
    baseCost: 250000,
  });

  // Skill Sword (Slash) - Powerful
  const [skillSword, setSkillSword] = useState<ImbuementType>({
    enabled: false,
    useGoldTokens: false,
    goldTokensNeeded: 0, // Não tem opção de gold token
    items: [
      { name: "Lion's Mane", quantity: 25, price: 150 },
      { name: "Mooh'tah Shell", quantity: 15, price: 4300 },
      { name: 'War Crystal', quantity: 5, price: 970 }
    ],
    baseCost: 250000,
  });

  // Fire Protection (Dragon Hide) - Powerful
  const [fireProtection, setFireProtection] = useState<ImbuementType>({
    enabled: false,
    useGoldTokens: false,
    goldTokensNeeded: 0, // Não tem opção de gold token
    items: [
      { name: 'Green Dragon Leather', quantity: 20, price: 16000 },
      { name: 'Blazing Bone', quantity: 10, price: 1554 },
      { name: 'Draken Sulphur', quantity: 5, price: 1998 }
    ],
    baseCost: 250000,
  });

  // Death Protection (Lich Shroud) - Powerful
  const [deathProtection, setDeathProtection] = useState<ImbuementType>({
    enabled: false,
    useGoldTokens: false,
    goldTokensNeeded: 0, // Não tem opção de gold token
    items: [
      { name: 'Flask of Embalming Fluid', quantity: 25, price: 8874 },
      { name: 'Gloom Wolf Fur', quantity: 20, price: 21587 },
      { name: 'Mystical Hourglass', quantity: 5, price: 700 }
    ],
    baseCost: 250000,
  });

  const [protectionType, setProtectionType] = useState<'fire' | 'death' | 'none'>('none');
  const [totalCost, setTotalCost] = useState(0);
  const [costPerHour, setCostPerHour] = useState(0);

  // Função para calcular o custo dos itens
  const calculateItemsCost = (items: ImbuementItem[]): number => {
    return items.reduce((total, item) => total + (item.quantity * item.price), 0);
  };

  // Função para determinar automaticamente o melhor método
  const shouldUseGoldTokens = (imbuement: ImbuementType): boolean => {
    if (imbuement.goldTokensNeeded === 0) return false; // Não tem opção de gold token
    
    const goldTokenCost = imbuement.goldTokensNeeded * goldTokenPrice;
    const itemsCost = calculateItemsCost(imbuement.items);
    
    return goldTokenCost < itemsCost;
  };

  // Atualizar automaticamente o método mais barato quando o preço do gold token mudar
  useEffect(() => {
    setLifeLeech(prev => ({
      ...prev,
      useGoldTokens: shouldUseGoldTokens(prev)
    }));
    
    setManaLeech(prev => ({
      ...prev,
      useGoldTokens: shouldUseGoldTokens(prev)
    }));
    
    setCritical(prev => ({
      ...prev,
      useGoldTokens: shouldUseGoldTokens(prev)
    }));
  }, [goldTokenPrice]);

  // Função para calcular o custo de um imbuement
  const calculateImbuementCost = (imbuement: ImbuementType): number => {
    if (!imbuement.enabled) return 0;
    
    let cost = imbuement.baseCost;
    
    if (imbuement.useGoldTokens && imbuement.goldTokensNeeded > 0) {
      // Usar gold tokens
      cost += imbuement.goldTokensNeeded * goldTokenPrice;
    } else {
      // Usar itens
      cost += calculateItemsCost(imbuement.items);
    }
    
    return cost;
  };

  // Calcular totais quando algo mudar
  useEffect(() => {
    let total = 0;
    
    if (lifeLeech.enabled) {
      total += calculateImbuementCost(lifeLeech);
    }
    
    if (manaLeech.enabled) {
      total += calculateImbuementCost(manaLeech);
    }
    
    if (critical.enabled) {
      total += calculateImbuementCost(critical);
    }
    
    if (skillSword.enabled) {
      total += calculateImbuementCost(skillSword);
    }
    
    if (protectionType === 'fire' && fireProtection.enabled) {
      total += calculateImbuementCost(fireProtection);
    } else if (protectionType === 'death' && deathProtection.enabled) {
      total += calculateImbuementCost(deathProtection);
    }
    
    setTotalCost(total);
    const hourCost = total / 20; // Imbuements duram 20 horas
    setCostPerHour(hourCost);
    
    if (onCostUpdate) {
      onCostUpdate(hourCost);
    }
  }, [lifeLeech, manaLeech, critical, skillSword, fireProtection, deathProtection, protectionType, goldTokenPrice, onCostUpdate]);

  const updateItemPrice = (
    setter: React.Dispatch<React.SetStateAction<ImbuementType>>,
    itemIndex: number,
    newPrice: number
  ) => {
    setter(prev => {
      const newItems = [...prev.items];
      newItems[itemIndex] = { ...newItems[itemIndex], price: newPrice };
      const newState = { ...prev, items: newItems };
      // Recalcular se deve usar gold tokens
      newState.useGoldTokens = shouldUseGoldTokens(newState);
      return newState;
    });
  };

  const formatGold = (value: number) => {
    if (value >= 1000000) {
      return `${(value / 1000000).toFixed(2)}kk`;
    } else if (value >= 1000) {
      return `${(value / 1000).toFixed(0)}k`;
    }
    return value.toString();
  };

  const handleSave = async () => {
    if (!saveImbuements) return;
    
    setIsSaving(true);
    setSaveSuccess(false);
    
    try {
      await saveImbuements({
        id: savedImbuements?.id,
        playerId,
        goldTokenPrice,
        
        // Life Leech
        lifeLeechEnabled: lifeLeech.enabled,
        lifeLeechGoldTokens: lifeLeech.useGoldTokens ? lifeLeech.goldTokensNeeded : 0,
        lifeLeechCost: calculateImbuementCost(lifeLeech),
        
        // Mana Leech
        manaLeechEnabled: manaLeech.enabled,
        manaLeechGoldTokens: manaLeech.useGoldTokens ? manaLeech.goldTokensNeeded : 0,
        manaLeechSilenceClaws: manaLeech.items[1]?.quantity || 15,
        manaLeechGrimeleech: manaLeech.items[2]?.quantity || 5,
        manaLeechCost: calculateImbuementCost(manaLeech),
        
        // Critical
        criticalEnabled: critical.enabled,
        criticalGoldTokens: critical.useGoldTokens ? critical.goldTokensNeeded : 0,
        criticalVexclawTalons: critical.items[2]?.quantity || 5,
        criticalCost: calculateImbuementCost(critical),
        
        // Skill Sword
        skillSwordEnabled: skillSword.enabled,
        skillSwordLionsMane: skillSword.items[0]?.quantity || 25,
        skillSwordMoohtahShell: skillSword.items[1]?.quantity || 15,
        skillSwordWarCrystal: skillSword.items[2]?.quantity || 5,
        skillSwordCost: calculateImbuementCost(skillSword),
        
        // Fire Protection
        fireProtectionGreenDragonLeather: fireProtection.items[0]?.quantity || 20,
        fireProtectionBlazingBone: fireProtection.items[1]?.quantity || 10,
        fireProtectionDrakenSulphur: fireProtection.items[2]?.quantity || 5,
        fireProtectionCost: calculateImbuementCost(fireProtection),
        
        // Death Protection
        deathProtectionFlaskEmbalming: deathProtection.items[0]?.quantity || 25,
        deathProtectionGloomWolfFur: deathProtection.items[1]?.quantity || 20,
        deathProtectionMysticalHourglass: deathProtection.items[2]?.quantity || 5,
        deathProtectionCost: calculateImbuementCost(deathProtection),
        
        // Protection Type
        protectionType: protectionType === 'none' ? null : protectionType,
        
        // Totals
        totalImbuementCost: totalCost,
        costPerHour: costPerHour,
      });
      
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (error) {
      console.error('Erro ao salvar configuração:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const ImbuementCard = ({
    title,
    icon,
    imbuement,
    setter,
    canUseGoldTokens = true,
  }: {
    title: string;
    icon: string;
    imbuement: ImbuementType;
    setter: React.Dispatch<React.SetStateAction<ImbuementType>>;
    canUseGoldTokens?: boolean;
  }) => {
    const goldTokenCost = imbuement.goldTokensNeeded * goldTokenPrice;
    const itemsCost = calculateItemsCost(imbuement.items);
    const savings = canUseGoldTokens ? Math.abs(goldTokenCost - itemsCost) : 0;
    const bestMethod = imbuement.useGoldTokens ? 'Gold Tokens' : 'Itens';

    return (
      <div className="bg-zinc-950 rounded-lg p-6 border border-zinc-900">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <img src={icon} alt={title} className="w-8 h-8" />
            <h3 className="text-lg font-medium text-white">{title}</h3>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={imbuement.enabled}
              onChange={(e) => setter(prev => ({ ...prev, enabled: e.target.checked }))}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-zinc-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
          </label>
        </div>
        
        {imbuement.enabled && (
          <div className="space-y-4">
            {/* Comparação de custos */}
            {canUseGoldTokens && imbuement.goldTokensNeeded > 0 && (
              <div className="bg-zinc-900 rounded-lg p-4 space-y-3">
                <h4 className="text-sm font-medium text-zinc-400 mb-2">Análise de Custo</h4>
                
                <div className="grid grid-cols-2 gap-3">
                  <div className={`p-3 rounded-md border ${imbuement.useGoldTokens ? 'border-green-600 bg-green-950/30' : 'border-zinc-700 bg-zinc-800/50'}`}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs text-zinc-400">Gold Tokens ({imbuement.goldTokensNeeded}x)</span>
                      {imbuement.useGoldTokens && <TrendingDown className="w-3 h-3 text-green-400" />}
                    </div>
                    <p className="text-lg font-bold text-white">{formatGold(goldTokenCost)}</p>
                  </div>
                  
                  <div className={`p-3 rounded-md border ${!imbuement.useGoldTokens ? 'border-green-600 bg-green-950/30' : 'border-zinc-700 bg-zinc-800/50'}`}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs text-zinc-400">Itens</span>
                      {!imbuement.useGoldTokens && <TrendingDown className="w-3 h-3 text-green-400" />}
                    </div>
                    <p className="text-lg font-bold text-white">{formatGold(itemsCost)}</p>
                  </div>
                </div>
                
                <div className="bg-green-950/50 rounded-md p-2 border border-green-800/50">
                  <p className="text-sm text-green-400">
                    💰 Usando <span className="font-bold">{bestMethod}</span> você economiza <span className="font-bold">{formatGold(savings)}</span>
                  </p>
                </div>
                
                {/* Opção manual para forçar método */}
                <div className="flex items-center gap-2 pt-2 border-t border-zinc-800">
                  <span className="text-xs text-zinc-500">Forçar método:</span>
                  <button
                    onClick={() => setter(prev => ({ ...prev, useGoldTokens: true }))}
                    className={`px-2 py-1 rounded text-xs ${imbuement.useGoldTokens ? 'bg-yellow-600 text-white' : 'bg-zinc-800 text-zinc-400'}`}
                  >
                    Gold Tokens
                  </button>
                  <button
                    onClick={() => setter(prev => ({ ...prev, useGoldTokens: false }))}
                    className={`px-2 py-1 rounded text-xs ${!imbuement.useGoldTokens ? 'bg-yellow-600 text-white' : 'bg-zinc-800 text-zinc-400'}`}
                  >
                    Itens
                  </button>
                </div>
              </div>
            )}
            
            {/* Lista de itens (só mostra se não estiver usando gold tokens ou não tiver opção) */}
            {(!imbuement.useGoldTokens || imbuement.goldTokensNeeded === 0) && (
              <div className="space-y-3">
                <h4 className="text-sm font-medium text-zinc-400">Itens Necessários</h4>
                {imbuement.items.map((item, index) => (
                  <div key={index} className="grid grid-cols-4 gap-2 items-center">
                    <div className="col-span-1">
                      <label className="text-xs text-zinc-500">{item.name}</label>
                      <div className="text-sm text-white">{item.quantity}x</div>
                    </div>
                    <div className="col-span-1">
                      <label className="text-xs text-zinc-500">Preço Unit.</label>
                      <input
                        type="number"
                        value={item.price}
                        onChange={(e) => updateItemPrice(setter, index, parseInt(e.target.value) || 0)}
                        className="w-full bg-zinc-900 border border-zinc-800 rounded-md px-2 py-1 text-white text-sm"
                      />
                    </div>
                    <div className="col-span-1">
                      <label className="text-xs text-zinc-500">Total</label>
                      <div className="text-sm text-white">{formatGold(item.quantity * item.price)}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
            
            {/* Se estiver usando gold tokens, mostra info resumida */}
            {imbuement.useGoldTokens && imbuement.goldTokensNeeded > 0 && (
              <div className="bg-yellow-950/30 rounded-md p-3 border border-yellow-800/50">
                <p className="text-sm text-yellow-400">
                  Usando <span className="font-bold">{imbuement.goldTokensNeeded} Gold Tokens</span> no lugar dos itens
                </p>
              </div>
            )}
            
            {/* Resumo de custos */}
            <div className="pt-4 border-t border-zinc-800">
              <div className="flex justify-between text-sm">
                <span className="text-zinc-400">Custo Base Imbuement:</span>
                <span className="text-white">{formatGold(imbuement.baseCost)}</span>
              </div>
              <div className="flex justify-between text-sm mt-1">
                <span className="text-zinc-400">{imbuement.useGoldTokens ? 'Gold Tokens:' : 'Itens:'}</span>
                <span className="text-white">
                  {formatGold(imbuement.useGoldTokens ? goldTokenCost : itemsCost)}
                </span>
              </div>
              <div className="flex justify-between font-semibold mt-2 pt-2 border-t border-zinc-800">
                <span className="text-zinc-400">Total:</span>
                <span className="text-green-400">{formatGold(calculateImbuementCost(imbuement))}</span>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header com configuração de Gold Token */}
      <div className="bg-zinc-950 rounded-lg p-6 border border-zinc-900">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Calculator className="h-5 w-5 text-yellow-400" />
            <h2 className="text-lg font-medium text-white">Calculadora de Imbuements (Powerful)</h2>
          </div>
          <button
            onClick={handleSave}
            disabled={isSaving}
            className={`flex items-center gap-2 px-4 py-2 rounded-md transition-all ${
              saveSuccess 
                ? 'bg-green-500 text-white' 
                : isSaving 
                  ? 'bg-zinc-700 text-zinc-400 cursor-not-allowed'
                  : 'bg-green-600 text-white hover:bg-green-700'
            }`}
          >
            <Save className="h-4 w-4" />
            {isSaving ? 'Salvando...' : saveSuccess ? 'Salvo!' : 'Salvar Configuração'}
          </button>
        </div>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-zinc-400 mb-1">Preço do Gold Token</label>
            <input
              type="number"
              value={goldTokenPrice}
              onChange={(e) => setGoldTokenPrice(parseInt(e.target.value) || 0)}
              placeholder="45800"
              className="w-full bg-zinc-900 border border-zinc-800 rounded-md px-3 py-2 text-white"
            />
            <p className="text-xs text-zinc-500 mt-1">
              Valor atual de 1 Gold Token em gold (usado para calcular o método mais barato)
            </p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-zinc-950 rounded-lg border border-zinc-900">
        <div className="flex border-b border-zinc-800">
          <button
            onClick={() => setActiveTab('combat')}
            className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
              activeTab === 'combat'
                ? 'text-white bg-zinc-900 border-b-2 border-yellow-500'
                : 'text-zinc-500 hover:text-white'
            }`}
          >
            Combate
          </button>
          <button
            onClick={() => setActiveTab('skills')}
            className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
              activeTab === 'skills'
                ? 'text-white bg-zinc-900 border-b-2 border-yellow-500'
                : 'text-zinc-500 hover:text-white'
            }`}
          >
            Skills
          </button>
          <button
            onClick={() => setActiveTab('protection')}
            className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
              activeTab === 'protection'
                ? 'text-white bg-zinc-900 border-b-2 border-yellow-500'
                : 'text-zinc-500 hover:text-white'
            }`}
          >
            Proteção
          </button>
        </div>

        <div className="p-6 space-y-6">
          {activeTab === 'combat' && (
            <>
              <ImbuementCard
                title="Life Leech (Vampirism)"
                icon="https://www.tibiawiki.com.br/images/6/6e/Vampirism_%28Roubo_de_Vida%29.gif"
                imbuement={lifeLeech}
                setter={setLifeLeech}
              />
              <ImbuementCard
                title="Mana Leech (Void)"
                icon="https://www.tibiawiki.com.br/images/4/40/Void_%28Roubo_de_Mana%29.gif"
                imbuement={manaLeech}
                setter={setManaLeech}
              />
              <ImbuementCard
                title="Critical (Strike)"
                icon="https://www.tibiawiki.com.br/images/1/14/Strike_%28Dano_Cr%C3%ADtico%29.gif"
                imbuement={critical}
                setter={setCritical}
              />
            </>
          )}

          {activeTab === 'skills' && (
            <ImbuementCard
              title="Skill Sword (Slash)"
              icon="https://www.tibiawiki.com.br/images/2/2a/Slash_%28Skillboost_de_Espada%29.gif"
              imbuement={skillSword}
              setter={setSkillSword}
              canUseGoldTokens={false}
            />
          )}

          {activeTab === 'protection' && (
            <>
              <div className="bg-zinc-950 rounded-lg p-6 border border-zinc-900">
                <div className="flex items-center gap-2 mb-4">
                  <Shield className="h-5 w-5 text-purple-500" />
                  <h3 className="text-lg font-medium text-white">Tipo de Proteção</h3>
                </div>
                <div className="space-y-2">
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="protection"
                      value="none"
                      checked={protectionType === 'none'}
                      onChange={() => {
                        setProtectionType('none');
                        setFireProtection(prev => ({ ...prev, enabled: false }));
                        setDeathProtection(prev => ({ ...prev, enabled: false }));
                      }}
                      className="text-yellow-500"
                    />
                    <span className="text-white">Nenhuma</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="protection"
                      value="fire"
                      checked={protectionType === 'fire'}
                      onChange={() => {
                        setProtectionType('fire');
                        setFireProtection(prev => ({ ...prev, enabled: true }));
                        setDeathProtection(prev => ({ ...prev, enabled: false }));
                      }}
                      className="text-yellow-500"
                    />
                    <span className="text-white flex items-center gap-2">
                      <Flame className="h-4 w-4 text-orange-500" />
                      Proteção de Fogo
                    </span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="protection"
                      value="death"
                      checked={protectionType === 'death'}
                      onChange={() => {
                        setProtectionType('death');
                        setDeathProtection(prev => ({ ...prev, enabled: true }));
                        setFireProtection(prev => ({ ...prev, enabled: false }));
                      }}
                      className="text-yellow-500"
                    />
                    <span className="text-white flex items-center gap-2">
                      <Skull className="h-4 w-4 text-purple-500" />
                      Proteção de Morte
                    </span>
                  </label>
                </div>
              </div>

              {protectionType === 'fire' && (
                <ImbuementCard
                  title="Fire Protection (Dragon Hide)"
                  icon="https://www.tibiawiki.com.br/images/d/d8/Dragon_Hide_%28Prote%C3%A7%C3%A3o_de_Fogo%29.gif"
                  imbuement={fireProtection}
                  setter={setFireProtection}
                  canUseGoldTokens={false}
                />
              )}

              {protectionType === 'death' && (
                <ImbuementCard
                  title="Death Protection (Lich Shroud)"
                  icon="https://www.tibiawiki.com.br/images/3/36/Lich_Shroud_%28Prote%C3%A7%C3%A3o_de_Morte%29.gif"
                  imbuement={deathProtection}
                  setter={setDeathProtection}
                  canUseGoldTokens={false}
                />
              )}
            </>
          )}
        </div>
      </div>

      {/* Resumo de Custos */}
      <div className="bg-gradient-to-br from-purple-950/30 via-zinc-900 to-zinc-950 rounded-xl p-6 border border-purple-800/30">
        <div className="flex items-center gap-2 mb-4">
          <Coins className="h-5 w-5 text-yellow-400" />
          <h3 className="text-lg font-bold text-purple-400">Resumo de Custos</h3>
        </div>
        <div className="space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-zinc-900/50 backdrop-blur rounded-lg p-4 border border-zinc-800/50">
              <p className="text-xs text-zinc-500 uppercase tracking-wider mb-2">Custo Total dos Imbuements</p>
              <p className="text-2xl font-bold text-green-400">{formatGold(totalCost)}</p>
            </div>
            <div className="bg-zinc-900/50 backdrop-blur rounded-lg p-4 border border-zinc-800/50">
              <p className="text-xs text-zinc-500 uppercase tracking-wider mb-2">Custo por Hora (20h duração)</p>
              <p className="text-2xl font-bold text-blue-400">{formatGold(costPerHour)}/h</p>
            </div>
          </div>
          
          {(lifeLeech.enabled || manaLeech.enabled || critical.enabled || skillSword.enabled || 
            (protectionType === 'fire' && fireProtection.enabled) || 
            (protectionType === 'death' && deathProtection.enabled)) && (
            <div className="pt-3 border-t border-zinc-800 space-y-2">
              <h4 className="font-semibold text-white">Imbuements Ativos:</h4>
              {lifeLeech.enabled && (
                <div className="flex justify-between text-sm">
                  <span className="text-zinc-400">
                    Life Leech {lifeLeech.useGoldTokens ? '(Gold Tokens)' : '(Itens)'}:
                  </span>
                  <span className="text-white">{formatGold(calculateImbuementCost(lifeLeech))}</span>
                </div>
              )}
              {manaLeech.enabled && (
                <div className="flex justify-between text-sm">
                  <span className="text-zinc-400">
                    Mana Leech {manaLeech.useGoldTokens ? '(Gold Tokens)' : '(Itens)'}:
                  </span>
                  <span className="text-white">{formatGold(calculateImbuementCost(manaLeech))}</span>
                </div>
              )}
              {critical.enabled && (
                <div className="flex justify-between text-sm">
                  <span className="text-zinc-400">
                    Critical {critical.useGoldTokens ? '(Gold Tokens)' : '(Itens)'}:
                  </span>
                  <span className="text-white">{formatGold(calculateImbuementCost(critical))}</span>
                </div>
              )}
              {skillSword.enabled && (
                <div className="flex justify-between text-sm">
                  <span className="text-zinc-400">Skill Sword:</span>
                  <span className="text-white">{formatGold(calculateImbuementCost(skillSword))}</span>
                </div>
              )}
              {protectionType === 'fire' && fireProtection.enabled && (
                <div className="flex justify-between text-sm">
                  <span className="text-zinc-400">Proteção de Fogo:</span>
                  <span className="text-white">{formatGold(calculateImbuementCost(fireProtection))}</span>
                </div>
              )}
              {protectionType === 'death' && deathProtection.enabled && (
                <div className="flex justify-between text-sm">
                  <span className="text-zinc-400">Proteção de Morte:</span>
                  <span className="text-white">{formatGold(calculateImbuementCost(deathProtection))}</span>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}