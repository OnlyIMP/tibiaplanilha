import React, { useState, useEffect } from 'react';
import { X, RefreshCw } from 'lucide-react';
import { FarmEntry, ConfigSettings } from '../types/farm';
import { parseGold, formatGold } from '../utils/formatters';

interface EditFarmModalProps {
  entry: FarmEntry | null;
  config: ConfigSettings;
  isOpen: boolean;
  onClose: () => void;
  onSave: (entry: FarmEntry) => void;
  onUpdateAllTcValues?: (tcValue: number) => void;
}

const EditFarmModal: React.FC<EditFarmModalProps> = ({ entry, config, isOpen, onClose, onSave, onUpdateAllTcValues }) => {
  const [loot, setLoot] = useState('');
  const [hours, setHours] = useState('');
  const [customTcValue, setCustomTcValue] = useState('');
  const [showUpdateAll, setShowUpdateAll] = useState(false);

  useEffect(() => {
    if (entry) {
      setLoot(formatGold(entry.loot || entry.balance || 0));
      setHours(entry.hours?.toString() || '2');
      setCustomTcValue(entry.tcValue?.toString() || config.tcValue.toString());
      setShowUpdateAll(false);
    }
  }, [entry, config]);

  if (!isOpen || !entry) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const lootGp = parseGold(loot);
    const hoursNum = parseFloat(hours) || 0;
    const tcValueNum = parseInt(customTcValue) || config.tcValue;
    const tcQuantity = lootGp / tcValueNum;
    const reaisValue = (tcQuantity / config.tcAmount) * config.tcPriceReais;
    const reaisPerHour = hoursNum > 0 ? reaisValue / hoursNum : 0;

    onSave({
      ...entry,
      loot: lootGp,
      balance: lootGp,
      tcValue: tcValueNum,
      tcQuantity,
      reaisValue,
      hours: hoursNum,
      reaisPerHour
    });

    onClose();
  };

  const handleUpdateAllTcValues = () => {
    const tcValueNum = parseInt(customTcValue) || config.tcValue;
    if (onUpdateAllTcValues) {
      onUpdateAllTcValues(tcValueNum);
      setShowUpdateAll(false);
      onClose();
    }
  };

  const lootGp = loot ? parseGold(loot) : 0;
  const hoursNum = hours ? parseFloat(hours) : 0;
  const tcValueNum = customTcValue ? parseInt(customTcValue) : config.tcValue;
  const tcQuantity = lootGp / tcValueNum;
  const reaisValue = (tcQuantity / config.tcAmount) * config.tcPriceReais;
  const reaisPerHour = hoursNum > 0 ? reaisValue / hoursNum : 0;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-zinc-950 rounded-lg p-6 max-w-md w-full mx-4 border border-zinc-800">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-white">Editar Farm</h2>
          <button
            onClick={onClose}
            className="text-zinc-500 hover:text-zinc-300 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
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

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-zinc-400 mb-2">
                Horas farmadas
              </label>
              <input
                type="number"
                step="0.5"
                value={hours}
                onChange={(e) => setHours(e.target.value)}
                className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 rounded-md focus:outline-none focus:border-zinc-600 text-white placeholder-zinc-600"
                placeholder="2"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm text-zinc-400 mb-2">
                Valor do TC (gold)
              </label>
              <input
                type="number"
                value={customTcValue}
                onChange={(e) => {
                  setCustomTcValue(e.target.value);
                  setShowUpdateAll(e.target.value !== entry?.tcValue?.toString());
                }}
                className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 rounded-md focus:outline-none focus:border-zinc-600 text-white placeholder-zinc-600"
                placeholder={config.tcValue.toString()}
                required
              />
            </div>
          </div>

          {/* Botão para atualizar todos */}
          {showUpdateAll && onUpdateAllTcValues && (
            <div className="bg-blue-950/30 border border-blue-800/50 rounded-md p-3">
              <p className="text-xs text-blue-400 mb-2">
                Valor do TC diferente do original ({entry?.tcValue} gold)
              </p>
              <button
                type="button"
                onClick={handleUpdateAllTcValues}
                className="w-full bg-blue-600 hover:bg-blue-500 text-white py-2 px-3 rounded-md text-sm font-medium transition-colors flex items-center justify-center gap-2"
              >
                <RefreshCw className="w-4 h-4" />
                Atualizar TC de todos os registros para {customTcValue} gold
              </button>
            </div>
          )}

          {/* Preview */}
          {loot && hours && (
            <div className="bg-zinc-900 rounded-md p-4 border border-zinc-800">
              <div className="grid grid-cols-3 gap-4">
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
                <div className="col-span-3 pt-2 border-t border-zinc-700">
                  <p className="text-xs text-zinc-500 mb-1">Valor do TC usado</p>
                  <p className="text-sm font-medium text-yellow-400">
                    1 TC = {tcValueNum.toLocaleString('pt-BR')} gold
                  </p>
                </div>
              </div>
            </div>
          )}

          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-zinc-800 hover:bg-zinc-700 text-white py-2 px-4 rounded-md font-medium transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white py-2 px-4 rounded-md font-medium transition-colors"
            >
              Salvar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditFarmModal;