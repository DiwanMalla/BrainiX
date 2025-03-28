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
    const {
      id,
      email_addresses,
      first_name,
      last_name,
      username,
      image_url,
      public_metadata,
    } = data;
    const email = email_addresses[0]?.email_address;
    const name =
      `${first_name || ""} ${last_name || ""}`.trim() || username || "User";
    const role = (public_metadata?.role as string)?.toUpperCase() || "STUDENT";

    await prisma.user.upsert({
      where: { id },
      update: {
        name,
        email,
        image: image_url,
        role: role as "STUDENT" | "INSTRUCTOR" | "ADMIN",
      },
      create: {
        id,
        clerkId: id,
        name,
        email,
        image: image_url,
        role: role as "STUDENT" | "INSTRUCTOR" | "ADMIN",
        ...(role === "INSTRUCTOR"
          ? {
              instructorProfile: {
                create: {
                  title: "Instructor",
                  biography: "New instructor on BrainiX",
                },
              },
            }
          : {
              studentProfile: {
                create: {
                  interests: [],
                  learningGoals: "Learn new skills",
                },
              },
            }),
      },
    });
  }

  return new Response("Webhook processed", { status: 200 });
}
