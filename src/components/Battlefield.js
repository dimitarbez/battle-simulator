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
  battleStarted,
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
      className="relative w-full h-full bg-gradient-to-br from-gray-800 via-gray-900 to-gray-800 overflow-hidden noscroll"
      style={{ 
        height: '100%',
        maxHeight: '100%',
        minHeight: '100%'
      }}
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div
          className="w-full h-full"
          style={{
            backgroundImage: `
              radial-gradient(circle at 25px 25px, rgba(255,255,255,0.1) 2px, transparent 0),
              radial-gradient(circle at 75px 75px, rgba(255,255,255,0.05) 2px, transparent 0)
            `,
            backgroundSize: '100px 100px'
          }}
        />
      </div>

      <div
        className="relative battlefield bg-cover bg-center h-full rounded-none lg:rounded-lg shadow-2xl border-0 lg:border-2 lg:border-gray-600 overflow-hidden"
        style={{
          backgroundImage: "url('https://i.pinimg.com/originals/7c/ca/0a/7cca0a0f83174b9e3ccaf43ec09558cc.jpg')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          height: '100%', // Force exact height to container
          maxHeight: '100%', // Prevent overflow
        }}
      >
        {/* Battlefield Grid Overlay for better soldier placement */}
        {!battleStarted && (
          <div 
            className="absolute inset-0 pointer-events-none opacity-20"
            style={{
              backgroundImage: `
                linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
                linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
              `,
              backgroundSize: '50px 50px'
            }}
          />
        )}

        {/* Dark overlay for better contrast - reduced opacity */}
        <div className="absolute inset-0 bg-black/10"></div>

        {/* Hint Overlay */}
        {showHint && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/70 z-10 backdrop-blur-sm">
            <div className="text-center max-w-md mx-auto p-6">
              <div className="text-6xl mb-4 animate-bounce">⚔️</div>
              <h2 className="text-2xl lg:text-3xl font-bold text-white mb-4 animate-pulse">
                Ready for Battle?
              </h2>
              <div className="space-y-2 text-gray-200">
                <p className="text-base lg:text-lg">
                  <span className="inline-block mr-2">👆</span>
                  Click and drag to place soldiers
                </p>
                <p className="text-sm lg:text-base text-gray-300">
                  Select an army from the sidebar and draw formations
                </p>
              </div>
              <div className="mt-6 flex items-center justify-center space-x-4 text-sm text-gray-400">
                <span>🖱️ Mouse</span>
                <span>•</span>
                <span>👆 Touch</span>
                <span>•</span>
                <span>✏️ Drag</span>
              </div>
            </div>
          </div>
        )}

        {/* HUD UI Overlay */}
        <BattlefieldHUD army1Stats={army1Stats} army2Stats={army2Stats} battleStarted={battleStarted} />

        {/* Soldiers */}
        <div className="relative z-10">
          {soldiers.map((soldier) => (
            <Soldier key={soldier.id} soldier={soldier} />
          ))}
        </div>

        {/* Winner Overlay - Simplified */}
        {winner && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/20 z-30 backdrop-blur-sm pointer-events-none">
            <div className="text-center animate-pulse">
              <div className="text-6xl mb-2 animate-bounce">
                {winner === 'army1' ? '🔵' : '🔴'}
              </div>
              <h1 className="text-2xl lg:text-4xl font-bold text-white mb-2">
                {winner.toUpperCase()} WINS!
              </h1>
            </div>
          </div>
        )}

        {/* Battle Progress Indicator */}
        {battleStarted && !winner && (
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-20">
            <div className="bg-black/70 backdrop-blur-sm rounded-full px-4 py-2 flex items-center space-x-2">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              <span className="text-white text-sm font-medium">Battle in progress...</span>
            </div>
          </div>
        )}

        {/* Touch/Click indicator for mobile */}
        {!battleStarted && soldiers.length === 0 && (
          <div className="absolute bottom-4 right-4 lg:hidden z-20">
            <div className="bg-blue-600/90 backdrop-blur-sm rounded-lg px-3 py-2 flex items-center space-x-2 animate-pulse">
              <span className="text-white text-xs">👆 Tap to place soldiers</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Battlefield;
