import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { findMatchingScales, parseNoteInput } from '../engine/scaleEngine';
import { playTone } from '../utils/audio';
import { useMicPitch } from '../hooks/useMicPitch';
import { ScaleResult } from '../components/ScaleResult';
import { PlayedNotesBar } from '../components/PlayedNotesBar';

export function MicScaleFinder({ onBackHome }) {
  const [playedPcs, setPlayedPcs] = useState([]);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [inspectedScaleId, setInspectedScaleId] = useState(null);
  const [lastCapturedNote, setLastCapturedNote] = useState(null);

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

  const handleNoteCaptured = useCallback((noteInfo) => {
    setLastCapturedNote(noteInfo.noteName);
    setPlayedPcs((prev) => {
      if (prev.includes(noteInfo.pc)) return prev;
      return [...prev, noteInfo.pc];
    });
    setInspectedScaleId(null);
  }, []);

  const {
    isListening,
    error,
    liveState,
    sensitivity,
    setSensitivity,
    startListening,
    stopListening
  } = useMicPitch({ onNoteCaptured: handleNoteCaptured });

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
    setLastCapturedNote(null);
  }, []);

  const handleLoadExample = useCallback((notesCsv) => {
    const unique = [];
    for (const token of notesCsv.split(',')) {
      const pc = parseNoteInput(token);
      if (pc !== null && !unique.includes(pc)) {
        unique.push(pc);
      }
    }
    if (unique.length > 0) {
      setPlayedPcs(unique);
      setInspectedScaleId(null);
    }
  }, []);

  const handlePlayScale = useCallback((scaleObj) => {
    if (!scaleObj || !soundEnabledRef.current) return;
    const baseMidi = 60 + scaleObj.rootPc;
    const sequence = [...scaleObj.intervals, 12].map((iv) => baseMidi + iv);

    sequence.forEach((midi, idx) => {
      const id = window.setTimeout(() => {
        if (soundEnabledRef.current) {
          playTone(midi, 0.45);
        }
      }, idx * 230);
      timersRef.current.push(id);
    });
  }, []);

  const levelPct = Math.min(100, Math.round((liveState.rms / 0.14) * 100));
  const holdPct = Math.round(liveState.stabilityProgress * 100);
  const detected = liveState.detected;

  return (
    <>
      <header className="topbar">
        <div className="brand">
          <button
            className="btn btn-ghost back-btn"
            type="button"
            onClick={() => {
              stopListening();
              onBackHome();
            }}
            aria-label="Back to Home"
          >
            ← Home
          </button>
          <div>
            <h1>Find Scale by Mic</h1>
            <p className="subtitle">
              Play, hum, or sing 7 notes in any order into your microphone — we&apos;ll recognize
              the most beginner-friendly scale.
            </p>
          </div>
        </div>
        <div className="status-controls">
          <span className={`status-pill${isListening ? ' connected' : ''}`}>
            {isListening ? 'Mic: Listening' : 'Mic: Paused'}
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
          emptyBadge="Microphone ready"
          emptyTitle="Listen for 7 unique notes"
          emptyHint="Click Start Listening below and play an instrument, hum, or sing 7 notes in any order."
        />

        <PlayedNotesBar
          playedPcs={playedPcs}
          onRemovePitchClass={handleRemovePitchClass}
          onUndo={handleUndo}
          onClear={handleClear}
          showTextInput={false}
        />

        <section className="mic-panel" aria-label="Microphone pitch listener">
          <div className="mic-panel-top">
            <div className="mic-controls-left">
              {!isListening ? (
                <button className="btn btn-accent mic-main-btn" type="button" onClick={startListening}>
                  🎙 Start Listening
                </button>
              ) : (
                <button className="btn mic-stop-btn" type="button" onClick={stopListening}>
                  ⏹ Pause Mic
                </button>
              )}
              {lastCapturedNote && (
                <span className="mic-last-note">
                  Last captured: <strong>{lastCapturedNote}</strong>
                </span>
              )}
            </div>

            <label className="mic-sensitivity">
              <span>Noise gate</span>
              <input
                type="range"
                min="0.005"
                max="0.05"
                step="0.005"
                value={sensitivity}
                onChange={(e) => setSensitivity(Number(e.target.value))}
                aria-label="Microphone noise gate threshold"
              />
            </label>
          </div>

          {error && (
            <div className="mic-error" role="alert">
              {error}
            </div>
          )}

          <div className="mic-tuner-grid">
            <div className="mic-tuner-box">
              <span className="mic-box-label">Currently Heard Note</span>
              <div className="mic-heard-note">
                {detected ? detected.noteName : isListening ? '—' : 'Off'}
              </div>
              <span className="mic-heard-meta">
                {detected
                  ? `${detected.freq.toFixed(1)} Hz (${detected.cents >= 0 ? '+' : ''}${detected.cents} cents)`
                  : isListening
                    ? 'Play or hold a steady note'
                    : 'Press Start Listening to begin'}
              </span>
            </div>

            <div className="mic-meters-box">
              <div className="meter-row">
                <div className="meter-label-row">
                  <span>Mic Input Level</span>
                  <span>{levelPct}%</span>
                </div>
                <div className="meter-track">
                  <div className="meter-fill meter-level" style={{ width: `${levelPct}%` }} />
                </div>
              </div>

              <div className="meter-row">
                <div className="meter-label-row">
                  <span>Note Lock-in Stability</span>
                  <span>{holdPct}%</span>
                </div>
                <div className="meter-track">
                  <div className="meter-fill meter-hold" style={{ width: `${holdPct}%` }} />
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}

