import { computeLeaderboard } from '../../utils/scoreCalc.js';
import { formatDisplayDate } from '../../utils/dateUtils.js';
import LeaderboardRow from './LeaderboardRow.jsx';
import './Leaderboard.css';

const MAX_HOLES = 18;
const MIN_HOLES = 4;

function getDisplayedHoles(holes, scores, golfers) {
  let maxUsed = 0;
  holes.forEach(h => { if (h.date) maxUsed = Math.max(maxUsed, h.number); });
  golfers.forEach(g => {
    const gs = scores[g.id] ?? {};
    Object.keys(gs).forEach(n => { maxUsed = Math.max(maxUsed, Number(n)); });
  });
  const displayCount = Math.min(Math.max(maxUsed, MIN_HOLES), MAX_HOLES);
  return Array.from({ length: displayCount }, (_, i) => {
    const num = i + 1;
    return holes.find(h => h.number === num) ?? { number: num, date: null };
  });
}

export default function Leaderboard({ golfers, holes, scores }) {
  const displayedHoles = getDisplayedHoles(holes, scores, golfers);
  const ranked = computeLeaderboard(golfers, displayedHoles, scores);

  const frontNine = displayedHoles.filter(h => h.number <= 9);
  const backNine  = displayedHoles.filter(h => h.number >= 10);
  const showOut = frontNine.length === 9;
  const showIn  = backNine.length > 0;

  return (
    <div className="leaderboard-container card">
      <div className="leaderboard-banner">
        <span className="leaderboard-banner__title">Masters Leaderboard</span>
        <span className="leaderboard-banner__subtitle">
          {displayedHoles.length} hole{displayedHoles.length !== 1 ? 's' : ''} &nbsp;·&nbsp; Par {displayedHoles.length * 4}
        </span>
      </div>

      {golfers.length === 0 ? (
        <div className="leaderboard-empty">
          No golfers yet — head to Scoring to add players and enter scores
        </div>
      ) : (
        <table className="leaderboard-table">
          <thead>
            <tr>
              <th className="th-rank">#</th>
              <th className="th-name">Player</th>
              <th className="th-total">Total</th>
              {frontNine.map(h => <th key={h.number}>{h.number}</th>)}
              {showOut && <th className="th-subtotal">Out</th>}
              {backNine.map(h => <th key={h.number}>{h.number}</th>)}
              {showIn && <th className="th-subtotal">In</th>}
            </tr>
            <tr className="leaderboard-date-row">
              <th className="th-rank"> </th>
              <th className="th-name"> </th>
              <th className="th-total"> </th>
              {frontNine.map(h => <th key={h.number}>{formatDisplayDate(h.date)}</th>)}
              {showOut && <th className="th-subtotal"> </th>}
              {backNine.map(h => <th key={h.number}>{formatDisplayDate(h.date)}</th>)}
              {showIn && <th className="th-subtotal"> </th>}
            </tr>
          </thead>
          <tbody>
            {ranked.map((entry, i) => (
              <LeaderboardRow
                key={entry.golfer.id}
                entry={entry}
                isLeader={i === 0}
                showOut={showOut}
                showIn={showIn}
              />
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
