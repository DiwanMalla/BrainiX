// prisma/seed.js
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
  // First, create or get instructors
  const instructors = [
    { name: "Alex Johnson" },
    { name: "Maria Garcia" },
    { name: "John Smith" },
    { name: "Diwan Malla" },
  ];

  // Create instructors if they don't exist
  for (const instructor of instructors) {
    await prisma.user.upsert({
      where: {
        email: `${instructor.name.toLowerCase().replace(" ", ".")}@example.com`,
      },
      update: {},
      create: {
        email: `${instructor.name.toLowerCase().replace(" ", ".")}@example.com`,
        name: instructor.name,
        role: "INSTRUCTOR",
      },
    });
  }

  // Create a default category
  const category = await prisma.category.upsert({
    where: { slug: "programming" },
    update: {},
    create: {
      name: "Programming",
      slug: "programming",
      description: "Programming courses",
    },
  });

  const courses = [
    {
      slug: "advanced-react-patterns",
      title: "Advanced React Patterns",
      instructorName: "Alex Johnson",
      price: 79.99,
      thumbnail:
        "https://images.unsplash.com/photo-1633356122544-f134324a6cee?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80",
    },
    {
      slug: "nodejs-microservices",
      title: "Node.js Microservices",
      instructorName: "Maria Garcia",
      price: 89.99,
      thumbnail:
        "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80",
    },
    {
      slug: "full-stack-development-bootcamp",
      title: "Full-Stack Development Bootcamp",
      instructorName: "John Smith",
      price: 99.99,
      thumbnail:
        "https://images.unsplash.com/photo-1593720213428-28a5b9e94613?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80",
    },
    {
      slug: "modern-web-development",
      title: "Modern Web Development",
      instructorName: "Diwan Malla",
      price: 84.99,
      thumbnail:
        "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80",
    },
  ];

  for (const course of courses) {
    const instructor = await prisma.user.findFirst({
      where: { name: course.instructorName },
    });

    await prisma.course.upsert({
      where: { slug: course.slug },
      update: {},
      create: {
        title: course.title,
        slug: course.slug,
        description: `Learn ${course.title} with practical examples and projects`,
        shortDescription: `A comprehensive course on ${course.title}`,
        price: course.price,
        thumbnail: course.thumbnail,
        level: "INTERMEDIATE",
        status: "PUBLISHED",
        featured: true,
        bestseller: false,
        published: true,
        publishedAt: new Date(),
        language: "English",
        subtitlesLanguages: ["English", "Spanish"],
        certificateAvailable: true,
        duration: 1200, // 20 hours in minutes
        totalLessons: 30,
        totalModules: 5,
        requirements: [
          "Basic JavaScript knowledge",
          "Familiarity with web development",
        ],
        learningObjectives: [
          "Master core concepts",
          "Build real-world projects",
          "Learn best practices",
        ],
        targetAudience: ["Web developers", "Software engineers"],
        tags: [
          "programming",
          "web development",
          course.title.toLowerCase().replace(" ", "-"),
        ],
        rating: 4.5,
        totalStudents: 1500,
        topCompanies: ["Google", "Microsoft"],
        instructorId: instructor.id,
        categoryId: category.id,
      },
    });
  }

  console.log("Seed data created successfully");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
