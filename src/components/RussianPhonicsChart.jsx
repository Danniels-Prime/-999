import { useState } from 'react';
import { speak } from '../utils/speech';
import { RU_CONSONANTS, RU_VOWELS_HARD, RU_VOWELS_SOFT } from '../data/phonetics_ru';
import WordBuilder from './WordBuilder';

/* ── Data ─────────────────────────────────────────────────────────────────── */

const ALPHABET = [
  { letter:'А', name:'а',     sound:'а',   tip:'Широко открой рот. Язык внизу. Как в слове «арбуз».', examples:['арбуз','акула','апельсин'], color:'#FF6B6B' },
  { letter:'Б', name:'бэ',    sound:'бу',  tip:'Сомкни губы, потом резко раскрой их. Голос включён.', examples:['банан','берёза','бабочка'], color:'#FF9F43' },
  { letter:'В', name:'вэ',    sound:'ву',  tip:'Верхние зубы на нижней губе. Голос включён.', examples:['волк','ворона','ветер'], color:'#FECA57' },
  { letter:'Г', name:'гэ',    sound:'гу',  tip:'Задняя часть языка касается нёба. Голос включён.', examples:['гора','гусь','город'], color:'#1DD1A1' },
  { letter:'Д', name:'дэ',    sound:'ду',  tip:'Кончик языка за верхними зубами. Голос включён.', examples:['дом','дерево','девочка'], color:'#48DBFB' },
  { letter:'Е', name:'е',     sound:'е',   tip:'После мягкого согласного — звук «э». В начале слова или после гласной — «йэ».', examples:['ель','ехать','белка'], color:'#FF9FF3' },
  { letter:'Ё', name:'ё',     sound:'ё',   tip:'Всегда под ударением. В начале слова — «йо». После мягкого согласного — «о».', examples:['ёж','ёлка','пёс'], color:'#54A0FF' },
  { letter:'Ж', name:'жэ',    sound:'жу',  tip:'Всегда твёрдый. Язык чашечкой, воздух идёт через щель. Голос включён.', examples:['жук','журнал','жираф'], color:'#5F27CD' },
  { letter:'З', name:'зэ',    sound:'зу',  tip:'Как «С», но с голосом. Жужжи как пчела!', examples:['заяц','зебра','зима'], color:'#01CBC6' },
  { letter:'И', name:'и',     sound:'и',   tip:'Улыбнись широко. Язык у нижних зубов. Длинный «и».', examples:['игра','ива','иголка'], color:'#EE5A24' },
  { letter:'Й', name:'и краткое', sound:'й', tip:'Краткий скользящий звук. Всегда перед или после гласной.', examples:['йогурт','май','лей'], color:'#C8D6E5' },
  { letter:'К', name:'ка',    sound:'ку',  tip:'Задняя часть языка на нёбе. Резкий выдох. Без голоса.', examples:['кот','книга','кошка'], color:'#8395A7' },
  { letter:'Л', name:'эль',   sound:'лу',  tip:'Кончик языка за верхними зубами. Воздух по бокам.', examples:['лиса','лампа','лето'], color:'#F368E0' },
  { letter:'М', name:'эм',    sound:'му',  tip:'Сомкни губы и гуди носом. Почувствуй вибрацию!', examples:['мама','море','мышка'], color:'#FF9F43' },
  { letter:'Н', name:'эн',    sound:'ну',  tip:'Язык за верхними зубами. Воздух идёт через нос.', examples:['нос','нога','небо'], color:'#00D2D3' },
  { letter:'О', name:'о',     sound:'о',   tip:'Губы округли. Рот открыт. Как «о» в слове «окно».', examples:['окно','осень','орёл'], color:'#1ABC9C' },
  { letter:'П', name:'пэ',    sound:'пу',  tip:'Как «Б», но без голоса. Лёгкий хлопок губами.', examples:['папа','птица','парта'], color:'#E74C3C' },
  { letter:'Р', name:'эр',    sound:'ру',  tip:'Кончик языка вибрирует у верхних зубов. Р-р-р!', examples:['рыба','роза','рука'], color:'#9B59B6' },
  { letter:'С', name:'эс',    sound:'су',  tip:'Шипи как змея! Воздух через зубы. Без голоса.', examples:['сова','снег','собака'], color:'#3498DB' },
  { letter:'Т', name:'тэ',    sound:'ту',  tip:'Кончик языка за верхними зубами. Без голоса (в отличие от «Д»).', examples:['тигр','трава','тётя'], color:'#2ECC71' },
  { letter:'У', name:'у',     sound:'у',   tip:'Губы трубочкой. Тяни «у». Как в слове «утка».', examples:['утка','уши','утро'], color:'#F39C12' },
  { letter:'Ф', name:'эф',    sound:'фу',  tip:'Верхние зубы на нижней губе. Без голоса (в отличие от «В»).', examples:['фрукт','форма','фламинго'], color:'#D35400' },
  { letter:'Х', name:'ха',    sound:'ху',  tip:'Воздух через горло. Как выдыхаешь на холодном воздухе.', examples:['хлеб','холод','хомяк'], color:'#27AE60' },
  { letter:'Ц', name:'цэ',    sound:'цу',  tip:'Всегда твёрдый. Быстрое «тс» слитно. Как в слове «цирк».', examples:['цветок','цирк','цыплёнок'], color:'#FF6B6B' },
  { letter:'Ч', name:'чэ',    sound:'чу',  tip:'Всегда мягкий. Как «тш» слитно. «Ча» и «щу» — с «а» и «у»!', examples:['чай','час','черепаха'], color:'#FF9F43' },
  { letter:'Ш', name:'ша',    sound:'шу',  tip:'Всегда твёрдый. Язык чашечкой вверх. Шшш! Без голоса.', examples:['шар','школа','шоколад'], color:'#FECA57' },
  { letter:'Щ', name:'ща',    sound:'щу',  tip:'Всегда мягкий. Длинное шипение. Длиннее, чем «Ш».', examples:['щука','щенок','щавель'], color:'#1DD1A1' },
  { letter:'Ъ', name:'твёрдый знак', sound:'подъезд', tip:'Не читается сам по себе. Разделяет приставку и корень. После «Ъ» гласные е/ё/ю/я читаются с «й».', examples:['подъезд','объект','съезд'], color:'#48DBFB' },
  { letter:'Ы', name:'ы',     sound:'ы',   tip:'Язык назад, рот слегка открыт. Особый русский звук — нет в других языках!', examples:['рыба','мыло','сыр'], color:'#FF9FF3' },
  { letter:'Ь', name:'мягкий знак', sound:'конь', tip:'Не читается сам по себе. Смягчает предыдущий согласный.', examples:['конь','тень','мать'], color:'#54A0FF' },
  { letter:'Э', name:'э',     sound:'э',   tip:'Рот открыт, язык низко. Как в слове «эхо». Не путай с «Е»!', examples:['это','экран','эхо'], color:'#5F27CD' },
  { letter:'Ю', name:'ю',     sound:'ю',   tip:'В начале слова — «йу». После мягкого — «у». Губы вперёд.', examples:['юла','юг','юбка'], color:'#01CBC6' },
  { letter:'Я', name:'я',     sound:'я',   tip:'В начале слова — «йа». После мягкого согласного — «а».', examples:['яблоко','яма','ягода'], color:'#EE5A24' },
];

