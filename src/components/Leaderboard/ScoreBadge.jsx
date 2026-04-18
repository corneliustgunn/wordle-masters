export default function ScoreBadge({ raw, relativeToPar }) {
  if (raw === null) {
    return <span className="score-badge score-badge--missing">—</span>;
  }
  let mod = '';
  if (relativeToPar < 0) mod = 'score-badge--under';
  else if (relativeToPar > 0) mod = 'score-badge--over';
  else mod = 'score-badge--even';

  return <span className={`score-badge ${mod}`}>{raw}</span>;
}
