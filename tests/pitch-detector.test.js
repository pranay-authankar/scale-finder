import test from 'node:test';
import assert from 'node:assert/strict';
import { detectPitchYin, frequencyToNoteInfo } from '../src/utils/pitchDetector.js';

function createHarmonicBuffer(freq, sampleRate = 48000, length = 4096) {
  const buf = new Float32Array(length);
  for (let i = 0; i < length; i++) {
    const t = i / sampleRate;
    buf[i] =
      0.55 * Math.sin(2 * Math.PI * freq * t) +
      0.25 * Math.sin(2 * Math.PI * freq * 2 * t) +
      0.1 * Math.sin(2 * Math.PI * freq * 3 * t);
  }
  return buf;
}

test('frequencyToNoteInfo maps standard concert pitches accurately', () => {
  const a4 = frequencyToNoteInfo(440);
  assert.equal(a4.noteName, 'A4');
  assert.equal(a4.pc, 9);
  assert.equal(a4.cents, 0);

  const c4 = frequencyToNoteInfo(261.63);
  assert.equal(c4.noteName, 'C4');
  assert.equal(c4.pc, 0);
  assert.ok(Math.abs(c4.cents) <= 1);
});

test('detectPitchYin detects fundamental pitch even with strong harmonics', () => {
  const cases = [
    { freq: 261.63, expectedPc: 0, label: 'C4' },
    { freq: 329.63, expectedPc: 4, label: 'E4' },
    { freq: 392.0, expectedPc: 7, label: 'G4' },
    { freq: 440.0, expectedPc: 9, label: 'A4' },
    { freq: 146.83, expectedPc: 2, label: 'D3' }
  ];

  for (const c of cases) {
    const buf = createHarmonicBuffer(c.freq);
    const detected = detectPitchYin(buf, 48000);
    assert.ok(detected !== null, `Expected detection for ${c.label}`);
    assert.equal(detected.pc, c.expectedPc, `Expected pc ${c.expectedPc} for ${c.label}`);
    assert.ok(Math.abs(detected.cents) <= 5, `Expected accurate cents for ${c.label}`);
  }
});

test('detectPitchYin rejects silence and low-amplitude noise', () => {
  const silence = new Float32Array(4096);
  assert.equal(detectPitchYin(silence, 48000), null);

  const quietNoise = new Float32Array(4096);
  for (let i = 0; i < quietNoise.length; i++) {
    quietNoise[i] = 0.002 * Math.sin(i);
  }
  assert.equal(detectPitchYin(quietNoise, 48000), null);
});

