export interface Instructor {
  name: string;
  bio: string;
  image: string;
}

export interface SyllabusItem {
  title: string;
  lectures: number;
  duration: string;
}

export interface Course {
  id: string;
  slug: string;
  title: string;
  instructor: string;
  instructorDetails: Instructor;
  description: string;
  shortDescription: string;
  image: string;
  rating: number;
  students: number;
  lastUpdated: string;
  language: string;
  level: string;
  duration: string;
  price: number;
  discount?: number;
  bestseller?: boolean;
  category: string;
  whatYoullLearn: string[];
  syllabus: SyllabusItem[];
  topCompanies: string[];
}

const coursesData: Course[] = [
  {
    id: "1",
    slug: "web-development-bootcamp",
    title: "Web Development Bootcamp",
    instructor: "Sarah Johnson",
    instructorDetails: {
      name: "Sarah Johnson",
      bio: "Sarah is a senior web developer with over 10 years of experience building web applications. She has worked with companies like Google and Facebook, and now focuses on teaching the next generation of developers.",
      image:
        "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=crop&w=634&q=80",
    },
    shortDescription:
      "Learn modern web development from scratch with HTML, CSS, JavaScript, React, Node.js and more.",
    description:
      "This comprehensive bootcamp takes you from absolute beginner to professional web developer. You'll learn front-end and back-end technologies, including HTML5, CSS3, JavaScript, React, Node.js, Express, and MongoDB. By the end of this course, you'll be able to build complete, responsive websites and web applications from scratch.",
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
    instructor: "Michael Chen",
    instructorDetails: {
      name: "Michael Chen",
      bio: "Michael is a data scientist with a PhD in Computer Science and 8 years of industry experience. He has led data science teams at major tech companies and has published research in top AI conferences.",
      image:
        "https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-1.2.1&auto=format&fit=crop&w=634&q=80",
    },
    shortDescription:
      "Master the essential skills of data science including Python, statistics, machine learning, and data visualization.",
    description:
      "This course provides a comprehensive introduction to data science, covering Python programming, statistics, data analysis, machine learning, and data visualization. You'll work with real-world datasets and learn how to extract meaningful insights from data. By the end of the course, you'll have the skills to tackle complex data problems and communicate your findings effectively.",
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
    instructor: "Emma Rodriguez",
    instructorDetails: {
      name: "Emma Rodriguez",
      bio: "Emma is a UX/UI design leader with experience at top tech companies and design agencies. She has designed products used by millions of people and specializes in user-centered design methodologies.",
      image:
        "https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-1.2.1&auto=format&fit=crop&w=634&q=80",
    },
    shortDescription:
      "Learn to create beautiful, functional designs that users love with this comprehensive UX/UI design course.",
    description:
      "This masterclass covers everything you need to know about UX/UI design, from user research and wireframing to high-fidelity prototypes and design systems. You'll learn industry-standard tools like Figma and Adobe XD, and develop a portfolio of projects that showcase your skills. Whether you're a beginner or looking to level up your design skills, this course will help you create user-centered designs that solve real problems.",
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
    instructor: "David Kim",
    instructorDetails: {
      name: "David Kim",
      bio: "David is a data analyst and Python expert with experience in finance, healthcare, and tech industries. He specializes in turning complex data into actionable insights using Python and its data science libraries.",
      image:
        "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&auto=format&fit=crop&w=634&q=80",
    },
    shortDescription:
      "Learn how to analyze data effectively using Python, Pandas, NumPy, and data visualization libraries.",
    description:
      "This course focuses specifically on data analysis with Python, teaching you how to work with the powerful Pandas library to manipulate, analyze, and visualize data. You'll learn how to clean messy datasets, perform exploratory data analysis, and create insightful visualizations. Through hands-on projects with real-world data, you'll develop the skills to extract meaningful insights that can drive decision-making.",
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
    instructor: "Olivia Taylor",
    instructorDetails: {
      name: "Olivia Taylor",
      bio: "Olivia is a frontend developer and educator with expertise in React and modern JavaScript frameworks. She has built applications for startups and enterprise companies, and loves teaching others how to create exceptional user experiences with React.",
      image:
        "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-1.2.1&auto=format&fit=crop&w=634&q=80",
    },
    shortDescription:
      "Master React.js and Redux to build complex, state-driven web applications with modern JavaScript.",
    description:
      "This in-depth course takes you from React fundamentals to advanced patterns and state management with Redux. You'll learn how to build scalable, maintainable applications using the latest features of React, including hooks, context API, and more. Through practical projects, you'll master component architecture, state management, routing, testing, and deployment. By the end, you'll be able to build professional-grade React applications from scratch.",
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
    instructor: "James Wilson",
    instructorDetails: {
      name: "James Wilson",
      bio: "James is a digital marketing strategist who has helped businesses of all sizes grow their online presence. With experience in SEO, content marketing, social media, and paid advertising, he brings a holistic approach to digital marketing education.",
      image:
        "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=crop&w=634&q=80",
    },
    shortDescription:
      "Learn how to create and implement effective digital marketing strategies across multiple channels.",
    description:
      "This comprehensive course covers all aspects of digital marketing, from SEO and content marketing to social media, email marketing, and paid advertising. You'll learn how to develop a cohesive marketing strategy, set meaningful KPIs, and measure the success of your campaigns. Through real-world case studies and hands-on projects, you'll gain the skills to drive traffic, generate leads, and increase conversions for any business.",
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
];

export default coursesData;

export function getCourseBySlug(slug: string): Course | undefined {
  return coursesData.find((course) => course.slug === slug);
}

export function getAllCourses(): Course[] {
  return coursesData;
}
