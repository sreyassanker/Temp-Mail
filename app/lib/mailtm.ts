import { createHash } from "node:crypto";

const API_BASE = "https://api.mail.tm";

export interface MailboxFromTo {
  address: string;
  name?: string;
}

export interface MailMessage {
  id: string;
  msgid: string;
  from: MailboxFromTo;
  to: MailboxFromTo[];
  subject: string;
  intro: string;
  seen: boolean;
  isDeleted: boolean;
  hasAttachments: boolean;
  size: number;
  downloadUrl: string | null;
  createdAt: string;
  updatedAt: string;
  text?: string;
  html?: string[];
}

interface DomainMember {
  "@id": string;
  "@type": string;
  id: string;
  domain: string;
  isActive: boolean;
  isPrivate: boolean;
  createdAt: string;
  updatedAt: string;
}

interface DomainResponse {
  "hydra:totalItems": number;
  "hydra:member": DomainMember[];
}

interface TokenResponse {
  token: string;
}

interface ListMessagesResponse {
  "hydra:totalItems": number;
  "hydra:member": MailMessage[];
}

async function api<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers ?? {}),
    },
    cache: "no-store",
  });

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`mail.tm ${res.status}: ${body}`);
  }

  return res.json() as Promise<T>;
}

export function passwordForAddress(address: string): string {
  return createHash("sha256")
    .update(`temp-mail-app:${address.toLowerCase()}`)
    .digest("hex")
    .slice(0, 32);
}

export async function getActiveDomains(): Promise<string[]> {
  const data = await api<DomainResponse>("/domains");
  return data["hydra:member"]
    .filter((d) => d.isActive)
    .map((d) => d.domain);
}

export async function createAccount(address: string): Promise<void> {
  await api("/accounts", {
    method: "POST",
    body: JSON.stringify({ address, password: passwordForAddress(address) }),
  });
}

export async function deleteAccount(address: string): Promise<void> {
  const token = await getToken(address);
  const account = await api<{ id: string }>("/me", {
    headers: { Authorization: `Bearer ${token}` },
  });
  await api(`/accounts/${account.id}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });
}

async function getToken(address: string): Promise<string> {
  const data = await api<TokenResponse>("/token", {
    method: "POST",
    body: JSON.stringify({ address, password: passwordForAddress(address) }),
  });
  return data.token;
}

export async function listMessages(address: string): Promise<MailMessage[]> {
  const token = await getToken(address);
  const data = await api<ListMessagesResponse>("/messages", {
    headers: { Authorization: `Bearer ${token}` },
  });
  return data["hydra:member"];
}

export async function getMessage(address: string, id: string): Promise<MailMessage> {
  const token = await getToken(address);
  return api<MailMessage>(`/messages/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
}

export function randomLogin(length = 10): string {
  const chars = "abcdefghijklmnopqrstuvwxyz0123456789";
  let login = "";
  for (let i = 0; i < length; i += 1) {
    login += chars[Math.floor(Math.random() * chars.length)];
  }
  return login;
}
