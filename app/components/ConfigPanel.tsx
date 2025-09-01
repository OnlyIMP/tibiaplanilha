import React, { useState } from 'react';
import { Settings } from 'lucide-react';
import { ConfigSettings } from '../types/farm';

interface ConfigPanelProps {
  config: ConfigSettings;
  onConfigUpdate: (config: ConfigSettings) => void;
}

const ConfigPanel: React.FC<ConfigPanelProps> = ({ config, onConfigUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [tempConfig, setTempConfig] = useState(config);

  const handleEdit = () => {
    setTempConfig(config);
    setIsEditing(true);
  };

  const handleSave = () => {
    onConfigUpdate(tempConfig);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setTempConfig(config);
    setIsEditing(false);
  };

  return (
    <div className="bg-zinc-950 rounded-lg p-6 border border-zinc-900">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-medium text-white">Configurações</h2>
        {!isEditing ? (
          <button
            onClick={handleEdit}
            className="text-sm text-zinc-400 hover:text-white transition-colors"
          >
            Editar
          </button>
        ) : (
          <div className="flex gap-2">
            <button
              onClick={handleSave}
              className="px-3 py-1 bg-zinc-800 hover:bg-zinc-700 text-white rounded text-sm transition-colors"
            >
              Salvar
            </button>
            <button
              onClick={handleCancel}
              className="px-3 py-1 text-zinc-500 hover:text-zinc-300 text-sm transition-colors"
            >
              Cancelar
            </button>
          </div>
        )}
      </div>

      {isEditing ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm text-zinc-400 mb-2">
              Valor de 1 TC (gold)
            </label>
            <input
              type="number"
              value={tempConfig.tcValue}
              onChange={(e) => setTempConfig({
                ...tempConfig,
                tcValue: Number(e.target.value)
              })}
              className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 rounded-md text-white focus:outline-none focus:border-zinc-600"
            />
          </div>

          <div>
            <label className="block text-sm text-zinc-400 mb-2">
              Quantidade de TC no pacote
            </label>
            <input
              type="number"
              value={tempConfig.tcAmount}
              onChange={(e) => setTempConfig({
                ...tempConfig,
                tcAmount: Number(e.target.value)
              })}
              className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 rounded-md text-white focus:outline-none focus:border-zinc-600"
            />
          </div>

          <div>
            <label className="block text-sm text-zinc-400 mb-2">
              Preço do pacote (R$)
            </label>
            <input
              type="number"
              step="0.01"
              value={tempConfig.tcPriceReais}
              onChange={(e) => setTempConfig({
                ...tempConfig,
                tcPriceReais: Number(e.target.value)
              })}
              className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 rounded-md text-white focus:outline-none focus:border-zinc-600"
            />
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-zinc-900 rounded-lg p-4 border border-zinc-800">
            <p className="text-sm text-zinc-400 mb-1">Valor de 1 TC</p>
            <p className="text-xl font-semibold text-white">{config.tcValue.toLocaleString('pt-BR')} gold</p>
          </div>
          <div className="bg-zinc-900 rounded-lg p-4 border border-zinc-800">
            <p className="text-sm text-zinc-400 mb-1">Quantidade no pacote</p>
            <p className="text-xl font-semibold text-white">{config.tcAmount} TC</p>
          </div>
          <div className="bg-zinc-900 rounded-lg p-4 border border-zinc-800">
            <p className="text-sm text-zinc-400 mb-1">Preço do pacote</p>
            <p className="text-xl font-semibold text-white">R$ {config.tcPriceReais.toFixed(2)}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ConfigPanel;