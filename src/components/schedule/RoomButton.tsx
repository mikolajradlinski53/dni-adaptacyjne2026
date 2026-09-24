"use client";

import { useEffect, useId, useRef, useState, type KeyboardEvent } from "react";
import { createPortal } from "react-dom";
import { useTranslations } from "next-intl";
import { MapPin, MapTrifold, X } from "@phosphor-icons/react";
import { Link } from "@/i18n/navigation";
import { buildingOf } from "@/lib/schedule";
import { CAMPUS_BUILDINGS, CAMPUS_MAP, buildingView } from "@/lib/campusMap";

/** Nazwa sali jako przycisk; klik otwiera okienko z mapą i zaznaczonym budynkiem. */
export default function RoomButton({
  room,
  size = "md",
}: {
  room: string;
  size?: "sm" | "md";
}) {
  const t = useTranslations("schedule.map");
  const [open, setOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const titleId = useId();
  const building = buildingOf(room);
  const rects = CAMPUS_BUILDINGS[building] ?? [];

  useEffect(() => {
    if (!open) return;
    const trigger = triggerRef.current;
    closeRef.current?.focus();
    document.body.style.overflow = "hidden";
    const onKey = (e: globalThis.KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
      trigger?.focus();
    };
  }, [open]);

  // Fokus zostaje w okienku (Tab / Shift+Tab krążą po jego elementach).
  function trapFocus(e: KeyboardEvent) {
    if (e.key !== "Tab" || !dialogRef.current) return;
    const items = dialogRef.current.querySelectorAll<HTMLElement>("a[href], button");
    const first = items[0];
    const last = items[items.length - 1];
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  }

  const [vx, vy, vw, vh] = buildingView(building);

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setOpen(true)}
        aria-label={t("show", { room })}
        className={`inline-flex items-center gap-1.5 rounded-full border border-violet/30 bg-violet-soft font-bold text-violet transition-colors hover:border-violet hover:bg-violet hover:text-white ${
          size === "sm" ? "px-2 py-0.5 text-xs" : "px-3 py-1 text-sm"
        }`}
      >
        <MapPin size={size === "sm" ? 12 : 15} weight="bold" />
        {room}
      </button>

      {open
        ? createPortal(
            <div
              className="fixed inset-0 z-50 flex items-center justify-center bg-ink/40 p-4 backdrop-blur-sm"
              onClick={() => setOpen(false)}
            >
              <div
                ref={dialogRef}
                role="dialog"
                aria-modal="true"
                aria-labelledby={titleId}
                onKeyDown={trapFocus}
                onClick={(e) => e.stopPropagation()}
                className="w-full max-w-2xl overflow-hidden rounded-2xl border border-line bg-surface shadow-2xl"
              >
                <div className="flex items-start justify-between gap-4 p-4 sm:p-5">
                  <div>
                    <h2 id={titleId} className="text-lg font-bold sm:text-xl">
                      {t("title", { room })}
                    </h2>
                    <p className="mt-0.5 text-sm text-ink-soft">{t("building", { building })}</p>
                  </div>
                  <button
                    ref={closeRef}
                    type="button"
                    onClick={() => setOpen(false)}
                    aria-label={t("close")}
                    className="rounded-lg p-1.5 text-ink-soft hover:bg-violet-soft hover:text-ink"
                  >
                    <X size={20} weight="bold" />
                  </button>
                </div>

                <svg
                  viewBox={`${vx} ${vy} ${vw} ${vh}`}
                  className="block w-full border-y border-line bg-[#e9e4dc]"
                  role="img"
                  aria-label={t("building", { building })}
                >
                  <image href={CAMPUS_MAP.src} width={CAMPUS_MAP.w} height={CAMPUS_MAP.h} />
                  {rects.map(([x1, y1, x2, y2], i) => (
                    <rect
                      key={i}
                      x={x1}
                      y={y1}
                      width={x2 - x1}
                      height={y2 - y1}
                      rx={10}
                      className="animate-pulse fill-violet/30 stroke-violet motion-reduce:animate-none"
                      strokeWidth={8}
                    />
                  ))}
                </svg>

                <div className="p-4 sm:p-5">
                  <Link
                    href="/mapa-kampusu"
                    className="inline-flex items-center gap-2 rounded-full border-2 border-violet px-4 py-2 text-sm font-bold text-violet transition-colors hover:bg-violet hover:text-white"
                  >
                    <MapTrifold size={17} weight="bold" />
                    {t("full")}
                  </Link>
                </div>
              </div>
            </div>,
            document.body
          )
        : null}
    </>
  );
}
