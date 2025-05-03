import { useState } from "react";
import { useSignIn, useSignUp, useClerk } from "@clerk/nextjs";
import { SignInData, SignUpData } from "@/types/auth";
import { useSearchParams } from "next/navigation";
import { createPrismaUser } from "@/lib/actions/createUser"; // server action

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

  const handleCreateUser = async (clerkUser: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
  }) => {
    return createPrismaUser({
      ...clerkUser,
      role: role === "instructor" ? "INSTRUCTOR" : "STUDENT",
    });
  };

  return {
    signIn,
    signUp,
    setActive,
    isSubmitting,
    setIsSubmitting,
    useSignInState: () => [signInData, setSignInData] as const,
    useSignUpState: () => [signUpData, setSignUpData] as const,
    createPrismaUser: handleCreateUser,
  };
}
