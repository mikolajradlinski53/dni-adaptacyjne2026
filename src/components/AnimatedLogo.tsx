"use client";

import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "motion/react";

const CAPS = [1, 2, 3, 4, 5].map(
  (n) => `/images/DA_LOGO_tylko_czapka${n}.svg`
);

// Sekwencja „rzutu" czapką: [indeks klatki, przesunięcie w pionie w px].
// Klatka 0 (czapka1) = spoczynek; 1-4 = obrót w locie; powrót do 0 = lądowanie.
const SEQUENCE: [number, number][] = [
  [1, -10],
  [2, -18],
  [3, -15],
  [4, -6],
  [0, 0],
];

/**
 * Logo DA: napis „Dni Adaptacyjne" + czapka, która po najechaniu wykonuje
 * „rzut" (jak podrzucenie biretu) i wskakuje z powrotem na swoje miejsce.
 * Na urządzeniach dotykowych animacja odtwarza się raz po wejściu na stronę.
 */
export default function AnimatedLogo({ className }: { className?: string }) {
  const reduce = useReducedMotion();
  const [frame, setFrame] = useState(0);
  const [y, setY] = useState(0);
  const busy = useRef(false);

  function play() {
    if (busy.current || reduce) return;
    busy.current = true;
    SEQUENCE.forEach(([f, yy], k) => {
      setTimeout(
        () => {
          setFrame(f);
          setY(yy);
          if (k === SEQUENCE.length - 1) busy.current = false;
        },
        (k + 1) * 90
      );
    });
  }

  // Jednorazowe odtworzenie po wejściu (głównie dla dotyku, gdzie nie ma hover).
  useEffect(() => {
    if (reduce) return;
    const id = setTimeout(play, 900);
    return () => clearTimeout(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reduce]);

  return (
    <span
      className={`relative block ${className ?? ""}`}
      style={{ aspectRatio: "1000 / 600" }}
      onMouseEnter={play}
    >
      {/* Napis bez czapki */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/images/DA_LOGO_bez_czapki.svg"
        alt="Dni Adaptacyjne"
        className="absolute inset-0 size-full object-contain"
      />
      {/* Czapka (nałożone klatki, przełączane opacity) */}
      <span
        aria-hidden
        className="absolute"
        style={{
          left: "-1%",
          top: "-4%",
          width: "47%",
          aspectRatio: "544 / 316",
          transform: `translateY(${y}px)`,
          transition: "transform 90ms ease-out",
        }}
      >
        {CAPS.map((src, idx) => (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            key={src}
            src={src}
            alt=""
            className="absolute inset-0 size-full object-contain"
            style={{ opacity: idx === frame ? 1 : 0 }}
          />
        ))}
      </span>
    </span>
  );
}
