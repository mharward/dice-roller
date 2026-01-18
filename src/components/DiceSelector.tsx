import { useRef, useCallback } from 'react';
import './DiceSelector.css';
import { DICE_TYPES, DieType } from '../utils/dice';

interface DiceSelectorProps {
  onAddDie: (type: DieType) => void;
}

const SWIPE_THRESHOLD = 50;

// SVG dice shapes that look 3D
const DiceShapes: Record<DieType, React.ReactNode> = {
  4: (
    // Tetrahedron - triangle with 3D shading
    <svg viewBox="0 0 100 100" preserveAspectRatio="xMidYMid meet" className="dice-selector__shape">
      <defs>
        <linearGradient id="d4-left" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#1a1a40" />
          <stop offset="100%" stopColor="#2a2a5a" />
        </linearGradient>
        <linearGradient id="d4-right" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#3a3a7a" />
          <stop offset="100%" stopColor="#2a2a5a" />
        </linearGradient>
      </defs>
      <polygon points="50,10 10,90 50,70" fill="url(#d4-left)" />
      <polygon points="50,10 90,90 50,70" fill="url(#d4-right)" />
      <polygon points="10,90 90,90 50,70" fill="#252550" />
      <polygon points="50,10 10,90 90,90" fill="none" stroke="#6a6aaa" strokeWidth="2" />
      <line x1="50" y1="10" x2="50" y2="70" stroke="#4a4a8a" strokeWidth="1" />
      <text x="50" y="58" textAnchor="middle" className="dice-selector__text">D4</text>
    </svg>
  ),
  6: (
    // Cube - 3D box view (taller)
    <svg viewBox="0 0 100 100" preserveAspectRatio="xMidYMid meet" className="dice-selector__shape">
      <defs>
        <linearGradient id="d6-top" x1="0%" y1="100%" x2="0%" y2="0%">
          <stop offset="0%" stopColor="#3a3a7a" />
          <stop offset="100%" stopColor="#4a4a9a" />
        </linearGradient>
        <linearGradient id="d6-left" x1="100%" y1="0%" x2="0%" y2="0%">
          <stop offset="0%" stopColor="#252550" />
          <stop offset="100%" stopColor="#1a1a40" />
        </linearGradient>
        <linearGradient id="d6-right" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#2a2a5a" />
          <stop offset="100%" stopColor="#202048" />
        </linearGradient>
      </defs>
      {/* Top face */}
      <polygon points="50,8 88,28 50,48 12,28" fill="url(#d6-top)" />
      {/* Left face */}
      <polygon points="12,28 50,48 50,92 12,72" fill="url(#d6-left)" />
      {/* Right face */}
      <polygon points="88,28 50,48 50,92 88,72" fill="url(#d6-right)" />
      {/* Edges */}
      <polygon points="50,8 88,28 50,48 12,28" fill="none" stroke="#6a6aaa" strokeWidth="1.5" />
      <polygon points="12,28 50,48 50,92 12,72" fill="none" stroke="#6a6aaa" strokeWidth="1.5" />
      <polygon points="88,28 50,48 50,92 88,72" fill="none" stroke="#6a6aaa" strokeWidth="1.5" />
      <text x="50" y="38" textAnchor="middle" className="dice-selector__text">D6</text>
    </svg>
  ),
  8: (
    // Octahedron - diamond with 3D faces
    <svg viewBox="0 0 100 100" preserveAspectRatio="xMidYMid meet" className="dice-selector__shape">
      <defs>
        <linearGradient id="d8-tl" x1="100%" y1="100%" x2="0%" y2="0%">
          <stop offset="0%" stopColor="#3a3a7a" />
          <stop offset="100%" stopColor="#4a4a9a" />
        </linearGradient>
        <linearGradient id="d8-tr" x1="0%" y1="100%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#2a2a5a" />
          <stop offset="100%" stopColor="#3a3a7a" />
        </linearGradient>
        <linearGradient id="d8-bl" x1="100%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#252550" />
          <stop offset="100%" stopColor="#1a1a40" />
        </linearGradient>
        <linearGradient id="d8-br" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#202048" />
          <stop offset="100%" stopColor="#181838" />
        </linearGradient>
      </defs>
      <polygon points="50,8 15,50 50,55" fill="url(#d8-tl)" />
      <polygon points="50,8 85,50 50,55" fill="url(#d8-tr)" />
      <polygon points="50,92 15,50 50,55" fill="url(#d8-bl)" />
      <polygon points="50,92 85,50 50,55" fill="url(#d8-br)" />
      <polygon points="50,8 85,50 50,92 15,50" fill="none" stroke="#6a6aaa" strokeWidth="2" />
      <line x1="15" y1="50" x2="85" y2="50" stroke="#4a4a8a" strokeWidth="1" />
      <text x="50" y="56" textAnchor="middle" className="dice-selector__text">D8</text>
    </svg>
  ),
  10: (
    // Pentagonal trapezohedron - gem/crystal shape, flatter profile
    <svg viewBox="0 0 100 100" preserveAspectRatio="xMidYMid meet" className="dice-selector__shape">
      <defs>
        <linearGradient id="d10-top" x1="0%" y1="100%" x2="0%" y2="0%">
          <stop offset="0%" stopColor="#3a3a7a" />
          <stop offset="100%" stopColor="#4a4a9a" />
        </linearGradient>
        <linearGradient id="d10-left" x1="100%" y1="0%" x2="0%" y2="50%">
          <stop offset="0%" stopColor="#2a2a5a" />
          <stop offset="100%" stopColor="#1a1a40" />
        </linearGradient>
        <linearGradient id="d10-right" x1="0%" y1="0%" x2="100%" y2="50%">
          <stop offset="0%" stopColor="#353570" />
          <stop offset="100%" stopColor="#252550" />
        </linearGradient>
      </defs>
      {/* Top point to wide middle */}
      <polygon points="50,10 12,45 50,50" fill="url(#d10-left)" />
      <polygon points="50,10 88,45 50,50" fill="url(#d10-top)" />
      {/* Wide middle to bottom point */}
      <polygon points="12,45 50,50 12,55" fill="#2a2a5a" />
      <polygon points="88,45 50,50 88,55" fill="#323265" />
      <polygon points="12,55 50,50 50,90" fill="#1a1a40" />
      <polygon points="88,55 50,50 50,90" fill="url(#d10-right)" />
      {/* Outline */}
      <polygon points="50,10 88,45 88,55 50,90 12,55 12,45" fill="none" stroke="#6a6aaa" strokeWidth="2" />
      <line x1="50" y1="10" x2="50" y2="50" stroke="#4a4a8a" strokeWidth="1" />
      <line x1="12" y1="45" x2="88" y2="55" stroke="#4a4a8a" strokeWidth="1" />
      <line x1="12" y1="55" x2="88" y2="45" stroke="#4a4a8a" strokeWidth="1" />
      <line x1="50" y1="50" x2="50" y2="90" stroke="#4a4a8a" strokeWidth="1" />
      <text x="50" y="56" textAnchor="middle" className="dice-selector__text">D10</text>
    </svg>
  ),
  12: (
    // Dodecahedron - pentagon with 3D depth
    <svg viewBox="0 0 100 100" preserveAspectRatio="xMidYMid meet" className="dice-selector__shape">
      <defs>
        <linearGradient id="d12-main" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#3a3a7a" />
          <stop offset="100%" stopColor="#252550" />
        </linearGradient>
      </defs>
      {/* Main pentagon face */}
      <polygon points="50,10 90,40 75,85 25,85 10,40" fill="url(#d12-main)" />
      {/* Inner pentagon for depth */}
      <polygon points="50,25 72,45 65,72 35,72 28,45" fill="#2a2a5a" />
      {/* Connecting lines for 3D effect */}
      <line x1="50" y1="10" x2="50" y2="25" stroke="#4a4a8a" strokeWidth="1.5" />
      <line x1="90" y1="40" x2="72" y2="45" stroke="#4a4a8a" strokeWidth="1.5" />
      <line x1="75" y1="85" x2="65" y2="72" stroke="#4a4a8a" strokeWidth="1.5" />
      <line x1="25" y1="85" x2="35" y2="72" stroke="#4a4a8a" strokeWidth="1.5" />
      <line x1="10" y1="40" x2="28" y2="45" stroke="#4a4a8a" strokeWidth="1.5" />
      {/* Outer edge */}
      <polygon points="50,10 90,40 75,85 25,85 10,40" fill="none" stroke="#6a6aaa" strokeWidth="2" />
      <text x="50" y="58" textAnchor="middle" className="dice-selector__text">D12</text>
    </svg>
  ),
  20: (
    // Icosahedron - vertex view showing 5 triangular faces in pentagonal arrangement
    <svg viewBox="0 0 100 100" preserveAspectRatio="xMidYMid meet" className="dice-selector__shape">
      <defs>
        <linearGradient id="d20-1" x1="50%" y1="100%" x2="50%" y2="0%">
          <stop offset="0%" stopColor="#3a3a7a" />
          <stop offset="100%" stopColor="#4a4a9a" />
        </linearGradient>
        <linearGradient id="d20-2" x1="0%" y1="50%" x2="100%" y2="50%">
          <stop offset="0%" stopColor="#2a2a5a" />
          <stop offset="100%" stopColor="#3a3a7a" />
        </linearGradient>
        <linearGradient id="d20-3" x1="100%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#252550" />
          <stop offset="100%" stopColor="#1a1a40" />
        </linearGradient>
      </defs>
      {/* Pentagon vertices (outer) at ~r=45 from center */}
      {/* Top: 50,7  TopRight: 93,35  BottomRight: 77,88  BottomLeft: 23,88  TopLeft: 7,35 */}
      {/* Inner pentagon vertices at ~r=22 from center */}
      {/* Top: 50,28  TopRight: 71,42  BottomRight: 63,68  BottomLeft: 37,68  TopLeft: 29,42 */}

      {/* 5 triangular faces meeting at center (viewed from vertex) */}
      {/* Top triangle */}
      <polygon points="50,50 50,7 93,35" fill="url(#d20-1)" />
      {/* Top-right triangle */}
      <polygon points="50,50 93,35 77,88" fill="url(#d20-2)" />
      {/* Bottom-right triangle */}
      <polygon points="50,50 77,88 23,88" fill="#252550" />
      {/* Bottom-left triangle */}
      <polygon points="50,50 23,88 7,35" fill="url(#d20-3)" />
      {/* Top-left triangle */}
      <polygon points="50,50 7,35 50,7" fill="#2d2d60" />

      {/* Outer pentagon outline */}
      <polygon points="50,7 93,35 77,88 23,88 7,35" fill="none" stroke="#6a6aaa" strokeWidth="2" />
      {/* Lines from center to vertices */}
      <line x1="50" y1="50" x2="50" y2="7" stroke="#5a5a9a" strokeWidth="1.5" />
      <line x1="50" y1="50" x2="93" y2="35" stroke="#5a5a9a" strokeWidth="1.5" />
      <line x1="50" y1="50" x2="77" y2="88" stroke="#5a5a9a" strokeWidth="1.5" />
      <line x1="50" y1="50" x2="23" y2="88" stroke="#5a5a9a" strokeWidth="1.5" />
      <line x1="50" y1="50" x2="7" y2="35" stroke="#5a5a9a" strokeWidth="1.5" />
      <text x="50" y="56" textAnchor="middle" className="dice-selector__text">D20</text>
    </svg>
  ),
};

