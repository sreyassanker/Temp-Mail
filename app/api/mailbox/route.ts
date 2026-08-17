import { type NextRequest } from "next/server";
import {
  createAccount,
  getActiveDomains,
  getMessage,
  listMessages,
  randomLogin,
} from "@/app/lib/mailtm";

export const dynamic = "force-dynamic";

const RANDOM_PREFIX = "temp";

export async function POST() {
  try {
    const domains = await getActiveDomains();
    if (domains.length === 0) {
      return Response.json({ error: "No active mail domains available" }, { status: 503 });
    }

    const domain = domains[Math.floor(Math.random() * domains.length)];
    const login = randomLogin(10);
    const address = `${RANDOM_PREFIX}${login}@${domain}`;

    await createAccount(address);
    return Response.json({ address });
  } catch (err) {
    return Response.json(
      { error: err instanceof Error ? err.message : "Failed to create mailbox" },
      { status: 502 }
    );
  }
}

export async function GET(request: NextRequest) {
  const address = request.nextUrl.searchParams.get("address");
  if (!address) {
    return Response.json({ error: "Missing address query parameter" }, { status: 400 });
  }

  try {
    const id = request.nextUrl.searchParams.get("id");

    if (id) {
      const message = await getMessage(address, id);
      return Response.json(message);
    }

    const messages = await listMessages(address);
    return Response.json(messages);
  } catch (err) {
    return Response.json(
      { error: err instanceof Error ? err.message : "Failed to fetch messages" },
      { status: 502 }
    );
  }
}
