const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const coursesData = [
  {
    id: "1",
    slug: "web-development-bootcamp",
    title: "Web Development Bootcamp",
    instructor: "Diwan Malla",
    shortDescription:
      "Learn modern web development from scratch with HTML, CSS, JavaScript, React, Node.js and more.",
    description:
      "This comprehensive bootcamp takes you from absolute beginner to professional web developer...",
    image:
      "https://images.unsplash.com/photo-1547658719-da2b51169166?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
    rating: 4.9,
    students: 15432,
    lastUpdated: "October 2023",
    language: "English",
    level: "Beginner to Advanced",
    duration: "12 weeks",
    price: 89.99,
    discount: 20,
    bestseller: true,
    category: "Web Development",
    whatYoullLearn: [
      "Build responsive websites using HTML5, CSS3, and JavaScript",
      "Create dynamic web applications with React",
      "Develop back-end services using Node.js and Express",
      "Work with databases like MongoDB",
      "Deploy your applications to the web",
      "Implement authentication and authorization",
    ],
    syllabus: [
      { title: "HTML5 Fundamentals", lectures: 10, duration: "5 hours" },
      {
        title: "CSS3 and Responsive Design",
        lectures: 12,
        duration: "6 hours",
      },
      { title: "JavaScript Basics", lectures: 15, duration: "8 hours" },
      {
        title: "Advanced JavaScript Concepts",
        lectures: 10,
        duration: "6 hours",
      },
      { title: "Introduction to React", lectures: 12, duration: "7 hours" },
      {
        title: "Building React Applications",
        lectures: 15,
        duration: "9 hours",
      },
      { title: "Node.js and Express", lectures: 10, duration: "6 hours" },
      {
        title: "MongoDB and Database Integration",
        lectures: 8,
        duration: "5 hours",
      },
      {
        title: "Authentication and Security",
        lectures: 6,
        duration: "4 hours",
      },
      {
        title: "Deployment and Best Practices",
        lectures: 5,
        duration: "3 hours",
      },
    ],
    topCompanies: ["Google", "Facebook", "Amazon", "Microsoft", "Shopify"],
  },
  {
    id: "2",
    slug: "data-science-fundamentals",
    title: "Data Science Fundamentals",
    instructor: "Diwan Malla",
    shortDescription:
      "Master the essential skills of data science including Python, statistics, machine learning, and data visualization.",
    description:
      "This course provides a comprehensive introduction to data science...",
    image:
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
    rating: 4.8,
    students: 12345,
    lastUpdated: "September 2023",
    language: "English",
    level: "Intermediate",
    duration: "10 weeks",
    price: 79.99,
    category: "Data Science",
    whatYoullLearn: [
      "Master Python for data analysis using NumPy, Pandas, and Matplotlib",
      "Apply statistical methods to analyze and interpret data",
      "Build and evaluate machine learning models",
      "Create compelling data visualizations",
      "Work with real-world datasets to solve practical problems",
      "Communicate data insights effectively",
    ],
    syllabus: [
      {
        title: "Introduction to Python for Data Science",
        lectures: 8,
        duration: "4 hours",
      },
      {
        title: "Data Manipulation with NumPy and Pandas",
        lectures: 10,
        duration: "6 hours",
      },
      {
        title: "Data Visualization with Matplotlib and Seaborn",
        lectures: 8,
        duration: "5 hours",
      },
      {
        title: "Statistical Analysis and Hypothesis Testing",
        lectures: 10,
        duration: "6 hours",
      },
      {
        title: "Introduction to Machine Learning",
        lectures: 12,
        duration: "7 hours",
      },
      {
        title: "Supervised Learning Algorithms",
        lectures: 10,
        duration: "6 hours",
      },
      {
        title: "Unsupervised Learning Algorithms",
        lectures: 8,
        duration: "5 hours",
      },
      {
        title: "Model Evaluation and Improvement",
        lectures: 6,
        duration: "4 hours",
      },
      {
        title: "Data Science Project Workflow",
        lectures: 5,
        duration: "3 hours",
      },
      { title: "Capstone Project", lectures: 1, duration: "8 hours" },
    ],
    topCompanies: ["Amazon", "IBM", "Microsoft", "Google", "Netflix"],
  },
  {
    id: "3",
    slug: "ux-ui-design-masterclass",
    title: "UX/UI Design Masterclass",
    instructor: "Diwan Malla",
    shortDescription:
      "Learn to create beautiful, functional designs that users love with this comprehensive UX/UI design course.",
    description:
      "This masterclass covers everything you need to know about UX/UI design...",
    image:
      "https://images.unsplash.com/photo-1561070791-2526d30994b5?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
    rating: 4.7,
    students: 7654,
    lastUpdated: "November 2023",
    language: "English",
    level: "Beginner",
    duration: "8 weeks",
    price: 69.99,
    discount: 15,
    category: "Design",
    whatYoullLearn: [
      "Conduct effective user research and create user personas",
      "Design wireframes and prototypes using industry-standard tools",
      "Apply visual design principles to create beautiful interfaces",
      "Implement responsive design for multiple devices",
      "Create and maintain design systems",
      "Test designs with users and iterate based on feedback",
    ],
    syllabus: [
      {
        title: "Introduction to UX/UI Design",
        lectures: 6,
        duration: "3 hours",
      },
      { title: "User Research Methods", lectures: 8, duration: "4 hours" },
      { title: "Information Architecture", lectures: 6, duration: "3 hours" },
      {
        title: "Wireframing and Low-Fidelity Prototyping",
        lectures: 10,
        duration: "5 hours",
      },
      { title: "Visual Design Principles", lectures: 12, duration: "6 hours" },
      {
        title: "Typography and Color Theory",
        lectures: 8,
        duration: "4 hours",
      },
      {
        title: "High-Fidelity Prototyping with Figma",
        lectures: 10,
        duration: "6 hours",
      },
      { title: "Responsive Design", lectures: 8, duration: "4 hours" },
      { title: "Usability Testing", lectures: 6, duration: "3 hours" },
      { title: "Portfolio Development", lectures: 4, duration: "2 hours" },
    ],
    topCompanies: ["Apple", "Airbnb", "Uber", "Spotify", "Adobe"],
  },
  {
    id: "4",
    slug: "python-for-data-analysis",
    title: "Python for Data Analysis",
    instructor: "Diwan Malla",
    shortDescription:
      "Learn how to analyze data effectively using Python, Pandas, NumPy, and data visualization libraries.",
    description:
      "This course focuses specifically on data analysis with Python...",
    image:
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
    rating: 4.8,
    students: 11111,
    lastUpdated: "August 2023",
    language: "English",
    level: "Intermediate",
    duration: "6 weeks",
    price: 59.99,
    bestseller: true,
    category: "Data Science",
    whatYoullLearn: [
      "Master data manipulation with Pandas",
      "Clean and preprocess messy real-world datasets",
      "Perform exploratory data analysis",
      "Create compelling visualizations with Matplotlib and Seaborn",
      "Extract actionable insights from data",
      "Automate data analysis workflows",
    ],
    syllabus: [
      {
        title: "Python Fundamentals for Data Analysis",
        lectures: 8,
        duration: "4 hours",
      },
      { title: "Introduction to NumPy", lectures: 6, duration: "3 hours" },
      {
        title: "Data Manipulation with Pandas",
        lectures: 12,
        duration: "7 hours",
      },
      {
        title: "Data Cleaning and Preprocessing",
        lectures: 10,
        duration: "6 hours",
      },
      { title: "Exploratory Data Analysis", lectures: 8, duration: "5 hours" },
      {
        title: "Data Visualization with Matplotlib",
        lectures: 8,
        duration: "4 hours",
      },
      {
        title: "Advanced Visualizations with Seaborn",
        lectures: 6,
        duration: "3 hours",
      },
      { title: "Time Series Analysis", lectures: 6, duration: "4 hours" },
      {
        title: "Working with Large Datasets",
        lectures: 4,
        duration: "2 hours",
      },
      { title: "Data Analysis Projects", lectures: 2, duration: "6 hours" },
    ],
    topCompanies: ["Amazon", "JP Morgan", "Google", "Microsoft", "Tesla"],
  },
  {
    id: "5",
    slug: "react-and-redux-in-depth",
    title: "React and Redux in Depth",
    instructor: "Diwan Malla",
    shortDescription:
      "Master React.js and Redux to build complex, state-driven web applications with modern JavaScript.",
    description:
      "This in-depth course takes you from React fundamentals to advanced patterns...",
    image:
      "https://images.unsplash.com/photo-1633356122102-3fe601e05bd2?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
    rating: 4.9,
    students: 8765,
    lastUpdated: "December 2023",
    language: "English",
    level: "Intermediate to Advanced",
    duration: "8 weeks",
    price: 89.99,
    discount: 10,
    category: "Web Development",
    whatYoullLearn: [
      "Build complex user interfaces with React components",
      "Manage application state effectively with Redux",
      "Implement routing with React Router",
      "Write clean, maintainable React code using best practices",
      "Test React applications with Jest and React Testing Library",
      "Deploy React applications to production",
    ],
    syllabus: [
      { title: "React Fundamentals", lectures: 10, duration: "5 hours" },
      {
        title: "Component Patterns and Best Practices",
        lectures: 8,
        duration: "4 hours",
      },
      { title: "Hooks in Depth", lectures: 10, duration: "6 hours" },
      {
        title: "Context API and State Management",
        lectures: 8,
        duration: "4 hours",
      },
      { title: "Introduction to Redux", lectures: 6, duration: "3 hours" },
      {
        title: "Advanced Redux and Middleware",
        lectures: 10,
        duration: "6 hours",
      },
      { title: "Routing with React Router", lectures: 6, duration: "3 hours" },
      { title: "Testing React Applications", lectures: 8, duration: "4 hours" },
      { title: "Performance Optimization", lectures: 6, duration: "3 hours" },
      { title: "Deployment and CI/CD", lectures: 4, duration: "2 hours" },
    ],
    topCompanies: ["Facebook", "Airbnb", "Netflix", "Uber", "Twitter"],
  },
  {
    id: "6",
    slug: "digital-marketing-strategy",
    title: "Digital Marketing Strategy",
    instructor: "Diwan Malla",
    shortDescription:
      "Learn how to create and implement effective digital marketing strategies across multiple channels.",
    description:
      "This comprehensive course covers all aspects of digital marketing...",
    image:
      "https://images.unsplash.com/photo-1557838923-2985c318be48?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
    rating: 4.6,
    students: 6543,
    lastUpdated: "July 2023",
    language: "English",
    level: "Beginner to Intermediate",
    duration: "8 weeks",
    price: 69.99,
    category: "Business",
    whatYoullLearn: [
      "Develop comprehensive digital marketing strategies",
      "Optimize websites for search engines (SEO)",
      "Create effective content marketing campaigns",
      "Manage social media marketing across platforms",
      "Implement email marketing and automation",
      "Run and optimize paid advertising campaigns",
    ],
    syllabus: [
      {
        title: "Digital Marketing Fundamentals",
        lectures: 6,
        duration: "3 hours",
      },
      {
        title: "Market Research and Audience Analysis",
        lectures: 8,
        duration: "4 hours",
      },
      {
        title: "Search Engine Optimization (SEO)",
        lectures: 10,
        duration: "6 hours",
      },
      { title: "Content Marketing Strategy", lectures: 8, duration: "4 hours" },
      { title: "Social Media Marketing", lectures: 10, duration: "5 hours" },
      {
        title: "Email Marketing and Automation",
        lectures: 8,
        duration: "4 hours",
      },
      {
        title: "Paid Advertising (PPC, Social Ads)",
        lectures: 10,
        duration: "6 hours",
      },
      {
        title: "Analytics and Performance Measurement",
        lectures: 8,
        duration: "4 hours",
      },
      {
        title: "Conversion Rate Optimization",
        lectures: 6,
        duration: "3 hours",
      },
      {
        title: "Digital Marketing Campaign Planning",
        lectures: 4,
        duration: "5 hours",
      },
    ],
    topCompanies: ["HubSpot", "Google", "Facebook", "Salesforce", "Adobe"],
  },
  {
    id: "rec1",
    slug: "advanced-react-patterns",
    title: "Advanced React Patterns",
    instructor: "Alex Johnson",
    shortDescription:
      "Master advanced React patterns and techniques for building scalable applications.",
    description:
      "This course dives deep into advanced React concepts, patterns, and best practices...",
    image:
      "https://images.unsplash.com/photo-1633356122544-f134324a6cee?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80",
    rating: 4.7,
    students: 8234,
    lastUpdated: "March 2025",
    language: "English",
    level: "Advanced",
    duration: "6 weeks",
    price: 79.99,
    discount: 15,
    bestseller: false,
    category: "Web Development",
    whatYoullLearn: [
      "Implement advanced React patterns",
      "Optimize React performance",
      "Manage complex state",
      "Build reusable components",
    ],
    syllabus: [
      { title: "React Fundamentals Review", lectures: 5, duration: "3 hours" },
      { title: "Advanced Patterns", lectures: 8, duration: "5 hours" },
      { title: "Performance Optimization", lectures: 6, duration: "4 hours" },
    ],
    topCompanies: ["Facebook", "Airbnb", "Netflix"],
  },
  {
    id: "rec2",
    slug: "nodejs-microservices",
    title: "Node.js Microservices",
    instructor: "Maria Garcia",
    shortDescription:
      "Learn to build scalable microservices using Node.js and modern architectures.",
    description:
      "Comprehensive guide to designing and implementing microservices with Node.js...",
    image:
      "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80",
    rating: 4.8,
    students: 6543,
    lastUpdated: "February 2025",
    language: "English",
    level: "Intermediate",
    duration: "8 weeks",
    price: 89.99,
    discount: 10,
    bestseller: true,
    category: "Backend Development",
    whatYoullLearn: [
      "Design microservices architecture",
      "Implement Node.js services",
      "Handle service communication",
      "Deploy microservices",
    ],
    syllabus: [
      { title: "Microservices Basics", lectures: 6, duration: "4 hours" },
      { title: "Node.js Implementation", lectures: 8, duration: "6 hours" },
      { title: "Deployment Strategies", lectures: 6, duration: "4 hours" },
    ],
    topCompanies: ["Netflix", "Uber", "PayPal"],
  },
  {
    id: "rec3",
    slug: "full-stack-development-bootcamp",
    title: "Full-Stack Development Bootcamp",
    instructor: "John Smith",
    shortDescription:
      "Become a full-stack developer with this comprehensive bootcamp.",
    description:
      "Learn both frontend and backend development in this intensive program...",
    image:
      "https://images.unsplash.com/photo-1593720213428-28a5b9e94613?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80",
    rating: 4.9,
    students: 12345,
    lastUpdated: "January 2025",
    language: "English",
    level: "Beginner to Intermediate",
    duration: "10 weeks",
    price: 99.99,
    discount: 25,
    bestseller: true,
    category: "Full-Stack Development",
    whatYoullLearn: [
      "Build frontend with React",
      "Create backend with Node.js",
      "Work with databases",
      "Deploy full applications",
    ],
    syllabus: [
      { title: "Frontend Foundations", lectures: 10, duration: "6 hours" },
      { title: "Backend Basics", lectures: 10, duration: "6 hours" },
      { title: "Full-Stack Integration", lectures: 8, duration: "5 hours" },
    ],
    topCompanies: ["Google", "Microsoft", "Amazon"],
  },
  {
    id: "rec4",
    slug: "modern-web-development",
    title: "Modern Web Development",
    instructor: "Diwan Malla",
    shortDescription: "Master modern web development tools and techniques.",
    description:
      "Comprehensive course covering the latest web development technologies...",
    image:
      "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80",
    rating: 4.6,
    students: 5432,
    lastUpdated: "March 2025",
    language: "English",
    level: "Intermediate",
    duration: "7 weeks",
    price: 84.99,
    discount: 20,
    bestseller: false,
    category: "Web Development",
    whatYoullLearn: [
      "Modern JavaScript techniques",
      "Latest CSS features",
      "Web performance optimization",
      "Development workflows",
    ],
    syllabus: [
      { title: "Modern JavaScript", lectures: 7, duration: "4 hours" },
      { title: "Advanced CSS", lectures: 6, duration: "3 hours" },
      { title: "Performance & Tools", lectures: 6, duration: "4 hours" },
    ],
    topCompanies: ["Shopify", "Twitter", "LinkedIn"],
  },
];

