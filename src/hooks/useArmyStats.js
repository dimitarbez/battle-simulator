import { useState } from 'react';

export const useArmyStats = () => {
  const [army1Stats, setArmy1Stats] = useState({
    health: 100,
    damage: 10,
    speed: 1.0,
    morale: 100,
    aliveCount: 0,
    kills: 0,
  });

  const [army2Stats, setArmy2Stats] = useState({
    health: 100,
    damage: 10,
    speed: 1.0,
    morale: 100,
    aliveCount: 0,
    kills: 0,
  });

  const updateArmy1Stats = (updates) => {
    setArmy1Stats(prev => ({ ...prev, ...updates }));
  };

  const updateArmy2Stats = (updates) => {
    setArmy2Stats(prev => ({ ...prev, ...updates }));
  };

  const incrementArmy1Count = () => {
    setArmy1Stats(prev => ({ ...prev, aliveCount: prev.aliveCount + 1 }));
  };

  const incrementArmy2Count = () => {
    setArmy2Stats(prev => ({ ...prev, aliveCount: prev.aliveCount + 1 }));
  };

  const decrementArmy1Count = () => {
    setArmy1Stats(prev => ({ ...prev, aliveCount: prev.aliveCount - 1 }));
  };

  const decrementArmy2Count = () => {
    setArmy2Stats(prev => ({ ...prev, aliveCount: prev.aliveCount - 1 }));
  };

  const incrementArmy1Kills = () => {
    setArmy1Stats(prev => ({ ...prev, kills: prev.kills + 1 }));
  };

  const incrementArmy2Kills = () => {
    setArmy2Stats(prev => ({ ...prev, kills: prev.kills + 1 }));
  };

  const resetArmyStats = () => {
    setArmy1Stats(prev => ({ ...prev, aliveCount: 0, kills: 0 }));
    setArmy2Stats(prev => ({ ...prev, aliveCount: 0, kills: 0 }));
  };

  return {
    army1Stats,
    army2Stats,
    setArmy1Stats,
    setArmy2Stats,
    updateArmy1Stats,
    updateArmy2Stats,
    incrementArmy1Count,
    incrementArmy2Count,
    decrementArmy1Count,
    decrementArmy2Count,
    incrementArmy1Kills,
    incrementArmy2Kills,
    resetArmyStats,
  };
};
