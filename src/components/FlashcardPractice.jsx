import { useState, useRef } from 'react';
import { LEVELS } from '../data/words';
import { LEVELS as EN_LEVELS } from '../data/words_en';
import { speak } from '../utils/speech';
import LevelSelect from './LevelSelect';
import { useLang } from '../context/LangContext';

// Example word to speak for each phonics pattern (demonstrating the sound)
const PHONICS_EXAMPLES = {
  'Short A': 'apple',
  'Short E': 'egg',
  'Short I': 'igloo',
  'Short O': 'octopus',
  'Short U': 'umbrella',
  'Long A (Silent E)': 'cake',
  'Long I (Silent E)': 'bike',
  'Long O (Silent E)': 'home',
  'Long U (Silent E)': 'tune',
  'SH Digraph': 'ship',
  'CH Digraph': 'chip',
  'TH Digraph': 'think',
  'WH Digraph': 'when',
  'PH Digraph': 'phone',
  'NG Ending': 'ring',
  'EE Vowel Team': 'tree',
  'EA Vowel Team': 'eat',
  'AI Vowel Team': 'rain',
  'AY Vowel Team': 'play',
  'OA Vowel Team': 'boat',
  'OW (Long O)': 'show',
  'OO Short': 'book',
  'OO Long': 'moon',
  'IE Vowel Team': 'pie',
  'UE/EW Vowel Team': 'blue',
  'AU/AW Sound': 'saw',
  'OI/OY Diphthong': 'coin',
  'OU/OW Diphthong': 'cloud',
  'R-Controlled (AR)': 'car',
  'R-Controlled (ER)': 'fern',
  'R-Controlled (IR)': 'bird',
  'R-Controlled (OR)': 'corn',
  'R-Controlled (UR)': 'turn',
  'L-Blends': 'black',
  'R-Blends': 'frog',
  'S-Blends': 'snap',
  'ST/SW Blends': 'star',
  '-ING Suffix': 'running',
  '-ED Suffix': 'jumped',
  '-ER/-EST Suffix': 'faster',
  '-FUL/-LESS Suffix': 'helpful',
  '-TION Suffix': 'nation',
  '-NESS Suffix': 'kindness',
  '-MENT Suffix': 'movement',
  '-TCH Trigraph': 'catch',
  '-DGE Trigraph': 'bridge',
  '-NK Ending': 'think',
  '-NCH Ending': 'bench',
  'Silent KN': 'knife',
  'Silent WR': 'write',
  '-IGHT Silent GH': 'night',
  'GH as /f/': 'laugh',
  'Silent MB': 'lamb',
  'Y = Long I': 'sky',
  'Y = Long E': 'baby',
  'Y = Short I': 'gym',
  'Schwa (ə)': 'about',
  '-TURE Ending': 'nature',
  '-SION /zh/ Ending': 'vision',
  '-SION /sh/ Ending': 'mission',
};

