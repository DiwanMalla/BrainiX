import { NextApiRequest, NextApiResponse } from "next";
import { auth } from "@clerk/nextjs/server"; // Use Clerk's backend authentication
import prisma from "@/lib/db";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { method } = req;

  // Get authenticated user's ID from Clerk
  const { userId } = await auth();

  // If no user is authenticated, return an error
  if (!userId) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  switch (method) {
    case "GET":
      try {
        const courses = await prisma.course.findMany({
          where: { instructorId: userId }, // Use dynamic instructor ID
          include: { category: true },
        });
        res.status(200).json(courses);
      } catch (error) {
        console.error("Error fetching courses:", error);
        res.status(500).json({ error: "Failed to fetch courses" });
      }
      break;

    case "POST":
      try {
        const courseData = req.body;

        const course = await prisma.course.create({
          data: {
            ...courseData,
            instructorId: userId, // Assign dynamically fetched instructor ID
            publishedAt: courseData.status === "PUBLISHED" ? new Date() : null,
          },
        });

        res.status(201).json(course);
      } catch (error) {
        console.error("Error creating course:", error);
        res.status(500).json({ error: "Failed to create course" });
      }
      break;

    default:
      res.setHeader("Allow", ["GET", "POST"]);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}
