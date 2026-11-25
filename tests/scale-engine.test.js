import test from 'node:test';
import assert from 'node:assert/strict';
import { findMatchingScales, parseNoteInput } from '../src/engine/scaleEngine.js';

function pcs(tokens) {
  return tokens.map(parseNoteInput);
}

test('recognizes C Major as most beginner-friendly scale regardless of note order', () => {
  const ordered = findMatchingScales(pcs(['C', 'D', 'E', 'F', 'G', 'A', 'B']));
  const scrambled = findMatchingScales(pcs(['B', 'F', 'D', 'G', 'C', 'A', 'E']));

  assert.equal(ordered.matchType, 'exact');
  assert.equal(ordered.primary.fullName, 'C Major');
  assert.deepEqual(ordered.primary.notes, ['C', 'D', 'E', 'F', 'G', 'A', 'B']);

  assert.equal(scrambled.primary.fullName, ordered.primary.fullName);
  assert.deepEqual(
    scrambled.allMatches.map((m) => m.fullName),
    ordered.allMatches.map((m) => m.fullName)
  );

  const otherNames = ordered.others.map((m) => m.fullName);
  assert.ok(otherNames.includes('A Natural Minor'));
  assert.ok(otherNames.includes('D Dorian'));
  assert.ok(otherNames.includes('G Mixolydian'));
  assert.ok(otherNames.includes('B Locrian'));
});

test('deduplicates repeated notes across octaves', () => {
  const result = findMatchingScales([60, 62, 64, 65, 67, 69, 71, 72, 74]);
  assert.equal(result.noteCount, 7);
  assert.equal(result.matchType, 'exact');
  assert.equal(result.primary.fullName, 'C Major');
});

test('uses proper enharmonic spelling for sharp and flat keys', () => {
  const dMajor = findMatchingScales(pcs(['F#', 'D', 'A', 'E', 'B', 'C#', 'G']));
  assert.equal(dMajor.primary.fullName, 'D Major');
  assert.deepEqual(dMajor.primary.notes, ['D', 'E', 'F#', 'G', 'A', 'B', 'C#']);

  const fMajor = findMatchingScales(pcs(['F', 'G', 'A', 'Bb', 'C', 'D', 'E']));
  assert.equal(fMajor.primary.fullName, 'F Major');
  assert.deepEqual(fMajor.primary.notes, ['F', 'G', 'A', 'Bb', 'C', 'D', 'E']);

  const ebMajor = findMatchingScales(pcs(['C', 'D', 'Eb', 'F', 'G', 'Ab', 'Bb']));
  assert.equal(ebMajor.primary.fullName, 'Eb Major');
  assert.ok(ebMajor.others.some((m) => m.fullName === 'C Natural Minor'));
});

test('recognizes Harmonic Minor and Melodic Minor with modes in secondary list', () => {
  const aHarmMinor = findMatchingScales(pcs(['G#', 'A', 'B', 'C', 'D', 'E', 'F']));
  assert.equal(aHarmMinor.matchType, 'exact');
  assert.equal(aHarmMinor.primary.fullName, 'A Harmonic Minor');
  assert.ok(aHarmMinor.others.some((m) => m.fullName === 'E Phrygian Dominant'));

  const cMelMinor = findMatchingScales(pcs(['C', 'D', 'Eb', 'F', 'G', 'A', 'B']));
  assert.equal(cMelMinor.matchType, 'exact');
  assert.equal(cMelMinor.primary.fullName, 'C Melodic Minor');
});

test('handles partial input (<7 notes), 6/7 near-matches, and chromatic clusters gracefully', () => {
  const partial = findMatchingScales(pcs(['C', 'E', 'G']));
  assert.equal(partial.matchType, 'partial');
  assert.equal(partial.primary.fullName, 'C Major');

  const near = findMatchingScales(pcs(['C', 'D', 'E', 'F', 'G', 'Ab', 'A']));
  assert.equal(near.noteCount, 7);
  assert.equal(near.matchType, 'near');
  assert.ok(near.primary !== null);
  assert.equal(near.primary.overlapCount, 6);

  const cluster = findMatchingScales(pcs(['C', 'C#', 'D', 'D#', 'E', 'F', 'F#']));
  assert.equal(cluster.noteCount, 7);
  assert.equal(cluster.matchType, 'none');
  assert.equal(cluster.primary, null);
});

test('parses note tokens with octaves and unicode accidentals', () => {
  assert.equal(parseNoteInput('C4'), 0);
  assert.equal(parseNoteInput('Bb3'), 10);
  assert.equal(parseNoteInput('F♯5'), 6);
  assert.equal(parseNoteInput('E♭2'), 3);
  assert.equal(parseNoteInput('invalid'), null);
});
