export const SHARP_NAMES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
export const FLAT_NAMES = ['C', 'Db', 'D', 'Eb', 'E', 'F', 'Gb', 'G', 'Ab', 'A', 'Bb', 'B'];

const LETTERS = ['C', 'D', 'E', 'F', 'G', 'A', 'B'];
const LETTER_BASE_PC = { C: 0, D: 2, E: 4, F: 5, G: 7, A: 9, B: 11 };

const MAJOR_ROOT_SPELLINGS = ['C', 'Db', 'D', 'Eb', 'E', 'F', 'F#', 'G', 'Ab', 'A', 'Bb', 'B'];
const MINOR_ROOT_SPELLINGS = ['C', 'C#', 'D', 'Eb', 'E', 'F', 'F#', 'G', 'G#', 'A', 'Bb', 'B'];

const ROOT_SIMPLICITY_MAJOR = {
  0: 0.0,
  7: 0.2,
  5: 0.2,
  2: 0.4,
  10: 0.4,
  9: 0.6,
  3: 0.6,
  4: 0.8,
  8: 0.8,
  11: 1.0,
  1: 1.0,
  6: 1.2
};

const ROOT_SIMPLICITY_MINOR = {
  9: 0.0,
  4: 0.2,
  2: 0.2,
  11: 0.4,
  7: 0.4,
  6: 0.6,
  0: 0.6,
  1: 0.8,
  5: 0.8,
  8: 1.0,
  10: 1.0,
  3: 1.2
};

