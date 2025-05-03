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

    await prisma.user.create({
      data: {
        id: clerkUser.id,
        clerkId: clerkUser.id,
        email: clerkUser.email,
        name,
        role: clerkUser.role,
      },
    });
  } catch (error: any) {
    console.error("Error creating Prisma user:", error);
    throw new Error("Database user creation failed.");
  }
}
