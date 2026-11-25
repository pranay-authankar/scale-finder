import { useCallback, useEffect, useRef, useState } from 'react';
import { computeRms, detectPitchYin } from '../utils/pitchDetector';

const FRAME_INTERVAL_MS = 35;
const REQUIRED_STABLE_FRAMES = 4;

/**
 * Streams microphone audio via Web Audio AnalyserNode, detects stable pitches
 * with YIN, and reports locked-in notes.
 */
export function useMicPitch({ onNoteCaptured }) {
  const [isListening, setIsListening] = useState(false);
  const [error, setError] = useState('');
  const [sensitivity, setSensitivity] = useState(0.015);
  const [liveState, setLiveState] = useState({
    rms: 0,
    detected: null,
    stabilityProgress: 0
  });

  const onNoteCapturedRef = useRef(onNoteCaptured);
  onNoteCapturedRef.current = onNoteCaptured;

  const sensitivityRef = useRef(sensitivity);
  sensitivityRef.current = sensitivity;

  const resourcesRef = useRef({
    stream: null,
    audioCtx: null,
    rafId: null,
    lastSampleTime: 0,
    candidatePc: null,
    stableCount: 0,
    capturedCurrentHold: false
  });

  const stopListening = useCallback(() => {
    const res = resourcesRef.current;
    if (res.rafId !== null) {
      window.cancelAnimationFrame(res.rafId);
      res.rafId = null;
    }
    if (res.stream) {
      for (const track of res.stream.getTracks()) {
        track.stop();
      }
      res.stream = null;
    }
    if (res.audioCtx) {
      res.audioCtx.close().catch(() => {});
      res.audioCtx = null;
    }
    res.candidatePc = null;
    res.stableCount = 0;
    res.capturedCurrentHold = false;

    setIsListening(false);
    setLiveState({ rms: 0, detected: null, stabilityProgress: 0 });
  }, []);

  const startListening = useCallback(async () => {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      setError('Microphone access is not supported in this browser.');
      return;
    }

    setError('');
    stopListening();

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: false,
          noiseSuppression: false,
          autoGainControl: false
        }
      });

      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      const audioCtx = new AudioContextClass();
      if (audioCtx.state === 'suspended') {
        await audioCtx.resume();
      }

      const source = audioCtx.createMediaStreamSource(stream);
      const analyser = audioCtx.createAnalyser();
      analyser.fftSize = 4096;
      source.connect(analyser);

      const buffer = new Float32Array(analyser.fftSize);
      const res = resourcesRef.current;
      res.stream = stream;
      res.audioCtx = audioCtx;
      res.lastSampleTime = 0;
      res.candidatePc = null;
      res.stableCount = 0;
      res.capturedCurrentHold = false;

      setIsListening(true);

      const tick = (timestamp) => {
        if (!resourcesRef.current.audioCtx) return;

        if (timestamp - res.lastSampleTime >= FRAME_INTERVAL_MS) {
          res.lastSampleTime = timestamp;
          analyser.getFloatTimeDomainData(buffer);

          const rms = computeRms(buffer);
          const minRms = sensitivityRef.current;
          const detected = detectPitchYin(buffer, audioCtx.sampleRate, { minRms });

          if (detected && Math.abs(detected.cents) <= 40 && detected.clarity >= 0.78) {
            if (res.candidatePc === detected.pc) {
              res.stableCount = Math.min(REQUIRED_STABLE_FRAMES, res.stableCount + 1);
            } else {
              res.candidatePc = detected.pc;
              res.stableCount = 1;
              res.capturedCurrentHold = false;
            }

            if (res.stableCount >= REQUIRED_STABLE_FRAMES && !res.capturedCurrentHold) {
              res.capturedCurrentHold = true;
              onNoteCapturedRef.current(detected);
            }

            setLiveState({
              rms,
              detected,
              stabilityProgress: res.stableCount / REQUIRED_STABLE_FRAMES
            });
          } else {
            res.candidatePc = null;
            res.stableCount = 0;
            res.capturedCurrentHold = false;
            setLiveState({
              rms,
              detected: null,
              stabilityProgress: 0
            });
          }
        }

        res.rafId = window.requestAnimationFrame(tick);
      };

      res.rafId = window.requestAnimationFrame(tick);
    } catch (err) {
      stopListening();
      if (err && err.name === 'NotAllowedError') {
        setError('Microphone permission was denied. Please allow mic access in your browser.');
      } else if (err && err.name === 'NotFoundError') {
        setError('No microphone device was found.');
      } else {
        setError('Could not access the microphone. Check your audio input device.');
      }
    }
  }, [stopListening]);

  useEffect(() => stopListening, [stopListening]);

  return {
    isListening,
    error,
    liveState,
    sensitivity,
    setSensitivity,
    startListening,
    stopListening
  };
}

