const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function main() {
  console.log("Starting seed process...");

  // Fetch the Graphic Design course
  const course = await prisma.course.findUnique({
    where: { slug: "graphic-design-adobe" },
  });

  if (!course) {
    console.error("Course with slug 'graphic-design-adobe' not found.");
    throw new Error("Course not found");
  }

  console.log(`Found course: ${course.title}`);

  let lessonPosition = 1; // Track lesson position across modules
  const modulesData = [
    {
      title: "Introduction to Graphic Design",
      description:
        "Learn the fundamentals of graphic design and its role in visual communication.",
      position: 1,
      lessons: [
        {
          title: "What is Graphic Design?",
          description:
            "Explore the history, principles, and applications of graphic design.",
          type: "VIDEO",
          videoUrl: "https://www.youtube.com/watch?v=3o58TKWIe5E", // Envato Tuts+: Introduction to Graphic Design
          duration: 420, // 7 minutes
          position: lessonPosition++,
          isPreview: true,
        },
        {
          title: "Key Design Principles",
          description:
            "Understand balance, contrast, hierarchy, and alignment.",
          type: "TEXT",
          content: `
# Key Design Principles

Graphic design is built on core principles that guide effective visuals:

1. **Balance**: Distribute elements evenly to create stability.
   - Example: Symmetrical layouts feel formal, while asymmetrical ones are dynamic.
2. **Contrast**: Use differences in color, size, or shape to draw attention.
   - Example: Pair a bold font with a light one for emphasis.
3. **Hierarchy**: Organize content to guide the viewer's eye.
   - Example: Use larger text for headings and smaller text for body copy.
4. **Alignment**: Ensure elements are visually connected for a clean look.

**Practice**:
- Analyze a poster and identify how it uses balance and contrast.
- Sketch a simple layout with clear hierarchy.
          `,
          duration: 600, // 10 minutes
          position: lessonPosition++,
          isPreview: true,
        },
        {
          title: "Quiz: Graphic Design Basics",
          description: "Test your understanding of graphic design principles.",
          type: "QUIZ",
          content: `
# Quiz: Graphic Design Basics

**Instructions**: Answer the following questions. This is a manual quiz; replace with AI-generated questions later.

1. **What is the purpose of contrast in design?**
   - A) To create confusion
   - B) To draw attention and emphasize elements
   - C) To align elements
   - D) To reduce visibility
   - **Answer**: B

2. **Which principle ensures elements are visually connected?**
   - A) Balance
   - B) Hierarchy
   - C) Alignment
   - D) Contrast
   - **Answer**: C

3. **What is an example of hierarchy in design?**
   - **Answer**: Using larger text for headings and smaller text for body copy.
          `,
          duration: 300, // 5 minutes
          position: lessonPosition++,
          isPreview: false,
        },
      ],
    },
    {
      title: "Setting Up Adobe Creative Suite",
      description: "Install and navigate Photoshop, Illustrator, and InDesign.",
      position: 2,
      lessons: [
        {
          title: "Introduction to Adobe Creative Suite",
          description:
            "Understand the roles of Photoshop, Illustrator, and InDesign.",
          type: "VIDEO",
          videoUrl: "https://www.youtube.com/watch?v=9oYpK6N2j8Y", // Adobe: Getting Started with Creative Cloud
          duration: 360, // 6 minutes
          position: lessonPosition++,
          isPreview: true,
        },
        {
          title: "Installing Adobe Software",
          description:
            "Set up your Adobe Creative Cloud account and install tools.",
          type: "TEXT",
          content: `
# Installing Adobe Software

Follow these steps to set up Adobe Creative Suite:

1. **Create an Adobe Account**:
   - Visit [adobe.com](https://www.adobe.com) and sign up.
   - Choose a Creative Cloud plan (e.g., All Apps or Photography).

2. **Install Creative Cloud Desktop App**:
   - Download from Adobe’s website.
   - Log in and install Photoshop, Illustrator, and InDesign.

3. **Verify Installation**:
   - Open each app and create a new project.
   - Explore the interface to familiarize yourself.

**Practice**:
- Install Photoshop and create a blank canvas.
- Save your first project as a .psd file.
          `,
          duration: 600, // 10 minutes
          position: lessonPosition++,
          isPreview: true,
        },
        {
          title: "Navigating Adobe Interfaces",
          description:
            "Learn the basic layouts of Photoshop, Illustrator, and InDesign.",
          type: "VIDEO",
          videoUrl: "https://www.youtube.com/watch?v=5Y0n1i8B0jY", // Envato Tuts+: Photoshop Interface Overview
          duration: 480, // 8 minutes
          position: lessonPosition++,
          isPreview: false,
        },
      ],
    },
    {
      title: "Photoshop Fundamentals",
      description: "Master Photoshop for image editing and digital design.",
      position: 3,
      lessons: [
        {
          title: "Photoshop Basics",
          description: "Learn layers, tools, and basic editing techniques.",
          type: "VIDEO",
          videoUrl: "https://www.youtube.com/watch?v=IW-BBp3e-iw", // Adobe: Photoshop for Beginners
          duration: 600, // 10 minutes
          position: lessonPosition++,
          isPreview: false,
        },
        {
          title: "Working with Layers",
          description: "Organize and manipulate layers in Photoshop.",
          type: "TEXT",
          content: `
# Working with Layers in Photoshop

Layers are the backbone of Photoshop projects:

1. **Creating Layers**:
   - Click the "New Layer" icon in the Layers panel.
   - Name layers for organization (e.g., "Background", "Text").

2. **Layer Types**:
   - Image layers: Contain raster graphics.
   - Adjustment layers: Apply non-destructive edits (e.g., brightness).
   - Text layers: Add editable text.

3. **Blending Modes**:
   - Experiment with modes like Multiply or Overlay for effects.

**Practice**:
- Create a new Photoshop project with 3 layers: background, image, and text.
- Apply an adjustment layer to change the image’s brightness.
          `,
          duration: 600, // 10 minutes
          position: lessonPosition++,
          isPreview: false,
        },
        {
          title: "Photo Editing Basics",
          description: "Adjust colors, crop images, and remove blemishes.",
          type: "VIDEO",
          videoUrl: "https://www.youtube.com/watch?v=2gP3t9d22kY", // Adobe: Basic Photo Editing
          duration: 540, // 9 minutes
          position: lessonPosition++,
          isPreview: false,
        },
        {
          title: "Assignment: Social Media Graphic",
          description: "Create a promotional graphic for social media.",
          type: "ASSIGNMENT",
          content: `
# Assignment: Social Media Graphic

**Objective**: Design a 1080x1080px social media post for a fictional brand.

**Requirements**:
- Use Photoshop to create the graphic.
- Include an image, text, and a call-to-action (e.g., "Shop Now").
- Apply at least one adjustment layer (e.g., hue/saturation).
- Export as a PNG.

**Submission**:
- Save your .psd file and export the final PNG.
- Write a brief description of your design choices.
          `,
          duration: 1200, // 20 minutes
          position: lessonPosition++,
          isPreview: false,
        },
        {
          title: "Quiz: Photoshop Fundamentals",
          description: "Test your knowledge of Photoshop basics.",
          type: "QUIZ",
          content: `
# Quiz: Photoshop Fundamentals

**Instructions**: Answer the following questions.

1. **What is the purpose of an adjustment layer?**
   - A) To add text
   - B) To apply non-destructive edits
   - C) To create new layers
   - D) To crop images
   - **Answer**: B

2. **Which tool is used to select a specific area of an image?**
   - A) Brush Tool
   - B) Lasso Tool
   - C) Text Tool
   - D) Crop Tool
   - **Answer**: B

3. **What is a benefit of naming layers?**
   - **Answer**: Improves project organization and workflow efficiency.
          `,
          duration: 300, // 5 minutes
          position: lessonPosition++,
          isPreview: false,
        },
      ],
    },
    {
      title: "Illustrator Fundamentals",
      description: "Create vector graphics with Adobe Illustrator.",
      position: 4,
      lessons: [
        {
          title: "Illustrator Basics",
          description: "Learn Illustrator’s interface and vector tools.",
          type: "VIDEO",
          videoUrl: "https://www.youtube.com/watch?v=3gZwV4z84SI", // Adobe: Illustrator for Beginners
          duration: 600, // 10 minutes
          position: lessonPosition++,
          isPreview: false,
        },
        {
          title: "Working with Shapes",
          description: "Create and manipulate vector shapes.",
          type: "TEXT",
          content: `
# Working with Shapes in Illustrator

Vectors are scalable graphics ideal for logos and icons:

1. **Shape Tools**:
   - Use Rectangle, Ellipse, and Polygon tools to create shapes.
   - Hold Shift to constrain proportions.

2. **Pathfinder**:
   - Combine shapes using Unite, Minus Front, or Intersect.
   - Example: Create a custom icon by merging circles and rectangles.

3. **Stroke and Fill**:
   - Adjust stroke weight and fill color for visual impact.

**Practice**:
- Create a simple icon using basic shapes.
- Use Pathfinder to combine two shapes into a new form.
          `,
          duration: 600, // 10 minutes
          position: lessonPosition++,
          isPreview: false,
        },
        {
          title: "Creating a Logo",
          description: "Design a professional logo using Illustrator.",
          type: "VIDEO",
          videoUrl: "https://www.youtube.com/watch?v=1yJ-_O8kN0U", // Gareth David Studio: Logo Design
          duration: 720, // 12 minutes
          position: lessonPosition++,
          isPreview: false,
        },
        {
          title: "Assignment: Logo Design",
          description: "Design a logo for a fictional brand.",
          type: "ASSIGNMENT",
          content: `
# Assignment: Logo Design

**Objective**: Create a scalable logo for a fictional company.

**Requirements**:
- Use Illustrator to design a vector-based logo.
- Incorporate at least two shapes and one text element.
- Export as SVG and PNG.
- Ensure the logo works in both color and monochrome.

**Submission**:
- Save your .ai file and export SVG/PNG versions.
- Write a short explanation of your design concept.
          `,
          duration: 1800, // 30 minutes
          position: lessonPosition++,
          isPreview: false,
        },
      ],
    },
    {
      title: "InDesign Fundamentals",
      description: "Design layouts for print and digital with Adobe InDesign.",
      position: 5,
      lessons: [
        {
          title: "InDesign Basics",
          description: "Learn InDesign’s interface and layout tools.",
          type: "VIDEO",
          videoUrl: "https://www.youtube.com/watch?v=7hwp3Ad8UEI", // Adobe: InDesign for Beginners
          duration: 540, // 9 minutes
          position: lessonPosition++,
          isPreview: false,
        },
        {
          title: "Creating a Magazine Layout",
          description: "Set up pages, grids, and text styles.",
          type: "TEXT",
          content: `
# Creating a Magazine Layout in InDesign

InDesign is ideal for multi-page layouts:

1. **Document Setup**:
   - Create a new document with A4 size and 3mm bleed.
   - Set up a grid with 12 columns for flexibility.

2. **Master Pages**:
   - Add page numbers and headers on master pages.
   - Apply masters to document pages.

3. **Paragraph Styles**:
   - Create styles for headings, body text, and captions.
   - Example: Set body text to 11pt Adobe Garamond.

**Practice**:
- Set up a 4-page document with a grid and master page.
- Create a paragraph style for article text.
          `,
          duration: 600, // 10 minutes
          position: lessonPosition++,
          isPreview: false,
        },
        {
          title: "Assignment: Magazine Spread",
          description: "Design a two-page magazine spread.",
          type: "ASSIGNMENT",
          content: `
# Assignment: Magazine Spread

**Objective**: Create a two-page magazine spread for a lifestyle article.

**Requirements**:
- Use InDesign to design a 2-page layout (A4).
- Include text, images, and headings.
- Apply at least two paragraph styles.
- Export as a PDF with bleed.

**Submission**:
- Save your .indd file and export the PDF.
- Describe your layout choices in a short paragraph.
          `,
          duration: 1800, // 30 minutes
          position: lessonPosition++,
          isPreview: false,
        },
      ],
    },
    {
      title: "Color Theory and Application",
      description: "Master color theory and its use in design projects.",
      position: 6,
      lessons: [
        {
          title: "Understanding Color Theory",
          description: "Learn color wheels, harmony, and psychology.",
          type: "VIDEO",
          videoUrl: "https://www.youtube.com/watch?v=Qj1FK8n7WgY", // Envato Tuts+: Color Theory
          duration: 480, // 8 minutes
          position: lessonPosition++,
          isPreview: false,
        },
        {
          title: "Applying Color in Photoshop",
          description: "Use color palettes and swatches in Photoshop.",
          type: "TEXT",
          content: `
# Applying Color in Photoshop

Colors enhance design impact:

1. **Color Picker**:
   - Select colors using the Color Picker or enter HEX codes.
   - Example: Use #FF5733 for a vibrant orange.

2. **Swatches**:
   - Save frequently used colors in the Swatches panel.
   - Create a palette for a project (e.g., primary, secondary, accent).

3. **Gradients**:
   - Apply gradients for modern effects.
   - Example: Create a blue-to-purple gradient background.

**Practice**:
- Create a color palette with 5 swatches in Photoshop.
- Apply a gradient to a rectangular shape.
          `,
          duration: 600, // 10 minutes
          position: lessonPosition++,
          isPreview: false,
        },
        {
          title: "Quiz: Color Theory",
          description: "Test your knowledge of color theory.",
          type: "QUIZ",
          content: `
# Quiz: Color Theory

**Instructions**: Answer the following questions.

1. **What is a complementary color pair?**
   - A) Colors next to each other on the color wheel
   - B) Colors opposite each other on the color wheel
   - C) Colors with the same hue
   - D) Colors with no contrast
   - **Answer**: B

2. **What emotion is often associated with blue?**
   - A) Energy
   - B) Calmness
   - C) Anger
   - D) Excitement
   - **Answer**: B

3. **What is the purpose of a color palette in design?**
   - **Answer**: To ensure color consistency and harmony across a project.
          `,
          duration: 300, // 5 minutes
          position: lessonPosition++,
          isPreview: false,
        },
      ],
    },
    {
      title: "Typography and Layout",
      description: "Master typography and layout design for print and digital.",
      position: 7,
      lessons: [
        {
          title: "Introduction to Typography",
          description: "Learn font types, pairing, and hierarchy.",
          type: "VIDEO",
          videoUrl: "https://www.youtube.com/watch?v=sByzHoiYFX0", // Envato Tuts+: Typography Basics
          duration: 420, // 7 minutes
          position: lessonPosition++,
          isPreview: false,
        },
        {
          title: "Typography in Photoshop",
          description: "Apply fonts and text effects in Photoshop.",
          type: "VIDEO",
          videoUrl: "https://www.youtube.com/watch?v=6rWJBz7n0cM", // Adobe: Typography in Photoshop
          duration: 360, // 6 minutes
          position: lessonPosition++,
          isPreview: false,
        },
        {
          title: "Assignment: Poster Design",
          description: "Create a typographic poster.",
          type: "ASSIGNMENT",
          content: `
# Assignment: Poster Design

**Objective**: Design an A3 poster with a focus on typography.

**Requirements**:
- Use Photoshop or Illustrator.
- Select two complementary fonts (e.g., serif and sans-serif).
- Include a headline, subhead, and body text.
- Export as a PNG or PDF.

**Submission**:
- Save your source file and export the final design.
- Explain your font choices and hierarchy decisions.
          `,
          duration: 1800, // 30 minutes
          position: lessonPosition++,
          isPreview: false,
        },
      ],
    },
    {
      title: "Branding and Identity Design",
      description: "Create cohesive brand identities using Adobe tools.",
      position: 8,
      lessons: [
        {
          title: "What is Branding?",
          description: "Understand branding and visual identity.",
          type: "VIDEO",
          videoUrl: "https://www.youtube.com/watch?v=5X0mFlAuA0s", // Gareth David Studio: Branding Basics
          duration: 480, // 8 minutes
          position: lessonPosition++,
          isPreview: false,
        },
        {
          title: "Designing a Brand Identity",
          description: "Create logos, business cards, and style guides.",
          type: "TEXT",
          content: `
# Designing a Brand Identity

A brand identity includes:

1. **Logo**:
   - Design in Illustrator for scalability.
   - Example: Create a minimalist logo with a unique icon.

2. **Business Card**:
   - Use InDesign to layout a 3.5x2-inch card.
   - Include logo, name, and contact details.

3. **Style Guide**:
   - Define colors, fonts, and logo usage rules.
   - Example: Specify primary color as #2E86C1.

**Practice**:
- Design a logo for a fictional brand in Illustrator.
- Create a business card layout in InDesign.
          `,
          duration: 900, // 15 minutes
          position: lessonPosition++,
          isPreview: false,
        },
        {
          title: "Assignment: Brand Identity Package",
          description:
            "Create a complete brand identity for a fictional company.",
          type: "ASSIGNMENT",
          content: `
# Assignment: Brand Identity Package

**Objective**: Develop a brand identity for a fictional business.

**Requirements**:
- Design a logo (Illustrator), business card (InDesign), and style guide (InDesign or PDF).
- Use consistent colors and fonts.
- Export deliverables as PNG, SVG, and PDF.

**Submission**:
- Submit source files and exported assets.
- Include a 200-word explanation of your brand concept.
          `,
          duration: 3600, // 60 minutes
          position: lessonPosition++,
          isPreview: false,
        },
      ],
    },
    {
      title: "Advanced Photoshop Techniques",
      description: "Explore advanced Photoshop tools for professional designs.",
      position: 9,
      lessons: [
        {
          title: "Advanced Selections and Masks",
          description: "Use masks and selections for precise editing.",
          type: "VIDEO",
          videoUrl: "https://www.youtube.com/watch?v=6V6zEzrAKkM", // Adobe: Advanced Masking
          duration: 600, // 10 minutes
          position: lessonPosition++,
          isPreview: false,
        },
        {
          title: "Smart Objects and Filters",
          description: "Apply non-destructive edits with smart objects.",
          type: "TEXT",
          content: `
# Smart Objects and Filters in Photoshop

**Smart Objects**:
- Convert layers to smart objects for non-destructive scaling.
- Example: Resize a logo without losing quality.

**Filters**:
- Apply filters like Blur or Liquify via Filter menu.
- Use smart filters to edit effects later.

**Practice**:
- Convert an image layer to a smart object.
- Apply a Gaussian Blur filter and adjust its settings.
          `,
          duration: 600, // 10 minutes
          position: lessonPosition++,
          isPreview: false,
        },
        {
          title: "Quiz: Advanced Photoshop",
          description: "Test your knowledge of advanced Photoshop techniques.",
          type: "QUIZ",
          content: `
# Quiz: Advanced Photoshop

**Instructions**: Answer the following questions.

1. **What is the benefit of a smart object?**
   - A) Increases file size
   - B) Allows non-destructive edits
   - C) Reduces image quality
   - D) Limits layer options
   - **Answer**: B

2. **What does a layer mask do?**
   - A) Permanently deletes pixels
   - B) Hides or reveals parts of a layer
   - C) Changes layer colors
   - D) Adds text
   - **Answer**: B

3. **What is an example of a smart filter?**
   - **Answer**: Applying a Blur filter to a smart object.
          `,
          duration: 300, // 5 minutes
          position: lessonPosition++,
          isPreview: false,
        },
      ],
    },
    {
      title: "Advanced Illustrator Techniques",
      description: "Master complex vector designs in Illustrator.",
      position: 10,
      lessons: [
        {
          title: "Advanced Pathfinder and Effects",
          description: "Create intricate designs with Pathfinder and effects.",
          type: "VIDEO",
          videoUrl: "https://www.youtube.com/watch?v=2q3fH3oD7kM", // Envato Tuts+: Advanced Illustrator
          duration: 600, // 10 minutes
          position: lessonPosition++,
          isPreview: false,
        },
        {
          title: "Creating Infographics",
          description: "Design data-driven infographics.",
          type: "VIDEO",
          videoUrl: "https://www.youtube.com/watch?v=1kO8t3Lvf4Y", // Gareth David Studio: Illustrator Infographic
          duration: 720, // 12 minutes
          position: lessonPosition++,
          isPreview: false,
        },
        {
          title: "Assignment: Infographic Design",
          description: "Create an infographic on a chosen topic.",
          type: "ASSIGNMENT",
          content: `
# Assignment: Infographic Design

**Objective**: Design a vector-based infographic in Illustrator.

**Requirements**:
- Choose a topic (e.g., "Global Warming Stats").
- Use charts, icons, and text to present data.
- Export as SVG and PNG.

**Submission**:
- Submit your .ai file and exported assets.
- Include a brief description of your data sources.
          `,
          duration: 2400, // 40 minutes
          position: lessonPosition++,
          isPreview: false,
        },
      ],
    },
    {
      title: "Print and Digital Publishing",
      description: "Prepare designs for print and digital distribution.",
      position: 11,
      lessons: [
        {
          title: "Preparing Files for Print",
          description: "Set up files with bleed, CMYK, and resolution.",
          type: "VIDEO",
          videoUrl: "https://www.youtube.com/watch?v=3e5f0lXwT0o", // Envato Tuts+: Preparing for Print
          duration: 480, // 8 minutes
          position: lessonPosition++,
          isPreview: false,
        },
        {
          title: "Exporting for Digital",
          description: "Export assets for web and social media.",
          type: "TEXT",
          content: `
# Exporting for Digital in Adobe Tools

**Photoshop**:
- Export as PNG or JPEG for web.
- Use "Export As" with 72 DPI for digital use.

**Illustrator**:
- Export as SVG for scalable web graphics.
- Example: Save a logo as SVG for responsive websites.

**InDesign**:
- Export as PDF for digital distribution.
- Use "Interactive PDF" for web viewing.

**Practice**:
- Export a Photoshop graphic as a web-ready PNG.
- Save an Illustrator logo as an SVG.
          `,
          duration: 600, // 10 minutes
          position: lessonPosition++,
          isPreview: false,
        },
        {
          title: "Assignment: Print and Digital Package",
          description: "Create assets for both print and digital use.",
          type: "ASSIGNMENT",
          content: `
# Assignment: Print and Digital Package

**Objective**: Prepare a flyer for print and digital distribution.

**Requirements**:
- Design a flyer in InDesign (A5 size, CMYK, 3mm bleed).
- Export a print-ready PDF.
- Create a web version in Photoshop (1080x1350px, RGB).
- Export the web version as PNG.

**Submission**:
- Submit .indd, print PDF, and web PNG.
- Describe your export settings.
          `,
          duration: 2400, // 40 minutes
          position: lessonPosition++,
          isPreview: false,
        },
      ],
    },
    {
      title: "Portfolio and Career Building",
      description:
        "Build a professional portfolio and prepare for a design career.",
      position: 12,
      lessons: [
        {
          title: "Creating a Design Portfolio",
          description: "Showcase your work in a professional portfolio.",
          type: "VIDEO",
          videoUrl: "https://www.youtube.com/watch?v=1kWGSXw3RhU", // The Futur: Building a Portfolio
          duration: 600, // 10 minutes
          position: lessonPosition++,
          isPreview: false,
        },
        {
          title: "Career Tips for Designers",
          description: "Learn how to market yourself and find design jobs.",
          type: "TEXT",
          content: `
# Career Tips for Graphic Designers

Build a successful design career:

1. **Portfolio**:
   - Showcase 5–10 of your best projects.
   - Host on Behance, Dribbble, or a personal website.

2. **Networking**:
   - Join design communities on LinkedIn or Discord.
   - Attend local design meetups or webinars.

3. **Freelancing**:
   - Create profiles on Upwork or Fiverr.
   - Set competitive rates (e.g., $30–$50/hour for beginners).

**Practice**:
- Select 3 projects from this course for your portfolio.
- Draft a Behance profile description.
          `,
          duration: 600, // 10 minutes
          position: lessonPosition++,
          isPreview: false,
        },
        {
          title: "Final Project: Portfolio Presentation",
          description: "Compile and present your graphic design portfolio.",
          type: "ASSIGNMENT",
          content: `
# Final Project: Portfolio Presentation

**Objective**: Create and present a professional graphic design portfolio.

**Requirements**:
- Compile 5–7 projects from this course (e.g., logo, poster, brand identity).
- Use InDesign or a website builder to create a portfolio layout.
- Include project descriptions and your design process.
- Export as a PDF or host online (e.g., Behance link).

**Submission**:
- Submit your portfolio PDF or URL.
- Write a 300-word reflection on your learning journey.
          `,
          duration: 7200, // 120 minutes
          position: lessonPosition++,
          isPreview: false,
        },
        {
          title: "Quiz: Portfolio and Career",
          description:
            "Test your knowledge of portfolio building and career strategies.",
          type: "QUIZ",
          content: `
# Quiz: Portfolio and Career

**Instructions**: Answer the following questions.

1. **What is a key element of a design portfolio?**
   - A) Including every project you’ve ever done
   - B) Showcasing a curated selection of your best work
   - C) Using only one design tool
   - D) Avoiding project descriptions
   - **Answer**: B

2. **Which platform is suitable for hosting a design portfolio?**
   - A) YouTube
   - B) Behance
   - C) GitHub
   - D) Twitter
   - **Answer**: B

3. **Why is networking important for designers?**
   - **Answer**: To build connections, find clients, and stay updated on industry trends.
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
    `Successfully seeded modules and lessons for course: ${course.title}`
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
