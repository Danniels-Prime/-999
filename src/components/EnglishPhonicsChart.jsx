import { useState } from 'react';
import { speak } from '../utils/speech';

/* ── Data ─────────────────────────────────────────────────────────────────
   Every entry has a `sound` field — what TTS speaks when you tap the big
   symbol button.  It is chosen to produce the phoneme itself, not a full
   word.  Example chips still speak the full word as before.
   ──────────────────────────────────────────────────────────────────────── */

const SHORT_VOWELS = [
  { symbol: 'ă', label: 'Short A', sound: 'at',  tip: 'Open mouth wide. Tongue low and flat. Like the first sound in "apple".', examples: ['apple','ant','add','cat','bat','hat'], color: '#FF6B6B' },
  { symbol: 'ĕ', label: 'Short E', sound: 'end', tip: 'Mouth slightly open. Smile a little. Like the first sound in "egg".', examples: ['egg','elephant','end','bed','red','ten'], color: '#FF9F43' },
  { symbol: 'ĭ', label: 'Short I', sound: 'it',  tip: 'Small mouth opening. Short quick sound. Like "igloo".', examples: ['igloo','inch','if','sit','hit','pin'], color: '#FECA57' },
  { symbol: 'ŏ', label: 'Short O', sound: 'odd', tip: 'Drop your jaw and round your lips slightly. Like "octopus".', examples: ['octopus','olive','odd','hot','dog','mop'], color: '#48DBFB' },
  { symbol: 'ŭ', label: 'Short U', sound: 'up',  tip: 'Relax your mouth completely. Quick puff. Like "umbrella".', examples: ['umbrella','uncle','up','bug','sun','cup'], color: '#FF9FF3' },
];

const LONG_VOWELS = [
  { symbol: 'ā', label: 'Long A', sound: 'ei',  soundLang: 'es-ES', tip: 'Say the letter name "ay". Your jaw lifts at the end.', examples: ['ape','acorn','age','cake','rain','play'], color: '#FF6B6B' },
  { symbol: 'ē', label: 'Long E', sound: 'i',   soundLang: 'es-ES', tip: 'Stretch your smile wide. Long held sound. Like "eagle".', examples: ['eagle','eat','even','feet','tree','bean'], color: '#FF9F43' },
  { symbol: 'ī', label: 'Long I', sound: 'ai',  soundLang: 'es-ES', tip: 'Start open, then close your mouth. Two sounds glide together.', examples: ['ice','ivy','idea','bike','kite','fly'], color: '#FECA57' },
  { symbol: 'ō', label: 'Long O', sound: 'o',   soundLang: 'es-ES', tip: 'Round your lips and say "oh". Hold the sound.', examples: ['ocean','open','over','home','bone','show'], color: '#48DBFB' },
  { symbol: 'ū', label: 'Long U', sound: 'u',   soundLang: 'es-ES', tip: 'Round your lips tight then open. Say "you" or "oo".', examples: ['unicorn','use','unit','cute','tune','fuse'], color: '#FF9FF3' },
];

