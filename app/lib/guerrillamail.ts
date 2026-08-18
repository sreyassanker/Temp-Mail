import type { MailboxFromTo, MailMessage } from "./mailtm";

const API_BASE = "https://api.guerrillamail.com/ajax.php";

export const GUERRILLA_DOMAINS = [
  "guerrillamail.com",
  "guerrillamailblock.com",
  "grr.la",
  "guerrillamail.biz",
  "guerrillamail.de",
  "guerrillamail.net",
  "guerrillamail.org",
  "guerrillamail.co",
  "guerrillamail.info",
  "spam4.me",
];

interface GuerrillaMessageSummary {
  mail_id: number;
  mail_from: string;
  mail_subject: string;
  mail_excerpt: string;
  mail_date: string;
  mail_read: number;
  mail_timestamp: number;
}

interface GuerrillaFullMessage extends GuerrillaMessageSummary {
  mail_body: string;
  mail_html: string;
  mail_recips: string[];
}

function parseFrom(raw: string): MailboxFromTo {
  const value = String(raw ?? "").trim();
  const match = value.match(/^"?([^"<]*)"?\s*<([^>]+)>$/);
  if (match) {
    return { name: match[1].trim() || undefined, address: match[2] };
  }
  return { address: value };
}

function timestampToIso(timestamp: number): string {
  if (!timestamp) return new Date().toISOString();
  return new Date(timestamp * 1000).toISOString();
}

async function ajax<T>(params: URLSearchParams): Promise<T> {
  const res = await fetch(`${API_BASE}?${params.toString()}`, {
    cache: "no-store",
  });
  if (!res.ok) throw new Error(`guerrillamail ${res.status}`);
  return res.json() as Promise<T>;
}

function normalizeSummary(m: GuerrillaMessageSummary): MailMessage {
  return {
    id: String(m.mail_id),
    msgid: String(m.mail_id),
    from: parseFrom(m.mail_from),
    to: [],
    subject: m.mail_subject ?? "",
    intro: m.mail_excerpt ?? "",
    seen: m.mail_read === 1,
    isDeleted: false,
    hasAttachments: false,
    size: 0,
    downloadUrl: null,
    createdAt: timestampToIso(m.mail_timestamp),
    updatedAt: timestampToIso(m.mail_timestamp),
  };
}

function normalizeFull(m: GuerrillaFullMessage): MailMessage {
  return {
    ...normalizeSummary(m),
    to: (m.mail_recips ?? []).map((address) => ({ address })),
    text: m.mail_body ?? "",
    html: m.mail_html ? [m.mail_html] : undefined,
  };
}

async function tokenForAddress(address: string): Promise<string> {
  const login = address.split("@")[0];
  const data = await ajax<{ sid_token?: string }>(
    new URLSearchParams({
      f: "set_email_user",
      email_user: login,
      lang: "en",
      site: "guerrillamail.com",
    })
  );
  const token = data.sid_token;
  if (!token) throw new Error("guerrillamail: no session token");
  return token;
}

export async function createAddress(): Promise<string> {
  const data = await ajax<{ email_addr?: string }>(
    new URLSearchParams({ f: "get_email_address" })
  );
  const address = data.email_addr;
  if (!address) throw new Error("guerrillamail: no address returned");
  return address;
}

export async function listMessages(address: string): Promise<MailMessage[]> {
  const token = await tokenForAddress(address);
  const data = await ajax<{ list?: GuerrillaMessageSummary[] }>(
    new URLSearchParams({
      f: "get_email_list",
      offset: "0",
      sid_token: token,
    })
  );
  return (data.list ?? []).map(normalizeSummary);
}

export async function getMessage(
  address: string,
  id: string
): Promise<MailMessage> {
  const token = await tokenForAddress(address);
  const data = await ajax<GuerrillaFullMessage>(
    new URLSearchParams({ f: "fetch_email", email_id: id, sid_token: token })
  );
  return normalizeFull(data);
}