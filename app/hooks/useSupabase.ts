import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { FarmEntry, ConfigSettings, ImbuementConfig } from '@/app/types/farm';

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
          imbuementCostPerHour: entry.imbuement_cost_per_hour ? parseFloat(entry.imbuement_cost_per_hour.toString()) : undefined,
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
          rate_per_hour: entry.reaisPerHour || 0,
          imbuement_cost_per_hour: entry.imbuementCostPerHour || 0
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
          imbuementCostPerHour: data.imbuement_cost_per_hour ? parseFloat(data.imbuement_cost_per_hour.toString()) : undefined,
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

export function useImbuements(playerId: string) {
  const [imbuements, setImbuements] = useState<ImbuementConfig | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (playerId) {
      fetchImbuements();
    }
  }, [playerId]);

  const fetchImbuements = async () => {
    try {
      const { data, error } = await supabase
        .from('imbuements')
        .select('*')
        .eq('player_id', playerId)
        .single();

      if (error && error.code !== 'PGRST116') throw error;

      if (data) {
        setImbuements({
          id: data.id,
          playerId: data.player_id,
          goldTokenPrice: data.gold_token_price,
          
          // Life Leech
          lifeLeechEnabled: data.life_leech_enabled,
          lifeLeechGoldTokens: data.life_leech_gold_tokens,
          lifeLeechCost: data.life_leech_cost,
          vampireTeethPrice: data.vampire_teeth_price,
          bloodyPincersPrice: data.bloody_pincers_price,
          pieceOfDeadBrainPrice: data.piece_of_dead_brain_price,
          
          // Mana Leech
          manaLeechEnabled: data.mana_leech_enabled,
          manaLeechGoldTokens: data.mana_leech_gold_tokens,
          manaLeechSilenceClaws: data.mana_leech_silence_claws,
          manaLeechGrimeleech: data.mana_leech_grimeleech,
          manaLeechCost: data.mana_leech_cost,
          ropeBeltPrice: data.rope_belt_price,
          silencerClawsPrice: data.silencer_claws_price,
          grimeleechWingsPrice: data.grimeleech_wings_price,
          
          // Critical
          criticalEnabled: data.critical_enabled,
          criticalGoldTokens: data.critical_gold_tokens,
          criticalVexclawTalons: data.critical_vexclaw_talons,
          criticalCost: data.critical_cost,
          protectiveCharmPrice: data.protective_charm_price,
          sabretoothPrice: data.sabretooth_price,
          vexclawTalonPrice: data.vexclaw_talon_price,
          
          // Skill Sword
          skillSwordEnabled: data.skill_sword_enabled,
          skillSwordLionsMane: data.skill_sword_lions_mane,
          skillSwordMoohtahShell: data.skill_sword_moohtah_shell,
          skillSwordWarCrystal: data.skill_sword_war_crystal,
          skillSwordCost: data.skill_sword_cost,
          lionsManePrice: data.lions_mane_price,
          moohtahShellPrice: data.moohtah_shell_price,
          warCrystalPrice: data.war_crystal_price,
          
          // Fire Protection
          fireProtectionGreenDragonLeather: data.fire_protection_green_dragon_leather,
          fireProtectionBlazingBone: data.fire_protection_blazing_bone,
          fireProtectionDrakenSulphur: data.fire_protection_draken_sulphur,
          fireProtectionCost: data.fire_protection_cost,
          greenDragonLeatherPrice: data.green_dragon_leather_price,
          blazingBonePrice: data.blazing_bone_price,
          drakenSulphurPrice: data.draken_sulphur_price,
          
          // Death Protection
          deathProtectionFlaskEmbalming: data.death_protection_flask_embalming,
          deathProtectionGloomWolfFur: data.death_protection_gloom_wolf_fur,
          deathProtectionMysticalHourglass: data.death_protection_mystical_hourglass,
          deathProtectionCost: data.death_protection_cost,
          flaskEmbalmingPrice: data.flask_embalming_price,
          gloomWolfFurPrice: data.gloom_wolf_fur_price,
          mysticalHourglassPrice: data.mystical_hourglass_price,
          
          // Protection Type
          protectionType: data.protection_type,
          
          // Totals
          totalImbuementCost: data.total_imbuement_cost,
          costPerHour: data.cost_per_hour,
          farmEntryId: data.farm_entry_id
        });
      }
    } catch (error) {
      console.error('Error fetching imbuements:', error);
    } finally {
      setLoading(false);
    }
  };

  const saveImbuements = async (config: ImbuementConfig) => {
    try {
      const dbData = {
        player_id: config.playerId,
        gold_token_price: config.goldTokenPrice,
        
        // Life Leech
        life_leech_enabled: config.lifeLeechEnabled,
        life_leech_gold_tokens: config.lifeLeechGoldTokens,
        life_leech_cost: config.lifeLeechCost || 0,
        vampire_teeth_price: config.vampireTeethPrice || 1898,
        bloody_pincers_price: config.bloodyPincersPrice || 9988,
        piece_of_dead_brain_price: config.pieceOfDeadBrainPrice || 18999,
        
        // Mana Leech
        mana_leech_enabled: config.manaLeechEnabled,
        mana_leech_gold_tokens: config.manaLeechGoldTokens,
        mana_leech_silence_claws: config.manaLeechSilenceClaws,
        mana_leech_grimeleech: config.manaLeechGrimeleech,
        mana_leech_cost: config.manaLeechCost || 0,
        rope_belt_price: config.ropeBeltPrice || 4800,
        silencer_claws_price: config.silencerClawsPrice || 2995,
        grimeleech_wings_price: config.grimeleechWingsPrice || 1436,
        
        // Critical
        critical_enabled: config.criticalEnabled,
        critical_gold_tokens: config.criticalGoldTokens,
        critical_vexclaw_talons: config.criticalVexclawTalons,
        critical_cost: config.criticalCost || 0,
        protective_charm_price: config.protectiveCharmPrice || 780,
        sabretooth_price: config.sabretoothPrice || 390,
        vexclaw_talon_price: config.vexclawTalonPrice || 1274,
        
        // Skill Sword
        skill_sword_enabled: config.skillSwordEnabled,
        skill_sword_lions_mane: config.skillSwordLionsMane,
        skill_sword_moohtah_shell: config.skillSwordMoohtahShell,
        skill_sword_war_crystal: config.skillSwordWarCrystal,
        skill_sword_cost: config.skillSwordCost || 0,
        lions_mane_price: config.lionsManePrice || 150,
        moohtah_shell_price: config.moohtahShellPrice || 4300,
        war_crystal_price: config.warCrystalPrice || 970,
        
        // Fire Protection
        fire_protection_green_dragon_leather: config.fireProtectionGreenDragonLeather,
        fire_protection_blazing_bone: config.fireProtectionBlazingBone,
        fire_protection_draken_sulphur: config.fireProtectionDrakenSulphur,
        fire_protection_cost: config.fireProtectionCost || 0,
        green_dragon_leather_price: config.greenDragonLeatherPrice || 16000,
        blazing_bone_price: config.blazingBonePrice || 1554,
        draken_sulphur_price: config.drakenSulphurPrice || 1998,
        
        // Death Protection
        death_protection_flask_embalming: config.deathProtectionFlaskEmbalming,
        death_protection_gloom_wolf_fur: config.deathProtectionGloomWolfFur,
        death_protection_mystical_hourglass: config.deathProtectionMysticalHourglass,
        death_protection_cost: config.deathProtectionCost || 0,
        flask_embalming_price: config.flaskEmbalmingPrice || 8874,
        gloom_wolf_fur_price: config.gloomWolfFurPrice || 21587,
        mystical_hourglass_price: config.mysticalHourglassPrice || 700,
        
        // Protection Type
        protection_type: config.protectionType,
        
        // Totals
        total_imbuement_cost: config.totalImbuementCost || 0,
        cost_per_hour: config.costPerHour || 0,
        farm_entry_id: config.farmEntryId,
        updated_at: new Date().toISOString()
      };

      // Primeiro, tentar buscar um registro existente
      const { data: existingData, error: fetchError } = await supabase
        .from('imbuements')
        .select('*')
        .eq('player_id', config.playerId)
        .single();

      let savedData;
      
      if (existingData && !fetchError) {
        // Atualizar registro existente
        const { data, error } = await supabase
          .from('imbuements')
          .update(dbData)
          .eq('player_id', config.playerId)
          .select()
          .single();
        
        if (error) throw error;
        savedData = data;
      } else {
        // Criar novo registro
        const { data, error } = await supabase
          .from('imbuements')
          .insert(dbData)
          .select()
          .single();
        
        if (error) throw error;
        savedData = data;
      }
      
      if (savedData) {
        // Atualizar o estado com os dados salvos
        setImbuements({
          id: savedData.id,
          playerId: savedData.player_id,
          goldTokenPrice: savedData.gold_token_price,
          
          // Life Leech
          lifeLeechEnabled: savedData.life_leech_enabled,
          lifeLeechGoldTokens: savedData.life_leech_gold_tokens,
          lifeLeechCost: savedData.life_leech_cost,
          vampireTeethPrice: savedData.vampire_teeth_price,
          bloodyPincersPrice: savedData.bloody_pincers_price,
          pieceOfDeadBrainPrice: savedData.piece_of_dead_brain_price,
          
          // Mana Leech
          manaLeechEnabled: savedData.mana_leech_enabled,
          manaLeechGoldTokens: savedData.mana_leech_gold_tokens,
          manaLeechSilenceClaws: savedData.mana_leech_silence_claws,
          manaLeechGrimeleech: savedData.mana_leech_grimeleech,
          manaLeechCost: savedData.mana_leech_cost,
          ropeBeltPrice: savedData.rope_belt_price,
          silencerClawsPrice: savedData.silencer_claws_price,
          grimeleechWingsPrice: savedData.grimeleech_wings_price,
          
          // Critical
          criticalEnabled: savedData.critical_enabled,
          criticalGoldTokens: savedData.critical_gold_tokens,
          criticalVexclawTalons: savedData.critical_vexclaw_talons,
          criticalCost: savedData.critical_cost,
          protectiveCharmPrice: savedData.protective_charm_price,
          sabretoothPrice: savedData.sabretooth_price,
          vexclawTalonPrice: savedData.vexclaw_talon_price,
          
          // Skill Sword
          skillSwordEnabled: savedData.skill_sword_enabled,
          skillSwordLionsMane: savedData.skill_sword_lions_mane,
          skillSwordMoohtahShell: savedData.skill_sword_moohtah_shell,
          skillSwordWarCrystal: savedData.skill_sword_war_crystal,
          skillSwordCost: savedData.skill_sword_cost,
          lionsManePrice: savedData.lions_mane_price,
          moohtahShellPrice: savedData.moohtah_shell_price,
          warCrystalPrice: savedData.war_crystal_price,
          
          // Fire Protection
          fireProtectionGreenDragonLeather: savedData.fire_protection_green_dragon_leather,
          fireProtectionBlazingBone: savedData.fire_protection_blazing_bone,
          fireProtectionDrakenSulphur: savedData.fire_protection_draken_sulphur,
          fireProtectionCost: savedData.fire_protection_cost,
          greenDragonLeatherPrice: savedData.green_dragon_leather_price,
          blazingBonePrice: savedData.blazing_bone_price,
          drakenSulphurPrice: savedData.draken_sulphur_price,
          
          // Death Protection
          deathProtectionFlaskEmbalming: savedData.death_protection_flask_embalming,
          deathProtectionGloomWolfFur: savedData.death_protection_gloom_wolf_fur,
          deathProtectionMysticalHourglass: savedData.death_protection_mystical_hourglass,
          deathProtectionCost: savedData.death_protection_cost,
          flaskEmbalmingPrice: savedData.flask_embalming_price,
          gloomWolfFurPrice: savedData.gloom_wolf_fur_price,
          mysticalHourglassPrice: savedData.mystical_hourglass_price,
          
          // Protection Type
          protectionType: savedData.protection_type,
          
          // Totals
          totalImbuementCost: savedData.total_imbuement_cost,
          costPerHour: savedData.cost_per_hour,
          farmEntryId: savedData.farm_entry_id
        });
        
        console.log('Imbuements saved successfully:', savedData);
      }
    } catch (error) {
      console.error('Error saving imbuements:', error);
      throw error; // Re-throw para que o componente saiba que houve erro
    }
  };

  return { imbuements, saveImbuements, loading };
}