const CONSONANTS = [
  { letter: 'b', sound: 'buh',  tip: 'Press both lips together, then POP them open. Voice ON.', examples: ['ball','bat','bus','crab'], color: '#6c5ce7' },
  { letter: 'c', sound: 'kuh',  tip: 'Hard C (cat/cup): back of tongue on roof, no voice. Soft C before E/I/Y sounds like S.', examples: ['cat','cup','city','mice'], color: '#00b894' },
  { letter: 'd', sound: 'duh',  tip: 'Tongue tip behind top teeth. Tap quickly. Voice ON.', examples: ['dog','desk','duck','kid'], color: '#e17055' },
  { letter: 'f', sound: 'fuh',  tip: 'Top teeth rest on bottom lip. Blow air through gently.', examples: ['fish','fan','fog','leaf'], color: '#0984e3' },
  { letter: 'g', sound: 'guh',  tip: 'Hard G (go/get): back of tongue, voice ON. Soft G before E/I/Y sounds like J.', examples: ['goat','game','gig','frog'], color: '#6c5ce7' },
  { letter: 'h', sound: 'huh',  tip: 'Just breath! Open your mouth and puff air. No vibration.', examples: ['hat','hop','hill','help'], color: '#00b894' },
  { letter: 'j', sound: 'juh',  tip: 'Start pressing tongue to roof (like D), then release into ZH.', examples: ['jam','jet','jump','jar'], color: '#fdcb6e' },
  { letter: 'k', sound: 'kuh',  tip: 'Back of tongue touches roof. Quick release. No voice.', examples: ['kite','king','keep','desk'], color: '#e17055' },
  { letter: 'l', sound: 'luh',  tip: 'Tongue tip touches behind top teeth. Air flows around the SIDES.', examples: ['lamp','lake','lip','bell'], color: '#0984e3' },
  { letter: 'm', sound: 'mmm',  tip: 'Press lips together. Hum through your NOSE. Feel it vibrate!', examples: ['moon','map','milk','swim'], color: '#6c5ce7' },
  { letter: 'n', sound: 'nun',  tip: 'Tongue behind top teeth. Hum through your NOSE. Air goes out nose.', examples: ['nest','nap','net','spin'], color: '#00b894' },
  { letter: 'p', sound: 'puh',  tip: 'Press lips together, then pop. Same as B but NO voice.', examples: ['pan','pet','pop','stop'], color: '#fdcb6e' },
  { letter: 'q', sound: 'kwuh', tip: 'Always comes with U. QU sounds like KW. Never QU without U!', examples: ['queen','quick','quiz','quit'], color: '#e17055' },
  { letter: 'r', sound: 'ruh',  tip: 'Curl tongue back slightly. Do not touch the roof. Voice ON.', examples: ['rain','run','red','frog'], color: '#0984e3' },
  { letter: 's', sound: 'sss',  tip: 'Hiss like a snake! Air flows over tongue tip. No voice.', examples: ['sun','sit','seed','cats'], color: '#6c5ce7' },
  { letter: 't', sound: 'tuh',  tip: 'Tongue tip behind top teeth. Quick tap. NO voice (unlike D).', examples: ['top','ten','tip','best'], color: '#00b894' },
  { letter: 'v', sound: 'vuh',  tip: 'Top teeth on bottom lip. Buzz. Voice ON (unlike F).', examples: ['van','vet','vine','five'], color: '#fdcb6e' },
  { letter: 'w', sound: 'wuh',  tip: 'Round your lips into a tiny O, then open and say the vowel.', examples: ['well','web','win','twin'], color: '#e17055' },
  { letter: 'x', sound: 'ks',   tip: 'End of word: KS sound (box). Start of word: Z sound (xylophone).', examples: ['fox','box','wax','mix'], color: '#0984e3' },
  { letter: 'y', sound: 'yuh',  tip: 'As consonant: glide from EE quickly into next sound. As vowel: sounds like I or E.', examples: ['yell','yak','yes','yard'], color: '#6c5ce7' },
  { letter: 'z', sound: 'zzz',  tip: 'Like S but with Voice ON. Buzz like a bee!', examples: ['zoo','zip','zero','jazz'], color: '#00b894' },
];

const DIGRAPHS = [
  { letters: 'ch', sound: 'cha',  soundLang: 'es-ES', tip: 'Start with tongue touching roof (like T), then release into SH. Two letters — ONE sound.', examples: ['chip','chop','chin','bench','teach','cheese'], color: '#FF6B6B' },
  { letters: 'sh', sound: 'sha',  tip: 'Push lips slightly forward. Air streams out softly. Shhh! No voice.', examples: ['ship','shop','shell','fish','brush','flash'], color: '#FF9F43' },
  { letters: 'th', sound: 'thin', tip: '(Voiceless) Put tongue lightly between teeth. BLOW air out. No hum. "think", "thumb", "bath".', examples: ['think','thumb','thin','bath','teeth','path'], color: '#FECA57' },
  { letters: 'TH', sound: 'the',  tip: '(Voiced) Same position, but HUM with voice. Feel it buzz! "this", "that", "the", "with".', examples: ['this','that','them','with','bathe','those'], color: '#48DBFB' },
  { letters: 'wh', sound: 'when', tip: 'Blow air through rounded lips, like saying HW together quickly.', examples: ['when','where','what','wheel','while','white'], color: '#FF9FF3' },
  { letters: 'ph', sound: 'fuh',  tip: 'Looks like PH, sounds exactly like F. Top teeth on bottom lip, blow.', examples: ['phone','photo','graph','dolphin','elephant','phrase'], color: '#54A0FF' },
  { letters: 'ng', sound: 'ang',  soundLang: 'es-ES', tip: 'Hum through your NOSE with back of tongue touching roof. No pop or click at end.', examples: ['ring','song','bang','king','lung','swing'], color: '#5F27CD' },
  { letters: 'ck', sound: 'ak',   soundLang: 'es-ES', tip: 'Use CK — never KK — after a SHORT vowel. Makes one K sound.', examples: ['back','duck','kick','lock','truck','block'], color: '#01CBC6' },
];

