'use client';

import React, { useState, useEffect } from 'react';
import { Coins } from 'lucide-react';
import ConfigPanel from './components/ConfigPanel';
import FarmForm from './components/FarmForm';
import FarmHistory from './components/FarmHistory';
import FarmHistoryWithPagination from './components/FarmHistoryWithPagination';
import PlayerStats from './components/PlayerStats';
import EditFarmModal from './components/EditFarmModal';
import ImbuementCalculatorV4 from './components/ImbuementCalculatorV4';
import { useConfig, useFarmEntries, useImbuements } from './hooks/useSupabase';
import { FarmEntry } from './types/farm';

export default function Home() {
  const { config, updateConfig, loading: configLoading } = useConfig();
  const { entries: farmEntries, addEntry, updateEntry, deleteEntry, updateAllTcValues, loading: entriesLoading } = useFarmEntries();
  const [activeTab, setActiveTab] = useState<'imp' | 'juan' | 'general' | 'stats' | 'imbuements'>('imp');
  const [imbuementCostPerHour, setImbuementCostPerHour] = useState(0);
  const [editingEntry, setEditingEntry] = useState<FarmEntry | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  
  // Buscar imbuements salvos do banco para calcular custo
  const { imbuements: savedImbuements } = useImbuements('general');
  
  // Calcular custo de imbuements quando carregar dados salvos
  useEffect(() => {
    if (savedImbuements && savedImbuements.costPerHour) {
      console.log('Carregando custo de imbuements salvo:', savedImbuements.costPerHour);
      setImbuementCostPerHour(savedImbuements.costPerHour);
    }
  }, [savedImbuements]);

  const handleConfigUpdate = (newConfig: any) => {
    updateConfig(newConfig);
  };

  const handleFarmSubmit = (entry: any) => {
    addEntry(entry);
  };

  const handleDeleteEntry = (id: string) => {
    deleteEntry(id);
  };

  const handleEditEntry = (entry: FarmEntry) => {
    setEditingEntry(entry);
    setIsEditModalOpen(true);
  };

  const handleSaveEdit = (entry: FarmEntry) => {
    updateEntry(entry);
    setIsEditModalOpen(false);
    setEditingEntry(null);
  };

  const getPlayerEntries = (playerId: string) => {
    return farmEntries.filter(entry => entry.playerId === playerId);
  };

  if (configLoading || entriesLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-zinc-400 text-lg">Carregando...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black">
      {/* Header */}
      <header className="border-b border-zinc-900">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-center gap-2">
            <Coins className="w-6 h-6 text-zinc-500" />
            <h1 className="text-xl font-medium text-white">
              Tibia Farm Calculator
            </h1>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        {/* Configuration Panel */}
        <div className="mb-6">
          <ConfigPanel config={config} onConfigUpdate={handleConfigUpdate} />
        </div>

        {/* Navigation */}
        <div className="mb-6">
          <div className="flex justify-center gap-1 bg-zinc-950 rounded-lg p-1 border border-zinc-900">
            <button
              onClick={() => setActiveTab('imp')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                activeTab === 'imp'
                  ? 'bg-zinc-800 text-white'
                  : 'text-zinc-500 hover:text-zinc-300'
              }`}
            >
              Imp
            </button>
            <button
              onClick={() => setActiveTab('juan')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                activeTab === 'juan'
                  ? 'bg-zinc-800 text-white'
                  : 'text-zinc-500 hover:text-zinc-300'
              }`}
            >
              Juan
            </button>
            <button
              onClick={() => setActiveTab('general')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                activeTab === 'general'
                  ? 'bg-zinc-800 text-white'
                  : 'text-zinc-500 hover:text-zinc-300'
              }`}
            >
              Histórico Geral
            </button>
            <button
              onClick={() => setActiveTab('stats')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                activeTab === 'stats'
                  ? 'bg-zinc-800 text-white'
                  : 'text-zinc-500 hover:text-zinc-300'
              }`}
            >
              Estatísticas
            </button>
            <button
              onClick={() => setActiveTab('imbuements')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                activeTab === 'imbuements'
                  ? 'bg-zinc-800 text-white'
                  : 'text-zinc-500 hover:text-zinc-300'
              }`}
            >
              Imbuements
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-6xl mx-auto">
          {activeTab === 'imp' && (() => {
            const impEntries = getPlayerEntries('player1');
            const impTotals = impEntries.reduce((acc, entry) => ({
              hours: acc.hours + (entry.hours || 0),
              reais: acc.reais + (entry.reaisValue || 0),
              farms: acc.farms + 1
            }), { hours: 0, reais: 0, farms: 0 });

            return (
              <div className="space-y-6">
                {/* Mostrar custo de imbuements se houver */}
                {imbuementCostPerHour > 0 && (
                  <div className="bg-gradient-to-r from-yellow-950/30 to-orange-950/30 rounded-lg p-4 border border-yellow-800/50">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-yellow-400 text-sm font-medium">⚠️ Custo de Imbuements Ativo</span>
                      </div>
                      <div className="text-right">
                        <p className="text-white font-bold">{imbuementCostPerHour.toLocaleString('pt-BR')} gold/hora</p>
                        <p className="text-xs text-zinc-400">Será descontado do farm líquido</p>
                      </div>
                    </div>
                  </div>
                )}
                
                <div className="bg-zinc-950 rounded-lg p-6 border border-zinc-900">
                  <div className="mb-6">
                    <h2 className="text-lg font-medium text-white">Farm do Imp</h2>
                    <p className="text-sm text-zinc-500">Registre seu farm</p>
                  </div>
                  <FarmForm 
                    playerId="player1"
                    playerName="Imp"
                    config={config}
                    onSubmit={handleFarmSubmit}
                    imbuementCostPerHour={imbuementCostPerHour}
                  />
                </div>
                
                {/* Histórico do Imp */}
                <div className="bg-zinc-950 rounded-lg p-6 border border-zinc-900">
                  <div className="mb-4">
                    <h3 className="text-md font-medium text-white">Últimos farms</h3>
                  </div>
                  <FarmHistoryWithPagination 
                    entries={impEntries}
                    config={config}
                    onDeleteEntry={handleDeleteEntry}
                    onEditEntry={handleEditEntry}
                    playerFilter="player1"
                    itemsPerPage={10}
                  />
                </div>

                {/* Resumo Total do Imp */}
                {impEntries.length > 0 && (
                  <div className="relative overflow-hidden bg-gradient-to-br from-blue-950/30 via-zinc-900 to-zinc-950 rounded-xl p-6 border border-blue-800/30 shadow-2xl">
                    <div className="absolute inset-0 bg-gradient-to-tr from-blue-600/5 to-transparent"></div>
                    <div className="relative">
                      <h3 className="text-lg font-bold text-blue-400 mb-4 flex items-center gap-2">
                        <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
                        Resumo Total - Imp
                      </h3>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="bg-zinc-900/50 backdrop-blur rounded-lg p-4 border border-zinc-800/50 hover:border-blue-700/50 transition-all">
                          <p className="text-xs text-zinc-500 uppercase tracking-wider mb-2 font-semibold">Total de Farms</p>
                          <p className="text-3xl font-bold text-white">{impTotals.farms}</p>
                        </div>
                        <div className="bg-zinc-900/50 backdrop-blur rounded-lg p-4 border border-zinc-800/50 hover:border-yellow-700/50 transition-all">
                          <p className="text-xs text-zinc-500 uppercase tracking-wider mb-2 font-semibold">Total de Horas</p>
                          <p className="text-3xl font-bold text-yellow-400">{impTotals.hours.toFixed(1)}<span className="text-lg font-normal text-yellow-400/70">h</span></p>
                        </div>
                        <div className="bg-zinc-900/50 backdrop-blur rounded-lg p-4 border border-zinc-800/50 hover:border-green-700/50 transition-all">
                          <p className="text-xs text-zinc-500 uppercase tracking-wider mb-2 font-semibold">Total em R$</p>
                          <p className="text-3xl font-bold text-green-400">
                            <span className="text-lg font-normal">R$</span> {impTotals.reais.toFixed(2)}
                          </p>
                        </div>
                        <div className="bg-gradient-to-br from-emerald-900/30 to-emerald-950/30 backdrop-blur rounded-lg p-4 border border-emerald-700/50 hover:border-emerald-600/50 transition-all">
                          <p className="text-xs text-emerald-400 uppercase tracking-wider mb-2 font-semibold">Média R$/hora</p>
                          <p className="text-3xl font-bold text-emerald-400">
                            <span className="text-lg font-normal">R$</span> {impTotals.hours > 0 ? (impTotals.reais / impTotals.hours).toFixed(2) : '0.00'}<span className="text-lg font-normal text-emerald-400/70">/h</span>
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })()}

          {activeTab === 'juan' && (() => {
            const juanEntries = getPlayerEntries('player2');
            const juanTotals = juanEntries.reduce((acc, entry) => ({
              hours: acc.hours + (entry.hours || 0),
              reais: acc.reais + (entry.reaisValue || 0),
              farms: acc.farms + 1
            }), { hours: 0, reais: 0, farms: 0 });

            return (
              <div className="space-y-6">
                {/* Mostrar custo de imbuements se houver */}
                {imbuementCostPerHour > 0 && (
                  <div className="bg-gradient-to-r from-yellow-950/30 to-orange-950/30 rounded-lg p-4 border border-yellow-800/50">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-yellow-400 text-sm font-medium">⚠️ Custo de Imbuements Ativo</span>
                      </div>
                      <div className="text-right">
                        <p className="text-white font-bold">{imbuementCostPerHour.toLocaleString('pt-BR')} gold/hora</p>
                        <p className="text-xs text-zinc-400">Será descontado do farm líquido</p>
                      </div>
                    </div>
                  </div>
                )}
                
                <div className="bg-zinc-950 rounded-lg p-6 border border-zinc-900">
                  <div className="mb-6">
                    <h2 className="text-lg font-medium text-white">Farm do Juan</h2>
                    <p className="text-sm text-zinc-500">Registre seu farm</p>
                  </div>
                  <FarmForm 
                    playerId="player2"
                    playerName="Juan"
                    config={config}
                    onSubmit={handleFarmSubmit}
                    imbuementCostPerHour={imbuementCostPerHour}
                  />
                </div>
                
                {/* Histórico do Juan */}
                <div className="bg-zinc-950 rounded-lg p-6 border border-zinc-900">
                  <div className="mb-4">
                    <h3 className="text-md font-medium text-white">Últimos farms</h3>
                  </div>
                  <FarmHistoryWithPagination 
                    entries={juanEntries}
                    config={config}
                    onDeleteEntry={handleDeleteEntry}
                    onEditEntry={handleEditEntry}
                    playerFilter="player2"
                    itemsPerPage={10}
                  />
                </div>

                {/* Resumo Total do Juan */}
                {juanEntries.length > 0 && (
                  <div className="relative overflow-hidden bg-gradient-to-br from-purple-950/30 via-zinc-900 to-zinc-950 rounded-xl p-6 border border-purple-800/30 shadow-2xl">
                    <div className="absolute inset-0 bg-gradient-to-tr from-purple-600/5 to-transparent"></div>
                    <div className="relative">
                      <h3 className="text-lg font-bold text-purple-400 mb-4 flex items-center gap-2">
                        <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse"></div>
                        Resumo Total - Juan
                      </h3>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="bg-zinc-900/50 backdrop-blur rounded-lg p-4 border border-zinc-800/50 hover:border-purple-700/50 transition-all">
                          <p className="text-xs text-zinc-500 uppercase tracking-wider mb-2 font-semibold">Total de Farms</p>
                          <p className="text-3xl font-bold text-white">{juanTotals.farms}</p>
                        </div>
                        <div className="bg-zinc-900/50 backdrop-blur rounded-lg p-4 border border-zinc-800/50 hover:border-yellow-700/50 transition-all">
                          <p className="text-xs text-zinc-500 uppercase tracking-wider mb-2 font-semibold">Total de Horas</p>
                          <p className="text-3xl font-bold text-yellow-400">{juanTotals.hours.toFixed(1)}<span className="text-lg font-normal text-yellow-400/70">h</span></p>
                        </div>
                        <div className="bg-zinc-900/50 backdrop-blur rounded-lg p-4 border border-zinc-800/50 hover:border-green-700/50 transition-all">
                          <p className="text-xs text-zinc-500 uppercase tracking-wider mb-2 font-semibold">Total em R$</p>
                          <p className="text-3xl font-bold text-green-400">
                            <span className="text-lg font-normal">R$</span> {juanTotals.reais.toFixed(2)}
                          </p>
                        </div>
                        <div className="bg-gradient-to-br from-emerald-900/30 to-emerald-950/30 backdrop-blur rounded-lg p-4 border border-emerald-700/50 hover:border-emerald-600/50 transition-all">
                          <p className="text-xs text-emerald-400 uppercase tracking-wider mb-2 font-semibold">Média R$/hora</p>
                          <p className="text-3xl font-bold text-emerald-400">
                            <span className="text-lg font-normal">R$</span> {juanTotals.hours > 0 ? (juanTotals.reais / juanTotals.hours).toFixed(2) : '0.00'}<span className="text-lg font-normal text-emerald-400/70">/h</span>
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })()}

          {activeTab === 'general' && (
            <div className="bg-zinc-950 rounded-lg p-6 border border-zinc-900">
              <div className="mb-6">
                <h2 className="text-lg font-medium text-white">Histórico Geral</h2>
                <p className="text-sm text-zinc-500">Todos os farms registrados</p>
              </div>
              <FarmHistoryWithPagination 
                entries={farmEntries}
                config={config}
                onDeleteEntry={handleDeleteEntry}
                onEditEntry={handleEditEntry}
                itemsPerPage={15}
              />
            </div>
          )}

          {activeTab === 'stats' && (
            <div className="bg-zinc-950 rounded-lg p-6 border border-zinc-900">
              <div className="mb-6">
                <h2 className="text-lg font-medium text-white">Estatísticas</h2>
                <p className="text-sm text-zinc-500">Análise dos farms</p>
              </div>
              <PlayerStats 
                entries={farmEntries}
                config={config}
              />
            </div>
          )}

          {activeTab === 'imbuements' && (
            <div className="space-y-6">
              <ImbuementCalculatorV4 
                onCostUpdate={setImbuementCostPerHour}
                playerId="general"
              />
              
              {imbuementCostPerHour > 0 && (
                <div className="bg-gradient-to-br from-purple-950/30 via-zinc-900 to-zinc-950 rounded-xl p-6 border border-purple-800/30">
                  <h3 className="text-lg font-bold text-purple-400 mb-4">Impacto nos Farms</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-zinc-900/50 backdrop-blur rounded-lg p-4 border border-zinc-800/50">
                      <p className="text-xs text-zinc-500 uppercase tracking-wider mb-2">Custo de Imbuement por Hora</p>
                      <p className="text-2xl font-bold text-yellow-400">
                        {imbuementCostPerHour.toLocaleString('pt-BR')} <span className="text-sm font-normal text-yellow-400/70">gold/h</span>
                      </p>
                    </div>
                    <div className="bg-zinc-900/50 backdrop-blur rounded-lg p-4 border border-zinc-800/50">
                      <p className="text-xs text-zinc-500 uppercase tracking-wider mb-2">Considerando valor do TC</p>
                      <p className="text-2xl font-bold text-green-400">
                        R$ {((imbuementCostPerHour / config.tcValue) * (config.tcPriceReais / config.tcAmount)).toFixed(2)}
                        <span className="text-sm font-normal text-green-400/70">/h</span>
                      </p>
                    </div>
                  </div>
                  <div className="mt-4 p-3 bg-zinc-900/30 rounded-lg border border-zinc-800/50">
                    <p className="text-sm text-zinc-400">
                      💡 Este custo deve ser subtraído do lucro por hora para calcular o lucro real do farm.
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Edit Modal */}
      <EditFarmModal
        entry={editingEntry}
        config={config}
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setEditingEntry(null);
        }}
        onSave={handleSaveEdit}
        onUpdateAllTcValues={updateAllTcValues}
      />
    </div>
  );
}