const studentsData = [
  {
    id: "student-1",
    name: "Alex Johnson",
    email: "alex.johnson@example.com",
    image:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&auto=format&fit=crop&w=634&q=80",
    studentProfile: {
      id: "sp-1",
      interests: ["Web Development", "React"],
      totalCourses: 2,
      completedCourses: 0,
      createdAt: "2023-05-15T00:00:00Z",
    },
    enrollments: [
      {
        courseId: "1",
        status: "ACTIVE",
        progress: 65,
        enrollmentDate: "2023-05-15T00:00:00Z",
        lastActive: "2023-06-10T00:00:00Z",
      },
      {
        courseId: "5",
        status: "ACTIVE",
        progress: 30,
        enrollmentDate: "2023-05-20T00:00:00Z",
        lastActive: "2023-06-08T00:00:00Z",
      },
    ],
  },
  {
    id: "student-2",
    name: "Maria Garcia",
    email: "maria.garcia@example.com",
    image:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=crop&w=634&q=80",
    studentProfile: {
      id: "sp-2",
      interests: ["Data Science"],
      totalCourses: 1,
      completedCourses: 0,
      createdAt: "2023-04-22T00:00:00Z",
    },
    enrollments: [
      {
        courseId: "2",
        status: "ACTIVE",
        progress: 42,
        enrollmentDate: "2023-04-22T00:00:00Z",
        lastActive: "2023-06-12T00:00:00Z",
      },
    ],
  },
  {
    id: "student-3",
    name: "John Smith",
    email: "john.smith@example.com",
    image:
      "https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-1.2.1&auto=format&fit=crop&w=634&q=80",
    studentProfile: {
      id: "sp-3",
      interests: ["Web Development"],
      totalCourses: 1,
      completedCourses: 1,
      createdAt: "2023-03-10T00:00:00Z",
    },
    enrollments: [
      {
        courseId: "1",
        status: "COMPLETED",
        progress: 89,
        enrollmentDate: "2023-03-10T00:00:00Z",
        lastActive: "2023-06-08T00:00:00Z",
      },
    ],
  },
  {
    id: "student-4",
    name: "Priya Patel",
    email: "priya.patel@example.com",
    image:
      "https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-1.2.1&auto=format&fit=crop&w=634&q=80",
    studentProfile: {
      id: "sp-4",
      interests: ["UX/UI Design", "Web Development"],
      totalCourses: 2,
      completedCourses: 0,
      createdAt: "2023-05-30T00:00:00Z",
    },
    enrollments: [
      {
        courseId: "3",
        status: "ACTIVE",
        progress: 23,
        enrollmentDate: "2023-05-30T00:00:00Z",
        lastActive: "2023-06-11T00:00:00Z",
      },
      {
        courseId: "1",
        status: "ACTIVE",
        progress: 15,
        enrollmentDate: "2023-06-01T00:00:00Z",
        lastActive: "2023-06-10T00:00:00Z",
      },
    ],
  },
  {
    id: "student-5",
    name: "David Kim",
    email: "david.kim@example.com",
    image:
      "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-1.2.1&auto=format&fit=crop&w=634&q=80",
    studentProfile: {
      id: "sp-5",
      interests: ["Data Science", "Python"],
      totalCourses: 1,
      completedCourses: 1,
      createdAt: "2023-02-18T00:00:00Z",
    },
    enrollments: [
      {
        courseId: "4",
        status: "COMPLETED",
        progress: 95,
        enrollmentDate: "2023-02-18T00:00:00Z",
        lastActive: "2023-06-09T00:00:00Z",
      },
    ],
  },
];

