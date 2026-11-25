import React, { useState } from 'react';
import { formatPitchClassLabel } from '../engine/scaleEngine';

export function PlayedNotesBar({
  playedPcs,
  onRemovePitchClass,
  onUndo,
  onClear,
  onSubmitTextNotes,
  inputRef,
  showTextInput = true
}) {
  const [textValue, setTextValue] = useState('');
  const count = playedPcs.length;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!textValue.trim()) return;
    const applied = onSubmitTextNotes(textValue);
    if (applied) {
      setTextValue('');
    }
  };

  return (
    <section className="played-bar" aria-label="Played notes">
      <div className="played-bar-left">
        <span className="played-counter">
          Notes played: <strong>{count} / 7</strong>
        </span>
        <div className="played-chips">
          {count === 0 ? (
            <span className="played-placeholder">No notes selected yet</span>
          ) : (
            playedPcs.map((pc) => {
              const label = formatPitchClassLabel(pc);
              return (
                <span key={pc} className="played-chip">
                  {label}
                  <button
                    type="button"
                    aria-label={`Remove ${label}`}
                    onClick={() => onRemovePitchClass(pc)}
                  >
                    ×
                  </button>
                </span>
              );
            })
          )}
        </div>
      </div>

      <div className="played-bar-actions">
        {showTextInput && (
          <form className="note-text-form" autoComplete="off" onSubmit={handleSubmit}>
            <input
              ref={inputRef}
              type="text"
              value={textValue}
              onChange={(e) => setTextValue(e.target.value)}
              placeholder="Type notes e.g. C D E F G A B"
              aria-label="Type note names separated by spaces or commas"
            />
            <button className="btn btn-ghost" type="submit">
              Set
            </button>
          </form>
        )}
        <button className="btn btn-ghost" type="button" disabled={count === 0} onClick={onUndo}>
          Undo
        </button>
        <button className="btn btn-ghost" type="button" disabled={count === 0} onClick={onClear}>
          Clear
        </button>
      </div>
    </section>
  );
}

