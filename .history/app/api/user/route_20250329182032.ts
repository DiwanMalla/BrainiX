"user server";
// pages/api/instructor.ts
import prisma from "@/lib/db"; // Assuming prisma is set up in the lib folder
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const instructor = await prisma.user.findFirst({
      where: {
        role: "INSTRUCTOR",
      },
      include: {
        courses: true, // If you need to fetch related courses
      },
    });

    if (instructor) {
      console.log("Instructor fetched:", instructor); // Debugging log
      return res.status(200).json(instructor);
    } else {
      return res.status(404).json({ message: "Instructor not found" });
    }
  } catch (error) {
    console.error("Error fetching instructor:", error); // Debugging log
    return res.status(500).json({ error: "Internal server error" });
  }
}
