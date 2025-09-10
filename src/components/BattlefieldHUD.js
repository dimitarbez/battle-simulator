import React from 'react';

const BattlefieldHUD = ({ army1Stats, army2Stats }) => {
  return (
    <div className="absolute top-0 left-0 w-full flex flex-col md:flex-row justify-between p-4 space-y-4 md:space-y-0 z-20">
      {/* Army 1 HUD */}
      <div className="flex items-center space-x-2 bg-blue-900 bg-opacity-70 p-2 rounded">
        <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
        <div>
          <p className="text-blue-300 font-semibold text-sm">Army 1</p>
          <p className="text-xs text-white">Alive Soldiers: {army1Stats.aliveCount}</p>
          <p className="text-xs text-white">Kills: {army1Stats.kills}</p>
        </div>
      </div>
      {/* Army 2 HUD */}
      <div className="flex items-center space-x-2 bg-red-900 bg-opacity-70 p-2 rounded">
        <div className="w-3 h-3 bg-red-500 rounded-full"></div>
        <div>
          <p className="text-red-300 font-semibold text-sm">Army 2</p>
          <p className="text-xs text-white">Alive Soldiers: {army2Stats.aliveCount}</p>
          <p className="text-xs text-white">Kills: {army2Stats.kills}</p>
        </div>
      </div>
    </div>
  );
};

export default BattlefieldHUD;
