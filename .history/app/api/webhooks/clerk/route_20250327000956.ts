import { Webhook } from "svix";
import { headers } from "next/headers";
import prisma from "@/lib/db";

export async function POST(req: Request) {
  const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;
  if (!WEBHOOK_SECRET) {
    throw new Error("Missing CLERK_WEBHOOK_SECRET in .env");
  }

  const headerPayload = headers();
  const svix_id = headerPayload.get("svix-id");
  const svix_timestamp = headerPayload.get("svix-timestamp");
  const svix_signature = headerPayload.get("svix-signature");

  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response("Missing Svix headers", { status: 400 });
  }

  const payload = await req.json();
  const body = JSON.stringify(payload);

  const wh = new Webhook(WEBHOOK_SECRET);
  try {
    wh.verify(body, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    });
  } catch (err) {
    return new Response("Invalid webhook signature", { status: 400 });
  }

  const { type, data } = payload;

  if (type === "user.created" || type === "user.updated") {
    const { id, email_addresses, first_name, last_name, image_url } = data;
    const email = email_addresses[0]?.email_address;
    const name = `${first_name || ""} ${last_name || ""}`.trim() || "User";

    await prisma.user.upsert({
      where: { clerkId: id },
      update: {
        name,
        email,
        image: image_url,
      },
      create: {
        id, // Use Clerk's ID as the primary key
        clerkId: id,
        name,
        email,
        image: image_url,
        role: "STUDENT",
        studentProfile: { create: {} }, // Auto-create student profile
      },
    });
  }

  return new Response("Webhook processed", { status: 200 });
}
