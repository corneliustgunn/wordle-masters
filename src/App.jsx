import { useState } from 'react';
import { useAppStore } from './store/useAppStore.js';
import InputView from './components/InputView/InputView.jsx';
import Leaderboard from './components/Leaderboard/Leaderboard.jsx';

export default function App() {
  const [activeView, setActiveView] = useState('input');
  const store = useAppStore();

  return (
    <>
      <header className="app-header">
        <div className="app-header__brand">
          <span className="app-header__title">Wordle Masters</span>
          <span className="app-header__subtitle">Augusta National Wordle Club</span>
        </div>
        <div className="app-header__controls">
          <button
            className={`nav-btn${activeView === 'input' ? ' nav-btn--active' : ''}`}
            onClick={() => setActiveView('input')}
          >
            Scoring
          </button>
          <button
            className={`nav-btn${activeView === 'leaderboard' ? ' nav-btn--active' : ''}`}
            onClick={() => setActiveView('leaderboard')}
          >
            Leaderboard
          </button>
          <button className="nav-btn nav-btn--danger" onClick={store.clearAll}>
            Clear All
          </button>
        </div>
      </header>
      <main className="app-content">
        {activeView === 'input' ? (
          <InputView
            golfers={store.golfers}
            holes={store.holes}
            scores={store.scores}
            onAddGolfer={store.addGolfer}
            onUpdateGolfer={store.updateGolfer}
            onDeleteGolfer={store.deleteGolfer}
            onSetScore={store.setScore}
            onSetHoleDate={store.setHoleDate}
          />
        ) : (
          <Leaderboard
            golfers={store.golfers}
            holes={store.holes}
            scores={store.scores}
          />
        )}
      </main>
    </>
  );
}
