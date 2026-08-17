import TempMailWidget from "@/app/components/TempMailWidget";
import TempGmailWidget from "@/app/components/TempGmailWidget";

const features = [
  {
    title: "Instant Address",
    description: "Generate a fresh disposable email in a single click. No forms, no waiting, no verification.",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M13 2 3 14h7l-1 8 10-12h-7l1-8z" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    title: "Zero Registration",
    description: "No account, no email address, no password to remember. Your privacy is preserved by default.",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M16 11V7a4 4 0 0 0-8 0v4M6 11h12v10H6z" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    title: "Spam Shield",
    description: "Isolate every signup from your real inbox. Junk, marketing, and data brokers stay far away.",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M12 2l8 3v6c0 5.25-3.4 9.74-8 11-4.6-1.26-8-5.75-8-11V5l8-3z" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    title: "Auto-Refresh",
    description: "Your inbox polls itself every 30 seconds. New mail appears the moment it lands.",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M21 12a9 9 0 1 1-2.64-6.36M21 3v6h-6" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    title: "Mail Readable",
    description: "Open any message right in the browser. Sender, subject, and full body — all formatted.",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M4 6h16v12H4z" strokeLinejoin="round" />
        <path d="m4 7 8 6 8-6" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    title: "One-Click Copy",
    description: "Copy your temp address instantly and paste it into any signup form anywhere on the web.",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <rect x="9" y="9" width="11" height="11" rx="2" />
        <path d="M5 15V5a2 2 0 0 1 2-2h10" strokeLinecap="round" />
      </svg>
    ),
  },
];

const steps = [
  {
    number: "01",
    title: "Generate an address",
    description: "Click the button and get a unique disposable email address instantly. Nothing to install.",
  },
  {
    number: "02",
    title: "Use it anywhere",
    description: "Paste it into signup forms, free trials, downloads, or any site that demands your email.",
  },
  {
    number: "03",
    title: "Read and forget",
    description: "Check the inbox right here, open messages, then move on. The address self-isolates all spam.",
  },
];

const faqs = [
  {
    question: "What is a temporary email address?",
    answer:
      "A disposable, throwaway email address you can use instead of your personal one. It receives mail for a limited time, protecting your real inbox from spam, newsletters, and data collection.",
  },
  {
    question: "Is this really free?",
    answer:
      "Yes. Generating addresses and reading your inbox costs nothing. There are no trials, no paywalls, and no hidden limits for casual use.",
  },
  {
    question: "Do I need to create an account?",
    answer:
      "No account, password, or personal information is ever required. Your temp address is generated on the fly and stored only in your browser.",
  },
  {
    question: "How long does my address stay active?",
    answer:
      "Addresses remain usable while they receive mail. Since the inbox is real, you can keep returning to it for the emails that matter — or generate a new one whenever you like.",
  },
  {
    question: "Can I read the actual message content?",
    answer:
      "Absolutely. Click any message in your inbox to open the full body — sender, subject, and content — all rendered in a clean reading view.",
  },
];