const VOWEL_PAIRS = [
  { hard:'а', soft:'я', hardTip:'Широко открой рот. Язык внизу.', softTip:'Как «йа». Предыдущий согласный смягчается.', examples:['арбуз','мама','яблоко','дядя'], color:'#FF6B6B' },
  { hard:'о', soft:'ё', hardTip:'Губы округли. Рот открыт.', softTip:'Всегда ударная. Как «йо» в начале слова.', examples:['окно','кот','ёж','пёс'], color:'#FF9F43' },
  { hard:'у', soft:'ю', hardTip:'Губы трубочкой вперёд. Тяни «у».', softTip:'Как «йу» в начале слова. Смягчает согласный.', examples:['утка','луна','юла','юг'], color:'#FECA57' },
  { hard:'э', soft:'е', hardTip:'Рот открыт, язык низко. Как «эхо».', softTip:'Как «йэ» в начале слова. После мягкого — «э».', examples:['это','эхо','ель','белка'], color:'#1DD1A1' },
  { hard:'ы', soft:'и', hardTip:'Особый русский звук! Язык назад. Нет в других языках.', softTip:'Широкая улыбка. Язык у нижних зубов.', examples:['рыба','мыло','игра','иголка'], color:'#48DBFB' },
];

const RULES = [
  { rule:'ЖИ — ШИ', slug:'zhi-shi', tip:'После Ж и Ш всегда пиши И, никогда Ы!', examples:['жир','жить','шить','шина','лыжи','мыши'], note:'жы / шы — ОШИБКА!', color:'#FF6B6B' },
  { rule:'ЧА — ЩА', slug:'cha-scha', tip:'После Ч и Щ всегда пиши А, никогда Я!', examples:['чай','час','чашка','щавель','роща','удача'], note:'чя / щя — ОШИБКА!', color:'#FF9F43' },
  { rule:'ЧУ — ЩУ', slug:'chu-schu', tip:'После Ч и Щ всегда пиши У, никогда Ю!', examples:['чудо','чуть','щука','учу','хочу','тащу'], note:'чю / щю — ОШИБКА!', color:'#FECA57' },
  { rule:'ЦЫ — ЦИ', slug:'tsy-tsi', tip:'В корне слова после Ц пиши Ы (цыплёнок). В окончаниях и словах-исключениях — И (цирк).', examples:['цирк','цифра','цыплёнок','цыган','огурцы','птицы'], note:'Запомни: цирк, цифра, цепь — с И!', color:'#1DD1A1' },
  { rule:'НЕ-РАЗЛУЧНЫЕ', slug:'insep', tip:'Некоторые пары букв всегда идут вместе: ЧК, ЧН, НЧ, НЩ, ЩН, РЩ — без мягкого знака!', examples:['ночка','речка','точно','бочка','дочка','конечно'], note:'ноч-ка, не ночь-ка', color:'#48DBFB' },
];

