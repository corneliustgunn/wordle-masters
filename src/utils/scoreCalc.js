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
  // A hole is only "in play" if at least one golfer has entered a score for it.
  // Holes with no scores at all don't count toward anyone's total.
  const activeHoleNumbers = new Set(
    holes
      .filter(hole => golfers.some(g => (scores[g.id] ?? {})[hole.number] != null))
      .map(h => h.number)
  );

  const ranked = golfers.map(golfer => {
    const golferScores = scores[golfer.id] ?? {};
    let total = 0;
    const breakdown = holes.map(hole => {
      const raw = golferScores[hole.number] ?? null;
      if (!activeHoleNumbers.has(hole.number)) {
        return { holeNumber: hole.number, raw: null, relativeToPar: null };
      }
      const rel = holeRelativeToPar(raw);
      total += rel;
      return { holeNumber: hole.number, raw, relativeToPar: rel };
    });
    return { golfer, totalRelativeToPar: total, breakdown };
  });

  ranked.sort((a, b) => a.totalRelativeToPar - b.totalRelativeToPar);

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
