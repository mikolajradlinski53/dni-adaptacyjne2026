"use client";

import { Fragment, useEffect, useState } from "react";
import { ArrowRight } from "@phosphor-icons/react";
import { Link } from "@/i18n/navigation";
import { EVENT_END, EVENT_START } from "@/lib/content";

type Labels = {
  heading: string;
  days: string;
  hours: string;
  minutes: string;
  seconds: string;
  after: string;
  today: string;
  todayLead: string;
  todayBadge: string;
  todayCta: string;
};

type Remaining = { d: number; h: number; m: number; s: number };
type Phase = Remaining | "today" | "after";

function phase(): Phase {
  const now = Date.now();
  // Podgląd stanu dnia wydarzenia przed czasem: ?countdown=today
  if (new URLSearchParams(window.location.search).get("countdown") === "today") {
    return "today";
  }
  if (now >= new Date(EVENT_END).getTime()) return "after";
  const diff = new Date(EVENT_START).getTime() - now;
  if (diff <= 0) return "today";
  const s = Math.floor(diff / 1000);
  return {
    d: Math.floor(s / 86400),
    h: Math.floor((s % 86400) / 3600),
    m: Math.floor((s % 3600) / 60),
    s: s % 60,
  };
}

function Today({ labels }: { labels: Labels }) {
  const words = labels.today.split(" ");
  return (
    <div>
      <p className="mb-3 inline-flex items-center gap-2 text-sm font-semibold tracking-wide text-ink-soft">
        <span aria-hidden className="relative flex size-2.5">
          <span className="today-ping absolute inset-0 rounded-full bg-magenta" />
          <span className="relative size-2.5 rounded-full bg-magenta" />
        </span>
        {labels.todayBadge}
      </p>
      <p className="font-display text-5xl font-bold leading-none sm:text-7xl md:text-8xl">
        {words.map((w, i) => (
          <Fragment key={i}>
            {i > 0 ? " " : null}
            <span
              className="today-word grad-brand bg-clip-text text-transparent"
              style={{ animationDelay: `${i * 0.12}s, 0s` }}
            >
              {w}
            </span>
          </Fragment>
        ))}
        <span
          aria-hidden
          className="today-word ml-3 inline-block"
          style={{ animationDelay: `${words.length * 0.12}s` }}
        >
          <span className="emoji-live">🎉</span>
        </span>
      </p>
      <p className="today-fade mt-4 max-w-xl text-base font-medium text-ink-soft sm:text-lg">
        {labels.todayLead}
      </p>
      <Link
        href="/harmonogram"
        className="today-fade grad-brand mt-5 inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-bold text-white shadow-lg shadow-violet/25 transition-transform hover:scale-[1.02] active:scale-[0.99]"
      >
        {labels.todayCta}
        <ArrowRight size={18} weight="bold" />
      </Link>
      <div className="grad-line mt-6 h-1 w-full max-w-md rounded-full" />
    </div>
  );
}

export default function Countdown({ labels }: { labels: Labels }) {
  // Start od "pending", żeby serwer i pierwszy render klienta były identyczne
  const [time, setTime] = useState<Phase | "pending">("pending");

  useEffect(() => {
    setTime(phase());
    const id = window.setInterval(() => setTime(phase()), 1000);
    return () => window.clearInterval(id);
  }, []);

  if (time === "today") return <Today labels={labels} />;

  if (time === "after") {
    return (
      <p className="font-display text-2xl font-semibold sm:text-3xl">
        {labels.after}
      </p>
    );
  }

  const segments = [
    { value: time === "pending" ? "--" : String(time.d), label: labels.days },
    {
      value: time === "pending" ? "--" : String(time.h).padStart(2, "0"),
      label: labels.hours,
    },
    {
      value: time === "pending" ? "--" : String(time.m).padStart(2, "0"),
      label: labels.minutes,
    },
    {
      value: time === "pending" ? "--" : String(time.s).padStart(2, "0"),
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