export const SCALE_DEFINITIONS = [
  {
    id: 'major',
    name: 'Major',
    aliases: ['Ionian'],
    family: 'Diatonic',
    modeType: 'major',
    intervals: [0, 2, 4, 5, 7, 9, 11],
    beginnerRank: 10,
    description: 'Bright, happy, and the foundational scale in Western music.'
  },
  {
    id: 'natural-minor',
    name: 'Natural Minor',
    aliases: ['Aeolian', 'Minor'],
    family: 'Diatonic',
    modeType: 'minor',
    intervals: [0, 2, 3, 5, 7, 8, 10],
    beginnerRank: 20,
    description: 'Classic emotional, melancholic minor scale used across pop, rock, and classical music.'
  },
  {
    id: 'mixolydian',
    name: 'Mixolydian',
    aliases: ['Dominant Mode'],
    family: 'Diatonic',
    modeType: 'major',
    intervals: [0, 2, 4, 5, 7, 9, 10],
    beginnerRank: 50,
    description: 'Major scale with a lowered 7th — great for blues, rock, and funk.'
  },
  {
    id: 'dorian',
    name: 'Dorian',
    aliases: [],
    family: 'Diatonic',
    modeType: 'minor',
    intervals: [0, 2, 3, 5, 7, 9, 10],
    beginnerRank: 55,
    description: 'Soulful minor scale with a raised 6th — popular in jazz, funk, and folk.'
  },
  {
    id: 'lydian',
    name: 'Lydian',
    aliases: [],
    family: 'Diatonic',
    modeType: 'major',
    intervals: [0, 2, 4, 6, 7, 9, 11],
    beginnerRank: 65,
    description: 'Dreamy, cinematic major scale with a raised 4th.'
  },
  {
    id: 'phrygian',
    name: 'Phrygian',
    aliases: [],
    family: 'Diatonic',
    modeType: 'minor',
    intervals: [0, 1, 3, 5, 7, 8, 10],
    beginnerRank: 70,
    description: 'Exotic, Spanish-flavored minor scale with a lowered 2nd.'
  },
  {
    id: 'locrian',
    name: 'Locrian',
    aliases: [],
    family: 'Diatonic',
    modeType: 'minor',
    intervals: [0, 1, 3, 5, 6, 8, 10],
    beginnerRank: 110,
    description: 'Unstable, dark diminished-leaning mode with a lowered 2nd and 5th.'
  },
  {
    id: 'harmonic-minor',
    name: 'Harmonic Minor',
    aliases: [],
    family: 'Harmonic Minor',
    modeType: 'minor',
    intervals: [0, 2, 3, 5, 7, 8, 11],
    beginnerRank: 30,
    description: 'Natural minor with a raised 7th for strong classical and dramatic tension.'
  },
  {
    id: 'phrygian-dominant',
    name: 'Phrygian Dominant',
    aliases: ['Spanish Phrygian', 'Freygish'],
    family: 'Harmonic Minor',
    modeType: 'major',
    intervals: [0, 1, 4, 5, 7, 8, 10],
    beginnerRank: 75,
    description: '5th mode of Harmonic Minor — iconic flamenco, Middle Eastern, and metal sound.'
  },
  {
    id: 'locrian-nat6',
    name: 'Locrian #6',
    aliases: [],
    family: 'Harmonic Minor',
    modeType: 'minor',
    intervals: [0, 1, 3, 5, 6, 9, 10],
    beginnerRank: 130,
    description: '2nd mode of Harmonic Minor.'
  },
  {
    id: 'ionian-aug',
    name: 'Ionian #5',
    aliases: ['Major Augmented'],
    family: 'Harmonic Minor',
    modeType: 'major',
    intervals: [0, 2, 4, 5, 8, 9, 11],
    beginnerRank: 125,
    description: '3rd mode of Harmonic Minor.'
  },
  {
    id: 'dorian-sharp4',
    name: 'Dorian #4',
    aliases: ['Ukrainian Dorian'],
    family: 'Harmonic Minor',
    modeType: 'minor',
    intervals: [0, 2, 3, 6, 7, 9, 10],
    beginnerRank: 115,
    description: '4th mode of Harmonic Minor — expressive folk-minor sound.'
  },
  {
    id: 'lydian-sharp2',
    name: 'Lydian #2',
    aliases: [],
    family: 'Harmonic Minor',
    modeType: 'major',
    intervals: [0, 3, 4, 6, 7, 9, 11],
    beginnerRank: 135,
    description: '6th mode of Harmonic Minor.'
  },
  {
    id: 'ultralocrian',
    name: 'Super Locrian bb7',
    aliases: ['Altered Diminished', 'Ultralocrian'],
    family: 'Harmonic Minor',
    modeType: 'minor',
    intervals: [0, 1, 3, 4, 6, 8, 9],
    beginnerRank: 145,
    description: '7th mode of Harmonic Minor.'
  },
  {
    id: 'melodic-minor',
    name: 'Melodic Minor',
    aliases: ['Jazz Minor'],
    family: 'Melodic Minor',
    modeType: 'minor',
    intervals: [0, 2, 3, 5, 7, 9, 11],
    beginnerRank: 40,
    description: 'Minor 3rd with major 6th and 7th — widely used in classical and jazz.'
  },
  {
    id: 'lydian-dominant',
    name: 'Lydian Dominant',
    aliases: ['Acoustic Scale', 'Mixolydian #4'],
    family: 'Melodic Minor',
    modeType: 'major',
    intervals: [0, 2, 4, 6, 7, 9, 10],
    beginnerRank: 90,
    description: '4th mode of Melodic Minor — bright jazz dominant sound.'
  },
  {
    id: 'altered',
    name: 'Altered Scale',
    aliases: ['Super Locrian'],
    family: 'Melodic Minor',
    modeType: 'minor',
    intervals: [0, 1, 3, 4, 6, 8, 10],
    beginnerRank: 105,
    description: '7th mode of Melodic Minor — staple jazz scale for altered dominant chords.'
  },
  {
    id: 'dorian-b2',
    name: 'Dorian b2',
    aliases: ['Phrygian #6'],
    family: 'Melodic Minor',
    modeType: 'minor',
    intervals: [0, 1, 3, 5, 7, 9, 10],
    beginnerRank: 128,
    description: '2nd mode of Melodic Minor.'
  },
  {
    id: 'lydian-aug',
    name: 'Lydian Augmented',
    aliases: ['Lydian #5'],
    family: 'Melodic Minor',
    modeType: 'major',
    intervals: [0, 2, 4, 6, 8, 9, 11],
    beginnerRank: 126,
    description: '3rd mode of Melodic Minor.'
  },
  {
    id: 'mixolydian-b6',
    name: 'Mixolydian b6',
    aliases: ['Hindu Scale', 'Aeolian Dominant'],
    family: 'Melodic Minor',
    modeType: 'major',
    intervals: [0, 2, 4, 5, 7, 8, 10],
    beginnerRank: 95,
    description: '5th mode of Melodic Minor — bittersweet blend of major and minor.'
  },
  {
    id: 'locrian-nat2',
    name: 'Locrian #2',
    aliases: ['Half-Diminished Scale'],
    family: 'Melodic Minor',
    modeType: 'minor',
    intervals: [0, 2, 3, 5, 6, 8, 10],
    beginnerRank: 118,
    description: '6th mode of Melodic Minor — often used over half-diminished chords.'
  },
  {
    id: 'harmonic-major',
    name: 'Harmonic Major',
    aliases: [],
    family: 'Harmonic Major',
    modeType: 'major',
    intervals: [0, 2, 4, 5, 7, 8, 11],
    beginnerRank: 80,
    description: 'Major scale with a lowered 6th.'
  },
  {
    id: 'double-harmonic-major',
    name: 'Double Harmonic Major',
    aliases: ['Byzantine', 'Arabic'],
    family: 'World / Symmetric',
    modeType: 'major',
    intervals: [0, 1, 4, 5, 7, 8, 11],
    beginnerRank: 85,
    description: 'Dramatic Middle Eastern / Mediterranean scale with two augmented 2nds.'
  },
  {
    id: 'hungarian-minor',
    name: 'Hungarian Minor',
    aliases: ['Double Harmonic Minor'],
    family: 'World / Symmetric',
    modeType: 'minor',
    intervals: [0, 2, 3, 6, 7, 8, 11],
    beginnerRank: 88,
    description: '4th mode of Double Harmonic Major — fiery, expressive minor scale.'
  },
  {
    id: 'neapolitan-minor',
    name: 'Neapolitan Minor',
    aliases: [],
    family: 'Classical / Altered',
    modeType: 'minor',
    intervals: [0, 1, 3, 5, 7, 8, 11],
    beginnerRank: 120,
    description: 'Harmonic minor with a lowered 2nd.'
  },
  {
    id: 'neapolitan-major',
    name: 'Neapolitan Major',
    aliases: [],
    family: 'Classical / Altered',
    modeType: 'major',
    intervals: [0, 1, 3, 5, 7, 9, 11],
    beginnerRank: 122,
    description: 'Melodic minor with a lowered 2nd.'
  },
  {
    id: 'enigmatic',
    name: 'Enigmatic',
    aliases: [],
    family: 'Classical / Altered',
    modeType: 'major',
    intervals: [0, 1, 4, 6, 8, 10, 11],
    beginnerRank: 150,
    description: 'Rare chromatic-leaning 7-note scale popularized by Verdi.'
  }
];

