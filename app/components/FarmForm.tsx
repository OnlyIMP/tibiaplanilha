import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { ConfigSettings, FarmEntry } from '../types/farm';
import { parseGold, formatGold } from '../utils/formatters';

interface FarmFormProps {
  playerId: string;
  playerName: string;
  config: ConfigSettings;
  onSubmit: (entry: Omit<FarmEntry, 'id' | 'date'>) => void;
  imbuementCostPerHour?: number;
}

const FarmForm: React.FC<FarmFormProps> = ({ playerId, playerName, config, onSubmit, imbuementCostPerHour = 0 }) => {
  const [loot, setLoot] = useState('');
  const [hours, setHours] = useState('2');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!loot || !hours) return;

    const lootGp = parseGold(loot);
    const hoursNum = parseFloat(hours);
    const totalImbuementCost = imbuementCostPerHour * hoursNum;
    const netLoot = lootGp - totalImbuementCost;
    const tcQuantity = netLoot / config.tcValue;
    const reaisValue = (tcQuantity / config.tcAmount) * config.tcPriceReais;
    const reaisPerHour = reaisValue / hoursNum;

    onSubmit({
      playerId,
      playerName,
      loot: lootGp,
      waste: totalImbuementCost,
      balance: netLoot,
      tcValue: config.tcValue,
      tcQuantity,
      reaisValue,
      hours: hoursNum,
      reaisPerHour,
      imbuementCostPerHour
    });

    setLoot('');
    setHours('2');
  };

  // Calculate preview values
  const lootGp = loot ? parseGold(loot) : 0;
  const hoursNum = hours ? parseFloat(hours) : 2;
  const totalImbuementCost = imbuementCostPerHour * hoursNum;
  const netLoot = lootGp - totalImbuementCost;
  const tcQuantity = netLoot / config.tcValue;
  const reaisValue = (tcQuantity / config.tcAmount) * config.tcPriceReais;
  const reaisPerHour = hoursNum > 0 ? reaisValue / hoursNum : 0;

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm text-zinc-400 mb-2">
            Farm (gold)
          </label>
          <input
            type="text"
            value={loot}
            onChange={(e) => setLoot(e.target.value)}
            className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 rounded-md focus:outline-none focus:border-zinc-600 text-white placeholder-zinc-600"
            placeholder="Ex: 4500000 ou 4500k ou 4.5kk"
            required
          />
          {loot && (
            <p className="mt-1 text-xs text-zinc-500">
              = {formatGold(lootGp)}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm text-zinc-400 mb-2">
            Horas farmadas
          </label>
          <input
            type="number"
            step="0.1"
            min="0.1"
            value={hours}
            onChange={(e) => setHours(e.target.value)}
            className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 rounded-md focus:outline-none focus:border-zinc-600 text-white placeholder-zinc-600"
            placeholder="2"
            required
          />
        </div>
      </div>

      {/* Preview */}
      {loot && hours && (
        <div className="bg-zinc-900 rounded-md p-4 border border-zinc-800">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <p className="text-xs text-zinc-500 mb-1">Farm Bruto</p>
              <p className="text-sm font-medium text-white">
                {formatGold(lootGp)}
              </p>
            </div>
            {imbuementCostPerHour > 0 && (
              <div>
                <p className="text-xs text-zinc-500 mb-1">Custo Imbuement</p>
                <p className="text-sm font-medium text-red-400">
                  -{formatGold(totalImbuementCost)}
                </p>
              </div>
            )}
            <div>
              <p className="text-xs text-zinc-500 mb-1">Farm Líquido</p>
              <p className="text-sm font-medium text-yellow-400">
                {formatGold(netLoot)}
              </p>
            </div>
            <div>
              <p className="text-xs text-zinc-500 mb-1">Em TC</p>
              <p className="text-sm font-medium text-white">
                {tcQuantity.toFixed(2)} TC
              </p>
            </div>
            <div>
              <p className="text-xs text-zinc-500 mb-1">Total R$</p>
              <p className="text-sm font-medium text-white">
                R$ {reaisValue.toFixed(2)}
              </p>
            </div>
            <div>
              <p className="text-xs text-zinc-500 mb-1">R$/hora</p>
              <p className="text-sm font-medium text-emerald-500">
                R$ {reaisPerHour.toFixed(2)}/h
              </p>
            </div>
          </div>
        </div>
      )}

      <button
        type="submit"
        className="w-full bg-zinc-800 hover:bg-zinc-700 text-white py-2 px-4 rounded-md font-medium transition-colors flex items-center justify-center gap-2"
      >
        <Plus className="w-4 h-4" />
        Registrar Farm
      </button>
    </form>
  );
};

export default FarmForm;