export default function Home() {
  return (
    <>
      {/* Hero */}
      <header className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-b from-indigo-50 via-white to-white dark:from-zinc-950 dark:via-zinc-950 dark:to-zinc-950">
          <div className="absolute left-1/2 top-[-10rem] h-[30rem] w-[60rem] -translate-x-1/2 rounded-full bg-gradient-to-br from-indigo-200/60 to-violet-200/50 blur-3xl dark:from-indigo-900/30 dark:to-violet-900/30" />
        </div>

        <nav className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-6">
          <a href="#" className="flex items-center gap-2.5">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 shadow-lg shadow-indigo-500/30">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                <path d="M4 6h16v12H4z" strokeLinejoin="round" />
                <path d="m4 7 8 6 8-6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </span>
            <span className="text-lg font-bold tracking-tight text-zinc-900 dark:text-white">
              TempMail<span className="text-indigo-600 dark:text-indigo-400">.local</span>
            </span>
          </a>
          <div className="hidden items-center gap-8 text-sm font-medium text-zinc-600 md:flex dark:text-zinc-300">
            <a href="#features" className="transition hover:text-zinc-900 dark:hover:text-white">Features</a>
            <a href="#gmail-aliases" className="transition hover:text-zinc-900 dark:hover:text-white">Gmail Aliases</a>
            <a href="#how-it-works" className="transition hover:text-zinc-900 dark:hover:text-white">How it works</a>
            <a href="#faq" className="transition hover:text-zinc-900 dark:hover:text-white">FAQ</a>
            <a
              href="#try-it"
              className="rounded-lg bg-zinc-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-zinc-700 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200"
            >
              Try it now
            </a>
          </div>
        </nav>

        <div className="mx-auto grid w-full max-w-6xl items-center gap-12 px-6 pb-20 pt-10 lg:grid-cols-2 lg:pb-28 lg:pt-16">
          <div className="flex flex-col items-start gap-6">
            <span className="inline-flex items-center gap-2 rounded-full border border-indigo-200 bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-700 dark:border-indigo-900 dark:bg-indigo-950/60 dark:text-indigo-300">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 2l2.4 4.9 5.4.8-3.9 3.8.9 5.4-4.8-2.5-4.8 2.5.9-5.4L4.2 7.7l5.4-.8L12 2z" strokeLinejoin="round" />
              </svg>
              Free · No registration · Ad-free
            </span>
            <h1 className="text-4xl font-extrabold leading-tight tracking-tight text-zinc-900 sm:text-5xl lg:text-6xl dark:text-white">
              Your temporary email,{" "}
              <span className="bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent dark:from-indigo-400 dark:to-violet-400">
                instantly.
              </span>
            </h1>
            <p className="max-w-lg text-lg leading-8 text-zinc-600 dark:text-zinc-400">
              Keep your real inbox clean. Generate a disposable email address in one
              click, receive messages, and read them right here — without ever
              handing over your personal data.
            </p>
            <div className="flex flex-wrap items-center gap-4">
              <a
                href="#try-it"
                className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-600/30 transition hover:bg-indigo-500"
              >
                Get my temp email
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </a>
              <div className="flex items-center gap-2 text-sm text-zinc-500 dark:text-zinc-400">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M20 6 9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                Works in seconds
              </div>
            </div>

            <div className="mt-6 grid w-full max-w-md grid-cols-3 gap-4 border-t border-zinc-200 pt-6 dark:border-zinc-800">
              {[
                { value: "100%", label: "Free forever" },
                { value: "0", label: "Accounts to create" },
                { value: "30s", label: "Auto-refresh" },
              ].map((stat) => (
                <div key={stat.label}>
                  <p className="text-2xl font-bold text-zinc-900 dark:text-white">{stat.value}</p>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>

          <div id="try-it" className="flex justify-center scroll-mt-24">
            <TempMailWidget />
          </div>
        </div>
      </header>

      {/* Gmail Alias Generator */}
      <section id="gmail-aliases" className="scroll-mt-20 border-t border-zinc-200 bg-zinc-50 py-20 dark:border-zinc-800 dark:bg-zinc-900/50">
        <div className="mx-auto w-full max-w-6xl px-6">
          <div className="mx-auto max-w-2xl text-center">
            <span className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700 dark:border-emerald-900 dark:bg-emerald-950/60 dark:text-emerald-300">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              New: Gmail Alias Generator
            </span>
            <h2 className="mt-6 text-3xl font-bold tracking-tight text-zinc-900 sm:text-4xl dark:text-white">
              Unlimited Gmail aliases, instantly
            </h2>
            <p className="mt-4 text-lg leading-8 text-zinc-600 dark:text-zinc-400">
              Generate hundreds of unique Gmail addresses from your single account using dot tricks, plus aliases, and Googlemail swaps. All mail lands in your real inbox.
            </p>
          </div>
          <div className="mt-14 flex justify-center">
            <TempGmailWidget />
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="scroll-mt-20 border-t border-zinc-200 bg-white py-20 dark:border-zinc-800 dark:bg-zinc-950">
        <div className="mx-auto w-full max-w-6xl px-6">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-zinc-900 sm:text-4xl dark:text-white">
              Everything you need to stay spam-free
            </h2>
            <p className="mt-4 text-lg leading-8 text-zinc-600 dark:text-zinc-400">
              A complete disposable inbox without the usual friction of signing up for yet another service.
            </p>
          </div>
          <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="group rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:border-indigo-200 hover:shadow-xl hover:shadow-indigo-500/10 dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-indigo-900"
              >
                <div className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 transition group-hover:bg-indigo-600 group-hover:text-white dark:bg-indigo-950/60 dark:text-indigo-400">
                  {feature.icon}
                </div>
                <h3 className="text-lg font-semibold text-zinc-900 dark:text-white">{feature.title}</h3>
                <p className="mt-2 text-sm leading-6 text-zinc-600 dark:text-zinc-400">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="scroll-mt-20 bg-zinc-50 py-20 dark:bg-zinc-900/50">
        <div className="mx-auto w-full max-w-6xl px-6">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-zinc-900 sm:text-4xl dark:text-white">
              Three steps to a private inbox
            </h2>
            <p className="mt-4 text-lg leading-8 text-zinc-600 dark:text-zinc-400">
              The fastest way to protect your real email address — no tools to install.
            </p>
          </div>
          <div className="mt-14 grid gap-8 md:grid-cols-3">
            {steps.map((step) => (
              <div key={step.number} className="relative">
                <div className="flex items-center gap-4">
                  <span className="text-5xl font-extrabold tracking-tight text-indigo-200 dark:text-indigo-950">
                    {step.number}
                  </span>
                  <div className="h-px flex-1 bg-gradient-to-r from-indigo-200 to-transparent dark:from-indigo-900" />
                </div>
                <h3 className="mt-4 text-xl font-semibold text-zinc-900 dark:text-white">{step.title}</h3>
                <p className="mt-2 text-sm leading-6 text-zinc-600 dark:text-zinc-400">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA band */}
      <section className="relative overflow-hidden bg-zinc-950 py-20 dark:bg-zinc-950">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute left-1/2 top-1/2 h-[24rem] w-[52rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-r from-indigo-600/30 to-violet-600/30 blur-3xl" />
        </div>
        <div className="relative mx-auto w-full max-w-4xl px-6 text-center">
          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Ready to take your inbox back?
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-lg leading-8 text-zinc-400">
            One click and you have a fresh, private temp email. Try it now — it takes less than five seconds.
          </p>
          <a
            href="#try-it"
            className="mt-8 inline-flex items-center gap-2 rounded-xl bg-white px-8 py-3.5 text-sm font-semibold text-zinc-900 shadow-xl transition hover:bg-indigo-50"
          >
            Generate my temp email
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </a>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="scroll-mt-20 bg-white py-20 dark:bg-zinc-950">
        <div className="mx-auto w-full max-w-3xl px-6">
          <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight text-zinc-900 sm:text-4xl dark:text-white">
              Frequently asked questions
            </h2>
            <p className="mt-4 text-lg text-zinc-600 dark:text-zinc-400">
              Everything you need to know about temporary email.
            </p>
          </div>
          <div className="mt-12 space-y-3">
            {faqs.map((faq) => (
              <details
                key={faq.question}
                className="group rounded-xl border border-zinc-200 bg-zinc-50/50 open:bg-white dark:border-zinc-800 dark:bg-zinc-900/50 dark:open:bg-zinc-900"
              >
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-5 py-4 text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                  {faq.question}
                  <svg
                    className="h-4 w-4 shrink-0 text-zinc-400 transition-transform group-open:rotate-45"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M12 5v14M5 12h14" strokeLinecap="round" />
                  </svg>
                </summary>
                <p className="px-5 pb-4 text-sm leading-6 text-zinc-600 dark:text-zinc-400">{faq.answer}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-zinc-200 bg-white py-10 dark:border-zinc-800 dark:bg-zinc-950">
        <div className="mx-auto flex w-full max-w-6xl flex-col items-center justify-between gap-4 px-6 sm:flex-row">
          <div className="flex items-center gap-2.5">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                <path d="M4 6h16v12H4z" strokeLinejoin="round" />
                <path d="m4 7 8 6 8-6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </span>
            <span className="text-sm font-semibold text-zinc-900 dark:text-white">TempMail</span>
          </div>
          <p className="text-xs text-zinc-500 dark:text-zinc-400">
            © {new Date().getFullYear()} TempMail — Built with Next.js. Your privacy, protected.
          </p>
        </div>
      </footer>
    </>
  );
}
