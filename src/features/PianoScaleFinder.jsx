import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { findMatchingScales, parseNoteInput } from '../engine/scaleEngine';
import { playTone } from '../utils/audio';
import { useMidi } from '../hooks/useMidi';
import { ScaleResult } from '../components/ScaleResult';
import { PlayedNotesBar } from '../components/PlayedNotesBar';
import { PianoKeyboard, SHORTCUT_TO_KEY } from '../components/PianoKeyboard';

export function PianoScaleFinder({ onBackHome }) {
  const [playedPcs, setPlayedPcs] = useState([]);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [showShortcuts, setShowShortcuts] = useState(true);
  const [inspectedScaleId, setInspectedScaleId] = useState(null);
  const [activeMidis, setActiveMidis] = useState(() => new Set());

  const noteInputRef = useRef(null);
  const soundEnabledRef = useRef(soundEnabled);
  soundEnabledRef.current = soundEnabled;
  const timersRef = useRef([]);

  useEffect(() => {
    return () => {
      for (const id of timersRef.current) {
        window.clearTimeout(id);
      }
    };
  }, []);

  const flashKey = useCallback((midi) => {
    setActiveMidis((prev) => {
      const next = new Set(prev);
      next.add(midi);
      return next;
    });
    const id = window.setTimeout(() => {
      setActiveMidis((prev) => {
        if (!prev.has(midi)) return prev;
        const next = new Set(prev);
        next.delete(midi);
        return next;
      });
    }, 180);
    timersRef.current.push(id);
  }, []);

  const addPitchClass = useCallback(
    (pc, midiForSound) => {
      if (typeof midiForSound === 'number') {
        if (soundEnabledRef.current) {
          playTone(midiForSound);
        }
        flashKey(midiForSound);
      }

      setPlayedPcs((prev) => {
        if (prev.includes(pc)) return prev;
        return [...prev, pc];
      });
      setInspectedScaleId(null);
    },
    [flashKey]
  );

  const midiStatus = useMidi(addPitchClass);
  const result = useMemo(() => findMatchingScales(playedPcs), [playedPcs]);

  const handleRemovePitchClass = useCallback((pc) => {
    setPlayedPcs((prev) => prev.filter((item) => item !== pc));
    setInspectedScaleId(null);
  }, []);

  const handleUndo = useCallback(() => {
    setPlayedPcs((prev) => (prev.length > 0 ? prev.slice(0, -1) : prev));
    setInspectedScaleId(null);
  }, []);

  const handleClear = useCallback(() => {
    setPlayedPcs([]);
    setInspectedScaleId(null);
  }, []);

  const setPitchClassesFromTokens = useCallback((tokens) => {
    const unique = [];
    for (const token of tokens) {
      const pc = parseNoteInput(token);
      if (pc !== null && !unique.includes(pc)) {
        unique.push(pc);
      }
    }
    if (unique.length === 0) return false;
    setPlayedPcs(unique);
    setInspectedScaleId(null);
    return true;
  }, []);

  const handleSubmitTextNotes = useCallback(
    (rawText) => {
      const tokens = rawText.trim().split(/[\s,;]+/).filter(Boolean);
      return setPitchClassesFromTokens(tokens);
    },
    [setPitchClassesFromTokens]
  );

  const handleLoadExample = useCallback(
    (notesCsv) => {
      setPitchClassesFromTokens(notesCsv.split(','));
    },
    [setPitchClassesFromTokens]
  );

  const handlePlayScale = useCallback(
    (scaleObj) => {
      if (!scaleObj) return;
      const baseMidi = 60 + scaleObj.rootPc;
      const sequence = [...scaleObj.intervals, 12].map((iv) => baseMidi + iv);

      sequence.forEach((midi, idx) => {
        const id = window.setTimeout(() => {
          if (soundEnabledRef.current) {
            playTone(midi, 0.45);
          }
          flashKey(midi);
        }, idx * 230);
        timersRef.current.push(id);
      });
    },
    [flashKey]
  );

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (document.activeElement === noteInputRef.current) return;
      if (e.ctrlKey || e.metaKey || e.altKey || e.repeat) return;

      if (e.key === 'Backspace') {
        e.preventDefault();
        handleUndo();
        return;
      }

      if (e.key === 'Escape') {
        handleClear();
        return;
      }

      const mapped = SHORTCUT_TO_KEY.get(e.key.toLowerCase());
      if (mapped) {
        e.preventDefault();
        addPitchClass(mapped.pc, mapped.midi);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [addPitchClass, handleClear, handleUndo]);

  return (
    <>
      <header className="topbar">
        <div className="brand">
          <button
            className="btn btn-ghost back-btn"
            type="button"
            onClick={onBackHome}
            aria-label="Back to Home"
          >
            ← Home
          </button>
          <div>
            <h1>Find Scale by Piano</h1>
            <p className="subtitle">
              Play 7 notes in any order — see the most beginner-friendly scale in big, and other
              matches in small.
            </p>
          </div>
        </div>
        <div className="status-controls">
          <span
            className={`status-pill${midiStatus.connected ? ' connected' : ''}`}
            title="Web MIDI status"
          >
            {midiStatus.text}
          </span>
          <button
            className="btn btn-ghost"
            type="button"
            aria-pressed={soundEnabled}
            onClick={() => setSoundEnabled((prev) => !prev)}
          >
            Sound: {soundEnabled ? 'On' : 'Off'}
          </button>
        </div>
      </header>

      <main className="main-content">
        <ScaleResult
          result={result}
          playedPcs={playedPcs}
          inspectedScaleId={inspectedScaleId}
          onSelectScale={setInspectedScaleId}
          onPlayScale={handlePlayScale}
          onLoadExample={handleLoadExample}
        />

        <PlayedNotesBar
          playedPcs={playedPcs}
          onRemovePitchClass={handleRemovePitchClass}
          onUndo={handleUndo}
          onClear={handleClear}
          onSubmitTextNotes={handleSubmitTextNotes}
          inputRef={noteInputRef}
        />

        <PianoKeyboard
          playedPcs={playedPcs}
          activeMidis={activeMidis}
          showShortcuts={showShortcuts}
          onToggleShowShortcuts={setShowShortcuts}
          onPlayKey={addPitchClass}
        />
      </main>
    </>
  );
}

