import React, { useState } from 'react';
import { Trash2, Calendar, ChevronLeft, ChevronRight, Edit } from 'lucide-react';
import { FarmEntry, ConfigSettings } from '../types/farm';
import { formatGold, formatDate } from '../utils/formatters';

interface FarmHistoryWithPaginationProps {
  entries: FarmEntry[];
  config: ConfigSettings;
  onDeleteEntry: (id: string) => void;
  onEditEntry?: (entry: FarmEntry) => void;
  playerFilter?: string;
  itemsPerPage?: number;
}

const FarmHistoryWithPagination: React.FC<FarmHistoryWithPaginationProps> = ({ 
  entries, 
  config, 
  onDeleteEntry, 
  onEditEntry, 
  playerFilter,
  itemsPerPage = 10 
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  
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

  // Paginação
  const totalPages = Math.ceil(entries.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentEntries = entries.slice(startIndex, endIndex);

  // Calculate totals
  const totals = entries.reduce((acc, entry) => ({
    loot: acc.loot + (entry.loot || entry.balance || 0),
    waste: acc.waste + (entry.waste || 0),
    profit: acc.profit + ((entry.loot || entry.balance || 0) - (entry.waste || 0)),
    hours: acc.hours + (entry.hours || 0),
    reais: acc.reais + (entry.reaisValue || 0)
  }), { loot: 0, waste: 0, profit: 0, hours: 0, reais: 0 });

  const avgPerHour = totals.hours > 0 ? totals.reais / totals.hours : 0;

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  // Gerar array de páginas para navegação
  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;
    
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
    
    if (endPage - startPage < maxVisiblePages - 1) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }
    
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    
    return pages;
  };

  return (
    <div className="space-y-4">
      {/* Summary */}
      {!playerFilter && (
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          <div className="bg-gradient-to-br from-zinc-900 to-zinc-800 rounded-lg p-4 border border-zinc-700">
            <p className="text-sm text-zinc-400 mb-2 font-medium">Total Loot</p>
            <p className="text-lg font-bold text-white">{formatGold(totals.loot)}</p>
          </div>
          <div className="bg-gradient-to-br from-red-900/20 to-red-800/20 rounded-lg p-4 border border-red-700/50">
            <p className="text-sm text-red-400 mb-2 font-medium">Total Waste</p>
            <p className="text-lg font-bold text-red-400">{formatGold(totals.waste)}</p>
          </div>
          <div className="bg-gradient-to-br from-emerald-900/20 to-emerald-800/20 rounded-lg p-4 border border-emerald-700/50">
            <p className="text-sm text-emerald-400 mb-2 font-medium">Profit Total</p>
            <p className="text-lg font-bold text-emerald-400">{formatGold(totals.profit)}</p>
          </div>
          <div className="bg-gradient-to-br from-zinc-900 to-zinc-800 rounded-lg p-4 border border-zinc-700">
            <p className="text-sm text-zinc-400 mb-2 font-medium">Total Horas</p>
            <p className="text-lg font-bold text-yellow-400">{totals.hours.toFixed(1)}h</p>
          </div>
          <div className="bg-gradient-to-br from-green-900/20 to-green-800/20 rounded-lg p-4 border border-green-700/50">
            <p className="text-sm text-green-400 mb-2 font-medium">Média R$/h</p>
            <p className="text-lg font-bold text-green-400">R$ {avgPerHour.toFixed(2)}/h</p>
          </div>
        </div>
      )}

      {/* Info de paginação */}
      <div className="flex items-center justify-between text-sm text-zinc-400">
        <span>
          Mostrando {startIndex + 1} - {Math.min(endIndex, entries.length)} de {entries.length} registros
        </span>
        <span>
          Página {currentPage} de {totalPages}
        </span>
      </div>

      {/* Table */}
      <div className="overflow-x-auto bg-zinc-950 rounded-lg border border-zinc-700 shadow-xl">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-zinc-700 bg-zinc-800/50">
              <th className="text-left p-3 text-zinc-300 font-semibold">Período</th>
              {!playerFilter && <th className="text-left p-3 text-zinc-300 font-semibold">Jogador</th>}
              <th className="text-right p-3 text-zinc-300 font-semibold">Loot</th>
              <th className="text-right p-3 text-red-400 font-semibold">Waste</th>
              <th className="text-right p-3 text-emerald-400 font-semibold">Profit</th>
              <th className="text-right p-3 text-zinc-300 font-semibold">Horas</th>
              <th className="text-right p-3 text-zinc-300 font-semibold">R$</th>
              <th className="text-right p-3 text-zinc-300 font-semibold">R$/h</th>
              <th className="text-center p-3 text-zinc-300 font-semibold">Ação</th>
            </tr>
          </thead>
          <tbody>
            {currentEntries.map((entry) => {
              const lootValue = entry.loot || entry.balance || 0;
              const wasteValue = entry.waste || 0;
              const profitValue = lootValue - wasteValue;
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
                    <span className="text-red-400 font-medium text-base">
                      {wasteValue > 0 ? `-${formatGold(wasteValue)}` : '-'}
                    </span>
                  </td>
                  <td className="p-3 text-right">
                    <span className={`font-bold text-base ${profitValue >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                      {formatGold(profitValue)}
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

      {/* Paginação */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-1">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className={`p-2 rounded-md transition-all ${
              currentPage === 1
                ? 'text-zinc-600 cursor-not-allowed'
                : 'text-zinc-400 hover:text-white hover:bg-zinc-800'
            }`}
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          {currentPage > 3 && (
            <>
              <button
                onClick={() => handlePageChange(1)}
                className="px-3 py-1 rounded-md text-zinc-400 hover:text-white hover:bg-zinc-800 transition-all"
              >
                1
              </button>
              {currentPage > 4 && <span className="text-zinc-600 px-2">...</span>}
            </>
          )}

          {getPageNumbers().map(page => (
            <button
              key={page}
              onClick={() => handlePageChange(page)}
              className={`px-3 py-1 rounded-md transition-all ${
                page === currentPage
                  ? 'bg-yellow-500 text-black font-semibold'
                  : 'text-zinc-400 hover:text-white hover:bg-zinc-800'
              }`}
            >
              {page}
            </button>
          ))}

          {currentPage < totalPages - 2 && (
            <>
              {currentPage < totalPages - 3 && <span className="text-zinc-600 px-2">...</span>}
              <button
                onClick={() => handlePageChange(totalPages)}
                className="px-3 py-1 rounded-md text-zinc-400 hover:text-white hover:bg-zinc-800 transition-all"
              >
                {totalPages}
              </button>
            </>
          )}

          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className={`p-2 rounded-md transition-all ${
              currentPage === totalPages
                ? 'text-zinc-600 cursor-not-allowed'
                : 'text-zinc-400 hover:text-white hover:bg-zinc-800'
            }`}
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
};

export default FarmHistoryWithPagination;