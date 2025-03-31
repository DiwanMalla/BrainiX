import { NextApiRequest, NextApiResponse } from "next";
import { getAuth } from "@clerk/nextjs/server"; // Server-side Clerk auth
import prisma from "@/lib/db"; // Adjust path to your Prisma client

export default async function handler(req, res) {
  const { method } = req;

  // Get the authenticated user's ID from Clerk (server-side)
  const { userId } = getAuth(req);

  // If no user is authenticated, return an error
  if (!userId) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  // Fetch the user from Prisma's User table using clerkId
  let user;
  try {
    user = await prisma.user.findUnique({
      where: { clerkId: userId }, // clerkId links to Clerk's userId
    });
    if (!user) {
      return res.status(404).json({ error: "User not found in database" });
    }
  } catch (error) {
    console.error("Error fetching user:", error);
    return res.status(500).json({ error: "Failed to fetch user" });
  }

  switch (method) {
    case "GET":
      try {
        const profile = await prisma.instructorProfile.findUnique({
          where: { userId: user.id }, // Use Prisma's User.id
          include: { user: true }, // Include Prisma User data
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
          where: { userId: user.id }, // Use Prisma's User.id
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