const PAIRS = [
  { voiced:'б', voiceless:'п', soundV:'бу', soundVL:'пу', examples:['банан↔панама','бочка↔почка','рыбка≈рыпка'], color:'#FF6B6B' },
  { voiced:'в', voiceless:'ф', soundV:'ву', soundVL:'фу', examples:['вата↔фата','Ваня↔Фаня'], color:'#FF9F43' },
  { voiced:'г', voiceless:'к', soundV:'гу', soundVL:'ку', examples:['год↔кот','гора↔кора','лог≈лок'], color:'#FECA57' },
  { voiced:'д', voiceless:'т', soundV:'ду', soundVL:'ту', examples:['дочка↔точка','дом↔том','сад≈сат'], color:'#1DD1A1' },
  { voiced:'з', voiceless:'с', soundV:'зу', soundVL:'су', examples:['зуб↔суп','зима↔сима','мороз≈морос'], color:'#48DBFB' },
  { voiced:'ж', voiceless:'ш', soundV:'жу', soundVL:'шу', examples:['жар↔шар','жить↔шить','нож≈нош'], color:'#FF9FF3' },
];

const CATEGORIES = [
  { id:'alphabet', label:'🔤 Алфавит',   count:33 },
  { id:'vowels',   label:'🔴 Гласные',   count:10 },
  { id:'grid',     label:'📊 Слоги',     count:21 },
  { id:'rules',    label:'⚡ Правила',   count:5  },
  { id:'pairs',    label:'🔵 Пары',      count:6  },
];

const ROW_COLORS = [
  '#FF6B6B','#FF9F43','#FECA57','#1DD1A1','#48DBFB',
  '#FF9FF3','#54A0FF','#5F27CD','#01CBC6','#EE5A24',
  '#C8D6E5','#8395A7','#F368E0','#FF9F43','#00D2D3',
  '#1ABC9C','#E74C3C','#9B59B6','#3498DB','#2ECC71','#F39C12',
];

