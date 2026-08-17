# TempMail — Free Temporary Email Address

A fast, free, and private **disposable email** web app built with [Next.js 16](https://nextjs.org) (App Router) and Tailwind CSS. Generate a throwaway email address in one click, receive messages, and read them right in your browser — no registration, ever. It also ships with a [Gmail Alias Generator](#-gmail-alias-generator) that creates hundreds of unique Gmail addresses from a single account.

![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js&logoColor=white)
![React](https://img.shields.io/badge/React-19-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-38bdf8)

---

## ✨ Features

- **Instant temp address** — generate a unique disposable email in a single click.
- **Zero registration** — no account, password, or personal data required.
- **Auto-refreshing inbox** — polls every 30 seconds, new mail appears automatically.
- **Read messages in-browser** — sender, subject, and full body in a clean reading view.
- **One-click copy** — grab your address and paste it into any signup form.
- **Privacy first** — inbox state is stored only in your browser; nothing is tracked.
- **Gmail alias generator** — generate unlimited aliases from your Gmail with dot tricks, plus tags, and Googlemail swaps.
- **Dark / light mode** — follows your system preference.
- **Fully responsive** — works beautifully on desktop and mobile.

---

## 🧰 Tech Stack

| Layer        | Technology                                              |
| ------------ | ------------------------------------------------------- |
| Framework    | [Next.js 16](https://nextjs.org) (App Router, Turbopack) |
| Language     | TypeScript                                              |
| Styling      | Tailwind CSS v4                                         |
| Email API    | [mail.tm](https://mail.tm) (disposable inbox backend)    |
| Alias engine | Gmail dot / plus / Googlemail tricks (client-side)      |
| Node runtime | Node.js 20.9+                                           |

---

## 🚀 Getting Started

### Prerequisites

- Node.js **20.9.0** or newer
- npm, yarn, pnpm, or bun

### Install & run locally

```bash
# 1. Clone the repository
git clone https://github.com/sreyassanker/Temp-Mail.git
cd Temp-Mail

# 2. Install dependencies
npm install

# 3. Start the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser.

### Production build

```bash
npm run build
npm start
```

---

## 🔍 How It Works

1. **Generate** — the app fetches an active domain from the mail.tm API and creates a fresh inbox.
2. **Use** — copy the address and use it anywhere that requires an email.
3. **Read** — incoming mail shows up in the live inbox; click any message to open it.
4. **Repeat** — generate a brand-new address whenever you want a clean slate.

### ✨ Gmail Alias Generator

Enter your Gmail address and get hundreds of unique addresses that still deliver to your real inbox — useful for taming spam, analytics, and signup filters without creating new accounts:

| Trick | Example | Why it works |
| ----- | ------- | ------------ |
| **Dot trick** | `j.ohndoe@gmail.com` = `johndoe@gmail.com` | Gmail ignores dots in the username |
| **Plus tag** | `johndoe+signup@gmail.com` | `+tag` routes to the base mailbox |
| **Googlemail swap** | `johndoe@googlemail.com` | `@googlemail.com` and `@gmail.com` are the same |

For a canonical username of length `n`, the generator can produce `2^(n-1)` dot variations (capped at 64 for performance), plus unlimited tag aliases and the Googlemail variant.

### API routes

| Method | Route             | Description                                    |
| ------ | ----------------- | ---------------------------------------------- |
| `POST` | `/api/mailbox`    | Create a new disposable mailbox, returns address |
| `GET`  | `/api/mailbox`    | List inbox messages (`?address=...`)           |
| `GET`  | `/api/mailbox`    | Read a single message (`?address=...&id=...`)  |

---

## 📁 Project Structure

```
app/
├── api/mailbox/route.ts      # API route handlers (create, list, read)
├── components/
│   ├── TempMailWidget.tsx    # Client widget: inbox, copy, auto-refresh, reader
│   └── TempGmailWidget.tsx   # Gmail alias generator widget
├── lib/
│   ├── mailtm.ts             # mail.tm API client + helpers
│   └── gmail-alias.ts        # Gmail dot / plus / Googlemail alias engine
├── globals.css               # Tailwind theme & design tokens
├── layout.tsx                # Root layout & metadata
└── page.tsx                  # Landing page
```

---

## 🛠️ Scripts

| Command           | Description                     |
| ----------------- | ------------------------------- |
| `npm run dev`     | Start dev server (Turbopack)    |
| `npm run build`   | Create optimized production build |
| `npm start`       | Run production build locally    |
| `npm run lint`    | Run ESLint                      |

---

## 📄 License

MIT — free to use, modify, and share. See the [LICENSE](./LICENSE) file for details.

> TempMail is for legitimate privacy protection (avoiding spam, protecting your personal inbox). Please use responsibly.
