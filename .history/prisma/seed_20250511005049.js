import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Starting seed process for Digital Marketing Strategy...");

  // Fetch the Digital Marketing Strategy course
  const course = await prisma.course.findUnique({
    where: { slug: "digital-marketing-strategy" },
  });

  if (!course) {
    console.error("Course with slug 'digital-marketing-strategy' not found.");
    throw new Error("Course not found");
  }

  console.log(`Found course: ${course.title}`);

  let lessonPosition = 1; // Track lesson position across modules
  const modulesData = [
    {
      title: "Introduction to Digital Marketing",
      description:
        "Understand the fundamentals and scope of digital marketing.",
      position: 1,
      lessons: [
        {
          title: "What is Digital Marketing?",
          description:
            "Explore the definition, channels, and importance of digital marketing.",
          type: "VIDEO",
          videoUrl: "https://www.youtube.com/watch?v=1P1zW7jG2E0", // Placeholder
          duration: 420, // 7 minutes
          position: lessonPosition++,
          isPreview: true,
        },
        {
          title: "Key Digital Marketing Channels",
          description:
            "Learn about SEO, PPC, social media, email, and content marketing.",
          type: "TEXT",
          content: `
# Key Digital Marketing Channels

Digital marketing leverages multiple channels:

1. **Search Engine Optimization (SEO)**:
   - Improves organic search rankings.
   - Example: Optimizing a blog for "best running shoes."

2. **Pay-Per-Click (PPC)**:
   - Paid ads on Google or social platforms.
   - Example: Google Ads for "buy laptops online."

3. **Social Media Marketing**:
   - Engages audiences on platforms like Instagram, X.
   - Example: Sponsored posts on LinkedIn.

4. **Email Marketing**:
   - Nurtures leads via personalized emails.
   - Example: Weekly newsletters with product updates.

5. **Content Marketing**:
   - Creates valuable content to attract customers.
   - Example: Blog posts, eBooks.

**Practice**:
- Identify 2 examples of each channel for a local business (e.g., a coffee shop).
- Write a 150-word explanation of how these channels complement each other.
          `,
          duration: 600, // 10 minutes
          position: lessonPosition++,
          isPreview: true,
        },
        {
          title: "Digital Marketing vs. Traditional Marketing",
          description: "Compare digital and traditional marketing approaches.",
          type: "TEXT",
          content: `
# Digital Marketing vs. Traditional Marketing

1. **Digital Marketing**:
   - Online, measurable, targeted.
   - Example: Google Ads with real-time analytics.
   - Pros: Cost-effective, scalable, trackable.
   - Cons: Requires technical skills.

2. **Traditional Marketing**:
   - Offline (TV, radio, print).
   - Example: Billboard ads.
   - Pros: Broad reach, tangible.
   - Cons: Expensive, hard to measure.

**Hybrid Strategies**:
- Combine both for maximum impact.
- Example: Promote a TV ad campaign via social media.

**Practice**:
- List 3 advantages of digital marketing for a small business.
- Research a brand using both digital and traditional marketing.
- Summarize findings in 100 words.
          `,
          duration: 600, // 10 minutes
          position: lessonPosition++,
          isPreview: true,
        },
        {
          title: "Quiz: Digital Marketing Basics",
          description:
            "Test your understanding of digital marketing fundamentals.",
          type: "QUIZ",
          content: `
# Quiz: Digital Marketing Basics

**Instructions**: Answer the following questions.

1. **Which channel focuses on organic search rankings?**
   - A) PPC
   - B) SEO
   - C) Email Marketing
   - D) Print Ads
   - **Answer**: B

2. **What is a benefit of digital marketing over traditional?**
   - A) Higher costs
   - B) Real-time analytics
   - C) Limited reach
   - D) Less targeting
   - **Answer**: B

3. **What does content marketing aim to do?**
   - **Answer**: Attract and engage customers with valuable content.
          `,
          duration: 300, // 5 minutes
          position: lessonPosition++,
          isPreview: false,
        },
      ],
    },
    {
      title: "Developing a Marketing Strategy",
      description: "Create a strategic plan for digital marketing success.",
      position: 2,
      lessons: [
        {
          title: "What is a Marketing Strategy?",
          description:
            "Learn the components of an effective digital marketing strategy.",
          type: "VIDEO",
          videoUrl: "https://www.youtube.com/watch?v=5D7s7B3JodI", // Placeholder
          duration: 600, // 10 minutes
          position: lessonPosition++,
          isPreview: true,
        },
        {
          title: "Setting SMART Goals",
          description:
            "Define Specific, Measurable, Achievable, Relevant, Time-bound goals.",
          type: "TEXT",
          content: `
# Setting SMART Goals

**SMART Framework**:
1. **Specific**: Clear and focused.
   - Example: Increase website traffic by 20%.
2. **Measurable**: Trackable metrics.
   - Example: 5,000 monthly visitors.
3. **Achievable**: Realistic given resources.
   - Example: Feasible with current budget.
4. **Relevant**: Aligns with business objectives.
   - Example: Traffic drives sales.
5. **Time-bound**: Set a deadline.
   - Example: Achieve in 6 months.

**Application**:
- Use Google Analytics to track metrics.
- Align goals with business KPIs.

**Practice**:
- Write 3 SMART goals for a fictional e-commerce store.
- Explain how you’ll measure each in 150 words.
          `,
          duration: 600, // 10 minutes
          position: lessonPosition++,
          isPreview: true,
        },
        {
          title: "Target Audience and Buyer Personas",
          description: "Identify and profile your ideal customers.",
          type: "TEXT",
          content: `
# Target Audience and Buyer Personas

1. **Target Audience**:
   - Broad group interested in your product.
   - Example: Millennials interested in fitness.

2. **Buyer Personas**:
   - Detailed profiles of ideal customers.
   - Example: "Active Anna," 30, gym-goer, uses Instagram, seeks workout gear.

**Creating Personas**:
- Include demographics, behaviors, goals, pain points.
- Use surveys or social media analytics.

**Practice**:
- Create 2 buyer personas for a business (e.g., coffee shop).
- Use a template (search online for free tools).
- Summarize personas and their marketing implications in 150 words.
          `,
          duration: 600, // 10 minutes
          position: lessonPosition++,
          isPreview: false,
        },
        {
          title: "Assignment: Marketing Strategy Outline",
          description: "Develop a high-level digital marketing strategy.",
          type: "ASSIGNMENT",
          content: `
# Assignment: Marketing Strategy Outline

**Objective**: Create a digital marketing strategy outline.

**Requirements**:
- Choose a fictional or real business.
- Define 3 SMART goals.
- Identify 2 buyer personas.
- Recommend 2–3 marketing channels (e.g., SEO, social media).
- Write a 300-word strategy outline, including goals, audience, and channel rationale.

**Submission**:
- Submit your strategy outline as a PDF or text file.
          `,
          duration: 2400, // 40 minutes
          position: lessonPosition++,
          isPreview: false,
        },
      ],
    },
    {
      title: "Search Engine Optimization (SEO)",
      description: "Optimize websites to rank higher on search engines.",
      position: 3,
      lessons: [
        {
          title: "Introduction to SEO",
          description: "Understand how SEO drives organic traffic.",
          type: "VIDEO",
          videoUrl: "https://www.youtube.com/watch?v=DvwS7cV9GmQ", // Placeholder
          duration: 600, // 10 minutes
          position: lessonPosition++,
          isPreview: true,
        },
        {
          title: "Keyword Research",
          description: "Find high-value keywords for your audience.",
          type: "TEXT",
          content: `
# Keyword Research

**Purpose**:
- Identify terms users search to find your content.
- Example: “best coffee machines” vs. “coffee machine reviews.”

**Tools**:
- Google Keyword Planner (free).
- SEMrush, Ahrefs (paid, free trials).

**Steps**:
1. Brainstorm seed keywords.
2. Analyze search volume and competition.
3. Select long-tail keywords (e.g., “best espresso machine 2025”).

**Practice**:
- Use Google Keyword Planner to find 5 keywords for a business.
- List search volume and difficulty.
- Write a 150-word summary of your keyword strategy.
          `,
          duration: 600, // 10 minutes
          position: lessonPosition++,
          isPreview: true,
        },
        {
          title: "On-Page and Technical SEO",
          description: "Optimize website content and structure.",
          type: "TEXT",
          content: `
# On-Page and Technical SEO

1. **On-Page SEO**:
   - Optimize titles, meta descriptions, headers.
   - Example: Title tag: “Best Coffee Machines 2025 | Brand.”
   - Include keywords naturally.

2. **Technical SEO**:
   - Improve site speed, mobile-friendliness, crawlability.
   - Example: Use Google PageSpeed Insights to test speed.

**Best Practices**:
- Write 60–160 character meta descriptions.
- Ensure HTTPS and clean URLs.

**Practice**:
- Analyze a website using a free SEO tool (e.g., Screaming Frog, limited free version).
- Suggest 3 on-page and 2 technical improvements.
- Summarize in 150 words.
          `,
          duration: 600, // 10 minutes
          position: lessonPosition++,
          isPreview: false,
        },
        {
          title: "Assignment: SEO Audit",
          description: "Conduct an SEO audit for a website.",
          type: "ASSIGNMENT",
          content: `
# Assignment: SEO Audit

**Objective**: Perform an SEO audit to improve rankings.

**Requirements**:
- Choose a real or fictional website.
- Conduct keyword research (5 keywords).
- Analyze on-page SEO (titles, meta, content).
- Check technical SEO (speed, mobile, structure).
- Write a 300-word report with findings and 5 improvement recommendations.

**Submission**:
- Submit your report and any tool screenshots.
          `,
          duration: 2400, // 40 minutes
          position: lessonPosition++,
          isPreview: false,
        },
      ],
    },
    {
      title: "Pay-Per-Click (PPC) Advertising",
      description: "Run effective paid ad campaigns with Google Ads.",
      position: 4,
      lessons: [
        {
          title: "Introduction to PPC",
          description: "Learn the basics of pay-per-click advertising.",
          type: "VIDEO",
          videoUrl: "https://www.youtube.com/watch?v=EEi3nJ3Ch8Y", // Placeholder
          duration: 600, // 10 minutes
          position: lessonPosition++,
          isPreview: true,
        },
        {
          title: "Setting Up Google Ads",
          description: "Create and optimize a Google Ads campaign.",
          type: "TEXT",
          content: `
# Setting Up Google Ads

**Key Components**:
1. **Campaign Type**:
   - Search, display, video.
   - Example: Search ads for “buy running shoes.”

2. **Keywords**:
   - Match types: broad, phrase, exact.
   - Example: [running shoes] for exact match.

3. **Ad Copy**:
   - Write compelling headlines and descriptions.
   - Example: “Top Running Shoes – 20% Off Today!”

**Metrics**:
- Click-Through Rate (CTR), Cost Per Click (CPC).

**Practice**:
- Explore Google Ads interface (free account).
- Draft 2 ad copies for a product.
- Select 5 keywords and explain match types in 150 words.
          `,
          duration: 600, // 10 minutes
          position: lessonPosition++,
          isPreview: true,
        },
        {
          title: "Optimizing PPC Campaigns",
          description: "Improve ROI with bid strategies and A/B testing.",
          type: "TEXT",
          content: `
# Optimizing PPC Campaigns

1. **Bid Strategies**:
   - Manual CPC, Maximize Clicks, Target ROAS.
   - Example: Target ROAS for e-commerce.

2. **A/B Testing**:
   - Test headlines, descriptions, landing pages.
   - Example: Test “Free Shipping” vs. “20% Off.”

3. **Negative Keywords**:
   - Prevent irrelevant clicks.
   - Example: Add “cheap” to avoid low-budget searchers.

**Practice**:
- Create a mock campaign with 2 ad variations.
- List 5 negative keywords.
- Write a 150-word plan to optimize CTR and reduce CPC.
          `,
          duration: 600, // 10 minutes
          position: lessonPosition++,
          isPreview: false,
        },
        {
          title: "Assignment: PPC Campaign Plan",
          description: "Design a Google Ads campaign.",
          type: "ASSIGNMENT",
          content: `
# Assignment: PPC Campaign Plan

**Objective**: Plan a PPC campaign for a business.

**Requirements**:
- Choose a product or service.
- Select 10 keywords (mix of match types).
- Write 2 ad copies with headlines and descriptions.
- Define a bid strategy and 5 negative keywords.
- Write a 300-word plan, including budget, goals, and optimization tactics.

**Submission**:
- Submit your campaign plan and ad copies.
          `,
          duration: 2400, // 40 minutes
          position: lessonPosition++,
          isPreview: false,
        },
      ],
    },
    {
      title: "Social Media Marketing",
      description: "Engage audiences on social media platforms.",
      position: 5,
      lessons: [
        {
          title: "Introduction to Social Media Marketing",
          description: "Learn the role of social media in digital marketing.",
          type: "VIDEO",
          videoUrl: "https://www.youtube.com/watch?v=1P1zW7jG2E0", // Placeholder
          duration: 600, // 10 minutes
          position: lessonPosition++,
          isPreview: true,
        },
        {
          title: "Platform Strategies",
          description: "Tailor content for Instagram, X, LinkedIn, and more.",
          type: "TEXT",
          content: `
# Platform Strategies

1. **Instagram**:
   - Visual content, Stories, Reels.
   - Example: Post aesthetic product photos.

2. **X**:
   - Real-time engagement, short posts.
   - Example: Share industry news with hashtags.

3. **LinkedIn**:
   - Professional content, B2B.
   - Example: Share case studies.

4. **Facebook**:
   - Community building, ads.
   - Example: Create a brand group.

**Practice**:
- Choose a business and create 1 post for 3 platforms.
- Explain platform-specific strategies in 150 words.
          `,
          duration: 600, // 10 minutes
          position: lessonPosition++,
          isPreview: true,
        },
        {
          title: "Social Media Advertising",
          description: "Run paid ads on social platforms.",
          type: "TEXT",
          content: `
# Social Media Advertising

1. **Ad Formats**:
   - Instagram Stories, Facebook carousel, LinkedIn sponsored posts.
   - Example: Carousel ad for product features.

2. **Targeting**:
   - Use demographics, interests, behaviors.
   - Example: Target 25–35-year-olds interested in fitness.

3. **Metrics**:
   - Impressions, engagement rate, conversions.

**Practice**:
- Plan a mock ad for Instagram or Facebook.
- Define audience and 1 ad format.
- Write a 150-word summary of targeting and expected outcomes.
          `,
          duration: 600, // 10 minutes
          position: lessonPosition++,
          isPreview: false,
        },
        {
          title: "Assignment: Social Media Campaign",
          description: "Design a social media marketing campaign.",
          type: "ASSIGNMENT",
          content: `
# Assignment: Social Media Campaign

**Objective**: Create a social media campaign.

**Requirements**:
- Choose a business and 2 platforms.
- Plan 5 posts per platform (mix of organic and paid).
- Define audience, goals, and metrics (e.g., engagement rate).
- Write a 300-word campaign plan, including content types and schedule.

**Submission**:
- Submit your campaign plan and sample posts.
          `,
          duration: 2400, // 40 minutes
          position: lessonPosition++,
          isPreview: false,
        },
      ],
    },
    {
      title: "Content Marketing",
      description: "Create valuable content to attract and engage audiences.",
      position: 6,
      lessons: [
        {
          title: "Introduction to Content Marketing",
          description: "Understand the role of content in digital marketing.",
          type: "VIDEO",
          videoUrl: "https://www.youtube.com/watch?v=1P1zW7jG2E0", // Placeholder
          duration: 600, // 10 minutes
          position: lessonPosition++,
          isPreview: true,
        },
        {
          title: "Content Types and Formats",
          description: "Explore blogs, videos, infographics, and eBooks.",
          type: "TEXT",
          content: `
# Content Types and Formats

1. **Blogs**:
   - Informative, SEO-friendly.
   - Example: “10 Tips for Better Sleep.”

2. **Videos**:
   - Engaging, shareable.
   - Example: Product demo on YouTube.

3. **Infographics**:
   - Visual data summaries.
   - Example: Stats on coffee consumption.

4. **eBooks**:
   - In-depth guides for lead generation.
   - Example: “Ultimate Guide to Digital Marketing.”

**Practice**:
- Choose a business and plan 3 content pieces (e.g., blog, video, infographic).
- Explain their purpose and audience in 150 words.
          `,
          duration: 600, // 10 minutes
          position: lessonPosition++,
          isPreview: true,
        },
        {
          title: "Content Creation and Distribution",
          description: "Produce and share content effectively.",
          type: "TEXT",
          content: `
# Content Creation and Distribution

1. **Creation**:
   - Use tools like Canva, Grammarly, or Adobe Premiere.
   - Example: Design an infographic in Canva.

2. **Distribution**:
   - Share via social media, email, or website.
   - Example: Promote blog via X and email newsletter.

3. **Repurposing**:
   - Turn a blog into a video or infographic.
   - Example: Convert “10 Tips” blog into a Reel.

**Practice**:
- Create a sample content piece (e.g., 200-word blog or infographic draft).
- Plan its distribution across 2 channels.
- Summarize in 150 words.
          `,
          duration: 600, // 10 minutes
          position: lessonPosition++,
          isPreview: false,
        },
        {
          title: "Assignment: Content Marketing Plan",
          description: "Develop a content marketing strategy.",
          type: "ASSIGNMENT",
          content: `
# Assignment: Content Marketing Plan

**Objective**: Create a content marketing plan.

**Requirements**:
- Choose a business and audience.
- Plan 5 content pieces (mix of formats).
- Define creation tools and distribution channels.
- Write a 300-word plan, including goals, metrics, and repurposing ideas.

**Submission**:
- Submit your plan and 1 sample content piece (draft or screenshot).
          `,
          duration: 2400, // 40 minutes
          position: lessonPosition++,
          isPreview: false,
        },
      ],
    },
    {
      title: "Email Marketing",
      description: "Build relationships with personalized email campaigns.",
      position: 7,
      lessons: [
        {
          title: "Introduction to Email Marketing",
          description: "Learn the power of email in customer engagement.",
          type: "VIDEO",
          videoUrl: "https://www.youtube.com/watch?v=1P1zW7jG2E0", // Placeholder
          duration: 600, // 10 minutes
          position: lessonPosition++,
          isPreview: true,
        },
        {
          title: "Building Email Campaigns",
          description: "Create effective email sequences.",
          type: "TEXT",
          content: `
# Building Email Campaigns

1. **Types**:
   - Welcome, promotional, newsletters.
   - Example: Welcome series for new subscribers.

2. **Components**:
   - Subject line, body, CTA.
   - Example: Subject: “Unlock 10% Off Your First Order!”

3. **Tools**:
   - Mailchimp, Constant Contact (free tiers).
   - Example: Use Mailchimp for automation.

**Practice**:
- Draft 2 email templates (e.g., welcome, promo).
- Write compelling subject lines.
- Summarize campaign goals in 150 words.
          `,
          duration: 600, // 10 minutes
          position: lessonPosition++,
          isPreview: true,
        },
        {
          title: "Segmentation and Automation",
          description: "Personalize emails with segmentation and automation.",
          type: "TEXT",
          content: `
# Segmentation and Automation

1. **Segmentation**:
   - Group subscribers by behavior, demographics.
   - Example: Segment by purchase history.

2. **Automation**:
   - Trigger emails based on actions.
   - Example: Cart abandonment email after 1 hour.

3. **Metrics**:
   - Open rate, click rate, conversion rate.

**Practice**:
- Plan 2 email segments for a business (e.g., new vs. loyal customers).
- Design a simple automation flow (e.g., welcome series).
- Summarize in 150 words.
          `,
          duration: 600, // 10 minutes
          position: lessonPosition++,
          isPreview: false,
        },
        {
          title: "Assignment: Email Marketing Campaign",
          description: "Design an email marketing campaign.",
          type: "ASSIGNMENT",
          content: `
# Assignment: Email Marketing Campaign

**Objective**: Create an email campaign.

**Requirements**:
- Choose a business and goal (e.g., drive sales).
- Design a 3-email sequence (e.g., welcome, offer, follow-up).
- Define 2 segments and 1 automation trigger.
- Write a 300-word plan, including metrics and tools.

**Submission**:
- Submit your email templates, plan, and automation flow.
          `,
          duration: 2400, // 40 minutes
          position: lessonPosition++,
          isPreview: false,
        },
      ],
    },
    {
      title: "Analytics and Performance Tracking",
      description: "Measure and optimize marketing performance.",
      position: 8,
      lessons: [
        {
          title: "Introduction to Marketing Analytics",
          description: "Learn key metrics for digital marketing.",
          type: "VIDEO",
          videoUrl: "https://www.youtube.com/watch?v=1P1zW7jG2E0", // Placeholder
          duration: 600, // 10 minutes
          position: lessonPosition++,
          isPreview: true,
        },
        {
          title: "Google Analytics Basics",
          description: "Track website performance with Google Analytics.",
          type: "TEXT",
          content: `
# Google Analytics Basics

1. **Setup**:
   - Create a free Google Analytics account.
   - Add tracking code to website.

2. **Key Metrics**:
   - Sessions, bounce rate, conversion rate.
   - Example: Bounce rate > 70% indicates poor engagement.

3. **Reports**:
   - Audience, acquisition, behavior.
   - Example: Acquisition shows traffic from social vs. organic.

**Practice**:
- Explore Google Analytics demo account.
- Identify 3 insights from acquisition report.
- Summarize in 150 words.
          `,
          duration: 600, // 10 minutes
          position: lessonPosition++,
          isPreview: true,
        },
        {
          title: "Advanced Analytics Techniques",
          description: "Use goals, funnels, and attribution models.",
          type: "TEXT",
          content: `
# Advanced Analytics Techniques

1. **Goals**:
   - Track conversions (e.g., purchases).
   - Example: Set a goal for form submissions.

2. **Funnels**:
   - Analyze user journeys.
   - Example: Checkout funnel to identify drop-offs.

3. **Attribution Models**:
   - Assign credit to channels.
   - Example: Last-click vs. multi-touch attribution.

**Practice**:
- Set up a mock goal in Google Analytics.
- Plan a funnel for an e-commerce site.
- Explain attribution in 150 words.
          `,
          duration: 600, // 10 minutes
          position: lessonPosition++,
          isPreview: false,
        },
        {
          title: "Assignment: Analytics Report",
          description: "Analyze marketing performance data.",
          type: "ASSIGNMENT",
          content: `
# Assignment: Analytics Report

**Objective**: Create a performance report.

**Requirements**:
- Use a sample dataset or Google Analytics demo.
- Analyze 5 metrics (e.g., sessions, conversions).
- Identify 1 funnel or goal issue.
- Write a 300-word report with insights and 3 optimization suggestions.

**Submission**:
- Submit your report and data screenshots.
          `,
          duration: 2400, // 40 minutes
          position: lessonPosition++,
          isPreview: false,
        },
      ],
    },
    {
      title: "Conversion Rate Optimization (CRO)",
      description: "Improve website conversions through optimization.",
      position: 9,
      lessons: [
        {
          title: "Introduction to CRO",
          description: "Learn how to increase conversions on websites.",
          type: "VIDEO",
          videoUrl: "https://www.youtube.com/watch?v=1P1zW7jG2E0", // Placeholder
          duration: 600, // 10 minutes
          position: lessonPosition++,
          isPreview: true,
        },
        {
          title: "A/B Testing for CRO",
          description: "Test website elements to boost conversions.",
          type: "TEXT",
          content: `
# A/B Testing for CRO

**Purpose**:
- Compare two versions to improve conversions.
- Example: Test “Buy Now” vs. “Shop Now” button.

**Steps**:
1. Identify element (e.g., CTA, headline).
2. Create variations.
3. Run test using tools like Google Optimize.
4. Analyze results (e.g., conversion rate).

**Metrics**:
- Conversion rate, statistical significance.

**Practice**:
- Plan an A/B test for a website (e.g., button color).
- Define hypothesis and metrics.
- Summarize in 150 words.
          `,
          duration: 600, // 10 minutes
          position: lessonPosition++,
          isPreview: true,
        },
        {
          title: "Landing Page Optimization",
          description: "Design high-converting landing pages.",
          type: "TEXT",
          content: `
# Landing Page Optimization

1. **Key Elements**:
   - Clear headline, strong CTA, minimal distractions.
   - Example: “Get 20% Off Today – Sign Up Now!”

2. **Design Principles**:
   - Fast load times, mobile-friendly.
   - Example: Use compressed images.

3. **Trust Signals**:
   - Testimonials, trust badges.
   - Example: “Rated 5 Stars by 1,000 Customers.”

**Practice**:
- Critique a landing page using a free tool (e.g., PageSpeed Insights).
- Suggest 3 improvements.
- Summarize in 150 words.
          `,
          duration: 600, // 10 minutes
          position: lessonPosition++,
          isPreview: false,
        },
        {
          title: "Assignment: CRO Plan",
          description: "Develop a CRO strategy for a website.",
          type: "ASSIGNMENT",
          content: `
# Assignment: CRO Plan

**Objective**: Create a CRO strategy.

**Requirements**:
- Choose a website or mock landing page.
- Plan 2 A/B tests (e.g., CTA, headline).
- Suggest 3 landing page improvements.
- Write a 300-word plan, including goals, tests, and metrics.

**Submission**:
- Submit your CRO plan and mockup (if applicable).
          `,
          duration: 2400, // 40 minutes
          position: lessonPosition++,
          isPreview: false,
        },
      ],
    },
    {
      title: "Influencer and Affiliate Marketing",
      description: "Leverage influencers and affiliates to expand reach.",
      position: 10,
      lessons: [
        {
          title: "Introduction to Influencer Marketing",
          description: "Learn how influencers drive brand awareness.",
          type: "VIDEO",
          videoUrl: "https://www.youtube.com/watch?v=1P1zW7jG2E0", // Placeholder
          duration: 600, // 10 minutes
          position: lessonPosition++,
          isPreview: true,
        },
        {
          title: "Finding and Working with Influencers",
          description: "Identify and collaborate with influencers.",
          type: "TEXT",
          content: `
# Finding and Working with Influencers

1. **Finding Influencers**:
   - Use platforms like Upfluence, AspireIQ.
   - Example: Search Instagram for fitness influencers.

2. **Collaboration**:
   - Define goals, deliverables, compensation.
   - Example: Sponsored post for $500.

3. **Metrics**:
   - Engagement rate, referral traffic.

**Practice**:
- Find 3 influencers for a niche (e.g., beauty).
- Draft a collaboration pitch.
- Summarize strategy in 150 words.
          `,
          duration: 600, // 10 minutes
          position: lessonPosition++,
          isPreview: true,
        },
        {
          title: "Affiliate Marketing Basics",
          description: "Set up an affiliate marketing program.",
          type: "TEXT",
          content: `
# Affiliate Marketing Basics

1. **Overview**:
   - Partners promote products for commissions.
   - Example: Amazon Associates.

2. **Setup**:
   - Use platforms like ShareASale, CJ Affiliate.
   - Example: Offer 10% commission per sale.

3. **Tracking**:
   - Use affiliate links and cookies.
   - Example: Track clicks via platform dashboard.

**Practice**:
- Explore a free affiliate platform (e.g., Amazon Associates).
- Plan a mock affiliate program.
- Summarize in 150 words.
          `,
          duration: 600, // 10 minutes
          position: lessonPosition++,
          isPreview: false,
        },
        {
          title: "Assignment: Influencer and Affiliate Plan",
          description: "Create a combined influencer and affiliate strategy.",
          type: "ASSIGNMENT",
          content: `
# Assignment: Influencer and Affiliate Plan

**Objective**: Develop a dual marketing strategy.

**Requirements**:
- Choose a business and niche.
- Identify 3 influencers and plan a collaboration.
- Design an affiliate program (commission, platform).
- Write a 300-word plan, including goals and metrics.

**Submission**:
- Submit your plan and collaboration pitch.
          `,
          duration: 2400, // 40 minutes
          position: lessonPosition++,
          isPreview: false,
        },
      ],
    },
    {
      title: "Mobile and Emerging Channels",
      description: "Explore mobile marketing and new platforms.",
      position: 11,
      lessons: [
        {
          title: "Introduction to Mobile Marketing",
          description: "Learn the importance of mobile in digital marketing.",
          type: "VIDEO",
          videoUrl: "https://www.youtube.com/watch?v=1P1zW7jG2E0", // Placeholder
          duration: 600, // 10 minutes
          position: lessonPosition++,
          isPreview: true,
        },
        {
          title: "Mobile Apps and SMS Marketing",
          description: "Use apps and SMS for customer engagement.",
          type: "TEXT",
          content: `
# Mobile Apps and SMS Marketing

1. **Mobile Apps**:
   - Drive loyalty with branded apps.
   - Example: Starbucks app for orders and rewards.

2. **SMS Marketing**:
   - Send promotions via text.
   - Example: “20% Off Today Only! Reply STOP to opt out.”

3. **Best Practices**:
   - Keep messages short, get consent.
   - Example: Limit SMS to 160 characters.

**Practice**:
- Draft 2 SMS marketing messages.
- Plan a mobile app feature for a business.
- Summarize in 150 words.
          `,
          duration: 600, // 10 minutes
          position: lessonPosition++,
          isPreview: true,
        },
        {
          title: "Emerging Channels",
          description: "Explore TikTok, AR, and voice search marketing.",
          type: "TEXT",
          content: `
# Emerging Channels

1. **TikTok**:
   - Short-form video for Gen Z.
   - Example: Viral dance challenge for a brand.

2. **Augmented Reality (AR)**:
   - Interactive experiences.
   - Example: Try-on makeup via AR filter.

3. **Voice Search**:
   - Optimize for Alexa, Siri.
   - Example: FAQ content for “near me” searches.

**Practice**:
- Create a TikTok content idea for a business.
- Plan an AR or voice search strategy.
- Summarize in 150 words.
          `,
          duration: 600, // 10 minutes
          position: lessonPosition++,
          isPreview: false,
        },
        {
          title: "Assignment: Mobile Marketing Plan",
          description: "Design a mobile and emerging channel strategy.",
          type: "ASSIGNMENT",
          content: `
# Assignment: Mobile Marketing Plan

**Objective**: Create a mobile marketing strategy.

**Requirements**:
- Choose a business.
- Plan 3 mobile tactics (e.g., SMS, app feature, TikTok).
- Include 1 emerging channel (e.g., AR, voice).
- Write a 300-word plan, including goals and metrics.

**Submission**:
- Submit your plan and sample content (e.g., SMS text).
          `,
          duration: 2400, // 40 minutes
          position: lessonPosition++,
          isPreview: false,
        },
      ],
    },
    {
      title: "Capstone: Digital Marketing Campaign",
      description: "Develop a comprehensive digital marketing campaign.",
      position: 12,
      lessons: [
        {
          title: "Planning a Digital Campaign",
          description: "Learn how to structure a full marketing campaign.",
          type: "VIDEO",
          videoUrl: "https://www.youtube.com/watch?v=1P1zW7jG2E0", // Placeholder
          duration: 600, // 10 minutes
          position: lessonPosition++,
          isPreview: true,
        },
        {
          title: "Campaign Execution",
          description: "Execute a multi-channel marketing campaign.",
          type: "TEXT",
          content: `
# Campaign Execution

**Steps**:
1. **Define Goals**:
   - Example: Increase sales by 15% in 3 months.
2. **Select Channels**:
   - SEO, PPC, social, email.
   - Example: Run Google Ads and Instagram posts.
3. **Create Content**:
   - Ads, posts, emails.
   - Example: Video ad for YouTube.
4. **Track Metrics**:
   - Use Google Analytics, platform dashboards.

**Practice**:
- Choose a business and define 2 campaign goals.
- Plan content for 2 channels.
- Summarize execution plan in 150 words.
          `,
          duration: 600, // 10 minutes
          position: lessonPosition++,
          isPreview: true,
        },
        {
          title: "Optimization and Reporting",
          description: "Analyze and optimize campaign performance.",
          type: "TEXT",
          content: `
# Optimization and Reporting

1. **Optimization**:
   - Adjust based on data.
   - Example: Increase budget for high-ROI channel.

2. **Reporting**:
   - Summarize metrics and insights.
   - Example: Report showing 10% conversion increase.

3. **Tools**:
   - Google Analytics, HubSpot, platform analytics.

**Practice**:
- Analyze sample campaign data (e.g., from Google Analytics demo).
- Suggest 2 optimizations.
- Draft a 5-slide report outline and summarize in 150 words.
          `,
          duration: 600, // 10 minutes
          position: lessonPosition++,
          isPreview: false,
        },
        {
          title: "Final Project: Digital Marketing Campaign",
          description: "Create and present a full digital marketing campaign.",
          type: "ASSIGNMENT",
          content: `
# Final Project: Digital Marketing Campaign

**Objective**: Develop a comprehensive campaign.

**Requirements**:
- Choose a business and define 3 SMART goals.
- Select 4 channels (e.g., SEO, PPC, social, email).
- Create content samples (e.g., ad copy, post, email).
- Plan budget, timeline, and metrics.
- Develop a 5–7 slide presentation with strategy, content, and expected outcomes.
- Write a 400-word reflection on your campaign and learnings.

**Submission**:
- Submit your plan, content samples, presentation, and reflection.
          `,
          duration: 10800, // 180 minutes (3 hours)
          position: lessonPosition++,
          isPreview: false,
        },
        {
          title: "Quiz: Campaign Management",
          description:
            "Test your knowledge of campaign planning and optimization.",
          type: "QUIZ",
          content: `
# Quiz: Campaign Management

**Instructions**: Answer the following questions.

1. **What is a SMART goal component?**
   - A) Vague
   - B) Time-bound
   - C) Unmeasurable
   - D) Irrelevant
   - **Answer**: B

2. **Why optimize a campaign?**
   - A) Increase costs
   - B) Improve ROI
   - C) Reduce metrics
   - D) Limit channels
   - **Answer**: B

3. **What should a campaign report include?**
   - **Answer**: Metrics, insights, and optimization recommendations.
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
