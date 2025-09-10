import React from 'react';

const LoadingScreen = ({ message = 'Loading...' }) => {
  return (
    <div className="fixed inset-0 bg-gray-900 flex items-center justify-center z-50">
      <div className="text-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-500 mb-4 mx-auto"></div>
        <h2 className="text-2xl font-semibold text-white mb-2">⚔️ Battle Simulator</h2>
        <p className="text-gray-300">{message}</p>
      </div>
    </div>
  );
};

export default LoadingScreen;
