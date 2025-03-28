if (type === "user.created" || type === "user.updated") {
  const {
    id,
    email_addresses,
    first_name,
    last_name,
    username,
    image_url,
    public_metadata,
  } = data;
  const email = email_addresses[0]?.email_address;
  const name =
    `${first_name || ""} ${last_name || ""}`.trim() || username || "User";
  const role = (public_metadata?.role as string) || "student";

  await prisma.user.upsert({
    where: { clerkId: id },
    update: {
      name,
      email,
      image: image_url,
      role: role.toUpperCase() as "STUDENT" | "INSTRUCTOR" | "ADMIN",
    },
    create: {
      id,
      clerkId: id,
      name,
      email,
      image: image_url,
      role: role.toUpperCase() as "STUDENT" | "INSTRUCTOR" | "ADMIN",
      ...(role === "instructor"
        ? { instructorProfile: { create: {} } }
        : { studentProfile: { create: {} } }),
    },
  });
}
