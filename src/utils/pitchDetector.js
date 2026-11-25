import { SHARP_NAMES } from '../engine/scaleEngine.js';

/**
 * Converts a frequency in Hz to MIDI note, pitch class (0-11), note name, and cents offset.
 */
export function frequencyToNoteInfo(freq) {
  if (!Number.isFinite(freq) || freq <= 0) return null;
  const midiFloat = 69 + 12 * Math.log2(freq / 440);
  const midi = Math.round(midiFloat);
  if (midi < 21 || midi > 108) return null;

  const cents = Math.round((midiFloat - midi) * 100);
  const pc = ((midi % 12) + 12) % 12;
  const octave = Math.floor(midi / 12) - 1;
  const noteName = `${SHARP_NAMES[pc]}${octave}`;

  return {
    freq,
    midi,
    pc,
    octave,
    noteName,
    pitchLabel: SHARP_NAMES[pc],
    cents
  };
}

/**
 * Computes root-mean-square amplitude of a time-domain audio buffer.
 */
export function computeRms(buffer) {
  if (!buffer || buffer.length === 0) return 0;
  let sumSq = 0;
  for (let i = 0; i < buffer.length; i++) {
    const v = buffer[i];
    sumSq += v * v;
  }
  return Math.sqrt(sumSq / buffer.length);
}

/**
 * Detects fundamental pitch from a time-domain buffer using the YIN algorithm
 * with cumulative mean normalized difference and parabolic interpolation.
 *
 * Returns { freq, clarity, rms, ...noteInfo } or null if no confident pitch is found.
 */
export function detectPitchYin(buffer, sampleRate, options = {}) {
  const {
    minRms = 0.015,
    minFreq = 65,
    maxFreq = 1400,
    threshold = 0.16,
    maxAllowedCmnd = 0.24
  } = options;

  if (!buffer || buffer.length < 512 || !sampleRate) return null;

  const rms = computeRms(buffer);
  if (rms < minRms) return null;

  const halfLen = Math.floor(buffer.length / 2);
  const minLag = Math.max(2, Math.floor(sampleRate / maxFreq));
  const maxLag = Math.min(halfLen - 1, Math.floor(sampleRate / minFreq));
  if (maxLag <= minLag) return null;

  const diff = new Float32Array(maxLag + 1);
  for (let tau = minLag; tau <= maxLag; tau++) {
    let sum = 0;
    for (let j = 0; j < halfLen; j++) {
      const delta = buffer[j] - buffer[j + tau];
      sum += delta * delta;
    }
    diff[tau] = sum;
  }

  // Cumulative mean normalized difference starting from tau = 1..maxLag
  const cmnd = new Float32Array(maxLag + 1);
  cmnd[0] = 1;
  let runningSum = 0;
  for (let tau = 1; tau <= maxLag; tau++) {
    // For taus < minLag, approximate with diff[tau] if needed, or compute strictly for accuracy
    if (tau < minLag) {
      let sum = 0;
      for (let j = 0; j < halfLen; j++) {
        const delta = buffer[j] - buffer[j + tau];
        sum += delta * delta;
      }
      diff[tau] = sum;
    }
    runningSum += diff[tau];
    cmnd[tau] = runningSum > 0 ? (diff[tau] * tau) / runningSum : 1;
  }

  let bestTau = -1;
  for (let tau = minLag; tau < maxLag; tau++) {
    if (cmnd[tau] < threshold) {
      while (tau + 1 <= maxLag && cmnd[tau + 1] < cmnd[tau]) {
        tau++;
      }
      bestTau = tau;
      break;
    }
  }

  if (bestTau === -1) {
    let minVal = Infinity;
    for (let tau = minLag; tau <= maxLag; tau++) {
      if (cmnd[tau] < minVal) {
        minVal = cmnd[tau];
        bestTau = tau;
      }
    }
    if (bestTau === -1 || minVal > maxAllowedCmnd) {
      return null;
    }
  }

  // Parabolic interpolation around bestTau
  let refinedTau = bestTau;
  if (bestTau > minLag && bestTau < maxLag) {
    const s0 = cmnd[bestTau - 1];
    const s1 = cmnd[bestTau];
    const s2 = cmnd[bestTau + 1];
    const denom = 2 * s1 - s2 - s0;
    if (denom !== 0) {
      const shift = (s2 - s0) / (2 * denom);
      if (Math.abs(shift) < 1) {
        refinedTau = bestTau + shift;
      }
    }
  }

  const freq = sampleRate / refinedTau;
  const noteInfo = frequencyToNoteInfo(freq);
  if (!noteInfo) return null;

  return {
    ...noteInfo,
    clarity: Math.max(0, Math.min(1, 1 - cmnd[bestTau])),
    rms
  };
}

