import { useState, useEffect } from 'react';

export const useBattleSimulation = (
  soldiers,
  setSoldiers,
  battleStarted,
  setBattleStarted,
  battlefieldWidth,
  battlefieldHeight,
  armyStats
) => {
  const [winner, setWinner] = useState(null);
  const [messages, setMessages] = useState([]);
  const [celebrationTimer, setCelebrationTimer] = useState(null);
  const [battleStartTime, setBattleStartTime] = useState(null);
  const [battleDuration, setBattleDuration] = useState(0);
  const [showResults, setShowResults] = useState(false);

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

  useEffect(() => {
    let animationFrameId;

    // Track battle start time
    if (battleStarted && !battleStartTime) {
      setBattleStartTime(Date.now());
    }

    const updateSimulation = () => {
      let defeatedTeams = {};
      let battleEnded = false;
      let winningTeam = null;

      let updatedSoldiers = soldiers.map((soldier) => {
        if (!soldier.alive) return soldier;

        if (soldier.state === 'celebrating') return soldier;

        const enemies = soldiers.filter((s) => s.team !== soldier.team && s.alive);
        const activeEnemies = enemies.filter((s) => s.alive);

        if (activeEnemies.length === 0 && !winner) {
          setWinner(soldier.team);
          setMessages((msgs) => [...msgs, `${soldier.team} wins! Celebrating...`]);
          
          // Calculate battle duration
          if (battleStartTime) {
            setBattleDuration(Math.floor((Date.now() - battleStartTime) / 1000));
          }

          battleEnded = true;
          winningTeam = soldier.team;

          setCelebrationTimer(
            setTimeout(() => {
              setBattleStarted(false);
              setMessages((msgs) => [...msgs, `Game over. ${soldier.team} wins!`]);
              setShowResults(true); // Show results after celebration
            }, 2000)
          );

          return soldier;
        }

        if (soldier.state === 'retreating') {
          soldier.target = null;
          const retreatSpeed = soldier.speed * 0.5;
          let retreatX = soldier.team === 'army1' ? -1 : 1;
          soldier.x += retreatX * retreatSpeed;
          
          if (soldier.x < 0 || soldier.x > battlefieldWidth) {
            soldier.alive = false;
            setMessages((msgs) => [...msgs, `${soldier.id} has left the battlefield!`]);

            if (soldier.team === 'army1') {
              armyStats.decrementArmy1Count();
            } else {
              armyStats.decrementArmy2Count();
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

          if (distance > soldier.radius + target.radius) {
            soldier.state = 'moving';

            let moveX = (dx / distance) * soldier.speed;
            let moveY = (dy / distance) * soldier.speed;

            const otherSoldiers = soldiers.filter((s) => s.id !== soldier.id && s.alive);
            const collisions = detectCollisions(soldier, otherSoldiers);

            if (collisions.length > 0) {
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
            const now = Date.now();
            if (!soldier.lastAttack || now - soldier.lastAttack > 1000) {
              soldier.state = 'attacking';
              target.health -= soldier.damage;
              soldier.lastAttack = now;
              
              if (target.health <= 0) {
                target.alive = false;
                target.state = 'dead';
                setMessages((msgs) => [...msgs, `${target.id} has been defeated by ${soldier.id}!`]);

                if (soldier.team === 'army1') {
                  armyStats.incrementArmy1Kills();
                } else {
                  armyStats.incrementArmy2Kills();
                }

                if (target.team === 'army1') {
                  armyStats.decrementArmy1Count();
                } else {
                  armyStats.decrementArmy2Count();
                }

                defeatedTeams[target.team] = (defeatedTeams[target.team] || 0) + 1;
              }
            }
          }
          soldier.target = target;
        }

        return soldier;
      });

      if (battleEnded) {
        updatedSoldiers = updatedSoldiers.map((s) => {
          if (s.team === winningTeam && s.alive) {
            s.state = 'celebrating';
          }
          return s;
        });
      }

      Object.keys(defeatedTeams).forEach((team) => {
        const moraleDecrease = (10 * Math.pow(defeatedTeams[team], 4)) / (soldiers.length / 10);
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
  }, [battleStarted, winner, soldiers, battlefieldWidth, armyStats, setSoldiers, celebrationTimer, setBattleStarted, battleStartTime]);

  const resetSimulation = () => {
    setWinner(null);
    setMessages([]);
    setCelebrationTimer(null);
    setBattleStartTime(null);
    setBattleDuration(0);
    setShowResults(false);
  };

  return {
    winner,
    messages,
    battleDuration,
    showResults,
    setMessages,
    resetSimulation,
  };
};