export function normalizePitchClasses(notes) {
  const unique = new Set();
  for (const n of notes) {
    const pc = ((Math.round(Number(n)) % 12) + 12) % 12;
    if (!Number.isNaN(pc)) {
      unique.add(pc);
    }
  }
  return Array.from(unique).sort((a, b) => a - b);
}

function spellNoteFromLetter(letter, targetPc) {
  const base = LETTER_BASE_PC[letter];
  let diff = ((targetPc - base) % 12 + 12) % 12;
  if (diff > 6) diff -= 12;
  if (diff === 0) return letter;
  if (diff === 1) return `${letter}#`;
  if (diff === 2) return `${letter}##`;
  if (diff === -1) return `${letter}b`;
  if (diff === -2) return `${letter}bb`;
  return SHARP_NAMES[targetPc];
}

export function spellScaleNotes(rootName, intervals) {
  const rootLetter = rootName[0];
  const startLetterIdx = LETTERS.indexOf(rootLetter);
  const rootBasePc = LETTER_BASE_PC[rootLetter];
  let rootAccidental = 0;
  if (rootName.endsWith('#')) rootAccidental = 1;
  else if (rootName.endsWith('b')) rootAccidental = -1;
  const rootPc = (rootBasePc + rootAccidental + 12) % 12;

  const spelled = [];
  let doubleAccidentalCount = 0;

  for (let i = 0; i < intervals.length; i++) {
    const letter = LETTERS[(startLetterIdx + i) % 7];
    const targetPc = (rootPc + intervals[i]) % 12;
    const noteName = spellNoteFromLetter(letter, targetPc);
    if (noteName.includes('##') || noteName.includes('bb')) {
      doubleAccidentalCount++;
    }
    spelled.push(noteName);
  }

  if (doubleAccidentalCount > 0) {
    const useFlats =
      rootName.includes('b') || rootPc === 5 || rootPc === 10 || rootPc === 3 || rootPc === 8 || rootPc === 1;
    const table = useFlats ? FLAT_NAMES : SHARP_NAMES;
    return intervals.map((interval) => table[(rootPc + interval) % 12]);
  }

  return spelled;
}

