import { NextResponse } from "next/server";
import { auth, clerkClient } from "@clerk/nextjs/server";
import prisma from "@/lib/db"; // Prisma client instance

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

    // Validate role
    const validRoles = ["STUDENT", "INSTRUCTOR", "ADMIN"];
    if (!validRoles.includes(role)) {
      return new NextResponse(JSON.stringify({ error: "Invalid role" }), {
        status: 400,
      });
    }

    // Update Clerk user metadata
    const client = await clerkClient();
    await client.users.updateUser(userId, {
      publicMetadata: { role },
    });

    // Update or create User record
    await prisma.user.upsert({
      where: { clerkId: userId },
      update: {
        role: role as "STUDENT" | "INSTRUCTOR" | "ADMIN",
      },
      create: {
        id: userId,
        clerkId: userId,
        email: (
          await client.users.getUser(userId)
        ).emailAddresses[0].emailAddress,
        role: role as "STUDENT" | "INSTRUCTOR" | "ADMIN",
      },
    });

    // If role is INSTRUCTOR, create/update InstructorProfile and delete any StudentProfile
    if (role === "INSTRUCTOR") {
      await prisma.instructorProfile.upsert({
        where: { userId },
        update: {}, // Update fields if needed
        create: {
          userId,
          title: "",
          specialization: "",
          biography: "",
          socialLinks: {},
        },
      });

      // Delete any existing StudentProfile
      await prisma.studentProfile.deleteMany({
        where: { userId },
      });
    } else if (role === "STUDENT") {
      // Create/update StudentProfile and delete any InstructorProfile
      await prisma.studentProfile.upsert({
        where: { userId },
        update: {}, // Update fields if needed
        create: {
          userId,
          interests: [],
          learningGoals: "",
          education: "",
          occupation: "",
        },
      });

      // Delete any existing InstructorProfile
      await prisma.instructorProfile.deleteMany({
        where: { userId },
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
