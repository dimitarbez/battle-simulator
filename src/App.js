// src/App.js

import React, { useState, useEffect, useRef } from 'react';
import Soldier from './components/Soldier';
import './index.css';

function App() {
  const [army1Stats, setArmy1Stats] = useState({
    count: 10,
    health: 100,
    damage: 10,
    speed: 1.0,
    morale: 100,
    aliveCount: 10,
    kills: 0,
  });

  const [army2Stats, setArmy2Stats] = useState({
    count: 10,
    health: 100,
    damage: 10,
    speed: 1.0,
    morale: 100,
    aliveCount: 10,
    kills: 0,
  });

  const [soldiers, setSoldiers] = useState([]);
  const [battleStarted, setBattleStarted] = useState(false);
  const [winner, setWinner] = useState(null);
  const [messages, setMessages] = useState([]);
  const [celebrationTimer, setCelebrationTimer] = useState(null);

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

    return () => {
      window.removeEventListener('resize', updateDimensions);
    };
  }, []);

  const startSimulation = () => {
    setSoldiers([]);
    setWinner(null);
    setMessages([]);
    setCelebrationTimer(null);

    // Reset alive counts and kills
    setArmy1Stats((prev) => ({ ...prev, aliveCount: prev.count, kills: 0 }));
    setArmy2Stats((prev) => ({ ...prev, aliveCount: prev.count, kills: 0 }));

    const newSoldiers = [];

    // Helper function to apply random variance within ±5%
    const applyVariance = (value) => {
      const variance = 0.05; // 5%
      const min = value * (1 - variance);
      const max = value * (1 + variance);
      return Math.random() * (max - min) + min;
    };

    // Calculate positions relative to battlefield dimensions
    const leftEdge = battlefieldWidth * 0.05;
    const rightEdge = battlefieldWidth * 0.95;
    const topEdge = battlefieldHeight * 0.1;
    const bottomEdge = battlefieldHeight * 0.9;

    // Create Army 1 soldiers with stat variance
    for (let i = 0; i < army1Stats.count; i++) {
      let x = Math.random() * (battlefieldWidth * 0.1) + leftEdge;
      let y = Math.random() * (bottomEdge - topEdge) + topEdge;
      newSoldiers.push({
        id: `army1-${i}`,
        x,
        y,
        health: army1Stats.health,
        maxHealth: army1Stats.health,
        damage: applyVariance(army1Stats.damage),
        speed: applyVariance(army1Stats.speed),
        morale: army1Stats.morale,
        maxMorale: army1Stats.morale,
        team: 'army1',
        color: 'blue-500',
        alive: true,
        state: 'idle',
        radius: 10,
      });
    }

    // Create Army 2 soldiers with stat variance
    for (let i = 0; i < army2Stats.count; i++) {
      let x = rightEdge - Math.random() * (battlefieldWidth * 0.1);
      let y = Math.random() * (bottomEdge - topEdge) + topEdge;
      newSoldiers.push({
        id: `army2-${i}`,
        x,
        y,
        health: army2Stats.health,
        maxHealth: army2Stats.health,
        damage: applyVariance(army2Stats.damage),
        speed: applyVariance(army2Stats.speed),
        morale: army2Stats.morale,
        maxMorale: army2Stats.morale,
        team: 'army2',
        color: 'red-500',
        alive: true,
        state: 'idle',
        radius: 10,
      });
    }

    setSoldiers(newSoldiers);
    setBattleStarted(true);
  };

  const resetSimulation = () => {
    setBattleStarted(false);
    setSoldiers([]);
    setWinner(null);
    setMessages([]);
    setCelebrationTimer(null);

    // Reset alive counts and kills
    setArmy1Stats((prev) => ({ ...prev, aliveCount: prev.count, kills: 0 }));
    setArmy2Stats((prev) => ({ ...prev, aliveCount: prev.count, kills: 0 }));
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

        const enemies = soldiers.filter(
          (s) => s.team !== soldier.team && s.alive
        );

        const allies = soldiers.filter(
          (s) => s.team === soldier.team && s.alive && s.id !== soldier.id
        );

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
              setMessages((msgs) => [
                ...msgs,
                `Game over. ${soldier.team} wins!`,
              ]);
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
            setMessages((msgs) => [
              ...msgs,
              `${soldier.id} has left the battlefield!`,
            ]);

            // Decrease alive count
            if (soldier.team === 'army1') {
              setArmy1Stats((prev) => ({
                ...prev,
                aliveCount: prev.aliveCount - 1,
              }));
            } else {
              setArmy2Stats((prev) => ({
                ...prev,
                aliveCount: prev.aliveCount - 1,
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
            const otherSoldiers = soldiers.filter(
              (s) => s.id !== soldier.id && s.alive
            );
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
                setMessages((msgs) => [
                  ...msgs,
                  `${target.id} has been defeated by ${soldier.id}!`,
                ]);

                // Increase kills for the soldier's team
                if (soldier.team === 'army1') {
                  setArmy1Stats((prev) => ({ ...prev, kills: prev.kills + 1 }));
                } else {
                  setArmy2Stats((prev) => ({ ...prev, kills: prev.kills + 1 }));
                }

                // Decrease alive count for the target's team
                if (target.team === 'army1') {
                  setArmy1Stats((prev) => ({
                    ...prev,
                    aliveCount: prev.aliveCount - 1,
                  }));
                } else {
                  setArmy2Stats((prev) => ({
                    ...prev,
                    aliveCount: prev.aliveCount - 1,
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
        const moraleDecrease = 10 * defeatedTeams[team] / (soldiers.length / 20); // Adjust as needed
        updatedSoldiers = updatedSoldiers.map((s) => {
          if (s.team === team && s.alive && s.state !== 'retreating') {
            s.morale -= moraleDecrease ;
            if (s.morale <= 0 && s.state !== 'retreating') {
              s.state = 'retreating';
              setMessages((msgs) => [
                ...msgs,
                `${s.id} is retreating due to low morale!`,
              ]);
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
    <div className="flex flex-col min-h-screen bg-gray-900">
      {/* Battlefield */}
      <div
        ref={battlefieldRef}
        className="relative w-full p-4 bg-gradient-to-b from-gray-800 to-gray-900 overflow-hidden flex-grow"
      >
        <div
          className="relative battlefield bg-cover bg-center h-full"
          style={{
            backgroundImage: "url('/images/battlefield.jpg')",
          }}
        >
          {/* HUD UI Overlay */}
          <div className="absolute top-0 left-0 w-full flex flex-col md:flex-row justify-between p-4 space-y-4 md:space-y-0">
            {/* Army 1 HUD */}
            <div className="flex items-center space-x-2 bg-blue-900 bg-opacity-50 p-2 rounded">
              <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
              <div>
                <p className="text-blue-300 font-semibold text-sm">Army 1</p>
                <p className="text-xs text-white">
                  Alive Soldiers: {army1Stats.aliveCount}
                </p>
                <p className="text-xs text-white">Kills: {army1Stats.kills}</p>
              </div>
            </div>
            {/* Army 2 HUD */}
            <div className="flex items-center space-x-2 bg-red-900 bg-opacity-50 p-2 rounded">
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              <div>
                <p className="text-red-300 font-semibold text-sm">Army 2</p>
                <p className="text-xs text-white">
                  Alive Soldiers: {army2Stats.aliveCount}
                </p>
                <p className="text-xs text-white">Kills: {army2Stats.kills}</p>
              </div>
            </div>
          </div>

          {soldiers.map((soldier) => (
            <Soldier key={soldier.id} soldier={soldier} />
          ))}
          {winner && (
            <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-75">
              <h1 className="text-4xl font-bold text-white">
                {winner.toUpperCase()} WINS!
              </h1>
            </div>
          )}
        </div>
      </div>
      {/* Controls */}
      <div className="w-full p-4 bg-gray-800">
        {/* Messages */}
        <div className="mb-4">
          <h2 className="text-2xl font-semibold mb-2 text-white">Messages</h2>
          <div className="max-h-32 md:max-h-48 overflow-y-auto border border-gray-700 p-2 bg-gray-700 text-white">
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
            <h2 className="text-2xl font-semibold mb-2 text-blue-400">
              Army 1 Stats
            </h2>
            <div className="grid grid-cols-1 gap-4">
              {Object.keys(army1Stats)
                .filter((stat) => !['aliveCount', 'kills'].includes(stat))
                .map((stat) => (
                  <label key={stat} className="block">
                    <span className="text-gray-300 capitalize text-sm">
                      {stat}:
                    </span>
                    <input
                      type="number"
                      value={army1Stats[stat]}
                      onChange={(e) =>
                        setArmy1Stats({
                          ...army1Stats,
                          [stat]: parseFloat(e.target.value),
                        })
                      }
                      className="w-full mt-1 p-2 border rounded text-sm bg-gray-700 border-gray-600 text-white"
                      min="0.1"
                      step="0.1"
                    />
                  </label>
                ))}
            </div>
          </div>
          {/* Army 2 Stats */}
          <div>
            <h2 className="text-2xl font-semibold mb-2 text-red-400">
              Army 2 Stats
            </h2>
            <div className="grid grid-cols-1 gap-4">
              {Object.keys(army2Stats)
                .filter((stat) => !['aliveCount', 'kills'].includes(stat))
                .map((stat) => (
                  <label key={stat} className="block">
                    <span className="text-gray-300 capitalize text-sm">
                      {stat}:
                    </span>
                    <input
                      type="number"
                      value={army2Stats[stat]}
                      onChange={(e) =>
                        setArmy2Stats({
                          ...army2Stats,
                          [stat]: parseFloat(e.target.value),
                        })
                      }
                      className="w-full mt-1 p-2 border rounded text-sm bg-gray-700 border-gray-600 text-white"
                      min="0.1"
                      step="0.1"
                    />
                  </label>
                ))}
            </div>
          </div>
        </div>
        {/* Control Buttons */}
        <div className="flex flex-col md:flex-row justify-center mt-6 space-y-2 md:space-y-0 md:space-x-4">
          <button
            onClick={startSimulation}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition w-full md:w-auto font-semibold"
          >
            Start Simulation
          </button>
          <button
            onClick={resetSimulation}
            className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition w-full md:w-auto font-semibold"
          >
            Reset
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;
