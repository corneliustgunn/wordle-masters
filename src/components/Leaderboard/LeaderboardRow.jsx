import ScoreBadge from './ScoreBadge.jsx';
import { formatTotal } from '../../utils/scoreCalc.js';

function subtotalClass(rel) {
  if (rel < 0) return 'lb-row__subtotal lb-row__subtotal--under';
  if (rel > 0) return 'lb-row__subtotal lb-row__subtotal--over';
  return 'lb-row__subtotal lb-row__subtotal--even';
}

export default function LeaderboardRow({ entry, isLeader, showOut, showIn }) {
  const { rank, golfer, totalRelativeToPar, breakdown } = entry;

  const frontBreakdown = breakdown.filter(b => b.holeNumber <= 9);
  const backBreakdown  = breakdown.filter(b => b.holeNumber >= 10);
  const outTotal = frontBreakdown.reduce((sum, b) => sum + (b.relativeToPar ?? 0), 0);
  const inTotal  = backBreakdown.reduce((sum, b) => sum + (b.relativeToPar ?? 0), 0);

  let totalClass = 'lb-row__total';
  if (totalRelativeToPar < 0) totalClass += ' lb-row__total--under';
  else if (totalRelativeToPar > 0) totalClass += ' lb-row__total--over';
  else totalClass += ' lb-row__total--even';

  return (
    <tr className={`lb-row${isLeader ? ' lb-row--leader' : ''}`}>
      <td className="lb-row__rank">{rank}</td>
      <td className="lb-row__name">{golfer.name}</td>
      <td className={totalClass}>{formatTotal(totalRelativeToPar)}</td>
      {frontBreakdown.map(({ holeNumber, raw, relativeToPar }) => (
        <td key={holeNumber} className="lb-row__hole">
          <ScoreBadge raw={raw} relativeToPar={relativeToPar} />
        </td>
      ))}
      {showOut && (
        <td className={subtotalClass(outTotal)}>{formatTotal(outTotal)}</td>
      )}
      {backBreakdown.map(({ holeNumber, raw, relativeToPar }) => (
        <td key={holeNumber} className="lb-row__hole">
          <ScoreBadge raw={raw} relativeToPar={relativeToPar} />
        </td>
      ))}
      {showIn && (
        <td className={subtotalClass(inTotal)}>{formatTotal(inTotal)}</td>
      )}
    </tr>
  );
}
