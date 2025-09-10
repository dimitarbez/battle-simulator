import React, { useState } from 'react';

const HelpModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-gray-800 rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-white flex items-center">
              💡 How to Play
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white text-2xl"
            >
              ×
            </button>
          </div>

          <div className="space-y-6 text-gray-300">
            <div>
              <h3 className="text-lg font-semibold text-blue-400 mb-2 flex items-center">
                🏗️ Setting Up
              </h3>
              <ol className="space-y-2 text-sm list-decimal list-inside">
                <li>Select an army (Army 1 or Army 2)</li>
                <li>Click/tap and drag on the battlefield to place soldiers</li>
                <li>Switch armies and repeat to create opposing forces</li>
                <li>Adjust army stats if desired (optional)</li>
              </ol>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-green-400 mb-2 flex items-center">
                ⚔️ Battle Controls
              </h3>
              <ul className="space-y-2 text-sm list-disc list-inside">
                <li>Click "Start Battle" to begin the simulation</li>
                <li>Watch armies fight automatically</li>
                <li>Reset battlefield to start over</li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-purple-400 mb-2 flex items-center">
                ⚙️ Army Stats
              </h3>
              <ul className="space-y-2 text-sm list-disc list-inside">
                <li><strong>Health:</strong> Hit points per soldier</li>
                <li><strong>Damage:</strong> Attack power</li>
                <li><strong>Speed:</strong> Movement speed</li>
                <li><strong>Morale:</strong> Combat effectiveness</li>
                <li><strong>Attack Rate:</strong> Time between attacks</li>
                <li><strong>Range:</strong> Attack distance</li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-yellow-400 mb-2 flex items-center">
                📱 Mobile Tips
              </h3>
              <ul className="space-y-2 text-sm list-disc list-inside">
                <li>Use touch gestures to place soldiers</li>
                <li>Pinch to zoom on supported devices</li>
                <li>Use the tabs to switch between army configurations</li>
                <li>Landscape mode recommended for larger battlefields</li>
              </ul>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-full mt-6 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold transition-colors"
          >
            Got it! Let's Battle 🚀
          </button>
        </div>
      </div>
    </div>
  );
};

const HelpButton = () => {
  const [isHelpOpen, setIsHelpOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsHelpOpen(true)}
        className="fixed bottom-4 left-4 z-40 bg-blue-600 hover:bg-blue-700 text-white w-12 h-12 rounded-full shadow-lg flex items-center justify-center text-xl font-bold transition-all duration-300 hover:scale-110 lg:w-auto lg:h-auto lg:px-4 lg:py-2 lg:rounded-lg"
        title="Help & Instructions"
      >
        <span className="lg:hidden">?</span>
        <span className="hidden lg:block text-sm">📖 Help</span>
      </button>
      
      <HelpModal isOpen={isHelpOpen} onClose={() => setIsHelpOpen(false)} />
    </>
  );
};

export default HelpButton;
