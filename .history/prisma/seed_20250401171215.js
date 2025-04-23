// prisma/seed.js
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
  // Create instructors
  const instructors = [
    { name: "Alex Johnson", email: "alex.johnson@example.com" },
    { name: "Maria Garcia", email: "maria.garcia@example.com" },
    { name: "John Smith", email: "john.smith@example.com" },
    { name: "Diwan Malla", email: "diwan.malla@example.com" },
  ];

  for (const instructor of instructors) {
    await prisma.user.upsert({
      where: { email: instructor.email },
      update: {},
      create: {
        email: instructor.email,
        name: instructor.name,
        role: "INSTRUCTOR",
      },
    });
  }

  // Create categories
  const categories = [
    { name: "Web Development", slug: "web-development" },
    { name: "Backend Development", slug: "backend-development" },
    { name: "Full-Stack Development", slug: "full-stack-development" },
  ];

  for (const category of categories) {
    await prisma.category.upsert({
      where: { slug: category.slug },
      update: {},
      create: {
        name: category.name,
        slug: category.slug,
        description: `${category.name} courses`,
      },
    });
  }

  const courses = [
    {
      slug: "advanced-react-patterns",
      title: "Advanced React Patterns",
      instructorName: "Alex Johnson",
      shortDescription:
        "Master advanced React patterns and techniques for building scalable applications.",
      description:
        "This course dives deep into advanced React concepts, patterns, and best practices...",
      thumbnail:
        "https://images.unsplash.com/photo-1633356122544-f134324a6cee?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80",
      rating: 4.7,
      totalStudents: 8234,
      price: 79.99,
      discountPrice: 79.99 * 0.85, // 15% discount
      bestseller: false,
      categoryName: "Web Development",
      learningObjectives: [
        "Implement advanced React patterns",
        "Optimize React performance",
        "Manage complex state",
        "Build reusable components",
      ],
      duration: 6 * 7 * 24 * 60, // 6 weeks in minutes
      totalLessons: 19,
    },
    {
      slug: "nodejs-microservices",
      title: "Node.js Microservices",
      instructorName: "Maria Garcia",
      shortDescription:
        "Learn to build scalable microservices using Node.js and modern architectures.",
      description:
        "Comprehensive guide to designing and implementing microservices with Node.js...",
      thumbnail:
        "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80",
      rating: 4.8,
      totalStudents: 6543,
      price: 89.99,
      discountPrice: 89.99 * 0.9, // 10% discount
      bestseller: true,
      categoryName: "Backend Development",
      learningObjectives: [
        "Design microservices architecture",
        "Implement Node.js services",
        "Handle service communication",
        "Deploy microservices",
      ],
      duration: 8 * 7 * 24 * 60, // 8 weeks in minutes
      totalLessons: 20,
    },
    {
      slug: "full-stack-development-bootcamp",
      title: "Full-Stack Development Bootcamp",
      instructorName: "John Smith",
      shortDescription:
        "Become a full-stack developer with this comprehensive bootcamp.",
      description:
        "Learn both frontend and backend development in this intensive program...",
      thumbnail:
        "https://images.unsplash.com/photo-1593720213428-28a5b9e94613?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80",
      rating: 4.9,
      totalStudents: 12345,
      price: 99.99,
      discountPrice: 99.99 * 0.75, // 25% discount
      bestseller: true,
      categoryName: "Full-Stack Development",
      learningObjectives: [
        "Build frontend with React",
        "Create backend with Node.js",
        "Work with databases",
        "Deploy full applications",
      ],
      duration: 10 * 7 * 24 * 60, // 10 weeks in minutes
      totalLessons: 28,
    },
    {
      slug: "modern-web-development",
      title: "Modern Web Development",
      instructorName: "Diwan Malla",
      shortDescription: "Master modern web development tools and techniques.",
      description:
        "Comprehensive course covering the latest web development technologies...",
      thumbnail:
        "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80",
      rating: 4.6,
      totalStudents: 5432,
      price: 84.99,
      discountPrice: 84.99 * 0.8, // 20% discount
      bestseller: false,
      categoryName: "Web Development",
      learningObjectives: [
        "Modern JavaScript techniques",
        "Latest CSS features",
        "Web performance optimization",
        "Development workflows",
      ],
      duration: 7 * 7 * 24 * 60, // 7 weeks in minutes
      totalLessons: 19,
    },
  ];

  for (const course of courses) {
    const instructor = await prisma.user.findFirst({
      where: { name: course.instructorName },
    });
    const category = await prisma.category.findFirst({
      where: { name: course.categoryName },
    });

    await prisma.course.upsert({
      where: { slug: course.slug },
      update: {},
      create: {
        title: course.title,
        slug: course.slug,
        description: course.description,
        shortDescription: course.shortDescription,
        price: course.price,
        discountPrice: course.discountPrice,
        thumbnail: course.thumbnail,
        level: course.slug.includes("advanced")
          ? "ADVANCED"
          : course.slug.includes("bootcamp")
          ? "BEGINNER"
          : "INTERMEDIATE",
        status: "PUBLISHED",
        featured: course.bestseller,
        bestseller: course.bestseller,
        published: true,
        publishedAt: new Date(),
        language: "English",
        subtitlesLanguages: ["English"],
        certificateAvailable: true,
        duration: course.duration,
        totalLessons: course.totalLessons,
        totalModules: Math.ceil(course.totalLessons / 5), // Rough estimate: 5 lessons per module
        requirements: ["Basic programming knowledge"],
        learningObjectives: course.learningObjectives,
        targetAudience: ["Developers", "Programmers"],
        tags: [course.categoryName.toLowerCase(), "programming"],
        rating: course.rating,
        totalStudents: course.totalStudents,
        topCompanies: course.slug.includes("react")
          ? ["Facebook", "Airbnb", "Netflix"]
          : course.slug.includes("nodejs")
          ? ["Netflix", "Uber", "PayPal"]
          : course.slug.includes("full-stack")
          ? ["Google", "Microsoft", "Amazon"]
          : ["Shopify", "Twitter", "LinkedIn"],
        instructorId: instructor.id,
        categoryId: category.id,
        createdAt: new Date("2025-03-31"), // Matches current date
        updatedAt: new Date("2025-03-31"),
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