const BLENDS = [
  { letters: 'bl', sound: 'bluh', tip: 'B + L, smooth and fast together.', examples: ['black','blue','blend','blow'], color: '#6c5ce7' },
  { letters: 'br', sound: 'bruh', tip: 'B + R, smooth together.', examples: ['bread','bring','brown','break'], color: '#00b894' },
  { letters: 'cl', sound: 'cluh', tip: 'C + L, smooth together.', examples: ['clap','clay','clock','close'], color: '#e17055' },
  { letters: 'cr', sound: 'cruh', tip: 'C + R, smooth together.', examples: ['crab','cream','cross','cry'], color: '#0984e3' },
  { letters: 'dr', sound: 'druh', tip: 'D + R, smooth together.', examples: ['drag','dream','dress','drop'], color: '#fdcb6e' },
  { letters: 'fl', sound: 'fluh', tip: 'F + L, smooth together.', examples: ['flag','flat','flip','fly'], color: '#6c5ce7' },
  { letters: 'fr', sound: 'fruh', tip: 'F + R, smooth together.', examples: ['frame','free','frog','from'], color: '#00b894' },
  { letters: 'gl', sound: 'gluh', tip: 'G + L, smooth together.', examples: ['glad','glass','glide','glow'], color: '#e17055' },
  { letters: 'gr', sound: 'gruh', tip: 'G + R, smooth together.', examples: ['grab','grape','green','grin'], color: '#0984e3' },
  { letters: 'pl', sound: 'pluh', tip: 'P + L, smooth together.', examples: ['play','plan','plug','plate'], color: '#fdcb6e' },
  { letters: 'pr', sound: 'pruh', tip: 'P + R, smooth together.', examples: ['pray','press','price','proud'], color: '#6c5ce7' },
  { letters: 'sc', sound: 'scuh', tip: 'S + C, smooth together.', examples: ['scan','scar','scoop','score'], color: '#00b894' },
  { letters: 'sk', sound: 'skuh', tip: 'S + K, smooth together.', examples: ['skip','skill','sky','skate'], color: '#e17055' },
  { letters: 'sl', sound: 'sluh', tip: 'S + L, smooth together.', examples: ['sled','slim','slip','sleep'], color: '#0984e3' },
  { letters: 'sm', sound: 'smuh', tip: 'S + M, smooth together.', examples: ['small','smell','smile','smoke'], color: '#fdcb6e' },
  { letters: 'sn', sound: 'snuh', tip: 'S + N, smooth together.', examples: ['snap','snow','snail','sneak'], color: '#6c5ce7' },
  { letters: 'sp', sound: 'spuh', tip: 'S + P, smooth together.', examples: ['spin','spot','spell','speed'], color: '#00b894' },
  { letters: 'st', sound: 'stuh', tip: 'S + T, smooth together.', examples: ['star','stay','step','stop'], color: '#e17055' },
  { letters: 'sw', sound: 'swuh', tip: 'S + W, smooth together.', examples: ['swim','swing','sweet','swan'], color: '#0984e3' },
  { letters: 'tr', sound: 'truh', tip: 'T + R, smooth together.', examples: ['track','train','tree','truck'], color: '#fdcb6e' },
];

