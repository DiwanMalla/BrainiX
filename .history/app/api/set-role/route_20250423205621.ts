import { NextResponse } from "next/server";
import { auth, clerkClient } from "@clerk/nextjs/server";
import prisma from "@/lib/db";

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

    // Update or create User record and corresponding profile
    await prisma.user.upsert({
      where: { clerkId: userId },
      update: {
        role: role as "STUDENT" | "INSTRUCTOR" | "ADMIN",
      },
      create: {
        id: userId, // Or use a UUID if needed
        clerkId: userId,
        email: (
          await client.users.getUser(userId)
        ).emailAddresses[0].emailAddress,
        role: role as "STUDENT" | "INSTRUCTOR" | "ADMIN",
      },
    });

    // Create or update the appropriate profile based on role
    if (role === "INSTRUCTOR") {
      await prisma.instructorProfile.upsert({
        where: { userId },
        update: {}, // Update fields if needed
        create: {
          userId,
          title: "", // Add default or required fields
          specialization: "",
          biography: "",
          socialLinks: {},
        },
      });

      // Ensure no StudentProfile exists
      await prisma.studentProfile.deleteMany({
        where: { userId },
      });
    } else if (role === "STUDENT") {
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

      // Ensure no InstructorProfile exists
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
