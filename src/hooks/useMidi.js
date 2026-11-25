import { useEffect, useRef, useState } from 'react';

/**
 * Connects to Web MIDI devices if available and forwards note-on events.
 */
export function useMidi(onNoteOn) {
  const [status, setStatus] = useState({
    text: 'MIDI: Checking…',
    connected: false
  });

  const onNoteOnRef = useRef(onNoteOn);
  onNoteOnRef.current = onNoteOn;

  useEffect(() => {
    if (!navigator.requestMIDIAccess) {
      setStatus({ text: 'MIDI: Not supported in browser', connected: false });
      return;
    }

    let midiAccess = null;
    let cancelled = false;

    const handleMidiMessage = (msg) => {
      const [cmdByte, note, velocity] = msg.data;
      const cmd = cmdByte & 0xf0;
      if (cmd === 0x90 && velocity > 0) {
        onNoteOnRef.current(note % 12, note);
      }
    };

    const syncInputs = () => {
      if (!midiAccess || cancelled) return;
      const inputs = Array.from(midiAccess.inputs.values());
      if (inputs.length === 0) {
        setStatus({ text: 'MIDI: Ready (no device)', connected: false });
      } else {
        setStatus({
          text: `MIDI: ${inputs[0].name || 'Connected'}`,
          connected: true
        });
      }

      for (const input of inputs) {
        input.onmidimessage = handleMidiMessage;
      }
    };

    navigator.requestMIDIAccess().then(
      (access) => {
        if (cancelled) return;
        midiAccess = access;
        syncInputs();
        access.onstatechange = syncInputs;
      },
      () => {
        if (!cancelled) {
          setStatus({ text: 'MIDI: Permission denied', connected: false });
        }
      }
    );

    return () => {
      cancelled = true;
      if (midiAccess) {
        midiAccess.onstatechange = null;
        for (const input of midiAccess.inputs.values()) {
          input.onmidimessage = null;
        }
      }
    };
  }, []);

  return status;
}

