# Battle Simulator AI Coding Instructions

## Architecture Overview

This is a **real-time strategy battle simulation** built with React 18. The app orchestrates armies of soldiers in combat using custom hooks, physics simulation, and responsive UI design.

### Core Data Flow
```
App.js → Custom Hooks → Components → Battle Simulation Loop
    ↓
soldiers[] → useBattleSimulation → requestAnimationFrame updates
    ↓  
battlefield interactions → soldier state changes → victory conditions
```

**Key State Pattern**: The `soldiers` array is the single source of truth, updated via `setSoldiers()` in the main simulation loop. Each soldier object contains position, health, damage, team, and AI state.

## Critical Architecture Patterns

### 1. Hook-Based State Management
- **`useArmyStats`**: Manages army configuration (health, damage, speed, morale) and live battle stats (aliveCount, kills)
- **`useBattlefield`**: Handles canvas dimensions, user interactions (mouse/touch), and army selection
- **`useBattleSimulation`**: Core game engine with requestAnimationFrame loop, AI behavior, physics, and win conditions

**Pattern**: Hooks return both state and functions. Always destructure the entire hook object: `const armyStats = useArmyStats()`

### 2. Component Hierarchy & Responsibilities
```
App.js (orchestrates everything)
├── Battlefield.js (canvas area, soldier rendering)
│   ├── BattlefieldHUD.js (real-time army stats overlay)
│   └── Soldier.js (individual unit with CSS animations)
├── BattlefieldControls.js (army selection, start/reset buttons)  
├── ArmyStatsPanel.js (army configuration inputs)
└── BattleResultsPanel.js (post-battle statistics modal)
```

### 3. Mobile-First Responsive Design
**Critical Pattern**: All layouts use mobile-first Tailwind classes with `lg:` breakpoints:
```jsx
className="p-2 lg:p-4 text-xs lg:text-base max-h-[35vh] lg:max-h-none"
```

**HUD Layout**: Mobile uses horizontal rows (`flex-row`), desktop uses vertical stacks (`lg:flex-col`). Always test both layouts.

## Development Workflows

### Essential Commands
```bash
npm start          # Development server with hot reload
npm run build      # Production build for deployment
npm run deploy     # Deploy to GitHub Pages (gh-pages)
```

### State Debugging
Access React DevTools to inspect:
- `soldiers[]` array for battle state
- Hook state in `useArmyStats`, `useBattlefield`, `useBattleSimulation`
- Component props flow from App.js downward

## Project-Specific Conventions

### 1. Soldier Object Structure
```javascript
{
  id: 'army1-timestamp',
  x, y: number,           // Battlefield coordinates
  team: 'army1' | 'army2',
  health, maxHealth: number,
  damage, speed, morale: number,
  alive: boolean,
  state: 'idle' | 'moving' | 'attacking' | 'retreating' | 'celebrating',
  target: soldierObject | null,
  lastAttack: timestamp
}
```

### 2. Battle Physics & AI
- **Collision Detection**: Uses `Math.hypot(dx, dy)` for distance calculation
- **AI States**: Soldiers follow state machine: idle → target selection → movement → attack → repeat
- **Morale System**: Soldiers retreat when morale drops below threshold (affects by team casualties)
- **Victory Condition**: Triggered when `activeEnemies.length === 0`

### 3. Styling Patterns
- **Color Coding**: Army 1 = Blue theme (`text-blue-400`, `bg-blue-900`), Army 2 = Red theme
- **Animations**: Use `animate-bounce`, `animate-pulse`, `animate-spin` for UI feedback
- **Glass Effects**: `backdrop-blur-sm` + `bg-gray-900/80` for overlays
- **Custom CSS**: Define keyframe animations in `src/index.css` for complex effects

### 4. Utility Functions (`src/utils/battleUtils.js`)
```javascript
applyVariance(value)                    // ±5% randomization for realism
createSoldier(army, x, y, stats)       // Factory for new soldier objects  
isWithinBounds(x, y, width, height)    // Boundary checking
```

## Integration Points

### External Dependencies
- **react-helmet-async**: SEO meta tags and dynamic page titles
- **react-spring**: Animation library (currently imported but not heavily used)
- **Tailwind CSS**: All styling through utility classes

### Event Handling Patterns
```javascript
// Mouse + Touch unified handling
const battlefieldHandlers = {
  handleMouseDown: (e) => battlefield.handleMouseDown(e, handleBattlefieldClick, battleStarted),
  handleTouchStart: (e) => battlefield.handleTouchStart(e, handleBattlefieldClick, battleStarted),
  // ... touch events prevent default and use getBoundingClientRect()
};
```

### Performance Considerations
- **requestAnimationFrame**: Simulation loop runs at 60fps when `battleStarted === true`  
- **Conditional Rendering**: Components check `battleStarted`, `winner`, `showHint` flags
- **Memory Management**: Clear timers and animation frames in useEffect cleanup

## Common Patterns When Contributing

1. **Adding New Features**: Follow the hook → component → integration pattern. Create custom hooks for complex state logic.

2. **Mobile Responsiveness**: Always implement mobile-first, then enhance for desktop with `lg:` breakpoints. Test HUD layouts on narrow screens.

3. **Battle Mechanics**: Modify soldier behavior in `useBattleSimulation.js` updateSimulation loop. Use existing helper functions from battleUtils.

4. **UI Components**: Follow the established color theming (blue/red armies) and glass-effect styling patterns.

5. **State Updates**: Always use functional setState updates when modifying soldiers array: `setSoldiers(prev => prev.map(...))`
