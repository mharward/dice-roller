import { useRef } from 'react';
import './DicePool.css';
import Die from './Die';
import { PoolDie, calculateTotal } from '../utils/dice';

interface DicePoolProps {
  dice: PoolDie[];
  onRemoveDie: (id: string) => void;
  onRoll: () => void;
  onClear: () => void;
  showRollButton: boolean;
}

function DicePool({ dice, onRemoveDie, onRoll, onClear, showRollButton }: DicePoolProps) {
  const poolRef = useRef<HTMLDivElement>(null);

  const hasRolledDice = dice.some(d => d.value !== null);
  const total = calculateTotal(dice);

  return (
    <div className="dice-pool">
      <div className="dice-pool__area" ref={poolRef}>
        {dice.length === 0 ? (
          <div className="dice-pool__empty">
            Tap a die type on the left to add it to your pool
          </div>
        ) : (
          dice.map(die => (
            <Die key={die.id} die={die} onRemove={onRemoveDie} poolRef={poolRef} />
          ))
        )}
      </div>

      {hasRolledDice && (
        <div className="dice-pool__total">
          Total: <span className="dice-pool__total-value">{total}</span>
        </div>
      )}

      {showRollButton && (
        <div className="dice-pool__actions">
          <button
            className="dice-pool__button dice-pool__button--roll"
            onClick={onRoll}
            disabled={dice.length === 0}
          >
            Roll {dice.length > 0 && `(${dice.length})`}
          </button>
          {dice.length > 0 && (
            <button
              className="dice-pool__button dice-pool__button--clear"
              onClick={onClear}
            >
              Clear
            </button>
          )}
        </div>
      )}
    </div>
  );
}

export default DicePool;
