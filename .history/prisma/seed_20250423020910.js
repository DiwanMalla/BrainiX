const { PrismaClient } = require("@prisma/client");
const { v4: uuidv4 } = require("uuid");

const prisma = new PrismaClient();

async function main() {
  // Clear existing instructor-related data
  await prisma.instructorProfile.deleteMany();
  await prisma.user.deleteMany({ where: { role: "INSTRUCTOR" } });

  // Create instructor
  await prisma.user.create({
    data: {
      id: "user_2w5f0X2RjqeXtuIohkCnbJiScPk",
      clerkId: "user_2w5f0X2RjqeXtuIohkCnbJiScPk",
      name: "Diwan Malla",
      email: "malladipin@gmail.com",
      role: "INSTRUCTOR",
      instructorProfile: {
        create: {
          id: uuidv4(),
          title: "Senior Educator",
          specialization: "E-Learning and Technology",
          biography:
            "Diwan Malla is a passionate educator with 15 years of experience in online learning, specializing in technology and course development.",
          website: "https://diwanmalla.com",
          socialLinks: {
            twitter: "https://twitter.com/diwanmalla",
            linkedin: "https://linkedin.com/in/diwanmalla",
          },
          featured: true,
          totalStudents: 15000,
          totalCourses: 15,
          totalReviews: 500,
          averageRating: 4.7,
          totalRevenue: 25000.0,
        },
      },
    },
  });

  console.log("Instructor profile for Diwan Malla seeded successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
