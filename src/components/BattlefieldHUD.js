import React from 'react';

const BattlefieldHUD = ({ army1Stats, army2Stats, battleStarted }) => {
  const ArmyHUDCard = ({ armyStats, armyName, colorClass, bgClass, dotColor }) => (
    <div className={`flex items-center space-x-3 ${bgClass} backdrop-blur-md p-3 lg:p-4 rounded-lg border border-white/20 shadow-lg transition-all duration-300 hover:scale-105`}>
      <div className={`w-3 h-3 lg:w-4 lg:h-4 ${dotColor} rounded-full animate-pulse shadow-lg`}></div>
      <div className="flex-1 min-w-0">
        <p className={`${colorClass} font-bold text-sm lg:text-base flex items-center`}>
          {armyName === 'Army 1' ? '🔵' : '🔴'} {armyName}
        </p>
        <div className="flex items-center space-x-4 text-xs lg:text-sm">
          <div className="flex items-center space-x-1">
            <span>👥</span>
            <span className="text-white font-semibold">{armyStats.aliveCount}</span>
            <span className="text-gray-300 hidden sm:inline">alive</span>
          </div>
          <div className="flex items-center space-x-1">
            <span>💀</span>
            <span className="text-white font-semibold">{armyStats.kills}</span>
            <span className="text-gray-300 hidden sm:inline">kills</span>
          </div>
        </div>
      </div>
    </div>
  );

  // Calculate battle progress
  const totalSoldiers = army1Stats.aliveCount + army2Stats.aliveCount;
  const totalKills = army1Stats.kills + army2Stats.kills;
  const battleProgress = totalSoldiers > 0 ? (totalKills / (totalKills + totalSoldiers)) * 100 : 0;

  return (
    <div className="absolute top-0 left-0 w-full z-20">
      <div className="p-3 lg:p-4">
        <div className="flex flex-col space-y-3 lg:flex-row lg:justify-between lg:items-start lg:space-y-0">
          {/* Army Stats */}
          <div className="flex flex-col space-y-3 lg:flex-row lg:space-y-0 lg:space-x-4">
            <ArmyHUDCard
              armyStats={army1Stats}
              armyName="Army 1"
              colorClass="text-blue-300"
              bgClass="bg-blue-900/80"
              dotColor="bg-blue-400"
            />
            
            <ArmyHUDCard
              armyStats={army2Stats}
              armyName="Army 2"
              colorClass="text-red-300"
              bgClass="bg-red-900/80"
              dotColor="bg-red-400"
            />
          </div>

          {/* Battle Progress & Status */}
          {battleStarted && (
            <div className="bg-gray-900/80 backdrop-blur-md p-3 lg:p-4 rounded-lg border border-white/20 shadow-lg">
              <div className="flex items-center space-x-3">
                <div className="animate-spin rounded-full h-3 w-3 lg:h-4 lg:w-4 border-b-2 border-yellow-400"></div>
                <div className="text-white">
                  <div className="text-xs lg:text-sm font-medium">Battle Active</div>
                  <div className="text-xs text-gray-300">
                    {Math.round(battleProgress)}% casualties
                  </div>
                </div>
              </div>
              
              {/* Progress Bar */}
              <div className="mt-2 w-full bg-gray-700 rounded-full h-1.5 lg:h-2 overflow-hidden">
                <div
                  className="bg-gradient-to-r from-yellow-400 to-red-500 h-full rounded-full transition-all duration-500 ease-out"
                  style={{ width: `${Math.min(battleProgress, 100)}%` }}
                ></div>
              </div>
            </div>
          )}
        </div>

        {/* Quick Battle Summary for Mobile */}
        {(army1Stats.aliveCount > 0 || army2Stats.aliveCount > 0) && (
          <div className="mt-3 lg:hidden">
            <div className="bg-black/60 backdrop-blur-sm rounded-lg p-3 text-center">
              <div className="text-white text-sm">
                <span className="text-blue-400 font-semibold">{army1Stats.aliveCount}</span>
                <span className="mx-2 text-gray-400">vs</span>
                <span className="text-red-400 font-semibold">{army2Stats.aliveCount}</span>
                {totalKills > 0 && (
                  <>
                    <span className="mx-2 text-gray-400">•</span>
                    <span className="text-gray-300">{totalKills} casualties</span>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BattlefieldHUD;
