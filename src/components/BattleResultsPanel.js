import React from 'react';

const BattleResultsPanel = ({ 
  winner, 
  army1Stats, 
  army2Stats, 
  initialArmy1Count, 
  initialArmy2Count, 
  battleDuration,
  onReset 
}) => {
  const winnerStats = winner === 'army1' ? army1Stats : army2Stats;
  const loserStats = winner === 'army1' ? army2Stats : army1Stats;
  const initialWinnerCount = winner === 'army1' ? initialArmy1Count : initialArmy2Count;
  const initialLoserCount = winner === 'army1' ? initialArmy2Count : initialArmy1Count;
  
  const totalCasualties = (initialArmy1Count - army1Stats.aliveCount) + (initialArmy2Count - army2Stats.aliveCount);
  
  // Format battle duration nicely
  const formatDuration = (seconds) => {
    if (!seconds || seconds === 0) {
      return '<1s';
    }
    if (seconds < 60) {
      return `${seconds}s`;
    } else {
      const minutes = Math.floor(seconds / 60);
      const remainingSeconds = seconds % 60;
      return `${minutes}m ${remainingSeconds}s`;
    }
  };

  return (
    <div className="absolute inset-0 flex items-center justify-center bg-black/60 z-30 backdrop-blur-sm px-2">
      <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 rounded-xl p-4 lg:p-8 w-full max-w-2xl mx-2 border border-gray-700 shadow-2xl animate-fadeIn max-h-[95vh] overflow-y-auto">
        {/* Header */}
        <div className="text-center mb-4 lg:mb-6">
          <div className="text-5xl lg:text-8xl mb-3 lg:mb-4 animate-bounce">
            {winner === 'army1' ? '🔵' : '🔴'}
          </div>
          <h1 className="text-2xl lg:text-5xl font-bold text-white mb-2 bg-gradient-to-r from-yellow-400 via-yellow-300 to-yellow-400 bg-clip-text text-transparent">
            {winner.toUpperCase()} VICTORY!
          </h1>
          <div className="text-base lg:text-lg text-gray-300 flex items-center justify-center space-x-2">
            <span>🏆</span>
            <span>Battle Complete</span>
            <span>🏆</span>
          </div>
        </div>

        {/* Battle Statistics */}
        <div className="space-y-4 lg:space-y-6">
          {/* Army Comparison */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 lg:gap-4">
            {/* Winner Stats */}
            <div className={`bg-gradient-to-br ${winner === 'army1' ? 'from-blue-900/50 to-blue-800/50 border-blue-600' : 'from-red-900/50 to-red-800/50 border-red-600'} rounded-lg p-3 lg:p-4 border`}>
              <div className="flex items-center justify-center mb-2 lg:mb-3">
                <div className={`text-xl lg:text-2xl mr-2 ${winner === 'army1' ? 'text-blue-400' : 'text-red-400'}`}>
                  {winner === 'army1' ? '🔵' : '🔴'}
                </div>
                <h3 className="text-base lg:text-lg font-semibold text-white">
                  {winner === 'army1' ? 'Army 1' : 'Army 2'} (Winner)
                </h3>
                <div className="text-xl lg:text-2xl ml-2">👑</div>
              </div>
              <div className="space-y-1 lg:space-y-2 text-xs lg:text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-300">Initial Force:</span>
                  <span className="text-white font-semibold">{initialWinnerCount}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-300">Survivors:</span>
                  <span className={`font-semibold ${winner === 'army1' ? 'text-blue-400' : 'text-red-400'}`}>
                    {winnerStats.aliveCount}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-300">Casualties:</span>
                  <span className="text-gray-200">{initialWinnerCount - winnerStats.aliveCount}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-300">Enemies Defeated:</span>
                  <span className="text-yellow-400 font-semibold">{winnerStats.kills}</span>
                </div>
              </div>
            </div>

            {/* Loser Stats */}
            <div className={`bg-gradient-to-br ${winner === 'army2' ? 'from-blue-900/30 to-blue-800/30 border-blue-600/50' : 'from-red-900/30 to-red-800/30 border-red-600/50'} rounded-lg p-3 lg:p-4 border opacity-75`}>
              <div className="flex items-center justify-center mb-2 lg:mb-3">
                <div className={`text-xl lg:text-2xl mr-2 ${winner === 'army2' ? 'text-blue-400' : 'text-red-400'}`}>
                  {winner === 'army2' ? '🔵' : '🔴'}
                </div>
                <h3 className="text-base lg:text-lg font-semibold text-gray-300">
                  {winner === 'army2' ? 'Army 1' : 'Army 2'} (Defeated)
                </h3>
                <div className="text-xl lg:text-2xl ml-2">💀</div>
              </div>
              <div className="space-y-1 lg:space-y-2 text-xs lg:text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-400">Initial Force:</span>
                  <span className="text-gray-300">{initialLoserCount}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Survivors:</span>
                  <span className="text-gray-300">{loserStats.aliveCount}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Casualties:</span>
                  <span className="text-gray-300">{initialLoserCount - loserStats.aliveCount}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Enemies Defeated:</span>
                  <span className="text-gray-300">{loserStats.kills}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Battle Summary */}
          <div className="bg-gradient-to-r from-gray-800/50 to-gray-700/50 rounded-lg p-3 lg:p-4 border border-gray-600 shadow-xl">
            <h3 className="text-base lg:text-lg font-semibold text-white mb-2 lg:mb-3 text-center flex items-center justify-center space-x-2">
              <span>📊</span>
              <span>Battle Summary</span>
              <span>📊</span>
            </h3>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 lg:gap-4 text-xs lg:text-sm">
              <div className="text-center">
                <div className="text-lg lg:text-2xl font-bold text-white">{totalCasualties}</div>
                <div className="text-gray-400">Total Casualties</div>
              </div>
              <div className="text-center">
                <div className="text-lg lg:text-2xl font-bold text-white">{initialArmy1Count + initialArmy2Count}</div>
                <div className="text-gray-400">Total Deployed</div>
              </div>
              <div className="text-center">
                <div className="text-lg lg:text-2xl font-bold text-white">{army1Stats.aliveCount + army2Stats.aliveCount}</div>
                <div className="text-gray-400">Total Survivors</div>
              </div>
              <div className="text-center">
                <div className="text-lg lg:text-2xl font-bold text-white">{formatDuration(battleDuration)}</div>
                <div className="text-gray-400">Battle Duration</div>
              </div>
            </div>
          </div>

          {/* Performance Metrics */}
          <div className="bg-gradient-to-r from-gray-800/50 to-gray-700/50 rounded-lg p-3 lg:p-4 border border-gray-600 shadow-xl">
            <h3 className="text-base lg:text-lg font-semibold text-white mb-2 lg:mb-3 text-center flex items-center justify-center space-x-2">
              <span>🎯</span>
              <span>Performance Analysis</span>
              <span>🎯</span>
            </h3>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 lg:gap-4 text-xs lg:text-sm">
              <div className="space-y-1 lg:space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-300">Winner Survival Rate:</span>
                  <span className={`font-semibold ${winner === 'army1' ? 'text-blue-400' : 'text-red-400'}`}>
                    {Math.round((winnerStats.aliveCount / initialWinnerCount) * 100)}%
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-300">Winner Kill Ratio:</span>
                  <span className="text-yellow-400 font-semibold">
                    {initialWinnerCount > 0 ? (winnerStats.kills / initialWinnerCount).toFixed(1) : '0.0'}
                  </span>
                </div>
              </div>
              <div className="space-y-1 lg:space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-300">Overall Survival Rate:</span>
                  <span className="text-white font-semibold">
                    {Math.round(((army1Stats.aliveCount + army2Stats.aliveCount) / (initialArmy1Count + initialArmy2Count)) * 100)}%
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-300">Battle Intensity:</span>
                  <span className="text-white font-semibold">
                    {totalCasualties > (initialArmy1Count + initialArmy2Count) * 0.8 ? 'Brutal 🔥' : 
                     totalCasualties > (initialArmy1Count + initialArmy2Count) * 0.5 ? 'Intense ⚔️' : 
                     'Tactical 🧠'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-center mt-4 lg:mt-6 pt-3 lg:pt-4 border-t border-gray-600">
          <button
            onClick={onReset}
            className="bg-gradient-to-r from-green-600 to-green-700 text-white px-6 lg:px-8 py-2.5 lg:py-3 rounded-lg hover:from-green-500 hover:to-green-600 transition-all duration-200 transform hover:scale-105 font-semibold shadow-lg shadow-green-500/25 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 flex items-center justify-center space-x-2 text-sm lg:text-base"
          >
            <span>🔄</span>
            <span>Start New Battle</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default BattleResultsPanel;