export default function RussianPhonicsChart() {
  const [cat, setCat] = useState('alphabet');
  const [builtWord, setBuiltWord] = useState([]);

  const addSyl = (syl) => { speak(syl, 0.75, 'ru-RU'); setBuiltWord(prev => [...prev, syl]); };

  return (
    <div className="phonics-chart">
      <div className="pc-cat-tabs">
        {CATEGORIES.map(c => (
          <button key={c.id} className={`pc-cat-btn ${cat === c.id ? 'pc-cat-btn--active' : ''}`} onClick={() => setCat(c.id)}>
            {c.label} <span className="pc-count">{c.count}</span>
          </button>
        ))}
      </div>

      <div className="pc-content">

        {cat === 'alphabet' && (
          <>
            <p className="pc-desc">Нажми на букву, чтобы услышать её звук. Нажми на слово-пример, чтобы услышать слово целиком.</p>
            <div className="pc-grid pc-grid--cons">
              {ALPHABET.map(a => (
                <div key={a.letter} className="pc-card" style={{ borderColor: a.color }}>
                  <button className="pc-symbol" style={{ background: a.color }} onClick={() => speak(a.sound, 0.75, 'ru-RU')}>
                    {a.letter}
                  </button>
                  <div className="pc-label" style={{ fontSize:'0.8rem', color:'#636e72' }}>{a.name}</div>
                  <div className="pc-tip">💡 {a.tip}</div>
                  <div className="pc-examples">
                    {a.examples.map(w => (
                      <button key={w} className="pc-chip" style={{ borderColor: a.color, color: a.color }} onClick={() => speak(w, 0.75, 'ru-RU')}>{w}</button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {cat === 'vowels' && (
          <>
            <p className="pc-desc">В русском языке 10 гласных. Твёрдые гласные (а о у э ы) делают предыдущий согласный твёрдым. Мягкие (я ё ю е и) — мягким.</p>
            <div className="pc-grid">
              {VOWEL_PAIRS.map(v => (
                <div key={v.hard} className="pc-card" style={{ borderColor: v.color }}>
                  <div style={{ display:'flex', gap:8, justifyContent:'center', marginBottom:8 }}>
                    <button className="pc-symbol" style={{ background: v.color, flex:1 }} onClick={() => speak(v.hard, 0.75, 'ru-RU')}>{v.hard}</button>
                    <button className="pc-symbol" style={{ background: v.color + 'bb', flex:1 }} onClick={() => speak(v.soft, 0.75, 'ru-RU')}>{v.soft}</button>
                  </div>
                  <div className="pc-tip">💡 <strong>Твёрдая:</strong> {v.hardTip}</div>
                  <div className="pc-tip">💡 <strong>Мягкая:</strong> {v.softTip}</div>
                  <div className="pc-examples">
                    {v.examples.map(w => (
                      <button key={w} className="pc-chip" style={{ borderColor: v.color, color: v.color }} onClick={() => speak(w, 0.75, 'ru-RU')}>{w}</button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {cat === 'grid' && (
          <>
            <p className="pc-desc">Нажми на слог, чтобы услышать его. Собери слово внизу! Слева — твёрдые слоги (а о у ы э), справа — мягкие (я ё ю и е).</p>
            <div className="syllable-grid">
              {RU_CONSONANTS.map((row, i) => (
                <div key={row.letter} className="consonant-row">
                  <span className="consonant-label" style={{ minWidth:28 }}>{row.letter}</span>
                  <div className="syllable-row" style={{ flexWrap:'wrap' }}>
                    {row.hard.map(syl => (
                      <button key={syl} className="syllable-btn" style={{ backgroundColor: ROW_COLORS[i % ROW_COLORS.length] }}
                        onClick={() => addSyl(syl)}>{syl}</button>
                    ))}
                    {row.soft && (
                      <>
                        <span style={{ width:8 }} />
                        {row.soft.map(syl => (
                          <button key={syl} className="syllable-btn" style={{ backgroundColor: ROW_COLORS[i % ROW_COLORS.length] + 'bb' }}
                            onClick={() => addSyl(syl)}>{syl}</button>
                        ))}
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
            <WordBuilder syllables={builtWord} onClear={() => setBuiltWord([])} />
          </>
        )}

        {cat === 'rules' && (
          <>
            <p className="pc-desc">Важные правила написания! Нажми на слово-пример, чтобы услышать его.</p>
            <div className="pc-grid">
              {RULES.map(r => (
                <div key={r.rule} className="pc-card" style={{ borderColor: r.color }}>
                  <button className="pc-symbol" style={{ background: r.color, fontSize:'1.1rem' }} onClick={() => speak(r.examples[0], 0.75, 'ru-RU')}>
                    {r.rule}
                  </button>
                  <div className="pc-tip">💡 {r.tip}</div>
                  <div className="pc-tip" style={{ color:'#e17055', fontWeight:700 }}>❌ {r.note}</div>
                  <div className="pc-examples">
                    {r.examples.map(w => (
                      <button key={w} className="pc-chip" style={{ borderColor: r.color, color: r.color }} onClick={() => speak(w, 0.75, 'ru-RU')}>{w}</button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {cat === 'pairs' && (
          <>
            <p className="pc-desc">Звонкие и глухие согласные — пары. В конце слова звонкий оглушается (становится глухим). Нажми на букву, чтобы услышать её звук.</p>
            <div className="pc-grid">
              {PAIRS.map(p => (
                <div key={p.voiced} className="pc-card" style={{ borderColor: p.color }}>
                  <div style={{ display:'flex', gap:8, justifyContent:'center', marginBottom:8 }}>
                    <button className="pc-symbol" style={{ background: p.color, flex:1 }} onClick={() => speak(p.soundV, 0.75, 'ru-RU')}>
                      {p.voiced}
                    </button>
                    <button className="pc-symbol" style={{ background: p.color + 'bb', flex:1 }} onClick={() => speak(p.soundVL, 0.75, 'ru-RU')}>
                      {p.voiceless}
                    </button>
                  </div>
                  <div className="pc-tip">💡 <strong>{p.voiced}</strong> — звонкий · <strong>{p.voiceless}</strong> — глухой</div>
                  <div className="pc-examples">
                    {p.examples.map(w => (
                      <button key={w} className="pc-chip" style={{ borderColor: p.color, color: p.color }} onClick={() => speak(w.split('↔')[0].split('≈')[0], 0.75, 'ru-RU')}>{w}</button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

      </div>
    </div>
  );
}
