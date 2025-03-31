"use client";
import prisma from "@/lib/db";

import { NextApiRequest, NextApiResponse } from "next";
import { useUser } from "@clerk/nextjs";
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { method } = req;

  // Assume instructor ID from auth (e.g., Clerk). Hardcoded for demo.
  const instructorId = "clerk_instructor_001";

  switch (method) {
    case "GET":
      try {
        const profile = await prisma.instructorProfile.findUnique({
          where: { userId: instructorId },
          include: { user: true },
        });
        if (!profile)
          return res.status(404).json({ error: "Profile not found" });
        res.status(200).json(profile);
      } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to fetch profile" });
      }
      break;

    case "PUT":
      try {
        const { title, specialization, biography, website, socialLinks } =
          req.body;
        const updatedProfile = await prisma.instructorProfile.update({
          where: { userId: instructorId },
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
        console.error(error);
        res.status(500).json({ error: "Failed to update profile" });
      }
      break;

    default:
      res.setHeader("Allow", ["GET", "PUT"]);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}
