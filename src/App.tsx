import { useState, useCallback } from 'react';
import './App.css';
import DiceSelector from './components/DiceSelector';
import DicePool from './components/DicePool';
import RollHistory from './components/RollHistory';
import {
  PoolDie,
  HistoryEntry,
  DieType,
  createDie,
  rollPool,
  calculateTotal,
  generateId,
} from './utils/dice';

function App() {
  const [pool, setPool] = useState<PoolDie[]>([]);
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [hasRolled, setHasRolled] = useState(false);

  const addDie = useCallback((type: DieType) => {
    setPool(prev => [...prev, createDie(type)]);
  }, []);

  const removeDie = useCallback((id: string) => {
    setPool(prev => prev.filter(die => die.id !== id));
  }, []);

  const roll = useCallback(() => {
    if (pool.length === 0) return;

    const rolledPool = rollPool(pool);
    setPool(rolledPool);
    setHasRolled(true);

    const entry: HistoryEntry = {
      id: generateId(),
      dice: rolledPool,
      total: calculateTotal(rolledPool),
      timestamp: Date.now(),
    };
    setHistory(prev => [entry, ...prev].slice(0, 50));
  }, [pool]);

  const restoreFromHistory = useCallback((entry: HistoryEntry) => {
    const restoredPool = entry.dice.map(die => ({
      ...die,
      id: generateId(),
    }));
    setPool(restoredPool);
  }, []);

  const clearPool = useCallback(() => {
    setPool([]);
  }, []);

  return (
    <div className="app">
      <div className="app__selector">
        <DiceSelector onAddDie={addDie} />
      </div>
      <div className="app__main">
        <DicePool
          dice={pool}
          onRemoveDie={removeDie}
          onRoll={roll}
          onClear={clearPool}
          showRollButton={hasRolled || pool.length > 0}
        />
      </div>
      <div className="app__history">
        <RollHistory history={history} onRestore={restoreFromHistory} />
      </div>
    </div>
  );
}

export default App;
