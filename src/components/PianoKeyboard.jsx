import React, { useMemo } from 'react';

export const PIANO_KEYS = [
  { midi: 60, pc: 0, label: 'C', isBlack: false, shortcut: 'A' },
  { midi: 61, pc: 1, label: 'C#', isBlack: true, shortcut: 'W' },
  { midi: 62, pc: 2, label: 'D', isBlack: false, shortcut: 'S' },
  { midi: 63, pc: 3, label: 'D#', isBlack: true, shortcut: 'E' },
  { midi: 64, pc: 4, label: 'E', isBlack: false, shortcut: 'D' },
  { midi: 65, pc: 5, label: 'F', isBlack: false, shortcut: 'F' },
  { midi: 66, pc: 6, label: 'F#', isBlack: true, shortcut: 'T' },
  { midi: 67, pc: 7, label: 'G', isBlack: false, shortcut: 'G' },
  { midi: 68, pc: 8, label: 'G#', isBlack: true, shortcut: 'Y' },
  { midi: 69, pc: 9, label: 'A', isBlack: false, shortcut: 'H' },
  { midi: 70, pc: 10, label: 'A#', isBlack: true, shortcut: 'U' },
  { midi: 71, pc: 11, label: 'B', isBlack: false, shortcut: 'J' },
  { midi: 72, pc: 0, label: 'C', isBlack: false, shortcut: 'K' },
  { midi: 73, pc: 1, label: 'C#', isBlack: true, shortcut: 'O' },
  { midi: 74, pc: 2, label: 'D', isBlack: false, shortcut: 'L' },
  { midi: 75, pc: 3, label: 'D#', isBlack: true, shortcut: 'P' },
  { midi: 76, pc: 4, label: 'E', isBlack: false, shortcut: ';' },
  { midi: 77, pc: 5, label: 'F', isBlack: false, shortcut: "'" },
  { midi: 78, pc: 6, label: 'F#', isBlack: true, shortcut: '' },
  { midi: 79, pc: 7, label: 'G', isBlack: false, shortcut: '' },
  { midi: 80, pc: 8, label: 'G#', isBlack: true, shortcut: '' },
  { midi: 81, pc: 9, label: 'A', isBlack: false, shortcut: '' },
  { midi: 82, pc: 10, label: 'A#', isBlack: true, shortcut: '' },
  { midi: 83, pc: 11, label: 'B', isBlack: false, shortcut: '' }
];

export const SHORTCUT_TO_KEY = new Map(
  PIANO_KEYS.filter((k) => k.shortcut).map((k) => [k.shortcut.toLowerCase(), k])
);

export function PianoKeyboard({
  playedPcs,
  activeMidis,
  showShortcuts,
  onToggleShowShortcuts,
  onPlayKey
}) {
  const selectedSet = useMemo(() => new Set(playedPcs), [playedPcs]);

  const positionedKeys = useMemo(() => {
    const whiteCount = PIANO_KEYS.filter((k) => !k.isBlack).length;
    const whiteWidthPct = 100 / whiteCount;
    const blackWidthPct = whiteWidthPct * 0.62;
    let whiteIdx = 0;

    return PIANO_KEYS.map((key) => {
      if (!key.isBlack) {
        const left = `${whiteIdx * whiteWidthPct}%`;
        const width = `${whiteWidthPct}%`;
        whiteIdx++;
        return { ...key, left, width };
      }
      const left = `${whiteIdx * whiteWidthPct - blackWidthPct / 2}%`;
      const width = `${blackWidthPct}%`;
      return { ...key, left, width };
    });
  }, []);

  return (
    <section className="piano-section" aria-label="Interactive piano keyboard">
      <div className="piano-header">
        <span className="piano-tip">
          Click keys or press keyboard keys to play notes (order doesn&apos;t matter)
        </span>
        <label className="toggle-label">
          <input
            type="checkbox"
            checked={showShortcuts}
            onChange={(e) => onToggleShowShortcuts(e.target.checked)}
          />
          <span>Show keyboard shortcuts</span>
        </label>
      </div>

      <div className="piano-scroll">
        <div
          className={`piano-keyboard${showShortcuts ? '' : ' hide-shortcuts'}`}
          role="group"
          aria-label="2-octave piano"
        >
          {positionedKeys.map((key) => {
            const classes = [
              'piano-key',
              key.isBlack ? 'black' : 'white',
              selectedSet.has(key.pc) ? 'selected' : '',
              activeMidis.has(key.midi) ? 'active-press' : ''
            ]
              .filter(Boolean)
              .join(' ');

            return (
              <button
                key={key.midi}
                type="button"
                className={classes}
                style={{ left: key.left, width: key.width }}
                aria-label={`${key.label} note`}
                onPointerDown={(e) => {
                  e.preventDefault();
                  onPlayKey(key.pc, key.midi);
                }}
              >
                <span className="key-note-label">{key.label}</span>
                {key.shortcut && <span className="key-shortcut-label">{key.shortcut}</span>}
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}

