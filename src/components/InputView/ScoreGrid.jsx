import HoleDateCell from './HoleDateCell.jsx';
import ScoreCell from './ScoreCell.jsx';
import './ScoreGrid.css';

const MIN_HOLES = 4;
const MAX_HOLES = 30;

function getDisplayedHoles(holes, scores, golfers) {
  let maxUsed = 0;
  holes.forEach(h => { if (h.date) maxUsed = Math.max(maxUsed, h.number); });
  golfers.forEach(g => {
    const gs = scores[g.id] ?? {};
    Object.keys(gs).forEach(n => { maxUsed = Math.max(maxUsed, Number(n)); });
  });
  const displayCount = Math.min(Math.max(maxUsed + 1, MIN_HOLES), MAX_HOLES);
  return Array.from({ length: displayCount }, (_, i) => {
    const num = i + 1;
    return holes.find(h => h.number === num) ?? { number: num, date: null };
  });
}

export default function ScoreGrid({ golfers, holes, scores, onSetScore, onSetHoleDate }) {
  const displayedHoles = getDisplayedHoles(holes, scores, golfers);

  return (
    <div className="score-grid-wrapper card">
      <table className="score-grid">
        <thead>
          <tr>
            <th className="score-grid__name-header">Golfer</th>
            {displayedHoles.map(hole => (
              <th key={hole.number} className="score-grid__hole-header">
                {hole.number}
              </th>
            ))}
          </tr>
          <tr className="score-grid__date-row">
            <th className="score-grid__date-name-cell">
              <span className="score-grid__date-label">Date</span>
            </th>
            {displayedHoles.map(hole => (
              <HoleDateCell
                key={hole.number}
                holeNumber={hole.number}
                date={hole.date}
                onChange={onSetHoleDate}
              />
            ))}
          </tr>
        </thead>
        <tbody>
          {golfers.length === 0 ? (
            <tr>
              <td colSpan={displayedHoles.length + 1} className="score-grid__empty">
                Add golfers on the left to start scoring
              </td>
            </tr>
          ) : (
            golfers.map(golfer => {
              const golferScores = scores[golfer.id] ?? {};
              return (
                <tr key={golfer.id}>
                  <td className="score-grid__name-cell">{golfer.name}</td>
                  {displayedHoles.map(hole => (
                    <ScoreCell
                      key={hole.number}
                      golferId={golfer.id}
                      holeNumber={hole.number}
                      value={golferScores[hole.number] ?? null}
                      onChange={onSetScore}
                    />
                  ))}
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
}
