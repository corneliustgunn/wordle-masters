const PAR = 4;
const MISSING_SCORE = 7;

export function holeRelativeToPar(rawScore) {
  const s = rawScore ?? MISSING_SCORE;
  return s - PAR;
}

export function formatTotal(n) {
  if (n === 0) return 'E';
  return n > 0 ? `+${n}` : `${n}`;
}

export function computeLeaderboard(golfers, holes, scores) {
  const ranked = golfers.map(golfer => {
    const golferScores = scores[golfer.id] ?? {};
    let total = 0;
    const breakdown = holes.map(hole => {
      const raw = golferScores[hole.number] ?? null;
      const rel = holeRelativeToPar(raw);
      total += rel;
      return { holeNumber: hole.number, raw, relativeToPar: rel };
    });
    return { golfer, totalRelativeToPar: total, breakdown };
  });

  ranked.sort((a, b) => a.totalRelativeToPar - b.totalRelativeToPar);

  // Assign ranks with ties
  let rank = 1;
  return ranked.map((entry, i) => {
    if (i > 0 && entry.totalRelativeToPar === ranked[i - 1].totalRelativeToPar) {
      // same rank as previous
    } else {
      rank = i + 1;
    }
    const isTied = ranked.filter(e => e.totalRelativeToPar === entry.totalRelativeToPar).length > 1;
    return { ...entry, rank: isTied ? `T${rank}` : `${rank}` };
  });
}
