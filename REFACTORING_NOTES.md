# Battle Simulator - Refactored Structure

This document describes the refactored architecture of the Battle Simulator application.

## Overview

The original `App.js` file was 676 lines long and contained multiple responsibilities. It has been refactored into a more maintainable structure using custom hooks and smaller components.

## Project Structure

```
src/
├── components/           # Reusable UI components
│   ├── ArmyStatsPanel.js    # Army statistics input panel
│   ├── Battlefield.js       # Main battlefield component
│   ├── BattlefieldControls.js # Control buttons panel
│   ├── BattlefieldHUD.js    # Heads-up display overlay
│   └── Soldier.js          # Individual soldier component (existing)
├── hooks/               # Custom React hooks
│   ├── index.js            # Hook exports
│   ├── useArmyStats.js     # Army statistics management
│   ├── useBattlefield.js   # Battlefield interactions and state
│   └── useBattleSimulation.js # Battle simulation logic
├── utils/              # Utility functions
│   └── battleUtils.js     # Battle-related helper functions
└── App.js             # Main application component (now ~145 lines)
```

## Components

### `App.js` (Main Component)
- **Responsibility**: Orchestrates the application, manages soldier state, and coordinates between hooks and components
- **Size**: Reduced from 676 to ~145 lines

### `Battlefield.js`
- **Responsibility**: Renders the battlefield, soldiers, overlays, and handles user interactions
- **Props**: Battlefield reference, soldiers, winner state, HUD data, interaction handlers

### `BattlefieldControls.js`
- **Responsibility**: Army selection buttons and simulation control buttons
- **Props**: Current army, army setter, simulation controls

### `BattlefieldHUD.js`
- **Responsibility**: Displays real-time army statistics overlay on battlefield
- **Props**: Army statistics for both armies

### `ArmyStatsPanel.js`
- **Responsibility**: Input controls for army statistics (health, damage, speed, morale)
- **Props**: Army statistics and setters for both armies

## Custom Hooks

### `useBattlefield`
- **Responsibility**: Manages battlefield dimensions, user interactions (mouse/touch), army selection
- **Returns**: Battlefield state, dimensions, interaction handlers, current army selection

### `useArmyStats`
- **Responsibility**: Manages army statistics, alive counts, kills
- **Returns**: Army statistics, update functions, counter functions

### `useBattleSimulation`
- **Responsibility**: Handles the battle simulation loop, combat logic, winner determination
- **Parameters**: Soldiers, battlefield dimensions, army stats management functions
- **Returns**: Winner state, messages, simulation reset function

## Utilities

### `battleUtils.js`
- **`applyVariance(value)`**: Applies ±5% random variance to a value
- **`createSoldier(armyType, x, y, armyStats)`**: Factory function for creating soldier objects
- **`isWithinBounds(x, y, width, height)`**: Boundary checking utility

## Benefits of Refactoring

1. **Separation of Concerns**: Each file has a single, well-defined responsibility
2. **Reusability**: Components and hooks can be easily reused or modified
3. **Maintainability**: Smaller files are easier to understand and maintain
4. **Testability**: Individual components and hooks can be tested in isolation
5. **Readability**: Code is more organized and easier to navigate
6. **Performance**: Better opportunities for React optimization (memoization, etc.)

## Migration Notes

The refactored application maintains full backward compatibility with the original functionality:
- All existing features work identically
- User interface remains unchanged
- Battle simulation logic is preserved
- Mobile touch support continues to work

## Future Improvements

With this modular structure, it's now easier to:
- Add new army types or soldier classes
- Implement different battle modes
- Add unit tests for individual components
- Optimize performance with React.memo and useCallback
- Add new battlefield features or visualizations
