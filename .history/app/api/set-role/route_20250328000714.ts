import { NextResponse } from "next/server";
import { auth, clerkClient } from "@clerk/nextjs/server"; // Import clerkClient directly
import { users } from "@clerk/nextjs/server";
export async function POST(req: Request) {
  const { userId } = await auth(); // Remove await
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { role } = await req.json();
  console.log("Setting role for user:", userId, "to", role); // Debug log

  await users.updateUser(userId, {
    publicMetadata: { role: role.toLowerCase() },
  });

  return NextResponse.json({ success: true });
}
