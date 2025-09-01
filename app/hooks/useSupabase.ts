import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { FarmEntry, ConfigSettings } from '@/app/types/farm';

export function useConfig() {
  const [config, setConfig] = useState<ConfigSettings>({
    tcValue: 38000,
    tcPriceReais: 57,
    tcAmount: 250
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchConfig();
  }, []);

  const fetchConfig = async () => {
    try {
      const { data, error } = await supabase
        .from('config_settings')
        .select('*')
        .single();

      if (error && error.code !== 'PGRST116') throw error;

      if (data) {
        setConfig({
          tcValue: data.tc_value,
          tcPriceReais: data.tc_price_reais,
          tcAmount: data.tc_amount
        });
      }
    } catch (error) {
      console.error('Error fetching config:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateConfig = async (newConfig: ConfigSettings) => {
    try {
      const { data: existing } = await supabase
        .from('config_settings')
        .select('id')
        .single();

      if (existing) {
        const { error } = await supabase
          .from('config_settings')
          .update({
            tc_value: newConfig.tcValue,
            tc_price_reais: newConfig.tcPriceReais,
            tc_amount: newConfig.tcAmount,
            updated_at: new Date().toISOString()
          })
          .eq('id', existing.id);

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('config_settings')
          .insert({
            tc_value: newConfig.tcValue,
            tc_price_reais: newConfig.tcPriceReais,
            tc_amount: newConfig.tcAmount
          });

        if (error) throw error;
      }

      setConfig(newConfig);
    } catch (error) {
      console.error('Error updating config:', error);
    }
  };

  return { config, updateConfig, loading };
}

export function useFarmEntries(config?: ConfigSettings) {
  const [entries, setEntries] = useState<FarmEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEntries();
  }, []);

  const fetchEntries = async () => {
    try {
      const { data, error } = await supabase
        .from('farm_entries')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      if (data) {
        const formattedEntries: FarmEntry[] = data.map(entry => ({
          id: entry.id,
          playerId: entry.player_id,
          playerName: entry.player_name,
          loot: entry.loot_gp,
          waste: entry.waste_gp,
          balance: entry.balance_gp,
          tcValue: entry.tc_value,
          tcQuantity: parseFloat(entry.tc_quantity.toString()),
          reaisValue: parseFloat(entry.reais_value.toString()),
          hours: entry.hours ? parseFloat(entry.hours.toString()) : undefined,
          reaisPerHour: entry.rate_per_hour ? parseFloat(entry.rate_per_hour.toString()) : undefined,
          date: entry.created_at
        }));
        setEntries(formattedEntries);
      }
    } catch (error) {
      console.error('Error fetching entries:', error);
    } finally {
      setLoading(false);
    }
  };

  const addEntry = async (entry: Omit<FarmEntry, 'id' | 'date'>) => {
    try {
      const { data, error } = await supabase
        .from('farm_entries')
        .insert({
          player_id: entry.playerId,
          player_name: entry.playerName,
          loot_gp: entry.loot,
          waste_gp: entry.waste,
          balance_gp: entry.balance,
          tc_value: entry.tcValue,
          tc_quantity: entry.tcQuantity,
          reais_value: entry.reaisValue,
          hours: entry.hours || 0,
          rate_per_hour: entry.reaisPerHour || 0
        })
        .select()
        .single();

      if (error) throw error;

      if (data) {
        const newEntry: FarmEntry = {
          id: data.id,
          playerId: data.player_id,
          playerName: data.player_name,
          loot: data.loot_gp,
          waste: data.waste_gp,
          balance: data.balance_gp,
          tcValue: data.tc_value,
          tcQuantity: parseFloat(data.tc_quantity.toString()),
          reaisValue: parseFloat(data.reais_value.toString()),
          hours: data.hours ? parseFloat(data.hours.toString()) : undefined,
          reaisPerHour: data.rate_per_hour ? parseFloat(data.rate_per_hour.toString()) : undefined,
          date: data.created_at
        };
        setEntries(prev => [newEntry, ...prev]);
      }
    } catch (error) {
      console.error('Error adding entry:', error);
    }
  };

  const updateEntry = async (updatedEntry: FarmEntry) => {
    try {
      const { error } = await supabase
        .from('farm_entries')
        .update({
          loot_gp: updatedEntry.loot || updatedEntry.balance || 0,
          waste_gp: updatedEntry.waste || 0,
          balance_gp: updatedEntry.balance || updatedEntry.loot || 0,
          tc_quantity: updatedEntry.tcQuantity,
          reais_value: updatedEntry.reaisValue,
          hours: updatedEntry.hours || 0,
          rate_per_hour: updatedEntry.reaisPerHour || 0
        })
        .eq('id', updatedEntry.id);

      if (error) throw error;

      setEntries(prev => prev.map(entry => 
        entry.id === updatedEntry.id ? updatedEntry : entry
      ));
    } catch (error) {
      console.error('Error updating entry:', error);
    }
  };

  const deleteEntry = async (id: string) => {
    try {
      const { error } = await supabase
        .from('farm_entries')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setEntries(prev => prev.filter(entry => entry.id !== id));
    } catch (error) {
      console.error('Error deleting entry:', error);
    }
  };

  const updateAllTcValues = async (newTcValue: number) => {
    try {
      // Buscar configurações atuais se não tiver config
      let tcAmount = 250;
      let tcPriceReais = 57;
      
      if (config) {
        tcAmount = config.tcAmount;
        tcPriceReais = config.tcPriceReais;
      } else {
        const { data: configData } = await supabase
          .from('config_settings')
          .select('*')
          .single();
        
        if (configData) {
          tcAmount = configData.tc_amount;
          tcPriceReais = configData.tc_price_reais;
        }
      }

      // Buscar todos os registros
      const { data: allEntries, error: fetchError } = await supabase
        .from('farm_entries')
        .select('*');

      if (fetchError) throw fetchError;

      // Atualizar cada registro com o novo valor de TC
      for (const entry of allEntries) {
        const tcQuantity = entry.loot_gp / newTcValue;
        const reaisValue = (tcQuantity / tcAmount) * tcPriceReais;
        const reaisPerHour = entry.hours > 0 ? reaisValue / entry.hours : 0;

        await supabase
          .from('farm_entries')
          .update({
            tc_value: newTcValue,
            tc_quantity: tcQuantity,
            reais_value: reaisValue,
            rate_per_hour: reaisPerHour
          })
          .eq('id', entry.id);
      }

      // Recarregar os dados
      await fetchEntries();
    } catch (error) {
      console.error('Error updating all TC values:', error);
    }
  };

  return { entries, addEntry, updateEntry, deleteEntry, updateAllTcValues, loading };
}