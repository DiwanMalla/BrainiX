import { NextResponse } from "next/server";
import { clerkClient } from "@clerk/nextjs/server";

export async function POST(request: Request) {
  try {
    const { email, password, name } = await request.json();

    if (!email || !password || password.length < 8) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 400 }
      );
    }

    const client = await clerkClient();
    const [firstName, ...lastNameParts] = name.split(" ");
    const user = await client.users.createUser({
      emailAddress: [email],
      password,
      firstName: firstName || "Unknown",
      lastName: lastNameParts.join(" ") || "User",
    });

    return NextResponse.json({
      message: "Registration successful",
      userId: user.id,
    });
  } catch (error) {
    const err = error as any;
    console.error("Error creating user:", {
      message: err.message,
      status: err.status,
      clerkError: err.clerkError,
      errors: err.errors ? JSON.stringify(err.errors, null, 2) : "No errors array",
    });

    // Handle specific Clerk errors
    if (err.status === 422 && err.errors) {
      const pwnedError = err.errors.find((e: any) => e.code === "form_password_pwned");
      if (pwnedError) {
        return NextResponse.json(
          { error: "Password has been found in a data breach. Please use a different password." },
          { status: 400 }
        );
      }
      const emailExistsError = err.errors.find((e: any) => e.code === "form_identifier_exists");
      if (emailExistsError) {
        return NextResponse.json(
          { error: "Email address already exists. Please use a different email." },
          { status: 400 }
        );
      }
    }

    // Fallback for other errors
    return NextResponse.json(
      { error: "Registration failed", details: err.message || "Unknown error" },
      { status: 500 }
    );
  }
}