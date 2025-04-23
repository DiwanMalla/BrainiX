import { NextResponse } from "next/server";
import { auth, clerkClient } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma"; // Adjust to your database client (e.g., Prisma, MongoDB)

export async function POST(req: Request) {
  const { userId, role } = await req.json();
  console.log("Auth result in set-role:", { userId, role });

  const session = await auth();
  if (!session.userId || session.userId !== userId) {
    return new NextResponse(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
    });
  }

  try {
    console.log("Setting role for user:", userId, "to", role);

    // Update Clerk user metadata
    const client = await clerkClient();
    await client.users.updateUser(userId, {
      publicMetadata: { role },
    });

    // Upsert user profile in the database based on role
    if (role === "instructor") {
      await prisma.instructorProfile.upsert({
        where: { userId },
        update: { userId, role },
        create: {
          userId,
          role,
          // Add other instructor-specific fields as needed
        },
      });
    } else {
      await prisma.studentProfile.upsert({
        where: { userId },
        update: { userId, role },
        create: {
          userId,
          role,
          // Add other student-specific fields as needed
        },
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error in set-role:", error);
    return new NextResponse(JSON.stringify({ error: "Failed to set role" }), {
      status: 500,
    });
  }
}
