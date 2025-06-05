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
        "Learn the fundamentals of UI/UX design, its importance in product development, and the roles of UI and UX designers.",
      position: 1,
      lessons: [
        {
          title: "What is UI/UX Design?",
          description:
            "Understand the difference between UI and UX and their impact on user satisfaction.",
          type: "VIDEO",
          videoUrl: "https://www.youtube.com/watch?v=placeholder", // Placeholder
          duration: 420, // 7 minutes
          position: lessonPosition++,
          isPreview: true,
        },
        {
          title: "The UI/UX Design Process",
          description:
            "Explore the stages of the UI/UX design process, from research to testing.",
          type: "TEXT",
          content: `
# The UI/UX Design Process

The UI/UX design process is a structured approach to creating user-centered products. It ensures that designs are both functional and visually appealing. Below are the key stages:

1. **Research**:
   - Conduct user interviews, surveys, and competitive analysis to understand user needs.
   - Example: Interview 5 users to identify pain points in an e-commerce app.
   - Tools: Google Forms, Zoom for interviews.

2. **Define**:
   - Create user personas, user flows, and define project goals.
   - Example: Develop a persona for a frequent online shopper named "Sarah, 28, tech-savvy."
   - Tools: Figma for user flows, Miro for brainstorming.

3. **Design**:
   - Sketch wireframes, create prototypes, and design high-fidelity UI.
   - Example: Wireframe a checkout flow in Figma with 3 screens.
   - Tools: Figma, Adobe XD.

4. **Test**:
   - Perform usability testing to validate designs.
   - Example: Test prototype with 5 users to ensure intuitive navigation.
   - Tools: Lookback, Maze.

5. **Iterate**:
   - Refine designs based on feedback.
   - Example: Simplify a form based on user confusion during testing.

**Practice**:
- Research a mobile app (e.g., a food delivery app) and list 3 user pain points.
- Create a user persona for one user type.
- Sketch a basic user flow for a core feature (e.g., ordering food).
- Write a 150-word summary of the design process, explaining how each stage contributes to a better user experience.

**Resources**:
- Book: "Don't Make Me Think" by Steve Krug.
- Article: "The UX Design Process" on Nielsen Norman Group website.
          `,
          duration: 600, // 10 minutes
          position: lessonPosition++,
          isPreview: true,
        },
        {
          title: "Overview of Design Tools",
          description:
            "Get familiar with popular UI/UX design tools like Figma, Adobe XD, and Sketch.",
          type: "TEXT",
          content: `
# Overview of Design Tools

UI/UX designers use specialized tools to create wireframes, prototypes, and high-fidelity designs. Below is an overview of the most popular tools:

1. **Figma**:
   - A cloud-based, collaborative design tool for wireframing, prototyping, and UI design.
   - Features: Real-time collaboration, plugins, and a robust prototyping mode.
   - Example: Create a 375x812px frame for a mobile app screen.
   - Steps:
     \`\`\`
     1. Open Figma and create a new project.
     2. Add a frame: Select "Frame" tool (F) and choose iPhone 13 preset.
     3. Add a rectangle for a button and style it.
     \`\`\`

2. **Adobe XD**:
   - A desktop-based tool for wireframing and prototyping, with strong integration with Adobe Creative Cloud.
   - Features: Auto-animate, voice prototyping.
   - Example: Link two artboards to simulate a screen transition.
   - Steps:
     \`\`\`
     1. Open Adobe XD and create a new artboard (iPhone 12).
     2. Add a button and text.
     3. Use the Prototype tab to link to another artboard with a slide transition.
     \`\`\`

3. **Sketch**:
   - A Mac-only tool popular for UI design, especially in startups.
   - Features: Symbol libraries, export presets.
   - Example: Create a reusable button symbol.

**Practice**:
- Sign up for a free Figma account and create a new project.
- Add a mobile frame and design a simple button with text.
- Export the frame as a PNG.
- Write a 150-word summary comparing Figma and Adobe XD based on their features and ease of use.

**Resources**:
- Figma Tutorials: Figma’s YouTube channel.
- Adobe XD Guide: Adobe’s official documentation.
          `,
          duration: 600, // 10 minutes
          position: lessonPosition++,
          isPreview: true,
        },
        {
          title: "Quiz: UI/UX Fundamentals",
          description:
            "Test your understanding of UI/UX design basics and tools.",
          type: "QUIZ",
          content: `
# Quiz: UI/UX Fundamentals

**Instructions**: Answer the following questions to test your knowledge.

1. **What is the primary focus of UX design?**
   - A) Visual aesthetics
   - B) User experience and usability
   - C) Backend development
   - D) Database management
   - **Answer**: B

2. **Which tool supports real-time collaboration?**
   - A) Adobe XD
   - B) Figma
   - C) Sketch
   - D) Photoshop
   - **Answer**: B

3. **What is the purpose of a user persona?**
   - A) To write code
   - B) To represent a target user
   - C) To design a logo
   - D) To manage a database
   - **Answer**: B

4. **Name one stage of the UI/UX design process.**
   - **Answer**: Research, Define, Design, Test, or Iterate
          `,
          duration: 300, // 5 minutes
          position: lessonPosition++,
          isPreview: false,
        },
      ],
    },
    {
      title: "User Research and Analysis",
      description:
        "Master techniques for conducting user research and analyzing data to inform design decisions.",
      position: 2,
      lessons: [
        {
          title: "Introduction to User Research",
          description:
            "Learn the importance of user research and various research methods.",
          type: "VIDEO",
          videoUrl: "https://www.youtube.com/watch?v=placeholder", // Placeholder
          duration: 600, // 10 minutes
          position: lessonPosition++,
          isPreview: true,
        },
        {
          title: "Conducting User Interviews",
          description:
            "Plan and execute effective user interviews to gather insights.",
          type: "TEXT",
          content: `
# Conducting User Interviews

User interviews are a qualitative research method to understand user needs, behaviors, and pain points. They help designers create empathetic, user-centered designs.

1. **Preparation**:
   - Define objectives: What do you want to learn?
   - Example: Understand how users shop for groceries online.
   - Create a question guide with open-ended questions.
   - Example Questions:
     - What challenges do you face when shopping online?
     - How often do you use grocery delivery apps?
     - What features would make your experience better?

2. **Execution**:
   - Conduct interviews in a comfortable setting (e.g., via Zoom).
   - Record with user consent for analysis.
   - Use active listening and avoid leading questions.
   - Example: Instead of "Do you like fast checkout?", ask "How do you feel about the checkout process?"

3. **Analysis**:
   - Transcribe interviews and identify themes.
   - Example: Common theme: Users want faster checkout options.
   - Tools: Otter.ai for transcription, Miro for affinity mapping.

**Practice**:
- Write a 5-question interview guide for a travel booking app.
- Conduct a mock interview with a friend or colleague.
- Summarize findings in 150 words, highlighting one key user need.
- Create an affinity map (on paper or in Miro) to organize insights.

**Resources**:
- Article: "How to Conduct User Interviews" on Interaction Design Foundation.
- Tool: Miro for affinity mapping.
          `,
          duration: 600, // 10 minutes
          position: lessonPosition++,
          isPreview: true,
        },
        {
          title: "Creating User Personas",
          description:
            "Develop user personas to represent your target audience.",
          type: "TEXT",
          content: `
# Creating User Personas

User personas are fictional representations of your target users, based on research data. They help designers empathize with users and make informed design decisions.

1. **Structure**:
   - Include: Name, age, occupation, goals, frustrations, and behaviors.
   - Example Persona:
     \`\`\`
     Name: Alex, 32
     Occupation: Marketing Manager
     Goals: Book flights quickly, find affordable options
     Frustrations: Complex booking forms, hidden fees
     Behaviors: Uses mobile apps, compares prices
     \`\`\`

2. **Creation Process**:
   - Analyze interview data to identify common traits.
   - Group users by goals and pain points.
   - Create 2–3 personas to cover key user types.
   - Use a template in Figma or Canva for visualization.

3. **Usage**:
   - Refer to personas during wireframing and prototyping.
   - Example: Ensure Alex’s need for quick booking is addressed in the UI.

**Practice**:
- Based on mock interview data, create a user persona for a fitness app user.
- Include name, age, goals, frustrations, and behaviors.
- Design the persona in Figma or Canva.
- Write a 150-word summary explaining how the persona will guide your design.

**Resources**:
- Template: Persona templates on Canva.
- Guide: "How to Create User Personas" on UXPin.
          `,
          duration: 600, // 10 minutes
          position: lessonPosition++,
          isPreview: false,
        },
        {
          title: "User Journey Mapping",
          description:
            "Create user journey maps to visualize user interactions.",
          type: "TEXT",
          content: `
# User Journey Mapping

A user journey map visualizes a user’s experience with a product, highlighting touchpoints, emotions, and pain points. It helps identify opportunities for improvement.

1. **Components**:
   - Stages: Steps a user takes (e.g., Discover, Browse, Purchase).
   - Actions: What the user does at each stage.
   - Emotions: How the user feels (e.g., frustrated, delighted).
   - Pain Points: Problems encountered.
   - Opportunities: Ways to improve the experience.
   - Example:
     \`\`\`
     Stage: Purchase
     Action: Enters payment details
     Emotion: Anxious
     Pain Point: Complex form
     Opportunity: Simplify form with autofill
     \`\`\`

2. **Creation Process**:
   - Use research data to define stages and actions.
   - Map emotions using a scale (e.g., happy to frustrated).
   - Identify pain points and brainstorm solutions.
   - Tools: Figma, Miro, or pen and paper.

**Practice**:
- Create a user journey map for a user booking a hotel on an app.
- Include 5 stages, actions, emotions, pain points, and opportunities.
- Design the map in Figma or Miro.
- Write a 150-word summary explaining how the map informs design improvements.

**Resources**:
- Guide: "User Journey Mapping" on Nielsen Norman Group.
- Tool: Miro for journey mapping templates.
          `,
          duration: 600, // 10 minutes
          position: lessonPosition++,
          isPreview: false,
        },
        {
          title: "Assignment: User Research Plan",
          description: "Develop a comprehensive user research plan.",
          type: "ASSIGNMENT",
          content: `
# Assignment: User Research Plan

**Objective**: Conduct user research to inform a design project.

**Requirements**:
- Choose a product (e.g., a productivity app).
- Create a 5-question interview guide.
- Conduct 3 mock user interviews (with friends or colleagues).
- Develop 2 user personas based on findings.
- Create a user journey map for one persona’s interaction with the product.
- Write a 300-word report summarizing your research process, key insights, and how they will influence your design.

**Submission**:
- Submit:
  - Interview guide (PDF or text).
  - Persona designs (Figma/Canva link or PNG).
  - User journey map (Figma/Miro link or PNG).
  - 300-word report (PDF or text).

**Evaluation Criteria**:
- Clarity and relevance of interview questions.
- Depth and realism of personas.
- Detail in the user journey map.
- Insightfulness of the report.

**Resources**:
- Template: User research templates on Figma Community.
- Guide: "User Research Basics" on usability.gov.
          `,
          duration: 2400, // 40 minutes
          position: lessonPosition++,
          isPreview: false,
        },
      ],
    },
    {
      title: "Wireframing and Prototyping",
      description:
        "Learn to create wireframes and interactive prototypes to visualize and test design ideas.",
      position: 3,
      lessons: [
        {
          title: "Introduction to Wireframing",
          description:
            "Understand the role of wireframes in the design process.",
          type: "VIDEO",
          videoUrl: "https://www.youtube.com/watch?v=placeholder", // Placeholder
          duration: 600, // 10 minutes
          position: lessonPosition++,
          isPreview: true,
        },
        {
          title: "Creating Wireframes in Figma",
          description: "Design low-fidelity wireframes for a mobile app.",
          type: "TEXT",
          content: `
# Creating Wireframes in Figma

Wireframes are low-fidelity sketches of a user interface, focusing on layout and functionality without visual polish. They help designers plan the structure of a product.

1. **Setup**:
   - Create a new Figma project and add a frame (e.g., iPhone 13: 375x812px).
   - Example: Design a login screen.
   - Steps:
     \`\`\`
     1. Select the Frame tool (F) and choose a mobile preset.
     2. Add rectangles for buttons and text fields.
     3. Use text layers for labels (e.g., "Email", "Password").
     \`\`\`

2. **Best Practices**:
   - Keep it simple: Use grayscale and basic shapes.
   - Focus on layout: Prioritize content hierarchy.
   - Example: Place the "Login" button prominently below input fields.

3. **Tools**:
   - Figma: Use shapes, text, and layout grid.
   - Plugins: Wireframe kits (e.g., Wireframe Kit by Figma Community).

**Practice**:
- Create a wireframe for a mobile app login screen in Figma.
- Include 2 input fields, a button, and a "Forgot Password" link.
- Export the wireframe as a PNG.
- Write a 150-word summary explaining your layout choices and how they support usability.

**Resources**:
- Tutorial: Figma’s "Wireframing in Figma" on YouTube.
- Plugin: Wireframe Kit on Figma Community.
          `,
          duration: 600, // 10 minutes
          position: lessonPosition++,
          isPreview: true,
        },
        {
          title: "Prototyping in Figma",
          description: "Link wireframes to create interactive prototypes.",
          type: "TEXT",
          content: `
# Prototyping in Figma

Prototypes are interactive mockups that simulate user interactions with a product. They help test usability before development.

1. **Setup**:
   - Create multiple frames in Figma (e.g., Login, Home, Profile screens).
   - Use the Prototype tab to link frames.
   - Example: Link a "Login" button to the Home screen.
   - Steps:
     \`\`\`
     1. Select the Prototype tab in Figma.
     2. Drag an arrow from a button to the target frame.
     3. Set interaction: "On Click" > "Navigate To".
     4. Add a transition (e.g., Slide Right).
     \`\`\`

2. **Best Practices**:
   - Simulate real interactions: Mimic app navigation.
   - Test early: Share prototypes with users for feedback.
   - Example: Ensure the "Back" button returns to the previous screen.

3. **Tools**:
   - Figma: Prototyping tab, smart animate.
   - Plugins: Autoflow for visualizing flows.

**Practice**:
- Create a prototype in Figma with 3 screens (e.g., Login, Home, Settings).
- Link screens with at least 3 interactions (e.g., button clicks).
- Add transitions (e.g., Slide Left).
- Share the prototype via a Figma link.
- Write a 150-word summary explaining how your prototype demonstrates user flow.

**Resources**:
- Tutorial: "Prototyping in Figma" on Figma’s YouTube channel.
- Plugin: Autoflow on Figma Community.
          `,
          duration: 600, // 10 minutes
          position: lessonPosition++,
          isPreview: false,
        },
        {
          title: "Assignment: Wireframe and Prototype",
          description: "Design a set of wireframes and a functional prototype.",
          type: "ASSIGNMENT",
          content: `
# Assignment: Wireframe and Prototype

**Objective**: Create wireframes and a prototype for a mobile app.

**Requirements**:
- Choose an app idea (e.g., a task management app).
- Design wireframes for 5 screens in Figma (e.g., Login, Task List, Add Task, Profile, Settings).
- Ensure wireframes focus on layout and functionality (grayscale, no styling).
- Create a prototype linking all 5 screens with appropriate interactions (e.g., button clicks, navigation).
- Add at least 2 transitions (e.g., Slide Up, Dissolve).
- Export wireframes as PNGs.
- Share the prototype via a Figma link.
- Write a 300-word report explaining your design choices, user flow, and how the prototype supports usability testing.

**Submission**:
- Submit:
  - Figma link to wireframes and prototype.
  - PNG exports of all 5 wireframes.
  - 300-word report (PDF or text).

**Evaluation Criteria**:
- Clarity and functionality of wireframes.
- Usability of the prototype’s interactions.
- Depth of the report’s analysis.

**Resources**:
- Template: Mobile wireframe kits on Figma Community.
- Guide: "How to Create Wireframes" on Interaction Design Foundation.
          `,
          duration: 2400, // 40 minutes
          position: lessonPosition++,
          isPreview: false,
        },
      ],
    },
    {
      title: "Visual Design and UI Principles",
      description:
        "Apply visual design principles to create aesthetically pleasing and functional user interfaces.",
      position: 4,
      lessons: [
        {
          title: "Introduction to Visual Design",
          description:
            "Learn the principles of visual design and their application in UI.",
          type: "VIDEO",
          videoUrl: "https://www.youtube.com/watch?v=placeholder", // Placeholder
          duration: 600, // 10 minutes
          position: lessonPosition++,
          isPreview: true,
        },
        {
          title: "Typography and Color Theory",
          description: "Use typography and color to enhance UI design.",
          type: "TEXT",
          content: `
# Typography and Color Theory

Typography and color are critical to creating visually appealing and usable interfaces. They guide user attention and convey hierarchy.

1. **Typography**:
   - Choose readable fonts (e.g., Roboto, Inter).
   - Use a typographic scale for consistency (e.g., 16px for body, 24px for headings).
   - Example:
     \`\`\`
     Body: Inter, 16px, Regular
     Heading: Inter, 24px, Bold
     Line Height: 1.5
     \`\`\`
   - Best Practices:
     - Limit to 2–3 fonts.
     - Ensure sufficient contrast (e.g., black text on white background).

2. **Color Theory**:
   - Use a 60-30-10 rule: 60% primary color, 30% secondary, 10% accent.
   - Example:
     \`\`\`
     Primary: #FFFFFF (Background)
     Secondary: #F0F0F0 (Cards)
     Accent: #007BFF (Buttons)
     \`\`\`
   - Ensure accessibility: Check contrast ratios (WCAG 2.1).
   - Tools: Coolors for palettes, Contrast Checker.

**Practice**:
- Design a mobile app screen in Figma (e.g., a dashboard).
- Apply a typographic scale (e.g., 16px body, 20px headings).
- Use a 60-30-10 color scheme.
- Export the screen as a PNG.
- Write a 150-word summary explaining your typography and color choices and their impact on usability.

**Resources**:
- Tool: Coolors for color palettes.
- Guide: "Typography for Designers" on Smashing Magazine.
          `,
          duration: 600, // 10 minutes
          position: lessonPosition++,
          isPreview: true,
        },
        {
          title: "Building Design Systems",
          description: "Create reusable UI components for consistency.",
          type: "TEXT",
          content: `
# Building Design Systems

A design system is a collection of reusable UI components and guidelines that ensure consistency across a product.

1. **Components**:
   - Create buttons, input fields, cards, etc.
   - Example: Design a primary button.
     \`\`\`
     Button:
     - Background: #007BFF
     - Text: White, Inter, 16px
     - Padding: 12px 24px
     - Border Radius: 8px
     \`\`\`

2. **Style Guides**:
   - Define colors, typography, and spacing.
   - Example:
     \`\`\`
     Colors:
     - Primary: #007BFF
     - Secondary: #6C757D
     Typography:
     - Body: Inter, 16px
     - Heading: Inter, 24px
     \`\`\`

3. **Implementation**:
   - Use Figma’s Components feature to create reusable elements.
   - Organize in a style guide frame.

**Practice**:
- Create a mini design system in Figma with:
  - 3 buttons (primary, secondary, disabled).
  - 2 input fields (normal, error state).
  - A color and typography guide.
- Export the design system as a PNG.
- Write a 150-word summary explaining how the design system ensures consistency.

**Resources**:
- Guide: "Design Systems 101" on Nielsen Norman Group.
- Template: Design system templates on Figma Community.
          `,
          duration: 600, // 10 minutes
          position: lessonPosition++,
          isPreview: false,
        },
        {
          title: "Assignment: UI Design",
          description: "Design a visually appealing UI for a mobile app.",
          type: "ASSIGNMENT",
          content: `
# Assignment: UI Design

**Objective**: Create a high-fidelity UI design with a design system.

**Requirements**:
- Choose an app idea (e.g., a music streaming app).
- Create a mini design system in Figma, including:
  - Color palette (primary, secondary, accent).
  - Typography scale (body, headings).
  - 3 reusable components (e.g., button, card, input field).
- Design 3 high-fidelity screens (e.g., Home, Playlist, Search).
- Apply the design system consistently.
- Export screens as PNGs.
- Write a 300-word report explaining your design choices, how the design system was applied, and how the UI supports user goals.

**Submission**:
- Submit:
  - Figma link to design system and screens.
  - PNG exports of all 3 screens.
  - 300-word report (PDF or text).

**Evaluation Criteria**:
- Consistency and clarity of the design system.
- Visual appeal and usability of the screens.
- Depth of the report’s analysis.

**Resources**:
- Template: UI kits on Figma Community.
- Guide: "UI Design Principles" on Interaction Design Foundation.
          `,
          duration: 2400, // 40 minutes
          position: lessonPosition++,
          isPreview: false,
        },
      ],
    },
    {
      title: "Usability Testing and Iteration",
      description:
        "Learn to test designs with users and iterate based on feedback.",
      position: 5,
      lessons: [
        {
          title: "Introduction to Usability Testing",
          description:
            "Understand the importance of usability testing in UI/UX design.",
          type: "VIDEO",
          videoUrl: "https://www.youtube.com/watch?v=placeholder", // Placeholder
          duration: 600, // 10 minutes
          position: lessonPosition++,
          isPreview: true,
        },
        {
          title: "Planning Usability Tests",
          description:
            "Create a plan for conducting effective usability tests.",
          type: "TEXT",
          content: `
# Planning Usability Tests

Usability testing involves observing users as they interact with a prototype to identify usability issues.

1. **Define Objectives**:
   - What do you want to test? (e.g., Navigation, task completion).
   - Example: Test if users can complete a purchase in an e-commerce app.

2. **Create Tasks**:
   - Design specific tasks for users to perform.
   - Example:
     \`\`\`
     Task 1: Find a product and add it to the cart.
     Task 2: Complete the checkout process.
     \`\`\`

3. **Recruit Participants**:
   - Aim for 5–8 users to uncover most issues.
   - Example: Recruit users who frequently shop online.

4. **Prepare Materials**:
   - Prototype, test script, consent forms.
   - Tools: Figma prototype, Zoom for remote testing.

**Practice**:
- Create a usability test plan for a note-taking app.
- Include 3 tasks (e.g., create a note, share it).
- Write a test script with instructions for participants.
- Summarize the plan in 150 words, explaining how it will uncover usability issues.

**Resources**:
- Guide: "Usability Testing 101" on Nielsen Norman Group.
- Tool: Maze for remote usability testing.
          `,
          duration: 600, // 10 minutes
          position: lessonPosition++,
          isPreview: true,
        },
        {
          title: "Iterating Based on Feedback",
          description: "Refine designs using insights from usability testing.",
          type: "TEXT",
          content: `
# Iterating Based on Feedback

Iteration involves updating designs based on usability test findings to improve the user experience.

1. **Analyze Feedback**:
   - Identify common issues and prioritize them.
   - Example: Users struggled to find the "Checkout" button.
   - Tools: Miro for organizing feedback, spreadsheets for tracking issues.

2. **Make Changes**:
   - Update the prototype in Figma.
   - Example:
     \`\`\`
     Issue: Checkout button hard to find.
     Solution: Increase button size and use a brighter color.
     \`\`\`

3. **Retest**:
   - Conduct a follow-up test to validate improvements.
   - Example: Test the updated checkout flow with 3 users.

**Practice**:
- Review mock usability test feedback (e.g., "Navigation is confusing").
- Update a 3-screen Figma prototype to address 2 issues.
- Export the updated screens as PNGs.
- Write a 150-word summary explaining your changes and their expected impact.

**Resources**:
- Guide: "Iterative Design" on Interaction Design Foundation.
- Tool: Figma for prototype updates.
          `,
          duration: 600, // 10 minutes
          position: lessonPosition++,
          isPreview: false,
        },
        {
          title: "Assignment: Usability Testing",
          description: "Conduct usability testing and iterate a prototype.",
          type: "ASSIGNMENT",
          content: `
# Assignment: Usability Testing

**Objective**: Test a prototype and refine it based on user feedback.

**Requirements**:
- Use a 5-screen prototype from a previous assignment (e.g., task management app).
- Create a usability test plan with:
  - 3 tasks (e.g., add a task, edit it, delete it).
  - A test script for participants.
- Conduct mock usability tests with 3 users (friends or colleagues).
- Document findings (e.g., issues, user comments).
- Update the prototype in Figma to address at least 3 issues.
- Export updated screens as PNGs.
- Write a 300-word report summarizing the test process, key findings, and changes made.

**Submission**:
- Submit:
  - Figma link to updated prototype.
  - PNG exports of updated screens.
  - Test plan and findings (PDF or text).
  - 300-word report (PDF or text).

**Evaluation Criteria**:
- Thoroughness of the test plan.
- Relevance of findings.
- Effectiveness of prototype updates.
- Clarity of the report.

**Resources**:
- Template: Usability test templates on Maze.
- Guide: "How to Conduct Usability Testing" on usability.gov.
          `,
          duration: 2400, // 40 minutes
          position: lessonPosition++,
          isPreview: false,
        },
      ],
    },
    {
      title: "Interaction Design and Microinteractions",
      description:
        "Design engaging interactions and microinteractions to enhance user experience.",
      position: 6,
      lessons: [
        {
          title: "Introduction to Interaction Design",
          description:
            "Learn the principles of interaction design and its role in UX.",
          type: "VIDEO",
          videoUrl: "https://www.youtube.com/watch?v=placeholder", // Placeholder
          duration: 600, // 10 minutes
          position: lessonPosition++,
          isPreview: true,
        },
        {
          title: "Designing Microinteractions",
          description:
            "Create microinteractions to add delight to your designs.",
          type: "TEXT",
          content: `
# Designing Microinteractions

Microinteractions are small, single-purpose interactions that enhance user experience (e.g., a button animation).

1. **Structure**:
   - Trigger: What starts the interaction? (e.g., clicking a button).
   - Rule: What happens? (e.g., button scales up).
   - Feedback: What does the user see? (e.g., color change).
   - Example:
     \`\`\`
     Trigger: Click "Like" button
     Rule: Button scales 1.2x and turns red
     Feedback: Heart icon fills
     \`\`\`

2. **Implementation in Figma**:
   - Use Smart Animate for smooth transitions.
   - Steps:
     \`\`\`
     1. Create two frames: Button (normal) and Button (clicked).
     2. Change size/color in the second frame.
     3. Link frames with Smart Animate in Prototype tab.
     \`\`\`

**Practice**:
- Design a microinteraction in Figma (e.g., a toggle switch).
- Include a trigger, rule, and feedback.
- Share the prototype via a Figma link.
- Write a 150-word summary explaining how the microinteraction improves UX.

**Resources**:
- Book: "Microinteractions" by Dan Saffer.
- Tutorial: "Smart Animate in Figma" on YouTube.
          `,
          duration: 600, // 10 minutes
          position: lessonPosition++,
          isPreview: true,
        },
        {
          title: "Assignment: Microinteraction Prototype",
          description: "Design a prototype with microinteractions.",
          type: "ASSIGNMENT",
          content: `
# Assignment: Microinteraction Prototype

**Objective**: Create a prototype with engaging microinteractions.

**Requirements**:
- Choose an app feature (e.g., a shopping cart).
- Design 3 screens in Figma, including 2 microinteractions (e.g., add to cart, remove item).
- Use Smart Animate for transitions.
- Ensure microinteractions have a clear trigger, rule, and feedback.
- Share the prototype via a Figma link.
- Export screens as PNGs.
- Write a 300-word report explaining the microinteractions, their purpose, and their impact on UX.

**Submission**:
- Submit:
  - Figma link to prototype.
  - PNG exports of screens.
  - 300-word report (PDF or text).

**Evaluation Criteria**:
- Creativity and clarity of microinteractions.
- Smoothness of animations.
- Depth of the report’s analysis.

**Resources**:
- Tutorial: Figma’s Smart Animate guide.
- Guide: "Microinteractions in UX" on UX Planet.
          `,
          duration: 2400, // 40 minutes
          position: lessonPosition++,
          isPreview: false,
        },
      ],
    },
    {
      title: "Accessibility in UI/UX Design",
      description:
        "Learn to design inclusive interfaces that are accessible to all users.",
      position: 7,
      lessons: [
        {
          title: "Introduction to Accessibility",
          description:
            "Understand the importance of accessibility in UI/UX design.",
          type: "VIDEO",
          videoUrl: "https://www.youtube.com/watch?v=placeholder", // Placeholder
          duration: 600, // 10 minutes
          position: lessonPosition++,
          isPreview: true,
        },
        {
          title: "Applying WCAG Guidelines",
          description:
            "Implement Web Content Accessibility Guidelines (WCAG) in your designs.",
          type: "TEXT",
          content: `
# Applying WCAG Guidelines

The Web Content Accessibility Guidelines (WCAG) ensure digital products are accessible to people with disabilities.

1. **Perceivable**:
   - Provide text alternatives for non-text content.
   - Example: Add alt text to images in Figma.
   - Ensure sufficient contrast.
     \`\`\`
     Example:
     Text: #000000
     Background: #FFFFFF
     Contrast Ratio: 21:1 (WCAG compliant)
     \`\`\`

2. **Operable**:
   - Ensure all functionality is keyboard-accessible.
   - Example: Test prototype navigation using Tab key.

3. **Understandable**:
   - Use clear language and consistent navigation.
   - Example: Label buttons clearly (e.g., "Submit" instead of "Go").

4. **Robust**:
   - Ensure compatibility with assistive technologies.
   - Example: Use semantic HTML in prototypes (if exporting).

**Practice**:
- Design a screen in Figma (e.g., a form).
- Apply WCAG guidelines (e.g., contrast, clear labels).
- Check contrast using a tool like Stark.
- Export as a PNG.
- Write a 150-word summary explaining your accessibility choices.

**Resources**:
- Guide: WCAG 2.1 on w3.org.
- Tool: Stark plugin for Figma.
          `,
          duration: 600, // 10 minutes
          position: lessonPosition++,
          isPreview: true,
        },
        {
          title: "Assignment: Accessible Design",
          description: "Design an accessible UI screen.",
          type: "ASSIGNMENT",
          content: `
# Assignment: Accessible Design

**Objective**: Create an accessible UI design.

**Requirements**:
- Design a 2-screen UI in Figma (e.g., Login, Dashboard).
- Apply WCAG guidelines:
  - Ensure contrast ratios meet WCAG 2.1 (use Stark plugin).
  - Add alt text to images.
  - Use clear, descriptive labels.
- Test keyboard navigation in the prototype.
- Export screens as PNGs.
- Write a 300-word report explaining how your design meets accessibility standards and benefits users.

**Submission**:
- Submit:
  - Figma link to screens.
  - PNG exports.
  - 300-word report (PDF or text).

**Evaluation Criteria**:
- Adherence to WCAG guidelines.
- Usability for diverse users.
- Clarity of the report.

**Resources**:
- Guide: "Accessibility in UX" on Interaction Design Foundation.
- Tool: Stark for contrast checking.
          `,
          duration: 2400, // 40 minutes
          position: lessonPosition++,
          isPreview: false,
        },
      ],
    },
    {
      title: "Collaboration and Handoff",
      description:
        "Learn to collaborate with developers and prepare designs for handoff.",
      position: 8,
      lessons: [
        {
          title: "Introduction to Design Handoff",
          description:
            "Understand the process of handing off designs to developers.",
          type: "VIDEO",
          videoUrl: "https://www.youtube.com/watch?v=placeholder", // Placeholder
          duration: 600, // 10 minutes
          position: lessonPosition++,
          isPreview: true,
        },
        {
          title: "Preparing Designs for Handoff",
          description: "Organize and document designs for developers.",
          type: "TEXT",
          content: `
# Preparing Designs for Handoff

Design handoff involves sharing assets, specifications, and documentation with developers to ensure accurate implementation.

1. **Organize Layers**:
   - Name layers clearly in Figma (e.g., "Primary_Button").
   - Group related elements (e.g., "Header" group).
   - Example:
     \`\`\`
     Layer Structure:
     - Home_Screen
       - Header
         - Logo
         - Menu_Button
       - Content
         - Card_1
         - Card_2
     \`\`\`

2. **Provide Specifications**:
   - Share colors, typography, and spacing.
   - Use Figma’s Inspect panel for CSS properties.
   - Example:
     \`\`\`
     Button:
     - Color: #007BFF
     - Font: Inter, 16px
     - Padding: 12px 24px
     \`\`\`

3. **Export Assets**:
   - Export icons and images as PNG/SVG.
   - Use Figma’s Export feature.

**Practice**:
- Organize a 2-screen Figma project with clear layer names.
- Create a style guide with colors and typography.
- Export 2 assets (e.g., an icon, a button).
- Write a 150-word summary explaining your handoff preparation process.

**Resources**:
- Guide: "Design Handoff Best Practices" on Zeplin.
- Tool: Figma Inspect panel.
          `,
          duration: 600, // 10 minutes
          position: lessonPosition++,
          isPreview: true,
        },
        {
          title: "Assignment: Design Handoff",
          description: "Prepare a design for developer handoff.",
          type: "ASSIGNMENT",
          content: `
# Assignment: Design Handoff

**Objective**: Prepare a UI design for developer handoff.

**Requirements**:
- Use a 3-screen UI from a previous assignment.
- Organize layers in Figma with clear names and groups.
- Create a style guide with:
  - Color palette.
  - Typography scale.
  - 2 reusable components.
- Export 3 assets (e.g., icons, buttons) as PNG/SVG.
- Share the Figma project with Inspect mode enabled.
- Write a 300-word report explaining your handoff process and how it ensures accurate implementation.

**Submission**:
- Submit:
  - Figma link with Inspect mode.
  - Exported assets (PNG/SVG).
  - Style guide (PNG or Figma frame).
  - 300-word report (PDF or text).

**Evaluation Criteria**:
- Organization of Figma project.
- Clarity of style guide.
- Quality of exported assets.
- Depth of the report.

**Resources**:
- Guide: "Figma for Developers" on Figma’s blog.
- Tool: Zeplin for handoff (optional).
          `,
          duration: 2400, // 40 minutes
          position: lessonPosition++,
          isPreview: false,
        },
      ],
    },
    {
      title: "Advanced UI/UX Topics",
      description:
        "Explore advanced topics like design thinking and motion design.",
      position: 9,
      lessons: [
        {
          title: "Introduction to Design Thinking",
          description:
            "Learn the design thinking framework for problem-solving.",
          type: "VIDEO",
          videoUrl: "https://www.youtube.com/watch?v=placeholder", // Placeholder
          duration: 600, // 10 minutes
          position: lessonPosition++,
          isPreview: true,
        },
        {
          title: "Applying Design Thinking",
          description: "Use design thinking to address a design challenge.",
          type: "TEXT",
          content: `
# Applying Design Thinking

Design thinking is a human-centered approach to innovation, with five stages: Empathize, Define, Ideate, Prototype, and Test.

1. **Empathize**:
   - Understand user needs through research.
   - Example: Interview users about a banking app.

2. **Define**:
   - Articulate the problem.
   - Example: "Users need a simpler way to transfer money."

3. **Ideate**:
   - Brainstorm solutions.
   - Example: Sketch 10 ideas for a transfer feature.

4. **Prototype**:
   - Create low-fidelity prototypes.
   - Example: Wireframe a transfer screen in Figma.

5. **Test**:
   - Test prototypes with users.
   - Example: Conduct usability tests.

**Practice**:
- Choose a problem (e.g., improving a library app).
- Conduct a mock empathy interview.
- Define the problem and ideate 5 solutions.
- Create a 1-screen wireframe in Figma.
- Write a 150-word summary of the process.

**Resources**:
- Guide: "Design Thinking" on IDEO.org.
- Tool: Miro for ideation.
          `,
          duration: 600, // 10 minutes
          position: lessonPosition++,
          isPreview: true,
        },
        {
          title: "Assignment: Design Thinking Challenge",
          description: "Apply design thinking to a real-world problem.",
          type: "ASSIGNMENT",
          content: `
# Assignment: Design Thinking Challenge

**Objective**: Solve a design problem using design thinking.

**Requirements**:
- Choose a problem (e.g., improving a public transit app).
- Conduct a mock empathy interview with 2 users.
- Define the problem statement.
- Ideate 10 solutions and select 2 for prototyping.
- Create a 2-screen prototype in Figma.
- Test the prototype with 2 users and document feedback.
- Write a 300-word report summarizing the process and outcomes.

**Submission**:
- Submit:
  - Figma link to prototype.
  - Interview notes and problem statement (PDF or text).
  - Ideation sketches (PNG or photo).
  - 300-word report (PDF or text).

**Evaluation Criteria**:
- Depth of empathy research.
- Clarity of problem statement.
- Creativity of solutions.
- Quality of prototype and report.

**Resources**:
- Guide: "Design Thinking 101" on Nielsen Norman Group.
- Template: Design thinking templates on Miro.
          `,
          duration: 2400, // 40 minutes
          position: lessonPosition++,
          isPreview: false,
        },
      ],
    },
    {
      title: "Capstone: UI/UX Portfolio Project",
      description:
        "Create a professional UI/UX portfolio piece to showcase your skills.",
      position: 10,
      lessons: [
        {
          title: "Planning a UI/UX Project",
          description: "Plan a comprehensive UI/UX project for your portfolio.",
          type: "VIDEO",
          videoUrl: "https://www.youtube.com/watch?v=placeholder", // Placeholder
          duration: 600, // 10 minutes
          position: lessonPosition++,
          isPreview: true,
        },
        {
          title: "User Research and Wireframing",
          description:
            "Conduct research and create wireframes for your project.",
          type: "TEXT",
          content: `
# User Research and Wireframing

This lesson guides you through the initial stages of your capstone project.

1. **User Research**:
   - Conduct interviews or surveys to understand user needs.
   - Create 2–3 user personas.
   - Example:
     \`\`\`
     Persona: Emma, 25, Student
     Goals: Track study progress
     Frustrations: Cluttered apps
     \`\`\`
   - Create a user journey map.

2. **Wireframing**:
   - Sketch low-fidelity wireframes for 5–7 screens.
   - Example: For a study app, include Dashboard, Task List, Add Task, Profile.
   - Use Figma for wireframes.
   - Steps:
     \`\`\`
     1. Create frames (e.g., iPhone 13).
     2. Add placeholders for buttons, text, and images.
     3. Focus on layout and hierarchy.
     \`\`\`

**Practice**:
- Conduct a mock interview for a chosen app idea.
- Create 2 personas and a user journey map.
- Design wireframes for 3 screens in Figma.
- Write a 150-word summary of your research and wireframing process.

**Resources**:
- Template: Persona and journey map templates on Figma Community.
- Guide: "UX Research for Beginners" on UX Design Institute.
          `,
          duration: 600, // 10 minutes
          position: lessonPosition++,
          isPreview: true,
        },
        {
          title: "Prototyping and UI Design",
          description:
            "Build a prototype and high-fidelity UI for your project.",
          type: "TEXT",
          content: `
# Prototyping and UI Design

This lesson focuses on turning wireframes into a functional prototype and polished UI.

1. **Prototyping**:
   - Link wireframes in Figma to create a clickable prototype.
   - Example: Link a "Add Task" button to a task creation screen.
   - Use Smart Animate for transitions.
   - Steps:
     \`\`\`
     1. Open Prototype tab in Figma.
     2. Connect frames with interactions (e.g., On Click > Navigate).
     3. Add transitions (e.g., Slide Up).
     \`\`\`

2. **UI Design**:
   - Create a design system with colors, typography, and components.
   - Apply to 5–7 screens.
   - Example:
     \`\`\`
     Design System:
     - Colors: #007BFF (Primary), #FFFFFF (Background)
     - Typography: Inter, 16px (Body)
     - Components: Button, Card
     \`\`\`

**Practice**:
- Create a prototype for 5 screens in Figma.
- Design high-fidelity UI with a design system.
- Export screens as PNGs.
- Write a 150-word summary of your prototyping and UI design process.

**Resources**:
- Tutorial: "Figma Prototyping Basics" on YouTube.
- Template: UI kits on Figma Community.
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

**Objective**: Create a comprehensive UI/UX project for your portfolio.

**Requirements**:
- Choose a project idea (e.g., a fitness app, e-commerce platform).
- Conduct user research:
  - 3 mock interviews.
  - 2 personas.
  - 1 user journey map.
- Design wireframes for 5–7 screens in Figma.
- Create a clickable prototype with interactions and transitions.
- Design high-fidelity UI with a design system (colors, typography, components).
- Conduct usability testing with 3 users and iterate the prototype.
- Prepare the project for handoff (organized layers, style guide, exported assets).
- Develop a 5–7 slide presentation covering:
  - Project overview.
  - Research findings.
  - Design process.
  - Final design.
  - Testing results.
- Write a 400-word reflection on your process, challenges, and learnings.

**Submission**:
- Submit:
  - Figma link to wireframes, prototype, and UI.
  - PNG exports of screens and assets.
  - Research documents (personas, journey map).
  - Presentation (PDF or Figma).
  - 400-word reflection (PDF or text).

**Evaluation Criteria**:
- Depth of research.
- Usability of prototype.
- Visual quality of UI.
- Thoroughness of testing and iteration.
- Clarity of presentation and reflection.

**Resources**:
- Template: Portfolio presentation templates on Canva.
- Guide: "How to Create a UX Portfolio" on CareerFoundry.
          `,
          duration: 10800, // 180 minutes (3 hours)
          position: lessonPosition++,
          isPreview: false,
        },
        {
          title: "Quiz: UI/UX Portfolio",
          description:
            "Test your knowledge of creating a UI/UX portfolio project.",
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

2. **Why include a design system in your project?**
   - A) To write code
   - B) To ensure consistency
   - C) To simplify research
   - D) To speed up testing
   - **Answer**: B

3. **What should a portfolio presentation include?**
   - A) Code snippets
   - B) Research, process, and final design
   - C) Database schemas
   - D) Marketing plans
   - **Answer**: B

4. **Why conduct usability testing?**
   - **Answer**: To identify usability issues and improve the design.
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
