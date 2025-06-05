import type { Post, User } from "./type";

// Mock current user
const currentUser: User = {
  id: "user-1",
  name: "Alex Johnson",
  avatar: "/placeholder.svg?height=40&width=40",
};

// Sample users
const users: User[] = [
  currentUser,
  {
    id: "user-2",
    name: "Sarah Chen",
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    id: "user-3",
    name: "Michael Rodriguez",
    avatar: "/placeholder.svg?height=40&width=40",
  },
];

// In-memory data store with more realistic content
const posts: Post[] = [
  {
    id: "post-1",
    title: "The Future of Web Development: Trends to Watch in 2024",
    content: `The web development landscape is evolving at an unprecedented pace. As we move through 2024, several key trends are reshaping how we build and interact with web applications.

Server-side rendering is making a strong comeback with frameworks like Next.js leading the charge. The benefits of SSR for SEO and initial page load times are becoming impossible to ignore, especially as Core Web Vitals become increasingly important for search rankings.

Edge computing is another game-changer. By processing data closer to users, we're seeing dramatic improvements in application performance. Vercel's Edge Runtime and Cloudflare Workers are pioneering this space, making it easier than ever to deploy globally distributed applications.

The rise of AI-powered development tools is also transforming our workflow. From GitHub Copilot to ChatGPT, these tools are helping developers write code faster and with fewer bugs. However, they're not replacing developers – they're making us more productive and allowing us to focus on higher-level problem-solving.

Looking ahead, I believe we'll see even more integration between AI and development tools, better performance optimization techniques, and continued evolution in the React ecosystem. The future of web development is bright, and I'm excited to see what innovations emerge next.`,
    author: currentUser,
    createdAt: new Date("2024-01-15"),
    category: "Technology",
    comments: [
      {
        id: "comment-1",
        content:
          "Great insights! I'm particularly excited about edge computing. The performance improvements are game-changing for global applications.",
        author: users[1],
        createdAt: new Date("2024-01-16"),
        replies: [
          {
            id: "reply-1",
            content:
              "We've seen 40% faster load times after moving to edge functions. The user experience improvement is noticeable.",
            author: currentUser,
            createdAt: new Date("2024-01-16"),
          },
        ],
      },
      {
        id: "comment-2",
        content:
          "AI-powered development tools have been a productivity booster for our team. Curious about your thoughts on potential downsides?",
        author: users[2],
        createdAt: new Date("2024-01-17"),
        replies: [],
      },
    ],
  },
  {
    id: "post-2",
    title: "Building Accessible Web Applications: A Developer's Guide",
    content: `Accessibility isn't just a nice-to-have feature – it's a fundamental requirement for creating inclusive web experiences. Yet, many developers still treat it as an afterthought. Let's change that.

Understanding the basics is crucial. Web accessibility means ensuring that people with disabilities can perceive, understand, navigate, and interact with your web applications. This includes users with visual, auditory, motor, and cognitive disabilities.

The Web Content Accessibility Guidelines (WCAG) provide a comprehensive framework. Focus on the four main principles: Perceivable, Operable, Understandable, and Robust. These aren't just guidelines – they're the foundation of inclusive design.

Semantic HTML is your first line of defense. Use proper heading structures, form labels, and ARIA attributes where necessary. Screen readers rely on this semantic information to provide context to users.

Testing is essential. Use tools like axe-core, WAVE, or Lighthouse's accessibility audit. But don't stop there – test with actual assistive technologies. Try navigating your site using only a keyboard or with a screen reader.

Remember, accessibility benefits everyone. Captions help users in noisy environments, high contrast modes help users with low vision, and clear navigation helps users with cognitive disabilities. When we design for accessibility, we create better experiences for all users.

The investment in accessibility pays dividends in user satisfaction, legal compliance, and market reach. It's not just the right thing to do – it's good business.`,
    author: users[1],
    createdAt: new Date("2024-01-10"),
    category: "Web Development",
    comments: [
      {
        id: "comment-3",
        content:
          "This is such an important topic! Do you have recommendations for accessibility testing tools that integrate well with CI/CD pipelines?",
        author: users[2],
        createdAt: new Date("2024-01-11"),
        replies: [
          {
            id: "reply-2",
            content:
              "axe-core has great CI integration! We use it with GitHub Actions and it catches issues before they reach production.",
            author: users[1],
            createdAt: new Date("2024-01-11"),
          },
        ],
      },
    ],
  },
  {
    id: "post-3",
    title: "My Journey from Bootcamp to Senior Developer",
    content: `Three years ago, I made a career change that seemed impossible. I left my job in marketing to pursue software development through a coding bootcamp. Today, I'm a senior developer at a tech company, and I want to share what I learned along the way.

The bootcamp experience was intense but invaluable. Twelve weeks of immersive learning taught me more than I thought possible. However, the real learning began after graduation. The bootcamp gave me the foundation, but becoming a professional developer required continuous learning and practice.

My first job was challenging. Imposter syndrome hit hard – I felt like everyone knew more than me. The key was embracing this feeling and using it as motivation to learn. I spent evenings and weekends building projects, reading documentation, and contributing to open source.

Mentorship made a huge difference. Finding experienced developers willing to guide me accelerated my growth exponentially. Don't be afraid to ask questions or admit when you don't know something. The development community is generally supportive and willing to help.

Building a portfolio of real projects was crucial. Employers want to see what you can build, not just what you've learned. Focus on quality over quantity – a few well-built applications are better than many incomplete ones.

The journey from junior to senior isn't just about technical skills. Communication, problem-solving, and the ability to work with others are equally important. Learn to explain complex concepts simply, collaborate effectively, and approach problems systematically.

To anyone considering a similar path: it's challenging but absolutely possible. The tech industry needs diverse perspectives and backgrounds. Your unique experience is an asset, not a liability.`,
    author: users[2],
    createdAt: new Date("2024-01-05"),
    category: "Career",
    comments: [],
  },
];

// Data access functions
export async function getPosts(): Promise<Post[]> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 500));
  return [...posts].sort(
    (a, b) => b.createdAt.getTime() - a.createdAt.getTime()
  );
}

export async function getPostById(id: string): Promise<Post | undefined> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 300));
  return posts.find((post) => post.id === id);
}

// Helper function to generate IDs
export function generateId(prefix: string): string {
  return `${prefix}-${Date.now()}-${Math.random()
    .toString(36)
    .substring(2, 9)}`;
}