export default function FlashcardPractice({ unlockedUpTo, completedLevels, onLevelComplete }) {
  const lang = useLang();
  const [selectedLevel, setSelectedLevel] = useState(null);
  const [cardIndex, setCardIndex] = useState(0);
  const [recording, setRecording] = useState(false);
  const [recordedUrl, setRecordedUrl] = useState(null);
  const [showCompare, setShowCompare] = useState(false);

  const mediaRecorderRef = useRef(null);
  const chunksRef = useRef([]);

  const activeLevels = lang === 'en' ? EN_LEVELS : LEVELS;
  const currentWords = selectedLevel ? activeLevels[selectedLevel - 1] : [];
  const currentCard = currentWords[cardIndex] || null;

  const handleSelectLevel = (level) => {
    setSelectedLevel(level);
    setCardIndex(0);
    setRecordedUrl(null);
    setShowCompare(false);
  };

  const handleNext = () => {
    const next = cardIndex + 1;
    if (next >= currentWords.length) {
      onLevelComplete(selectedLevel);
      setSelectedLevel(null);
    } else {
      setCardIndex(next);
      setRecordedUrl(null);
      setShowCompare(false);
    }
  };

  const handlePrev = () => {
    if (cardIndex > 0) {
      setCardIndex(cardIndex - 1);
      setRecordedUrl(null);
      setShowCompare(false);
    }
  };

  const handleListen = () => {
    if (!currentCard) return;
    speak(currentCard.word);
  };

  const handleStartRecord = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      chunksRef.current = [];
      const mr = new MediaRecorder(stream);
      mr.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };
      mr.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'audio/webm' });
        const url = URL.createObjectURL(blob);
        setRecordedUrl(url);
        setShowCompare(true);
        stream.getTracks().forEach(t => t.stop());
      };
      mediaRecorderRef.current = mr;
      mr.start();
      setRecording(true);
      setRecordedUrl(null);
      setShowCompare(false);
    } catch {
      const msg = lang === 'en'
        ? 'You need to allow microphone access to record.'
        : 'Necesitas permitir el acceso al micrófono para grabar.';
      alert(msg);
    }
  };

  const handleStopRecord = () => {
    mediaRecorderRef.current?.stop();
    setRecording(false);
  };

  const handlePlayRecording = () => {
    if (!recordedUrl) return;
    const audio = new Audio(recordedUrl);
    audio.play();
  };

  if (!selectedLevel) {
    return <LevelSelect unlockedUpTo={unlockedUpTo} completedLevels={completedLevels} onSelect={handleSelectLevel} />;
  }

  const isEn = lang === 'en';

  return (
    <div className="flashcard-section">
      <div className="flashcard-header">
        <button className="btn btn--back" onClick={() => setSelectedLevel(null)}>
          {isEn ? '← Levels' : '← Niveles'}
        </button>
        <span className="flashcard-progress">
          {isEn ? 'Level' : 'Nivel'} {selectedLevel} · {cardIndex + 1} / {currentWords.length}
        </span>
      </div>

      {currentCard && (
        <div className="flashcard">
          {isEn && currentCard.phonics && (
            <div className="phonics-badge-row">
              <span className="phonics-badge">{currentCard.phonics}</span>
              {PHONICS_EXAMPLES[currentCard.phonics] && (
                <button
                  className="btn btn--phonics-sound"
                  onClick={() => speak(PHONICS_EXAMPLES[currentCard.phonics])}
                  title={`Hear example: ${PHONICS_EXAMPLES[currentCard.phonics]}`}
                >
                  🔉 Hear sound
                </button>
              )}
            </div>
          )}

          <div className="flashcard__syllables">
            {currentCard.syllables.map((syl, i) => (
              <button
                key={i}
                className="flashcard__syl-btn"
                onClick={() => speak(syl)}
                aria-label={isEn ? `Syllable ${syl}` : `Sílaba ${syl}`}
              >
                {syl}
              </button>
            ))}
          </div>

          <div className="flashcard__word">{currentCard.word}</div>

          <div className="flashcard__actions">
            <button className="btn btn--listen" onClick={handleListen}>
              {isEn ? '🔊 Listen' : '🔊 Escuchar'}
            </button>

            {!recording ? (
              <button className="btn btn--record" onClick={handleStartRecord}>
                {isEn ? '🎙 Record' : '🎙 Grabar'}
              </button>
            ) : (
              <button className="btn btn--stop" onClick={handleStopRecord}>
                {isEn ? '⏹ Stop' : '⏹ Parar'}
              </button>
            )}
          </div>

          {showCompare && recordedUrl && (
            <div className="compare-box">
              <h4 className="compare-box__title">
                {isEn ? 'Compare your pronunciation!' : '¡Compara tu pronunciación!'}
              </h4>
              <div className="compare-box__buttons">
                <button className="btn btn--reference" onClick={handleListen}>
                  {isEn ? '🔊 Reference' : '🔊 Referencia'}
                </button>
                <button className="btn btn--playback" onClick={handlePlayRecording}>
                  {isEn ? '🎧 Your voice' : '🎧 Tu voz'}
                </button>
              </div>
              <p className="compare-box__hint">
                {isEn
                  ? 'Does it sound similar? Try again if you want to improve!'
                  : '¿Suena parecido? ¡Inténtalo de nuevo si quieres mejorar!'}
              </p>
            </div>
          )}
        </div>
      )}

      <div className="flashcard-nav">
        <button className="btn btn--nav" onClick={handlePrev} disabled={cardIndex === 0}>
          {isEn ? '← Previous' : '← Anterior'}
        </button>
        <button className="btn btn--nav btn--next" onClick={handleNext}>
          {cardIndex + 1 === currentWords.length
            ? (isEn ? '✅ Complete level' : '✅ Completar nivel')
            : (isEn ? 'Next →' : 'Siguiente →')}
        </button>
      </div>
    </div>
  );
}