function getPreferredRootName(pc, scaleDef) {
  return scaleDef.modeType === 'major' ? MAJOR_ROOT_SPELLINGS[pc] : MINOR_ROOT_SPELLINGS[pc];
}

function computeCandidateScore(pc, scaleDef) {
  const penalty =
    scaleDef.modeType === 'major' ? ROOT_SIMPLICITY_MAJOR[pc] : ROOT_SIMPLICITY_MINOR[pc];
  return scaleDef.beginnerRank + penalty;
}

export function formatPitchClassLabel(pc) {
  const sharp = SHARP_NAMES[pc];
  const flat = FLAT_NAMES[pc];
  return sharp === flat ? sharp : `${sharp}/${flat}`;
}

export function parseNoteInput(token) {
  if (typeof token === 'number' && Number.isFinite(token)) {
    return ((Math.round(token) % 12) + 12) % 12;
  }
  if (typeof token !== 'string') return null;
  const cleaned = token.trim().replace(/♭/g, 'b').replace(/♯/g, '#');
  const match = /^([A-Ga-g])([#b]?)(-?\d+)?$/.exec(cleaned);
  if (!match) return null;
  const letter = match[1].toUpperCase();
  const acc = match[2];
  let pc = LETTER_BASE_PC[letter];
  if (acc === '#') pc = (pc + 1) % 12;
  if (acc === 'b') pc = (pc + 11) % 12;
  return pc;
}

export function findMatchingScales(inputNotes) {
  const uniquePcs = normalizePitchClasses(inputNotes);
  const inputSet = new Set(uniquePcs);

  if (uniquePcs.length === 0) {
    return {
      uniquePcs: [],
      noteCount: 0,
      matchType: 'empty',
      primary: null,
      others: [],
      allMatches: []
    };
  }

  const exactMatches = [];
  const supersetMatches = [];
  const nearMatches = [];

  for (const scaleDef of SCALE_DEFINITIONS) {
    for (let rootPc = 0; rootPc < 12; rootPc++) {
      const scalePcs = scaleDef.intervals.map((iv) => (rootPc + iv) % 12);
      const scaleSet = new Set(scalePcs);

      let overlapCount = 0;
      for (const pc of uniquePcs) {
        if (scaleSet.has(pc)) overlapCount++;
      }

      const isExact = uniquePcs.length === 7 && overlapCount === 7;
      const isSuperset = uniquePcs.length < 7 && overlapCount === uniquePcs.length;
      const isNear = uniquePcs.length === 7 && overlapCount === 6;

      if (!isExact && !isSuperset && !isNear) continue;

      const rootName = getPreferredRootName(rootPc, scaleDef);
      const notes = spellScaleNotes(rootName, scaleDef.intervals);
      const score = computeCandidateScore(rootPc, scaleDef);

      const candidate = {
        id: `${rootName.toLowerCase()}-${scaleDef.id}`,
        fullName: `${rootName} ${scaleDef.name}`,
        root: rootName,
        rootPc,
        scaleName: scaleDef.name,
        scaleId: scaleDef.id,
        aliases: scaleDef.aliases,
        family: scaleDef.family,
        modeType: scaleDef.modeType,
        intervals: scaleDef.intervals,
        scalePcs,
        notes,
        description: scaleDef.description,
        beginnerRank: scaleDef.beginnerRank,
        score,
        overlapCount,
        missingPcs: scalePcs.filter((pc) => !inputSet.has(pc)),
        extraInputPcs: uniquePcs.filter((pc) => !scaleSet.has(pc))
      };

      if (isExact) exactMatches.push(candidate);
      else if (isSuperset) supersetMatches.push(candidate);
      else if (isNear) nearMatches.push(candidate);
    }
  }

  const sortMatches = (list) =>
    list.sort((a, b) => {
      if (a.score !== b.score) return a.score - b.score;
      return a.fullName.localeCompare(b.fullName);
    });

  if (uniquePcs.length === 7) {
    if (exactMatches.length > 0) {
      sortMatches(exactMatches);
      return {
        uniquePcs,
        noteCount: uniquePcs.length,
        matchType: 'exact',
        primary: exactMatches[0],
        others: exactMatches.slice(1),
        allMatches: exactMatches
      };
    }
    sortMatches(nearMatches);
    return {
      uniquePcs,
      noteCount: uniquePcs.length,
      matchType: nearMatches.length > 0 ? 'near' : 'none',
      primary: nearMatches[0] || null,
      others: nearMatches.slice(1, 10),
      allMatches: nearMatches
    };
  }

  if (uniquePcs.length < 7) {
    sortMatches(supersetMatches);
    return {
      uniquePcs,
      noteCount: uniquePcs.length,
      matchType: 'partial',
      primary: supersetMatches[0] || null,
      others: supersetMatches.slice(1, 12),
      allMatches: supersetMatches
    };
  }

  const subsetMatches = [];
  for (const scaleDef of SCALE_DEFINITIONS) {
    for (let rootPc = 0; rootPc < 12; rootPc++) {
      const scalePcs = scaleDef.intervals.map((iv) => (rootPc + iv) % 12);
      const scaleSet = new Set(scalePcs);
      let overlapCount = 0;
      for (const pc of uniquePcs) {
        if (scaleSet.has(pc)) overlapCount++;
      }
      if (overlapCount >= 6) {
        const rootName = getPreferredRootName(rootPc, scaleDef);
        subsetMatches.push({
          id: `${rootName.toLowerCase()}-${scaleDef.id}`,
          fullName: `${rootName} ${scaleDef.name}`,
          root: rootName,
          rootPc,
          scaleName: scaleDef.name,
          scaleId: scaleDef.id,
          aliases: scaleDef.aliases,
          family: scaleDef.family,
          modeType: scaleDef.modeType,
          intervals: scaleDef.intervals,
          scalePcs,
          notes: spellScaleNotes(rootName, scaleDef.intervals),
          description: scaleDef.description,
          beginnerRank: scaleDef.beginnerRank,
          score: computeCandidateScore(rootPc, scaleDef),
          overlapCount
        });
      }
    }
  }
  subsetMatches.sort((a, b) => {
    if (b.overlapCount !== a.overlapCount) return b.overlapCount - a.overlapCount;
    return a.score - b.score;
  });

  return {
    uniquePcs,
    noteCount: uniquePcs.length,
    matchType: 'over',
    primary: subsetMatches[0] || null,
    others: subsetMatches.slice(1, 10),
    allMatches: subsetMatches
  };
}

