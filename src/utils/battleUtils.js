/**
 * Helper function to apply random variance within ±5%
 * @param {number} value - The base value to apply variance to
 * @returns {number} - The value with applied variance
 */
export const applyVariance = (value) => {
  const variance = 0.05; // 5%
  const min = value * (1 - variance);
  const max = value * (1 + variance);
  return Math.random() * (max - min) + min;
};

/**
 * Creates a new soldier object with the given parameters
 * @param {string} armyType - 'army1' or 'army2'
 * @param {number} x - X coordinate
 * @param {number} y - Y coordinate
 * @param {object} armyStats - Stats for the army
 * @returns {object} - New soldier object
 */
export const createSoldier = (armyType, x, y, armyStats) => {
  return {
    id: `${armyType}-${Date.now()}`,
    x,
    y,
    health: armyStats.health,
    maxHealth: armyStats.health,
    damage: armyStats.damage,
    speed: armyStats.speed,
    morale: armyStats.morale,
    maxMorale: armyStats.morale,
    team: armyType,
    color: armyType === 'army1' ? 'blue-500' : 'red-500',
    alive: true,
    state: 'idle',
    radius: 10,
  };
};

/**
 * Checks if coordinates are within battlefield bounds
 * @param {number} x - X coordinate
 * @param {number} y - Y coordinate
 * @param {number} width - Battlefield width
 * @param {number} height - Battlefield height
 * @returns {boolean} - True if within bounds
 */
export const isWithinBounds = (x, y, width, height) => {
  return x >= 0 && y >= 0 && x <= width && y <= height;
};