const VOWEL_TEAMS = [
  { team: 'ai', sound: 'ay',  tip: 'Long A sound. Used in the MIDDLE of a word.', examples: ['rain','mail','tail','sail','train','wait'], color: '#FF6B6B' },
  { team: 'ay', sound: 'ay',  tip: 'Long A sound. Used at the END of a word or syllable.', examples: ['play','say','day','stay','pray','away'], color: '#FF9F43' },
  { team: 'ea', sound: 'ee',  tip: 'Usually Long E (eat, beach). Sometimes Short E (bread, head).', examples: ['eat','beat','read','dream','beach','bread'], color: '#FECA57' },
  { team: 'ee', sound: 'ee',  tip: 'Long E sound. Two E\'s working together always.', examples: ['see','tree','feet','need','speed','three'], color: '#1DD1A1' },
  { team: 'ie', sound: 'eye', tip: 'Can sound like Long I (pie, tie) or Long E (field, believe).', examples: ['pie','tie','die','field','believe','chief'], color: '#48DBFB' },
  { team: 'oa', sound: 'oh',  tip: 'Long O sound. Usually in the middle of a word.', examples: ['boat','coat','road','toad','groan','float'], color: '#FF9FF3' },
  { team: 'oe', sound: 'oh',  tip: 'Long O sound at the end of a word.', examples: ['toe','doe','foe','hoe','roe','goes'], color: '#54A0FF' },
  { team: 'oo', sound: 'oo',  tip: 'Long OO (moon, pool) OR Short OO (book, cook). Context helps!', examples: ['moon','pool','book','cook','food','look'], color: '#5F27CD' },
  { team: 'ow', sound: 'oh',  tip: 'Long O (show/blow) OR OW diphthong (cow/how). Listen carefully!', examples: ['show','blow','cow','now','snow','brown'], color: '#01CBC6' },
  { team: 'oy', sound: 'oy',  tip: 'OY diphthong at the END of a word. Glides from O to EE.', examples: ['boy','toy','joy','enjoy','destroy','annoy'], color: '#EE5A24' },
  { team: 'ou', sound: 'ow',  tip: 'Usually OW diphthong (cloud, shout). Sometimes Long O (shoulder).', examples: ['cloud','shout','found','round','out','mouse'], color: '#C8D6E5' },
  { team: 'ue', sound: 'oo',  tip: 'Long U sound at the end of a word or syllable.', examples: ['blue','true','clue','glue','due','argue'], color: '#8395A7' },
];

const R_CONTROLLED = [
  { pattern: 'ar', sound: 'ar', tip: 'The R changes the A sound. Says "AR" like in "car". Open your mouth wide.', examples: ['car','star','farm','hard','art','bark'], color: '#FF6B6B' },
  { pattern: 'er', sound: 'er', tip: 'The R changes the E sound. Relaxed "UR" sound. Very common in English.', examples: ['her','fern','verb','term','herd','stern'], color: '#FF9F43' },
  { pattern: 'ir', sound: 'er', tip: 'Same sound as ER. The R changes the I sound to "UR".', examples: ['bird','girl','stir','shirt','third','first'], color: '#FECA57' },
  { pattern: 'or', sound: 'or', tip: 'The R changes the O sound. "OR" — round your lips slightly.', examples: ['corn','fork','storm','sport','born','short'], color: '#48DBFB' },
  { pattern: 'ur', sound: 'er', tip: 'Same sound as ER and IR. The R changes U to "UR".', examples: ['turn','burn','hurt','curl','surf','nurse'], color: '#FF9FF3' },
];

const WORD_ENDINGS = [
  { ending: '-ing',  sound: 'ing',  tip: 'Added to verbs. Shows an action happening right now.', examples: ['running','jumping','playing','eating','singing'], color: '#6c5ce7' },
  { ending: '-ed',   sound: 'ed',   tip: 'Added to verbs. Shows the action already happened (past tense).', examples: ['jumped','played','walked','started','wanted'], color: '#00b894' },
  { ending: '-er',   sound: 'er',   tip: 'Comparative OR person who does something. "Faster" / "teacher".', examples: ['faster','teacher','runner','colder','player'], color: '#e17055' },
  { ending: '-est',  sound: 'est',  tip: 'Superlative — the MOST of something.', examples: ['fastest','tallest','coldest','biggest','smartest'], color: '#0984e3' },
  { ending: '-ful',  sound: 'ful',  tip: 'Means "full of". Turns nouns into adjectives.', examples: ['helpful','beautiful','careful','powerful','playful'], color: '#fdcb6e' },
  { ending: '-less', sound: 'less', tip: 'Means "without". The opposite of -ful.', examples: ['hopeless','careless','fearless','helpless','endless'], color: '#6c5ce7' },
  { ending: '-tion', sound: 'shen', tip: 'Turns a verb into a noun. Sounds like "shen".', examples: ['nation','station','action','motion','vacation'], color: '#00b894' },
  { ending: '-ness', sound: 'ness', tip: 'Turns an adjective into a noun. "Kind" → "kindness".', examples: ['kindness','darkness','happiness','sadness','goodness'], color: '#e17055' },
  { ending: '-ment', sound: 'ment', tip: 'Turns a verb into a noun. "Move" → "movement".', examples: ['movement','payment','excitement','statement','treatment'], color: '#0984e3' },
  { ending: '-ly',   sound: 'lee',  tip: 'Turns an adjective into an adverb. Describes HOW something is done.', examples: ['quickly','slowly','kindly','loudly','carefully'], color: '#fdcb6e' },
];

