import React from 'react';

const KeyboardShortcuts = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const shortcuts = [
    { key: '1', action: 'Select Army 1' },
    { key: '2', action: 'Select Army 2' },
    { key: 'Space', action: 'Start/Stop Simulation' },
    { key: 'R', action: 'Reset Battlefield' },
    { key: 'H', action: 'Toggle Help' },
    { key: 'Esc', action: 'Close Modals' },
  ];

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-gray-800 rounded-lg max-w-sm w-full">
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-white flex items-center">
              ⌨️ Keyboard Shortcuts
            </h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white text-xl"
            >
              ×
            </button>
          </div>

          <div className="space-y-3">
            {shortcuts.map(({ key, action }) => (
              <div key={key} className="flex items-center justify-between">
                <span className="text-gray-300 text-sm">{action}</span>
                <kbd className="bg-gray-700 text-white px-2 py-1 rounded text-xs font-mono border border-gray-600">
                  {key}
                </kbd>
              </div>
            ))}
          </div>

          <div className="mt-4 pt-4 border-t border-gray-600">
            <p className="text-xs text-gray-400 text-center">
              Desktop only • Mobile users use touch controls
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default KeyboardShortcuts;
