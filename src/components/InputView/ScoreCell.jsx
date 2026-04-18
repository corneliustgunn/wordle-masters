export default function ScoreCell({ golferId, holeNumber, value, onChange }) {
  function handleChange(e) {
    const raw = e.target.value;
    if (raw === '') {
      onChange(golferId, holeNumber, '');
      return;
    }
    const n = parseInt(raw, 10);
    if (!isNaN(n) && n >= 1 && n <= 7) {
      onChange(golferId, holeNumber, n);
    }
  }

  const rel = value != null ? value - 4 : null;
  let cellClass = 'score-cell';
  if (value == null) cellClass += ' score-cell--empty';
  else if (rel < 0) cellClass += ' score-cell--under';
  else if (rel > 0) cellClass += ' score-cell--over';
  else cellClass += ' score-cell--even';

  return (
    <td className={cellClass}>
      <input
        type="number"
        className="score-cell__input"
        min="1"
        max="7"
        value={value ?? ''}
        onChange={handleChange}
        placeholder="—"
      />
    </td>
  );
}
