import React, { useState, useCallback } from 'react';
import { useBattlefield, useArmyStats, useBattleSimulation } from './hooks';
import Battlefield from './components/Battlefield';
import BattlefieldControls from './components/BattlefieldControls';
import ArmyStatsPanel from './components/ArmyStatsPanel';
import { applyVariance, createSoldier, isWithinBounds } from './utils/battleUtils';
import './index.css';

function App() {
  const [soldiers, setSoldiers] = useState([]);
  const [battleStarted, setBattleStarted] = useState(false);

  // Custom hooks
  const armyStats = useArmyStats();
  const battlefield = useBattlefield();
  const simulation = useBattleSimulation(
    soldiers,
    setSoldiers,
    battleStarted,
    setBattleStarted,
    battlefield.battlefieldWidth,
    battlefield.battlefieldHeight,
    armyStats
  );

  // Function to handle adding soldiers at specific coordinates
  const handleBattlefieldClick = useCallback((x, y) => {
    if (battleStarted) return;

    // Ensure the soldier is within battlefield bounds
    if (!isWithinBounds(x, y, battlefield.battlefieldWidth, battlefield.battlefieldHeight)) {
      return;
    }

    // Get the stats for the currentArmy
    const currentArmyStats = battlefield.currentArmy === 'army1' ? armyStats.army1Stats : armyStats.army2Stats;

    const newSoldier = createSoldier(battlefield.currentArmy, x, y, currentArmyStats);

    setSoldiers((prevSoldiers) => [...prevSoldiers, newSoldier]);

    // Update alive count immediately for the respective army
    if (battlefield.currentArmy === 'army1') {
      armyStats.incrementArmy1Count();
    } else {
      armyStats.incrementArmy2Count();
    }
  }, [battleStarted, battlefield.battlefieldWidth, battlefield.battlefieldHeight, battlefield.currentArmy, armyStats]);

  const startSimulation = () => {
    if (soldiers.length === 0) {
      alert('Please place soldiers on the battlefield before starting the simulation.');
      return;
    }

    simulation.resetSimulation();

    // Reset alive counts and kills
    armyStats.updateArmy1Stats({
      aliveCount: soldiers.filter((s) => s.team === 'army1').length,
      kills: 0,
    });
    armyStats.updateArmy2Stats({
      aliveCount: soldiers.filter((s) => s.team === 'army2').length,
      kills: 0,
    });

    // Update soldiers' stats according to their army stats
    const updatedSoldiers = soldiers.map((soldier) => {
      const currentArmyStats = soldier.team === 'army1' ? armyStats.army1Stats : armyStats.army2Stats;
      return {
        ...soldier,
        health: currentArmyStats.health,
        maxHealth: currentArmyStats.health,
        damage: applyVariance(currentArmyStats.damage),
        speed: applyVariance(currentArmyStats.speed),
        morale: currentArmyStats.morale,
        maxMorale: currentArmyStats.morale,
        alive: true,
        state: 'idle',
        lastAttack: null,
      };
    });

    setSoldiers(updatedSoldiers);
    setBattleStarted(true);
  };

  const resetSimulation = () => {
    setBattleStarted(false);
    setSoldiers([]);
    simulation.resetSimulation();
    armyStats.resetArmyStats();
  };

  // Create battlefield handlers object
  const battlefieldHandlers = {
    handleMouseDown: (e) => battlefield.handleMouseDown(e, handleBattlefieldClick, battleStarted),
    handleMouseUp: battlefield.handleMouseUp,
    handleMouseMove: (e) => battlefield.handleMouseMove(e, handleBattlefieldClick),
    handleTouchStart: (e) => battlefield.handleTouchStart(e, handleBattlefieldClick, battleStarted),
    handleTouchMove: (e) => battlefield.handleTouchMove(e, handleBattlefieldClick),
    handleTouchEnd: battlefield.handleTouchEnd,
  };

  return (
    <div
      className="flex flex-col min-h-screen bg-gray-900 prevent-select"
      onClick={() => {
        if (battlefield.showHint) battlefield.setShowHint(false);
      }}
    >
      {/* Battlefield */}
      <Battlefield
        battlefieldRef={battlefield.battlefieldRef}
        soldiers={soldiers}
        winner={simulation.winner}
        showHint={battlefield.showHint && !battleStarted}
        army1Stats={armyStats.army1Stats}
        army2Stats={armyStats.army2Stats}
        battlefieldHandlers={battlefieldHandlers}
      />

      {/* Controls */}
      <div className="w-full p-4 bg-gray-800">
        <BattlefieldControls
          currentArmy={battlefield.currentArmy}
          setCurrentArmy={battlefield.setCurrentArmy}
          startSimulation={startSimulation}
          resetSimulation={resetSimulation}
        />

        <ArmyStatsPanel
          army1Stats={armyStats.army1Stats}
          army2Stats={armyStats.army2Stats}
          setArmy1Stats={armyStats.setArmy1Stats}
          setArmy2Stats={armyStats.setArmy2Stats}
        />
      </div>
    </div>
  );
}

export default App;
