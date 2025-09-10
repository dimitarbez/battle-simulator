import React, { useState } from 'react';

const MobileTooltip = ({ children, content, position = 'top' }) => {
  const [isVisible, setIsVisible] = useState(false);

  const positionClasses = {
    top: 'bottom-full left-1/2 transform -translate-x-1/2 mb-2',
    bottom: 'top-full left-1/2 transform -translate-x-1/2 mt-2',
    left: 'right-full top-1/2 transform -translate-y-1/2 mr-2',
    right: 'left-full top-1/2 transform -translate-y-1/2 ml-2',
  };

  const arrowClasses = {
    top: 'top-full left-1/2 transform -translate-x-1/2 border-l-transparent border-r-transparent border-t-gray-800',
    bottom: 'bottom-full left-1/2 transform -translate-x-1/2 border-l-transparent border-r-transparent border-b-gray-800',
    left: 'left-full top-1/2 transform -translate-y-1/2 border-t-transparent border-b-transparent border-l-gray-800',
    right: 'right-full top-1/2 transform -translate-y-1/2 border-t-transparent border-b-transparent border-r-gray-800',
  };

  return (
    <div className="relative inline-block">
      <div
        onTouchStart={() => setIsVisible(true)}
        onTouchEnd={() => setTimeout(() => setIsVisible(false), 2000)}
        onMouseEnter={() => setIsVisible(true)}
        onMouseLeave={() => setIsVisible(false)}
      >
        {children}
      </div>
      
      {isVisible && (
        <div className={`absolute z-50 ${positionClasses[position]} animate-fade-in`}>
          <div className="bg-gray-800 text-white text-xs rounded py-2 px-3 max-w-xs whitespace-nowrap shadow-lg">
            {content}
            <div className={`absolute border-4 ${arrowClasses[position]}`}></div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MobileTooltip;
