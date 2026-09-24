"use client";

import { useEffect, useRef } from "react";
import { useSearchParams } from "next/navigation";

/**
 * Nasłuchuje zmian query stringa w trakcie wizyty (np. klik w kierunek
 * w wyszukiwarce, gdy harmonogram jest już otwarty). Renderować w <Suspense>,
 * żeby useSearchParams nie wyłączał SSR całej strony.
 */
export default function QuerySync({
  onQuery,
}: {
  onQuery: (params: URLSearchParams) => void;
}) {
  const key = useSearchParams().toString();
  const cb = useRef(onQuery);
  cb.current = onQuery;

  useEffect(() => {
    cb.current(new URLSearchParams(key));
  }, [key]);

  return null;
}
