import { auth, clerkClient } from "@clerk/nextjs/server";
import type { Roles } from "@/types/globals";
import { redirect } from "next/navigation";

export default async function SetRole({
  searchParams,
}: {
  searchParams: { role?: string };
}) {
  const { userId } = await auth();
  console.log("SetRole - Auth result:", { userId });
  if (!userId) {
    console.error("Unauthorized in SetRole");
    redirect("/auth?tab=signin");
  }

  const role = (searchParams.role || "student").toLowerCase() as Roles;
  console.log("Received role in set-role:", role);
  console.log("Setting role for user:", userId, "to", role);

  const client = await clerkClient();
  await client.users.updateUser(userId, {
    publicMetadata: { role },
  });
  redirect("/");
}
