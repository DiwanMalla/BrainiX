import { NextResponse } from "next/server";
import { auth, clerkClient } from "@clerk/nextjs/server";
import type { Roles } from "@/types/globals";

export async function POST(req: Request) {
  const { userId } = auth(); // Synchronous with middleware
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { role } = await req.json();
  console.log("Setting role for user:", userId, "to", role);

  await clerkClient.users.updateUser(userId, {
    publicMetadata: { role: role.toLowerCase() as Roles },
  });

  return NextResponse.json({ success: true });
}
