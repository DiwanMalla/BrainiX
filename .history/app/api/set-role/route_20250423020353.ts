import { PrismaClient, UserRole } from "@prisma/client";
import { NextResponse } from "next/server";
import { auth, clerkClient } from "@clerk/nextjs/server";
const prisma = new PrismaClient();
export async function POST(req: Request, res: NextResponse) {
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
  try {
    // First, find the user
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Update the role of the user
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        role,
        // Conditionally create or update profiles
        instructorProfile:
          role === UserRole.INSTRUCTOR
            ? {
                create: {
                  userId,
                  title: "Instructor Title", // Add default values or make it dynamic
                  specialization: "Specialization",
                  biography: "Instructor Biography",
                },
              }
            : undefined,

        studentProfile:
          role === UserRole.STUDENT
            ? {
                create: {
                  userId,
                  interests: ["Interest 1", "Interest 2"],
                  learningGoals: "Learning Goals",
                },
              }
            : undefined,
      },
    }); // Handle existing profiles if the role has changed
    if (role === UserRole.INSTRUCTOR) {
      // If role is changed to instructor, remove the student profile if exists
      await prisma.studentProfile.delete({
        where: { userId },
      });
    } else if (role === UserRole.STUDENT) {
      // If role is changed to student, remove the instructor profile if exists
      await prisma.instructorProfile.delete({
        where: { userId },
      });
    }

    return res
      .status(200)
      .json({ message: "Role updated successfully", user: updatedUser });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal server error" });
  }

  return NextResponse.json({ success: true });
}
