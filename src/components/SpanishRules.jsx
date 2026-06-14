import { speak } from '../utils/speech';

const RULES = [
  {
    title: 'La H es silenciosa',
    emoji: '🤫',
    color: '#FF6B6B',
    explanation: 'La letra H nunca se pronuncia en español. Es completamente muda.',
    examples: [
      { word: 'hola', syllables: ['o', 'la'], note: 'suena: "ola"' },
      { word: 'hijo', syllables: ['i', 'jo'], note: 'suena: "ijo"' },
      { word: 'hablar', syllables: ['a', 'blar'], note: 'suena: "ablar"' },
      { word: 'hotel', syllables: ['o', 'tel'], note: 'suena: "otel"' },
      { word: 'historia', syllables: ['is', 'to', 'ria'], note: 'suena: "istoria"' },
      { word: 'humano', syllables: ['u', 'ma', 'no'], note: 'suena: "umano"' },
    ],
  },
  {
    title: 'La tilde cambia el significado',
    emoji: '´',
    color: '#FF9F43',
    explanation: 'Una tilde (´) sobre una vocal cambia completamente el significado de la palabra.',
    examples: [
      { word: 'mas', syllables: ['mas'], note: '"mas" = but (conjunción)' },
      { word: 'más', syllables: ['más'], note: '"más" = more (cantidad)' },
      { word: 'el', syllables: ['el'], note: '"el" = the (artículo)' },
      { word: 'él', syllables: ['él'], note: '"él" = he (pronombre)' },
      { word: 'si', syllables: ['si'], note: '"si" = if (condición)' },
      { word: 'sí', syllables: ['sí'], note: '"sí" = yes (afirmación)' },
      { word: 'tu', syllables: ['tu'], note: '"tu" = your (posesivo)' },
      { word: 'tú', syllables: ['tú'], note: '"tú" = you (pronombre)' },
      { word: 'mi', syllables: ['mi'], note: '"mi" = my (posesivo)' },
      { word: 'mí', syllables: ['mí'], note: '"mí" = me (pronombre)' },
      { word: 'se', syllables: ['se'], note: '"se" = himself/herself' },
      { word: 'sé', syllables: ['sé'], note: '"sé" = I know' },
    ],
  },
  {
    title: 'C suena diferente',
    emoji: '🔤',
    color: '#FECA57',
    explanation: 'La C suena /k/ antes de A, O, U — y suena /s/ antes de E, I.',
    examples: [
      { word: 'ca', syllables: ['ca'], note: 'suena /ka/' },
      { word: 'co', syllables: ['co'], note: 'suena /ko/' },
      { word: 'cu', syllables: ['cu'], note: 'suena /ku/' },
      { word: 'ce', syllables: ['ce'], note: 'suena /se/' },
      { word: 'ci', syllables: ['ci'], note: 'suena /si/' },
      { word: 'casa', syllables: ['ca', 'sa'], note: '/kasa/' },
      { word: 'cena', syllables: ['ce', 'na'], note: '/sena/' },
      { word: 'ciudad', syllables: ['ciu', 'dad'], note: '/sjudad/' },
    ],
  },
  {
    title: 'G suena diferente',
    emoji: '🔡',
    color: '#1DD1A1',
    explanation: 'La G suena fuerte /g/ antes de A, O, U — y suave /x/ antes de E, I.',
    examples: [
      { word: 'ga', syllables: ['ga'], note: 'suena /ga/' },
      { word: 'go', syllables: ['go'], note: 'suena /go/' },
      { word: 'gu', syllables: ['gu'], note: 'suena /gu/' },
      { word: 'ge', syllables: ['ge'], note: 'suena /xe/ (como jota)' },
      { word: 'gi', syllables: ['gi'], note: 'suena /xi/ (como jota)' },
      { word: 'gato', syllables: ['ga', 'to'], note: '/gato/' },
      { word: 'gente', syllables: ['gen', 'te'], note: '/xente/' },
      { word: 'gitano', syllables: ['gi', 'ta', 'no'], note: '/xitano/' },
    ],
  },
  {
    title: 'GÜ — la diéresis',
    emoji: '¨',
    color: '#48DBFB',
    explanation: 'La Ü (diéresis) hace que la U se pronuncie en GÜE y GÜI.',
    examples: [
      { word: 'gue', syllables: ['gue'], note: 'U no se pronuncia: /ge/' },
      { word: 'gui', syllables: ['gui'], note: 'U no se pronuncia: /gi/' },
      { word: 'güe', syllables: ['güe'], note: 'U sí se pronuncia: /gue/' },
      { word: 'güi', syllables: ['güi'], note: 'U sí se pronuncia: /gui/' },
      { word: 'guerra', syllables: ['gue', 'rra'], note: '/gerra/ (u muda)' },
      { word: 'pingüino', syllables: ['pin', 'güi', 'no'], note: '/pinguino/' },
    ],
  },
  {
    title: 'QU — la Q',
    emoji: '🔠',
    color: '#FF9FF3',
    explanation: 'La Q siempre va seguida de UE o UI. La U no se pronuncia.',
    examples: [
      { word: 'que', syllables: ['que'], note: 'suena /ke/' },
      { word: 'qui', syllables: ['qui'], note: 'suena /ki/' },
      { word: 'queso', syllables: ['que', 'so'], note: '/keso/' },
      { word: 'quiero', syllables: ['quie', 'ro'], note: '/kjero/' },
      { word: 'pequeño', syllables: ['pe', 'que', 'ño'], note: '/pekeño/' },
      { word: 'aquí', syllables: ['a', 'quí'], note: '/aki/' },
    ],
  },
  {
    title: 'CH, LL, RR — sonidos únicos',
    emoji: '🎵',
    color: '#54A0FF',
    explanation: 'CH, LL y RR son sonidos propios del español que no existen igual en inglés.',
    examples: [
      { word: 'cha', syllables: ['cha'], note: 'CH suena como "ch" en "church"' },
      { word: 'che', syllables: ['che'], note: '' },
      { word: 'chi', syllables: ['chi'], note: '' },
      { word: 'lla', syllables: ['lla'], note: 'LL suena /ya/ en Latinoamérica' },
      { word: 'llo', syllables: ['llo'], note: '' },
      { word: 'rra', syllables: ['rra'], note: 'RR es una R vibrada fuerte' },
      { word: 'rro', syllables: ['rro'], note: '' },
      { word: 'leche', syllables: ['le', 'che'], note: 'CH = /tʃ/' },
      { word: 'lluvia', syllables: ['llu', 'via'], note: 'LL = /y/' },
      { word: 'perro', syllables: ['pe', 'rro'], note: 'RR = vibración fuerte' },
    ],
  },
  {
    title: 'Vocales con tilde',
    emoji: '🔵',
    color: '#5F27CD',
    explanation: 'Las vocales con tilde suenan igual, pero la tilde indica acento fuerte o cambia el significado.',
    examples: [
      { word: 'a', syllables: ['a'], note: 'vocal sin tilde' },
      { word: 'á', syllables: ['á'], note: 'vocal con acento fuerte' },
      { word: 'e', syllables: ['e'], note: '' },
      { word: 'é', syllables: ['é'], note: '' },
      { word: 'i', syllables: ['i'], note: '' },
      { word: 'í', syllables: ['í'], note: '' },
      { word: 'o', syllables: ['o'], note: '' },
      { word: 'ó', syllables: ['ó'], note: '' },
      { word: 'u', syllables: ['u'], note: '' },
      { word: 'ú', syllables: ['ú'], note: '' },
      { word: 'mamá', syllables: ['ma', 'má'], note: 'acento en la última sílaba' },
      { word: 'música', syllables: ['mú', 'si', 'ca'], note: 'acento en la primera' },
    ],
  },
];

export default function SpanishRules() {
  return (
    <div className="rules-section">
      <h2 className="section-label">Reglas del español</h2>
      <p className="vocab-subtitle">Toca cualquier ejemplo para escucharlo</p>

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
                aria-label={`Escuchar ${ex.word}`}
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
