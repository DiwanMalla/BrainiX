import { PrismaClient, CourseLevel, CourseStatus } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Create categories if they don't exist
  const categories = await Promise.all([
    prisma.category.upsert({
      where: { slug: 'web-development' },
      update: {},
      create: {
        name: 'Web Development',
        slug: 'web-development',
        description: 'Learn to build modern web applications.',
      },
    }),
    prisma.category.upsert({
      where: { slug: 'data-science' },
      update: {},
      create: {
        name: 'Data Science',
        slug: 'data-science',
        description: 'Master data analysis and AI.',
      },
    }),
    prisma.category.upsert({
      where: { slug: 'business' },
      update: {},
      create: {
        name: 'Business',
        slug: 'business',
        description: 'Develop business skills.',
      },
    }),
    prisma.category.upsert({
      where: { slug: 'design' },
      update: {},
      create: {
        name: 'Design',
        slug: 'design',
        description: 'Create stunning designs.',
      },
    }),
  ]);

  const webDevCategory = categories.find(c => c.slug === 'web-development');
  const dataScienceCategory = categories.find(c => c.slug === 'data-science');
  const businessCategory = categories.find(c => c.slug === 'business');
  const designCategory = categories.find(c => c.slug === 'design');

  // Sample instructor (assuming one exists or create one)
  const instructor = await prisma.user.upsert({
    where: { email: 'instructor@example.com' },
    update: {},
    create: {
      id: 'instr_1',
      clerkId: 'clerk_1',
      email: 'instructor@example.com',
      name: 'John Doe',
      role: 'INSTRUCTOR',
    },
  });

  // Create 15 courses
  await prisma.course.createMany({
    data: [
      // Web Development Courses
      {
        title: 'Complete Web Development Bootcamp',
        slug: 'complete-web-development-bootcamp',
        description: 'Learn HTML, CSS, JavaScript, React, and Node.js to become a full-stack web developer.',
        shortDescription: 'Master full-stack web development with this comprehensive course.',
        price: 199.99,
        discountPrice: 149.99,
        thumbnail: '/thumbnails/web-dev-bootcamp.jpg',
        previewVideo: '/videos/web-dev-preview.mp4',
        level: CourseLevel.ALL_LEVELS,
        status: CourseStatus.PUBLISHED,
        published: true,
        publishedAt: new Date(),
        language: 'English',
        subtitlesLanguages: ['English', 'Spanish'],
        duration: 3600,
        totalLessons: 120,
        totalModules: 12,
        requirements: ['Basic computer skills', 'No prior coding experience needed'],
        learningObjectives: ['Build responsive websites', 'Create backend APIs', 'Deploy web applications'],
        targetAudience: ['Beginners', 'Aspiring web developers'],
        tags: ['web development', 'full-stack', 'react', 'node.js'],
        rating: 4.8,
        totalStudents: 15000,
        instructorId: instructor.id,
        categoryId: webDevCategory!.id,
      },
      {
        title: 'React & TypeScript: Build Modern Apps',
        slug: 'react-typescript-modern-apps',
        description: 'Master React with TypeScript to build scalable and type-safe web applications.',
        shortDescription: 'Learn to build modern apps with React and TypeScript.',
        price: 129.99,
        level: CourseLevel.INTERMEDIATE,
        status: CourseStatus.PUBLISHED,
        published: true,
        publishedAt: new Date(),
        language: 'English',
        subtitlesLanguages: ['English'],
        duration: 1800,
        totalLessons: 60,
        totalModules: 8,
        requirements: ['Basic JavaScript knowledge', 'Familiarity with React'],
        learningObjectives: ['Build type-safe React components', 'Manage state with Redux', 'Integrate APIs'],
        targetAudience: ['Intermediate developers', 'React developers'],
        tags: ['react', 'typescript', 'web development'],
        rating: 4.7,
        totalStudents: 8000,
        instructorId: instructor.id,
        categoryId: webDevCategory!.id,
      },
      {
        title: 'Advanced CSS and Sass',
        slug: 'advanced-css-sass',
        description: 'Take your CSS skills to the next level with Sass, animations, and advanced layouts.',
        shortDescription: 'Master CSS and Sass for stunning web designs.',
        price: 89.99,
        level: CourseLevel.INTERMEDIATE,
        status: CourseStatus.PUBLISHED,
        published: true,
        publishedAt: new Date(),
        language: 'English',
        subtitlesLanguages: ['English', 'French'],
        duration: 1200,
        totalLessons: 40,
        totalModules: 6,
        requirements: ['Basic HTML and CSS knowledge'],
        learningObjectives: ['Create complex layouts', 'Use Sass for scalable CSS', 'Implement animations'],
        targetAudience: ['Web designers', 'Frontend developers'],
        tags: ['css', 'sass', 'web development'],
        rating: 4.6,
        totalStudents: 5000,
        instructorId: instructor.id,
        categoryId: webDevCategory!.id,
      },
      {
        title: 'Node.js Backend Development',
        slug: 'nodejs-backend-development',
        description: 'Build scalable backend systems with Node.js, Express, and MongoDB.',
        shortDescription: 'Learn backend development with Node.js and Express.',
        price: 149.99,
        level: CourseLevel.ADVANCED,
        status: CourseStatus.PUBLISHED,
        published: true,
        publishedAt: new Date(),
        language: 'English',
        subtitlesLanguages: ['English'],
        duration: 2400,
        totalLessons: 80,
        totalModules: 10,
        requirements: ['Intermediate JavaScript knowledge'],
        learningObjectives: ['Build RESTful APIs', 'Integrate MongoDB', 'Deploy backend servers'],
        targetAudience: ['Backend developers', 'Full-stack developers'],
        tags: ['nodejs', 'express', 'mongodb', 'web development'],
        rating: 4.9,
        totalStudents: 10000,
        instructorId: instructor.id,
        categoryId: webDevCategory!.id,
      },

      // Data Science Courses
      {
        title: 'Python for Data Science',
        slug: 'python-for-data-science',
        description: 'Learn Python, Pandas, NumPy, and Matplotlib for data analysis and visualization.',
        shortDescription: 'Master data science with Python and its powerful libraries.',
        price: 159.99,
        discountPrice: 119.99,
        thumbnail: '/thumbnails/python-data-science.jpg',
        level: CourseLevel.BEGINNER,
        status: CourseStatus.PUBLISHED,
        published: true,
        publishedAt: new Date(),
        language: 'English',
        subtitlesLanguages: ['English', 'Spanish'],
        duration: 3000,
        totalLessons: 100,
        totalModules: 10,
        requirements: ['No prior experience needed'],
        learningObjectives: ['Analyze data with Pandas', 'Visualize data with Matplotlib', 'Clean datasets'],
        targetAudience: ['Beginners', 'Aspiring data scientists'],
        tags: ['python', 'data science', 'pandas', 'matplotlib'],
        rating: 4.8,
        totalStudents: 12000,
        instructorId: instructor.id,
        categoryId: dataScienceCategory!.id,
      },
      {
        title: 'Machine Learning A-Z',
        slug: 'machine-learning-a-z',
        description: 'Learn machine learning concepts, algorithms, and applications with Python and R.',
        shortDescription: 'Comprehensive machine learning course with Python and R.',
        price: 199.99,
        level: CourseLevel.INTERMEDIATE,
        status: CourseStatus.PUBLISHED,
        published: true,
        publishedAt: new Date(),
        language: 'English',
        subtitlesLanguages: ['English'],
        duration: 3600,
        totalLessons: 120,
        totalModules: 12,
        requirements: ['Basic Python knowledge', 'Statistics basics'],
        learningObjectives: ['Build ML models', 'Understand algorithms', 'Apply ML to real-world problems'],
        targetAudience: ['Data scientists', 'ML enthusiasts'],
        tags: ['machine learning', 'python', 'r', 'data science'],
        rating: 4.9,
        totalStudents: 20000,
        instructorId: instructor.id,
        categoryId: dataScienceCategory!.id,
      },
      {
        title: 'Deep Learning with TensorFlow',
        slug: 'deep-learning-tensorflow',
        description: 'Master deep learning and neural networks using TensorFlow and Keras.',
        shortDescription: 'Learn deep learning with TensorFlow and Keras.',
        price: 179.99,
        level: CourseLevel.ADVANCED,
        status: CourseStatus.PUBLISHED,
        published: true,
        publishedAt: new Date(),
        language: 'English',
        subtitlesLanguages: ['English'],
        duration: 2400,
        totalLessons: 80,
        totalModules: 10,
        requirements: ['Intermediate Python', 'ML basics'],
        learningObjectives: ['Build neural networks', 'Use TensorFlow', 'Optimize models'],
        targetAudience: ['Data scientists', 'AI engineers'],
        tags: ['deep learning', 'tensorflow', 'keras', 'data science'],
        rating: 4.7,
        totalStudents: 9000,
        instructorId: instructor.id,
        categoryId: dataScienceCategory!.id,
      },
      {
        title: 'SQL for Data Analysis',
        slug: 'sql-for-data-analysis',
        description: 'Learn SQL to query, analyze, and manipulate large datasets efficiently.',
        shortDescription: 'Master SQL for data analysis and reporting.',
        price: 99.99,
        level: CourseLevel.BEGINNER,
        status: CourseStatus.PUBLISHED,
        published: true,
        publishedAt: new Date(),
        language: 'English',
        subtitlesLanguages: ['English'],
        duration: 1200,
        totalLessons: 40,
        totalModules: 6,
        requirements: ['No prior experience needed'],
        learningObjectives: ['Write complex SQL queries', 'Analyze datasets', 'Create reports'],
        targetAudience: ['Beginners', 'Data analysts'],
        tags: ['sql', 'data analysis', 'data science'],
        rating: 4.6,
        totalStudents: 7000,
        instructorId: instructor.id,
        categoryId: dataScienceCategory!.id,
      },

      // Business Courses
      {
        title: 'Digital Marketing Masterclass',
        slug: 'digital-marketing-masterclass',
        description: 'Learn SEO, social media marketing, and Google Ads to grow your business.',
        shortDescription: 'Master digital marketing strategies and tools.',
        price: 149.99,
        discountPrice: 99.99,
        thumbnail: '/thumbnails/digital-marketing.jpg',
        level: CourseLevel.ALL_LEVELS,
        status: CourseStatus.PUBLISHED,
        published: true,
        publishedAt: new Date(),
        language: 'English',
        subtitlesLanguages: ['English', 'Spanish'],
        duration: 2400,
        totalLessons: 80,
        totalModules: 10,
        requirements: ['No prior experience needed'],
        learningObjectives: ['Create marketing campaigns', 'Optimize SEO', 'Analyze metrics'],
        targetAudience: ['Entrepreneurs', 'Marketers'],
        tags: ['digital marketing', 'seo', 'social media', 'business'],
        rating: 4.8,
        totalStudents: 11000,
        instructorId: instructor.id,
       _batch_size: 4,
        categoryId: businessCategory!.id,
      },
      {
        title: 'Project Management Professional (PMP) Prep',
        slug: 'pmp-prep',
        description: 'Prepare for the PMP certification with comprehensive training and practice exams.',
        shortDescription: 'Get ready for the PMP certification exam.',
        price: 199.99,
        level: CourseLevel.ADVANCED,
        status: CourseStatus.PUBLISHED,
        published: true,
        publishedAt: new Date(),
        language: 'English',
        subtitlesLanguages: ['English'],
        duration: 1800,
        totalLessons: 60,
        totalModules: 8,
        requirements: ['Project management experience'],
        learningObjectives: ['Understand PMP framework', 'Pass the PMP exam', 'Apply PM principles'],
        targetAudience: ['Project managers', 'PMP candidates'],
        tags: ['project management', 'pmp', 'business'],
        rating: 4.7,
        totalStudents: 6000,
        instructorId: instructor.id,
        categoryId: businessCategory!.id,
      },
      {
        title: 'Entrepreneurship 101',
        slug: 'entrepreneurship-101',
        description: 'Learn how to start and grow your own business from scratch.',
        shortDescription: 'Master the essentials of entrepreneurship.',
        price: 129.99,
        level: CourseLevel.BEGINNER,
        status: CourseStatus.PUBLISHED,
        published: true,
        publishedAt: new Date(),
        language: 'English',
        subtitlesLanguages: ['English'],
        duration: 1200,
        totalLessons: 40,
        totalModules: 6,
        requirements: ['No prior experience needed'],
        learningObjectives: ['Create a business plan', 'Secure funding', 'Scale your business'],
        targetAudience: ['Aspiring entrepreneurs', 'Small business owners'],
        tags: ['entrepreneurship', 'startup', 'business'],
        rating: 4.6,
        totalStudents: 5000,
        instructorId: instructor.id,
        categoryId: businessCategory!.id,
      },

      // Design Courses
      {
        title: 'Graphic Design Masterclass',
        slug: 'graphic-design-masterclass',
        description: 'Learn Adobe Photoshop, Illustrator, and InDesign for professional graphic design.',
        shortDescription: 'Become a professional graphic designer with Adobe tools.',
        price: 159.99,
        discountPrice: 119.99,
        thumbnail: '/thumbnails/graphic-design.jpg',
        level: CourseLevel.ALL_LEVELS,
        status: CourseStatus.PUBLISHED,
        published: true,
        publishedAt: new Date(),
        language: 'English',
        subtitlesLanguages: ['English', 'Spanish'],
        duration: 2400,
        totalLessons: 80,
        totalModules: 10,
        requirements: ['No prior experience needed'],
        learningObjectives: ['Create stunning graphics', 'Master Adobe tools', 'Design for print and web'],
        targetAudience: ['Beginners', 'Aspiring designers'],
        tags: ['graphic design', 'photoshop', 'illustrator', 'design'],
        rating: 4.8,
        totalStudents: 10000,
        instructorId: instructor.id,
        categoryId: designCategory!.id,
      },
      {
        title: 'UI/UX Design Fundamentals',
        slug: 'ui-ux-design-fundamentals',
        description: 'Learn user interface and user experience design principles with Figma and Adobe XD.',
        shortDescription: 'Master UI/UX design with Figma and Adobe XD.',
        price: 129.99,
        level: CourseLevel.BEGINNER,
        status: CourseStatus.PUBLISHED,
        published: true,
        publishedAt: new Date(),
        language: 'English',
        subtitlesLanguages: ['English'],
        duration: 1800,
        totalLessons: 60,
        totalModules: 8,
        requirements: ['No prior experience needed'],
        learningObjectives: ['Design user interfaces', 'Create prototypes', 'Conduct user testing'],
        targetAudience: ['Beginners', 'UI/UX designers'],
        tags: ['ui design', 'ux design', 'figma', 'design'],
        rating: 4.7,
        totalStudents: 8000,
        instructorId: instructor.id,
        categoryId: designCategory!.id,
      },
      {
        title: 'Motion Graphics with After Effects',
        slug: 'motion-graphics-after-effects',
        description: 'Create stunning motion graphics and animations using Adobe After Effects.',
        shortDescription: 'Learn motion graphics with Adobe After Effects.',
        price: 99.99,
        level: CourseLevel.INTERMEDIATE,
        status: CourseStatus.PUBLISHED,
        published: true,
        publishedAt: new Date(),
        language: 'English',
        subtitlesLanguages: ['English'],
        duration: 1200,
        totalLessons: 40,
        totalModules: 6,
        requirements: ['Basic design knowledge'],
        learningObjectives: ['Create animations', 'Use After Effects', 'Produce professional motion graphics'],
        targetAudience: ['Designers', 'Animators'],
        tags: ['motion graphics', 'after effects', 'animation', 'design'],
        rating: 4.6,
        totalStudents: 6000,
        instructorId: instructor.id,
        categoryId: designCategory!.id,
      },
      {
        title: '3D Modeling with Blender',
        slug: '3d-modeling-blender',
        description: 'Learn 3D modeling, texturing, and rendering with Blender, the free 3D software.',
        shortDescription: 'Master 3D modeling with Blender.',
        price: 109.99,
        level: CourseLevel.BEGINNER,
        status: CourseStatus.PUBLISHED,
        published: true,
        publishedAt: new Date(),
        language: 'English',
        subtitlesLanguages: ['English'],
        duration: 1800,
        totalLessons: 60,
        totalModules: 8,
        requirements: ['No prior experience needed'],
        learningObjectives: ['Create 3D models', 'Apply textures', 'Render animations'],
        targetAudience: ['Beginners', '3D artists'],
        tags: ['3d modeling', 'blender', 'animation', 'design'],
        rating: 4.7,
        totalStudents: 7000,
        instructorId: instructor.id,
        categoryId: designCategory!.id,
      },
    ],
  });

  console.log('Seed data created successfully!');
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });