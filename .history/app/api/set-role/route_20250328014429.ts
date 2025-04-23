import { NextResponse } from "next/server";
import { auth, clerkClient } from "@clerk/nextjs/server";

export async function POST(req: Request) {
  const { userId, role } = await req.json(); // Synchronous with middleware
  console.log("Auth result in set-role:", { userId });
  const session = await auth();

  if (!session.userId) {
    return new NextResponse(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
    });
  }

  console.log("Setting role for user:", userId, "to", role);

  const client = await clerkClient();
  await client.users.updateUser(userId, {
    publicMetadata: { role },
  });

  return NextResponse.json({ success: true });
}