const DIPHTHONGS = [
  { pair: 'oi', sound: 'oy',  tip: 'Glides from O to EE. Used in the MIDDLE of a word.', examples: ['coin','oil','boil','point','noise','voice'], color: '#FF6B6B' },
  { pair: 'oy', sound: 'oy',  tip: 'Same OY glide sound at the END of a word.', examples: ['boy','toy','joy','enjoy','royal','annoy'], color: '#FF9F43' },
  { pair: 'ou', sound: 'ow',  tip: 'Glides from A to OO. "Mouth", "cloud", "shout".', examples: ['out','cloud','shout','found','round','mouth'], color: '#FECA57' },
  { pair: 'ow', sound: 'ow',  tip: 'Same AH-OO glide as OU. "Cow", "now", "brown".', examples: ['cow','now','how','brown','town','crowd'], color: '#48DBFB' },
  { pair: 'au', sound: 'aw',  tip: 'Broad AW sound — mouth open, lips slightly rounded.', examples: ['auto','cause','haul','fault','launch','audio'], color: '#FF9FF3' },
  { pair: 'aw', sound: 'aw',  tip: 'Same broad AW sound, often before L or at end of word.', examples: ['paw','saw','draw','jaw','claw','straw'], color: '#54A0FF' },
  { pair: 'ew', sound: 'oo',  tip: 'Long OO or Long U sound. "Blew", "flew", "new".', examples: ['new','few','blew','flew','threw','grew'], color: '#5F27CD' },
  { pair: 'oo', sound: 'oo',  tip: 'Long OO (moon/food) or Short OO (book/look) — context determines which.', examples: ['moon','book','food','look','cool','hook'], color: '#01CBC6' },
];

const TRIGRAPHS = [
  { pattern: '-tch', sound: 'cha',  soundLang: 'es-ES', tip: 'THREE letters, ONE /ch/ sound. Always comes after a SHORT vowel (catch, fetch, witch). Never at the start of a word.', examples: ['catch','match','watch','fetch','witch','pitch','scratch','kitchen'], color: '#FF6B6B' },
  { pattern: '-dge', sound: 'juh',                      tip: 'THREE letters, ONE /j/ sound. Just like -tch but for the J sound — used after a SHORT vowel (bridge, judge, badge).', examples: ['bridge','judge','badge','hedge','fudge','edge','lodge','ridge'], color: '#FF9F43' },
  { pattern: '-nk',  sound: 'ink',  soundLang: 'es-ES', tip: 'N + K together make a NG-K sound. The N becomes a nasal NG before the K. Very common at the end of syllables.', examples: ['think','sink','bank','drink','pink','trunk','blank','chunk'], color: '#FECA57' },
  { pattern: '-nch', sound: 'inch', soundLang: 'es-ES', tip: 'N + CH together. Say the N then immediately /ch/. Common at end of syllables (bench, branch, lunch).', examples: ['bench','ranch','lunch','inch','branch','bunch','pinch','munch'], color: '#1DD1A1' },
];

const SILENT_LETTERS = [
  { pattern: 'kn-',     sound: 'nuh', tip: 'Silent K! When K comes before N at the start of a word, the K is completely silent. Only the N sound is heard.', examples: ['knife','know','knock','knight','knee','knit','knob','knew'], color: '#6c5ce7' },
  { pattern: 'wr-',     sound: 'ruh', tip: 'Silent W! When W comes before R at the start of a word, the W is silent. Only the R sound is heard.', examples: ['write','wrong','wrist','wrap','wrote','wren','wreck','wrench'], color: '#e17055' },
  { pattern: '-ight',   sound: 'ait', soundLang: 'es-ES', tip: 'Silent GH! The pattern -ight has a Long I + T sound. The GH is completely silent. Very common in English.', examples: ['night','light','fight','right','sight','tight','bright','flight'], color: '#0984e3' },
  { pattern: '-mb',     sound: 'muh', tip: 'Silent B! When B comes after M at the END of a word, the B is completely silent. Only the M sound is heard.', examples: ['lamb','climb','comb','bomb','thumb','numb','crumb','limb'], color: '#fdcb6e' },
  { pattern: 'gh = /f/',sound: 'fuh', tip: 'GH sometimes sounds like F! In words like "laugh" and "cough", the GH makes an /f/ sound. Surprising!', examples: ['laugh','cough','tough','rough','enough','draft'], color: '#00b894' },
  { pattern: '-gn',     sound: 'nuh', tip: 'Silent G! When G comes before N, the G is silent. Seen at the start (gnaw) and end (sign, design) of words.', examples: ['gnaw','sign','design','align','foreign','campaign'], color: '#5F27CD' },
];

