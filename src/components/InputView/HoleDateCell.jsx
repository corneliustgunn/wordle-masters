import { formatDisplayDate } from '../../utils/dateUtils.js';

export default function HoleDateCell({ holeNumber, date, onChange }) {
  return (
    <th className="score-grid__date-cell">
      <div className="hole-date-cell">
        <input
          type="date"
          className="hole-date-input"
          value={date ?? ''}
          onChange={e => onChange(holeNumber, e.target.value)}
          title={`Hole ${holeNumber} date`}
        />
        {date && (
          <span className="hole-date-display">{formatDisplayDate(date)}</span>
        )}
      </div>
    </th>
  );
}
