const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function main() {
  console.log("Starting seed process...");

  // Fetch the Full-Stack Web Development course
  const course = await prisma.course.findUnique({
    where: { slug: "full-stack-web-development-bootcamp" },
  });

  if (!course) {
    console.error("Course with slug 'full-stack-web-development' not found.");
    throw new Error("Course not found");
  }

  console.log(`Found course: ${course.title}`);

  let lessonPosition = 1; // Track lesson position across modules
  const modulesData = [
    {
      title: "Introduction to Web Development",
      description:
        "Understand the basics of web development and its ecosystem.",
      position: 1,
      lessons: [
        {
          title: "What is Web Development?",
          description:
            "Explore the roles of front-end, back-end, and full-stack development.",
          type: "VIDEO",
          videoUrl: "https://www.youtube.com/watch?v=Vi9Bx25z3wo", // FreeCodeCamp: Web Dev Intro
          duration: 420, // 7 minutes
          position: lessonPosition++,
          isPreview: true,
        },
        {
          title: "How the Web Works",
          description:
            "Learn about browsers, HTTP, and client-server architecture.",
          type: "TEXT",
          content: `
# How the Web Works

The web operates on a client-server model:

1. **Client**: Browsers (e.g., Chrome) request resources via URLs.
   - Example: Entering "example.com" sends a GET request.
2. **Server**: Responds with HTML, CSS, JavaScript, or data.
   - Example: A Node.js server sends JSON data.
3. **HTTP/HTTPS**: Protocols for communication.
   - Methods: GET, POST, PUT, DELETE.
   - Status codes: 200 (OK), 404 (Not Found), 500 (Server Error).

**Practice**:
- Open browser DevTools (F12) and inspect the Network tab.
- Visit a website and identify 2–3 HTTP requests and their status codes.
          `,
          duration: 600, // 10 minutes
          position: lessonPosition++,
          isPreview: true,
        },
        {
          title: "Setting Up Your Environment",
          description: "Install VS Code, Node.js, and browser tools.",
          type: "TEXT",
          content: `
# Setting Up Your Development Environment

Prepare your tools for web development:

1. **VS Code**:
   - Download from [code.visualstudio.com](https://code.visualstudio.com).
   - Install extensions: Prettier, ESLint, Live Server.

2. **Node.js**:
   - Install from [nodejs.org](https://nodejs.org) (LTS version).
   - Verify: Run \`node -v\` and \`npm -v\` in terminal.

3. **Browser**:
   - Use Chrome or Firefox for DevTools.
   - Install React Developer Tools extension.

**Practice**:
- Install VS Code and Node.js.
- Create a folder and open it in VS Code.
- Run a simple \`console.log("Hello, World!")\` in Node.js.
          `,
          duration: 600, // 10 minutes
          position: lessonPosition++,
          isPreview: true,
        },
        {
          title: "Quiz: Web Basics",
          description:
            "Test your understanding of web development fundamentals.",
          type: "QUIZ",
          content: `
# Quiz: Web Basics

**Instructions**: Answer the following questions.

1. **What does HTTP stand for?**
   - A) HyperText Transfer Protocol
   - B) High-Tech Transmission Protocol
   - C) Hyperlink Text Protocol
   - D) Home Transfer Protocol
   - **Answer**: A

2. **What is the role of a client in web development?**
   - A) Store databases
   - B) Request and display web content
   - C) Host websites
   - D) Manage servers
   - **Answer**: B

3. **What does a 404 status code indicate?**
   - **Answer**: Resource not found on the server.
          `,
          duration: 300, // 5 minutes
          position: lessonPosition++,
          isPreview: false,
        },
      ],
    },
    {
      title: "HTML Fundamentals",
      description: "Master HTML for structuring web content.",
      position: 2,
      lessons: [
        {
          title: "Introduction to HTML",
          description: "Learn HTML syntax, tags, and semantic structure.",
          type: "VIDEO",
          videoUrl: "https://www.youtube.com/watch?v=UB1O30fR-EE", // Traversy Media: HTML Crash Course
          duration: 600, // 10 minutes
          position: lessonPosition++,
          isPreview: true,
        },
        {
          title: "Building a Webpage",
          description: "Create a webpage with headings, lists, and links.",
          type: "TEXT",
          content: `
# Building a Webpage

HTML structures content:

1. **Basic Tags**:
   - \`<h1>\`–\`<h6>\`: Headings.
   - \`<p>\`: Paragraphs.
   - \`<a href="url">\`: Links.
   - \`<ul>\`, \`<ol>\`, \`<li>\`: Lists.

2. **Semantic HTML**:
   - Use \`<header>\`, \`<nav>\`, \`<main>\`, \`<footer>\` for accessibility.
   - Example: \`<nav><ul><li><a href="#home">Home</a></li></ul></nav>\`.

**Practice**:
- Create an HTML file with a header, navigation menu, and unordered list.
- Validate your HTML using [validator.w3.org](https://validator.w3.org).
          `,
          duration: 600, // 10 minutes
          position: lessonPosition++,
          isPreview: true,
        },
        {
          title: "Forms and Accessibility",
          description: "Build accessible forms with HTML.",
          type: "TEXT",
          content: `
# Forms and Accessibility in HTML

Forms collect user input:

1. **Form Elements**:
   - \`<form>\`: Container for inputs.
   - \`<input type="text">\`, \`<textarea>\`, \`<button>\`.
   - Example: \`<input type="email" required>\` for email validation.

2. **Accessibility**:
   - Use \`<label for="id">\` to link labels to inputs.
   - Add ARIA roles: \`<input aria-label="Search">\`.

**Practice**:
- Create a contact form with name, email, and message fields.
- Ensure all inputs have labels and test accessibility with a screen reader.
          `,
          duration: 600, // 10 minutes
          position: lessonPosition++,
          isPreview: false,
        },
        {
          title: "Assignment: Personal Portfolio Page",
          description: "Build a portfolio page with HTML.",
          type: "ASSIGNMENT",
          content: `
# Assignment: Personal Portfolio Page

**Objective**: Create a single-page HTML portfolio.

**Requirements**:
- Include semantic tags (\`<header>\`, \`<main>\`, \`<footer>\`).
- Add a navigation menu and a contact form.
- Include at least one list and two links.
- Validate HTML with [validator.w3.org](https://validator.w3.org).

**Submission**:
- Submit your HTML file.
- Write a 100-word description of your page structure.
          `,
          duration: 1200, // 20 minutes
          position: lessonPosition++,
          isPreview: false,
        },
      ],
    },
    {
      title: "CSS Fundamentals",
      description: "Style webpages with CSS for layout and design.",
      position: 3,
      lessons: [
        {
          title: "Introduction to CSS",
          description: "Learn CSS syntax, selectors, and properties.",
          type: "VIDEO",
          videoUrl: "https://www.youtube.com/watch?v=yfoY53QXEnI", // Traversy Media: CSS Crash Course
          duration: 600, // 10 minutes
          position: lessonPosition++,
          isPreview: true,
        },
        {
          title: "Box Model and Layout",
          description: "Understand the box model and CSS layouts.",
          type: "TEXT",
          content: `
# Box Model and Layout in CSS

CSS controls webpage appearance:

1. **Box Model**:
   - Content, padding, border, margin.
   - Example: \`margin: 10px; padding: 15px; border: 1px solid black;\`.

2. **Layouts**:
   - **Flexbox**: \`display: flex; justify-content: center;\`.
   - **Grid**: \`display: grid; grid-template-columns: 1fr 1fr;\`.

**Practice**:
- Style an HTML page with a centered flexbox layout.
- Create a two-column grid for content.
          `,
          duration: 600, // 10 minutes
          position: lessonPosition++,
          isPreview: true,
        },
        {
          title: "Responsive Design",
          description: "Make webpages responsive with media queries.",
          type: "TEXT",
          content: `
# Responsive Design with CSS

Responsive design ensures usability across devices:

1. **Relative Units**:
   - Use \`vw\`, \`vh\`, \`rem\`, \`em\`, or \`%\`.
   - Example: \`width: 80%;\` for flexible widths.

2. **Media Queries**:
   - Example: 
     \`\`\`css
     @media (max-width: 600px) {
       body { font-size: 16px; }
     }
     \`\`\`

**Practice**:
- Style a page to change layout on mobile (e.g., stack columns).
- Test responsiveness in browser DevTools.
          `,
          duration: 600, // 10 minutes
          position: lessonPosition++,
          isPreview: false,
        },
        {
          title: "Assignment: Responsive Landing Page",
          description: "Build a responsive landing page with CSS.",
          type: "ASSIGNMENT",
          content: `
# Assignment: Responsive Landing Page

**Objective**: Create a responsive landing page.

**Requirements**:
- Use HTML and CSS (Flexbox or Grid).
- Include a header, hero section, and footer.
- Ensure mobile-friendliness with media queries.
- Style with colors, fonts, and hover effects.

**Submission**:
- Submit HTML and CSS files.
- Write a 150-word explanation of your layout and responsiveness.
          `,
          duration: 1800, // 30 minutes
          position: lessonPosition++,
          isPreview: false,
        },
      ],
    },
    {
      title: "Version Control with Git",
      description: "Learn Git and GitHub for collaborative development.",
      position: 4,
      lessons: [
        {
          title: "Introduction to Git",
          description: "Understand version control and Git basics.",
          type: "VIDEO",
          videoUrl: "https://www.youtube.com/watch?v=RGOj5yH7evk", // FreeCodeCamp: Git Intro
          duration: 600, // 10 minutes
          position: lessonPosition++,
          isPreview: true,
        },
        {
          title: "Git Commands and GitHub",
          description: "Commit, branch, and push code to GitHub.",
          type: "TEXT",
          content: `
# Git Commands and GitHub

Git manages code versions:

1. **Basic Commands**:
   - Initialize: \`git init\`.
   - Stage: \`git add .\`.
   - Commit: \`git commit -m "Initial commit"\`.

2. **GitHub**:
   - Push: \`git push origin main\`.
   - Pull: \`git pull origin main\`.
   - Branch: \`git branch feature; git checkout feature\`.

**Practice**:
- Create a Git repository and push it to GitHub.
- Create a branch and merge it to the main branch.
          `,
          duration: 600, // 10 minutes
          position: lessonPosition++,
          isPreview: true,
        },
        {
          title: "Collaborating with Git",
          description:
            "Work on teams with pull requests and conflict resolution.",
          type: "TEXT",
          content: `
# Collaborating with Git

Git enables teamwork:

1. **Pull Requests**:
   - Create a PR on GitHub to propose changes.
   - Example: Submit a feature branch for review.

2. **Resolving Conflicts**:
   - Merge conflicts occur when changes overlap.
   - Use VS Code or \`git merge\` to resolve.

**Practice**:
- Fork a GitHub repo and submit a pull request.
- Simulate a merge conflict and resolve it locally.
          `,
          duration: 600, // 10 minutes
          position: lessonPosition++,
          isPreview: false,
        },
        {
          title: "Assignment: Collaborative Project",
          description: "Contribute to a shared GitHub repository.",
          type: "ASSIGNMENT",
          content: `
# Assignment: Collaborative Project

**Objective**: Contribute to a team project using Git.

**Requirements**:
- Fork a provided GitHub repo (or create one).
- Add a feature (e.g., a new HTML page) on a branch.
- Submit a pull request with a description.
- Resolve any merge conflicts.

**Submission**:
- Submit your GitHub repo URL and PR link.
- Write a 150-word summary of your contribution process.
          `,
          duration: 1800, // 30 minutes
          position: lessonPosition++,
          isPreview: false,
        },
      ],
    },
    {
      title: "JavaScript Fundamentals",
      description: "Add interactivity to webpages with JavaScript.",
      position: 5,
      lessons: [
        {
          title: "Introduction to JavaScript",
          description: "Learn JavaScript syntax and programming concepts.",
          type: "VIDEO",
          videoUrl: "https://www.youtube.com/watch?v=W6NZfCO5SIk", // Traversy Media: JS Crash Course
          duration: 600, // 10 minutes
          position: lessonPosition++,
          isPreview: true,
        },
        {
          title: "DOM Manipulation",
          description: "Interact with the DOM for dynamic content.",
          type: "TEXT",
          content: `
# DOM Manipulation

The DOM enables dynamic webpages:

1. **Selecting Elements**:
   - Use \`document.querySelector('.class')\` or \`getElementById('id')\`.
   - Example: \`element.textContent = 'Updated!';\`.

2. **Events**:
   - Add listeners: \`element.addEventListener('click', () => alert('Clicked'))\`.
   - Example: Toggle a class on click.

**Practice**:
- Create a button that changes a div’s background color.
- Log the event details to the console.
          `,
          duration: 600, // 10 minutes
          position: lessonPosition++,
          isPreview: true,
        },
        {
          title: "Asynchronous JavaScript",
          description: "Handle async operations with promises and async/await.",
          type: "TEXT",
          content: `
# Asynchronous JavaScript

Handle time-based operations:

1. **Promises**:
   - Create: \`new Promise((resolve, reject) => resolve('Done'))\`.
   - Use: \`.then(data => console.log(data))\`.

2. **Async/Await**:
   - Example:
     \`\`\`javascript
     async function fetchData() {
       const res = await fetch('https://api.example.com');
       return res.json();
     }
     \`\`\`

**Practice**:
- Fetch data from a public API (e.g., JSONPlaceholder).
- Display the data in the DOM.
          `,
          duration: 600, // 10 minutes
          position: lessonPosition++,
          isPreview: false,
        },
        {
          title: "Assignment: Interactive To-Do List",
          description: "Build a to-do list with JavaScript.",
          type: "ASSIGNMENT",
          content: `
# Assignment: Interactive To-Do List

**Objective**: Create a to-do list webpage.

**Requirements**:
- Allow adding, deleting, and toggling tasks.
- Use DOM manipulation and event listeners.
- Style with CSS for a clean UI.
- Persist tasks in localStorage.

**Submission**:
- Submit HTML, CSS, and JS files.
- Write a 150-word explanation of your logic.
          `,
          duration: 2400, // 40 minutes
          position: lessonPosition++,
          isPreview: false,
        },
      ],
    },
    {
      title: "Node.js and Express",
      description: "Build back-end servers with Node.js and Express.",
      position: 6,
      lessons: [
        {
          title: "Introduction to Node.js",
          description: "Learn Node.js for server-side JavaScript.",
          type: "VIDEO",
          videoUrl: "https://www.youtube.com/watch?v=TlB_eWDSMt4", // Traversy Media: Node.js Intro
          duration: 600, // 10 minutes
          position: lessonPosition++,
          isPreview: true,
        },
        {
          title: "Setting Up an Express Server",
          description: "Create a REST API with Express.",
          type: "TEXT",
          content: `
# Setting Up an Express Server

Express simplifies API development:

1. **Setup**:
   - Install: \`npm install express\`.
   - Basic server:
     \`\`\`javascript
     const express = require('express');
     const app = express();
     app.use(express.json());
     app.get('/', (req, res) => res.send('Hello World!'));
     app.listen(3000);
     \`\`\`

2. **Routes**:
   - Example: \`app.get('/api/users', (req, res) => res.json(users))\`.

**Practice**:
- Create an Express server with GET and POST routes.
- Test with Postman or curl.
          `,
          duration: 600, // 10 minutes
          position: lessonPosition++,
          isPreview: true,
        },
        {
          title: "Middleware and Error Handling",
          description: "Use middleware and handle errors in Express.",
          type: "TEXT",
          content: `
# Middleware and Error Handling in Express

Middleware processes requests:

1. **Middleware**:
   - Example: \`app.use((req, res, next) => { console.log('Request!'); next(); })\`.
   - Use \`express.json()\` for JSON parsing.

2. **Error Handling**:
   - Example:
     \`\`\`javascript
     app.use((err, req, res, next) => {
       res.status(500).json({ error: err.message });
     });
     \`\`\`

**Practice**:
- Add logging middleware to an Express app.
- Create an error-handling route for 404s.
          `,
          duration: 600, // 10 minutes
          position: lessonPosition++,
          isPreview: false,
        },
        {
          title: "Assignment: REST API for Tasks",
          description: "Build a task management API.",
          type: "ASSIGNMENT",
          content: `
# Assignment: REST API for Tasks

**Objective**: Create a REST API for tasks.

**Requirements**:
- Implement CRUD routes: GET, POST, PUT, DELETE for tasks.
- Store tasks in memory or a JSON file.
- Include middleware for logging requests.
- Handle errors (e.g., 404 for missing tasks).

**Submission**:
- Submit your Express code.
- Write a 150-word description of your API endpoints.
          `,
          duration: 2400, // 40 minutes
          position: lessonPosition++,
          isPreview: false,
        },
      ],
    },
    {
      title: "React Fundamentals",
      description: "Build dynamic front-end interfaces with React.",
      position: 7,
      lessons: [
        {
          title: "Introduction to React",
          description: "Learn React components, JSX, and props.",
          type: "VIDEO",
          videoUrl: "https://www.youtube.com/watch?v=N3AkSS5hXMA", // Traversy Media: React Crash Course
          duration: 600, // 10 minutes
          position: lessonPosition++,
          isPreview: true,
        },
        {
          title: "State and Hooks",
          description: "Manage state with useState and useEffect.",
          type: "TEXT",
          content: `
# State and Hooks in React

React hooks manage state and side effects:

1. **useState**:
   - Example: \`const [count, setCount] = useState(0);\`.
   - Update: \`setCount(count + 1);\`.

2. **useEffect**:
   - Run side effects: 
     \`\`\`javascript
     useEffect(() => {
       document.title = \`Count: \${count}\`;
     }, [count]);
     \`\`\`

**Practice**:
- Create a counter component with useState.
- Use useEffect to log state changes.
          `,
          duration: 600, // 10 minutes
          position: lessonPosition++,
          isPreview: true,
        },
        {
          title: "React Router",
          description: "Add client-side routing to React apps.",
          type: "TEXT",
          content: `
# React Router

React Router enables navigation:

1. **Setup**:
   - Install: \`npm install react-router-dom\`.
   - Example:
     \`\`\`jsx
     import { BrowserRouter, Route, Routes } from 'react-router-dom';
     function App() {
       return (
         <BrowserRouter>
           <Routes>
             <Route path="/" element={<Home />} />
           </Routes>
         </BrowserRouter>
       );
     }
     \`\`\`

2. **Links**:
   - Use \`<Link to="/path">\` for navigation.

**Practice**:
- Create a React app with Home and About pages.
- Add navigation with React Router.
          `,
          duration: 600, // 10 minutes
          position: lessonPosition++,
          isPreview: false,
        },
        {
          title: "Assignment: React Task Tracker",
          description: "Build a task tracker app with React.",
          type: "ASSIGNMENT",
          content: `
# Assignment: React Task Tracker

**Objective**: Create a task tracker app.

**Requirements**:
- Allow adding, deleting, and toggling tasks.
- Use useState for task management.
- Style with CSS or Tailwind CSS.
- Add routing for task list and about pages.

**Submission**:
- Submit React project files.
- Write a 150-word explanation of your component structure.
          `,
          duration: 3600, // 60 minutes
          position: lessonPosition++,
          isPreview: false,
        },
      ],
    },
    {
      title: "Databases and Prisma",
      description: "Manage data with relational databases and Prisma.",
      position: 8,
      lessons: [
        {
          title: "Introduction to Databases",
          description: "Understand relational databases and SQL.",
          type: "VIDEO",
          videoUrl: "https://www.youtube.com/watch?v=4Z9KEBexzcM", // FreeCodeCamp: Databases Intro
          duration: 600, // 10 minutes
          position: lessonPosition++,
          isPreview: true,
        },
        {
          title: "Using Prisma with PostgreSQL",
          description: "Set up Prisma for database operations.",
          type: "TEXT",
          content: `
# Using Prisma with PostgreSQL

Prisma simplifies database access:

1. **Setup**:
   - Install: \`npm install @prisma/client\`.
   - Define schema:
     \`\`\`prisma
     model User {
       id    Int     @id @default(autoincrement())
       name  String
     }
     \`\`\`

2. **Queries**:
   - Fetch: \`await prisma.user.findMany()\`.
   - Create: \`await prisma.user.create({ data: { name: 'Alice' } })\`.

**Practice**:
- Set up Prisma with a PostgreSQL database.
- Create a User model and add a record.
          `,
          duration: 600, // 10 minutes
          position: lessonPosition++,
          isPreview: true,
        },
        {
          title: "Advanced Prisma Queries",
          description: "Perform complex queries with Prisma.",
          type: "TEXT",
          content: `
# Advanced Prisma Queries

Prisma supports complex operations:

1. **Filtering**:
   - Example: \`await prisma.user.findMany({ where: { age: { gt: 18 } } })\`.

2. **Relations**:
   - Example:
     \`\`\`prisma
     model Post {
       id       Int    @id
       author   User   @relation(fields: [authorId], references: [id])
       authorId Int
     }
     \`\`\`
   - Query: \`await prisma.user.findUnique({ include: { posts: true } })\`.

**Practice**:
- Create a Post model with a relation to User.
- Query users with their posts.
          `,
          duration: 600, // 10 minutes
          position: lessonPosition++,
          isPreview: false,
        },
        {
          title: "Assignment: Blog API with Prisma",
          description: "Build a blog API with CRUD operations.",
          type: "ASSIGNMENT",
          content: `
# Assignment: Blog API with Prisma

**Objective**: Create a blog API.

**Requirements**:
- Use Express and Prisma with PostgreSQL.
- Implement CRUD for posts and users.
- Include relational queries (e.g., posts with authors).
- Test with Postman.

**Submission**:
- Submit Express and Prisma files.
- Write a 150-word description of your schema and endpoints.
          `,
          duration: 3600, // 60 minutes
          position: lessonPosition++,
          isPreview: false,
        },
      ],
    },
    {
      title: "NoSQL with MongoDB",
      description: "Learn NoSQL databases with MongoDB and Mongoose.",
      position: 9,
      lessons: [
        {
          title: "Introduction to NoSQL",
          description: "Understand NoSQL databases and MongoDB.",
          type: "VIDEO",
          videoUrl: "https://www.youtube.com/watch?v=ZS_kXvOeQ5Y", // Traversy Media: MongoDB Intro
          duration: 600, // 10 minutes
          position: lessonPosition++,
          isPreview: true,
        },
        {
          title: "Using Mongoose with MongoDB",
          description: "Set up Mongoose for MongoDB operations.",
          type: "TEXT",
          content: `
# Using Mongoose with MongoDB

Mongoose is an ODM for MongoDB:

1. **Setup**:
   - Install: \`npm install mongoose\`.
   - Connect:
     \`\`\`javascript
     const mongoose = require('mongoose');
     mongoose.connect('mongodb://localhost/db');
     \`\`\`

2. **Schema**:
   - Example:
     \`\`\`javascript
     const userSchema = new mongoose.Schema({
       name: String,
       age: Number
     });
     const User = mongoose.model('User', userSchema);
     \`\`\`

**Practice**:
- Set up a MongoDB database with Mongoose.
- Create a User model and save a document.
          `,
          duration: 600, // 10 minutes
          position: lessonPosition++,
          isPreview: true,
        },
        {
          title: "Assignment: MongoDB API",
          description: "Build an API with MongoDB and Mongoose.",
          type: "ASSIGNMENT",
          content: `
# Assignment: MongoDB API

**Objective**: Create an API for a product catalog.

**Requirements**:
- Use Express and Mongoose with MongoDB.
- Implement CRUD for products (e.g., name, price).
- Test with Postman or a browser.
- Handle errors for invalid inputs.

**Submission**:
- Submit Express and Mongoose files.
- Write a 150-word description of your schema and endpoints.
          `,
          duration: 3600, // 60 minutes
          position: lessonPosition++,
          isPreview: false,
        },
      ],
    },
    {
      title: "Authentication and Security",
      description:
        "Secure applications with authentication and best practices.",
      position: 10,
      lessons: [
        {
          title: "Introduction to Authentication",
          description: "Learn about JWT and user authentication.",
          type: "VIDEO",
          videoUrl: "https://www.youtube.com/watch?v=7Q17ubqLAd8", // Traversy Media: JWT Auth
          durationMgmt: true,
          duration: 600, // 10 minutes
          position: lessonPosition++,
          isPreview: true,
        },
        {
          title: "Implementing JWT Authentication",
          description: "Add JWT authentication to an Express API.",
          type: "TEXT",
          content: `
# Implementing JWT Authentication

JWT secures APIs:

1. **Setup**:
   - Install: \`npm install jsonwebtoken bcryptjs\`.
   - Hash passwords: 
     \`\`\`javascript
     const bcrypt = require('bcryptjs');
     const hashed = await bcrypt.hash('password', 10);
     \`\`\`

2. **Generate JWT**:
   - Example:
     \`\`\`javascript
     const jwt = require('jsonwebtoken');
     const token = jwt.sign({ id: user.id }, 'secret', { expiresIn: '1h' });
     \`\`\`

**Practice**:
- Add a /register and /login route to an Express app.
- Protect a route with JWT middleware.
          `,
          duration: 600, // 10 minutes
          position: lessonPosition++,
          isPreview: true,
        },
        {
          title: "Security Best Practices",
          description: "Protect against common web vulnerabilities.",
          type: "TEXT",
          content: `
# Security Best Practices

Secure your apps:

1. **Input Validation**:
   - Use libraries like \`express-validator\`.
   - Example: Sanitize user inputs to prevent XSS.

2. **HTTPS and CORS**:
   - Enforce HTTPS: Redirect HTTP traffic.
   - Set CORS: \`app.use(cors({ origin: 'example.com' }));\`.

3. **SQL Injection**:
   - Use parameterized queries with Prisma or Mongoose.

**Practice**:
- Add input validation to a POST route.
- Configure CORS for a specific domain.
          `,
          duration: 600, // 10 minutes
          position: lessonPosition++,
          isPreview: false,
        },
        {
          title: "Assignment: Secure User API",
          description: "Build a secure API with authentication.",
          type: "ASSIGNMENT",
          content: `
# Assignment: Secure User API

**Objective**: Create a secure user management API.

**Requirements**:
- Implement register, login, and protected user routes.
- Use JWT for authentication.
- Validate inputs and handle errors.
- Store hashed passwords with bcrypt.

**Submission**:
- Submit Express project files.
- Write a 200-word explanation of your security measures.
          `,
          duration: 3600, // 60 minutes
          position: lessonPosition++,
          isPreview: false,
        },
      ],
    },
    {
      title: "Testing and Quality Assurance",
      description: "Write tests to ensure code quality.",
      position: 11,
      lessons: [
        {
          title: "Introduction to Testing",
          description: "Learn about unit and integration testing.",
          type: "VIDEO",
          videoUrl: "https://www.youtube.com/watch?v=rNtm3e-8tI4", // Traversy Media: Testing Intro
          duration: 600, // 10 minutes
          position: lessonPosition++,
          isPreview: true,
        },
        {
          title: "Unit Testing with Jest",
          description: "Write unit tests for JavaScript functions.",
          type: "TEXT",
          content: `
# Unit Testing with Jest

Jest is a testing framework:

1. **Setup**:
   - Install: \`npm install --save-dev jest\`.
   - Example:
     \`\`\`javascript
     test('adds 1 + 2 to equal 3', () => {
       expect(1 + 2).toBe(3);
     });
     \`\`\`

2. **Mocks**:
   - Mock functions: \`jest.fn()\`.

**Practice**:
- Write tests for a simple math function (e.g., add, subtract).
- Run tests with \`npm test\`.
          `,
          duration: 600, // 10 minutes
          position: lessonPosition++,
          isPreview: true,
        },
        {
          title: "Integration Testing",
          description: "Test API endpoints with Supertest.",
          type: "TEXT",
          content: `
# Integration Testing with Supertest

Test Express APIs:

1. **Setup**:
   - Install: \`npm install --save-dev supertest\`.
   - Example:
     \`\`\`javascript
     const request = require('supertest');
     const app = require('./app');
     test('GET /api/users', async () => {
       const res = await request(app).get('/api/users');
       expect(res.status).toBe(200);
     });
     \`\`\`

**Practice**:
- Write integration tests for a GET and POST route.
- Verify response status and data.
          `,
          duration: 600, // 10 minutes
          position: lessonPosition++,
          isPreview: false,
        },
        {
          title: "Assignment: Test Suite for API",
          description: "Create a test suite for an API.",
          type: "ASSIGNMENT",
          content: `
# Assignment: Test Suite for API

**Objective**: Write tests for a task API.

**Requirements**:
- Write 5 unit tests with Jest for helper functions.
- Write 3 integration tests with Supertest for CRUD routes.
- Achieve at least 80% test coverage.

**Submission**:
- Submit test files and coverage report.
- Write a 150-word explanation of your testing strategy.
          `,
          duration: 3600, // 60 minutes
          position: lessonPosition++,
          isPreview: false,
        },
      ],
    },
    {
      title: "Deployment and Portfolio",
      description: "Deploy apps and build a professional portfolio.",
      position: 12,
      lessons: [
        {
          title: "Deploying to Vercel",
          description: "Deploy a full-stack app to Vercel.",
          type: "VIDEO",
          videoUrl: "https://www.youtube.com/watch?v=ZwvW9ptX4fM", // Vercel Deployment Tutorial
          duration: 600, // 10 minutes
          position: lessonPosition++,
          isPreview: true,
        },
        {
          title: "Building a Portfolio",
          description: "Create a portfolio to showcase projects.",
          type: "TEXT",
          content: `
# Building a Portfolio

Showcase your work:

1. **Structure**:
   - Sections: Home, Projects, About, Contact.
   - Use React or static HTML/CSS.

2. **Projects**:
   - Include 3–5 projects (e.g., to-do app, blog).
   - Host on GitHub Pages or Vercel.

3. **SEO**:
   - Add meta tags: \`<meta name="description" content="My portfolio">\`.

**Practice**:
- Design a portfolio with a project section.
- Deploy to Vercel or Netlify.
          `,
          duration: 600, // 10 minutes
          position: lessonPosition++,
          isPreview: true,
        },
        {
          title: "Career Preparation",
          description: "Prepare for web development jobs.",
          type: "TEXT",
          content: `
# Career Preparation

Launch your career:

1. **Resume**:
   - Highlight projects and skills.
   - Use tools like Canva or Overleaf.

2. **Networking**:
   - Join LinkedIn, Discord, or X communities.
   - Attend virtual hackathons or meetups.

3. **Interviews**:
   - Practice coding challenges on LeetCode.
   - Prepare for behavioral questions.

**Practice**:
- Draft a resume with 2–3 projects.
- Solve one LeetCode easy problem.
          `,
          duration: 600, // 10 minutes
          position: lessonPosition++,
          isPreview: false,
        },
        {
          title: "Final Project: Portfolio Website",
          description: "Build and deploy a portfolio website.",
          type: "ASSIGNMENT",
          content: `
# Final Project: Portfolio Website

**Objective**: Create a professional portfolio.

**Requirements**:
- Build with React or HTML/CSS/JS.
- Include 4–6 projects with descriptions.
- Add a contact form and About page.
- Deploy to Vercel, Netlify, or GitHub Pages.

**Submission**:
- Submit project files and URL.
- Write a 300-word reflection on your learning journey.
          `,
          duration: 7200, // 120 minutes
          position: lessonPosition++,
          isPreview: false,
        },
        {
          title: "Quiz: Deployment and Career",
          description:
            "Test your knowledge of deployment and career strategies.",
          type: "QUIZ",
          content: `
# Quiz: Deployment and Career

**Instructions**: Answer the following questions.

1. **What is a benefit of deploying to Vercel?**
   - A) Requires manual server setup
   - B) Automatic scaling and easy deployment
   - C) Only supports PHP
   - D) No free tier
   - **Answer**: B

2. **Which platform is best for networking?**
   - A) YouTube
   - B) LinkedIn
   - C) Reddit
   - D) TikTok
   - **Answer**: B

3. **Why include projects in a portfolio?**
   - **Answer**: To demonstrate skills and experience to employers.
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
