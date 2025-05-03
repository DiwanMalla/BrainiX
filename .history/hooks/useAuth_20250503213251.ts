import { useState } from "react";
import { useSignIn, useSignUp, useClerk } from "@clerk/nextjs";
import { SignInData, SignUpData } from "@/types/auth";
import { useSearchParams } from "next/navigation";
import { createPrismaUser } from "@/lib/actions/createUser";
import { isDisposableEmail } from "@/lib/utils/emailValidator";

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

  const validateSignUpData = (data: SignUpData) => {
    if (!data.firstName) throw new Error("First name is required.");
    if (!data.lastName) throw new Error("Last name is required.");
    if (!data.email) throw new Error("Email is required.");
    if (isDisposableEmail(data.email))
      throw new Error("Disposable emails are not allowed.");
    if (data.password.length < 8)
      throw new Error("Password must be at least 8 characters long.");
  };

  const handleCreateUser = async (clerkUser: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
  }) => {
    console.log("Creating Prisma user with data:", clerkUser);
    await createPrismaUser({
      ...clerkUser,
      role: role === "instructor" ? "INSTRUCTOR" : "STUDENT",
    });
    console.log("Prisma user creation completed");
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
    validateSignUpData, // Explicitly included in the return object
  };
}
