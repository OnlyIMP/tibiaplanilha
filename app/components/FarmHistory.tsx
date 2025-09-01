import React from 'react';
import { Trash2, Calendar, Clock, Edit } from 'lucide-react';
import { FarmEntry, ConfigSettings } from '../types/farm';
import { formatGold, formatDate } from '../utils/formatters';

interface FarmHistoryProps {
  entries: FarmEntry[];
  config: ConfigSettings;
  onDeleteEntry: (id: string) => void;
  onEditEntry?: (entry: FarmEntry) => void;
  playerFilter?: string;
}

const FarmHistory: React.FC<FarmHistoryProps> = ({ entries, config, onDeleteEntry, onEditEntry, playerFilter }) => {
  const formatPeriod = (dateString: string, hours?: number) => {
    const endDate = new Date(dateString);
    const startDate = new Date(endDate.getTime() - (hours || 0) * 60 * 60 * 1000);
    
    const startTime = startDate.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
    const endTime = endDate.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
    const date = endDate.toLocaleDateString('pt-BR');
    
    return `${date} (${startTime} - ${endTime})`;
  };

  if (entries.length === 0) {
    return (
      <div className="text-center py-8">
        <Calendar className="w-12 h-12 text-zinc-600 mx-auto mb-3" />
        <p className="text-zinc-400 text-sm">Nenhum farm registrado</p>
      </div>
    );
  }

  // Calculate totals
  const totals = entries.reduce((acc, entry) => ({
    loot: acc.loot + (entry.loot || entry.balance || 0),
    hours: acc.hours + (entry.hours || 0),
    reais: acc.reais + (entry.reaisValue || 0)
  }), { loot: 0, hours: 0, reais: 0 });

  const avgPerHour = totals.hours > 0 ? totals.reais / totals.hours : 0;

  return (
    <div className="space-y-4">
      {/* Summary */}
      {!playerFilter && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div className="bg-gradient-to-br from-zinc-900 to-zinc-800 rounded-lg p-4 border border-zinc-700">
            <p className="text-sm text-zinc-400 mb-2 font-medium">Total Farm</p>
            <p className="text-lg font-bold text-white">{formatGold(totals.loot)}</p>
          </div>
          <div className="bg-gradient-to-br from-zinc-900 to-zinc-800 rounded-lg p-4 border border-zinc-700">
            <p className="text-sm text-zinc-400 mb-2 font-medium">Total Horas</p>
            <p className="text-lg font-bold text-yellow-400">{totals.hours.toFixed(1)}h</p>
          </div>
          <div className="bg-gradient-to-br from-zinc-900 to-zinc-800 rounded-lg p-4 border border-zinc-700">
            <p className="text-sm text-zinc-400 mb-2 font-medium">Total R$</p>
            <p className="text-lg font-bold text-green-400">R$ {totals.reais.toFixed(2)}</p>
          </div>
          <div className="bg-gradient-to-br from-emerald-900/20 to-emerald-800/20 rounded-lg p-4 border border-emerald-700/50">
            <p className="text-sm text-emerald-400 mb-2 font-medium">Média R$/h</p>
            <p className="text-lg font-bold text-emerald-400">R$ {avgPerHour.toFixed(2)}/h</p>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="overflow-x-auto bg-zinc-950 rounded-lg border border-zinc-700 shadow-xl">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-zinc-700 bg-zinc-800/50">
              <th className="text-left p-3 text-zinc-300 font-semibold">Período</th>
              {!playerFilter && <th className="text-left p-3 text-zinc-300 font-semibold">Jogador</th>}
              <th className="text-right p-3 text-zinc-300 font-semibold">Farm</th>
              <th className="text-right p-3 text-zinc-300 font-semibold">Horas</th>
              <th className="text-right p-3 text-zinc-300 font-semibold">R$</th>
              <th className="text-right p-3 text-zinc-300 font-semibold">R$/h</th>
              <th className="text-center p-3 text-zinc-300 font-semibold">Ação</th>
            </tr>
          </thead>
          <tbody>
            {entries.map((entry) => {
              const lootValue = entry.loot || entry.balance || 0;
              const reaisPerHour = (entry.hours && entry.hours > 0) 
                ? (entry.reaisValue || 0) / entry.hours 
                : 0;

              return (
                <tr key={entry.id} className="border-b border-zinc-800/50 hover:bg-zinc-800/30 transition-colors">
                  <td className="p-3">
                    <div className="text-white font-medium text-sm">
                      {formatPeriod(entry.date, entry.hours)}
                    </div>
                  </td>
                  {!playerFilter && (
                    <td className="p-3">
                      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded text-sm font-medium ${
                        entry.playerId === 'player1' 
                          ? 'bg-blue-900/50 text-blue-400' 
                          : 'bg-purple-900/50 text-purple-400'
                      }`}>
                        {entry.playerName}
                      </span>
                    </td>
                  )}
                  <td className="p-3 text-right">
                    <span className="text-white font-semibold text-base">
                      {formatGold(lootValue)}
                    </span>
                  </td>
                  <td className="p-3 text-right">
                    <span className="text-yellow-400 font-medium text-base">
                      {entry.hours ? `${entry.hours}h` : '-'}
                    </span>
                  </td>
                  <td className="p-3 text-right">
                    <span className="text-green-400 font-medium text-base">
                      R$ {(entry.reaisValue || 0).toFixed(2)}
                    </span>
                  </td>
                  <td className="p-3 text-right">
                    <span className="text-emerald-400 font-bold text-base">
                      {reaisPerHour > 0 ? `R$ ${reaisPerHour.toFixed(2)}/h` : '-'}
                    </span>
                  </td>
                  <td className="p-3 text-center">
                    <div className="flex items-center justify-center gap-1">
                      {onEditEntry && (
                        <button
                          onClick={() => onEditEntry(entry)}
                          className="text-zinc-400 hover:text-zinc-300 p-1 rounded hover:bg-zinc-700 transition-all"
                          title="Editar"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                      )}
                      <button
                        onClick={() => onDeleteEntry(entry.id)}
                        className="text-red-500 hover:text-red-400 p-1 rounded hover:bg-red-500/10 transition-all"
                        title="Excluir"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default FarmHistory;