import {
  createAccount as createMailtmAccount,
  getActiveDomains as getMailtmDomains,
  getMessage as getMailtmMessage,
  listMessages as listMailtmMessages,
  randomLogin,
} from "./mailtm";
import {
  createAddress as createGuerrillaAddress,
  getMessage as getGuerrillaMessage,
  GUERRILLA_DOMAINS,
  listMessages as listGuerrillaMessages,
} from "./guerrillamail";
import type { MailMessage } from "./mailtm";

let mailtmDomainsCache: string[] | null = null;

async function mailtmDomains(): Promise<string[]> {
  if (!mailtmDomainsCache) {
    mailtmDomainsCache = await getMailtmDomains();
  }
  return mailtmDomainsCache;
}

function domainOf(address: string): string {
  return address.split("@")[1] ?? "";
}

function isGuerrillaDomain(domain: string): boolean {
  return GUERRILLA_DOMAINS.includes(domain);
}

export async function createMailbox(): Promise<{
  address: string;
  provider: "mail.tm" | "guerrillamail";
}> {
  try {
    const domains = await mailtmDomains();
    if (domains.length > 0) {
      const domain = domains[Math.floor(Math.random() * domains.length)];
      const address = `temp${randomLogin(10)}@${domain}`;
      await createMailtmAccount(address);
      return { address, provider: "mail.tm" };
    }
  } catch {
    // mail.tm unavailable (e.g. blocked cloud IP) — fall through
  }

  const address = await createGuerrillaAddress();
  return { address, provider: "guerrillamail" };
}

async function providerFor(address: string): Promise<"mail.tm" | "guerrillamail"> {
  const domain = domainOf(address);
  if (isGuerrillaDomain(domain)) return "guerrillamail";
  return "mail.tm";
}

export async function listMessages(address: string): Promise<MailMessage[]> {
  return (await providerFor(address)) === "guerrillamail"
    ? listGuerrillaMessages(address)
    : listMailtmMessages(address);
}

export async function getMessage(
  address: string,
  id: string
): Promise<MailMessage> {
  return (await providerFor(address)) === "guerrillamail"
    ? getGuerrillaMessage(address, id)
    : getMailtmMessage(address, id);
}