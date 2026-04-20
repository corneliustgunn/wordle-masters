function getBadgeClass(relativeToPar) {
  if (relativeToPar <= -3) return 'score-badge--albatross';
  if (relativeToPar === -2) return 'score-badge--eagle';
  if (relativeToPar === -1) return 'score-badge--birdie';
  if (relativeToPar === 0)  return 'score-badge--par';
  if (relativeToPar === 1)  return 'score-badge--bogey';
  if (relativeToPar === 2)  return 'score-badge--double-bogey';
  return 'score-badge--triple-bogey';
}

export default function ScoreBadge({ raw, relativeToPar }) {
  // Inactive hole — not yet in play for anyone
  if (relativeToPar === null) {
    return <span className="score-badge score-badge--inactive">—</span>;
  }
  // Active but no score entered for this golfer → counts as 7
  const displayScore = raw ?? 7;
  return (
    <span className={`score-badge ${getBadgeClass(relativeToPar)}`}>
      {displayScore}
    </span>
  );
}