const Y_VOWEL = [
  { pattern: 'Y = /ē/', sound: 'ee',  tip: 'At the END of a multi-syllable word, Y sounds like Long E. This is the most common Y-as-vowel pattern.', examples: ['baby','funny','happy','candy','city','puppy','silly','penny'], color: '#FF6B6B' },
  { pattern: 'Y = /ī/', sound: 'eye', tip: 'At the END of a one-syllable word, Y sounds like Long I. Also in the middle of some words.', examples: ['sky','fly','cry','dry','try','my','why','fry'], color: '#FF9F43' },
  { pattern: 'Y = /ĭ/', sound: 'i',   tip: 'Inside a word (not at the end), Y sometimes sounds like Short I — especially in Greek-origin words.', examples: ['gym','myth','symbol','crystal','system','rhythm'], color: '#FECA57' },
  { pattern: 'ə Schwa', sound: 'ah',  tip: 'The schwa /ə/ is the most common vowel sound in English! It is the lazy "uh" sound in UNSTRESSED syllables. Any vowel letter can make it.', examples: ['about','banana','pencil','above','alone','family','problem'], color: '#48DBFB' },
];

const SPECIAL_ENDINGS = [
  { ending: '-ture',       sound: 'tur',     tip: 'Sounds like "tur" (cher). Very common in English nouns. The T + ure blend into one smooth sound.', examples: ['nature','future','picture','creature','mixture','texture','capture','culture'], color: '#6c5ce7' },
  { ending: '-sion /zh/',  sound: 'vision',  tip: 'When -SION follows a vowel, it sounds like "zhun" — a buzzing ZH sound. Like "vision", "decision".', examples: ['vision','television','decision','explosion','invasion','revision','division','conclusion'], color: '#e17055' },
  { ending: '-sion /sh/',  sound: 'shen',    tip: 'When -SION follows a consonant like T or S, it sounds like "shen" — same as -TION. Like "mission", "tension".', examples: ['mission','tension','mansion','passion','fashion','session','version','pension'], color: '#0984e3' },
  { ending: '-cious/-tious',sound: 'shes',   tip: 'These endings both sound like "shes". Turns nouns into adjectives meaning "full of" or "having the quality of".', examples: ['delicious','precious','nutritious','ambitious','spacious','ferocious'], color: '#fdcb6e' },
  { ending: '-cial/-tial', sound: 'shel',    tip: 'Both sound like "shel". Adjective endings that come from Latin. "Special", "partial" — the CI and TI both say /sh/.', examples: ['special','social','official','partial','initial','potential'], color: '#00b894' },
];

const CATEGORIES = [
  { id: 'short',      label: '🔴 Short Vowels',    count: 5 },
  { id: 'long',       label: '🔵 Long Vowels',     count: 5 },
  { id: 'cons',       label: '🟣 Consonants',      count: 21 },
  { id: 'digraphs',   label: '🟠 Digraphs',        count: 8 },
  { id: 'blends',     label: '🟢 Blends',          count: 20 },
  { id: 'teams',      label: '🩵 Vowel Teams',     count: 12 },
  { id: 'rctrl',      label: '🟡 R-Controlled',    count: 5 },
  { id: 'endings',    label: '🩷 Word Endings',    count: 10 },
  { id: 'diphthongs', label: '🟩 Diphthongs',      count: 8 },
  { id: 'trigraphs',  label: '🔶 Trigraphs',       count: 4 },
  { id: 'silent',     label: '⬜ Silent Letters',  count: 6 },
  { id: 'yvowel',     label: '🔷 Y & Schwa',       count: 4 },
  { id: 'special',    label: '🌀 Special Endings', count: 5 },
];

/* ── Cards ─────────────────────────────────────────────────────────────────
   Big symbol button → speaks `sound` (the phoneme/pattern sound itself)
   Small example chips → speak the full word
   ──────────────────────────────────────────────────────────────────────── */
