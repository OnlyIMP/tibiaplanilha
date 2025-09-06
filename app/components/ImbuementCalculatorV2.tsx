'use client';

import { useState, useEffect } from 'react';
import { Calculator, Coins, Shield, Flame, Skull, Save } from 'lucide-react';
import { useImbuements } from '../hooks/useSupabase';

interface ImbuementItem {
  name: string;
  quantity: number;
  price: number;
  icon?: string;
}

interface ImbuementType {
  enabled: boolean;
  goldTokens: number;
  items: ImbuementItem[];
  baseCost: number;
  totalCost?: number;
}

interface ImbuementCalculatorV2Props {
  onCostUpdate?: (costPerHour: number) => void;
  playerId?: string;
}

export default function ImbuementCalculatorV2({ onCostUpdate, playerId = 'general' }: ImbuementCalculatorV2Props) {
  const { imbuements: savedImbuements, saveImbuements } = useImbuements(playerId);
  const [goldTokenPrice, setGoldTokenPrice] = useState(50000);
  const [activeTab, setActiveTab] = useState<'combat' | 'skills' | 'protection'>('combat');
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  
  // Life Leech
  const [lifeLeech, setLifeLeech] = useState<ImbuementType>({
    enabled: false,
    goldTokens: 6,
    items: [],
    baseCost: 250000,
  });

  // Mana Leech
  const [manaLeech, setManaLeech] = useState<ImbuementType>({
    enabled: false,
    goldTokens: 2,
    items: [
      { name: 'Silence Claws', quantity: 25, price: 3000 },
      { name: 'Some Grimeleech Wings', quantity: 5, price: 1431 }
    ],
    baseCost: 250000,
  });

  // Critical
  const [critical, setCritical] = useState<ImbuementType>({
    enabled: false,
    goldTokens: 4,
    items: [
      { name: 'Protective Charm', quantity: 20, price: 0, icon: 'https://www.tibiawiki.com.br/images/f/fb/Protective_Charm.gif' },
      { name: 'Sabretooth', quantity: 25, price: 0, icon: 'https://www.tibiawiki.com.br/images/f/f7/Sabretooth_%28Item%29.gif' },
      { name: 'Vexclaw Talon', quantity: 5, price: 1274, icon: 'https://www.tibiawiki.com.br/images/f/f7/Vexclaw_Talon.gif' }
    ],
    baseCost: 250000,
  });

  // Skill Sword
  const [skillSword, setSkillSword] = useState<ImbuementType>({
    enabled: false,
    goldTokens: 0,
    items: [
      { name: "Lion's Mane", quantity: 25, price: 150 },
      { name: "Mooh'tah Shell", quantity: 25, price: 4300, icon: 'https://www.tibiawiki.com.br/images/b/b2/Mooh%27tah_Shell.gif' },
      { name: 'War Crystal', quantity: 5, price: 970, icon: 'https://www.tibiawiki.com.br/images/4/41/War_Crystal.gif' }
    ],
    baseCost: 250000,
  });

  // Fire Protection
  const [fireProtection, setFireProtection] = useState<ImbuementType>({
    enabled: false,
    goldTokens: 0,
    items: [
      { name: 'Green Dragon Leather', quantity: 20, price: 16000 },
      { name: 'Blazing Bone', quantity: 10, price: 1554 },
      { name: 'Draken Sulphur', quantity: 5, price: 1998 }
    ],
    baseCost: 250000,
  });

  // Death Protection
  const [deathProtection, setDeathProtection] = useState<ImbuementType>({
    enabled: false,
    goldTokens: 0,
    items: [
      { name: 'Flask of Embalming Fluid', quantity: 25, price: 8874 },
      { name: 'Gloom Wolf Fur', quantity: 20, price: 21587 },
      { name: 'Mystical Hourglass', quantity: 5, price: 0 }
    ],
    baseCost: 250000,
  });

  const [protectionType, setProtectionType] = useState<'fire' | 'death' | 'none'>('none');
  const [totalCost, setTotalCost] = useState(0);
  const [costPerHour, setCostPerHour] = useState(0);

  // Carregar dados salvos quando disponíveis
  useEffect(() => {
    if (savedImbuements) {
      console.log('Loading saved imbuements:', savedImbuements);
      
      // Atualizar preço do Gold Token
      setGoldTokenPrice(savedImbuements.goldTokenPrice || 50000);
      
      // Life Leech
      const lifeLeechEnabled = savedImbuements.lifeLeechEnabled === true;
      console.log('Setting Life Leech enabled:', lifeLeechEnabled);
      setLifeLeech(prev => ({
        ...prev,
        enabled: lifeLeechEnabled,
        goldTokens: savedImbuements.lifeLeechGoldTokens || 6,
      }));
      
      // Mana Leech
      const manaLeechEnabled = savedImbuements.manaLeechEnabled === true;
      console.log('Setting Mana Leech enabled:', manaLeechEnabled);
      setManaLeech(prev => ({
        ...prev,
        enabled: manaLeechEnabled,
        goldTokens: savedImbuements.manaLeechGoldTokens || 2,
        items: [
          { name: 'Silence Claws', quantity: savedImbuements.manaLeechSilenceClaws || 25, price: 3000 },
          { name: 'Some Grimeleech Wings', quantity: savedImbuements.manaLeechGrimeleech || 5, price: 1431 }
        ]
      }));
      
      // Critical
      const criticalEnabled = savedImbuements.criticalEnabled === true;
      console.log('Setting Critical enabled:', criticalEnabled);
      setCritical(prev => ({
        ...prev,
        enabled: criticalEnabled,
        goldTokens: savedImbuements.criticalGoldTokens || 4,
        items: [
          { name: 'Protective Charm', quantity: 20, price: 0, icon: 'https://www.tibiawiki.com.br/images/f/fb/Protective_Charm.gif' },
          { name: 'Sabretooth', quantity: 25, price: 0, icon: 'https://www.tibiawiki.com.br/images/f/f7/Sabretooth_%28Item%29.gif' },
          { name: 'Vexclaw Talon', quantity: savedImbuements.criticalVexclawTalons || 5, price: 1274, icon: 'https://www.tibiawiki.com.br/images/f/f7/Vexclaw_Talon.gif' }
        ]
      }));
      
      // Skill Sword
      const skillSwordEnabled = savedImbuements.skillSwordEnabled === true;
      console.log('Setting Skill Sword enabled:', skillSwordEnabled);
      setSkillSword(prev => ({
        ...prev,
        enabled: skillSwordEnabled,
        items: [
          { name: "Lion's Mane", quantity: savedImbuements.skillSwordLionsMane || 25, price: 150 },
          { name: "Mooh'tah Shell", quantity: savedImbuements.skillSwordMoohtahShell || 25, price: 4300, icon: 'https://www.tibiawiki.com.br/images/b/b2/Mooh%27tah_Shell.gif' },
          { name: 'War Crystal', quantity: savedImbuements.skillSwordWarCrystal || 5, price: 970, icon: 'https://www.tibiawiki.com.br/images/4/41/War_Crystal.gif' }
        ]
      }));
      
      // Fire Protection
      setFireProtection(prev => ({
        ...prev,
        enabled: savedImbuements.protectionType === 'fire',
        items: [
          { name: 'Green Dragon Leather', quantity: savedImbuements.fireProtectionGreenDragonLeather || 20, price: 16000 },
          { name: 'Blazing Bone', quantity: savedImbuements.fireProtectionBlazingBone || 10, price: 1554 },
          { name: 'Draken Sulphur', quantity: savedImbuements.fireProtectionDrakenSulphur || 5, price: 1998 }
        ]
      }));
      
      // Death Protection
      setDeathProtection(prev => ({
        ...prev,
        enabled: savedImbuements.protectionType === 'death',
        items: [
          { name: 'Flask of Embalming Fluid', quantity: savedImbuements.deathProtectionFlaskEmbalming || 25, price: 8874 },
          { name: 'Gloom Wolf Fur', quantity: savedImbuements.deathProtectionGloomWolfFur || 20, price: 21587 },
          { name: 'Mystical Hourglass', quantity: savedImbuements.deathProtectionMysticalHourglass || 5, price: 0 }
        ]
      }));
      
      // Protection Type
      setProtectionType(savedImbuements.protectionType || 'none');
    }
  }, [savedImbuements]);

  // Função para calcular o custo de um imbuement
  const calculateImbuementCost = (imbuement: ImbuementType): number => {
    if (!imbuement.enabled) return 0;
    
    let cost = imbuement.baseCost;
    
    // Adicionar custo dos gold tokens
    if (imbuement.goldTokens > 0) {
      cost += imbuement.goldTokens * goldTokenPrice;
    }
    
    // Adicionar custo dos itens
    imbuement.items.forEach(item => {
      cost += item.quantity * item.price;
    });
    
    return cost;
  };

  // Calcular totais quando algo mudar
  useEffect(() => {
    let total = 0;
    
    // Life Leech
    if (lifeLeech.enabled) {
      total += calculateImbuementCost(lifeLeech);
    }
    
    // Mana Leech
    if (manaLeech.enabled) {
      total += calculateImbuementCost(manaLeech);
    }
    
    // Critical
    if (critical.enabled) {
      total += calculateImbuementCost(critical);
    }
    
    // Skill Sword
    if (skillSword.enabled) {
      total += calculateImbuementCost(skillSword);
    }
    
    // Protection (apenas um tipo)
    if (protectionType === 'fire' && fireProtection.enabled) {
      total += calculateImbuementCost(fireProtection);
    } else if (protectionType === 'death' && deathProtection.enabled) {
      total += calculateImbuementCost(deathProtection);
    }
    
    setTotalCost(total);
    const hourCost = total / 20; // Imbuements duram 20 horas
    setCostPerHour(hourCost);
    
    // Chamar callback quando o custo mudar
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
      return { ...prev, items: newItems };
    });
  };

  const updateItemQuantity = (
    setter: React.Dispatch<React.SetStateAction<ImbuementType>>,
    itemIndex: number,
    newQuantity: number
  ) => {
    setter(prev => {
      const newItems = [...prev.items];
      newItems[itemIndex] = { ...newItems[itemIndex], quantity: newQuantity };
      return { ...prev, items: newItems };
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
      id: savedImbuements?.id, // Incluir o ID se já existir
      playerId,
      goldTokenPrice,
      
      // Life Leech
      lifeLeechEnabled: lifeLeech.enabled,
      lifeLeechGoldTokens: lifeLeech.goldTokens,
      lifeLeechCost: calculateImbuementCost(lifeLeech),
      
      // Mana Leech
      manaLeechEnabled: manaLeech.enabled,
      manaLeechGoldTokens: manaLeech.goldTokens,
      manaLeechSilenceClaws: manaLeech.items[0]?.quantity || 25,
      manaLeechGrimeleech: manaLeech.items[1]?.quantity || 5,
      manaLeechCost: calculateImbuementCost(manaLeech),
      
      // Critical
      criticalEnabled: critical.enabled,
      criticalGoldTokens: critical.goldTokens,
      criticalVexclawTalons: critical.items[2]?.quantity || 5, // Corrigir índice do array
      criticalCost: calculateImbuementCost(critical),
      
      // Skill Sword
      skillSwordEnabled: skillSword.enabled,
      skillSwordLionsMane: skillSword.items[0]?.quantity || 25,
      skillSwordMoohtahShell: skillSword.items[1]?.quantity || 25,
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
    showGoldTokens = true,
    hideHeader = false,
  }: {
    title: string;
    icon: React.ReactNode;
    imbuement: ImbuementType;
    setter: React.Dispatch<React.SetStateAction<ImbuementType>>;
    showGoldTokens?: boolean;
    hideHeader?: boolean;
  }) => (
    <div className={hideHeader ? '' : `bg-zinc-950 rounded-lg p-6 border ${imbuement.enabled ? 'border-green-800' : 'border-zinc-900'}`}>
      {!hideHeader && (
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            {icon}
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
      )}
      
      {(hideHeader || imbuement.enabled) && (
        <div className="space-y-4">
          {showGoldTokens && imbuement.goldTokens > 0 && (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-zinc-400 mb-1">Gold Tokens Necessários</label>
                <input
                  type="number"
                  value={imbuement.goldTokens}
                  onChange={(e) => setter(prev => ({ ...prev, goldTokens: parseInt(e.target.value) || 0 }))}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-md px-3 py-2 text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-400 mb-1">Custo Gold Token</label>
                <div className="text-sm text-zinc-500 mt-2">
                  {formatGold(imbuement.goldTokens * goldTokenPrice)}
                </div>
              </div>
            </div>
          )}
          
          {imbuement.items.map((item, index) => (
            <div key={index} className="space-y-2">
              <div className="flex items-center gap-2">
                {item.icon && (
                  <img src={item.icon} alt={item.name} className="w-6 h-6" />
                )}
                <label className="block text-sm font-medium text-zinc-400">{item.name}</label>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="text-xs text-zinc-500">Quantidade</label>
                  <input
                    type="number"
                    value={item.quantity}
                    onChange={(e) => updateItemQuantity(setter, index, parseInt(e.target.value) || 0)}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-md px-2 py-1 text-white text-sm"
                  />
                </div>
                <div>
                  <label className="text-xs text-zinc-500">Preço Unit.</label>
                  <input
                    type="number"
                    value={item.price}
                    onChange={(e) => updateItemPrice(setter, index, parseInt(e.target.value) || 0)}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-md px-2 py-1 text-white text-sm"
                  />
                </div>
                <div>
                  <label className="text-xs text-zinc-500">Total</label>
                  <div className="text-sm mt-1 text-white">
                    {formatGold(item.quantity * item.price)}
                  </div>
                </div>
              </div>
            </div>
          ))}
          
          <div className="pt-4 border-t border-zinc-800">
            <div className="flex justify-between text-sm">
              <span className="text-zinc-400">Custo Base Imbuement:</span>
              <span className="text-white">{formatGold(imbuement.baseCost)}</span>
            </div>
            <div className="flex justify-between font-semibold mt-2">
              <span className="text-zinc-400">Total:</span>
              <span className="text-green-400">
                {formatGold(calculateImbuementCost(imbuement))}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header com configuração de Gold Token */}
      <div className="bg-zinc-950 rounded-lg p-6 border border-zinc-900">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Calculator className="h-5 w-5 text-yellow-400" />
            <h2 className="text-lg font-medium text-white">Calculadora de Imbuements</h2>
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
              placeholder="50000"
              className="w-full bg-zinc-900 border border-zinc-800 rounded-md px-3 py-2 text-white"
            />
            <p className="text-xs text-zinc-500 mt-1">
              Valor atual de 1 Gold Token em gold
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
              <div className="bg-zinc-950 rounded-lg p-6 border border-zinc-900">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <img src="https://www.tibiawiki.com.br/images/6/6e/Vampirism_%28Roubo_de_Vida%29.gif" alt="Life Leech" className="w-8 h-8" />
                    <h3 className="text-lg font-medium text-white">Life Leech (Vampirism)</h3>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={lifeLeech.enabled}
                      onChange={(e) => setLifeLeech(prev => ({ ...prev, enabled: e.target.checked }))}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-zinc-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
                  </label>
                </div>
                {lifeLeech.enabled && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-zinc-400 mb-1">Gold Tokens (usar no lugar dos itens)</label>
                        <input
                          type="number"
                          value={lifeLeech.goldTokens}
                          onChange={(e) => setLifeLeech(prev => ({ ...prev, goldTokens: parseInt(e.target.value) || 0 }))}
                          className="w-full bg-zinc-900 border border-zinc-800 rounded-md px-3 py-2 text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-zinc-400 mb-1">Custo Gold Token</label>
                        <div className="text-sm text-zinc-500 mt-2">
                          {formatGold(lifeLeech.goldTokens * goldTokenPrice)}
                        </div>
                      </div>
                    </div>
                    <div className="pt-4 border-t border-zinc-800">
                      <div className="flex justify-between text-sm">
                        <span className="text-zinc-400">Custo Base Imbuement:</span>
                        <span className="text-white">{formatGold(lifeLeech.baseCost)}</span>
                      </div>
                      <div className="flex justify-between font-semibold mt-2">
                        <span className="text-zinc-400">Total:</span>
                        <span className="text-green-400">
                          {formatGold(calculateImbuementCost(lifeLeech))}
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="bg-zinc-950 rounded-lg p-6 border border-zinc-900">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <img src="https://www.tibiawiki.com.br/images/4/40/Void_%28Roubo_de_Mana%29.gif" alt="Mana Leech" className="w-8 h-8" />
                    <h3 className="text-lg font-medium text-white">Mana Leech (Void)</h3>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={manaLeech.enabled}
                      onChange={(e) => setManaLeech(prev => ({ ...prev, enabled: e.target.checked }))}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-zinc-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
                  </label>
                </div>
                {manaLeech.enabled && (
                  <ImbuementCard
                    title=""
                    icon={null}
                    imbuement={manaLeech}
                    setter={setManaLeech}
                    hideHeader={true}
                  />
                )}
              </div>

              <div className="bg-zinc-950 rounded-lg p-6 border border-zinc-900">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <img src="https://www.tibiawiki.com.br/images/1/14/Strike_%28Dano_Cr%C3%ADtico%29.gif" alt="Critical" className="w-8 h-8" />
                    <h3 className="text-lg font-medium text-white">Critical (Strike)</h3>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={critical.enabled}
                      onChange={(e) => setCritical(prev => ({ ...prev, enabled: e.target.checked }))}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-zinc-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
                  </label>
                </div>
                {critical.enabled && (
                  <ImbuementCard
                    title=""
                    icon={null}
                    imbuement={critical}
                    setter={setCritical}
                    hideHeader={true}
                  />
                )}
              </div>
            </>
          )}

          {activeTab === 'skills' && (
            <div className="bg-zinc-950 rounded-lg p-6 border border-zinc-900">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <img src="https://www.tibiawiki.com.br/images/2/2a/Slash_%28Skillboost_de_Espada%29.gif" alt="Skill Sword" className="w-8 h-8" />
                  <h3 className="text-lg font-medium text-white">Skill Sword (Slash)</h3>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={skillSword.enabled}
                    onChange={(e) => setSkillSword(prev => ({ ...prev, enabled: e.target.checked }))}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-zinc-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
                </label>
              </div>
              {skillSword.enabled && (
                <ImbuementCard
                  title=""
                  icon={null}
                  imbuement={skillSword}
                  setter={setSkillSword}
                  showGoldTokens={false}
                  hideHeader={true}
                />
              )}
            </div>
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
                  title="Proteção de Fogo (Dragon Hide)"
                  icon={<Flame className="h-5 w-5 text-orange-500" />}
                  imbuement={fireProtection}
                  setter={setFireProtection}
                  showGoldTokens={false}
                />
              )}

              {protectionType === 'death' && (
                <ImbuementCard
                  title="Proteção de Morte (Lich Shroud)"
                  icon={<Skull className="h-5 w-5 text-purple-500" />}
                  imbuement={deathProtection}
                  setter={setDeathProtection}
                  showGoldTokens={false}
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
                  <span className="text-zinc-400">Life Leech:</span>
                  <span className="text-white">{formatGold(calculateImbuementCost(lifeLeech))}</span>
                </div>
              )}
              {manaLeech.enabled && (
                <div className="flex justify-between text-sm">
                  <span className="text-zinc-400">Mana Leech:</span>
                  <span className="text-white">{formatGold(calculateImbuementCost(manaLeech))}</span>
                </div>
              )}
              {critical.enabled && (
                <div className="flex justify-between text-sm">
                  <span className="text-zinc-400">Critical:</span>
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