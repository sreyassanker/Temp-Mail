"use client";

import { useCallback, useMemo, useState } from "react";
import {
  generateAllAliases,
  type GmailAlias,
} from "@/app/lib/gmail-alias";
import { setStoredValue, useStoredValue } from "@/app/lib/use-stored-value";

const STORAGE_KEY = "tempgmail-address";

type AliasCategory = "dot" | "plus" | "googlemail";

const CATEGORY_META: Record<
  AliasCategory,
  { title: string; description: string; color: string }
> = {
  dot: {
    title: "Dot Trick",
    description: "Gmail ignores dots — all route to the same inbox",
    color: "bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300",
  },
  plus: {
    title: "Plus Alias",
    description: "Add +tag to organize incoming mail",
    color:
      "bg-violet-100 text-violet-700 dark:bg-violet-900/50 dark:text-violet-300",
  },
  googlemail: {
    title: "Googlemail Swap",
    description: "@googlemail.com = @gmail.com",
    color:
      "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-300",
  },
};

export default function TempGmailWidget() {
  const input = useStoredValue(STORAGE_KEY) ?? "";
  const [customTag, setCustomTag] = useState("");
  const [customTags, setCustomTags] = useState<string[]>([]);
  const [activeCategory, setActiveCategory] = useState<AliasCategory | "all">(
    "all"
  );
  const [copiedIndex, setCopiedIndex] = useState<string | null>(null);
  const [dismissedFor, setDismissedFor] = useState<string | null>(null);

  const { result, validationError } = useMemo(() => {
    const trimmed = input.trim();
    if (!trimmed) return { result: null, validationError: null };
    const r = generateAllAliases(trimmed, customTags);
    if (!r) {
      return {
        result: null,
        validationError: "Please enter a valid Gmail address (e.g. you@gmail.com)",
      };
    }
    return { result: r, validationError: null };
  }, [input, customTags]);

  const error = validationError && dismissedFor !== input ? validationError : null;

  const filteredAliases = useMemo(() => {
    if (!result) return [];
    const all: GmailAlias[] = [
      ...result.dotAliases,
      ...result.plusAliases,
      ...result.googlemailAliases,
    ];
    if (activeCategory === "all") return all;
    return all.filter((a) => a.type === activeCategory);
  }, [result, activeCategory]);

  const handleCopy = useCallback(async (address: string, key: string) => {
    try {
      await navigator.clipboard.writeText(address);
      setCopiedIndex(key);
      setTimeout(() => setCopiedIndex(null), 2000);
    } catch {
      // clipboard unavailable
    }
  }, []);

  const addCustomTag = useCallback(() => {
    const tag = customTag.trim().toLowerCase().replace(/[^a-z0-9-]/g, "");
    if (tag && !customTags.includes(tag) && tag.length <= 30) {
      setCustomTags((prev) => [...prev, tag]);
      setCustomTag("");
    }
  }, [customTag, customTags]);

  const removeCustomTag = useCallback((tag: string) => {
    setCustomTags((prev) => prev.filter((t) => t !== tag));
  }, []);

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setStoredValue(STORAGE_KEY, e.target.value);
    },
    []
  );

  return (
    <div className="w-full max-w-2xl overflow-hidden rounded-3xl border border-zinc-200/80 bg-white/90 shadow-2xl shadow-emerald-500/10 backdrop-blur dark:border-zinc-800 dark:bg-zinc-900/90">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-zinc-200/70 bg-zinc-50/70 px-5 py-4 dark:border-zinc-800 dark:bg-zinc-950/40">
        <div className="flex items-center gap-3">
          <span className="relative flex h-2.5 w-2.5">
            {result && (
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
            )}
            <span
              className={`relative inline-flex h-2.5 w-2.5 rounded-full ${
                result
                  ? "bg-emerald-500"
                  : "bg-zinc-300 dark:bg-zinc-600"
              }`}
            />
          </span>
          <span className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
            Gmail Alias Generator
          </span>
        </div>
        <span className="hidden text-xs text-zinc-500 sm:block dark:text-zinc-400">
          {result
            ? `${result.totalCount.toLocaleString()}+ possible aliases`
            : "Enter your Gmail address"}
        </span>
      </div>

      <div className="p-5 sm:p-6">
        {/* Error */}
        {error && (
          <div className="mb-4 flex items-center justify-between gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900 dark:bg-red-950/50 dark:text-red-300">
            <span>{error}</span>
            <button
              onClick={() => setDismissedFor(input)}
              className="shrink-0 text-red-500 hover:text-red-700 dark:hover:text-red-300"
              aria-label="Dismiss error"
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path
                  d="M18 6 6 18M6 6l12 12"
                  strokeLinecap="round"
                />
              </svg>
            </button>
          </div>
        )}

        {/* Input */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="flex min-w-0 flex-1 items-center gap-2 rounded-xl border border-zinc-200 bg-zinc-50 px-3 py-2.5 dark:border-zinc-700 dark:bg-zinc-950/50">
            <svg
              className="h-4 w-4 shrink-0 text-zinc-400"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <rect x="2" y="4" width="20" height="16" rx="2" />
              <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
            </svg>
            <input
              type="email"
              value={input}
              onChange={handleInputChange}
              placeholder="you@gmail.com"
              className="w-full bg-transparent font-mono text-sm text-zinc-800 outline-none placeholder:text-zinc-400 dark:text-zinc-200 dark:placeholder:text-zinc-600"
            />
          </div>
        </div>

        {/* Custom tags */}
        {result && (
          <div className="mt-4">
            <p className="mb-2 text-xs font-medium text-zinc-500 dark:text-zinc-400">
              Custom plus-tags (optional)
            </p>
            <div className="flex flex-wrap items-center gap-2">
              {customTags.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center gap-1 rounded-lg bg-violet-100 px-2.5 py-1 text-xs font-medium text-violet-700 dark:bg-violet-900/50 dark:text-violet-300"
                >
                  +{tag}
                  <button
                    onClick={() => removeCustomTag(tag)}
                    className="ml-0.5 text-violet-500 hover:text-violet-700 dark:text-violet-400 dark:hover:text-violet-200"
                    aria-label={`Remove tag ${tag}`}
                  >
                    ×
                  </button>
                </span>
              ))}
              <div className="flex items-center gap-1">
                <input
                  type="text"
                  value={customTag}
                  onChange={(e) => setCustomTag(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      addCustomTag();
                    }
                  }}
                  placeholder="e.g. shopify"
                  className="w-28 rounded-lg border border-zinc-200 bg-white px-2.5 py-1.5 text-xs font-mono text-zinc-700 outline-none focus:border-violet-400 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-300 dark:focus:border-violet-600"
                  maxLength={30}
                />
                <button
                  onClick={addCustomTag}
                  disabled={!customTag.trim()}
                  className="inline-flex items-center justify-center rounded-lg border border-zinc-200 px-2 py-1.5 text-xs text-zinc-600 transition hover:bg-zinc-100 disabled:opacity-40 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800"
                  aria-label="Add tag"
                >
                  +
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Category filter tabs */}
        {result && (
          <div className="mt-5 flex items-center gap-2 overflow-x-auto">
            {(
              ["all", "dot", "plus", "googlemail"] as (
                | "all"
                | AliasCategory
              )[]
            ).map((cat) => {
              const count =
                cat === "all"
                  ? filteredAliases.length
                  : cat === "dot"
                    ? result.dotAliases.length
                    : cat === "plus"
                      ? result.plusAliases.length
                      : result.googlemailAliases.length;
              return (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
                    activeCategory === cat
                      ? "bg-zinc-900 text-white dark:bg-white dark:text-zinc-900"
                      : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700"
                  }`}
                >
                  {cat === "all"
                    ? "All"
                    : cat === "dot"
                      ? "Dots"
                      : cat === "plus"
                        ? "Plus"
                        : "Googlemail"}
                  <span className="rounded-full bg-white/20 px-1.5 py-0.5 text-[10px] dark:bg-black/20">
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        )}

        {/* Alias list */}
        {result && (
          <div className="mt-4 max-h-80 overflow-y-auto rounded-xl border border-zinc-200 dark:border-zinc-800">
            {filteredAliases.length === 0 ? (
              <div className="flex flex-col items-center gap-2 px-6 py-10 text-center">
                <p className="text-sm font-medium text-zinc-600 dark:text-zinc-300">
                  No aliases in this category
                </p>
              </div>
            ) : (
              <ul className="divide-y divide-zinc-100 dark:divide-zinc-800">
                {filteredAliases.map((alias) => {
                  const key = `${alias.type}-${alias.address}`;
                  const isCopied = copiedIndex === key;
                  const meta = CATEGORY_META[alias.type];
                  return (
                    <li key={key}>
                      <div className="flex items-center gap-3 px-4 py-3 transition hover:bg-emerald-50/60 dark:hover:bg-zinc-800/60">
                        <div
                          className={`inline-flex shrink-0 items-center rounded-md px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide ${meta.color}`}
                        >
                          {alias.type === "dot"
                            ? "DOT"
                            : alias.type === "plus"
                              ? "PLUS"
                              : "MAIL"}
                        </div>
                        <span className="min-w-0 flex-1 truncate font-mono text-sm text-zinc-800 dark:text-zinc-200">
                          {alias.address}
                        </span>
                        <button
                          onClick={() => handleCopy(alias.address, key)}
                          className={`shrink-0 inline-flex items-center justify-center rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
                            isCopied
                              ? "bg-emerald-500 text-white"
                              : "bg-zinc-900 text-white hover:bg-zinc-700 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-white"
                          }`}
                        >
                          {isCopied ? (
                            <>
                              <svg
                                width="12"
                                height="12"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2.5"
                                className="mr-1"
                              >
                                <path
                                  d="m5 13 4 4L19 7"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                />
                              </svg>
                              Copied
                            </>
                          ) : (
                            "Copy"
                          )}
                        </button>
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        )}

        {/* Info / Tips section */}
        {!result && (
          <div className="mt-6 rounded-xl border border-zinc-200 bg-zinc-50/50 p-5 dark:border-zinc-800 dark:bg-zinc-950/30">
            <h4 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
              How it works
            </h4>
            <ul className="mt-3 space-y-2.5 text-xs leading-5 text-zinc-600 dark:text-zinc-400">
              <li className="flex items-start gap-2">
                <span className="mt-0.5 inline-flex h-4 w-4 shrink-0 items-center justify-center rounded bg-blue-100 text-[9px] font-bold text-blue-600 dark:bg-blue-900/50 dark:text-blue-300">
                  1
                </span>
                Enter your Gmail address above (e.g. you@gmail.com)
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-0.5 inline-flex h-4 w-4 shrink-0 items-center justify-center rounded bg-blue-100 text-[9px] font-bold text-blue-600 dark:bg-blue-900/50 dark:text-blue-300">
                  2
                </span>
                We generate dot variations, plus aliases, and Googlemail swaps
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-0.5 inline-flex h-4 w-4 shrink-0 items-center justify-center rounded bg-blue-100 text-[9px] font-bold text-blue-600 dark:bg-blue-900/50 dark:text-blue-300">
                  3
                </span>
                Copy any alias and use it for signups — all mail lands in your
                real Gmail inbox
              </li>
            </ul>
          </div>
        )}

        {/* Gmail filter tip */}
        {result && (
          <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50/50 p-4 dark:border-amber-900/50 dark:bg-amber-950/20">
            <div className="flex items-start gap-2.5">
              <svg
                className="mt-0.5 h-4 w-4 shrink-0 text-amber-600 dark:text-amber-400"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <circle cx="12" cy="12" r="10" />
                <path d="M12 16v-4M12 8h.01" strokeLinecap="round" />
              </svg>
              <div className="text-xs leading-5 text-amber-800 dark:text-amber-200">
                <p className="font-semibold">Pro tip: Create Gmail filters</p>
                <p className="mt-1">
                  In Gmail, go to{" "}
                  <span className="font-mono">Settings → Filters → Create new</span>{" "}
                  and set the &quot;To&quot; field to any alias. You can auto-label,
                  archive, or star messages from specific signups.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
