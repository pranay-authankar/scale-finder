import React from 'react';

const EXAMPLES = [
  { label: 'C Major (scrambled)', notes: 'C,E,G,B,D,F,A' },
  { label: 'D Major', notes: 'F#,D,A,E,B,C#,G' },
  { label: 'A Harmonic Minor', notes: 'G#,A,B,C,D,E,F' },
  { label: 'Eb Major / C Minor', notes: 'Bb,Eb,Ab,C,D,F,G' }
];

export function ScaleResult({
  result,
  playedPcs,
  inspectedScaleId,
  onSelectScale,
  onPlayScale,
  onLoadExample,
  emptyBadge = 'Ready to listen',
  emptyTitle = 'Play any 7 unique notes',
  emptyHint = null
}) {
  const { noteCount, matchType, primary, allMatches } = result;

  if (noteCount === 0) {
    return (
      <section className="result-card" aria-live="polite">
        <div className="result-empty">
          <div className="empty-badge">{emptyBadge}</div>
          <h2 className="empty-title">{emptyTitle}</h2>
          <p className="empty-hint">
            {emptyHint || (
              <>
                Click the piano keys below, use your computer keyboard (<code>A–K</code>,{' '}
                <code>W–U</code>), plug in a MIDI keyboard, or type notes.
              </>
            )}
          </p>
          <div className="quick-examples">
            <span className="examples-label">Try an example:</span>
            {EXAMPLES.map((example) => (
              <button
                key={example.label}
                className="chip-btn"
                type="button"
                onClick={() => onLoadExample(example.notes)}
              >
                {example.label}
              </button>
            ))}
          </div>
        </div>
      </section>
    );
  }

  const displayedScale =
    allMatches.find((match) => match.id === inspectedScaleId) || primary;

  if (!displayedScale) {
    return (
      <section className="result-card" aria-live="polite">
        <div className="result-populated">
          <div className="primary-header-row">
            <div className="badge-group">
              <span className="badge badge-partial">{noteCount} notes played</span>
              <span className="badge badge-neutral">No match</span>
            </div>
            <button className="btn btn-accent" type="button" disabled>
              ▶ Play Scale
            </button>
          </div>
          <h2 className="primary-scale-name">No standard scale found</h2>
          <p className="primary-scale-desc">
            Try adjusting or clearing one of the chromatic notes.
          </p>
        </div>
      </section>
    );
  }

  let statusBadgeClass = 'badge badge-partial';
  let statusBadgeText = `Closest Match (${noteCount} notes selected)`;

  if (matchType === 'exact') {
    statusBadgeClass = 'badge badge-primary';
    statusBadgeText =
      displayedScale.id === primary.id
        ? 'Most Beginner-Friendly Scale'
        : 'Selected Matching Scale';
  } else if (matchType === 'partial') {
    statusBadgeText = `Keep playing (${noteCount}/7 notes) — Top guess`;
  } else if (matchType === 'near') {
    statusBadgeText = 'Closest 7-Note Match (6/7 notes)';
  }

  const aliasText =
    displayedScale.aliases && displayedScale.aliases.length > 0
      ? ` (Also known as ${displayedScale.aliases.join(', ')})`
      : '';

  const selectedSet = new Set(playedPcs);
  const otherCandidates = allMatches.filter((m) => m.id !== displayedScale.id);

  return (
    <section className="result-card" aria-live="polite">
      <div className="result-populated">
        <div className="primary-header-row">
          <div className="badge-group">
            <span className={statusBadgeClass}>{statusBadgeText}</span>
            <span className="badge badge-neutral">{displayedScale.family}</span>
          </div>
          <button
            className="btn btn-accent"
            type="button"
            onClick={() => onPlayScale(displayedScale)}
          >
            ▶ Play Scale
          </button>
        </div>

        <h2 className="primary-scale-name">{displayedScale.fullName}</h2>
        <p className="primary-scale-desc">
          {displayedScale.description}
          {aliasText}
        </p>

        <div className="scale-notes-row" aria-label="Scale notes in order">
          {displayedScale.notes.map((noteName, index) => {
            const pc = displayedScale.scalePcs[index];
            const classes = ['scale-note-pill'];
            if (index === 0) classes.push('is-root');
            if (!selectedSet.has(pc)) classes.push('is-missing');
            return (
              <span key={`${noteName}-${index}`} className={classes.join(' ')}>
                {noteName}
              </span>
            );
          })}
        </div>

        {otherCandidates.length > 0 && (
          <div className="other-scales-section">
            <h3 className="other-scales-title">Other possible scales</h3>
            <div className="other-scales-list">
              {otherCandidates.slice(0, 12).map((candidate) => (
                <button
                  key={candidate.id}
                  type="button"
                  className="other-scale-chip"
                  onClick={() => onSelectScale(candidate.id)}
                >
                  {candidate.id === primary.id
                    ? `${candidate.fullName} (Most beginner-friendly)`
                    : candidate.fullName}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

