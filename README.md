# TempMail — Free Temporary Email Address

A fast, free, and private **disposable email** web app built with [Next.js 16](https://nextjs.org) (App Router) and Tailwind CSS. Generate a throwaway email address in one click, receive messages, and read them right in your browser — no registration, ever.

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
| Node runtime | Node.js 20.9+                                           |

---

## 🚀 Getting Started

### Prerequisites

- Node.js **20.9.0** or newer
- npm, yarn, pnpm, or bun

### Install & run locally

```bash
# 1. Install dependencies
npm install

# 2. Start the development server
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
│   └── TempMailWidget.tsx    # Client widget: inbox, copy, auto-refresh, reader
├── lib/
│   └── mailtm.ts             # mail.tm API client + helpers
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

MIT — free to use, modify, and share.

> TempMail is for legitimate privacy protection (avoiding spam, protecting your personal inbox). Please use responsibly.
