# Dice Roller

A mobile-first dice rolling PWA for tabletop gaming. Build a dice pool by selecting dice types, roll them, and restore previous rolls from history.

## Features

- **Dice Pool Builder**: Add D4, D6, D8, D10, D12, and D20 dice to your pool
- **Roll History**: View previous rolls and click to restore that dice set
- **Mobile-First**: Swipe gestures for adding/removing dice on touch devices
- **PWA Support**: Install as an app on your device for offline use

## Tech Stack

- TypeScript
- React
- Vite
- Plain CSS (mobile-first approach)

## Getting Started

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Usage

### Adding Dice
- **Mobile**: Swipe right on a dice type in the left sidebar
- **Desktop**: Click on a dice type to add it to the pool

### Removing Dice
- **Mobile**: Drag or flick a die out of the pool area
- **Desktop**: Right-click or double-click a die to remove it

### Rolling
- Tap the Roll button to roll all dice in the pool
- Results appear on each die and are saved to history

### History
- Click any history entry to restore that exact dice set
- Re-rolling creates a new history entry

## License

MIT
