import React from 'react';
import Soldier from './Soldier';
import BattlefieldHUD from './BattlefieldHUD';

const Battlefield = ({
  battlefieldRef,
  soldiers,
  winner,
  showHint,
  army1Stats,
  army2Stats,
  battlefieldHandlers,
}) => {
  const {
    handleMouseDown,
    handleMouseUp,
    handleMouseMove,
    handleTouchStart,
    handleTouchMove,
    handleTouchEnd,
  } = battlefieldHandlers;

  return (
    <div
      ref={battlefieldRef}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseMove={handleMouseMove}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      className="relative w-full p-4 bg-gradient-to-b from-gray-800 to-gray-900 overflow-hidden flex-grow noscroll"
    >
      <div
        className="relative battlefield bg-cover bg-center h-full rounded-lg shadow-lg"
        style={{
          backgroundImage: "url('https://i.pinimg.com/originals/7c/ca/0a/7cca0a0f83174b9e3ccaf43ec09558cc.jpg')",
        }}
      >
        {/* Hint Overlay */}
        {showHint && (
          <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 z-10">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-white mb-4 animate-pulse">
                Click and drag to place soldiers
              </h2>
              <p className="text-lg text-gray-200">
                Select an army below and draw formations on the battlefield
              </p>
            </div>
          </div>
        )}

        {/* HUD UI Overlay */}
        <BattlefieldHUD army1Stats={army1Stats} army2Stats={army2Stats} />

        {/* Soldiers */}
        {soldiers.map((soldier) => (
          <Soldier key={soldier.id} soldier={soldier} />
        ))}

        {/* Winner Overlay */}
        {winner && (
          <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-75 z-30">
            <h1 className="text-5xl font-bold text-white">{winner.toUpperCase()} WINS!</h1>
          </div>
        )}
      </div>
    </div>
  );
};

export default Battlefield;
