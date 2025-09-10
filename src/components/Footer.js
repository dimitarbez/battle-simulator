import React from 'react';

const Footer = () => {
  return (
    <footer className="hidden lg:block bg-gray-900/50 border-t border-gray-700 px-4 py-2">
      <div className="max-w-7xl mx-auto flex items-center justify-between text-xs text-gray-400">
        <div className="flex items-center space-x-4">
          <span>© 2025 Battle Simulator</span>
          <span>•</span>
          <span>v2.0 - Mobile Optimized</span>
        </div>
        <div className="flex items-center space-x-4">
          <span>Built with React ⚛️</span>
          <span>•</span>
          <span>Optimized for all devices 📱💻</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
