import { useState } from "react";
import { useSignIn, useSignUp } from "@clerk/nextjs";
import { SignInData, SignUpData } from "@/types/auth";
import { useSearchParams } from "next/navigation";
import prisma from "@/lib/db";

export default function useAuth() {
  const { signIn, setActive: setSignInActive } = useSignIn();
  const { signUp, setActive: setSignUpActive } = useSignUp();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const searchParams = useSearchParams();
  const role = searchParams.get("role") || "student";

  const [signInData, setSignInData] = useState<SignInData>({
    email: "",
    password: "",
  });

  const [signUpData, setSignUpData] = useState<SignUpData>({
    username: "",
    email: "",
    password: "",
  });

  const createPrismaUser = async (clerkUser: {
    id: string;
    email: string;
    username?: string;
  }) => {
    try {
      await prisma.user.create({
        data: {
          id: clerkUser.id,
          clerkId: clerkUser.id,
          email: clerkUser.email,
          name: clerkUser.username || null,
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
    setActive: (options: { session: string }) => {
      if (signIn) {
        setSignInActive(options);
      } else {
        if (setSignUpActive) {
          setSignUpActive(options);
        }
      }
    },
    isSubmitting,
    setIsSubmitting,
    useSignInState: () => [signInData, setSignInData] as const,
    useSignUpState: () => [signUpData, setSignUpData] as const,
    createPrismaUser,
  };
}
