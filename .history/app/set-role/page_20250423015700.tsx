import { PrismaClient, UserRole } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";
import { getAuth } from "@clerk/nextjs/server";

const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { userId: authUserId, sessionId } = getAuth(req);

  // Check if the userId exists, indicating the user is authenticated
  if (!authUserId) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  if (req.method === "POST") {
    const { userId, role } = req.body;

    if (!userId || !role) {
      return res.status(400).json({ error: "Missing userId or role" });
    }

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
      });

      // Handle existing profiles if the role has changed
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
  } else {
    return res.status(405).json({ error: "Method not allowed" });
  }
}
