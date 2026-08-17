"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { MailMessage } from "@/app/lib/mailtm";
import { setStoredValue, useStoredValue } from "@/app/lib/use-stored-value";

const STORAGE_KEY = "tempmail-address";
const REFRESH_MS = 30000;

function formatTime(iso: string): string {
  const date = new Date(iso);
  return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

function formatDate(iso: string): string {
  const date = new Date(iso);
  const today = new Date();
  const isToday = date.toDateString() === today.toDateString();
  return isToday
    ? `Today, ${formatTime(iso)}`
    : date.toLocaleDateString([], { month: "short", day: "numeric" });
}

function stripHtml(html: string): string {
  return html
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/gi, "'")
    .replace(/\s+/g, " ")
    .trim();
}

export default function TempMailWidget() {
  const address = useStoredValue(STORAGE_KEY);
  const [messages, setMessages] = useState<MailMessage[]>([]);
  const [selected, setSelected] = useState<MailMessage | null>(null);
  const [loading, setLoading] = useState(false);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [countdown, setCountdown] = useState(REFRESH_MS / 1000);

  const refreshTimer = useRef<ReturnType<typeof setInterval> | null>(null);
  const countdownTimer = useRef<ReturnType<typeof setInterval> | null>(null);

  const fetchMessages = useCallback(async (addr: string) => {
    try {
      setError(null);
      const res = await fetch(`/api/mailbox?address=${encodeURIComponent(addr)}`, {
        cache: "no-store",
      });
      if (!res.ok) {
        const data = await res.json().catch(() => null);
        throw new Error(data?.error ?? "Failed to fetch inbox");
      }
      const list: MailMessage[] = await res.json();
      setMessages(list);
      setCountdown(REFRESH_MS / 1000);
      return list;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch inbox");
      return [];
    }
  }, []);

  const createMailbox = useCallback(async () => {
    setCreating(true);
    setError(null);
    try {
      const res = await fetch("/api/mailbox", { method: "POST" });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error ?? "Failed to create mailbox");
      setStoredValue(STORAGE_KEY, data.address);
      setSelected(null);
      await fetchMessages(data.address);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create mailbox");
    } finally {
      setCreating(false);
    }
  }, [fetchMessages]);

  const copyAddress = useCallback(async () => {
    if (!address) return;
    try {
      await navigator.clipboard.writeText(address);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setError("Clipboard unavailable in this browser");
    }
  }, [address]);

  const refresh = useCallback(async () => {
    if (!address) return;
    setLoading(true);
    try {
      await fetchMessages(address);
    } finally {
      setLoading(false);
    }
  }, [address, fetchMessages]);

  const openMessage = useCallback(
    async (id: string) => {
      if (!address) return;
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(
          `/api/mailbox?address=${encodeURIComponent(address)}&id=${encodeURIComponent(id)}`,
          { cache: "no-store" }
        );
        const data = await res.json();
        if (!res.ok) throw new Error(data?.error ?? "Failed to read message");
        setSelected(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to read message");
      } finally {
        setLoading(false);
      }
    },
    [address]
  );

  const newMailbox = useCallback(async () => {
    await createMailbox();
  }, [createMailbox]);

  useEffect(() => {
    if (address && autoRefresh) {
      refreshTimer.current = setInterval(() => {
        void fetchMessages(address);
      }, REFRESH_MS);
      countdownTimer.current = setInterval(() => {
        setCountdown((prev) => (prev <= 1 ? REFRESH_MS / 1000 : prev - 1));
      }, 1000);
    }

    return () => {
      if (refreshTimer.current) clearInterval(refreshTimer.current);
      if (countdownTimer.current) clearInterval(countdownTimer.current);
    };
  }, [address, autoRefresh, fetchMessages]);

  return (
    <div className="w-full max-w-2xl overflow-hidden rounded-3xl border border-zinc-200/80 bg-white/90 shadow-2xl shadow-indigo-500/10 backdrop-blur dark:border-zinc-800 dark:bg-zinc-900/90">
      <div className="flex items-center justify-between border-b border-zinc-200/70 bg-zinc-50/70 px-5 py-4 dark:border-zinc-800 dark:bg-zinc-950/40">
        <div className="flex items-center gap-3">
          <span className="relative flex h-2.5 w-2.5">
            {address && (
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
            )}
            <span
              className={`relative inline-flex h-2.5 w-2.5 rounded-full ${
                address ? "bg-emerald-500" : "bg-zinc-300 dark:bg-zinc-600"
              }`}
            />
          </span>
          <span className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
            Disposable Inbox
          </span>
        </div>
        <span className="hidden text-xs text-zinc-500 sm:block dark:text-zinc-400">
          {address ? "Auto-refreshes every 30s" : "No address active"}
        </span>
      </div>

      <div className="p-5 sm:p-6">
        {error && (
          <div className="mb-4 flex items-center justify-between gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900 dark:bg-red-950/50 dark:text-red-300">
            <span>{error}</span>
            <button
              onClick={() => setError(null)}
              className="shrink-0 text-red-500 hover:text-red-700 dark:hover:text-red-300"
              aria-label="Dismiss error"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 6 6 18M6 6l12 12" strokeLinecap="round" />
              </svg>
            </button>
          </div>
        )}

        {!address ? (
          <div className="flex flex-col items-center gap-5 py-10 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 shadow-lg shadow-indigo-500/30">
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.8">
                <path d="M4 6h16v12H4z" strokeLinejoin="round" />
                <path d="m4 7 8 6 8-6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <div>
              <p className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
                Your temp email is one click away
              </p>
              <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
                No registration. No spam. No sign-ups, ever.
              </p>
            </div>
            <button
              onClick={() => void createMailbox()}
              disabled={creating}
              className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-600/30 transition hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {creating ? (
                <>
                  <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                  </svg>
                  Creating…
                </>
              ) : (
                <>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M12 5v14M5 12h14" strokeLinecap="round" />
                  </svg>
                  Generate temp email
                </>
              )}
            </button>
          </div>
        ) : (
          <>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <div className="flex min-w-0 flex-1 items-center gap-2 rounded-xl border border-zinc-200 bg-zinc-50 px-3 py-2.5 dark:border-zinc-700 dark:bg-zinc-950/50">
                <svg className="h-4 w-4 shrink-0 text-zinc-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M4 6h16v12H4z" strokeLinejoin="round" />
                  <path d="m4 7 8 6 8-6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <span className="truncate font-mono text-sm text-zinc-800 dark:text-zinc-200">
                  {address}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => void copyAddress()}
                  className={`inline-flex items-center justify-center gap-1.5 rounded-xl px-4 py-2.5 text-sm font-semibold transition ${
                    copied
                      ? "bg-emerald-500 text-white"
                      : "bg-zinc-900 text-white hover:bg-zinc-700 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-white"
                  }`}
                >
                  {copied ? (
                    <>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <path d="m5 13 4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                      Copied
                    </>
                  ) : (
                    <>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <rect x="9" y="9" width="11" height="11" rx="2" />
                        <path d="M5 15V5a2 2 0 0 1 2-2h10" strokeLinecap="round" />
                      </svg>
                      Copy
                    </>
                  )}
                </button>
                <button
                  onClick={() => void newMailbox()}
                  disabled={creating}
                  title="Generate a new address"
                  className="inline-flex items-center justify-center rounded-xl border border-zinc-300 px-3 py-2.5 text-zinc-600 transition hover:bg-zinc-100 disabled:opacity-50 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M12 5v14M5 12h14" strokeLinecap="round" />
                  </svg>
                </button>
              </div>
            </div>

            <div className="mt-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => void refresh()}
                  disabled={loading}
                  className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-medium text-zinc-600 transition hover:bg-zinc-100 disabled:opacity-50 dark:text-zinc-300 dark:hover:bg-zinc-800"
                >
                  <svg
                    className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`}
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M21 12a9 9 0 1 1-2.64-6.36M21 3v6h-6" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  Refresh
                </button>
                <label className="flex cursor-pointer items-center gap-1.5 text-xs text-zinc-500 dark:text-zinc-400">
                  <input
                    type="checkbox"
                    checked={autoRefresh}
                    onChange={(e) => setAutoRefresh(e.target.checked)}
                    className="h-3.5 w-3.5 rounded accent-indigo-600"
                  />
                  Auto
                  <span className="font-mono tabular-nums">({countdown}s)</span>
                </label>
              </div>
              <span className="text-xs font-medium text-zinc-500 dark:text-zinc-400">
                {messages.length === 0 ? "Inbox empty" : `${messages.length} message${messages.length === 1 ? "" : "s"}`}
              </span>
            </div>

            <div className="mt-3 max-h-72 overflow-y-auto rounded-xl border border-zinc-200 dark:border-zinc-800">
              {messages.length === 0 ? (
                <div className="flex flex-col items-center gap-2 px-6 py-10 text-center">
                  <svg className="h-8 w-8 text-zinc-300 dark:text-zinc-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M4 6h16v12H4z" strokeLinejoin="round" />
                    <path d="m4 7 8 6 8-6" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  <p className="text-sm font-medium text-zinc-600 dark:text-zinc-300">
                    Waiting for incoming emails
                  </p>
                  <p className="text-xs text-zinc-400 dark:text-zinc-500">
                    Send a message to your temp address and it will appear here.
                  </p>
                </div>
              ) : (
                <ul className="divide-y divide-zinc-100 dark:divide-zinc-800">
                  {messages.map((msg) => (
                    <li key={msg.id}>
                      <button
                        onClick={() => void openMessage(msg.id)}
                        className="flex w-full items-center gap-3 px-4 py-3 text-left transition hover:bg-indigo-50/60 dark:hover:bg-zinc-800/60"
                      >
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-indigo-100 text-xs font-bold text-indigo-600 dark:bg-indigo-900/50 dark:text-indigo-300">
                          {(msg.from.name || msg.from.address).charAt(0).toUpperCase()}
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-baseline justify-between gap-2">
                            <span className="truncate text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                              {msg.from.name || msg.from.address}
                            </span>
                            <span className="shrink-0 text-[11px] text-zinc-400 dark:text-zinc-500">
                              {formatDate(msg.createdAt)}
                            </span>
                          </div>
                          <p className="truncate text-sm text-zinc-700 dark:text-zinc-300">
                            {msg.subject || "(no subject)"}
                          </p>
                          {msg.intro && (
                            <p className="truncate text-xs text-zinc-400 dark:text-zinc-500">
                              {stripHtml(msg.intro)}
                            </p>
                          )}
                        </div>
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </>
        )}
      </div>

      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
          <div className="flex max-h-[85vh] w-full max-w-xl flex-col overflow-hidden rounded-3xl border border-zinc-200 bg-white shadow-2xl dark:border-zinc-800 dark:bg-zinc-900">
            <div className="flex items-center justify-between border-b border-zinc-200 px-5 py-4 dark:border-zinc-800">
              <button
                onClick={() => setSelected(null)}
                className="inline-flex items-center gap-1.5 text-sm font-medium text-zinc-600 transition hover:text-zinc-900 dark:text-zinc-300 dark:hover:text-white"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M19 12H5M12 19l-7-7 7-7" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                Back to inbox
              </button>
              <button
                onClick={() => setSelected(null)}
                className="rounded-lg p-1.5 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-700 dark:hover:bg-zinc-800"
                aria-label="Close"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M18 6 6 18M6 6l12 12" strokeLinecap="round" />
                </svg>
              </button>
            </div>
            <div className="flex-1 overflow-y-auto px-5 py-5">
              <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
                {selected.subject || "(no subject)"}
              </h3>
              <div className="mt-3 flex items-center gap-3 border-b border-zinc-100 pb-4 dark:border-zinc-800">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-100 text-sm font-bold text-indigo-600 dark:bg-indigo-900/50 dark:text-indigo-300">
                  {(selected.from.name || selected.from.address).charAt(0).toUpperCase()}
                </div>
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                    {selected.from.name || selected.from.address}
                  </p>
                  <p className="truncate text-xs text-zinc-500 dark:text-zinc-400">
                    {selected.from.address} · {formatDate(selected.createdAt)}
                  </p>
                </div>
              </div>
              <div className="mt-4 whitespace-pre-wrap text-sm leading-6 text-zinc-700 dark:text-zinc-300">
                {selected.text && selected.text.length > 0
                  ? selected.text
                  : selected.html && selected.html.length > 0
                    ? stripHtml(selected.html.join(""))
                    : "This message contains no readable text content."}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
