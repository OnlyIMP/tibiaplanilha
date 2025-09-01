import React from 'react';
import { FarmEntry, ConfigSettings } from '../types/farm';
import { formatGold } from '../utils/formatters';
import { TrendingUp, TrendingDown, DollarSign, Coins, Clock } from 'lucide-react';

interface PlayerStatsProps {
  entries: FarmEntry[];
  config: ConfigSettings;
}

export default function PlayerStats({ entries, config }: PlayerStatsProps) {
  const calculatePlayerStats = (playerId: string) => {
    const playerEntries = entries.filter(e => e.playerId === playerId);
    
    if (playerEntries.length === 0) {
      return {
        totalFarms: 0,
        totalLoot: 0,
        totalBalance: 0,
        totalReais: 0,
        totalHours: 0,
        avgBalance: 0,
        avgReais: 0,
        avgReaisPerHour: 0,
        bestFarm: 0,
        worstFarm: 0
      };
    }

    const totalLoot = playerEntries.reduce((sum, e) => sum + (e.loot || e.balance || 0), 0);
    const totalBalance = playerEntries.reduce((sum, e) => sum + (e.balance || e.loot || 0), 0);
    const totalReais = playerEntries.reduce((sum, e) => sum + (e.reaisValue || 0), 0);
    const totalHours = playerEntries.reduce((sum, e) => sum + (e.hours || 0), 0);

    const balances = playerEntries.map(e => e.balance || e.loot || 0);

    return {
      totalFarms: playerEntries.length,
      totalLoot,
      totalBalance,
      totalReais,
      totalHours,
      avgBalance: totalBalance / playerEntries.length,
      avgReais: totalReais / playerEntries.length,
      avgReaisPerHour: totalHours > 0 ? totalReais / totalHours : 0,
      bestFarm: Math.max(...balances),
      worstFarm: Math.min(...balances)
    };
  };

  const impStats = calculatePlayerStats('player1');
  const juanStats = calculatePlayerStats('player2');

  const totalStats = {
    totalFarms: impStats.totalFarms + juanStats.totalFarms,
    totalLoot: impStats.totalLoot + juanStats.totalLoot,
    totalBalance: impStats.totalBalance + juanStats.totalBalance,
    totalReais: impStats.totalReais + juanStats.totalReais,
    totalHours: impStats.totalHours + juanStats.totalHours
  };

  const StatCard = ({ title, value, icon: Icon, color }: any) => (
    <div className="bg-zinc-900 rounded-lg p-4 border border-zinc-800">
      <div className="flex items-center justify-between mb-2">
        <span className="text-zinc-500 text-sm">{title}</span>
        <Icon className={`w-4 h-4 ${color}`} />
      </div>
      <p className="text-xl font-semibold text-white">{value}</p>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Estatísticas Gerais */}
      <div>
        <h3 className="text-lg font-semibold text-white mb-4">Estatísticas Gerais</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
          <StatCard 
            title="Total de Farms" 
            value={totalStats.totalFarms}
            icon={Coins}
            color="text-zinc-400"
          />
          <StatCard 
            title="Loot Total" 
            value={formatGold(totalStats.totalLoot)}
            icon={TrendingUp}
            color="text-emerald-600"
          />
          <StatCard 
            title="Balance Total" 
            value={formatGold(totalStats.totalBalance)}
            icon={Coins}
            color="text-zinc-400"
          />
          <StatCard 
            title="Horas Farmadas" 
            value={`${totalStats.totalHours.toFixed(1)}h`}
            icon={Clock}
            color="text-blue-600"
          />
          <StatCard 
            title="Total em R$" 
            value={`R$ ${totalStats.totalReais.toFixed(2)}`}
            icon={DollarSign}
            color="text-emerald-600"
          />
        </div>
      </div>

      {/* Estatísticas do Imp */}
      <div>
        <h3 className="text-lg font-semibold text-zinc-400 mb-4">Estatísticas do Imp</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <div className="bg-zinc-900 rounded-lg p-4 border border-zinc-800">
            <p className="text-zinc-500 text-sm mb-1">Farms Realizados</p>
            <p className="text-lg font-semibold text-white">{impStats.totalFarms}</p>
          </div>
          <div className="bg-zinc-900 rounded-lg p-4 border border-zinc-800">
            <p className="text-zinc-500 text-sm mb-1">Horas Farmadas</p>
            <p className="text-lg font-semibold text-white">{impStats.totalHours.toFixed(1)}h</p>
          </div>
          <div className="bg-zinc-900 rounded-lg p-4 border border-zinc-800">
            <p className="text-zinc-500 text-sm mb-1">Média R$/h</p>
            <p className="text-lg font-semibold text-emerald-600">R$ {impStats.avgReaisPerHour.toFixed(2)}/h</p>
          </div>
          <div className="bg-zinc-900 rounded-lg p-4 border border-zinc-800">
            <p className="text-zinc-500 text-sm mb-1">Melhor Farm</p>
            <p className="text-lg font-semibold text-emerald-600">{formatGold(impStats.bestFarm)}</p>
          </div>
          <div className="bg-zinc-900 rounded-lg p-4 border border-zinc-800">
            <p className="text-zinc-500 text-sm mb-1">Pior Farm</p>
            <p className="text-lg font-semibold text-red-600">{formatGold(impStats.worstFarm)}</p>
          </div>
        </div>
      </div>

      {/* Estatísticas do Juan */}
      <div>
        <h3 className="text-lg font-semibold text-zinc-400 mb-4">Estatísticas do Juan</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <div className="bg-zinc-900 rounded-lg p-4 border border-zinc-800">
            <p className="text-zinc-500 text-sm mb-1">Farms Realizados</p>
            <p className="text-lg font-semibold text-white">{juanStats.totalFarms}</p>
          </div>
          <div className="bg-zinc-900 rounded-lg p-4 border border-zinc-800">
            <p className="text-zinc-500 text-sm mb-1">Horas Farmadas</p>
            <p className="text-lg font-semibold text-white">{juanStats.totalHours.toFixed(1)}h</p>
          </div>
          <div className="bg-zinc-900 rounded-lg p-4 border border-zinc-800">
            <p className="text-zinc-500 text-sm mb-1">Média R$/h</p>
            <p className="text-lg font-semibold text-emerald-600">R$ {juanStats.avgReaisPerHour.toFixed(2)}/h</p>
          </div>
          <div className="bg-zinc-900 rounded-lg p-4 border border-zinc-800">
            <p className="text-zinc-500 text-sm mb-1">Melhor Farm</p>
            <p className="text-lg font-semibold text-emerald-600">{formatGold(juanStats.bestFarm)}</p>
          </div>
          <div className="bg-zinc-900 rounded-lg p-4 border border-zinc-800">
            <p className="text-zinc-500 text-sm mb-1">Pior Farm</p>
            <p className="text-lg font-semibold text-red-600">{formatGold(juanStats.worstFarm)}</p>
          </div>
        </div>
      </div>
    </div>
  );
}