function DiceSelector({ onAddDie }: DiceSelectorProps) {
  const touchStartX = useRef<number>(0);
  const activeElement = useRef<HTMLElement | null>(null);

  const handleTouchStart = useCallback((e: React.TouchEvent<HTMLButtonElement>) => {
    touchStartX.current = e.touches[0].clientX;
    activeElement.current = e.currentTarget;
  }, []);

  const handleTouchMove = useCallback((e: React.TouchEvent<HTMLButtonElement>) => {
    if (!activeElement.current) return;

    const deltaX = e.touches[0].clientX - touchStartX.current;
    if (deltaX > SWIPE_THRESHOLD / 2) {
      activeElement.current.classList.add('dice-selector__item--swiping');
    } else {
      activeElement.current.classList.remove('dice-selector__item--swiping');
    }
  }, []);

  const handleTouchEnd = useCallback((type: DieType) => (e: React.TouchEvent<HTMLButtonElement>) => {
    if (!activeElement.current) return;

    const touch = e.changedTouches[0];
    const deltaX = touch.clientX - touchStartX.current;

    activeElement.current.classList.remove('dice-selector__item--swiping');

    if (deltaX >= SWIPE_THRESHOLD) {
      onAddDie(type);
    }

    activeElement.current = null;
  }, [onAddDie]);

  const handleClick = useCallback((type: DieType) => () => {
    onAddDie(type);
  }, [onAddDie]);

  return (
    <div className="dice-selector">
      {DICE_TYPES.map(type => (
        <button
          key={type}
          className="dice-selector__item"
          onClick={handleClick(type)}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd(type)}
        >
          {DiceShapes[type]}
        </button>
      ))}
    </div>
  );
}

export default DiceSelector;
