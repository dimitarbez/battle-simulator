import React, { useState, useCallback, useEffect } from 'react';
import { useBattlefield, useArmyStats, useBattleSimulation } from './hooks';
import useNotifications from './hooks/useNotifications';
import Battlefield from './components/Battlefield';
import BattlefieldControls from './components/BattlefieldControls';
import ArmyStatsPanel from './components/ArmyStatsPanel';
import NotificationSystem from './components/NotificationSystem';
import HelpButton from './components/HelpButton';
import { applyVariance, createSoldier, isWithinBounds } from './utils/battleUtils';
import './index.css';

function App() {
  const [soldiers, setSoldiers] = useState([]);
  const [battleStarted, setBattleStarted] = useState(false);

  // Custom hooks
  const armyStats = useArmyStats();
  const battlefield = useBattlefield();
  const { notifications, addNotification, removeNotification } = useNotifications();
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

  // Listen for battle results
  useEffect(() => {
    if (simulation.winner) {
      const winnerName = simulation.winner === 'army1' ? 'Army 1 (Blue)' : 'Army 2 (Red)';
      addNotification({
        type: 'success',
        title: `🏆 ${winnerName} Wins!`,
        message: 'Victory achieved! Click reset to start a new battle.',
        duration: 6000,
      });
    }
  }, [simulation.winner, addNotification]);

  const startSimulation = () => {
    if (soldiers.length === 0) {
      addNotification({
        type: 'warning',
        title: 'No soldiers placed',
        message: 'Please place soldiers on the battlefield before starting the simulation.',
      });
      return;
    }

    const army1Count = soldiers.filter((s) => s.team === 'army1').length;
    const army2Count = soldiers.filter((s) => s.team === 'army2').length;

    if (army1Count === 0 || army2Count === 0) {
      addNotification({
        type: 'warning',
        title: 'Both armies needed',
        message: 'Place soldiers for both armies to start the battle.',
      });
      return;
    }

    addNotification({
      type: 'success',
      title: 'Battle Started!',
      message: `${army1Count} vs ${army2Count} soldiers engaging in combat.`,
    });

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
    
    addNotification({
      type: 'info',
      title: 'Battlefield Reset',
      message: 'Ready to place new soldiers and start a new battle.',
    });
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
      className="flex flex-col h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 prevent-select overflow-hidden"
      onClick={() => {
        if (battlefield.showHint) battlefield.setShowHint(false);
      }}
    >
      {/* Header */}
      <header className="bg-gray-800/50 backdrop-blur-sm border-b border-gray-700 px-4 py-3 flex-shrink-0">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-2xl md:text-3xl font-bold text-white text-center">
            ⚔️ Battle Simulator
          </h1>
          <p className="text-gray-300 text-center text-sm mt-1">
            Strategic warfare simulation
          </p>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex flex-col lg:flex-row min-h-0 overflow-hidden">
        {/* Battlefield */}
        <main className="flex-1 order-1 lg:order-1 min-h-0 max-h-full overflow-hidden">
          <Battlefield
            battlefieldRef={battlefield.battlefieldRef}
            soldiers={soldiers}
            winner={simulation.winner}
            showHint={battlefield.showHint && !battleStarted}
            army1Stats={armyStats.army1Stats}
            army2Stats={armyStats.army2Stats}
            battlefieldHandlers={battlefieldHandlers}
            battleStarted={battleStarted}
          />
        </main>

        {/* Controls Sidebar */}
        <aside className="w-full lg:w-80 xl:w-96 order-2 lg:order-2 bg-gray-800/90 backdrop-blur-sm border-l border-gray-700 lg:min-h-0">
          <div className="p-4 h-full max-h-[50vh] lg:max-h-none overflow-y-auto sidebar-scroll">
            <BattlefieldControls
              currentArmy={battlefield.currentArmy}
              setCurrentArmy={battlefield.setCurrentArmy}
              startSimulation={startSimulation}
              resetSimulation={resetSimulation}
              battleStarted={battleStarted}
              armyStats={armyStats}
            />

            <ArmyStatsPanel
              army1Stats={armyStats.army1Stats}
              army2Stats={armyStats.army2Stats}
              setArmy1Stats={armyStats.setArmy1Stats}
              setArmy2Stats={armyStats.setArmy2Stats}
              battleStarted={battleStarted}
            />
          </div>
        </aside>
      </div>

      {/* Notification System */}
      <NotificationSystem
        notifications={notifications}
        removeNotification={removeNotification}
      />

      {/* Help Button */}
      <HelpButton />
    </div>
  );
}

export default App;
