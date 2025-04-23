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
  try {
    // First, find the user
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Update the role of the user
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        role,
        // Conditionally create or update profiles
        instructorProfile: role === UserRole.INSTRUCTOR
          ? {
              create: {
                userId,
                title: "Instructor Title",  // Add default values or make it dynamic
                specialization: "Specialization",
                biography: "Instructor Biography",
              },
            }
          : undefined,

        studentProfile: role === UserRole.STUDENT
          ? {
              create: {
                userId,
                interests: ["Interest 1", "Interest 2"],
                learningGoals: "Learning Goals",
              },
            }
          : undefined,
      },
    });

  return NextResponse.json({ success: true });
}
