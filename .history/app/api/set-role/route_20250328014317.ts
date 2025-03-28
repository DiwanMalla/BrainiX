import { NextResponse } from "next/server";
import { auth, clerkClient } from "@clerk/nextjs/server";
import type { Roles } from "@/types/globals";

export async function POST(req: Request) {
  const { userId, role } = await auth(); // Synchronous with middleware
  console.log("Auth result in set-role:", { userId });
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  console.log("Setting role for user:", userId, "to", role);

  const client = await clerkClient();
  await client.users.updateUser(userId, {
    publicMetadata: { role: role.toLowerCase() as Roles },
  });

  return NextResponse.json({ success: true });
}
