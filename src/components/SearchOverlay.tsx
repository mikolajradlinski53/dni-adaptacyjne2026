"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import Fuse from "fuse.js";
import { MagnifyingGlass, X } from "@phosphor-icons/react";
import { Link } from "@/i18n/navigation";
import type { SearchEntry } from "@/lib/search";

type Labels = {
  open: string;
  placeholder: string;
  empty: string;
  hint: string;
  label: string;
};

export default function SearchOverlay({
  entries,
  labels,
}: {
  entries: SearchEntry[];
  labels: Labels;
}) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [mounted, setMounted] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => setMounted(true), []);

  const fuse = useMemo(
    () =>
      new Fuse(entries, {
        keys: [
          { name: "title", weight: 0.7 },
          { name: "description", weight: 0.3 },
        ],
        threshold: 0.35,
        ignoreLocation: true,
      }),
    [entries]
  );

  const results = useMemo(() => {
    if (!query.trim()) return [];
    return fuse.search(query.trim()).slice(0, 8);
  }, [fuse, query]);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((v) => !v);
      }
      if (e.key === "Escape") setOpen(false);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    if (open) {
      inputRef.current?.focus();
      document.body.style.overflow = "hidden";
    } else {
      setQuery("");
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        aria-label={labels.label}
        className="inline-flex items-center gap-2 rounded-full border border-line bg-surface px-3.5 py-2 text-sm font-medium text-ink-soft transition-colors hover:border-violet hover:text-ink"
      >
        <MagnifyingGlass size={18} weight="bold" />
        <span className="hidden md:inline">{labels.open}</span>
        <kbd className="hidden rounded-md border border-line px-1.5 py-0.5 text-[11px] font-semibold text-ink-soft lg:inline">
          ⌘K
        </kbd>
      </button>

      {open && mounted
        ? createPortal(
            <div
              role="dialog"
              aria-modal="true"
              aria-label={labels.label}
              className="fixed inset-0 z-50 flex items-start justify-center bg-ink/40 px-4 pt-[12vh] backdrop-blur-sm"
              onClick={() => setOpen(false)}
            >
          <div
            className="w-full max-w-xl overflow-hidden rounded-2xl border border-line bg-surface shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-3 border-b border-line px-4">
              <MagnifyingGlass size={20} weight="bold" className="text-violet" />
              <input
                ref={inputRef}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={labels.placeholder}
                className="w-full bg-transparent py-4 text-base outline-none placeholder:text-ink-soft/60"
              />
              <button
                onClick={() => setOpen(false)}
                aria-label="Esc"
                className="rounded-lg p-1.5 text-ink-soft hover:bg-violet-soft"
              >
                <X size={18} weight="bold" />
              </button>
            </div>

            <div className="max-h-[50vh] overflow-y-auto p-2">
              {query.trim() === "" ? (
                <p className="px-3 py-6 text-sm text-ink-soft">{labels.hint}</p>
              ) : results.length === 0 ? (
                <p className="px-3 py-6 text-sm text-ink-soft">
                  {labels.empty} „{query}”
                </p>
              ) : (
                <ul>
                  {results.map(({ item }) => (
                    <li key={`${item.href}-${item.title}`}>
                      <Link
                        href={item.href}
                        onClick={() => setOpen(false)}
                        className="block rounded-xl px-3 py-2.5 hover:bg-violet-soft"
                      >
                        <span className="flex items-baseline justify-between gap-3">
                          <span className="font-medium">{item.title}</span>
                          <span className="shrink-0 text-xs text-ink-soft">
                            {item.group}
                          </span>
                        </span>
                        {item.description ? (
                          <span className="mt-0.5 block truncate text-sm text-ink-soft">
                            {item.description}
                          </span>
                        ) : null}
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </div>
              </div>
            </div>,
            document.body
          )
        : null}
    </>
  );
}
