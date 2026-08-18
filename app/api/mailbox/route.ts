import { type NextRequest } from "next/server";
import { createMailbox, getMessage, listMessages } from "@/app/lib/mailbox";

export const dynamic = "force-dynamic";

export async function POST() {
  try {
    const { address } = await createMailbox();
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