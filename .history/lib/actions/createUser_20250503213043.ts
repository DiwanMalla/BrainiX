"use server";

import prisma from "@/lib/db";

export async function createPrismaUser(clerkUser: {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: "INSTRUCTOR" | "STUDENT";
}) {
  try {
    const name = `${clerkUser.firstName} ${clerkUser.lastName}`.trim();

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { clerkId: clerkUser.id },
    });

    if (existingUser) {
      await prisma.user.update({
        where: { id: clerkUser.id },
        data: {
          email: clerkUser.email,
          name,
          role: clerkUser.role,
        },
      });
      console.log("Updated existing Prisma user:", clerkUser.id);
      return;
    }

    // Create new user
    await prisma.user.create({
      data: {
        id: clerkUser.id,
        clerkId: clerkUser.id,
        email: clerkUser.email,
        name,
        role: clerkUser.role,
      },
    });
    console.log("Created new Prisma user:", clerkUser.id);
  } catch (error: any) {
    console.error("Error creating Prisma user:", error);
    throw new Error(error.message || "Database user creation failed.");
  }
}
