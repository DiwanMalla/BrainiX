import { auth, clerkClient } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import type { Roles } from "@/types/globals";

export default async function SetRole({
  searchParams,
}: {
  searchParams: { role?: string };
}) {
  const { userId } = auth();
  console.log("SetRole - Auth result:", { userId });
  if (!userId) {
    console.error("Unauthorized in SetRole");
    redirect("/auth?tab=signin");
  }

  const role = (searchParams.role || "student").toLowerCase() as Roles;
  console.log("Setting role for user:", userId, "to", role);
  const client = clerkClient();
  await client.users.updateUser(userId, {
    publicMetadata: { role },
  });

  redirect("/"); // Redirect to home after setting role
}
