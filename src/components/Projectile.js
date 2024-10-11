// src/components/Projectile.js

import React from 'react';
import { animated, useSpring } from 'react-spring';

function Projectile({ projectile }) {
  // Movement animation
  const movementProps = useSpring({
    left: projectile.x,
    top: projectile.y,
    config: { mass: 1, tension: 280, friction: 60 },
  });

  return (
    <animated.div
      className="absolute w-2 h-2 bg-black rounded-full"
      style={{
        ...movementProps,
      }}
    ></animated.div>
  );
}

export default Projectile;