async function main() {
  // Clear existing data
  await prisma.notification.deleteMany();
  await prisma.message.deleteMany();
  await prisma.announcement.deleteMany();
  await prisma.coupon.deleteMany();
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.wishlist.deleteMany();
  await prisma.review.deleteMany();
  await prisma.certificate.deleteMany();
  await prisma.progress.deleteMany();
  await prisma.enrollment.deleteMany();
  await prisma.answer.deleteMany();
  await prisma.quizAttempt.deleteMany();
  await prisma.question.deleteMany();
  await prisma.quiz.deleteMany();
  await prisma.resource.deleteMany();
  await prisma.lesson.deleteMany();
  await prisma.module.deleteMany();
  await prisma.course.deleteMany();
  await prisma.studentProfile.deleteMany();
  await prisma.instructorProfile.deleteMany();
  await prisma.category.deleteMany();
  await prisma.user.deleteMany();

  // Seed Instructor
  const instructor = await prisma.user.create({
    data: {
      id: "clerk_instructor_001",
      clerkId: "clerk_instructor_001",
      name: "Diwan Malla",
      email: "diwan.malla@example.com",
      image:
        "https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-1.2.1&auto=format&fit=crop&w=634&q=80",
      bio: "Diwan Malla is an experienced instructor with expertise across multiple domains.",
      role: "INSTRUCTOR",
    },
  });

  await prisma.instructorProfile.create({
    data: {
      userId: instructor.id,
      title: "Senior Instructor",
      specialization: "Web Development, Data Science, UX/UI Design",
      biography:
        "Diwan Malla is a seasoned professional with extensive teaching experience...",
      website: "https://diwanmalla.com",
      socialLinks: { twitter: "https://twitter.com/diwanmalla" },
      featured: true,
    },
  });

  // Seed Students
  for (const student of studentsData) {
    await prisma.user.create({
      data: {
        id: student.id,
        clerkId: student.id,
        name: student.name,
        email: student.email,
        image: student.image,
        role: "STUDENT",
      },
    });

    await prisma.studentProfile.create({
      data: {
        id: student.studentProfile.id,
        userId: student.id,
        interests: student.studentProfile.interests,
        totalCourses: student.studentProfile.totalCourses,
        completedCourses: student.studentProfile.completedCourses,
        createdAt: new Date(student.studentProfile.createdAt),
      },
    });
  }

  // Seed Categories
  const categories = [...new Set(coursesData.map((course) => course.category))];
  const categoryMap = {};
  for (const categoryName of categories) {
    const category = await prisma.category.create({
      data: {
        name: categoryName,
        slug: categoryName.toLowerCase().replace(/\s+/g, "-"),
        description: `Courses related to ${categoryName}.`,
        featured: true,
      },
    });
    categoryMap[categoryName] = category.id;
  }

  // Seed Courses and store slug-to-id mapping
  const courseIdMap = {}; // Map to store slug -> database id
  for (const courseData of coursesData) {
    const weeks = parseInt(courseData.duration.split(" ")[0], 10);
    const totalDurationMinutes = weeks * 2 * 60; // Assuming 2 hours/week
    const totalLessons = courseData.syllabus.reduce(
      (sum, item) => sum + item.lectures,
      0
    );

    const levelMap = {
      Beginner: "BEGINNER",
      Intermediate: "INTERMEDIATE",
      Advanced: "ADVANCED",
      "Beginner to Advanced": "ALL_LEVELS",
      "Intermediate to Advanced": "ADVANCED",
      "Beginner to Intermediate": "INTERMEDIATE",
    };
    const level = levelMap[courseData.level] || "BEGINNER";

    const course = await prisma.course.create({
      data: {
        title: courseData.title,
        slug: courseData.slug,
        description: courseData.description,
        shortDescription: courseData.shortDescription,
        price: courseData.price,
        discountPrice: courseData.discount
          ? courseData.price * (1 - courseData.discount / 100)
          : null,
        thumbnail: courseData.image,
        level,
        status: "PUBLISHED",
        featured: true,
        bestseller: courseData.bestseller || false,
        published: true,
        publishedAt: new Date(courseData.lastUpdated),
        language: courseData.language,
        subtitlesLanguages: [courseData.language],
        duration: totalDurationMinutes,
        totalLessons,
        totalModules: courseData.syllabus.length,
        requirements: ["Basic computer skills"],
        learningObjectives: courseData.whatYoullLearn,
        targetAudience: ["Aspiring professionals"],
        tags: courseData.category.split(" "),
        rating: courseData.rating,
        totalStudents: courseData.students,
        topCompanies: courseData.topCompanies,
        instructorId: instructor.id,
        categoryId: categoryMap[courseData.category],
      },
    });

    // Store the mapping of original id to database id
    courseIdMap[courseData.id] = course.id;

    // Seed Modules and Lessons
    for (let i = 0; i < courseData.syllabus.length; i++) {
      const moduleData = courseData.syllabus[i];
      const module = await prisma.module.create({
        data: {
          title: moduleData.title,
          position: i + 1,
          courseId: course.id,
        },
      });

      const durationHours = parseFloat(moduleData.duration.split(" ")[0]);
      const durationSeconds = (durationHours * 3600) / moduleData.lectures;

      for (let j = 0; j < moduleData.lectures; j++) {
        await prisma.lesson.create({
          data: {
            title: `${moduleData.title} - Lesson ${j + 1}`,
            type: "VIDEO",
            duration: Math.round(durationSeconds),
            position: j + 1,
            isPreview: j === 0,
            moduleId: module.id,
          },
        });
      }
    }
  }

  // Seed Enrollments and Progress
  for (const student of studentsData) {
    for (const enrollment of student.enrollments) {
      const dbCourseId = courseIdMap[enrollment.courseId];
      if (!dbCourseId) {
        console.error(
          `Course with original ID ${enrollment.courseId} not found in database`
        );
        continue;
      }

      const enrollmentRecord = await prisma.enrollment.create({
        data: {
          userId: student.id,
          courseId: dbCourseId,
          status: enrollment.status,
          createdAt: new Date(enrollment.enrollmentDate),
          updatedAt: new Date(enrollment.lastActive),
        },
      });

      const lessons = await prisma.lesson.findMany({
        where: { module: { courseId: dbCourseId } },
      });
      const progressPercentage = enrollment.progress / 100;
      const lessonsToComplete = Math.round(lessons.length * progressPercentage);

      for (let i = 0; i < lessonsToComplete; i++) {
        await prisma.progress.create({
          data: {
            enrollmentId: enrollmentRecord.id,
            lessonId: lessons[i].id,
            completed: true,
            completedAt: new Date(enrollment.lastActive),
            watchedSeconds: lessons[i].duration,
            lastPosition: lessons[i].duration,
          },
        });
      }
    }
  }

  console.log("Database seeded successfully!");
}

main()
  .catch((e) => {
    console.error("Seeding failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
