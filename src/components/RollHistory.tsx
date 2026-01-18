import './RollHistory.css';
import { HistoryEntry, getDieDisplayValue } from '../utils/dice';

interface RollHistoryProps {
  history: HistoryEntry[];
  onRestore: (entry: HistoryEntry) => void;
}

function formatTime(timestamp: number): string {
  const date = new Date(timestamp);
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

function RollHistory({ history, onRestore }: RollHistoryProps) {
  if (history.length === 0) {
    return null;
  }

  return (
    <div className="roll-history">
      {history.map(entry => (
        <button
          key={entry.id}
          className="history-item"
          onClick={() => onRestore(entry)}
        >
          <span className="history-item__total">{entry.total}</span>
          <div className="history-item__dice">
            {entry.dice.map(die => (
              <span key={die.id} className="history-item__die">
                {die.type === 100 ? 'D%' : `D${die.type}`}:{getDieDisplayValue(die)}
              </span>
            ))}
          </div>
          <span className="history-item__time">{formatTime(entry.timestamp)}</span>
        </button>
      ))}
    </div>
  );
}

export default RollHistory;
