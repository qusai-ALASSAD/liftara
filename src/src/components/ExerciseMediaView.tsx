import { useEffect, useRef, useState } from 'react';
import type { Exercise } from '@/types';
import { ExerciseArt } from './ExerciseArt';

/**
 * Echtes Übungsfoto mit Rückfall auf die eigene SVG-Zeichnung.
 * Bilder werden erst geladen, wenn sie in die Nähe des Bildschirms kommen.
 */
export function ExercisePhoto({
  src, ex, alt, className = '', eager = false
}: {
  src?: string;
  ex: Exercise;
  alt: string;
  className?: string;
  eager?: boolean;
}) {
  const [failed, setFailed] = useState(false);

  if (!src || failed) {
    return <ExerciseArt pattern={ex.pattern} title={alt} className={className} />;
  }

  return (
    <img
      src={src}
      alt={alt}
      loading={eager ? 'eager' : 'lazy'}
      decoding="async"
      fetchPriority={eager ? 'high' : 'auto'}
      onError={() => setFailed(true)}
      className={`h-full w-full object-contain ${className}`}
    />
  );
}

/**
 * Ausführungsvideo: stumm, in Schleife, ohne Vollbildzwang auf iOS.
 * Die Wiedergabe startet erst, wenn das Video sichtbar ist; vorher steht das
 * Standbild. Ohne Videoquelle wird gar nichts geladen.
 */
export function ExerciseVideo({
  src, poster, ex, alt, className = '', autoStart = false
}: {
  src?: string;
  poster?: string;
  ex: Exercise;
  alt: string;
  className?: string;
  /** im Training sofort anlaufen lassen, statt erst beim Scrollen */
  autoStart?: boolean;
}) {
  const ref = useRef<HTMLVideoElement>(null);
  const [visible, setVisible] = useState(autoStart);

  useEffect(() => {
    const el = ref.current;
    if (!el || !src) return;
    if (autoStart) void el.play().catch(() => { /* Autoplay darf scheitern */ });
    if (typeof IntersectionObserver === 'undefined') { setVisible(true); return; }
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry) return;
        setVisible(entry.isIntersecting);
        if (entry.isIntersecting) void el.play().catch(() => { /* Autoplay darf scheitern */ });
        else el.pause();
      },
      { threshold: 0.35 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [src, autoStart]);

  if (!src) return <ExercisePhoto src={poster} ex={ex} alt={alt} className={className} />;

  return (
    <video
      ref={ref}
      // preload="none": Videos werden nie beim ersten Start der PWA geladen.
      preload={visible ? 'metadata' : 'none'}
      autoPlay={autoStart}
      poster={poster}
      muted
      loop
      playsInline
      controls={false}
      aria-label={alt}
      className={`h-full w-full object-contain ${className}`}
    >
      <source src={src} type={src.endsWith('.webm') ? 'video/webm' : 'video/mp4'} />
    </video>
  );
}
