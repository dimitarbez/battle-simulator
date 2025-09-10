import { useState, useEffect, useRef } from 'react';

export const useBattlefield = () => {
  const [currentArmy, setCurrentArmy] = useState('army1');
  const [isDrawing, setIsDrawing] = useState(false);
  const [lastSoldierPosition, setLastSoldierPosition] = useState(null);
  const [showHint, setShowHint] = useState(true);
  
  const battlefieldRef = useRef(null);
  const [battlefieldWidth, setBattlefieldWidth] = useState(800);
  const [battlefieldHeight, setBattlefieldHeight] = useState(600);

  const MIN_DISTANCE = 20; // Minimum distance between soldiers when drawing

  useEffect(() => {
    const updateDimensions = () => {
      if (battlefieldRef.current) {
        setBattlefieldWidth(battlefieldRef.current.offsetWidth);
        setBattlefieldHeight(battlefieldRef.current.offsetHeight);
      }
    };

    // Initial call
    updateDimensions();

    // Update dimensions on window resize
    window.addEventListener('resize', updateDimensions);

    // Hide the hint after 7 seconds
    const hintTimer = setTimeout(() => {
      setShowHint(false);
    }, 7000);

    return () => {
      window.removeEventListener('resize', updateDimensions);
      clearTimeout(hintTimer);
    };
  }, []);

  // Helper to convert touch coordinates to battlefield coordinates
  const getTouchPosition = (e) => {
    const rect = battlefieldRef.current.getBoundingClientRect();
    const x = e.touches[0].clientX - rect.left;
    const y = e.touches[0].clientY - rect.top;
    return { x, y };
  };

  const handleMouseDown = (e, handleBattlefieldClick, battleStarted) => {
    if (battleStarted) return;
    setIsDrawing(true);

    if (showHint) setShowHint(false);

    const rect = battlefieldRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    handleBattlefieldClick(x, y);
    setLastSoldierPosition({ x, y });
  };

  const handleTouchStart = (e, handleBattlefieldClick, battleStarted) => {
    if (battleStarted) return;
    e.preventDefault();

    setIsDrawing(true);

    if (showHint) setShowHint(false);

    const { x, y } = getTouchPosition(e);
    handleBattlefieldClick(x, y);
    setLastSoldierPosition({ x, y });
  };

  const handleMouseUp = () => {
    setIsDrawing(false);
    setLastSoldierPosition(null);
  };

  const handleTouchEnd = () => {
    setIsDrawing(false);
    setLastSoldierPosition(null);
  };

  const handleMouseMove = (e, handleBattlefieldClick) => {
    if (!isDrawing) return;
    const rect = battlefieldRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    handleDrawing(x, y, handleBattlefieldClick);
  };

  const handleTouchMove = (e, handleBattlefieldClick) => {
    if (!isDrawing) return;
    e.preventDefault();
    const { x, y } = getTouchPosition(e);
    handleDrawing(x, y, handleBattlefieldClick);
  };

  const handleDrawing = (x, y, handleBattlefieldClick) => {
    if (lastSoldierPosition) {
      const dx = x - lastSoldierPosition.x;
      const dy = y - lastSoldierPosition.y;
      const distance = Math.hypot(dx, dy);
      if (distance < MIN_DISTANCE) {
        return;
      }
    }

    handleBattlefieldClick(x, y);
    setLastSoldierPosition({ x, y });
  };

  return {
    currentArmy,
    setCurrentArmy,
    isDrawing,
    showHint,
    setShowHint,
    battlefieldRef,
    battlefieldWidth,
    battlefieldHeight,
    handleMouseDown,
    handleTouchStart,
    handleMouseUp,
    handleTouchEnd,
    handleMouseMove,
    handleTouchMove,
  };
};
