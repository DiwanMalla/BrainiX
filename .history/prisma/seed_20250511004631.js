import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Starting seed process for Business Analytics Fundamentals...");

  // Fetch the Business Analytics Fundamentals course
  const course = await prisma.course.findUnique({
    where: { slug: "business-analytics-fundamentals" },
  });

  if (!course) {
    console.error(
      "Course with slug 'business-analytics-fundamentals' not found."
    );
    throw new Error("Course not found");
  }

  console.log(`Found course: ${course.title}`);

  let lessonPosition = 1; // Track lesson position across modules
  const modulesData = [
    {
      title: "Introduction to Business Analytics",
      description:
        "Understand the role of analytics in transforming business decisions.",
      position: 1,
      lessons: [
        {
          title: "What is Business Analytics?",
          description:
            "Learn the definition, scope, and impact of business analytics.",
          type: "VIDEO",
          videoUrl: "https://www.youtube.com/watch?v=5jZ7H8C6k1o", // Placeholder
          duration: 420, // 7 minutes
          position: lessonPosition++,
          isPreview: true,
        },
        {
          title: "Types of Analytics",
          description:
            "Explore descriptive, predictive, and prescriptive analytics.",
          type: "TEXT",
          content: `
# Types of Analytics

Business analytics drives decisions through three main types:

1. **Descriptive Analytics**:
   - Analyzes historical data to understand past performance.
   - Example: A report showing last year’s sales by region.
   - Tools: Excel, Tableau.

2. **Predictive Analytics**:
   - Forecasts future trends using statistical models.
   - Example: Predicting customer churn based on purchase history.
   - Tools: Python, R.

3. **Prescriptive Analytics**:
   - Recommends actions to optimize outcomes.
   - Example: Suggesting price reductions to boost sales.
   - Tools: Power BI, optimization software.

**Practice**:
- Identify one example of each analytics type in a business you know (e.g., retail, healthcare).
- Write a 150-word explanation of how these analytics types complement each other in decision-making.
          `,
          duration: 600, // 10 minutes
          position: lessonPosition++,
          isPreview: true,
        },
        {
          title: "Business Analytics in Action",
          description: "Discover real-world applications across industries.",
          type: "TEXT",
          content: `
# Business Analytics in Action

Analytics transforms industries:

1. **Retail**:
   - Optimizes inventory and pricing.
   - Example: Amazon uses analytics to recommend products.

2. **Finance**:
   - Detects fraud and manages risk.
   - Example: Credit card companies flag suspicious transactions.

3. **Healthcare**:
   - Improves patient care and resource allocation.
   - Example: Hospitals predict patient readmissions.

4. **Marketing**:
   - Targets campaigns effectively.
   - Example: Netflix analyzes viewing habits for ads.

**Practice**:
- Choose an industry and list 3 specific analytics applications.
- Research a case study (e.g., via Google or X posts) and summarize it in 100 words.
          `,
          duration: 600, // 10 minutes
          position: lessonPosition++,
          isPreview: true,
        },
        {
          title: "Quiz: Analytics Foundations",
          description: "Test your understanding of business analytics basics.",
          type: "QUIZ",
          content: `
# Quiz: Analytics Foundations

**Instructions**: Answer the following questions.

1. **What is the primary focus of descriptive analytics?**
   - A) Forecasting future trends
   - B) Recommending actions
   - C) Analyzing past data
   - D) Real-time monitoring
   - **Answer**: C

2. **Which industry uses analytics to optimize inventory?**
   - A) Retail
   - B) Education
   - C) Construction
   - D) Tourism
   - **Answer**: A

3. **What does prescriptive analytics provide?**
   - **Answer**: Actionable recommendations based on data analysis.
          `,
          duration: 300, // 5 minutes
          position: lessonPosition++,
          isPreview: false,
        },
        {
          title: "Assignment: Analytics Use Case",
          description:
            "Analyze a business analytics application in a chosen industry.",
          type: "ASSIGNMENT",
          content: `
# Assignment: Analytics Use Case

**Objective**: Explore a real-world application of business analytics.

**Requirements**:
- Select an industry (e.g., retail, finance, healthcare).
- Identify a specific analytics use case (e.g., demand forecasting).
- Research how analytics is applied (use web or X posts for insights).
- Write a 250-word report describing the use case, tools used, and business impact.
- Include one example of data that could be analyzed.

**Submission**:
- Submit your report as a PDF or text file.
          `,
          duration: 1800, // 30 minutes
          position: lessonPosition++,
          isPreview: false,
        },
      ],
    },
    {
      title: "Data Collection and Management",
      description:
        "Master the process of collecting, storing, and managing data.",
      position: 2,
      lessons: [
        {
          title: "Introduction to Data Collection",
          description: "Learn data sources and methods for business analytics.",
          type: "VIDEO",
          videoUrl: "https://www.youtube.com/watch?v=0XgVhs5wL9Y", // Placeholder
          duration: 600, // 10 minutes
          position: lessonPosition++,
          isPreview: true,
        },
        {
          title: "Data Sources and Types",
          description:
            "Understand internal, external, structured, and unstructured data.",
          type: "TEXT",
          content: `
# Data Sources and Types

1. **Internal Data**:
   - Generated within the organization.
   - Example: Sales records, CRM data, employee performance metrics.

2. **External Data**:
   - Sourced from outside.
   - Example: Market trends, social media sentiment, government datasets.

3. **Structured Data**:
   - Organized in tables (e.g., databases).
   - Example: Customer IDs and purchase amounts.

4. **Unstructured Data**:
   - Lacks predefined format (e.g., text, images).
   - Example: Customer reviews, emails.

**Practice**:
- List 2 internal and 2 external data sources for a retail business.
- Classify 5 data points (e.g., sales, tweets) as structured or unstructured.
- Write a 100-word summary of challenges in collecting external data.
          `,
          duration: 600, // 10 minutes
          position: lessonPosition++,
          isPreview: true,
        },
        {
          title: "Data Quality and Cleaning",
          description: "Ensure data accuracy through cleaning and validation.",
          type: "TEXT",
          content: `
# Data Quality and Cleaning

**Data Quality Issues**:
1. **Missing Values**:
   - Example: Blank entries in a customer age column.
   - Fix: Impute with mean/median or remove rows.

2. **Duplicates**:
   - Example: Repeated customer records.
   - Fix: Remove duplicates using Excel or Python.

3. **Outliers**:
   - Example: A $10,000 sale in a $100 average dataset.
   - Fix: Investigate and decide to keep or exclude.

**Cleaning Tools**:
- Excel: Remove duplicates, fill missing values.
- Python: Use pandas for advanced cleaning.

**Practice**:
- Download a sample dataset (e.g., from Kaggle).
- Identify and fix 3 quality issues (e.g., missing values, outliers).
- Document your cleaning steps in a 150-word summary.
          `,
          duration: 600, // 10 minutes
          position: lessonPosition++,
          isPreview: false,
        },
        {
          title: "Data Storage and Management",
          description: "Learn about databases and data warehousing.",
          type: "TEXT",
          content: `
# Data Storage and Management

1. **Databases**:
   - Store structured data.
   - Example: MySQL for customer data.

2. **Data Warehouses**:
   - Centralize large datasets for analysis.
   - Example: Amazon Redshift for business-wide analytics.

3. **Cloud Storage**:
   - Scalable and accessible.
   - Example: Google BigQuery for big data.

**Best Practices**:
- Ensure data security (e.g., encryption).
- Maintain metadata for traceability.

**Practice**:
- Explore a free database tool (e.g., SQLite).
- Create a simple table for sales data.
- Write a 100-word explanation of why data warehouses are useful.
          `,
          duration: 600, // 10 minutes
          position: lessonPosition++,
          isPreview: false,
        },
        {
          title: "Assignment: Data Pipeline",
          description: "Design and clean a dataset for analytics.",
          type: "ASSIGNMENT",
          content: `
# Assignment: Data Pipeline

**Objective**: Build a data collection and cleaning pipeline.

**Requirements**:
- Source a dataset (e.g., open-source from Kaggle or data.gov).
- Identify 4 data quality issues (e.g., missing values, duplicates).
- Clean the dataset using Excel or Python (document steps).
- Design a storage plan (e.g., database or cloud).
- Write a 300-word report on your pipeline, including challenges and solutions.

**Submission**:
- Submit the original and cleaned datasets, cleaning script (if applicable), and report.
          `,
          duration: 2400, // 40 minutes
          position: lessonPosition++,
          isPreview: false,
        },
      ],
    },
    {
      title: "Statistical Foundations for Analytics",
      description: "Build a strong statistical foundation for data analysis.",
      position: 3,
      lessons: [
        {
          title: "Introduction to Statistics",
          description:
            "Learn core statistical concepts for business analytics.",
          type: "VIDEO",
          videoUrl: "https://www.youtube.com/watch?v=uhxtUt_-GyM", // Placeholder
          duration: 600, // 10 minutes
          position: lessonPosition++,
          isPreview: true,
        },
        {
          title: "Descriptive Statistics",
          description:
            "Understand measures of central tendency and dispersion.",
          type: "TEXT",
          content: `
# Descriptive Statistics

1. **Mean**:
   - Average of a dataset.
   - Example: Mean sales = $500 for [400, 500, 600].

2. **Median**:
   - Middle value when ordered.
   - Example: Median of [100, 200, 300] = 200.

3. **Mode**:
   - Most frequent value.
   - Example: Mode of [1, 2, 2, 3] = 2.

4. **Standard Deviation**:
   - Measures data spread.
   - Example: SD = 50 for sales indicates moderate variability.

**Practice**:
- Calculate mean, median, mode, and SD for a dataset of 10 sales values.
- Use Excel or a calculator.
- Write a 150-word interpretation of your results in a business context.
          `,
          duration: 600, // 10 minutes
          position: lessonPosition++,
          isPreview: true,
        },
        {
          title: "Probability and Distributions",
          description: "Learn probability and statistical distributions.",
          type: "TEXT",
          content: `
# Probability and Distributions

1. **Probability**:
   - Measures likelihood of events.
   - Example: 20% chance a customer buys after a demo.

2. **Conditional Probability**:
   - Probability given another event.
   - Example: P(Buy | Visited Website) = 30%.

3. **Normal Distribution**:
   - Bell-shaped curve for continuous data.
   - Example: Sales data often follows a normal distribution.

4. **Binomial Distribution**:
   - For binary outcomes (success/failure).
   - Example: Number of customers who buy out of 10.

**Practice**:
- Calculate the probability of 3 customers buying out of 10 (assume 20% buy rate).
- Sketch a normal distribution and label mean/SD.
- Write a 100-word explanation of why normal distributions matter in analytics.
          `,
          duration: 600, // 10 minutes
          position: lessonPosition++,
          isPreview: false,
        },
        {
          title: "Hypothesis Testing",
          description:
            "Use hypothesis testing to validate business assumptions.",
          type: "TEXT",
          content: `
# Hypothesis Testing

1. **Null Hypothesis (H0)**:
   - Assumes no effect.
   - Example: New campaign has no impact on sales.

2. **Alternative Hypothesis (H1)**:
   - Assumes an effect.
   - Example: Campaign increases sales.

3. **P-Value**:
   - Measures evidence against H0.
   - Example: P < 0.05 rejects H0 (significant result).

**Steps**:
- Define H0 and H1.
- Calculate test statistic (e.g., t-test).
- Interpret p-value.

**Practice**:
- Formulate H0 and H1 for a marketing campaign’s impact.
- Use Excel to perform a t-test on sample data.
- Summarize results in 150 words.
          `,
          duration: 600, // 10 minutes
          position: lessonPosition++,
          isPreview: false,
        },
        {
          title: "Assignment: Statistical Analysis",
          description: "Conduct a statistical analysis on a business dataset.",
          type: "ASSIGNMENT",
          content: `
# Assignment: Statistical Analysis

**Objective**: Apply statistical methods to a business problem.

**Requirements**:
- Select a dataset (e.g., sales, customer feedback).
- Calculate descriptive statistics (mean, median, SD).
- Perform one hypothesis test (e.g., t-test on sales pre/post-campaign).
- Use Excel or Python for calculations.
- Write a 300-word report interpreting results and business implications.

**Submission**:
- Submit your dataset, calculations, and report.
          `,
          duration: 2400, // 40 minutes
          position: lessonPosition++,
          isPreview: false,
        },
      ],
    },
    {
      title: "Data Visualization Techniques",
      description: "Create compelling visualizations to communicate insights.",
      position: 4,
      lessons: [
        {
          title: "Why Data Visualization Matters",
          description: "Understand the role of visualization in analytics.",
          type: "VIDEO",
          videoUrl: "https://www.youtube.com/watch?v=ubTJI_UphT4", // Placeholder
          duration: 600, // 10 minutes
          position: lessonPosition++,
          isPreview: true,
        },
        {
          title: "Choosing the Right Chart",
          description: "Learn chart types and when to use them.",
          type: "TEXT",
          content: `
# Choosing the Right Chart

1. **Bar Chart**:
   - Compare categories.
   - Example: Sales by product.

2. **Line Chart**:
   - Show trends over time.
   - Example: Monthly revenue growth.

3. **Pie Chart**:
   - Display proportions.
   - Example: Market share by brand (use sparingly).

4. **Scatter Plot**:
   - Show relationships.
   - Example: Sales vs. advertising spend.

**Best Practices**:
- Avoid clutter, use clear labels.
- Choose colors for accessibility (e.g., colorblind-friendly).

**Practice**:
- Create 2 charts (bar and line) for a sample dataset in Excel.
- Write a 150-word explanation of your chart choices and their business value.
          `,
          duration: 600, // 10 minutes
          position: lessonPosition++,
          isPreview: true,
        },
        {
          title: "Design Principles for Visualization",
          description: "Apply design principles to enhance clarity.",
          type: "TEXT",
          content: `
# Design Principles for Visualization

1. **Clarity**:
   - Simplify visuals to focus on key insights.
   - Example: Remove unnecessary gridlines.

2. **Consistency**:
   - Use uniform colors and fonts.
   - Example: Same color for “sales” across charts.

3. **Storytelling**:
   - Guide viewers through data.
   - Example: Highlight a sales spike with annotations.

**Tools**:
- Excel, Tableau, Power BI.
- Free tools: Google Data Studio.

**Practice**:
- Redesign a cluttered chart from a sample dataset.
- Apply 2 design principles (e.g., clarity, storytelling).
- Summarize changes in 100 words.
          `,
          duration: 600, // 10 minutes
          position: lessonPosition++,
          isPreview: false,
        },
        {
          title: "Assignment: Visualization Portfolio",
          description: "Create a set of visualizations for a dataset.",
          type: "ASSIGNMENT",
          content: `
# Assignment: Visualization Portfolio

**Objective**: Build a portfolio of data visualizations.

**Requirements**:
- Select a dataset (e.g., sales, marketing metrics).
- Create 4 visualizations (e.g., bar, line, scatter, pie) using Excel or Tableau.
- Apply design principles (clarity, consistency).
- Write a 300-word report explaining each visualization’s purpose and insights.
- Ensure accessibility (e.g., color choices).

**Submission**:
- Submit your visualizations (screenshots or files) and report.
          `,
          duration: 2400, // 40 minutes
          position: lessonPosition++,
          isPreview: false,
        },
      ],
    },
    {
      title: "Excel for Business Analytics",
      description: "Leverage Excel as a powerful analytics tool.",
      position: 5,
      lessons: [
        {
          title: "Excel for Analytics Overview",
          description: "Learn how Excel supports business analytics.",
          type: "VIDEO",
          videoUrl: "https://www.youtube.com/watch?v=3F2W14rkE5k", // Placeholder
          duration: 600, // 10 minutes
          position: lessonPosition++,
          isPreview: true,
        },
        {
          title: "Essential Excel Functions",
          description: "Master functions for data analysis.",
          type: "TEXT",
          content: `
# Essential Excel Functions

1. **VLOOKUP**:
   - Looks up values in a table.
   - Example: Find a customer’s order by ID.

2. **IF**:
   - Applies conditional logic.
   - Example: \`=IF(A1>1000, "High", "Low")\` for sales.

3. **SUMIF/COUNTIF**:
   - Aggregates based on criteria.
   - Example: \`=SUMIF(Region, "West", Sales)\` sums West region sales.

4. **INDEX/MATCH**:
   - Flexible lookup alternative to VLOOKUP.
   - Example: Match customer ID to name.

**Practice**:
- Use VLOOKUP and SUMIF on a sample sales dataset.
- Create a table with 3 calculated columns using IF.
- Write a 150-word summary of your calculations.
          `,
          duration: 600, // 10 minutes
          position: lessonPosition++,
          isPreview: true,
        },
        {
          title: "Pivot Tables and Charts",
          description: "Summarize and visualize data with pivot tables.",
          type: "TEXT",
          content: `
# Pivot Tables and Charts

**Pivot Tables**:
- Summarize large datasets.
- Example: Group sales by region and month.
- Steps:
  1. Select data, insert pivot table.
  2. Drag fields to rows/columns/values.
  3. Filter or sort as needed.

**Pivot Charts**:
- Visualize pivot table data.
- Example: Bar chart of sales by product.

**Practice**:
- Create a pivot table for a sales dataset (e.g., total sales by category).
- Add a pivot chart (e.g., line chart for trends).
- Document your process in a 100-word summary.
          `,
          duration: 600, // 10 minutes
          position: lessonPosition++,
          isPreview: false,
        },
        {
          title: "Data Analysis ToolPak",
          description: "Use Excel’s ToolPak for advanced analysis.",
          type: "TEXT",
          content: `
# Data Analysis ToolPak

**Overview**:
- Excel add-in for statistical analysis.
- Includes regression, correlation, histograms.

**Key Features**:
1. **Regression**:
   - Analyzes relationships between variables.
   - Example: Sales vs. ad spend.

2. **Descriptive Statistics**:
   - Generates mean, SD, etc.
   - Example: Summarize customer age data.

**Setup**:
- Enable via File > Options > Add-ins.

**Practice**:
- Enable ToolPak and run a regression on a sample dataset.
- Generate descriptive statistics for 2 variables.
- Summarize findings in 150 words.
          `,
          duration: 600, // 10 minutes
          position: lessonPosition++,
          isPreview: false,
        },
        {
          title: "Assignment: Excel Dashboard",
          description: "Build an Excel dashboard for business insights.",
          type: "ASSIGNMENT",
          content: `
# Assignment: Excel Dashboard

**Objective**: Create an interactive Excel dashboard.

**Requirements**:
- Use a dataset (e.g., sales, inventory).
- Apply 4 functions (e.g., VLOOKUP, SUMIF, IF, INDEX).
- Create 2 pivot tables and 2 pivot charts.
- Build a dashboard with slicers for interactivity.
- Write a 300-word report on your dashboard’s insights and design.

**Submission**:
- Submit your Excel file and report.
          `,
          duration: 2400, // 40 minutes
          position: lessonPosition++,
          isPreview: false,
        },
      ],
    },
    {
      title: "SQL for Data Analysis",
      description: "Query databases to extract business insights.",
      position: 6,
      lessons: [
        {
          title: "Introduction to SQL",
          description: "Learn SQL fundamentals for analytics.",
          type: "VIDEO",
          videoUrl: "https://www.youtube.com/watch?v=7S_tz1z_5bA", // Placeholder
          duration: 600, // 10 minutes
          position: lessonPosition++,
          isPreview: true,
        },
        {
          title: "Core SQL Queries",
          description: "Write SELECT, WHERE, and JOIN queries.",
          type: "TEXT",
          content: `
# Core SQL Queries

1. **SELECT**:
   - Retrieves data.
   - Example: \`SELECT name, sales FROM customers;\`.

2. **WHERE**:
   - Filters rows.
   - Example: \`SELECT * FROM orders WHERE amount > 1000;\`.

3. **JOIN**:
   - Combines tables.
   - Example: 
     \`\`\`sql
     SELECT c.name, o.amount 
     FROM customers c 
     INNER JOIN orders o 
     ON c.id = o.customer_id;
     \`\`\`

**Practice**:
- Write 3 queries: 
  1. Select all columns from a table.
  2. Filter with WHERE.
  3. Use INNER JOIN.
- Test using a free SQL editor (e.g., SQLite Online).
- Summarize queries in 100 words.
          `,
          duration: 600, // 10 minutes
          position: lessonPosition++,
          isPreview: true,
        },
        {
          title: "Aggregations and Grouping",
          description: "Use GROUP BY and aggregate functions.",
          type: "TEXT",
          content: `
# Aggregations and Grouping

1. **Aggregate Functions**:
   - COUNT, SUM, AVG, MAX, MIN.
   - Example: \`SELECT COUNT(*) FROM orders;\`.

2. **GROUP BY**:
   - Groups data for aggregation.
   - Example: 
     \`\`\`sql
     SELECT region, SUM(sales) 
     FROM orders 
     GROUP BY region;
     \`\`\`

3. **HAVING**:
   - Filters grouped data.
   - Example: \`SELECT region, SUM(sales) FROM orders GROUP BY region HAVING SUM(sales) > 10000;\`.

**Practice**:
- Write 2 queries using GROUP BY and aggregate functions.
- Add a HAVING clause to one query.
- Test and summarize in 150 words.
          `,
          duration: 600, // 10 minutes
          position: lessonPosition++,
          isPreview: false,
        },
        {
          title: "Subqueries and CTEs",
          description: "Use subqueries and CTEs for complex analysis.",
          type: "TEXT",
          content: `
# Subqueries and CTEs

1. **Subquery**:
   - Query within a query.
   - Example: 
     \`\`\`sql
     SELECT name 
     FROM customers 
     WHERE id IN (SELECT customer_id FROM orders WHERE amount > 1000);
     \`\`\`

2. **Common Table Expression (CTE)**:
   - Temporary result set.
   - Example: 
     \`\`\`sql
     WITH HighSales AS (
       SELECT customer_id 
       FROM orders 
       WHERE amount > 1000
     )
     SELECT name 
     FROM customers 
     JOIN HighSales ON customers.id = HighSales.customer_id;
     \`\`\`

**Practice**:
- Write 1 subquery and 1 CTE for a sales database.
- Test queries and explain their purpose in 150 words.
          `,
          duration: 600, // 10 minutes
          position: lessonPosition++,
          isPreview: false,
        },
        {
          title: "Assignment: SQL Business Insights",
          description: "Query a database to answer business questions.",
          type: "ASSIGNMENT",
          content: `
# Assignment: SQL Business Insights

**Objective**: Extract insights using SQL.

**Requirements**:
- Use a sample database (e.g., Northwind, or create a simple SQLite DB).
- Write 6 SQL queries, including:
  - 2 with JOINs.
  - 2 with GROUP BY and aggregations.
  - 1 subquery or CTE.
- Answer a business question (e.g., top customers by sales).
- Write a 300-word report summarizing insights and query logic.

**Submission**:
- Submit your SQL queries, database schema (if created), and report.
          `,
          duration: 2400, // 40 minutes
          position: lessonPosition++,
          isPreview: false,
        },
      ],
    },
    {
      title: "Predictive Analytics Fundamentals",
      description: "Build predictive models to forecast business outcomes.",
      position: 7,
      lessons: [
        {
          title: "What is Predictive Analytics?",
          description: "Understand predictive modeling and its business value.",
          type: "VIDEO",
          videoUrl: "https://www.youtube.com/watch?v=FaTZTgMg7OQ", // Placeholder
          duration: 600, // 10 minutes
          position: lessonPosition++,
          isPreview: true,
        },
        {
          title: "Linear Regression",
          description: "Use linear regression for continuous predictions.",
          type: "TEXT",
          content: `
# Linear Regression

**Overview**:
- Predicts a continuous variable using independent variables.
- Example: Predict sales based on ad spend and store size.

**Key Concepts**:
1. **Equation**: y = mx + b (m = slope, b = intercept).
2. **R-squared**: Measures model fit (0–1).
   - Example: R² = 0.85 indicates a strong model.

**Implementation**:
- Excel: Use Data Analysis ToolPak.
- Python: Use scikit-learn.

**Practice**:
- Perform linear regression on a dataset (e.g., sales vs. ad spend) in Excel or Python.
- Calculate R-squared and interpret in 150 words.
          `,
          duration: 600, // 10 minutes
          position: lessonPosition++,
          isPreview: true,
        },
        {
          title: "Logistic Regression",
          description: "Use logistic regression for binary outcomes.",
          type: "TEXT",
          content: `
# Logistic Regression

**Overview**:
- Predicts binary outcomes (e.g., yes/no).
- Example: Predict if a customer will churn (1 = churn, 0 = stay).

**Key Metrics**:
1. **Accuracy**: % of correct predictions.
2. **Confusion Matrix**: True positives, false negatives, etc.

**Implementation**:
- Excel: Limited support; use Python.
- Python: scikit-learn’s LogisticRegression.

**Practice**:
- Build a logistic regression model for a binary outcome (e.g., churn).
- Calculate accuracy using a sample dataset.
- Summarize results in 150 words.
          `,
          duration: 600, // 10 minutes
          position: lessonPosition++,
          isPreview: false,
        },
        {
          title: "Evaluating Predictive Models",
          description: "Assess model performance with metrics.",
          type: "TEXT",
          content: `
# Evaluating Predictive Models

1. **Regression Metrics**:
   - Mean Squared Error (MSE): Measures prediction error.
   - R-squared: Model fit.

2. **Classification Metrics**:
   - Accuracy: % correct.
   - Precision/Recall: Balance false positives/negatives.
   - Example: Precision = 80% for churn prediction.

3. **Cross-Validation**:
   - Splits data to test model robustness.
   - Example: 5-fold cross-validation.

**Practice**:
- Evaluate a regression or classification model using MSE or accuracy.
- Perform cross-validation if using Python.
- Write a 150-word summary of model performance.
          `,
          duration: 600, // 10 minutes
          position: lessonPosition++,
          isPreview: false,
        },
        {
          title: "Assignment: Predictive Model",
          description: "Build and evaluate a predictive model.",
          type: "ASSIGNMENT",
          content: `
# Assignment: Predictive Model

**Objective**: Create a predictive model for a business problem.

**Requirements**:
- Choose a dataset (e.g., sales, churn, or open-source from Kaggle).
- Build a linear or logistic regression model in Excel or Python.
- Evaluate with 2 metrics (e.g., R-squared, accuracy).
- Write a 300-word report on your model, results, and business implications.
- Include visualizations of predictions.

**Submission**:
- Submit your dataset, model code (if applicable), visualizations, and report.
          `,
          duration: 3600, // 60 minutes
          position: lessonPosition++,
          isPreview: false,
        },
      ],
    },
    {
      title: "Business Intelligence with Tableau",
      description: "Use Tableau to create interactive dashboards.",
      position: 8,
      lessons: [
        {
          title: "Introduction to Tableau",
          description: "Learn Tableau’s role in business intelligence.",
          type: "VIDEO",
          videoUrl: "https://www.youtube.com/watch?v=0myzW0ZBSc0", // Placeholder
          duration: 600, // 10 minutes
          position: lessonPosition++,
          isPreview: true,
        },
        {
          title: "Tableau Visualizations",
          description: "Create charts and maps in Tableau.",
          type: "TEXT",
          content: `
# Tableau Visualizations

1. **Data Connection**:
   - Import Excel, CSV, or SQL data.
   - Example: Connect to a sales CSV.

2. **Chart Types**:
   - Bar, line, scatter, map.
   - Example: Bar chart of sales by region.

3. **Filters and Parameters**:
   - Add interactivity.
   - Example: Filter by year or region.

**Practice**:
- Download Tableau Public (free).
- Create 2 visualizations (e.g., bar and map) with a sample dataset.
- Add a filter for interactivity.
- Summarize your process in 150 words.
          `,
          duration: 600, // 10 minutes
          position: lessonPosition++,
          isPreview: true,
        },
        {
          title: "Building Dashboards",
          description: "Combine visualizations into dashboards.",
          type: "TEXT",
          content: `
# Building Dashboards

**Purpose**:
- Present multiple insights in one view.
- Example: Sales, profit, and customer trends.

**Steps**:
1. Create 3–4 visualizations.
2. Add to a dashboard layout.
3. Include filters, titles, and annotations.

**Best Practices**:
- Keep layouts clean.
- Use consistent colors.

**Practice**:
- Build a Tableau dashboard with 3 visualizations (e.g., sales by region, product trends).
- Add a filter for user interaction.
- Export as an image and summarize in 150 words.
          `,
          duration: 600, // 10 minutes
          position: lessonPosition++,
          isPreview: false,
        },
        {
          title: "Assignment: Tableau Dashboard",
          description: "Create a business intelligence dashboard.",
          type: "ASSIGNMENT",
          content: `
# Assignment: Tableau Dashboard

**Objective**: Build an interactive Tableau dashboard.

**Requirements**:
- Use a dataset (e.g., sales, marketing).
- Create a dashboard with 4 visualizations (e.g., bar, line, map).
- Include filters and at least one calculated field (e.g., profit margin).
- Write a 300-word report on your dashboard’s insights and design choices.
- Ensure accessibility (e.g., clear labels).

**Submission**:
- Submit your Tableau file (or screenshots) and report.
          `,
          duration: 3600, // 60 minutes
          position: lessonPosition++,
          isPreview: false,
        },
      ],
    },
    {
      title: "Power BI for Business Intelligence",
      description: "Use Power BI to analyze and visualize data.",
      position: 9,
      lessons: [
        {
          title: "Introduction to Power BI",
          description: "Learn Power BI’s capabilities for analytics.",
          type: "VIDEO",
          videoUrl: "https://www.youtube.com/watch?v=0myzW0ZBSc0", // Placeholder
          duration: 600, // 10 minutes
          position: lessonPosition++,
          isPreview: true,
        },
        {
          title: "Power BI Reports",
          description: "Create reports with Power BI visuals.",
          type: "TEXT",
          content: `
# Power BI Reports

1. **Data Import**:
   - Connect to Excel, SQL, or cloud sources.
   - Example: Import sales data from CSV.

2. **Visuals**:
   - Bar, line, matrix, KPI cards.
   - Example: Matrix of sales by region and product.

3. **Filters**:
   - Apply slicers for interactivity.
   - Example: Slicer for year or category.

**Practice**:
- Download Power BI Desktop (free).
- Create 2 visuals (e.g., bar and matrix) with a sample dataset.
- Add a slicer and summarize in 150 words.
          `,
          duration: 600, // 10 minutes
          position: lessonPosition++,
          isPreview: true,
        },
        {
          title: "DAX and Calculations",
          description: "Use DAX for advanced calculations.",
          type: "TEXT",
          content: `
# DAX and Calculations

**DAX (Data Analysis Expressions)**:
- Creates custom metrics.
- Example: 
  \`\`\`dax
  Total Sales = SUM(Sales[Amount])
  Profit Margin = DIVIDE([Total Sales] - SUM(Costs[Amount]), [Total Sales])
  \`\`\`

**Common Functions**:
- SUM, AVERAGE, CALCULATE.
- Example: CALCULATE filters data dynamically.

**Practice**:
- Create 2 DAX measures (e.g., total sales, profit margin) in Power BI.
- Use in a visual (e.g., KPI card).
- Summarize in 150 words.
          `,
          duration: 600, // 10 minutes
          position: lessonPosition++,
          isPreview: false,
        },
        {
          title: "Assignment: Power BI Dashboard",
          description: "Build a Power BI dashboard for insights.",
          type: "ASSIGNMENT",
          content: `
# Assignment: Power BI Dashboard

**Objective**: Create a Power BI dashboard.

**Requirements**:
- Use a dataset (e.g., sales, customer data).
- Create a dashboard with 4 visuals (e.g., bar, matrix, KPI).
- Include 2 DAX measures (e.g., total sales, growth rate).
- Add slicers for interactivity.
- Write a 300-word report on insights and design.

**Submission**:
- Submit your Power BI file (or screenshots) and report.
          `,
          duration: 3600, // 60 minutes
          position: lessonPosition++,
          isPreview: false,
        },
      ],
    },
    {
      title: "Analytics-Driven Decision Making",
      description: "Use analytics to inform strategic business decisions.",
      position: 10,
      lessons: [
        {
          title: "Introduction to Decision Making",
          description: "Learn how analytics drives better decisions.",
          type: "VIDEO",
          videoUrl: "https://www.youtube.com/watch?v=9Y1C3gqKPCs", // Placeholder
          duration: 600, // 10 minutes
          position: lessonPosition++,
          isPreview: true,
        },
        {
          title: "A/B Testing for Decisions",
          description: "Optimize outcomes with A/B testing.",
          type: "TEXT",
          content: `
# A/B Testing for Decisions

**Overview**:
- Compares two versions to find the better one.
- Example: Test two email subject lines for open rates.

**Steps**:
1. Define hypothesis (e.g., “Subject A increases opens”).
2. Split audience randomly.
3. Measure results (e.g., open rate).
4. Test for statistical significance.

**Metrics**:
- Conversion rate, p-value.
- Example: P < 0.05 confirms significance.

**Practice**:
- Design an A/B test for a website button (e.g., color change).
- Calculate conversion rates for sample data.
- Summarize in 150 words.
          `,
          duration: 600, // 10 minutes
          position: lessonPosition++,
          isPreview: true,
        },
        {
          title: "Decision Frameworks",
          description: "Use frameworks like SWOT and cost-benefit analysis.",
          type: "TEXT",
          content: `
# Decision Frameworks

1. **SWOT Analysis**:
   - Strengths, Weaknesses, Opportunities, Threats.
   - Example: Evaluate a new product launch.

2. **Cost-Benefit Analysis**:
   - Compares costs vs. benefits.
   - Example: Invest in new software if ROI > 10%.

3. **Data-Driven Frameworks**:
   - Combine analytics with frameworks.
   - Example: Use sales forecasts in SWOT.

**Practice**:
- Perform a SWOT analysis for a business decision (e.g., market expansion).
- Conduct a simple cost-benefit analysis.
- Summarize in 150 words.
          `,
          duration: 600, // 10 minutes
          position: lessonPosition++,
          isPreview: false,
        },
        {
          title: "Assignment: Decision Recommendation",
          description: "Propose a decision using analytics.",
          type: "ASSIGNMENT",
          content: `
# Assignment: Decision Recommendation

**Objective**: Recommend a business decision with analytics.

**Requirements**:
- Choose a problem (e.g., pricing, campaign launch).
- Analyze a dataset to support your decision (use Excel, SQL, or BI tools).
- Apply a decision framework (e.g., SWOT, cost-benefit).
- Create 2 visualizations to support your case.
- Write a 300-word report with your recommendation and rationale.

**Submission**:
- Submit your dataset, analysis, visualizations, and report.
          `,
          duration: 3600, // 60 minutes
          position: lessonPosition++,
          isPreview: false,
        },
      ],
    },
    {
      title: "Ethics and Privacy in Analytics",
      description: "Understand ethical considerations and data privacy.",
      position: 11,
      lessons: [
        {
          title: "Introduction to Analytics Ethics",
          description: "Learn the importance of ethics in analytics.",
          type: "VIDEO",
          videoUrl: "https://www.youtube.com/watch?v=Z8Y3CwxW7nI", // Placeholder
          duration: 600, // 10 minutes
          position: lessonPosition++,
          isPreview: true,
        },
        {
          title: "Data Privacy Regulations",
          description: "Explore GDPR, CCPA, and data protection laws.",
          type: "TEXT",
          content: `
# Data Privacy Regulations

1. **GDPR (General Data Protection Regulation)**:
   - EU law for data protection.
   - Example: Requires user consent for data collection.

2. **CCPA (California Consumer Privacy Act)**:
   - Grants California residents data rights.
   - Example: Right to opt out of data sales.

3. **Best Practices**:
   - Anonymize data, secure storage.
   - Example: Remove personally identifiable information (PII).

**Practice**:
- Research one regulation (GDPR or CCPA).
- List 3 compliance requirements for a business.
- Summarize in 150 words.
          `,
          duration: 600, // 10 minutes
          position: lessonPosition++,
          isPreview: true,
        },
        {
          title: "Ethical Decision Making",
          description: "Address ethical dilemmas in analytics.",
          type: "TEXT",
          content: `
# Ethical Decision Making

**Common Dilemmas**:
1. **Bias in Data**:
   - Example: Gender bias in hiring algorithms.
   - Fix: Audit models for fairness.

2. **Transparency**:
   - Example: Disclose how customer data is used.

3. **Misuse of Data**:
   - Example: Selling data without consent.

**Framework**:
- Assess impact on stakeholders.
- Ensure fairness and transparency.

**Practice**:
- Analyze a hypothetical dilemma (e.g., biased model).
- Propose 3 solutions to address it.
- Summarize in 150 words.
          `,
          duration: 600, // 10 minutes
          position: lessonPosition++,
          isPreview: false,
        },
        {
          title: "Assignment: Ethics Case Study",
          description: "Analyze an ethics issue in analytics.",
          type: "ASSIGNMENT",
          content: `
# Assignment: Ethics Case Study

**Objective**: Evaluate an ethical issue in analytics.

**Requirements**:
- Research a real or hypothetical case (e.g., biased AI, data breach).
- Analyze the issue using an ethical framework.
- Propose 3 solutions to mitigate the problem.
- Write a 300-word report on the case, impact, and recommendations.
- Cite sources (web or X posts).

**Submission**:
- Submit your report and sources.
          `,
          duration: 2400, // 40 minutes
          position: lessonPosition++,
          isPreview: false,
        },
      ],
    },
    {
      title: "Capstone: Business Analytics Project",
      description: "Apply analytics to solve a real-world business problem.",
      position: 12,
      lessons: [
        {
          title: "Planning an Analytics Project",
          description:
            "Learn how to structure a comprehensive analytics project.",
          type: "VIDEO",
          videoUrl: "https://www.youtube.com/watch?v=Z8Y3CwxW7nI", // Placeholder
          duration: 600, // 10 minutes
          position: lessonPosition++,
          isPreview: true,
        },
        {
          title: "Data Collection and Analysis",
          description: "Execute data collection and analysis for a project.",
          type: "TEXT",
          content: `
# Data Collection and Analysis

**Steps**:
1. **Define Problem**:
   - Example: Reduce customer churn by 10%.
2. **Collect Data**:
   - Source internal (e.g., CRM) and external (e.g., surveys) data.
3. **Clean Data**:
   - Fix missing values, outliers.
4. **Analyze**:
   - Use descriptive stats, regression, or SQL queries.
   - Example: Logistic regression for churn prediction.

**Tools**:
- Excel, SQL, Python, Tableau.

**Practice**:
- Define a business problem and data sources.
- Collect a small dataset and clean it.
- Perform 2 analyses (e.g., mean sales, correlation).
- Summarize in 150 words.
          `,
          duration: 600, // 10 minutes
          position: lessonPosition++,
          isPreview: true,
        },
        {
          title: "Visualization and Presentation",
          description: "Present insights effectively to stakeholders.",
          type: "TEXT",
          content: `
# Visualization and Presentation

1. **Visualization**:
   - Create clear charts/dashboards.
   - Example: Tableau dashboard showing churn trends.

2. **Storytelling**:
   - Structure as problem, analysis, solution.
   - Example: “Churn increased due to X; we recommend Y.”

3. **Presentation**:
   - Use slides or reports.
   - Example: 5 slides with problem, visuals, recommendations.

**Practice**:
- Create 2 visualizations for a sample analysis.
- Draft a 5-slide presentation outline.
- Practice presenting to a peer and summarize in 150 words.
          `,
          duration: 600, // 10 minutes
          position: lessonPosition++,
          isPreview: false,
        },
        {
          title: "Final Project: Analytics Solution",
          description: "Develop a complete analytics solution.",
          type: "ASSIGNMENT",
          content: `
# Final Project: Analytics Solution

**Objective**: Solve a business problem with a full analytics workflow.

**Requirements**:
- Choose a problem (e.g., sales forecasting, customer segmentation).
- Collect and clean a dataset (open-source or mock data).
- Analyze using at least 2 methods (e.g., regression, SQL queries).
- Create a dashboard with 4 visualizations (Excel, Tableau, or Power BI).
- Develop a 5–7 slide presentation with problem, analysis, and recommendations.
- Write a 400-word reflection on your project, including challenges and learnings.

**Submission**:
- Submit your dataset, analysis files, dashboard, presentation, and reflection.
          `,
          duration: 10800, // 180 minutes (3 hours)
          position: lessonPosition++,
          isPreview: false,
        },
        {
          title: "Quiz: Analytics Projects",
          description: "Test your knowledge of analytics project workflows.",
          type: "QUIZ",
          content: `
# Quiz: Analytics Projects

**Instructions**: Answer the following questions.

1. **What is the first step in an analytics project?**
   - A) Create visualizations
   - B) Define the business problem
   - C) Collect random data
   - D) Present findings
   - **Answer**: B

2. **Why is data cleaning critical?**
   - A) It reduces data size
   - B) It ensures accurate analysis
   - C) It replaces visualization
   - D) It simplifies presentations
   - **Answer**: B

3. **What should a final project presentation include?**
   - **Answer**: Problem statement, analysis, visualizations, and recommendations.
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
