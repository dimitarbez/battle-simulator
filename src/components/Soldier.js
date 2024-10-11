// src/components/Soldier.js

import React from 'react';
import { animated, useSpring } from 'react-spring';

function Soldier({ soldier }) {
  // Movement animation
  const movementProps = useSpring({
    left: soldier.x - soldier.radius,
    top: soldier.y - soldier.radius,
    opacity: soldier.alive ? 1 : 0,
    config: { mass: 1, tension: 280, friction: 60 },
  });

  const soldierColor =
    soldier.team === 'army1' ? 'bg-blue-500' : 'bg-red-500';

  // Determine soldier's appearance based on state
  let soldierStateClass = '';
  if (soldier.state === 'attacking') {
    soldierStateClass = 'animate-swing';
  } else if (soldier.state === 'retreating') {
    soldierStateClass = 'animate-shake';
  } else if (soldier.state === 'celebrating') {
    soldierStateClass = 'animate-jump';
  } else if (soldier.state === 'dead') {
    soldierStateClass = 'animate-fade-out';
  }

  return (
    <animated.div
      className="absolute"
      style={{
        ...movementProps,
        width: soldier.radius * 2,
        height: soldier.radius * 2,
      }}
    >
      <div className="relative w-full h-full flex flex-col items-center">
        {/* Soldier circle */}
        <div
          className={`rounded-full ${soldierColor} ${soldierStateClass} flex items-center justify-center`}
          style={{
            width: '100%',
            height: '100%',
          }}
        >
          {/* Icons representing soldier's state */}
          <span className="text-white text-sm">
            {soldier.state === 'retreating' ? '😱' : '⚔️'}
          </span>
        </div>
        {/* Health and Morale Bars */}
        {soldier.alive && soldier.state !== 'celebrating' && (
          <div className="absolute bottom-full left-0 w-full mb-1">
            {/* Health Bar */}
            <div className="w-full h-1 bg-red-500">
              <div
                className="h-full bg-green-500"
                style={{
                  width: `${(soldier.health / soldier.maxHealth) * 100}%`,
                }}
              ></div>
            </div>
            {/* Morale Bar */}
            <div className="w-full h-1 bg-gray-400 mt-1">
              <div
                className="h-full bg-blue-300"
                style={{
                  width: `${(soldier.morale / soldier.maxMorale) * 100}%`,
                }}
              ></div>
            </div>
          </div>
        )}
      </div>
    </animated.div>
  );
}

export default Soldier;
