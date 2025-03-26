import { useState } from "react";
import { useSignIn, useSignUp } from "@clerk/nextjs";
import { SignInData, SignUpData } from "@/types/auth";

export default function useAuth() {
  const { signIn, setActive: setSignInActive } = useSignIn();
  const { signUp, setActive: setSignUpActive } = useSignUp();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [signInData, setSignInData] = useState<SignInData>({
    email: "",
    password: "",
  });

  const [signUpData, setSignUpData] = useState<SignUpData>({
    name: "",
    email: "",
    password: "",
    phoneNumber: "",
    username: "",
  });

  return {
    signIn,
    signUp,
    setActive: (options: { session: string }) =>
      signIn ? setSignInActive(options) : setSignUpActive(options),
    isSubmitting,
    setIsSubmitting,
    useSignInState: () => [signInData, setSignInData] as const,
    useSignUpState: () => [signUpData, setSignUpData] as const,
  };
}
