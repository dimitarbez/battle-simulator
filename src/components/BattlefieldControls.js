import React from 'react';

const BattlefieldControls = ({ 
  currentArmy, 
  setCurrentArmy, 
  startSimulation, 
  resetSimulation 
}) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mt-6 mb-10">
      <button
        onClick={() => setCurrentArmy('army1')}
        className={`px-6 py-3 rounded font-semibold transition ${
          currentArmy === 'army1' 
            ? 'bg-blue-600 text-white' 
            : 'bg-gray-600 text-white hover:bg-blue-500'
        }`}
      >
        Select Army 1
      </button>
      <button
        onClick={() => setCurrentArmy('army2')}
        className={`px-6 py-3 rounded font-semibold transition ${
          currentArmy === 'army2' 
            ? 'bg-red-600 text-white' 
            : 'bg-gray-600 text-white hover:bg-red-500'
        }`}
      >
        Select Army 2
      </button>
      <button
        onClick={startSimulation}
        className="bg-green-600 text-white px-6 py-3 rounded hover:bg-green-700 transition font-semibold"
      >
        Start Simulation
      </button>
      <button
        onClick={resetSimulation}
        className="bg-red-600 text-white px-6 py-3 rounded hover:bg-red-700 transition font-semibold"
      >
        Reset
      </button>
    </div>
  );
};

export default BattlefieldControls;
