import { NextApiRequest, NextApiResponse } from "next";
import { auth } from "@clerk/nextjs/server"; // Use Clerk's backend auth function
import prisma from "@/lib/db";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { method } = req;

  // Get the authenticated user's ID from Clerk
  const { userId } = auth();

  // If no user is authenticated, return an error
  if (!userId) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  switch (method) {
    case "GET":
      try {
        const profile = await prisma.instructorProfile.findUnique({
          where: { userId },
          include: { user: true },
        });

        if (!profile) {
          return res.status(404).json({ error: "Profile not found" });
        }

        res.status(200).json(profile);
      } catch (error) {
        console.error("Error fetching profile:", error);
        res.status(500).json({ error: "Failed to fetch profile" });
      }
      break;

    case "PUT":
      try {
        const { title, specialization, biography, website, socialLinks } =
          req.body;

        const updatedProfile = await prisma.instructorProfile.update({
          where: { userId },
          data: {
            title,
            specialization,
            biography,
            website,
            socialLinks,
          },
        });

        res.status(200).json(updatedProfile);
      } catch (error) {
        console.error("Error updating profile:", error);
        res.status(500).json({ error: "Failed to update profile" });
      }
      break;

    default:
      res.setHeader("Allow", ["GET", "PUT"]);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}
