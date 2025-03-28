"use client";

import { useUser } from "@clerk/nextjs";

export default function InstructorPage() {
  const { user, isLoaded } = useUser();

  if (!isLoaded) return <div>Loading...</div>;
  if (!user) return <div>Please sign in.</div>;

  return (
    <div>
      <h1>Welcome, Instructor {user.firstName}!</h1>
      <p>Role: {user.publicMetadata?.role || "Not set"}</p>
    </div>
  );
}
