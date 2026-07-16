import { useEffect, useRef, useState } from 'react';
import { gsap } from '../../lib/scroll';
import styles from './AudioToggle.module.css';

const STORAGE_KEY = 'lumiere_audio_enabled';

export default function AudioToggle() {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [enabled, setEnabled] = useState(() => localStorage.getItem(STORAGE_KEY) === 'true');

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (enabled) {
      audio.volume = 0;
      audio.play().catch(() => setEnabled(false));
      gsap.to(audio, { volume: 0.35, duration: 1.2 });
    } else if (audio.volume > 0) {
      gsap.to(audio, {
        volume: 0,
        duration: 0.8,
        onComplete: () => audio.pause(),
      });
    }
    localStorage.setItem(STORAGE_KEY, String(enabled));
  }, [enabled]);

  return (
    <>
      <audio ref={audioRef} src="/media/ambient.mp3" loop preload="none" />
      <button
        className={`${styles.toggle} ${enabled ? styles.on : ''}`}
        onClick={() => setEnabled((v) => !v)}
        aria-label={enabled ? 'Mute ambient sound' : 'Play ambient sound'}
        aria-pressed={enabled}
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
          {enabled ? (
            <>
              <path d="M15.5 8.5a5 5 0 0 1 0 7" />
              <path d="M18.5 5.5a9 9 0 0 1 0 13" />
            </>
          ) : (
            <line x1="16" y1="9" x2="22" y2="15" />
          )}
          {!enabled && <line x1="22" y1="9" x2="16" y2="15" />}
        </svg>
      </button>
    </>
  );
}
