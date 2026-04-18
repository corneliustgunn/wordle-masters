import ScoreBadge from './ScoreBadge.jsx';
import { formatTotal } from '../../utils/scoreCalc.js';

export default function LeaderboardRow({ entry, isLeader, holes }) {
  const { rank, golfer, totalRelativeToPar, breakdown } = entry;
  const totalStr = formatTotal(totalRelativeToPar);

  let totalClass = 'lb-row__total';
  if (totalRelativeToPar < 0) totalClass += ' lb-row__total--under';
  else if (totalRelativeToPar > 0) totalClass += ' lb-row__total--over';
  else totalClass += ' lb-row__total--even';

  return (
    <tr className={`lb-row${isLeader ? ' lb-row--leader' : ''}`}>
      <td className="lb-row__rank">{rank}</td>
      <td className="lb-row__name">{golfer.name}</td>
      <td className={totalClass}>{totalStr}</td>
      {breakdown.map(({ holeNumber, raw, relativeToPar }) => (
        <td key={holeNumber} className="lb-row__hole">
          <ScoreBadge raw={raw} relativeToPar={relativeToPar} />
        </td>
      ))}
      {/* Fill blanks for holes this golfer has no breakdown entry for */}
      {holes.slice(breakdown.length).map(h => (
        <td key={h.number} className="lb-row__hole">
          <ScoreBadge raw={null} relativeToPar={3} />
        </td>
      ))}
    </tr>
  );
}
