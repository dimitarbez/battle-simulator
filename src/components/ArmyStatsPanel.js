import React, { useState } from 'react';

const ArmyStatsPanel = ({ army1Stats, army2Stats, setArmy1Stats, setArmy2Stats, battleStarted }) => {
  const [activeTab, setActiveTab] = useState('army1');

  const renderArmyStats = (armyStats, setArmyStats, armyName, colorClass, isActive) => (
    <div className={`${isActive ? 'block' : 'hidden'} lg:block space-y-4`}>
      <div className={`bg-gray-900/50 rounded-lg p-4 border border-gray-600 ${!isActive && 'opacity-50 lg:opacity-100'}`}>
        <h3 className={`text-lg font-semibold mb-4 ${colorClass} flex items-center`}>
          {armyName === 'Army 1' ? '🔵' : '🔴'} {armyName}
          <span className="ml-auto text-sm font-normal text-gray-300">
            {armyStats.aliveCount} soldiers
          </span>
        </h3>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4">
          {Object.keys(armyStats)
            .filter((stat) => !['aliveCount', 'kills'].includes(stat))
            .map((stat) => {
              const statLabels = {
                health: { label: '❤️ Health', desc: 'Hit points per soldier' },
                damage: { label: '⚔️ Damage', desc: 'Attack power' },
                speed: { label: '🏃 Speed', desc: 'Movement speed' },
                morale: { label: '🛡️ Morale', desc: 'Combat effectiveness' },
                attackCooldown: { label: '⏱️ Attack Rate', desc: 'Time between attacks (ms)' },
                range: { label: '🎯 Range', desc: 'Attack distance' }
              };

              const statInfo = statLabels[stat] || { label: stat, desc: '' };

              return (
                <div key={stat} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-gray-300 text-sm font-medium flex items-center">
                      {statInfo.label}
                      <span className="ml-1 text-xs text-gray-400">
                        ({armyStats[stat]})
                      </span>
                    </label>
                  </div>
                  
                  {battleStarted ? (
                    <div className="bg-gray-700 px-3 py-2 rounded text-sm text-gray-300 text-center">
                      {armyStats[stat]}
                    </div>
                  ) : (
                    <div className="space-y-1">
                      <input
                        type="range"
                        min={stat === 'attackCooldown' ? 100 : 1}
                        max={stat === 'attackCooldown' ? 2000 : stat === 'range' ? 150 : 100}
                        step={stat === 'attackCooldown' ? 50 : stat === 'range' ? 5 : 1}
                        value={armyStats[stat]}
                        onChange={(e) =>
                          setArmyStats({
                            ...armyStats,
                            [stat]: parseFloat(e.target.value),
                          })
                        }
                        className={`w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-${
                          armyName === 'Army 1' ? 'blue' : 'red'
                        }-500 focus:ring-opacity-50`}
                        style={{
                          background: `linear-gradient(to right, ${armyName === 'Army 1' ? '#3b82f6' : '#ef4444'} 0%, ${armyName === 'Army 1' ? '#3b82f6' : '#ef4444'} ${
                            ((armyStats[stat] - (stat === 'attackCooldown' ? 100 : 1)) / 
                            ((stat === 'attackCooldown' ? 2000 : stat === 'range' ? 150 : 100) - (stat === 'attackCooldown' ? 100 : 1))) * 100
                          }%, #374151 ${
                            ((armyStats[stat] - (stat === 'attackCooldown' ? 100 : 1)) / 
                            ((stat === 'attackCooldown' ? 2000 : stat === 'range' ? 150 : 100) - (stat === 'attackCooldown' ? 100 : 1))) * 100
                          }%, #374151 100%)`
                        }}
                      />
                      <input
                        type="number"
                        value={armyStats[stat]}
                        onChange={(e) =>
                          setArmyStats({
                            ...armyStats,
                            [stat]: parseFloat(e.target.value) || 0,
                          })
                        }
                        className={`w-full mt-1 px-3 py-2 text-sm bg-gray-700 border border-gray-600 rounded text-white focus:outline-none focus:ring-2 focus:ring-${
                          armyName === 'Army 1' ? 'blue' : 'red'
                        }-500 focus:ring-opacity-50 focus:border-transparent`}
                        min={stat === 'attackCooldown' ? 100 : 0.1}
                        step={stat === 'attackCooldown' ? 10 : 0.1}
                        placeholder={`Enter ${statInfo.label.toLowerCase()}`}
                      />
                      {statInfo.desc && (
                        <p className="text-xs text-gray-400">{statInfo.desc}</p>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
        </div>

        {/* Battle Stats */}
        {(armyStats.aliveCount > 0 || armyStats.kills > 0) && (
          <div className="mt-4 pt-4 border-t border-gray-600">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="text-center">
                <div className={`text-lg font-bold ${colorClass}`}>{armyStats.aliveCount}</div>
                <div className="text-gray-400">Alive</div>
              </div>
              <div className="text-center">
                <div className={`text-lg font-bold ${colorClass}`}>{armyStats.kills}</div>
                <div className="text-gray-400">Kills</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Section Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-white flex items-center">
          ⚙️ Army Configuration
        </h2>
        {battleStarted && (
          <span className="text-xs bg-yellow-600 text-white px-2 py-1 rounded">
            Battle Active
          </span>
        )}
      </div>

      {/* Mobile Tabs */}
      <div className="lg:hidden">
        <div className="flex bg-gray-900/50 rounded-lg p-1 border border-gray-600">
          <button
            onClick={() => setActiveTab('army1')}
            className={`flex-1 py-2 px-4 rounded-md font-medium transition-all ${
              activeTab === 'army1'
                ? 'bg-blue-600 text-white shadow-lg'
                : 'text-gray-300 hover:text-white'
            }`}
          >
            🔵 Army 1
          </button>
          <button
            onClick={() => setActiveTab('army2')}
            className={`flex-1 py-2 px-4 rounded-md font-medium transition-all ${
              activeTab === 'army2'
                ? 'bg-red-600 text-white shadow-lg'
                : 'text-gray-300 hover:text-white'
            }`}
          >
            🔴 Army 2
          </button>
        </div>
      </div>

      {/* Army Stats */}
      <div className="lg:space-y-6">
        {/* Army 1 */}
        {renderArmyStats(army1Stats, setArmy1Stats, 'Army 1', 'text-blue-400', activeTab === 'army1')}
        
        {/* Army 2 */}
        {renderArmyStats(army2Stats, setArmy2Stats, 'Army 2', 'text-red-400', activeTab === 'army2')}
      </div>

      {/* Preset Configurations */}
      {!battleStarted && (
        <div className="bg-gray-900/50 rounded-lg p-4 border border-gray-600">
          <h4 className="text-white font-semibold mb-3 flex items-center">
            🎛️ Quick Presets
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <button
              onClick={() => {
                setArmy1Stats({ ...army1Stats, health: 50, damage: 20, speed: 30, morale: 50, attackCooldown: 800, range: 50 });
                setArmy2Stats({ ...army2Stats, health: 100, damage: 15, speed: 20, morale: 60, attackCooldown: 1000, range: 40 });
              }}
              className="bg-purple-600 hover:bg-purple-700 text-white px-3 py-2 rounded text-sm font-medium transition"
            >
              ⚡ Fast vs Tank
            </button>
            <button
              onClick={() => {
                setArmy1Stats({ ...army1Stats, health: 30, damage: 35, speed: 40, morale: 40, attackCooldown: 600, range: 80 });
                setArmy2Stats({ ...army2Stats, health: 30, damage: 35, speed: 40, morale: 40, attackCooldown: 600, range: 80 });
              }}
              className="bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded text-sm font-medium transition"
            >
              ⚖️ Balanced
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ArmyStatsPanel;
