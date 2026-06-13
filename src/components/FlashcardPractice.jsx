import { useState, useRef } from 'react';
import { LEVELS } from '../data/words';
import { speak } from '../utils/speech';
import LevelSelect from './LevelSelect';

export default function FlashcardPractice() {
  const [unlockedUpTo, setUnlockedUpTo] = useState(1);
  const [selectedLevel, setSelectedLevel] = useState(null);
  const [cardIndex, setCardIndex] = useState(0);
  const [recording, setRecording] = useState(false);
  const [recordedUrl, setRecordedUrl] = useState(null);
  const [showCompare, setShowCompare] = useState(false);

  const mediaRecorderRef = useRef(null);
  const chunksRef = useRef([]);

  const currentWords = selectedLevel ? LEVELS[selectedLevel - 1] : [];
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
      // Level complete — unlock next
      if (selectedLevel >= unlockedUpTo) {
        setUnlockedUpTo(prev => Math.min(prev + 1, 100));
      }
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
      alert('Necesitas permitir el acceso al micrófono para grabar.');
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
    return <LevelSelect unlockedUpTo={unlockedUpTo} onSelect={handleSelectLevel} />;
  }

  return (
    <div className="flashcard-section">
      <div className="flashcard-header">
        <button className="btn btn--back" onClick={() => setSelectedLevel(null)}>
          ← Niveles
        </button>
        <span className="flashcard-progress">
          Nivel {selectedLevel} · {cardIndex + 1} / {currentWords.length}
        </span>
      </div>

      {currentCard && (
        <div className="flashcard">
          <div className="flashcard__syllables">
            {currentCard.syllables.map((syl, i) => (
              <button
                key={i}
                className="flashcard__syl-btn"
                onClick={() => speak(syl)}
                aria-label={`Sílaba ${syl}`}
              >
                {syl}
              </button>
            ))}
          </div>

          <div className="flashcard__word">{currentCard.word}</div>

          <div className="flashcard__actions">
            <button className="btn btn--listen" onClick={handleListen}>
              🔊 Escuchar
            </button>

            {!recording ? (
              <button className="btn btn--record" onClick={handleStartRecord}>
                🎙 Grabar
              </button>
            ) : (
              <button className="btn btn--stop" onClick={handleStopRecord}>
                ⏹ Parar
              </button>
            )}
          </div>

          {showCompare && recordedUrl && (
            <div className="compare-box">
              <h4 className="compare-box__title">¡Compara tu pronunciación!</h4>
              <div className="compare-box__buttons">
                <button className="btn btn--reference" onClick={handleListen}>
                  🔊 Referencia
                </button>
                <button className="btn btn--playback" onClick={handlePlayRecording}>
                  🎧 Tu voz
                </button>
              </div>
              <p className="compare-box__hint">
                ¿Suena parecido? ¡Inténtalo de nuevo si quieres mejorar!
              </p>
            </div>
          )}
        </div>
      )}

      <div className="flashcard-nav">
        <button className="btn btn--nav" onClick={handlePrev} disabled={cardIndex === 0}>
          ← Anterior
        </button>
        <button className="btn btn--nav btn--next" onClick={handleNext}>
          {cardIndex + 1 === currentWords.length ? '✅ Completar nivel' : 'Siguiente →'}
        </button>
      </div>
    </div>
  );
}
