"use client";

import { useEffect, useState } from "react";
import { EVENT_START } from "@/lib/content";

type Labels = {
  heading: string;
  days: string;
  hours: string;
  minutes: string;
  seconds: string;
  after: string;
};

type Remaining = { d: number; h: number; m: number; s: number } | null;

function remaining(): Remaining {
  const diff = new Date(EVENT_START).getTime() - Date.now();
  if (diff <= 0) return null;
  const s = Math.floor(diff / 1000);
  return {
    d: Math.floor(s / 86400),
    h: Math.floor((s % 86400) / 3600),
    m: Math.floor((s % 3600) / 60),
    s: s % 60,
  };
}

export default function Countdown({ labels }: { labels: Labels }) {
  // Start od null, żeby serwer i pierwszy render klienta były identyczne
  const [time, setTime] = useState<Remaining | "pending">("pending");

  useEffect(() => {
    setTime(remaining());
    const id = window.setInterval(() => setTime(remaining()), 1000);
    return () => window.clearInterval(id);
  }, []);

  if (time === null) {
    return (
      <p className="font-display text-2xl font-semibold sm:text-3xl">
        {labels.after}
      </p>
    );
  }

  const segments = [
    { value: time === "pending" ? "––" : String(time.d), label: labels.days },
    {
      value: time === "pending" ? "––" : String(time.h).padStart(2, "0"),
      label: labels.hours,
    },
    {
      value: time === "pending" ? "––" : String(time.m).padStart(2, "0"),
      label: labels.minutes,
    },
    {
      value: time === "pending" ? "––" : String(time.s).padStart(2, "0"),
      label: labels.seconds,
    },
  ];

  return (
    <div aria-label={labels.heading}>
      <p className="mb-3 text-sm font-semibold tracking-wide text-ink-soft">
        {labels.heading}
      </p>
      <div className="flex items-end gap-3 sm:gap-6">
        {segments.map((seg, i) => (
          <div key={seg.label} className="flex items-end gap-3 sm:gap-6">
            <div className="text-center">
              <span
                className="block font-display text-4xl font-bold tabular-nums sm:text-6xl md:text-7xl"
                suppressHydrationWarning
              >
                {seg.value}
              </span>
              <span className="mt-1 block text-xs font-medium text-ink-soft sm:text-sm">
                {seg.label}
              </span>
            </div>
            {i < segments.length - 1 ? (
              <span
                aria-hidden
                className="pb-6 font-display text-2xl text-ink-soft/40 sm:pb-8 sm:text-4xl"
              >
                :
              </span>
            ) : null}
          </div>
        ))}
      </div>
      <div className="grad-line mt-5 h-1 w-full max-w-md rounded-full" />
    </div>
  );
}