// soundLang: if 'es-ES', the big button speaks using Spanish TTS (better for
// sounds en-US TTS mangles). Example chips always use the current app language.
function SoundCard({ symbol, label, tip, examples, color, sound, soundLang }) {
  return (
    <div className="pc-card" style={{ borderColor: color }}>
      <button className="pc-symbol" style={{ background: color }} onClick={() => speak(sound, 0.75, soundLang || null)}>
        {symbol}
      </button>
      <div className="pc-label">{label}</div>
      <div className="pc-tip">💡 {tip}</div>
      <div className="pc-examples">
        {examples.map(w => (
          <button key={w} className="pc-chip" style={{ borderColor: color, color }} onClick={() => speak(w)}>
            {w}
          </button>
        ))}
      </div>
    </div>
  );
}

function PatternCard({ symbol, label, tip, examples, color, sound, soundLang }) {
  const c = color || '#6c5ce7';
  return (
    <div className="pc-card" style={{ borderColor: c }}>
      <button className="pc-symbol" style={{ background: c }} onClick={() => speak(sound, 0.75, soundLang || null)}>
        {symbol}
      </button>
      {label && <div className="pc-label">{label}</div>}
      <div className="pc-tip">💡 {tip}</div>
      <div className="pc-examples">
        {examples.map(w => (
          <button key={w} className="pc-chip" style={{ borderColor: c, color: c }} onClick={() => speak(w)}>
            {w}
          </button>
        ))}
      </div>
    </div>
  );
}

