import { useState, useRef } from 'react';
import './GolferPanel.css';

export default function GolferPanel({ golfers, onAdd, onUpdate, onDelete }) {
  const [newName, setNewName] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editName, setEditName] = useState('');
  const addInputRef = useRef(null);

  function handleAdd(e) {
    e.preventDefault();
    if (!newName.trim()) return;
    onAdd(newName);
    setNewName('');
    addInputRef.current?.focus();
  }

  function startEdit(golfer) {
    setEditingId(golfer.id);
    setEditName(golfer.name);
  }

  function commitEdit(id) {
    if (editName.trim()) onUpdate(id, editName);
    setEditingId(null);
  }

  function handleEditKey(e, id) {
    if (e.key === 'Enter') commitEdit(id);
    if (e.key === 'Escape') setEditingId(null);
  }

  return (
    <div className="golfer-panel card">
      <h2 className="golfer-panel__title">Golfers</h2>
      <div className="golfer-panel__list">
        {golfers.length === 0 && (
          <span className="golfer-panel__empty">No golfers yet — add one below</span>
        )}
        {golfers.map((golfer, i) => (
          <div className="golfer-row" key={golfer.id}>
            <span className="golfer-row__number">{i + 1}.</span>
            {editingId === golfer.id ? (
              <input
                className="golfer-row__input"
                value={editName}
                onChange={e => setEditName(e.target.value)}
                onBlur={() => commitEdit(golfer.id)}
                onKeyDown={e => handleEditKey(e, golfer.id)}
                autoFocus
              />
            ) : (
              <span
                className="golfer-row__name"
                onClick={() => startEdit(golfer)}
                title="Click to edit"
              >
                {golfer.name}
              </span>
            )}
            <div className="golfer-row__actions">
              {editingId !== golfer.id && (
                <button className="btn btn--ghost btn--sm" onClick={() => startEdit(golfer)}>
                  Edit
                </button>
              )}
              <button
                className="btn btn--danger btn--sm"
                onClick={() => onDelete(golfer.id)}
              >
                ✕
              </button>
            </div>
          </div>
        ))}
      </div>
      <form className="golfer-add-form" onSubmit={handleAdd}>
        <input
          ref={addInputRef}
          className="golfer-add-form__input"
          placeholder="Golfer name…"
          value={newName}
          onChange={e => setNewName(e.target.value)}
        />
        <button type="submit" className="btn btn--primary">Add</button>
      </form>
    </div>
  );
}
