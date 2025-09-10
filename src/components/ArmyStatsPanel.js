import React from 'react';

const ArmyStatsPanel = ({ army1Stats, army2Stats, setArmy1Stats, setArmy2Stats }) => {
  const renderArmyStats = (armyStats, setArmyStats, armyName, colorClass) => (
    <div>
      <h2 className={`text-2xl font-semibold mb-2 ${colorClass}`}>{armyName} Stats</h2>
      <div className="grid grid-cols-1 gap-4">
        {Object.keys(armyStats)
          .filter((stat) => !['aliveCount', 'kills'].includes(stat))
          .map((stat) => (
            <label key={stat} className="block">
              <span className="text-gray-300 capitalize text-sm">{stat}:</span>
              <input
                type="number"
                value={armyStats[stat]}
                onChange={(e) =>
                  setArmyStats({
                    ...armyStats,
                    [stat]: parseFloat(e.target.value),
                  })
                }
                className={`w-full mt-1 p-2 border rounded text-sm bg-gray-700 border-gray-600 text-white focus:outline-none focus:ring-2 focus:ring-${
                  armyName === 'Army 1' ? 'blue' : 'red'
                }-500`}
                min="0.1"
                step="0.1"
              />
            </label>
          ))}
      </div>
    </div>
  );

  return (
    <div className="army-stats grid grid-cols-1 md:grid-cols-2 gap-6">
      {renderArmyStats(army1Stats, setArmy1Stats, 'Army 1', 'text-blue-400')}
      {renderArmyStats(army2Stats, setArmy2Stats, 'Army 2', 'text-red-400')}
    </div>
  );
};

export default ArmyStatsPanel;
