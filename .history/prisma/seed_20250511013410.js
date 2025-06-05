import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Starting seed process for UI/UX Design Bootcamp...");

  // Fetch the UI/UX Design Bootcamp course
  const course = await prisma.course.findUnique({
    where: { slug: "ui-ux-design-bootcamp" },
  });

  if (!course) {
    console.error("Course with slug 'ui-ux-design-bootcamp' not found.");
    throw new Error("Course not found");
  }

  console.log(`Found course: ${course.title}`);

  let lessonPosition = 1; // Track lesson position across modules
  const modulesData = [
    {
      title: "Introduction to UI/UX Design",
      description:
        "Understand the fundamentals of UI/UX design and its importance.",
      position: 1,
      lessons: [
        {
          title: "What is UI/UX Design?",
          description: "Explore the difference between UI and UX design.",
          type: "VIDEO",
          videoUrl: "https://www.youtube.com/watch?v=placeholder", // Placeholder
          duration: 420, // 7 minutes
          position: lessonPosition++,
          isPreview: true,
        },
        {
          title: "The Design Process",
          description: "Learn the stages of the UI/UX design process.",
          type: "TEXT",
          content: `
# The Design Process

1. **Research**:
   - Conduct user interviews and surveys.
   - Example: Create a user persona.

2. **Design**:
   - Wireframe, prototype, and iterate.
   - Example: Sketch a low-fidelity wireframe.

3. **Testing**:
   - Perform usability testing.

**Practice**:
- Create a user persona for an app.
- Write a 150-word summary of the design process.
          `,
          duration: 600, // 10 minutes
          position: lessonPosition++,
          isPreview: true,
        },
        {
          title: "Design Tools Overview",
          description: "Introduction to tools like Figma and Adobe XD.",
          type: "TEXT",
          content: `
# Design Tools Overview

1. **Figma**:
   - Cloud-based, collaborative design tool.
   - Example: Create a new frame (Artboard).

2. **Adobe XD**:
   - Prototyping and wireframing tool.
   - Example: Link two artboards for prototyping.

**Practice**:
- Set up a Figma project and create a frame.
- Summarize tool features in 150 words.
          `,
          duration: 600, // 10 minutes
          position: lessonPosition++,
          isPreview: true,
        },
        {
          title: "Quiz: UI/UX Basics",
          description: "Test your understanding of UI/UX fundamentals.",
          type: "QUIZ",
          content: `
# Quiz: UI/UX Basics

**Instructions**: Answer the following questions.

1. **What does UX focus on?**
   - A) Visual aesthetics
   - B) User experience
   - C) Code efficiency
   - D) Database design
   - **Answer**: B

2. **Which tool is cloud-based?**
   - A) Adobe XD
   - B) Figma
   - C) Sketch
   - D) Photoshop
   - **Answer**: B

3. **What is a user persona?**
   - **Answer**: A fictional representation of a target user.
          `,
          duration: 300, // 5 minutes
          position: lessonPosition++,
          isPreview: false,
        },
      ],
    },
    {
      title: "User Research and Analysis",
      description: "Learn how to conduct user research and analyze data.",
      position: 2,
      lessons: [
        {
          title: "Introduction to User Research",
          description: "Understand user research methods.",
          type: "VIDEO",
          videoUrl: "https://www.youtube.com/watch?v=placeholder", // Placeholder
          duration: 600, // 10 minutes
          position: lessonPosition++,
          isPreview: true,
        },
        {
          title: "Conducting User Interviews",
          description: "Learn to perform effective user interviews.",
          type: "TEXT",
          content: `
# Conducting User Interviews

1. **Preparation**:
   - Define goals and questions.
   - Example: Ask about user pain points.

2. **Execution**:
   - Record responses with consent.
   - Example: Use open-ended questions.

**Practice**:
- Write 5 interview questions for a fitness app.
- Summarize best practices in 150 words.
          `,
          duration: 600, // 10 minutes
          position: lessonPosition++,
          isPreview: true,
        },
        {
          title: "Creating User Personas",
          description: "Build personas based on research.",
          type: "TEXT",
          content: `
# Creating User Personas

1. **Structure**:
   - Include name, age, goals, frustrations.
   - Example: Persona for a student user.

2. **Usage**:
   - Guide design decisions.

**Practice**:
- Create a persona for an e-commerce app user.
- Summarize in 150 words.
          `,
          duration: 600, // 10 minutes
          position: lessonPosition++,
          isPreview: false,
        },
        {
          title: "Assignment: User Research",
          description: "Conduct user research for a project.",
          type: "ASSIGNMENT",
          content: `
# Assignment: User Research

**Objective**: Perform user research.

**Requirements**:
- Conduct 3 mock user interviews.
- Create 2 user personas.
- Write a 300-word report on findings.

**Submission**:
- Submit interview notes, personas, and report.
          `,
          duration: 2400, // 40 minutes
          position: lessonPosition++,
          isPreview: false,
        },
      ],
    },
    {
      title: "Wireframing and Prototyping",
      description: "Master wireframing and prototyping techniques.",
      position: 3,
      lessons: [
        {
          title: "Introduction to Wireframing",
          description: "Learn the basics of wireframing.",
          type: "VIDEO",
          videoUrl: "https://www.youtube.com/watch?v=placeholder", // Placeholder
          duration: 600, // 10 minutes
          position: lessonPosition++,
          isPreview: true,
        },
        {
          title: "Creating Wireframes in Figma",
          description: "Design low-fidelity wireframes.",
          type: "TEXT",
          content: `
# Creating Wireframes in Figma

1. **Setup**:
   - Create frames for mobile screens.
   - Example: Add rectangles for buttons.

2. **Components**:
   - Use text, shapes, and placeholders.

**Practice**:
- Create a wireframe for a login screen.
- Export as PNG and summarize in 150 words.
          `,
          duration: 600, // 10 minutes
          position: lessonPosition++,
          isPreview: true,
        },
        {
          title: "Prototyping in Figma",
          description: "Link wireframes to create prototypes.",
          type: "TEXT",
          content: `
# Prototyping in Figma

1. **Connections**:
   - Use Figma’s prototyping tab.
   - Example: Link a button to another frame.

2. **Interactions**:
   - Add transitions (e.g., slide).

**Practice**:
- Create a prototype with 3 screens.
- Export as a shareable link and summarize in 150 words.
          `,
          duration: 600, // 10 minutes
          position: lessonPosition++,
          isPreview: false,
        },
        {
          title: "Assignment: Wireframe and Prototype",
          description: "Design a wireframe and prototype.",
          type: "ASSIGNMENT",
          content: `
# Assignment: Wireframe and Prototype

**Objective**: Build a wireframe and prototype.

**Requirements**:
- Create wireframes for a 5-screen app.
- Link them into a prototype.
- Export as PNG and shareable link.
- Write a 300-word report.

**Submission**:
- Submit Figma link, PNGs, and report.
          `,
          duration: 2400, // 40 minutes
          position: lessonPosition++,
          isPreview: false,
        },
      ],
    },
    {
      title: "Visual Design and UI Principles",
      description: "Apply visual design principles to create user interfaces.",
      position: 4,
      lessons: [
        {
          title: "Introduction to Visual Design",
          description: "Learn key visual design principles.",
          type: "VIDEO",
          videoUrl: "https://www.youtube.com/watch?v=placeholder", // Placeholder
          duration: 600, // 10 minutes
          position: lessonPosition++,
          isPreview: true,
        },
        {
          title: "Typography and Color",
          description: "Use typography and color effectively.",
          type: "TEXT",
          content: `
# Typography and Color

1. **Typography**:
   - Choose readable fonts (e.g., Roboto).
   - Example: Set font size to 16px for body text.

2. **Color**:
   - Use a 60-30-10 color rule.
   - Example: Primary, secondary, accent colors.

**Practice**:
- Design a screen with consistent typography and colors.
- Export as PNG and summarize in 150 words.
          `,
          duration: 600, // 10 minutes
          position: lessonPosition++,
          isPreview: true,
        },
        {
          title: "Design Systems",
          description: "Create reusable UI components.",
          type: "TEXT",
          content: `
# Design Systems

1. **Components**:
   - Create buttons, inputs, etc., in Figma.
   - Example: Design a primary button.

2. **Consistency**:
   - Use a style guide for colors and typography.

**Practice**:
- Build a mini design system with 3 components.
- Summarize in 150 words.
          `,
          duration: 600, // 10 minutes
          position: lessonPosition++,
          isPreview: false,
        },
        {
          title: "Assignment: UI Design",
          description: "Design a visually appealing UI.",
          type: "ASSIGNMENT",
          content: `
# Assignment: UI Design

**Objective**: Create a UI design.

**Requirements**:
- Design a 3-screen app UI with a design system.
- Include typography and color guidelines.
- Export as PNG.
- Write a 300-word report.

**Submission**:
- Submit Figma link, PNGs, and report.
          `,
          duration: 2400, // 40 minutes
          position: lessonPosition++,
          isPreview: false,
        },
      ],
    },
    {
      title: "Usability Testing and Iteration",
      description: "Test and refine designs based on user feedback.",
      position: 5,
      lessons: [
        {
          title: "Introduction to Usability Testing",
          description: "Learn usability testing methods.",
          type: "VIDEO",
          videoUrl: "https://www.youtube.com/watch?v=placeholder", // Placeholder
          duration: 600, // 10 minutes
          position: lessonPosition++,
          isPreview: true,
        },
        {
          title: "Conducting Usability Tests",
          description: "Run effective usability tests.",
          type: "TEXT",
          content: `
# Conducting Usability Tests

1. **Setup**:
   - Define tasks for users.
   - Example: "Complete a purchase."

2. **Observation**:
   - Note pain points and successes.

**Practice**:
- Create a usability test plan with 3 tasks.
- Summarize in 150 words.
          `,
          duration: 600, // 10 minutes
          position: lessonPosition++,
          isPreview: true,
        },
        {
          title: "Iterating Designs",
          description: "Refine designs based on feedback.",
          type: "TEXT",
          content: `
# Iterating Designs

1. **Analyze Feedback**:
   - Identify common issues.
   - Example: Simplify navigation.

2. **Update Prototype**:
   - Revise in Figma.

**Practice**:
- Update a prototype based on mock feedback.
- Summarize changes in 150 words.
          `,
          duration: 600, // 10 minutes
          position: lessonPosition++,
          isPreview: false,
        },
        {
          title: "Assignment: Usability Testing",
          description: "Test and iterate a prototype.",
          type: "ASSIGNMENT",
          content: `
# Assignment: Usability Testing

**Objective**: Test and refine a design.

**Requirements**:
- Conduct a mock usability test with 3 users.
- Update prototype based on feedback.
- Write a 300-word report.

**Submission**:
- Submit Figma link, test notes, and report.
          `,
          duration: 2400, // 40 minutes
          position: lessonPosition++,
          isPreview: false,
        },
      ],
    },
    {
      title: "Capstone: UI/UX Portfolio Project",
      description: "Create a professional UI/UX portfolio piece.",
      position: 6,
      lessons: [
        {
          title: "Planning a UI/UX Project",
          description: "Plan a portfolio project.",
          type: "VIDEO",
          videoUrl: "https://www.youtube.com/watch?v=placeholder", // Placeholder
          duration: 600, // 10 minutes
          position: lessonPosition++,
          isPreview: true,
        },
        {
          title: "User Research and Wireframing",
          description: "Conduct research and create wireframes.",
          type: "TEXT",
          content: `
# User Research and Wireframing

1. **Research**:
   - Create personas and user flows.
   - Example: Persona for a travel app.

2. **Wireframing**:
   - Design low-fidelity screens in Figma.

**Practice**:
- Create a persona and wireframe for a 3-screen app.
- Summarize in 150 words.
          `,
          duration: 600, // 10 minutes
          position: lessonPosition++,
          isPreview: true,
        },
        {
          title: "Prototyping and UI Design",
          description: "Build a prototype and UI design.",
          type: "TEXT",
          content: `
# Prototyping and UI Design

1. **Prototyping**:
   - Link wireframes in Figma.
   - Example: Create a clickable prototype.

2. **UI Design**:
   - Apply a design system.

**Practice**:
- Create a 5-screen prototype with UI design.
- Summarize in 150 words.
          `,
          duration: 600, // 10 minutes
          position: lessonPosition++,
          isPreview: false,
        },
        {
          title: "Final Project: UI/UX Portfolio Piece",
          description: "Create a portfolio-ready UI/UX project.",
          type: "ASSIGNMENT",
          content: `
# Final Project: UI/UX Portfolio Piece

**Objective**: Create a portfolio piece.

**Requirements**:
- Design a 5–7 screen app (e.g., e-commerce).
- Include research, wireframes, prototype, UI design.
- Conduct usability testing.
- Develop a 5–7 slide presentation.
- Write a 400-word reflection.

**Submission**:
- Submit Figma link, presentation, and reflection.
          `,
          duration: 10800, // 180 minutes (3 hours)
          position: lessonPosition++,
          isPreview: false,
        },
        {
          title: "Quiz: UI/UX Portfolio",
          description: "Test your knowledge of UI/UX projects.",
          type: "QUIZ",
          content: `
# Quiz: UI/UX Portfolio

**Instructions**: Answer the following questions.

1. **What is the first step in a UI/UX project?**
   - A) Prototyping
   - B) User research
   - C) UI design
   - D) Usability testing
   - **Answer**: B

2. **Why create a design system?**
   - A) Speed up coding
   - B) Ensure consistency
   - C) Simplify research
   - D) Reduce testing
   - **Answer**: B

3. **What should a portfolio presentation include?**
   - **Answer**: Research, process, final design, testing results.
          `,
          duration: 300, // 5 minutes
          position: lessonPosition++,
          isPreview: false,
        },
      ],
    },
  ];

  // Create modules and lessons with error handling
  for (const moduleData of modulesData) {
    console.log(`Creating module: ${moduleData.title}`);
    try {
      const createdModule = await prisma.module.create({
        data: {
          title: moduleData.title,
          description: moduleData.description,
          position: moduleData.position,
          courseId: course.id,
          lessons: {
            create: moduleData.lessons.map((lesson) => {
              console.log(`  Creating lesson: ${lesson.title}`);
              return {
                title: lesson.title,
                description: lesson.description,
                type: lesson.type,
                videoUrl: lesson.videoUrl || null,
                content: lesson.content || null,
                duration: lesson.duration,
                position: lesson.position,
                isPreview: lesson.isPreview,
              };
            }),
          },
        },
      });
      console.log(`Successfully created module: ${createdModule.title}`);
    } catch (error) {
      console.error(`Error creating module ${moduleData.title}:`, error);
      throw error;
    }
  }

  console.log(
    `Successfully seeded ${modulesData.length} modules and ${
      lessonPosition - 1
    } lessons for course: ${course.title}`
  );
}

main()
  .catch((e) => {
    console.error("Seeding failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    console.log("Disconnecting Prisma client...");
    await prisma.$disconnect();
  });
