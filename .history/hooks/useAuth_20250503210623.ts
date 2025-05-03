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
      const name = `${clerkUser.firstName} ${clerkUser.lastName}`.trim();
      await prisma.user.create({
        data: {
          id: clerkUser.id,
          clerkId: clerkUser.id,
          email: clerkUser.email,
          name,
          role: role === "instructor" ? "INSTRUCTOR" : "STUDENT",
        },
      });
    } catch (error) {
      console.error("Failed to create Prisma user:", error);
      throw new Error("Failed to create user in database.");
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