export default function EnglishPhonicsChart() {
  const [cat, setCat] = useState('short');

  return (
    <div className="phonics-chart">
      <div className="pc-cat-tabs">
        {CATEGORIES.map(c => (
          <button
            key={c.id}
            className={`pc-cat-btn ${cat === c.id ? 'pc-cat-btn--active' : ''}`}
            onClick={() => setCat(c.id)}
          >
            {c.label} <span className="pc-count">{c.count}</span>
          </button>
        ))}
      </div>

      <div className="pc-content">
        {cat === 'short' && (
          <>
            <p className="pc-desc">Tap the big colored button to hear the sound. Tap any word chip to hear the full word.</p>
            <div className="pc-grid">
              {SHORT_VOWELS.map(v => <SoundCard key={v.symbol} symbol={v.symbol} label={v.label} tip={v.tip} examples={v.examples} color={v.color} sound={v.sound} soundLang={v.soundLang} />)}
            </div>
          </>
        )}

        {cat === 'long' && (
          <>
            <p className="pc-desc">Long vowels "say their letter name." Tap the big button to hear the pure sound, then tap a word to hear it in context.</p>
            <div className="pc-grid">
              {LONG_VOWELS.map(v => <SoundCard key={v.symbol} symbol={v.symbol} label={v.label} tip={v.tip} examples={v.examples} color={v.color} sound={v.sound} soundLang={v.soundLang} />)}
            </div>
          </>
        )}

        {cat === 'cons' && (
          <>
            <p className="pc-desc">Tap the letter to hear the consonant SOUND — not its name. The tip tells you exactly where to put your mouth.</p>
            <div className="pc-grid pc-grid--cons">
              {CONSONANTS.map(c => (
                <div key={c.letter} className="pc-card" style={{ borderColor: c.color }}>
                  <button className="pc-symbol" style={{ background: c.color }} onClick={() => speak(c.sound)}>
                    {c.letter}
                  </button>
                  <div className="pc-tip">💡 {c.tip}</div>
                  <div className="pc-examples">
                    {c.examples.map(w => (
                      <button key={w} className="pc-chip" style={{ borderColor: c.color, color: c.color }} onClick={() => speak(w)}>
                        {w}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {cat === 'digraphs' && (
          <>
            <p className="pc-desc">Digraphs are TWO letters that make ONE single sound. Tap the big button to hear just the sound. Notice TH has two versions — voiced and voiceless.</p>
            <div className="pc-grid">
              {DIGRAPHS.map(d => <PatternCard key={d.letters + d.tip} symbol={d.letters} tip={d.tip} examples={d.examples} color={d.color} sound={d.sound} soundLang={d.soundLang} />)}
            </div>
          </>
        )}

        {cat === 'blends' && (
          <>
            <p className="pc-desc">Blends are two consonants where you hear BOTH sounds blended smoothly. Tap the big button to hear the blend sound, then tap a word.</p>
            <div className="pc-grid pc-grid--blends">
              {BLENDS.map(b => (
                <div key={b.letters} className="pc-card" style={{ borderColor: b.color }}>
                  <button className="pc-symbol" style={{ background: b.color }} onClick={() => speak(b.sound)}>
                    {b.letters}
                  </button>
                  <div className="pc-tip pc-tip--sm">💡 {b.tip}</div>
                  <div className="pc-examples">
                    {b.examples.map(w => (
                      <button key={w} className="pc-chip" style={{ borderColor: b.color, color: b.color }} onClick={() => speak(w)}>
                        {w}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {cat === 'teams' && (
          <>
            <p className="pc-desc">Vowel teams are two vowels side by side that make ONE sound. Tap the big button to hear the sound, tap a word to hear it in context.</p>
            <div className="pc-grid">
              {VOWEL_TEAMS.map(t => <PatternCard key={t.team} symbol={t.team} tip={t.tip} examples={t.examples} color={t.color} sound={t.sound} soundLang={t.soundLang} />)}
            </div>
          </>
        )}

        {cat === 'rctrl' && (
          <>
            <p className="pc-desc">When a vowel is followed by R, the R "controls" the vowel sound. Tap the big button to hear the R-controlled sound. ER, IR, and UR all sound the same!</p>
            <div className="pc-grid">
              {R_CONTROLLED.map(r => <PatternCard key={r.pattern} symbol={r.pattern} tip={r.tip} examples={r.examples} color={r.color} sound={r.sound} soundLang={r.soundLang} />)}
            </div>
          </>
        )}

        {cat === 'endings' && (
          <>
            <p className="pc-desc">Word endings (suffixes) change a word's meaning or grammar. Tap the big button to hear just the suffix sound, then tap a word to hear it in a full word.</p>
            <div className="pc-grid">
              {WORD_ENDINGS.map(e => <PatternCard key={e.ending} symbol={e.ending} tip={e.tip} examples={e.examples} color={e.color} sound={e.sound} soundLang={e.soundLang} />)}
            </div>
          </>
        )}

        {cat === 'diphthongs' && (
          <>
            <p className="pc-desc">Diphthongs are GLIDING vowel sounds — your mouth moves from one position to another. Tap the big button to hear the glide, then tap a word.</p>
            <div className="pc-grid">
              {DIPHTHONGS.map(d => <PatternCard key={d.pair} symbol={d.pair} tip={d.tip} examples={d.examples} color={d.color} sound={d.sound} soundLang={d.soundLang} />)}
            </div>
          </>
        )}

        {cat === 'trigraphs' && (
          <>
            <p className="pc-desc">Trigraphs are THREE letters that make ONE sound. Tap the big button to hear the actual sound produced by the pattern, then tap a word.</p>
            <div className="pc-grid">
              {TRIGRAPHS.map(t => <PatternCard key={t.pattern} symbol={t.pattern} tip={t.tip} examples={t.examples} color={t.color} sound={t.sound} soundLang={t.soundLang} />)}
            </div>
          </>
        )}

        {cat === 'silent' && (
          <>
            <p className="pc-desc">Silent letters are written but not spoken. Tap the big button to hear the sound you actually say — without the silent letter.</p>
            <div className="pc-grid">
              {SILENT_LETTERS.map(s => <PatternCard key={s.pattern} symbol={s.pattern} tip={s.tip} examples={s.examples} color={s.color} sound={s.sound} soundLang={s.soundLang} />)}
            </div>
          </>
        )}

        {cat === 'yvowel' && (
          <>
            <p className="pc-desc">The letter Y acts as a vowel in many words. Tap the big button to hear which sound it makes in each position. The schwa is English's most common vowel!</p>
            <div className="pc-grid">
              {Y_VOWEL.map(y => <PatternCard key={y.pattern} symbol={y.pattern} tip={y.tip} examples={y.examples} color={y.color} sound={y.sound} soundLang={y.soundLang} />)}
            </div>
          </>
        )}

        {cat === 'special' && (
          <>
            <p className="pc-desc">Advanced endings from Latin and Greek. Tap the big button to hear the suffix sound itself, then tap a word to hear it in a full word.</p>
            <div className="pc-grid">
              {SPECIAL_ENDINGS.map(e => <PatternCard key={e.ending} symbol={e.ending} tip={e.tip} examples={e.examples} color={e.color} sound={e.sound} soundLang={e.soundLang} />)}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
