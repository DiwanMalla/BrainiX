import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Starting seed process for Agile Project Management...");

  // Fetch the Agile Project Management course
  const course = await prisma.course.findUnique({
    where: { slug: "agile-project-management" },
  });

  if (!course) {
    console.error("Course with slug 'agile-project-management' not found.");
    throw new Error("Course not found");
  }

  console.log(`Found course: ${course.title}`);

  let lessonPosition = 1; // Track lesson position across modules
  const modulesData = [
    {
      title: "Introduction to Agile",
      description:
        "Learn the fundamentals of Agile methodology and its benefits.",
      position: 1,
      lessons: [
        {
          title: "What is Agile?",
          description: "Understand Agile principles and the Agile Manifesto.",
          type: "VIDEO",
          videoUrl: "https://www.youtube.com/watch?v=Z9QbYZh1Y6A", // Agile Introduction
          duration: 420, // 7 minutes
          position: lessonPosition++,
          isPreview: true,
        },
        {
          title: "Agile vs. Waterfall",
          description:
            "Compare Agile with traditional project management methods.",
          type: "TEXT",
          content: `
# Agile vs. Waterfall

**Agile**:
- Iterative, flexible approach.
- Delivers small, incremental improvements.
- Example: A software team releases features every 2 weeks.

**Waterfall**:
- Linear, sequential process.
- Completes each phase before moving to the next.
- Example: A construction project with fixed milestones.

**Key Differences**:
- **Flexibility**: Agile adapts to changes; Waterfall follows a fixed plan.
- **Delivery**: Agile delivers frequently; Waterfall delivers at the end.

**Practice**:
- List 2 scenarios where Agile is better suited than Waterfall.
- Discuss with a peer why Agile suits dynamic environments.
          `,
          duration: 600, // 10 minutes
          position: lessonPosition++,
          isPreview: true,
        },
        {
          title: "The Agile Manifesto",
          description: "Explore the 4 values and 12 principles of Agile.",
          type: "TEXT",
          content: `
# The Agile Manifesto

**4 Values**:
1. Individuals and interactions over processes and tools.
2. Working software over comprehensive documentation.
3. Customer collaboration over contract negotiation.
4. Responding to change over following a plan.

**12 Principles** (Examples):
- Deliver working software frequently.
- Welcome changing requirements, even late in development.

**Practice**:
- Choose 2 Agile principles and explain how they apply to a project.
- Create a 100-word summary of why the Agile Manifesto matters.
          `,
          duration: 600, // 10 minutes
          position: lessonPosition++,
          isPreview: true,
        },
        {
          title: "Quiz: Agile Basics",
          description: "Test your understanding of Agile fundamentals.",
          type: "QUIZ",
          content: `
# Quiz: Agile Basics

**Instructions**: Answer the following questions.

1. **What is a core value of the Agile Manifesto?**
   - A) Comprehensive documentation over working software
   - B) Customer collaboration over contract negotiation
   - C) Following a fixed plan over change
   - D) Processes over people
   - **Answer**: B

2. **How does Agile differ from Waterfall?**
   - A) Agile is linear; Waterfall is iterative
   - B) Agile delivers frequently; Waterfall delivers at the end
   - C) Agile avoids customer feedback
   - D) Agile requires no planning
   - **Answer**: B

3. **Name one Agile principle.**
   - **Answer**: Deliver working software frequently.
          `,
          duration: 300, // 5 minutes
          position: lessonPosition++,
          isPreview: false,
        },
      ],
    },
    {
      title: "Scrum Framework",
      description: "Master the Scrum framework for Agile project management.",
      position: 2,
      lessons: [
        {
          title: "Introduction to Scrum",
          description: "Learn Scrum roles, events, and artifacts.",
          type: "VIDEO",
          videoUrl: "https://www.youtube.com/watch?v=9TycLR0TqFA", // Scrum Basics
          duration: 600, // 10 minutes
          position: lessonPosition++,
          isPreview: true,
        },
        {
          title: "Scrum Roles",
          description: "Understand the Product Owner, Scrum Master, and Team.",
          type: "TEXT",
          content: `
# Scrum Roles

1. **Product Owner**:
   - Defines product vision and prioritizes backlog.
   - Example: Decides which features to build next.

2. **Scrum Master**:
   - Facilitates Scrum events and removes impediments.
   - Example: Coaches the team on Agile practices.

3. **Development Team**:
   - Delivers increments of work in sprints.
   - Example: Builds and tests features.

**Practice**:
- Write a 150-word description of a Scrum Master’s responsibilities.
- Identify a real-world example of a Product Owner’s decision.
          `,
          duration: 600, // 10 minutes
          position: lessonPosition++,
          isPreview: true,
        },
        {
          title: "Scrum Events",
          description:
            "Explore Sprint Planning, Daily Scrum, and Retrospectives.",
          type: "TEXT",
          content: `
# Scrum Events

1. **Sprint Planning**:
   - Defines sprint goals and tasks.
   - Example: Team plans a 2-week sprint to build a login feature.

2. **Daily Scrum**:
   - 15-minute stand-up to sync progress.
   - Example: Team discusses blockers each morning.

3. **Sprint Review**:
   - Showcases completed work to stakeholders.
   - Example: Demo a new feature to clients.

4. **Retrospective**:
   - Reflects on what went well and what to improve.
   - Example: Team brainstorms better communication strategies.

**Practice**:
- Simulate a Daily Scrum with a peer.
- Create a checklist for a successful Sprint Review.
          `,
          duration: 600, // 10 minutes
          position: lessonPosition++,
          isPreview: false,
        },
        {
          title: "Assignment: Scrum Simulation",
          description: "Plan and simulate a Scrum sprint.",
          type: "ASSIGNMENT",
          content: `
# Assignment: Scrum Simulation

**Objective**: Simulate a Scrum sprint for a hypothetical project.

**Requirements**:
- Define a product (e.g., a mobile app).
- Create a product backlog with 5–7 items.
- Plan a 2-week sprint with 3–4 tasks.
- Write a 200-word reflection on the roles and events.

**Submission**:
- Submit your backlog, sprint plan, and reflection.
- Include a diagram of your Scrum process.
          `,
          duration: 1800, // 30 minutes
          position: lessonPosition++,
          isPreview: false,
        },
      ],
    },
    {
      title: "Kanban Methodology",
      description:
        "Learn Kanban for continuous delivery and workflow optimization.",
      position: 3,
      lessons: [
        {
          title: "Introduction to Kanban",
          description: "Understand Kanban principles and boards.",
          type: "VIDEO",
          videoUrl: "https://www.youtube.com/watch?v=iVaFVa7HYjI", // Kanban Intro
          duration: 600, // 10 minutes
          position: lessonPosition++,
          isPreview: true,
        },
        {
          title: "Kanban Boards",
          description: "Design and manage a Kanban board.",
          type: "TEXT",
          content: `
# Kanban Boards

A Kanban board visualizes workflow:

1. **Columns**:
   - Example: To Do, In Progress, Done.
   - Tracks task status.

2. **Work-in-Progress (WIP) Limits**:
   - Restricts tasks in a column to avoid overload.
   - Example: Limit "In Progress" to 3 tasks.

3. **Flow**:
   - Measures cycle time to optimize delivery.
   - Example: Track how long a task takes from start to finish.

**Practice**:
- Create a Kanban board using Trello or Jira.
- Add 5 tasks and set a WIP limit of 2 for "In Progress."
          `,
          duration: 600, // 10 minutes
          position: lessonPosition++,
          isPreview: true,
        },
        {
          title: "Kanban Metrics",
          description: "Use cycle time and throughput to improve flow.",
          type: "TEXT",
          content: `
# Kanban Metrics

1. **Cycle Time**:
   - Time from task start to completion.
   - Example: A task takes 3 days from "In Progress" to "Done."

2. **Throughput**:
   - Number of tasks completed in a period.
   - Example: Team completes 10 tasks per week.

3. **Lead Time**:
   - Total time from task creation to completion.
   - Example: Includes time in "To Do" queue.

**Practice**:
- Track cycle time for 3 tasks on your Kanban board.
- Calculate weekly throughput for a sample project.
          `,
          duration: 600, // 10 minutes
          position: lessonPosition++,
          isPreview: false,
        },
        {
          title: "Assignment: Kanban Workflow",
          description: "Optimize a workflow using Kanban.",
          type: "ASSIGNMENT",
          content: `
# Assignment: Kanban Workflow

**Objective**: Design and optimize a Kanban workflow.

**Requirements**:
- Create a Kanban board for a team project (e.g., content creation).
- Set WIP limits and track 5 tasks.
- Measure cycle time and throughput.
- Write a 200-word analysis of workflow improvements.

**Submission**:
- Submit your board screenshot, metrics, and analysis.
          `,
          duration: 1800, // 30 minutes
          position: lessonPosition++,
          isPreview: false,
        },
      ],
    },
    {
      title: "User Stories and Backlog Management",
      description: "Write effective user stories and manage product backlogs.",
      position: 4,
      lessons: [
        {
          title: "Writing User Stories",
          description: "Learn the structure and purpose of user stories.",
          type: "VIDEO",
          videoUrl: "https://www.youtube.com/watch?v=6q5-cVaF1C4", // User Stories Intro
          duration: 600, // 10 minutes
          position: lessonPosition++,
          isPreview: true,
        },
        {
          title: "User Story Format",
          description: "Use the 'As a, I want, so that' format.",
          type: "TEXT",
          content: `
# User Story Format

**Structure**:
- **As a** [user], **I want** [functionality], **so that** [benefit].
- Example: As a customer, I want to reset my password, so that I can regain access.

**INVEST Criteria**:
- **Independent**: Stories stand alone.
- **Valuable**: Delivers user value.
- **Testable**: Has clear acceptance criteria.

**Practice**:
- Write 3 user stories for an e-commerce app.
- Ensure each meets 2 INVEST criteria.
          `,
          duration: 600, // 10 minutes
          position: lessonPosition++,
          isPreview: true,
        },
        {
          title: "Backlog Prioritization",
          description:
            "Prioritize backlog items using MoSCoW or value vs. effort.",
          type: "TEXT",
          content: `
# Backlog Prioritization

1. **MoSCoW Method**:
   - Must have, Should have, Could have, Won’t have.
   - Example: "Must have" login; "Could have" dark mode.

2. **Value vs. Effort**:
   - Plot stories on a 2x2 grid (high/low value, high/low effort).
   - Prioritize high-value, low-effort stories.

**Practice**:
- Create a backlog with 6 items for a project.
- Prioritize using MoSCoW or value vs. effort.
          `,
          duration: 600, // 10 minutes
          position: lessonPosition++,
          isPreview: false,
        },
        {
          title: "Assignment: Product Backlog",
          description: "Build and prioritize a product backlog.",
          type: "ASSIGNMENT",
          content: `
# Assignment: Product Backlog

**Objective**: Create a prioritized product backlog.

**Requirements**:
- Write 8 user stories for a project (e.g., a fitness app).
- Prioritize using MoSCoW or value vs. effort.
- Define acceptance criteria for 3 stories.
- Write a 200-word explanation of your prioritization.

**Submission**:
- Submit your backlog and explanation.
          `,
          duration: 1800, // 30 minutes
          position: lessonPosition++,
          isPreview: false,
        },
      ],
    },
    {
      title: "Agile Estimation and Planning",
      description: "Estimate tasks and plan sprints effectively.",
      position: 5,
      lessons: [
        {
          title: "Introduction to Agile Estimation",
          description: "Learn story points and estimation techniques.",
          type: "VIDEO",
          videoUrl: "https://www.youtube.com/watch?v=0F6S8LMfUts", // Agile Estimation
          duration: 600, // 10 minutes
          position: lessonPosition++,
          isPreview: true,
        },
        {
          title: "Story Points and Planning Poker",
          description: "Use story points and Planning Poker for estimation.",
          type: "TEXT",
          content: `
# Story Points and Planning Poker

1. **Story Points**:
   - Measure complexity, not time.
   - Use Fibonacci scale (1, 2, 3, 5, 8, etc.).
   - Example: A login feature is 3 points; a payment system is 8.

2. **Planning Poker**:
   - Team estimates stories collaboratively.
   - Each member picks a point value, discusses, and agrees.

**Practice**:
- Estimate 5 user stories using story points.
- Simulate Planning Poker with a peer or group.
          `,
          duration: 600, // 10 minutes
          position: lessonPosition++,
          isPreview: true,
        },
        {
          title: "Sprint Planning",
          description: "Plan a sprint with capacity and velocity.",
          type: "TEXT",
          content: `
# Sprint Planning

1. **Capacity**:
   - Team’s available hours or story points.
   - Example: 5 members, 20 points/week.

2. **Velocity**:
   - Average story points completed per sprint.
   - Example: Team averages 25 points/sprint.

**Steps**:
- Select backlog items based on velocity.
- Break into tasks and assign owners.

**Practice**:
- Plan a sprint for a 10-point capacity team.
- Select and break down 3–4 user stories.
          `,
          duration: 600, // 10 minutes
          position: lessonPosition++,
          isPreview: false,
        },
        {
          title: "Assignment: Sprint Plan",
          description: "Create a sprint plan with estimates.",
          type: "ASSIGNMENT",
          content: `
# Assignment: Sprint Plan

**Objective**: Develop a sprint plan for a project.

**Requirements**:
- Create a backlog with 10 user stories.
- Estimate stories using story points.
- Plan a 2-week sprint for a 20-point capacity team.
- Write a 200-word summary of your planning process.

**Submission**:
- Submit your backlog, sprint plan, and summary.
          `,
          duration: 1800, // 30 minutes
          position: lessonPosition++,
          isPreview: false,
        },
      ],
    },
    {
      title: "Agile Leadership and Teams",
      description: "Build and lead high-performing Agile teams.",
      position: 6,
      lessons: [
        {
          title: "Agile Leadership",
          description: "Learn servant leadership and team empowerment.",
          type: "VIDEO",
          videoUrl: "https://www.youtube.com/watch?v=DDIYtw1J0gY", // Agile Leadership
          duration: 600, // 10 minutes
          position: lessonPosition++,
          isPreview: true,
        },
        {
          title: "Servant Leadership",
          description: "Understand the role of a servant leader.",
          type: "TEXT",
          content: `
# Servant Leadership

**Principles**:
- Prioritize team needs over personal goals.
- Empower team members to make decisions.
- Example: A Scrum Master removes blockers to help the team focus.

**Behaviors**:
- Active listening, empathy, and coaching.
- Example: Hold 1:1s to understand team challenges.

**Practice**:
- Write a 150-word description of a servant leader’s role.
- Practice active listening in a team discussion.
          `,
          duration: 600, // 10 minutes
          position: lessonPosition++,
          isPreview: true,
        },
        {
          title: "Building Agile Teams",
          description: "Foster collaboration and psychological safety.",
          type: "TEXT",
          content: `
# Building Agile Teams

1. **Collaboration**:
   - Encourage cross-functional teamwork.
   - Example: Pair developers and designers on tasks.

2. **Psychological Safety**:
   - Create a safe space for ideas and mistakes.
   - Example: Celebrate learning from failures in retrospectives.

**Practice**:
- Design a team-building activity for an Agile team.
- Write a 100-word plan to improve psychological safety.
          `,
          duration: 600, // 10 minutes
          position: lessonPosition++,
          isPreview: false,
        },
        {
          title: "Assignment: Team Dynamics",
          description: "Analyze and improve team dynamics.",
          type: "ASSIGNMENT",
          content: `
# Assignment: Team Dynamics

**Objective**: Enhance Agile team performance.

**Requirements**:
- Analyze a hypothetical team’s challenges (e.g., low trust).
- Propose 3 strategies to improve collaboration and safety.
- Write a 200-word report on your approach.
- Include a team-building activity plan.

**Submission**:
- Submit your report and activity plan.
          `,
          duration: 1800, // 30 minutes
          position: lessonPosition++,
          isPreview: false,
        },
      ],
    },
    {
      title: "Agile Tools and Technologies",
      description: "Use tools like Jira, Trello, and Azure DevOps for Agile.",
      position: 7,
      lessons: [
        {
          title: "Overview of Agile Tools",
          description: "Explore popular Agile project management tools.",
          type: "VIDEO",
          videoUrl: "https://www.youtube.com/watch?v=1xS51XgQgeo", // Agile Tools
          duration: 600, // 10 minutes
          position: lessonPosition++,
          isPreview: true,
        },
        {
          title: "Using Jira for Agile",
          description: "Set up boards and track progress in Jira.",
          type: "TEXT",
          content: `
# Using Jira for Agile

1. **Boards**:
   - Create Scrum or Kanban boards.
   - Example: Add epics, stories, and tasks.

2. **Workflows**:
   - Customize statuses (e.g., To Do, In Progress, Done).
   - Example: Add a "Testing" status for QA.

3. **Reports**:
   - Use burndown charts and velocity reports.
   - Example: Track sprint progress.

**Practice**:
- Set up a Jira board for a sample project.
- Create 5 stories and track their status.
          `,
          duration: 600, // 10 minutes
          position: lessonPosition++,
          isPreview: true,
        },
        {
          title: "Trello and Other Tools",
          description: "Manage projects with Trello and Azure DevOps.",
          type: "TEXT",
          content: `
# Trello and Other Tools

1. **Trello**:
   - Use lists and cards for Kanban.
   - Example: Create a board with "Backlog," "Doing," "Done."

2. **Azure DevOps**:
   - Supports Agile planning with backlogs and sprints.
   - Example: Track work items and generate reports.

**Practice**:
- Create a Trello board with 5 cards.
- Explore Azure DevOps and set up a sprint.
          `,
          duration: 600, // 10 minutes
          position: lessonPosition++,
          isPreview: false,
        },
        {
          title: "Assignment: Tool Implementation",
          description: "Implement Agile processes in a tool.",
          type: "ASSIGNMENT",
          content: `
# Assignment: Tool Implementation

**Objective**: Set up an Agile project in a tool.

**Requirements**:
- Choose Jira, Trello, or Azure DevOps.
- Create a board with a backlog and 5–7 tasks.
- Track progress and generate a report (e.g., burndown chart).
- Write a 200-word summary of your setup.

**Submission**:
- Submit screenshots of your board/report and summary.
          `,
          duration: 1800, // 30 minutes
          position: lessonPosition++,
          isPreview: false,
        },
      ],
    },
    {
      title: "Scaling Agile",
      description: "Apply Agile at scale with SAFe and other frameworks.",
      position: 8,
      lessons: [
        {
          title: "Introduction to Scaled Agile",
          description: "Understand scaling Agile for large organizations.",
          type: "VIDEO",
          videoUrl: "https://www.youtube.com/watch?v=1l6Ud0T_FwQ", // SAFe Intro
          duration: 600, // 10 minutes
          position: lessonPosition++,
          isPreview: true,
        },
        {
          title: "Scaled Agile Framework (SAFe)",
          description: "Learn SAFe principles and practices.",
          type: "TEXT",
          content: `
# Scaled Agile Framework (SAFe)

1. **Principles**:
   - Align teams to a shared mission.
   - Example: Use Program Increments (PIs) for planning.

2. **Roles**:
   - Release Train Engineer, Product Management, etc.
   - Example: RTE facilitates PI planning.

3. **Events**:
   - PI Planning, System Demos.
   - Example: Teams align on objectives every 10 weeks.

**Practice**:
- Create a 150-word summary of SAFe’s benefits.
- Diagram a SAFe team structure.
          `,
          duration: 600, // 10 minutes
          position: lessonPosition++,
          isPreview: true,
        },
        {
          title: "Other Scaling Frameworks",
          description: "Explore LeSS and Nexus for scaling Agile.",
          type: "TEXT",
          content: `
# Other Scaling Frameworks

1. **LeSS (Large-Scale Scrum)**:
   - Scales Scrum for multiple teams.
   - Example: One Product Backlog for all teams.

2. **Nexus**:
   - Focuses on integrating 3–9 Scrum teams.
   - Example: Uses a Nexus Sprint Planning event.

**Practice**:
- Compare LeSS and Nexus in a 100-word summary.
- Identify a scenario where LeSS is more suitable.
          `,
          duration: 600, // 10 minutes
          position: lessonPosition++,
          isPreview: false,
        },
        {
          title: "Assignment: Scaled Agile Plan",
          description: "Design a scaled Agile process.",
          type: "ASSIGNMENT",
          content: `
# Assignment: Scaled Agile Plan

**Objective**: Plan Agile for a large organization.

**Requirements**:
- Choose SAFe, LeSS, or Nexus.
- Outline a process for 3–5 teams working on a product.
- Include roles, events, and artifacts.
- Write a 200-word explanation of your plan.

**Submission**:
- Submit your process outline and explanation.
          `,
          duration: 1800, // 30 minutes
          position: lessonPosition++,
          isPreview: false,
        },
      ],
    },
    {
      title: "Agile Metrics and Reporting",
      description: "Measure and report Agile performance.",
      position: 9,
      lessons: [
        {
          title: "Introduction to Agile Metrics",
          description: "Learn key metrics for Agile success.",
          type: "VIDEO",
          videoUrl: "https://www.youtube.com/watch?v=0g80yY6JhcI", // Agile Metrics
          duration: 600, // 10 minutes
          position: lessonPosition++,
          isPreview: true,
        },
        {
          title: "Velocity and Burndown Charts",
          description: "Track progress with velocity and burndown charts.",
          type: "TEXT",
          content: `
# Velocity and Burndown Charts

1. **Velocity**:
   - Measures story points completed per sprint.
   - Example: Team averages 20 points/sprint.

2. **Burndown Chart**:
   - Shows remaining work in a sprint.
   - Example: Plots story points vs. days.

**Practice**:
- Create a burndown chart for a 10-point sprint.
- Calculate velocity for 3 sprints with 18, 22, 20 points.
          `,
          duration: 600, // 10 minutes
          position: lessonPosition++,
          isPreview: true,
        },
        {
          title: "Other Agile Metrics",
          description:
            "Use cycle time, defect rate, and customer satisfaction.",
          type: "TEXT",
          content: `
# Other Agile Metrics

1. **Cycle Time**:
   - Time to complete a task.
   - Example: Average 4 days for a user story.

2. **Defect Rate**:
   - Number of bugs per release.
   - Example: 5 defects in a sprint.

3. **Customer Satisfaction**:
   - Measured via surveys or NPS.
   - Example: NPS of 70 after a release.

**Practice**:
- Track cycle time for 3 tasks.
- Design a customer satisfaction survey.
          `,
          duration: 600, // 10 minutes
          position: lessonPosition++,
          isPreview: false,
        },
        {
          title: "Assignment: Metrics Dashboard",
          description: "Create a metrics dashboard for an Agile team.",
          type: "ASSIGNMENT",
          content: `
# Assignment: Metrics Dashboard

**Objective**: Build a dashboard for Agile metrics.

**Requirements**:
- Track velocity, burndown, and cycle time for a project.
- Create sample data for 3 sprints.
- Design a dashboard (e.g., in Excel or a tool).
- Write a 200-word analysis of the metrics.

**Submission**:
- Submit your dashboard and analysis.
          `,
          duration: 1800, // 30 minutes
          position: lessonPosition++,
          isPreview: false,
        },
      ],
    },
    {
      title: "Agile in Practice",
      description:
        "Apply Agile to real-world projects and prepare for certification.",
      position: 10,
      lessons: [
        {
          title: "Case Studies in Agile",
          description: "Analyze real-world Agile implementations.",
          type: "VIDEO",
          videoUrl: "https://www.youtube.com/watch?v=2oKxE4ViN3Q", // Agile Case Studies
          duration: 600, // 10 minutes
          position: lessonPosition++,
          isPreview: true,
        },
        {
          title: "Agile Project Simulation",
          description: "Simulate an Agile project from start to finish.",
          type: "TEXT",
          content: `
# Agile Project Simulation

**Steps**:
1. Define a product (e.g., a website).
2. Create a backlog and prioritize.
3. Plan and execute 2 sprints.
4. Conduct a retrospective.

**Example**:
- Product: Event management app.
- Backlog: User registration, event creation.
- Sprint 1: Build registration feature (8 points).

**Practice**:
- Simulate 1 sprint for a chosen product.
- Document your backlog and sprint plan.
          `,
          duration: 600, // 10 minutes
          position: lessonPosition++,
          isPreview: true,
        },
        {
          title: "Agile Certifications",
          description:
            "Prepare for certifications like PMP-ACP or Scrum Master.",
          type: "TEXT",
          content: `
# Agile Certifications

1. **PMP-ACP**:
   - Covers Agile methodologies and tools.
   - Requires 21 hours of training.

2. **Certified ScrumMaster (CSM)**:
   - Focuses on Scrum framework.
   - Requires a 2-day course.

3. **SAFe Agilist**:
   - For scaled Agile environments.
   - Requires a 2-day course.

**Practice**:
- Research 1 certification and outline its requirements.
- Create a study plan for 4 weeks.
          `,
          duration: 600, // 10 minutes
          position: lessonPosition++,
          isPreview: false,
        },
        {
          title: "Final Project: Agile Implementation",
          description: "Design and execute an Agile project.",
          type: "ASSIGNMENT",
          content: `
# Final Project: Agile Implementation

**Objective**: Implement Agile for a real or hypothetical project.

**Requirements**:
- Define a product and create a backlog with 10 stories.
- Plan and simulate 3 sprints using Scrum or Kanban.
- Track metrics (e.g., velocity, cycle time).
- Write a 300-word reflection on your Agile journey.

**Submission**:
- Submit your backlog, sprint plans, metrics, and reflection.
          `,
          duration: 7200, // 120 minutes
          position: lessonPosition++,
          isPreview: false,
        },
        {
          title: "Quiz: Agile in Practice",
          description: "Test your knowledge of Agile applications.",
          type: "QUIZ",
          content: `
# Quiz: Agile in Practice

**Instructions**: Answer the following questions.

1. **What is a benefit of Agile case studies?**
   - A) They replace Agile training
   - B) They show real-world applications
   - C) They eliminate the need for metrics
   - D) They focus only on Waterfall
   - **Answer**: B

2. **Which certification focuses on Scrum?**
   - A) PMP-ACP
   - B) Certified ScrumMaster
   - C) SAFe Agilist
   - D) Lean Six Sigma
   - **Answer**: B

3. **Why track velocity in Agile?**
   - **Answer**: To predict team capacity for future sprints.
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
