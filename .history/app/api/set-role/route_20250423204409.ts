import { NextResponse } from "next/server";
import { auth, clerkClient } from "@clerk/nextjs/server";
import prisma from "@/lib/db";

export async function POST(req: Request) {
  const { userId, role } = await req.json();
  console.log("Auth result in set-role:", { userId });

  const session = await auth();
  if (!session.userId) {
    return new NextResponse(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
    });
  }

  console.log("Setting role for user:", userId, "to", role);

  try {
    const client = await clerkClient();

    // Update Clerk user metadata with the role
    await client.users.updateUser(userId, {
      publicMetadata: { role },
    });

    // Map the incoming role string to the UserRole enum
    const roleMap: { [key: string]: string } = {
      student: "STUDENT",
      instructor: "INSTRUCTOR",
      admin: "ADMIN",
    };

    const prismaRole = roleMap[role.toLowerCase()];
    if (!prismaRole) {
      return NextResponse.json(
        { error: "Invalid role provided" },
        { status: 400 }
      );
    }

    // Check if the user exists in the Prisma User table
    let dbUser = await prisma.user.findUnique({
      where: { clerkId: userId },
    });

    // If user doesn't exist, create one
    if (!dbUser) {
      dbUser = await prisma.user.create({
        data: {
          clerkId: userId,
          email:
            (
              await client.users.getUser(userId)
            ).emailAddresses[0]?.emailAddress || "",
          name: (await client.users.getUser(userId)).firstName || "Unknown",
          role: prismaRole,
        },
      });
    } else {
      // Update the user's role in the database
      dbUser = await prisma.user.update({
        where: { clerkId: userId },
        data: { role: prismaRole },
      });
    }

    // If the role is instructor, ensure an InstructorProfile exists
    if (prismaRole === "INSTRUCTOR") {
      await prisma.instructorProfile.upsert({
        where: { userId: dbUser.id },
        update: {
          // Update fields if necessary, or leave empty to keep existing data
          title: "Instructor",
          specialization: "",
          biography: "",
          website: null,
          socialLinks: {},
          featured: false,
          totalStudents: 0,
          totalCourses: 0,
          totalReviews: 0,
          averageRating: 0,
          totalRevenue: 0,
        },
        create: {
          userId: dbUser.id,
          title: "Instructor",
          specialization: "",
          biography: "",
          website: null,
          socialLinks: {},
          featured: false,
          totalStudents: 0,
          totalCourses: 0,
          totalReviews: 0,
          averageRating: 0,
          totalRevenue: 0,
        },
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error setting role:", error);
    return NextResponse.json({ error: "Failed to set role" }, { status: 500 });
  }
}
