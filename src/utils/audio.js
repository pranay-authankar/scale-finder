let sharedAudioCtx = null;

function midiToFreq(midi) {
  return 440 * Math.pow(2, (midi - 69) / 12);
}

/**
 * Plays a warm electric-piano tone for the given MIDI note number.
 */
export function playTone(midi, durationSec = 0.55) {
  if (typeof window === 'undefined') return;
  const AudioContextClass = window.AudioContext || window.webkitAudioContext;
  if (!AudioContextClass) return;

  if (!sharedAudioCtx) {
    sharedAudioCtx = new AudioContextClass();
  }
  if (sharedAudioCtx.state === 'suspended') {
    sharedAudioCtx.resume();
  }

  const now = sharedAudioCtx.currentTime;
  const freq = midiToFreq(midi);

  const osc1 = sharedAudioCtx.createOscillator();
  const osc2 = sharedAudioCtx.createOscillator();
  const osc2Gain = sharedAudioCtx.createGain();
  const filter = sharedAudioCtx.createBiquadFilter();
  const gain = sharedAudioCtx.createGain();

  osc1.type = 'triangle';
  osc1.frequency.setValueAtTime(freq, now);

  osc2.type = 'sine';
  osc2.frequency.setValueAtTime(freq * 2, now);
  osc2Gain.gain.value = 0.25;

  filter.type = 'lowpass';
  filter.frequency.setValueAtTime(2200, now);
  filter.frequency.exponentialRampToValueAtTime(650, now + durationSec);

  gain.gain.setValueAtTime(0.001, now);
  gain.gain.exponentialRampToValueAtTime(0.22, now + 0.015);
  gain.gain.exponentialRampToValueAtTime(0.001, now + durationSec);

  osc1.connect(filter);
  osc2.connect(osc2Gain);
  osc2Gain.connect(filter);
  filter.connect(gain);
  gain.connect(sharedAudioCtx.destination);

  osc1.start(now);
  osc2.start(now);
  osc1.stop(now + durationSec + 0.02);
  osc2.stop(now + durationSec + 0.02);
}

