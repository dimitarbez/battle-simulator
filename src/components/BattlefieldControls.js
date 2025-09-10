import React from 'react';

const BattlefieldControls = ({ 
  currentArmy, 
  setCurrentArmy, 
  startSimulation, 
  resetSimulation,
  battleStarted,
  armyStats
}) => {
  const army1Count = armyStats.army1Stats.aliveCount;
  const army2Count = armyStats.army2Stats.aliveCount;
  const totalSoldiers = army1Count + army2Count;

  return (
    <div className="space-y-6">
      {/* Quick Stats */}
      <div className="bg-gray-900/50 rounded-lg p-4 border border-gray-600">
        <h3 className="text-lg font-semibold text-white mb-3 flex items-center">
          📊 Battle Overview
        </h3>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-400">{army1Count}</div>
            <div className="text-gray-300">Army 1</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-red-400">{army2Count}</div>
            <div className="text-gray-300">Army 2</div>
          </div>
        </div>
        <div className="mt-3 pt-3 border-t border-gray-600 text-center">
          <div className="text-sm text-gray-300">
            Total: <span className="font-semibold text-white">{totalSoldiers}</span> soldiers
          </div>
        </div>
      </div>

      {/* Army Selection */}
      {!battleStarted && (
        <div className="bg-gray-900/50 rounded-lg p-4 border border-gray-600">
          <h3 className="text-lg font-semibold text-white mb-3 flex items-center">
            🏗️ Place Soldiers
          </h3>
          <p className="text-sm text-gray-300 mb-4">
            Select an army and click/drag on the battlefield to place soldiers
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <button
              onClick={() => setCurrentArmy('army1')}
              className={`relative px-4 py-3 rounded-lg font-semibold transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 ${
                currentArmy === 'army1' 
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/25 border-2 border-blue-400' 
                  : 'bg-gray-700 text-gray-200 hover:bg-blue-600/80 border-2 border-transparent'
              }`}
              aria-label="Select Army 1 to place soldiers"
            >
              <span className="flex items-center justify-center">
                🔵 Army 1
                {currentArmy === 'army1' && (
                  <span className="ml-2 w-2 h-2 bg-white rounded-full animate-pulse"></span>
                )}
              </span>
            </button>
            <button
              onClick={() => setCurrentArmy('army2')}
              className={`relative px-4 py-3 rounded-lg font-semibold transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50 ${
                currentArmy === 'army2' 
                  ? 'bg-red-600 text-white shadow-lg shadow-red-500/25 border-2 border-red-400' 
                  : 'bg-gray-700 text-gray-200 hover:bg-red-600/80 border-2 border-transparent'
              }`}
              aria-label="Select Army 2 to place soldiers"
            >
              <span className="flex items-center justify-center">
                🔴 Army 2
                {currentArmy === 'army2' && (
                  <span className="ml-2 w-2 h-2 bg-white rounded-full animate-pulse"></span>
                )}
              </span>
            </button>
          </div>
        </div>
      )}

      {/* Simulation Controls */}
      <div className="bg-gray-900/50 rounded-lg p-4 border border-gray-600">
        <h3 className="text-lg font-semibold text-white mb-3 flex items-center">
          ⚔️ Simulation Controls
        </h3>
        <div className="space-y-3">
          <button
            onClick={startSimulation}
            disabled={totalSoldiers === 0 || battleStarted}
            className={`w-full px-6 py-4 rounded-lg font-bold transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 ${
              totalSoldiers === 0 || battleStarted
                ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                : 'bg-gradient-to-r from-green-600 to-green-700 text-white hover:from-green-500 hover:to-green-600 shadow-lg shadow-green-500/25'
            }`}
            aria-label={battleStarted ? 'Simulation in progress' : 'Start the battle simulation'}
          >
            {battleStarted ? (
              <span className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Battle in Progress...
              </span>
            ) : totalSoldiers === 0 ? (
              '🚫 Place soldiers first'
            ) : (
              `🚀 Start Battle (${totalSoldiers} soldiers)`
            )}
          </button>
          <button
            onClick={resetSimulation}
            className="w-full bg-gradient-to-r from-red-600 to-red-700 text-white px-6 py-3 rounded-lg hover:from-red-500 hover:to-red-600 transition-all duration-200 transform hover:scale-105 font-semibold shadow-lg shadow-red-500/25 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50"
            aria-label="Reset the battlefield and start over"
          >
            🔄 Reset Battlefield
          </button>
        </div>
      </div>

      {/* Instructions */}
      {!battleStarted && totalSoldiers === 0 && (
        <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-4">
          <h4 className="text-blue-300 font-semibold mb-2 flex items-center">
            💡 Quick Start
          </h4>
          <ol className="text-sm text-blue-200 space-y-1 list-decimal list-inside">
            <li>Select an army above</li>
            <li>Click/drag on battlefield to place soldiers</li>
            <li>Switch armies and repeat</li>
            <li>Adjust stats below if needed</li>
            <li>Start the battle!</li>
          </ol>
        </div>
      )}
    </div>
  );
};

export default BattlefieldControls;
