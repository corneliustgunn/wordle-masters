import GolferPanel from './GolferPanel.jsx';
import ScoreGrid from './ScoreGrid.jsx';
import './InputView.css';

export default function InputView({
  golfers, holes, scores,
  onAddGolfer, onUpdateGolfer, onDeleteGolfer,
  onSetScore, onSetHoleDate,
}) {
  return (
    <div className="input-view">
      <GolferPanel
        golfers={golfers}
        onAdd={onAddGolfer}
        onUpdate={onUpdateGolfer}
        onDelete={onDeleteGolfer}
      />
      <ScoreGrid
        golfers={golfers}
        holes={holes}
        scores={scores}
        onSetScore={onSetScore}
        onSetHoleDate={onSetHoleDate}
      />
    </div>
  );
}
