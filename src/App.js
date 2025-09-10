import React, { useState, useCallback, useEffect } from 'react';
import { HelmetProvider, Helmet } from 'react-helmet-async';
import { useBattlefield, useArmyStats, useBattleSimulation } from './hooks';
// import useNotifications from './hooks/useNotifications';
import Battlefield from './components/Battlefield';
import BattlefieldControls from './components/BattlefieldControls';
import ArmyStatsPanel from './components/ArmyStatsPanel';
// import NotificationSystem from './components/NotificationSystem';
import HelpButton from './components/HelpButton';
import { applyVariance, createSoldier, isWithinBounds } from './utils/battleUtils';
import './index.css';

function App() {
  const [soldiers, setSoldiers] = useState([]);
  const [battleStarted, setBattleStarted] = useState(false);

  // Custom hooks
  const armyStats = useArmyStats();
  const battlefield = useBattlefield();
  // const { notifications, addNotification, removeNotification } = useNotifications();
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
      console.log(`🏆 ${winnerName} Wins! Victory achieved!`);
      // addNotification({
      //   type: 'success',
      //   title: `🏆 ${winnerName} Wins!`,
      //   message: 'Victory achieved! Click reset to start a new battle.',
      //   duration: 6000,
      // });
    }
  }, [simulation.winner]);

  const startSimulation = () => {
    if (soldiers.length === 0) {
      console.log('Warning: No soldiers placed');
      // addNotification({
      //   type: 'warning',
      //   title: 'No soldiers placed',
      //   message: 'Please place soldiers on the battlefield before starting the simulation.',
      // });
      return;
    }

    const army1Count = soldiers.filter((s) => s.team === 'army1').length;
    const army2Count = soldiers.filter((s) => s.team === 'army2').length;

    if (army1Count === 0 || army2Count === 0) {
      console.log('Warning: Both armies needed');
      // addNotification({
      //   type: 'warning',
      //   title: 'Both armies needed',
      //   message: 'Place soldiers for both armies to start the battle.',
      // });
      return;
    }

    console.log(`Battle Started! ${army1Count} vs ${army2Count} soldiers`);
    // addNotification({
    //   type: 'success',
    //   title: 'Battle Started!',
    //   message: `${army1Count} vs ${army2Count} soldiers engaging in combat.`,
    // });

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
    
    console.log('Battlefield Reset');
    // addNotification({
    //   type: 'info',
    //   title: 'Battlefield Reset',
    //   message: 'Ready to place new soldiers and start a new battle.',
    // });
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
    <HelmetProvider>
      <Helmet>
        <title>
          {battleStarted
            ? `Battle in Progress - Battle Simulator`
            : simulation.winner
            ? `${simulation.winner} Wins! - Battle Simulator`
            : 'Battle Simulator - Real-Time Strategy Army Combat Game'}
        </title>
        <meta 
          name="description" 
          content={
            simulation.winner
              ? `Victory achieved! ${simulation.winner} emerges triumphant in this epic battle simulation.`
              : battleStarted
              ? 'Epic battle in progress! Watch armies clash in real-time strategic combat.'
              : 'Command armies in epic real-time battles! Deploy troops, customize stats, and watch strategic combat unfold in this free browser-based strategy game.'
          }
        />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://battlesim.online" />
      </Helmet>
      <div
        className="flex flex-col h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 prevent-select overflow-hidden"
        onClick={() => {
          if (battlefield.showHint) battlefield.setShowHint(false);
        }}
      >
      {/* Header */}
      <header className="bg-gray-800/50 backdrop-blur-sm border-b border-gray-700 px-4 py-3 flex-shrink-0">
        <div className="w-full flex items-center justify-between relative">
          <div className="text-center flex-1">
            <h1 className="text-2xl md:text-3xl font-bold text-white">
              ⚔️ Battle Simulator
            </h1>
            <p className="text-gray-300 text-sm mt-1">
              Strategic warfare simulation
            </p>
          </div>
          
          {/* GitHub Link */}
          <div className="absolute right-0 top-1/2 transform -translate-y-1/2">
            <a
              href="https://github.com/dimitarbez/battle-simulator"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-2 text-gray-300 hover:text-white transition-all duration-200 px-3 py-2 rounded-lg hover:bg-gray-700/50 hover:scale-105"
              title="View source code on GitHub"
            >
              <svg
                className="w-7 h-7"
                fill="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  fillRule="evenodd"
                  d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                  clipRule="evenodd"
                />
              </svg>
              <span className="hidden sm:inline text-sm font-medium">View Source</span>
            </a>
          </div>
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

      {/* Notification System - Disabled */}
      {/*
      <NotificationSystem
        notifications={notifications}
        removeNotification={removeNotification}
      />
      */}

      {/* Help Button */}
      <HelpButton />
      </div>
    </HelmetProvider>
  );
}

export default App;
