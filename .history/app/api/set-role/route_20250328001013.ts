import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import Clerk from "@clerk/clerk-sdk-node"; // Correct way to import Clerk SDK

const clerk = new Clerk(); // Initialize Clerk SDK

export async function POST(req: Request) {
  const { userId } = await auth(); // Await auth()
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { role } = await req.json();
  console.log("Setting role for user:", userId, "to", role);

  await clerk.users.updateUser(userId, {
    publicMetadata: { role: role.toLowerCase() },
  });

  return NextResponse.json({ success: true });
}
