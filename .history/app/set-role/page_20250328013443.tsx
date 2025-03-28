import { currentUser, clerkClient } from "@clerk/nextjs/server";
import type { Roles } from "@/types/globals";
import { redirect } from "next/navigation";

export default async function SetRole({
  searchParams,
}: {
  searchParams: { role?: string };
}) {
  const user = await currentUser(); // Use `currentUser()` instead of `auth()`
  console.log("SetRole - Auth result:", user);

  if (!user) {
    console.error("Unauthorized in SetRole");
    redirect("/auth?tab=signin");
  }

  const role = (searchParams.role || "student").toLowerCase() as Roles;
  console.log("Received role in set-role:", role);
  console.log("Setting role for user:", user.id, "to", role);

  const client = await clerkClient();
  await client.users.updateUser(user.id, {
    publicMetadata: { role },
  });
  redirect("/");
}
