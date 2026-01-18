# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

A mobile-first dice rolling app for tabletop gaming. Users build a dice pool by swiping right on dice types (D4 through D20), roll them, and can restore previous rolls from history.

## Tech Stack

- TypeScript
- React
- Vite
- Plain CSS (mobile-first approach)

## Commands

```bash
npm install          # Install dependencies
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint
```

## Architecture

- **Dice Selector**: Left sidebar showing D4, D6, D8, D10, D12, D20 options
- **Dice Pool**: Center area where active dice are displayed and rolled
- **Roll History**: Bottom section showing previous rolls; clicking restores that dice set
- **Interactions**:
  - Mobile: Swipe right on dice type to add to pool; drag/flick dice out to remove
  - Desktop: Click to add; right-click, double-click, or X button to remove
  - Roll button only appears once dice are in the pool
  - Clicking history restores that dice set; re-rolling creates new history entry

## Deployment

Deployed as a PWA via Netlify. Config in `netlify.toml`.
