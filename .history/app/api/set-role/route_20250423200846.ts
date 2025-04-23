// app/api/set-role/route.ts (App Router) or pages/api/set-role.ts (Pages Router)
import { auth, clerkClient } from "@clerk/nextjs/server";
import { Prisma } from "@prisma/client"; // Your Prisma client
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { userId } = auth();
    if (!userId) {
      return new NextResponse(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
      });
    }

    const { role } = await req.json();
    if (!["STUDENT", "INSTRUCTOR", "ADMIN"].includes(role)) {
      return new NextResponse(JSON.stringify({ error: "Invalid role" }), {
        status: 400,
      });
    }

    console.log("Setting role for user:", userId, "to", role);

    // Update Clerk publicMetadata
    const client = await clerkClient();
    await client.users.updateUser(userId, {
      publicMetadata: { role },
    });

    // Update or create User in Prisma
    const user = await prisma.user.upsert({
      where: { clerkId: userId },
      update: { role },
      create: {
        clerkId: userId,
        role,
        email: "", // Fetch from Clerk if needed
        createdAt: new Date(),
      },
    });

    // If role is INSTRUCTOR, create/update InstructorProfile
    if (role === "INSTRUCTOR") {
      await prisma.instructorProfile.upsert({
        where: { userId: user.id },
        update: {}, // Update fields if needed
        create: {
          userId: user.id,
          createdAt: new Date(),
        },
      });
      console.log(`InstructorProfile created/updated for user ${userId}`);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error in /api/set-role:", error);
    return new NextResponse(
      JSON.stringify({ error: `Failed to update role: ${error.message}` }),
      {
        status: 500,
      }
    );
  }
}
