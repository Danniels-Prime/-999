import { speak } from '../utils/speech';

const RULES = [
  {
    title: 'Short Vowels',
    emoji: '🔤',
    color: '#FF6B6B',
    explanation: 'Short vowels make their basic sound: A says /a/ as in apple, E says /e/ as in egg, I says /i/ as in igloo, O says /o/ as in orange, U says /u/ as in umbrella.',
    examples: [
      { word: 'apple', note: 'short A' },
      { word: 'cat', note: '/a/ sound' },
      { word: 'hat', note: '/a/ sound' },
      { word: 'egg', note: 'short E' },
      { word: 'bed', note: '/e/ sound' },
      { word: 'red', note: '/e/ sound' },
      { word: 'igloo', note: 'short I' },
      { word: 'big', note: '/i/ sound' },
      { word: 'sit', note: '/i/ sound' },
      { word: 'orange', note: 'short O' },
      { word: 'hot', note: '/o/ sound' },
      { word: 'top', note: '/o/ sound' },
      { word: 'umbrella', note: 'short U' },
      { word: 'run', note: '/u/ sound' },
      { word: 'cup', note: '/u/ sound' },
    ],
  },
  {
    title: 'Silent E Rule',
    emoji: '🔕',
    color: '#FF9F43',
    explanation: 'When a word ends in E, the E is silent and it makes the vowel before it say its own name (long vowel sound).',
    examples: [
      { word: 'cake', note: 'A says its name' },
      { word: 'bake', note: 'a-e pattern' },
      { word: 'lake', note: 'a-e pattern' },
      { word: 'bike', note: 'I says its name' },
      { word: 'like', note: 'i-e pattern' },
      { word: 'kite', note: 'i-e pattern' },
      { word: 'home', note: 'O says its name' },
      { word: 'bone', note: 'o-e pattern' },
      { word: 'note', note: 'o-e pattern' },
      { word: 'tune', note: 'U says its name' },
      { word: 'cute', note: 'u-e pattern' },
      { word: 'mute', note: 'u-e pattern' },
    ],
  },
  {
    title: 'SH Sound',
    emoji: '🤫',
    color: '#FECA57',
    explanation: 'SH is a digraph — two letters that make one sound together. SH says /sh/ as in "shh!" It does not say S and H separately.',
    examples: [
      { word: 'ship', note: 'SH at start' },
      { word: 'shop', note: 'SH at start' },
      { word: 'shell', note: 'SH at start' },
      { word: 'shin', note: 'SH at start' },
      { word: 'fish', note: 'SH at end' },
      { word: 'dish', note: 'SH at end' },
      { word: 'wish', note: 'SH at end' },
      { word: 'cash', note: 'SH at end' },
      { word: 'brush', note: 'SH at end' },
      { word: 'flash', note: 'blend + SH' },
      { word: 'fresh', note: 'blend + SH' },
      { word: 'crash', note: 'blend + SH' },
    ],
  },
  {
    title: 'CH Sound',
    emoji: '🎵',
    color: '#1DD1A1',
    explanation: 'CH is a digraph that makes the /ch/ sound as in "cheese." You hear it in many common words at the beginning or end.',
    examples: [
      { word: 'chip', note: 'CH at start' },
      { word: 'chop', note: 'CH at start' },
      { word: 'chin', note: 'CH at start' },
      { word: 'chest', note: 'CH at start' },
      { word: 'chain', note: 'CH at start' },
      { word: 'much', note: 'CH at end' },
      { word: 'rich', note: 'CH at end' },
      { word: 'inch', note: 'CH at end' },
      { word: 'bench', note: 'CH at end' },
      { word: 'lunch', note: 'CH at end' },
      { word: 'teach', note: 'CH at end' },
      { word: 'beach', note: 'CH at end' },
    ],
  },
  {
    title: 'TH Sound',
    emoji: '👅',
    color: '#48DBFB',
    explanation: 'TH is a digraph with two sounds: voiced /th/ as in "this" and "that," and unvoiced /th/ as in "thin" and "think." Put your tongue between your teeth!',
    examples: [
      { word: 'this', note: 'voiced TH' },
      { word: 'that', note: 'voiced TH' },
      { word: 'then', note: 'voiced TH' },
      { word: 'them', note: 'voiced TH' },
      { word: 'with', note: 'voiced TH' },
      { word: 'thin', note: 'unvoiced TH' },
      { word: 'think', note: 'unvoiced TH' },
      { word: 'bath', note: 'unvoiced TH' },
      { word: 'math', note: 'unvoiced TH' },
      { word: 'teeth', note: 'unvoiced TH' },
      { word: 'tooth', note: 'unvoiced TH' },
      { word: 'thumb', note: 'unvoiced TH' },
    ],
  },
  {
    title: 'Vowel Teams EE and EA',
    emoji: '🦷',
    color: '#FF9FF3',
    explanation: 'When two vowels go walking, the first one does the talking! EE and EA both usually say the long E sound /ee/ as in "see" and "eat."',
    examples: [
      { word: 'see', note: 'EE = long E' },
      { word: 'tree', note: 'EE = long E' },
      { word: 'need', note: 'EE = long E' },
      { word: 'feet', note: 'EE = long E' },
      { word: 'sweet', note: 'EE = long E' },
      { word: 'speed', note: 'EE = long E' },
      { word: 'eat', note: 'EA = long E' },
      { word: 'beat', note: 'EA = long E' },
      { word: 'heat', note: 'EA = long E' },
      { word: 'read', note: 'EA = long E' },
      { word: 'dream', note: 'EA = long E' },
      { word: 'cream', note: 'EA = long E' },
    ],
  },
  {
    title: 'Vowel Teams AI, AY and OA, OW',
    emoji: '☔',
    color: '#54A0FF',
    explanation: 'AI and AY make the long A sound /ay/ as in "rain" and "play." OA and OW make the long O sound /oh/ as in "boat" and "show."',
    examples: [
      { word: 'rain', note: 'AI = long A' },
      { word: 'main', note: 'AI = long A' },
      { word: 'train', note: 'AI = long A' },
      { word: 'sail', note: 'AI = long A' },
      { word: 'play', note: 'AY = long A' },
      { word: 'stay', note: 'AY = long A' },
      { word: 'boat', note: 'OA = long O' },
      { word: 'coat', note: 'OA = long O' },
      { word: 'road', note: 'OA = long O' },
      { word: 'show', note: 'OW = long O' },
      { word: 'blow', note: 'OW = long O' },
      { word: 'snow', note: 'OW = long O' },
    ],
  },
  {
    title: 'Consonant Blends',
    emoji: '🎸',
    color: '#5F27CD',
    explanation: 'Consonant blends are two or three consonants together where each letter still makes its own sound, but they blend smoothly into each other.',
    examples: [
      { word: 'black', note: 'BL blend' },
      { word: 'blue', note: 'BL blend' },
      { word: 'bread', note: 'BR blend' },
      { word: 'train', note: 'TR blend' },
      { word: 'tree', note: 'TR blend' },
      { word: 'frog', note: 'FR blend' },
      { word: 'free', note: 'FR blend' },
      { word: 'skip', note: 'SK blend' },
      { word: 'sky', note: 'SK blend' },
      { word: 'snap', note: 'SN blend' },
      { word: 'swim', note: 'SW blend' },
      { word: 'sting', note: 'ST blend' },
    ],
  },
];

export default function EnglishRules() {
  return (
    <div className="rules-section">
      <h2 className="section-label">English Phonics Rules</h2>
      <p className="vocab-subtitle">Tap any example word to hear it</p>

      {RULES.map((rule) => (
        <div key={rule.title} className="rule-card">
          <div className="rule-card__header" style={{ borderLeftColor: rule.color }}>
            <span className="rule-emoji">{rule.emoji}</span>
            <div>
              <h3 className="rule-title">{rule.title}</h3>
              <p className="rule-explanation">{rule.explanation}</p>
            </div>
          </div>

          <div className="rule-examples">
            {rule.examples.map((ex, i) => (
              <button
                key={i}
                className="rule-example-btn"
                style={{ '--rule-color': rule.color }}
                onClick={() => speak(ex.word)}
                aria-label={`Hear ${ex.word}`}
              >
                <span className="rule-example-word">{ex.word}</span>
                {ex.note && <span className="rule-example-note">{ex.note}</span>}
              </button>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
