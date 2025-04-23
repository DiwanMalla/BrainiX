// app/api/webhooks/clerk/route.ts
import prisma from "@/lib/db";
import { Webhook } from "svix";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const payload = await req.json();
    const headers = req.headers;

    // Verify webhook signature
    if (!process.env.CLERK_WEBHOOK_SECRET) {
      throw new Error("CLERK_WEBHOOK_SECRET is not defined");
    }
    const wh = new Webhook(process.env.CLERK_WEBHOOK_SECRET);
    wh.verify(JSON.stringify(payload), {
      "svix-id": headers.get("svix-id") || "",
      "svix-timestamp": headers.get("svix-timestamp") || "",
      "svix-signature": headers.get("svix-signature") || "",
    });

    if (payload.type === "user.created") {
      const { id, email_addresses, first_name, last_name } = payload.data;
      await prisma.user.create({
        data: {
          id: id, // Use Clerk ID as User.id
          clerkId: id,
          email: email_addresses[0]?.email_address || "",
          name: `${first_name || ""} ${last_name || ""}`.trim() || null,
          role: "STUDENT",
          createdAt: new Date(),
        },
      });
      console.log(`User ${id} created in database`);
    }

    if (payload.type === "user.updated") {
      const { id, public_metadata } = payload.data;
      const role = public_metadata?.role || "STUDENT";
      const user = await prisma.user.update({
        where: { clerkId: id },
        data: { role },
      });
      if (role === "INSTRUCTOR") {
        await prisma.instructorProfile.upsert({
          where: { userId: user.id },
          update: {},
          create: {
            userId: user.id,
            createdAt: new Date(),
          },
        });
        console.log(`InstructorProfile created/updated for user ${id}`);
      }
    }

    return new NextResponse("Webhook processed", { status: 200 });
  } catch (error) {
    console.error("Webhook error:", error);
    return new NextResponse("Webhook error", { status: 400 });
  }
}
