import { useRef, useCallback } from 'react';
import './DiceSelector.css';
import { DICE_TYPES, DieType } from '../utils/dice';

interface DiceSelectorProps {
  onAddDie: (type: DieType) => void;
}

const SWIPE_THRESHOLD = 50;

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
          D{type}
        </button>
      ))}
    </div>
  );
}

export default DiceSelector;
