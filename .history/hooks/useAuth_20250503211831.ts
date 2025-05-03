import { useState } from "react";
import { useSignIn, useSignUp, useClerk } from "@clerk/nextjs";
import { SignInData, SignUpData } from "@/types/auth";
import { useSearchParams } from "next/navigation";
import prisma from "@/lib/db";

export default function useAuth() {
  const { signIn } = useSignIn();
  const { signUp } = useSignUp();
  const { setActive } = useClerk();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const searchParams = useSearchParams();
  const role = searchParams.get("role") || "student";

  const [signInData, setSignInData] = useState<SignInData>({
    email: "",
    password: "",
  });

  const [signUpData, setSignUpData] = useState<SignUpData>({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });

  const createPrismaUser = async (clerkUser: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
  }) => {
    try {
      console.log("Creating Prisma user with data:", clerkUser);

      // Validate input data
      if (!clerkUser.id) throw new Error("Clerk user ID is missing.");
      if (!clerkUser.email) throw new Error("Email is missing.");
      if (!clerkUser.firstName || !clerkUser.lastName)
        throw new Error("First name and last name are required.");

      const name = `${clerkUser.firstName} ${clerkUser.lastName}`.trim();

      // Check if user already exists
      const existingUser = await prisma.user.findUnique({
        where: { clerkId: clerkUser.id },
      });

      if (existingUser) {
        console.log("User already exists in Prisma:", existingUser);
        await prisma.user.update({
          where: { id: clerkUser.id },
          data: {
            email: clerkUser.email,
            name,
            role: role === "instructor" ? "INSTRUCTOR" : "STUDENT",
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
          role: role === "instructor" ? "INSTRUCTOR" : "STUDENT",
        },
      });
      console.log("Created new Prisma user:", clerkUser.id);
    } catch (error) {
      console.error("Error in createPrismaUser:", error);
      // Check for Prisma unique constraint error without instanceof
      if (
        error &&
        typeof error === "object" &&
        "code" in error &&
        error.code === "P2002"
      ) {
        const target = (error as any).meta?.target?.join(", ") || "field";
        throw new Error(`A user with this ${target} already exists.`);
      }
      throw new Error(
        error instanceof Error
          ? error.message
          : "Failed to create or update user in database."
      );
    }
  };

  return {
    signIn,
    signUp,
    setActive,
    isSubmitting,
    setIsSubmitting,
    useSignInState: () => [signInData, setSignInData] as const,
    useSignUpState: () => [signUpData, setSignUpData] as const,
    createPrismaUser,
  };
}
