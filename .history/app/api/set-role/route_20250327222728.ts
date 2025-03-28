// app/api/set-role/route.ts
import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";

export async function POST(req: Request) {
  const { userId } = auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { role } = await req.json();

  const clerkClient = await import("@clerk/nextjs").then(
    (mod) => mod.clerkClient
  );
  await clerkClient.users.updateUser(userId, {
    publicMetadata: { role: role.toLowerCase() },
  });

  return NextResponse.json({ success: true });
}
