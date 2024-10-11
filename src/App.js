// src/App.js

import React, { useState, useEffect, useRef } from 'react';
import Soldier from './components/Soldier';
import './index.css';

function App() {
  const [army1Stats, setArmy1Stats] = useState({
    health: 100,
    damage: 10,
    speed: 1.0,
    morale: 100,
    aliveCount: 0,
    kills: 0
  });

  const [army2Stats, setArmy2Stats] = useState({
    health: 100,
    damage: 10,
    speed: 1.0,
    morale: 100,
    aliveCount: 0,
    kills: 0
  });

  const [soldiers, setSoldiers] = useState([]);
  const [battleStarted, setBattleStarted] = useState(false);
  const [winner, setWinner] = useState(null);
  const [messages, setMessages] = useState([]);
  const [celebrationTimer, setCelebrationTimer] = useState(null);

  // State to track the current army being placed
  const [currentArmy, setCurrentArmy] = useState('army1');

  // New states for drawing soldiers by dragging
  const [isDrawing, setIsDrawing] = useState(false);
  const [lastSoldierPosition, setLastSoldierPosition] = useState(null);

  // Minimum distance between soldiers when drawing
  const MIN_DISTANCE = 20; // Adjust this value as needed

  // Hint overlay state
  const [showHint, setShowHint] = useState(true);

  // References and dimensions
  const battlefieldRef = useRef(null);
  const [battlefieldWidth, setBattlefieldWidth] = useState(800); // default values
  const [battlefieldHeight, setBattlefieldHeight] = useState(600); // default values

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
    }, 7000); // 7 seconds

    return () => {
      window.removeEventListener('resize', updateDimensions);
      clearTimeout(hintTimer);
    };
  }, []);

  // Handle mouse down event to start drawing
  const handleMouseDown = (e) => {
    if (battleStarted) return; // Don't handle during battle
    setIsDrawing(true);

    // Hide the hint when the user starts interacting
    if (showHint) setShowHint(false);

    const rect = battlefieldRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    handleBattlefieldClick(x, y); // Place a soldier at the starting point

    // Update lastSoldierPosition
    setLastSoldierPosition({ x, y });
  };

  // Handle mouse up event to stop drawing
  const handleMouseUp = () => {
    setIsDrawing(false);
    setLastSoldierPosition(null);
  };

  // Handle mouse move event to draw soldiers along the path
  const handleMouseMove = (e) => {
    if (!isDrawing) return;
    const rect = battlefieldRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    if (lastSoldierPosition) {
      const dx = x - lastSoldierPosition.x;
      const dy = y - lastSoldierPosition.y;
      const distance = Math.hypot(dx, dy);
      if (distance < MIN_DISTANCE) {
        // Too close to last soldier, don't add a new one
        return;
      }
    }

    // Add a new soldier at this position
    handleBattlefieldClick(x, y);

    // Update lastSoldierPosition
    setLastSoldierPosition({ x, y });
  };

  // Handle mouse leaving the battlefield while drawing
  const handleMouseLeave = () => {
    if (isDrawing) {
      setIsDrawing(false);
      setLastSoldierPosition(null);
    }
  };

  // Function to handle adding soldiers at specific coordinates
  const handleBattlefieldClick = (x, y) => {
    if (battleStarted) return; // Don't handle clicks during battle

    // Ensure the soldier is within battlefield bounds
    if (x < 0 || y < 0 || x > battlefieldWidth || y > battlefieldHeight) {
      return;
    }

    // Get the stats for the currentArmy
    const armyStats = currentArmy === 'army1' ? army1Stats : army2Stats;

    const newSoldier = {
      id: `${currentArmy}-${Date.now()}`, // Use timestamp to ensure unique id
      x,
      y,
      health: armyStats.health,
      maxHealth: armyStats.health,
      damage: armyStats.damage,
      speed: armyStats.speed,
      morale: armyStats.morale,
      maxMorale: armyStats.morale,
      team: currentArmy,
      color: currentArmy === 'army1' ? 'blue-500' : 'red-500',
      alive: true,
      state: 'idle',
      radius: 10
    };

    setSoldiers((prevSoldiers) => [...prevSoldiers, newSoldier]);
  };

  const startSimulation = () => {
    if (soldiers.length === 0) {
      alert('Please place soldiers on the battlefield before starting the simulation.');
      return;
    }

    setWinner(null);
    setMessages([]);
    setCelebrationTimer(null);

    // Reset alive counts and kills
    setArmy1Stats((prev) => ({
      ...prev,
      aliveCount: soldiers.filter((s) => s.team === 'army1').length,
      kills: 0
    }));
    setArmy2Stats((prev) => ({
      ...prev,
      aliveCount: soldiers.filter((s) => s.team === 'army2').length,
      kills: 0
    }));

    // Helper function to apply random variance within ±5%
    const applyVariance = (value) => {
      const variance = 0.05; // 5%
      const min = value * (1 - variance);
      const max = value * (1 + variance);
      return Math.random() * (max - min) + min;
    };

    // Update soldiers' stats according to their army stats
    const updatedSoldiers = soldiers.map((soldier) => {
      const armyStats = soldier.team === 'army1' ? army1Stats : army2Stats;
      return {
        ...soldier,
        health: armyStats.health,
        maxHealth: armyStats.health,
        damage: applyVariance(armyStats.damage),
        speed: applyVariance(armyStats.speed),
        morale: armyStats.morale,
        maxMorale: armyStats.morale,
        alive: true,
        state: 'idle',
        lastAttack: null
      };
    });

    setSoldiers(updatedSoldiers);
    setBattleStarted(true);
  };

  const resetSimulation = () => {
    setBattleStarted(false);
    setSoldiers([]);
    setWinner(null);
    setMessages([]);
    setCelebrationTimer(null);

    // Reset alive counts and kills
    setArmy1Stats((prev) => ({
      ...prev,
      aliveCount: 0,
      kills: 0
    }));
    setArmy2Stats((prev) => ({
      ...prev,
      aliveCount: 0,
      kills: 0
    }));
  };

  useEffect(() => {
    let animationFrameId;

    const updateSimulation = () => {
      let defeatedTeams = {};
      let battleEnded = false;
      let winningTeam = null;

      let updatedSoldiers = soldiers.map((soldier) => {
        if (!soldier.alive) return soldier;

        // Skip action for soldiers who are celebrating
        if (soldier.state === 'celebrating') return soldier;

        const enemies = soldiers.filter((s) => s.team !== soldier.team && s.alive);

        const allies = soldiers.filter((s) => s.team === soldier.team && s.alive && s.id !== soldier.id);

        // Check for battle end
        const activeEnemies = enemies.filter((s) => s.alive);

        // Game ends only when all enemies are dead
        if (activeEnemies.length === 0 && !winner) {
          setWinner(soldier.team);
          setMessages((msgs) => [...msgs, `${soldier.team} wins! Celebrating...`]);

          battleEnded = true;
          winningTeam = soldier.team;

          // End game after 5 seconds
          setCelebrationTimer(
            setTimeout(() => {
              setBattleStarted(false);
              setMessages((msgs) => [...msgs, `Game over. ${soldier.team} wins!`]);
            }, 5000)
          );

          return soldier;
        }

        if (soldier.state === 'retreating') {
          // Move soldier away from battle at a slower speed
          soldier.target = null; // Clear any target
          const retreatSpeed = soldier.speed * 0.5; // Retreating speed is half
          // Determine retreat direction
          let retreatX = soldier.team === 'army1' ? -1 : 1;
          soldier.x += retreatX * retreatSpeed;
          // Remove soldier if they leave the battlefield bounds
          if (soldier.x < 0 || soldier.x > battlefieldWidth) {
            soldier.alive = false;
            setMessages((msgs) => [...msgs, `${soldier.id} has left the battlefield!`]);

            // Decrease alive count
            if (soldier.team === 'army1') {
              setArmy1Stats((prev) => ({
                ...prev,
                aliveCount: prev.aliveCount - 1
              }));
            } else {
              setArmy2Stats((prev) => ({
                ...prev,
                aliveCount: prev.aliveCount - 1
              }));
            }
          }
          return soldier;
        }

        let target = soldier.target;
        if (!target || !target.alive || target.state === 'retreating') {
          target = findClosestEnemy(soldier, enemies);
        }

        if (target) {
          const dx = target.x - soldier.x;
          const dy = target.y - soldier.y;
          const distance = Math.hypot(dx, dy);

          // Move towards target if not in attack range
          if (distance > soldier.radius + target.radius) {
            soldier.state = 'moving';

            // Calculate desired movement
            let moveX = (dx / distance) * soldier.speed;
            let moveY = (dy / distance) * soldier.speed;

            // Collision avoidance with all other soldiers
            const otherSoldiers = soldiers.filter((s) => s.id !== soldier.id && s.alive);
            const collisions = detectCollisions(soldier, otherSoldiers);

            if (collisions.length > 0) {
              // Adjust movement to avoid collision
              collisions.forEach((other) => {
                const diffX = soldier.x - other.x;
                const diffY = soldier.y - other.y;
                const dist = Math.hypot(diffX, diffY);
                if (dist === 0) return;
                moveX += (diffX / dist) * soldier.speed * 0.5;
                moveY += (diffY / dist) * soldier.speed * 0.5;
              });
            }

            soldier.x += moveX;
            soldier.y += moveY;
          } else {
            // Attack with cooldown
            const now = Date.now();
            if (!soldier.lastAttack || now - soldier.lastAttack > 1000) {
              soldier.state = 'attacking';
              target.health -= soldier.damage;
              soldier.lastAttack = now;
              if (target.health <= 0) {
                target.alive = false;
                target.state = 'dead';
                setMessages((msgs) => [...msgs, `${target.id} has been defeated by ${soldier.id}!`]);

                // Increase kills for the soldier's team
                if (soldier.team === 'army1') {
                  setArmy1Stats((prev) => ({
                    ...prev,
                    kills: prev.kills + 1
                  }));
                } else {
                  setArmy2Stats((prev) => ({
                    ...prev,
                    kills: prev.kills + 1
                  }));
                }

                // Decrease alive count for the target's team
                if (target.team === 'army1') {
                  setArmy1Stats((prev) => ({
                    ...prev,
                    aliveCount: prev.aliveCount - 1
                  }));
                } else {
                  setArmy2Stats((prev) => ({
                    ...prev,
                    aliveCount: prev.aliveCount - 1
                  }));
                }

                // Mark that a soldier from target's team has died
                defeatedTeams[target.team] = (defeatedTeams[target.team] || 0) + 1;
              }
            }
          }
          soldier.target = target;
        }

        return soldier;
      });

      // After mapping, set celebrating state for the winning team's soldiers
      if (battleEnded) {
        updatedSoldiers = updatedSoldiers.map((s) => {
          if (s.team === winningTeam && s.alive) {
            s.state = 'celebrating';
          }
          return s;
        });
      }

      // After mapping, decrease morale of soldiers in teams that had soldiers die
      Object.keys(defeatedTeams).forEach((team) => {
        const moraleDecrease = (10 * Math.pow(defeatedTeams[team], 4)) / (soldiers.length / 10); // Adjust as needed
        updatedSoldiers = updatedSoldiers.map((s) => {
          if (s.team === team && s.alive && s.state !== 'retreating') {
            s.morale -= moraleDecrease;
            if (s.morale <= 0 && s.state !== 'retreating') {
              s.state = 'retreating';
              setMessages((msgs) => [...msgs, `${s.id} is retreating due to low morale!`]);
            }
          }
          return s;
        });
      });

      setSoldiers(updatedSoldiers);
      animationFrameId = requestAnimationFrame(updateSimulation);
    };

    if (battleStarted) {
      animationFrameId = requestAnimationFrame(updateSimulation);
    }

    return () => {
      cancelAnimationFrame(animationFrameId);
      if (celebrationTimer) {
        clearTimeout(celebrationTimer);
      }
    };
  }, [battleStarted, winner, soldiers]);

  const findClosestEnemy = (soldier, enemies) => {
    let minDistance = Infinity;
    let closest = null;
    enemies.forEach((enemy) => {
      const dx = enemy.x - soldier.x;
      const dy = enemy.y - soldier.y;
      const distance = Math.hypot(dx, dy);
      if (distance < minDistance) {
        minDistance = distance;
        closest = enemy;
      }
    });
    return closest;
  };

  const detectCollisions = (soldier, others) => {
    const collisions = [];
    others.forEach((other) => {
      const dx = other.x - soldier.x;
      const dy = other.y - soldier.y;
      const distance = Math.hypot(dx, dy);
      if (distance < soldier.radius + other.radius) {
        collisions.push(other);
      }
    });
    return collisions;
  };

  return (
    <div
      className="flex flex-col min-h-screen bg-gray-900 prevent-select"
      onClick={() => {
        if (showHint) setShowHint(false);
      }}
    >
      {/* Battlefield */}
      <div
        ref={battlefieldRef}
        onMouseDown={handleMouseDown} // Handle mouse down
        onMouseUp={handleMouseUp} // Handle mouse up
        onMouseMove={handleMouseMove} // Handle mouse move
        onMouseLeave={handleMouseLeave} // Handle mouse leave
        className="relative w-full p-4 bg-gradient-to-b from-gray-800 to-gray-900 overflow-hidden flex-grow"
      >
        <div
          className="relative battlefield bg-cover bg-center h-full rounded-lg shadow-lg"
          style={{
            backgroundImage: "url('https://i.pinimg.com/originals/7c/ca/0a/7cca0a0f83174b9e3ccaf43ec09558cc.jpg')"
          }}
        >
          {/* Hint Overlay */}
          {showHint && !battleStarted && (
            <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 z-10">
              <div className="text-center">
                <h2 className="text-3xl font-bold text-white mb-4 animate-pulse">Click and drag to place soldiers</h2>
                <p className="text-lg text-gray-200">Select an army below and draw formations on the battlefield</p>
              </div>
            </div>
          )}

          {/* HUD UI Overlay */}
          <div className="absolute top-0 left-0 w-full flex flex-col md:flex-row justify-between p-4 space-y-4 md:space-y-0 z-20">
            {/* Army 1 HUD */}
            <div className="flex items-center space-x-2 bg-blue-900 bg-opacity-70 p-2 rounded">
              <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
              <div>
                <p className="text-blue-300 font-semibold text-sm">Army 1</p>
                <p className="text-xs text-white">Alive Soldiers: {army1Stats.aliveCount}</p>
                <p className="text-xs text-white">Kills: {army1Stats.kills}</p>
              </div>
            </div>
            {/* Army 2 HUD */}
            <div className="flex items-center space-x-2 bg-red-900 bg-opacity-70 p-2 rounded">
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              <div>
                <p className="text-red-300 font-semibold text-sm">Army 2</p>
                <p className="text-xs text-white">Alive Soldiers: {army2Stats.aliveCount}</p>
                <p className="text-xs text-white">Kills: {army2Stats.kills}</p>
              </div>
            </div>
          </div>

          {soldiers.map((soldier) => (
            <Soldier key={soldier.id} soldier={soldier} />
          ))}
          {winner && (
            <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-75 z-30">
              <h1 className="text-5xl font-bold text-white">{winner.toUpperCase()} WINS!</h1>
            </div>
          )}
        </div>
      </div>

      {/* Controls */}
      <div className="w-full p-4 bg-gray-800">
        {/* Army Selection Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mt-6 mb-10">
          <button
            onClick={() => setCurrentArmy('army1')}
            className={`px-6 py-3 rounded font-semibold transition ${
              currentArmy === 'army1' ? 'bg-blue-600 text-white' : 'bg-gray-600 text-white hover:bg-blue-500'
            }`}
          >
            Select Army 1
          </button>
          <button
            onClick={() => setCurrentArmy('army2')}
            className={`px-6 py-3 rounded font-semibold transition ${
              currentArmy === 'army2' ? 'bg-red-600 text-white' : 'bg-gray-600 text-white hover:bg-red-500'
            }`}
          >
            Select Army 2
          </button>
          <button
            onClick={startSimulation}
            className="bg-green-600 text-white px-6 py-3 rounded hover:bg-green-700 transition font-semibold"
          >
            Start Simulation
          </button>
          <button
            onClick={resetSimulation}
            className="bg-red-600 text-white px-6 py-3 rounded hover:bg-red-700 transition font-semibold"
          >
            Reset
          </button>
        </div>

        {/* Messages */}
        <div className="mb-4">
          <h2 className="text-2xl font-semibold mb-2 text-white">Messages</h2>
          <div className="max-h-32 md:max-h-48 overflow-y-auto border border-gray-700 p-2 bg-gray-700 text-white rounded">
            {messages.map((msg, index) => (
              <p key={index} className="text-sm">
                {msg}
              </p>
            ))}
          </div>
        </div>
        <div className="army-stats grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Army 1 Stats */}
          <div>
            <h2 className="text-2xl font-semibold mb-2 text-blue-400">Army 1 Stats</h2>
            <div className="grid grid-cols-1 gap-4">
              {Object.keys(army1Stats)
                .filter((stat) => !['aliveCount', 'kills'].includes(stat))
                .map((stat) => (
                  <label key={stat} className="block">
                    <span className="text-gray-300 capitalize text-sm">{stat}:</span>
                    <input
                      type="number"
                      value={army1Stats[stat]}
                      onChange={(e) =>
                        setArmy1Stats({
                          ...army1Stats,
                          [stat]: parseFloat(e.target.value)
                        })
                      }
                      className="w-full mt-1 p-2 border rounded text-sm bg-gray-700 border-gray-600 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      min="0.1"
                      step="0.1"
                    />
                  </label>
                ))}
            </div>
          </div>
          {/* Army 2 Stats */}
          <div>
            <h2 className="text-2xl font-semibold mb-2 text-red-400">Army 2 Stats</h2>
            <div className="grid grid-cols-1 gap-4">
              {Object.keys(army2Stats)
                .filter((stat) => !['aliveCount', 'kills'].includes(stat))
                .map((stat) => (
                  <label key={stat} className="block">
                    <span className="text-gray-300 capitalize text-sm">{stat}:</span>
                    <input
                      type="number"
                      value={army2Stats[stat]}
                      onChange={(e) =>
                        setArmy2Stats({
                          ...army2Stats,
                          [stat]: parseFloat(e.target.value)
                        })
                      }
                      className="w-full mt-1 p-2 border rounded text-sm bg-gray-700 border-gray-600 text-white focus:outline-none focus:ring-2 focus:ring-red-500"
                      min="0.1"
                      step="0.1"
                    />
                  </label>
                ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
