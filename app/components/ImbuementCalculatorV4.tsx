'use client';

import { useState, useEffect } from 'react';
import { Calculator, Coins, Shield, Flame, Skull, Save, TrendingUp, TrendingDown } from 'lucide-react';
import { useImbuements } from '../hooks/useSupabase';
import PriceInput from './PriceInput';

interface ImbuementItem {
  name: string;
  quantity: number;
  price: number;
  icon?: string;
}

interface GoldTokenOption {
  tokens: number;
  coversItems: string[]; // Quais itens são cobertos por essa quantidade de tokens
  cost: number;
  remainingItemsCost: number; // Custo dos itens não cobertos
  totalCost: number;
}

interface ImbuementType {
  enabled: boolean;
  goldTokensUsed: number; // Quantos gold tokens estão sendo usados (0, 2, 4 ou 6)
  items: ImbuementItem[];
  baseCost: number;
  goldTokenOptions?: GoldTokenOption[]; // Todas as opções possíveis
  bestOption?: GoldTokenOption | 'all-items'; // Melhor opção calculada
}

interface ImbuementCalculatorV4Props {
  onCostUpdate?: (costPerHour: number) => void;
  playerId?: string;
}

export default function ImbuementCalculatorV4({ onCostUpdate, playerId = 'general' }: ImbuementCalculatorV4Props) {
  const { imbuements: savedImbuements, saveImbuements } = useImbuements(playerId);
  const [goldTokenPrice, setGoldTokenPrice] = useState(45800);
  const [activeTab, setActiveTab] = useState<'combat' | 'skills' | 'protection'>('combat');
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  
  // Life Leech (Vampirism) - Powerful
  const [lifeLeech, setLifeLeech] = useState<ImbuementType>({
    enabled: false,
    goldTokensUsed: 0,
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
    goldTokensUsed: 0,
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
    goldTokensUsed: 0,
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
    goldTokensUsed: 0,
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
    goldTokensUsed: 0,
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
    goldTokensUsed: 0,
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

  // Carregar dados salvos quando disponíveis
  useEffect(() => {
    if (savedImbuements) {
      console.log('Loading saved imbuements:', savedImbuements);
      
      // Atualizar preço do Gold Token
      setGoldTokenPrice(savedImbuements.goldTokenPrice || 45800);
      
      // Life Leech
      setLifeLeech(prev => ({
        ...prev,
        enabled: savedImbuements.lifeLeechEnabled === true,
        goldTokensUsed: savedImbuements.lifeLeechGoldTokens || 0,
        items: [
          { name: 'Vampire Teeth', quantity: 25, price: savedImbuements.vampireTeethPrice || 1898 },
          { name: 'Bloody Pincers', quantity: 15, price: savedImbuements.bloodyPincersPrice || 9988 },
          { name: 'Piece of Dead Brain', quantity: 5, price: savedImbuements.pieceOfDeadBrainPrice || 18999 }
        ]
      }));
      
      // Mana Leech
      setManaLeech(prev => ({
        ...prev,
        enabled: savedImbuements.manaLeechEnabled === true,
        goldTokensUsed: savedImbuements.manaLeechGoldTokens || 0,
        items: [
          { name: 'Rope Belt', quantity: 25, price: savedImbuements.ropeBeltPrice || 4800 },
          { name: 'Silencer Claws', quantity: savedImbuements.manaLeechSilenceClaws || 15, price: savedImbuements.silencerClawsPrice || 2995 },
          { name: 'Some Grimeleech Wings', quantity: savedImbuements.manaLeechGrimeleech || 5, price: savedImbuements.grimeleechWingsPrice || 1436 }
        ]
      }));
      
      // Critical
      setCritical(prev => ({
        ...prev,
        enabled: savedImbuements.criticalEnabled === true,
        goldTokensUsed: savedImbuements.criticalGoldTokens || 0,
        items: [
          { name: 'Protective Charm', quantity: 20, price: savedImbuements.protectiveCharmPrice || 780 },
          { name: 'Sabretooth', quantity: 25, price: savedImbuements.sabretoothPrice || 390 },
          { name: 'Vexclaw Talon', quantity: savedImbuements.criticalVexclawTalons || 5, price: savedImbuements.vexclawTalonPrice || 1274 }
        ]
      }));
      
      // Skill Sword
      setSkillSword(prev => ({
        ...prev,
        enabled: savedImbuements.skillSwordEnabled === true,
        items: [
          { name: "Lion's Mane", quantity: savedImbuements.skillSwordLionsMane || 25, price: savedImbuements.lionsManePrice || 150 },
          { name: "Mooh'tah Shell", quantity: savedImbuements.skillSwordMoohtahShell || 15, price: savedImbuements.moohtahShellPrice || 4300 },
          { name: 'War Crystal', quantity: savedImbuements.skillSwordWarCrystal || 5, price: savedImbuements.warCrystalPrice || 970 }
        ]
      }));
      
      // Fire Protection
      setFireProtection(prev => ({
        ...prev,
        enabled: savedImbuements.protectionType === 'fire',
        items: [
          { name: 'Green Dragon Leather', quantity: savedImbuements.fireProtectionGreenDragonLeather || 20, price: savedImbuements.greenDragonLeatherPrice || 16000 },
          { name: 'Blazing Bone', quantity: savedImbuements.fireProtectionBlazingBone || 10, price: savedImbuements.blazingBonePrice || 1554 },
          { name: 'Draken Sulphur', quantity: savedImbuements.fireProtectionDrakenSulphur || 5, price: savedImbuements.drakenSulphurPrice || 1998 }
        ]
      }));
      
      // Death Protection
      setDeathProtection(prev => ({
        ...prev,
        enabled: savedImbuements.protectionType === 'death',
        items: [
          { name: 'Flask of Embalming Fluid', quantity: savedImbuements.deathProtectionFlaskEmbalming || 25, price: savedImbuements.flaskEmbalmingPrice || 8874 },
          { name: 'Gloom Wolf Fur', quantity: savedImbuements.deathProtectionGloomWolfFur || 20, price: savedImbuements.gloomWolfFurPrice || 21587 },
          { name: 'Mystical Hourglass', quantity: savedImbuements.deathProtectionMysticalHourglass || 5, price: savedImbuements.mysticalHourglassPrice || 700 }
        ]
      }));
      
      // Protection Type
      setProtectionType(savedImbuements.protectionType || 'none');
    }
  }, [savedImbuements]);

  // Função para calcular o custo dos itens
  const calculateItemsCost = (items: ImbuementItem[]): number => {
    return items.reduce((total, item) => total + (item.quantity * item.price), 0);
  };

  // Função para calcular todas as opções de Gold Tokens
  const calculateGoldTokenOptions = (items: ImbuementItem[], maxTokens: number): GoldTokenOption[] => {
    const options: GoldTokenOption[] = [];
    
    if (maxTokens === 0) return options;
    
    // Para imbuements com 6 tokens máximo (Life Leech)
    if (maxTokens === 6) {
      // 2 tokens = primeiro item
      const option2 = {
        tokens: 2,
        coversItems: [items[0].name],
        cost: 2 * goldTokenPrice,
        remainingItemsCost: (items[1].quantity * items[1].price) + (items[2].quantity * items[2].price),
        totalCost: 0
      };
      option2.totalCost = option2.cost + option2.remainingItemsCost;
      options.push(option2);
      
      // 4 tokens = primeiros dois itens
      const option4 = {
        tokens: 4,
        coversItems: [items[0].name, items[1].name],
        cost: 4 * goldTokenPrice,
        remainingItemsCost: items[2].quantity * items[2].price,
        totalCost: 0
      };
      option4.totalCost = option4.cost + option4.remainingItemsCost;
      options.push(option4);
      
      // 6 tokens = todos os itens
      const option6 = {
        tokens: 6,
        coversItems: items.map(i => i.name),
        cost: 6 * goldTokenPrice,
        remainingItemsCost: 0,
        totalCost: 6 * goldTokenPrice
      };
      options.push(option6);
    }
    
    // Para imbuements com 2 tokens máximo (Mana Leech)
    if (maxTokens === 2) {
      // 2 tokens = primeiro item (Rope Belt)
      const option2 = {
        tokens: 2,
        coversItems: [items[0].name],
        cost: 2 * goldTokenPrice,
        remainingItemsCost: (items[1].quantity * items[1].price) + (items[2].quantity * items[2].price),
        totalCost: 0
      };
      option2.totalCost = option2.cost + option2.remainingItemsCost;
      options.push(option2);
    }
    
    // Para imbuements com 4 tokens máximo (Critical)
    if (maxTokens === 4) {
      // 2 tokens = primeiro item
      const option2 = {
        tokens: 2,
        coversItems: [items[0].name],
        cost: 2 * goldTokenPrice,
        remainingItemsCost: (items[1].quantity * items[1].price) + (items[2].quantity * items[2].price),
        totalCost: 0
      };
      option2.totalCost = option2.cost + option2.remainingItemsCost;
      options.push(option2);
      
      // 4 tokens = todos os itens
      const option4 = {
        tokens: 4,
        coversItems: items.map(i => i.name),
        cost: 4 * goldTokenPrice,
        remainingItemsCost: 0,
        totalCost: 4 * goldTokenPrice
      };
      options.push(option4);
    }
    
    return options;
  };

  // Função para encontrar a melhor opção
  const findBestOption = (items: ImbuementItem[], maxTokens: number): GoldTokenOption | 'all-items' => {
    const allItemsCost = calculateItemsCost(items);
    const options = calculateGoldTokenOptions(items, maxTokens);
    
    if (options.length === 0) return 'all-items';
    
    // Encontrar a opção mais barata entre todas as opções de tokens
    let bestTokenOption = options[0];
    for (const option of options) {
      if (option.totalCost < bestTokenOption.totalCost) {
        bestTokenOption = option;
      }
    }
    
    // Comparar com o custo de comprar todos os itens
    if (allItemsCost < bestTokenOption.totalCost) {
      return 'all-items';
    }
    
    return bestTokenOption;
  };

  // Atualizar automaticamente o método mais barato quando o preço do gold token mudar
  // Mas NÃO sobrescrever o goldTokensUsed se já tiver dados salvos
  useEffect(() => {
    // Só recalcular se não houver dados salvos ou após os dados serem carregados
    if (!savedImbuements) {
      // Life Leech (6 tokens max)
      const lifeLeechOptions = calculateGoldTokenOptions(lifeLeech.items, 6);
      const lifeLeechBest = findBestOption(lifeLeech.items, 6);
      setLifeLeech(prev => ({
        ...prev,
        goldTokenOptions: lifeLeechOptions,
        bestOption: lifeLeechBest,
        goldTokensUsed: lifeLeechBest === 'all-items' ? 0 : lifeLeechBest.tokens
      }));
      
      // Mana Leech (2 tokens max)
      const manaLeechOptions = calculateGoldTokenOptions(manaLeech.items, 2);
      const manaLeechBest = findBestOption(manaLeech.items, 2);
      setManaLeech(prev => ({
        ...prev,
        goldTokenOptions: manaLeechOptions,
        bestOption: manaLeechBest,
        goldTokensUsed: manaLeechBest === 'all-items' ? 0 : manaLeechBest.tokens
      }));
      
      // Critical (4 tokens max)
      const criticalOptions = calculateGoldTokenOptions(critical.items, 4);
      const criticalBest = findBestOption(critical.items, 4);
      setCritical(prev => ({
        ...prev,
        goldTokenOptions: criticalOptions,
        bestOption: criticalBest,
        goldTokensUsed: criticalBest === 'all-items' ? 0 : criticalBest.tokens
      }));
    } else {
      // Se houver dados salvos, recalcular as opções e melhor opção mas manter o goldTokensUsed salvo
      const lifeLeechOptions = calculateGoldTokenOptions(lifeLeech.items, 6);
      const lifeLeechBest = findBestOption(lifeLeech.items, 6);
      setLifeLeech(prev => ({
        ...prev,
        goldTokenOptions: lifeLeechOptions,
        bestOption: lifeLeechBest,
      }));
      
      const manaLeechOptions = calculateGoldTokenOptions(manaLeech.items, 2);
      const manaLeechBest = findBestOption(manaLeech.items, 2);
      setManaLeech(prev => ({
        ...prev,
        goldTokenOptions: manaLeechOptions,
        bestOption: manaLeechBest,
      }));
      
      const criticalOptions = calculateGoldTokenOptions(critical.items, 4);
      const criticalBest = findBestOption(critical.items, 4);
      setCritical(prev => ({
        ...prev,
        goldTokenOptions: criticalOptions,
        bestOption: criticalBest,
      }));
    }
  }, [goldTokenPrice, savedImbuements]);

  // Função para calcular o custo de um imbuement
  const calculateImbuementCost = (imbuement: ImbuementType): number => {
    if (!imbuement.enabled) return 0;
    
    let cost = imbuement.baseCost;
    
    if (imbuement.goldTokensUsed === 0) {
      // Usar apenas itens
      cost += calculateItemsCost(imbuement.items);
    } else {
      // Usar a opção de tokens selecionada
      const selectedOption = imbuement.goldTokenOptions?.find(opt => opt.tokens === imbuement.goldTokensUsed);
      if (selectedOption) {
        cost += selectedOption.totalCost;
      }
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
    newPrice: number,
    maxTokens: number
  ) => {
    setter(prev => {
      const newItems = [...prev.items];
      newItems[itemIndex] = { ...newItems[itemIndex], price: newPrice };
      
      // Recalcular opções mas manter a escolha atual do usuário
      const newOptions = calculateGoldTokenOptions(newItems, maxTokens);
      const newBest = findBestOption(newItems, maxTokens);
      
      return {
        ...prev,
        items: newItems,
        goldTokenOptions: newOptions,
        bestOption: newBest,
        // Manter a escolha atual do usuário ao invés de forçar a melhor opção
        // goldTokensUsed permanece o mesmo
      };
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
        lifeLeechGoldTokens: lifeLeech.goldTokensUsed,
        lifeLeechCost: calculateImbuementCost(lifeLeech),
        vampireTeethPrice: lifeLeech.items[0]?.price,
        bloodyPincersPrice: lifeLeech.items[1]?.price,
        pieceOfDeadBrainPrice: lifeLeech.items[2]?.price,
        
        // Mana Leech
        manaLeechEnabled: manaLeech.enabled,
        manaLeechGoldTokens: manaLeech.goldTokensUsed,
        manaLeechSilenceClaws: manaLeech.items[1]?.quantity || 15,
        manaLeechGrimeleech: manaLeech.items[2]?.quantity || 5,
        manaLeechCost: calculateImbuementCost(manaLeech),
        ropeBeltPrice: manaLeech.items[0]?.price,
        silencerClawsPrice: manaLeech.items[1]?.price,
        grimeleechWingsPrice: manaLeech.items[2]?.price,
        
        // Critical
        criticalEnabled: critical.enabled,
        criticalGoldTokens: critical.goldTokensUsed,
        criticalVexclawTalons: critical.items[2]?.quantity || 5,
        criticalCost: calculateImbuementCost(critical),
        protectiveCharmPrice: critical.items[0]?.price,
        sabretoothPrice: critical.items[1]?.price,
        vexclawTalonPrice: critical.items[2]?.price,
        
        // Skill Sword
        skillSwordEnabled: skillSword.enabled,
        skillSwordLionsMane: skillSword.items[0]?.quantity || 25,
        skillSwordMoohtahShell: skillSword.items[1]?.quantity || 15,
        skillSwordWarCrystal: skillSword.items[2]?.quantity || 5,
        skillSwordCost: calculateImbuementCost(skillSword),
        lionsManePrice: skillSword.items[0]?.price,
        moohtahShellPrice: skillSword.items[1]?.price,
        warCrystalPrice: skillSword.items[2]?.price,
        
        // Fire Protection
        fireProtectionGreenDragonLeather: fireProtection.items[0]?.quantity || 20,
        fireProtectionBlazingBone: fireProtection.items[1]?.quantity || 10,
        fireProtectionDrakenSulphur: fireProtection.items[2]?.quantity || 5,
        fireProtectionCost: calculateImbuementCost(fireProtection),
        greenDragonLeatherPrice: fireProtection.items[0]?.price,
        blazingBonePrice: fireProtection.items[1]?.price,
        drakenSulphurPrice: fireProtection.items[2]?.price,
        
        // Death Protection
        deathProtectionFlaskEmbalming: deathProtection.items[0]?.quantity || 25,
        deathProtectionGloomWolfFur: deathProtection.items[1]?.quantity || 20,
        deathProtectionMysticalHourglass: deathProtection.items[2]?.quantity || 5,
        deathProtectionCost: calculateImbuementCost(deathProtection),
        flaskEmbalmingPrice: deathProtection.items[0]?.price,
        gloomWolfFurPrice: deathProtection.items[1]?.price,
        mysticalHourglassPrice: deathProtection.items[2]?.price,
        
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
    maxTokens = 0,
  }: {
    title: string;
    icon: string;
    imbuement: ImbuementType;
    setter: React.Dispatch<React.SetStateAction<ImbuementType>>;
    maxTokens?: number;
  }) => {
    const [copied, setCopied] = useState(false);
    const allItemsCost = calculateItemsCost(imbuement.items);
    
    // Função para gerar o comando do NPC baseado no título e tokens
    const getNPCCommand = () => {
      if (imbuement.goldTokensUsed === 0) return null;
      
      // Extrair o nome do imbuement do título
      let imbuementName = '';
      let level = 'powerful'; // Default para 6 tokens
      
      if (title.includes('Vampirism')) {
        imbuementName = 'vampirism';
      } else if (title.includes('Void')) {
        imbuementName = 'void';
      } else if (title.includes('Strike')) {
        imbuementName = 'strike';
      } else if (title.includes('Slash')) {
        imbuementName = 'slash';
      } else if (title.includes('Fire Protection')) {
        imbuementName = 'dragon hide';
      } else if (title.includes('Death Protection')) {
        imbuementName = 'lich shroud';
      }
      
      // Determinar o nível baseado no número de tokens
      if (imbuement.goldTokensUsed === 2) {
        level = 'basic';
      } else if (imbuement.goldTokensUsed === 4) {
        level = 'intricate';
      } else if (imbuement.goldTokensUsed === 6) {
        level = 'powerful';
      }
      
      return `${imbuementName} ${level} yes`;
    };
    
    const handleCopyNPCCommand = () => {
      const command = getNPCCommand();
      if (command) {
        navigator.clipboard.writeText(command);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }
    };

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
            {/* Análise de custos com todas as opções */}
            {maxTokens > 0 && (
              <div className="bg-zinc-900 rounded-lg p-4 space-y-3">
                <h4 className="text-sm font-medium text-zinc-400 mb-2">Análise de Custo</h4>
                
                {/* Opções de Gold Tokens */}
                <div className="space-y-2">
                  {/* Opção: Todos os itens */}
                  <div 
                    className={`p-3 rounded-md border cursor-pointer transition-all ${
                      imbuement.goldTokensUsed === 0 
                        ? 'border-green-600 bg-green-950/30' 
                        : 'border-zinc-700 bg-zinc-800/50 hover:border-zinc-600'
                    }`}
                    onClick={() => setter(prev => ({ ...prev, goldTokensUsed: 0 }))}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-sm font-medium text-white">Comprar todos os itens</span>
                        <div className="text-xs text-zinc-400 mt-1">
                          {imbuement.items.map(i => i.name).join(' + ')}
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold text-white">{formatGold(allItemsCost)}</p>
                        {imbuement.bestOption === 'all-items' && (
                          <span className="text-xs text-green-400">Melhor opção</span>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  {/* Opções de Gold Tokens */}
                  {imbuement.goldTokenOptions?.map(option => (
                    <div 
                      key={option.tokens}
                      className={`p-3 rounded-md border cursor-pointer transition-all ${
                        imbuement.goldTokensUsed === option.tokens 
                          ? 'border-green-600 bg-green-950/30' 
                          : 'border-zinc-700 bg-zinc-800/50 hover:border-zinc-600'
                      }`}
                      onClick={() => setter(prev => ({ ...prev, goldTokensUsed: option.tokens }))}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="text-sm font-medium text-white">
                            {option.tokens} Gold Tokens
                          </span>
                          <div className="text-xs text-zinc-400 mt-1">
                            Cobre: {option.coversItems.join(', ')}
                            {option.remainingItemsCost > 0 && (
                              <span className="text-yellow-400">
                                {' '}+ itens restantes ({formatGold(option.remainingItemsCost)})
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-lg font-bold text-white">{formatGold(option.totalCost)}</p>
                          {imbuement.bestOption !== 'all-items' && 
                           imbuement.bestOption?.tokens === option.tokens && (
                            <span className="text-xs text-green-400">Melhor opção</span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                
                {/* Botão para copiar comando do NPC quando usar Gold Tokens */}
                {imbuement.goldTokensUsed > 0 && (
                  <div className="bg-zinc-800/50 rounded-md p-3 border border-zinc-700">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs text-zinc-400 mb-1">Comando para o NPC:</p>
                        <p className="text-sm text-white font-mono">{getNPCCommand()}</p>
                      </div>
                      <button
                        onClick={handleCopyNPCCommand}
                        className={`px-3 py-1 ${copied ? 'bg-green-600' : 'bg-zinc-700 hover:bg-zinc-600'} text-white text-sm rounded-md transition-colors flex items-center gap-2`}
                      >
                        {copied ? (
                          <>
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            Copiado!
                          </>
                        ) : (
                          <>
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                            </svg>
                            Copiar
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                )}
                
                {/* Resumo da economia */}
                {imbuement.bestOption && (
                  <div className="bg-green-950/50 rounded-md p-2 border border-green-800/50">
                    <p className="text-sm text-green-400">
                      💰 Melhor opção: {
                        imbuement.bestOption === 'all-items' 
                          ? 'Comprar todos os itens' 
                          : `${imbuement.bestOption.tokens} Gold Tokens`
                      } - Total: {formatGold(
                        imbuement.bestOption === 'all-items' 
                          ? allItemsCost 
                          : imbuement.bestOption.totalCost
                      )}
                    </p>
                  </div>
                )}
              </div>
            )}
            
            {/* Lista de itens com preços editáveis */}
            <div className="space-y-3">
              <h4 className="text-sm font-medium text-zinc-400">Preços dos Itens</h4>
              {imbuement.items.map((item, index) => {
                // Verificar se este item está coberto por gold tokens
                const isCoveredByTokens = imbuement.goldTokensUsed > 0 && 
                  imbuement.goldTokenOptions?.find(opt => opt.tokens === imbuement.goldTokensUsed)
                    ?.coversItems.includes(item.name);
                
                return (
                  <div key={`${item.name}-${index}`} className="grid grid-cols-4 gap-2 items-center">
                    <div className="col-span-1">
                      <label className="text-xs text-zinc-500">{item.name}</label>
                      <div className="text-sm text-white">
                        {item.quantity}x
                        {isCoveredByTokens && (
                          <span className="text-xs text-yellow-400 ml-1">(Token)</span>
                        )}
                      </div>
                    </div>
                    <div className="col-span-1">
                      <label className="text-xs text-zinc-500">Preço Unit.</label>
                      <PriceInput
                        value={item.price}
                        onChange={(newPrice) => updateItemPrice(setter, index, newPrice, maxTokens)}
                        className="w-full bg-zinc-900 border border-zinc-800 rounded-md px-2 py-1 text-white text-sm focus:outline-none focus:border-yellow-600"
                      />
                    </div>
                    <div className="col-span-1">
                      <label className="text-xs text-zinc-500">Total</label>
                      <div className="text-sm text-white">
                        {formatGold(item.quantity * item.price)}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
            
            {/* Resumo de custos */}
            <div className="pt-4 border-t border-zinc-800">
              <div className="flex justify-between text-sm">
                <span className="text-zinc-400">Custo Base Imbuement:</span>
                <span className="text-white">{formatGold(imbuement.baseCost)}</span>
              </div>
              <div className="flex justify-between text-sm mt-1">
                <span className="text-zinc-400">
                  {imbuement.goldTokensUsed > 0 
                    ? `${imbuement.goldTokensUsed} Gold Tokens + Itens:` 
                    : 'Itens:'}
                </span>
                <span className="text-white">
                  {formatGold(calculateImbuementCost(imbuement) - imbuement.baseCost)}
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
                maxTokens={6}
              />
              <ImbuementCard
                title="Mana Leech (Void)"
                icon="https://www.tibiawiki.com.br/images/4/40/Void_%28Roubo_de_Mana%29.gif"
                imbuement={manaLeech}
                setter={setManaLeech}
                maxTokens={2}
              />
              <ImbuementCard
                title="Critical (Strike)"
                icon="https://www.tibiawiki.com.br/images/1/14/Strike_%28Dano_Cr%C3%ADtico%29.gif"
                imbuement={critical}
                setter={setCritical}
                maxTokens={4}
              />
            </>
          )}

          {activeTab === 'skills' && (
            <ImbuementCard
              title="Skill Sword (Slash)"
              icon="https://www.tibiawiki.com.br/images/2/2a/Slash_%28Skillboost_de_Espada%29.gif"
              imbuement={skillSword}
              setter={setSkillSword}
              maxTokens={0}
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
                  icon="https://www.tibiawiki.com.br/images/3/3b/Dragon_Hide_%28Prote%C3%A7%C3%A3o_de_Fogo%29.gif"
                  imbuement={fireProtection}
                  setter={setFireProtection}
                  maxTokens={0}
                />
              )}

              {protectionType === 'death' && (
                <ImbuementCard
                  title="Death Protection (Lich Shroud)"
                  icon="https://www.tibiawiki.com.br/images/4/4a/Lich_Shroud_%28Prote%C3%A7%C3%A3o_de_Morte%29.gif"
                  imbuement={deathProtection}
                  setter={setDeathProtection}
                  maxTokens={0}
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
                    Life Leech {lifeLeech.goldTokensUsed > 0 ? `(${lifeLeech.goldTokensUsed} Gold Tokens)` : '(Itens)'}:
                  </span>
                  <span className="text-white">{formatGold(calculateImbuementCost(lifeLeech))}</span>
                </div>
              )}
              {manaLeech.enabled && (
                <div className="flex justify-between text-sm">
                  <span className="text-zinc-400">
                    Mana Leech {manaLeech.goldTokensUsed > 0 ? `(${manaLeech.goldTokensUsed} Gold Tokens)` : '(Itens)'}:
                  </span>
                  <span className="text-white">{formatGold(calculateImbuementCost(manaLeech))}</span>
                </div>
              )}
              {critical.enabled && (
                <div className="flex justify-between text-sm">
                  <span className="text-zinc-400">
                    Critical {critical.goldTokensUsed > 0 ? `(${critical.goldTokensUsed} Gold Tokens)` : '(Itens)'}:
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