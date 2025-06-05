import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Starting seed process for SQL for Data Science...");

  // Fetch the SQL for Data Science course
  const course = await prisma.course.findUnique({
    where: { slug: "sql-data-science" },
  });

  if (!course) {
    console.error("Course with slug 'sql-data-science' not found.");
    throw new Error("Course not found");
  }

  console.log(`Found course: ${course.title}`);

  let lessonPosition = 1; // Track lesson position across modules
  const modulesData = [
    {
      title: "Introduction to SQL for Data Science",
      description: "Understand the role of SQL in data science workflows.",
      position: 1,
      lessons: [
        {
          title: "Why SQL for Data Science?",
          description: "Learn how SQL powers data analysis and science.",
          type: "VIDEO",
          videoUrl: "https://www.youtube.com/watch?v=7S_tz1z_5bA", // Placeholder
          duration: 420, // 7 minutes
          position: lessonPosition++,
          isPreview: true,
        },
        {
          title: "SQL vs. Other Tools",
          description:
            "Compare SQL with Python, R, and Excel for data science.",
          type: "TEXT",
          content: `
# SQL vs. Other Tools

SQL is a cornerstone for data science, but how does it compare?

1. **SQL**:
   - Queries relational databases.
   - Example: Extract sales data from a MySQL database.
   - Strengths: Fast for large datasets, standardized.
   - Weaknesses: Limited to structured data.

2. **Python**:
   - General-purpose, with pandas for data analysis.
   - Example: Machine learning models.
   - Strengths: Flexible, advanced analytics.
   - Weaknesses: Slower for large database queries.

3. **R**:
   - Statistical analysis and visualization.
   - Example: Regression models.
   - Strengths: Statistical focus.
   - Weaknesses: Steeper learning curve.

4. **Excel**:
   - Simple data analysis.
   - Example: Pivot tables for sales.
   - Strengths: User-friendly.
   - Weaknesses: Limited scalability.

**Practice**:
- List 2 use cases where SQL is better than Python or Excel.
- Write a 150-word explanation of when to combine SQL with Python.
          `,
          duration: 600, // 10 minutes
          position: lessonPosition++,
          isPreview: true,
        },
        {
          title: "Setting Up Your SQL Environment",
          description: "Install and configure a SQL database for practice.",
          type: "TEXT",
          content: `
# Setting Up Your SQL Environment

1. **Choose a Database**:
   - SQLite: Lightweight, no setup.
   - PostgreSQL/MySQL: Industry-standard, free.

2. **Tools**:
   - DBeaver: Free GUI for all databases.
   - SQLite Browser: Simple for SQLite.
   - Command-line: psql for PostgreSQL.

3. **Setup Steps**:
   - Install SQLite or PostgreSQL.
   - Create a database: \`CREATE DATABASE data_science;\`
   - Import sample data (e.g., from Kaggle).

**Practice**:
- Install SQLite and DBeaver.
- Create a database and import a sample dataset (e.g., CSV from Kaggle).
- Run: \`SELECT * FROM table_name LIMIT 5;\`
- Summarize your setup process in 100 words.
          `,
          duration: 600, // 10 minutes
          position: lessonPosition++,
          isPreview: true,
        },
        {
          title: "Quiz: SQL Basics",
          description: "Test your understanding of SQL’s role in data science.",
          type: "QUIZ",
          content: `
# Quiz: SQL Basics

**Instructions**: Answer the following questions.

1. **What is SQL primarily used for in data science?**
   - A) Machine learning
   - B) Querying databases
   - C) Data visualization
   - D) Web development
   - **Answer**: B

2. **Which tool is best for querying large relational databases?**
   - A) Excel
   - B) Python
   - C) SQL
   - D) R
   - **Answer**: C

3. **What is a limitation of SQL?**
   - **Answer**: Limited to structured data analysis.
          `,
          duration: 300, // 5 minutes
          position: lessonPosition++,
          isPreview: false,
        },
      ],
    },
    {
      title: "Core SQL Queries",
      description: "Master essential SQL queries for data extraction.",
      position: 2,
      lessons: [
        {
          title: "Introduction to SQL Queries",
          description: "Learn the structure of SQL queries.",
          type: "VIDEO",
          videoUrl: "https://www.youtube.com/watch?v=9r5k3zXw1cU", // Placeholder
          duration: 600, // 10 minutes
          position: lessonPosition++,
          isPreview: true,
        },
        {
          title: "SELECT and WHERE",
          description: "Retrieve and filter data with SELECT and WHERE.",
          type: "TEXT",
          content: `
# SELECT and WHERE

1. **SELECT**:
   - Retrieves columns from a table.
   - Example: 
     \`\`\`sql
     SELECT name, sales FROM customers;
     \`\`\`

2. **WHERE**:
   - Filters rows based on conditions.
   - Example: 
     \`\`\`sql
     SELECT * FROM orders WHERE amount > 1000;
     \`\`\`

3. **Operators**:
   - \`=, >, <, !=, LIKE, IN, BETWEEN\`.
   - Example: 
     \`\`\`sql
     SELECT * FROM products WHERE price BETWEEN 10 AND 50;
     \`\`\`

**Practice**:
- Write 3 queries using SELECT and WHERE on a sample dataset.
- Use at least 2 operators (e.g., LIKE, IN).
- Test in SQLite and summarize in 150 words.
          `,
          duration: 600, // 10 minutes
          position: lessonPosition++,
          isPreview: true,
        },
        {
          title: "Sorting and Limiting",
          description: "Sort results and limit output with ORDER BY and LIMIT.",
          type: "TEXT",
          content: `
# Sorting and Limiting

1. **ORDER BY**:
   - Sorts results (ASC or DESC).
   - Example: 
     \`\`\`sql
     SELECT name, sales FROM customers ORDER BY sales DESC;
     \`\`\`

2. **LIMIT**:
   - Restricts number of rows returned.
   - Example: 
     \`\`\`sql
     SELECT * FROM orders LIMIT 10;
     \`\`\`

3. **Combining**:
   - Example: 
     \`\`\`sql
     SELECT product, price FROM products 
     WHERE category = 'Electronics' 
     ORDER BY price ASC 
     LIMIT 5;
     \`\`\`

**Practice**:
- Write 2 queries with ORDER BY and LIMIT.
- Test on a sample dataset.
- Explain sorting choices in 150 words.
          `,
          duration: 600, // 10 minutes
          position: lessonPosition++,
          isPreview: false,
        },
        {
          title: "Assignment: Query Practice",
          description: "Write queries to extract insights from a dataset.",
          type: "ASSIGNMENT",
          content: `
# Assignment: Query Practice

**Objective**: Practice core SQL queries.

**Requirements**:
- Use a sample dataset (e.g., from Kaggle or SQLite sample DB).
- Write 5 queries, including:
  - 2 with WHERE and different operators.
  - 2 with ORDER BY and LIMIT.
  - 1 combining all.
- Test queries and verify results.
- Write a 300-word report explaining your queries and insights.

**Submission**:
- Submit your SQL queries, dataset description, and report.
          `,
          duration: 2400, // 40 minutes
          position: lessonPosition++,
          isPreview: false,
        },
      ],
    },
    {
      title: "Data Manipulation with SQL",
      description: "Insert, update, and delete data in databases.",
      position: 3,
      lessons: [
        {
          title: "Introduction to Data Manipulation",
          description: "Learn how to modify database data.",
          type: "VIDEO",
          videoUrl: "https://www.youtube.com/watch?v=3e3zX9cI2F0", // Placeholder
          duration: 600, // 10 minutes
          position: lessonPosition++,
          isPreview: true,
        },
        {
          title: "INSERT and UPDATE",
          description: "Add and modify data with INSERT and UPDATE.",
          type: "TEXT",
          content: `
# INSERT and UPDATE

1. **INSERT**:
   - Adds new rows.
   - Example: 
     \`\`\`sql
     INSERT INTO customers (name, email) 
     VALUES ('Jane Doe', 'jane@example.com');
     \`\`\`

2. **UPDATE**:
   - Modifies existing rows.
   - Example: 
     \`\`\`sql
     UPDATE products 
     SET price = price * 1.1 
     WHERE category = 'Books';
     \`\`\`

3. **Best Practices**:
   - Use WHERE to avoid unintended updates.
   - Backup data before bulk changes.

**Practice**:
- Write 2 INSERT and 2 UPDATE queries for a sample table.
- Test and verify changes.
- Summarize in 150 words.
          `,
          duration: 600, // 10 minutes
          position: lessonPosition++,
          isPreview: true,
        },
        {
          title: "DELETE and TRUNCATE",
          description: "Remove data with DELETE and TRUNCATE.",
          type: "TEXT",
          content: `
# DELETE and TRUNCATE

1. **DELETE**:
   - Removes specific rows.
   - Example: 
     \`\`\`sql
     DELETE FROM orders WHERE status = 'cancelled';
     \`\`\`

2. **TRUNCATE**:
   - Removes all rows, keeps table structure.
   - Example: 
     \`\`\`sql
     TRUNCATE TABLE temp_data;
     \`\`\`

3. **Differences**:
   - DELETE is reversible (with transactions); TRUNCATE is not.
   - DELETE supports WHERE; TRUNCATE doesn’t.

**Practice**:
- Write 2 DELETE queries with WHERE.
- Test TRUNCATE on a temporary table.
- Explain differences in 150 words.
          `,
          duration: 600, // 10 minutes
          position: lessonPosition++,
          isPreview: false,
        },
        {
          title: "Assignment: Data Modification",
          description: "Modify a dataset using SQL commands.",
          type: "ASSIGNMENT",
          content: `
# Assignment: Data Modification

**Objective**: Practice data manipulation.

**Requirements**:
- Use a sample dataset.
- Write 6 queries:
  - 2 INSERT to add new records.
  - 2 UPDATE to modify data.
  - 2 DELETE to remove records.
- Ensure queries are safe (e.g., use WHERE).
- Write a 300-word report on your changes and their purpose.

**Submission**:
- Submit your queries, dataset, and report.
          `,
          duration: 2400, // 40 minutes
          position: lessonPosition++,
          isPreview: false,
        },
      ],
    },
    {
      title: "Joins and Relationships",
      description: "Combine data from multiple tables using joins.",
      position: 4,
      lessons: [
        {
          title: "Introduction to Joins",
          description: "Learn how joins connect related data.",
          type: "VIDEO",
          videoUrl: "https://www.youtube.com/watch?v=2HVMiDqlyMU", // Placeholder
          duration: 600, // 10 minutes
          position: lessonPosition++,
          isPreview: true,
        },
        {
          title: "INNER and OUTER Joins",
          description: "Use INNER, LEFT, RIGHT, and FULL joins.",
          type: "TEXT",
          content: `
# INNER and OUTER Joins

1. **INNER JOIN**:
   - Returns matching rows.
   - Example: 
     \`\`\`sql
     SELECT c.name, o.amount 
     FROM customers c 
     INNER JOIN orders o 
     ON c.id = o.customer_id;
     \`\`\`

2. **LEFT JOIN**:
   - Includes all left table rows.
   - Example: 
     \`\`\`sql
     SELECT c.name, o.amount 
     FROM customers c 
     LEFT JOIN orders o 
     ON c.id = o.customer_id;
     \`\`\`

3. **RIGHT/FULL JOIN**:
   - RIGHT: All right table rows; FULL: All rows.
   - Example: FULL JOIN for complete data merge.

**Practice**:
- Write 3 join queries (INNER, LEFT, RIGHT) on a sample dataset.
- Test and summarize results in 150 words.
          `,
          duration: 600, // 10 minutes
          position: lessonPosition++,
          isPreview: true,
        },
        {
          title: "Multi-Table Joins",
          description: "Join multiple tables for complex queries.",
          type: "TEXT",
          content: `
# Multi-Table Joins

**Purpose**:
- Combine data from 3+ tables.
- Example: Customers, orders, and products.

**Example**:
\`\`\`sql
SELECT c.name, o.order_date, p.product_name 
FROM customers c 
INNER JOIN orders o ON c.id = o.customer_id 
INNER JOIN order_items oi ON o.id = oi.order_id 
INNER JOIN products p ON oi.product_id = p.id;
\`\`\`

**Best Practices**:
- Use aliases for clarity.
- Optimize with indexes on join columns.

**Practice**:
- Write a query joining 3 tables.
- Test on a sample database.
- Explain the relationships in 150 words.
          `,
          duration: 600, // 10 minutes
          position: lessonPosition++,
          isPreview: false,
        },
        {
          title: "Assignment: Join Queries",
          description: "Write complex join queries for analysis.",
          type: "ASSIGNMENT",
          content: `
# Assignment: Join Queries

**Objective**: Combine data with joins.

**Requirements**:
- Use a sample database with 3+ tables.
- Write 5 join queries:
  - 2 INNER JOINs.
  - 2 OUTER JOINs (LEFT or RIGHT).
  - 1 multi-table join.
- Test and verify results.
- Write a 300-word report on insights and join logic.

**Submission**:
- Submit your queries, dataset schema, and report.
          `,
          duration: 2400, // 40 minutes
          position: lessonPosition++,
          isPreview: false,
        },
      ],
    },
    {
      title: "Aggregations and Grouping",
      description: "Summarize data with aggregate functions and GROUP BY.",
      position: 5,
      lessons: [
        {
          title: "Introduction to Aggregations",
          description: "Learn how to summarize data with SQL.",
          type: "VIDEO",
          videoUrl: "https://www.youtube.com/watch?v=5e3fXawSEJE", // Placeholder
          duration: 600, // 10 minutes
          position: lessonPosition++,
          isPreview: true,
        },
        {
          title: "Aggregate Functions",
          description: "Use COUNT, SUM, AVG, MAX, MIN.",
          type: "TEXT",
          content: `
# Aggregate Functions

1. **COUNT**:
   - Counts rows.
   - Example: 
     \`\`\`sql
     SELECT COUNT(*) FROM orders;
     \`\`\`

2. **SUM/AVG**:
   - Calculates total or average.
   - Example: 
     \`\`\`sql
     SELECT SUM(amount), AVG(amount) FROM orders;
     \`\`\`

3. **MAX/MIN**:
   - Finds highest/lowest values.
   - Example: 
     \`\`\`sql
     SELECT MAX(salary) FROM employees;
     \`\`\`

**Practice**:
- Write 3 queries using different aggregate functions.
- Test on a sample dataset.
- Summarize insights in 150 words.
          `,
          duration: 600, // 10 minutes
          position: lessonPosition++,
          isPreview: true,
        },
        {
          title: "GROUP BY and HAVING",
          description: "Group data and filter aggregates.",
          type: "TEXT",
          content: `
# GROUP BY and HAVING

1. **GROUP BY**:
   - Groups rows for aggregation.
   - Example: 
     \`\`\`sql
     SELECT region, SUM(sales) 
     FROM orders 
     GROUP BY region;
     \`\`\`

2. **HAVING**:
   - Filters grouped results.
   - Example: 
     \`\`\`sql
     SELECT department, AVG(salary) 
     FROM employees 
     GROUP BY department 
     HAVING AVG(salary) > 50000;
     \`\`\`

**Practice**:
- Write 2 queries with GROUP BY and 1 with HAVING.
- Test and explain results in 150 words.
          `,
          duration: 600, // 10 minutes
          position: lessonPosition++,
          isPreview: false,
        },
        {
          title: "Assignment: Aggregation Analysis",
          description: "Analyze data with aggregations.",
          type: "ASSIGNMENT",
          content: `
# Assignment: Aggregation Analysis

**Objective**: Summarize data with aggregations.

**Requirements**:
- Use a sample dataset.
- Write 6 queries:
  - 3 with different aggregate functions (e.g., COUNT, SUM).
  - 2 with GROUP BY.
  - 1 with HAVING.
- Test and verify results.
- Write a 300-word report on insights and business applications.

**Submission**:
- Submit your queries, dataset, and report.
          `,
          duration: 2400, // 40 minutes
          position: lessonPosition++,
          isPreview: false,
        },
      ],
    },
    {
      title: "Subqueries and CTEs",
      description: "Write advanced queries with subqueries and CTEs.",
      position: 6,
      lessons: [
        {
          title: "Introduction to Subqueries",
          description: "Learn how subqueries enhance SQL queries.",
          type: "VIDEO",
          videoUrl: "https://www.youtube.com/watch?v=5e3fXawSEJE", // Placeholder
          duration: 600, // 10 minutes
          position: lessonPosition++,
          isPreview: true,
        },
        {
          title: "Writing Subqueries",
          description: "Use subqueries in SELECT, WHERE, and FROM.",
          type: "TEXT",
          content: `
# Writing Subqueries

1. **In WHERE**:
   - Filter based on a subquery.
   - Example: 
     \`\`\`sql
     SELECT name 
     FROM customers 
     WHERE id IN (SELECT customer_id FROM orders WHERE amount > 1000);
     \`\`\`

2. **In SELECT**:
   - Compute values.
   - Example: 
     \`\`\`sql
     SELECT name, (SELECT AVG(amount) FROM orders) AS avg_order 
     FROM customers;
     \`\`\`

3. **In FROM**:
   - Treat subquery as a table.
   - Example: 
     \`\`\`sql
     SELECT * 
     FROM (SELECT region, SUM(sales) AS total FROM orders GROUP BY region) AS region_sales;
     \`\`\`

**Practice**:
- Write 3 subqueries (one for each clause).
- Test and summarize in 150 words.
          `,
          duration: 600, // 10 minutes
          position: lessonPosition++,
          isPreview: true,
        },
        {
          title: "Common Table Expressions (CTEs)",
          description: "Simplify queries with CTEs.",
          type: "TEXT",
          content: `
# Common Table Expressions (CTEs)

**Purpose**:
- Create temporary result sets for cleaner queries.
- Example: 
  \`\`\`sql
  WITH HighSales AS (
    SELECT customer_id, SUM(amount) AS total 
    FROM orders 
    GROUP BY customer_id 
    HAVING SUM(amount) > 10000
  )
  SELECT c.name, hs.total 
  FROM customers c 
  JOIN HighSales hs ON c.id = hs.customer_id;
  \`\`\`

**Benefits**:
- Improves readability.
- Reusable within a query.

**Practice**:
- Write 2 CTE queries for a sample dataset.
- Compare with equivalent subqueries.
- Summarize in 150 words.
          `,
          duration: 600, // 10 minutes
          position: lessonPosition++,
          isPreview: false,
        },
        {
          title: "Assignment: Advanced Queries",
          description: "Write subqueries and CTEs for complex analysis.",
          type: "ASSIGNMENT",
          content: `
# Assignment: Advanced Queries

**Objective**: Master subqueries and CTEs.

**Requirements**:
- Use a sample database.
- Write 6 queries:
  - 3 subqueries (SELECT, WHERE, FROM).
  - 3 CTEs solving similar problems.
- Test and verify results.
- Write a 300-word report comparing subqueries and CTEs, with insights.

**Submission**:
- Submit your queries, dataset schema, and report.
          `,
          duration: 2400, // 40 minutes
          position: lessonPosition++,
          isPreview: false,
        },
      ],
    },
    {
      title: "Window Functions",
      description: "Perform advanced analytics with window functions.",
      position: 7,
      lessons: [
        {
          title: "Introduction to Window Functions",
          description:
            "Learn how window functions enable advanced calculations.",
          type: "VIDEO",
          videoUrl: "https://www.youtube.com/watch?v=5e3fXawSEJE", // Placeholder
          duration: 600, // 10 minutes
          position: lessonPosition++,
          isPreview: true,
        },
        {
          title: "RANK and ROW_NUMBER",
          description: "Rank rows within partitions.",
          type: "TEXT",
          content: `
# RANK and ROW_NUMBER

1. **ROW_NUMBER**:
   - Assigns unique numbers to rows.
   - Example: 
     \`\`\`sql
     SELECT name, sales, ROW_NUMBER() OVER (ORDER BY sales DESC) AS row_num 
     FROM customers;
     \`\`\`

2. **RANK**:
   - Assigns ranks, with ties.
   - Example: 
     \`\`\`sql
     SELECT product, price, RANK() OVER (PARTITION BY category ORDER BY price DESC) AS rank 
     FROM products;
     \`\`\`

3. **PARTITION BY**:
   - Groups data for window calculations.

**Practice**:
- Write 2 queries using ROW_NUMBER and RANK.
- Test with partitions.
- Summarize in 150 words.
          `,
          duration: 600, // 10 minutes
          position: lessonPosition++,
          isPreview: true,
        },
        {
          title: "Running Totals and Moving Averages",
          description: "Calculate cumulative and moving metrics.",
          type: "TEXT",
          content: `
# Running Totals and Moving Averages

1. **Running Total**:
   - Cumulative sum over rows.
   - Example: 
     \`\`\`sql
     SELECT order_date, amount, 
            SUM(amount) OVER (ORDER BY order_date) AS running_total 
     FROM orders;
     \`\`\`

2. **Moving Average**:
   - Average over a window.
   - Example: 
     \`\`\`sql
     SELECT order_date, amount, 
            AVG(amount) OVER (ORDER BY order_date ROWS BETWEEN 6 PRECEDING AND CURRENT ROW) AS moving_avg 
     FROM orders;
     \`\`\`

**Practice**:
- Write 2 queries for running total and moving average.
- Test and explain in 150 words.
          `,
          duration: 600, // 10 minutes
          position: lessonPosition++,
          isPreview: false,
        },
        {
          title: "Assignment: Window Function Analysis",
          description: "Analyze data with window functions.",
          type: "ASSIGNMENT",
          content: `
# Assignment: Window Function Analysis

**Objective**: Apply window functions for analytics.

**Requirements**:
- Use a sample dataset.
- Write 6 queries:
  - 2 with RANK or ROW_NUMBER.
  - 2 with running totals.
  - 2 with moving averages.
- Test and verify results.
- Write a 300-word report on insights and use cases.

**Submission**:
- Submit your queries, dataset, and report.
          `,
          duration: 2400, // 40 minutes
          position: lessonPosition++,
          isPreview: false,
        },
      ],
    },
    {
      title: "Data Cleaning with SQL",
      description: "Prepare data for analysis by cleaning it with SQL.",
      position: 8,
      lessons: [
        {
          title: "Introduction to Data Cleaning",
          description: "Learn why clean data is critical for data science.",
          type: "VIDEO",
          videoUrl: "https://www.youtube.com/watch?v=5e3fXawSEJE", // Placeholder
          duration: 600, // 10 minutes
          position: lessonPosition++,
          isPreview: true,
        },
        {
          title: "Handling Missing Values",
          description: "Address missing data with SQL techniques.",
          type: "TEXT",
          content: `
# Handling Missing Values

1. **Identifying Missing Values**:
   - Use IS NULL.
   - Example: 
     \`\`\`sql
     SELECT * FROM customers WHERE email IS NULL;
     \`\`\`

2. **Filling Missing Values**:
   - Use COALESCE or UPDATE.
   - Example: 
     \`\`\`sql
     UPDATE products 
     SET price = COALESCE(price, (SELECT AVG(price) FROM products)) 
     WHERE price IS NULL;
     \`\`\`

3. **Removing Rows**:
   - Example: 
     \`\`\`sql
     DELETE FROM orders WHERE amount IS NULL;
     \`\`\`

**Practice**:
- Write 2 queries to identify and handle missing values.
- Test and summarize in 150 words.
          `,
          duration: 600, // 10 minutes
          position: lessonPosition++,
          isPreview: true,
        },
        {
          title: "Dealing with Duplicates and Outliers",
          description: "Remove duplicates and handle outliers.",
          type: "TEXT",
          content: `
# Dealing with Duplicates and Outliers

1. **Duplicates**:
   - Identify: 
     \`\`\`sql
     SELECT name, COUNT(*) 
     FROM customers 
     GROUP BY name 
     HAVING COUNT(*) > 1;
     \`\`\`
   - Remove: 
     \`\`\`sql
     DELETE FROM customers 
     WHERE id NOT IN (
       SELECT MIN(id) 
       FROM customers 
       GROUP BY name, email
     );
     \`\`\`

2. **Outliers**:
   - Identify with percentiles.
   - Example: 
     \`\`\`sql
     SELECT amount 
     FROM orders 
     WHERE amount > (SELECT PERCENTILE_CONT(0.99) WITHIN GROUP (ORDER BY amount) FROM orders);
     \`\`\`

**Practice**:
- Write queries to find and remove duplicates.
- Identify outliers and summarize in 150 words.
          `,
          duration: 600, // 10 minutes
          position: lessonPosition++,
          isPreview: false,
        },
        {
          title: "Assignment: Data Cleaning Pipeline",
          description: "Clean a dataset for analysis.",
          type: "ASSIGNMENT",
          content: `
# Assignment: Data Cleaning Pipeline

**Objective**: Build a data cleaning pipeline.

**Requirements**:
- Use a sample dataset with issues (e.g., missing values, duplicates).
- Write 6 queries:
  - 2 to identify issues.
  - 2 to handle missing values.
  - 2 to remove duplicates or outliers.
- Test and verify cleaned data.
- Write a 300-word report on your pipeline and its impact.

**Submission**:
- Submit your queries, original and cleaned datasets, and report.
          `,
          duration: 2400, // 40 minutes
          position: lessonPosition++,
          isPreview: false,
        },
      ],
    },
    {
      title: "Statistical Analysis with SQL",
      description: "Perform statistical analysis using SQL.",
      position: 9,
      lessons: [
        {
          title: "Introduction to Statistics in SQL",
          description: "Learn how SQL supports statistical analysis.",
          type: "VIDEO",
          videoUrl: "https://www.youtube.com/watch?v=5e3fXawSEJE", // Placeholder
          duration: 600, // 10 minutes
          position: lessonPosition++,
          isPreview: true,
        },
        {
          title: "Descriptive Statistics",
          description: "Calculate mean, median, and standard deviation.",
          type: "TEXT",
          content: `
# Descriptive Statistics

1. **Mean**:
   - Example: 
     \`\`\`sql
     SELECT AVG(salary) FROM employees;
     \`\`\`

2. **Median**:
   - Example (PostgreSQL): 
     \`\`\`sql
     SELECT PERCENTILE_CONT(0.5) WITHIN GROUP (ORDER BY salary) FROM employees;
     \`\`\`

3. **Standard Deviation**:
   - Example: 
     \`\`\`sql
     SELECT STDDEV(salary) FROM employees;
     \`\`\`

**Practice**:
- Write queries for mean, median, and SD on a sample dataset.
- Test and interpret results in 150 words.
          `,
          duration: 600, // 10 minutes
          position: lessonPosition++,
          isPreview: true,
        },
        {
          title: "Correlation and Trends",
          description: "Analyze relationships and trends.",
          type: "TEXT",
          content: `
# Correlation and Trends

1. **Correlation**:
   - Example (PostgreSQL): 
     \`\`\`sql
     SELECT CORR(sales, ad_spend) 
     FROM marketing;
     \`\`\`

2. **Trends**:
   - Use window functions.
   - Example: 
     \`\`\`sql
     SELECT order_date, 
            AVG(sales) OVER (ORDER BY order_date ROWS BETWEEN 6 PRECEDING AND CURRENT ROW) AS trend 
     FROM orders;
     \`\`\`

**Practice**:
- Write 2 queries for correlation or trends.
- Test and summarize in 150 words.
          `,
          duration: 600, // 10 minutes
          position: lessonPosition++,
          isPreview: false,
        },
        {
          title: "Assignment: Statistical Analysis",
          description: "Conduct statistical analysis with SQL.",
          type: "ASSIGNMENT",
          content: `
# Assignment: Statistical Analysis

**Objective**: Analyze data statistically.

**Requirements**:
- Use a sample dataset.
- Write 6 queries:
  - 2 for descriptive stats (e.g., mean, median).
  - 2 for trends or correlations.
  - 2 combining aggregations and window functions.
- Test and verify results.
- Write a 300-word report on insights and business implications.

**Submission**:
- Submit your queries, dataset, and report.
          `,
          duration: 2400, // 40 minutes
          position: lessonPosition++,
          isPreview: false,
        },
      ],
    },
    {
      title: "SQL for Machine Learning",
      description: "Prepare data for machine learning with SQL.",
      position: 10,
      lessons: [
        {
          title: "SQL in Machine Learning Workflows",
          description: "Learn how SQL supports ML pipelines.",
          type: "VIDEO",
          videoUrl: "https://www.youtube.com/watch?v=5e3fXawSEJE", // Placeholder
          duration: 600, // 10 minutes
          position: lessonPosition++,
          isPreview: true,
        },
        {
          title: "Feature Engineering with SQL",
          description: "Create features for ML models.",
          type: "TEXT",
          content: `
# Feature Engineering with SQL

1. **Creating Features**:
   - Aggregate, transform, or categorize data.
   - Example: 
     \`\`\`sql
     SELECT customer_id, 
            COUNT(*) AS order_count, 
            AVG(amount) AS avg_order 
     FROM orders 
     GROUP BY customer_id;
     \`\`\`

2. **Categorical Encoding**:
   - Example: 
     \`\`\`sql
     SELECT product, 
            CASE 
              WHEN category = 'Electronics' THEN 1 
              ELSE 0 
            END AS is_electronics 
     FROM products;
     \`\`\`

**Practice**:
- Write 2 queries to create ML features.
- Test and explain in 150 words.
          `,
          duration: 600, // 10 minutes
          position: lessonPosition++,
          isPreview: true,
        },
        {
          title: "Data Sampling",
          description: "Sample data for training and testing.",
          type: "TEXT",
          content: `
# Data Sampling

1. **Random Sampling**:
   - Example: 
     \`\`\`sql
     SELECT * FROM customers 
     ORDER BY RANDOM() 
     LIMIT 1000;
     \`\`\`

2. **Stratified Sampling**:
   - Example: 
     \`\`\`sql
     SELECT * 
     FROM customers 
     WHERE region = 'West' 
     ORDER BY RANDOM() 
     LIMIT 200;
     \`\`\`

**Practice**:
- Write 2 sampling queries (random and stratified).
- Test and summarize in 150 words.
          `,
          duration: 600, // 10 minutes
          position: lessonPosition++,
          isPreview: false,
        },
        {
          title: "Assignment: ML Data Prep",
          description: "Prepare a dataset for machine learning.",
          type: "ASSIGNMENT",
          content: `
# Assignment: ML Data Prep

**Objective**: Prepare data for an ML model.

**Requirements**:
- Use a sample dataset.
- Write 6 queries:
  - 3 for feature engineering (e.g., aggregations, encoding).
  - 2 for sampling (random, stratified).
  - 1 to clean data for ML.
- Test and verify results.
- Write a 300-word report on your features and their ML relevance.

**Submission**:
- Submit your queries, dataset, and report.
          `,
          duration: 2400, // 40 minutes
          position: lessonPosition++,
          isPreview: false,
        },
      ],
    },
    {
      title: "Performance Optimization",
      description: "Optimize SQL queries for large datasets.",
      position: 11,
      lessons: [
        {
          title: "Introduction to Query Optimization",
          description: "Learn why query performance matters.",
          type: "VIDEO",
          videoUrl: "https://www.youtube.com/watch?v=5e3fXawSEJE", // Placeholder
          duration: 600, // 10 minutes
          position: lessonPosition++,
          isPreview: true,
        },
        {
          title: "Indexes and Query Plans",
          description: "Use indexes to speed up queries.",
          type: "TEXT",
          content: `
# Indexes and Query Plans

1. **Indexes**:
   - Speed up WHERE and JOIN clauses.
   - Example: 
     \`\`\`sql
     CREATE INDEX idx_customer_id ON orders(customer_id);
     \`\`\`

2. **Query Plans**:
   - Analyze with EXPLAIN.
   - Example: 
     \`\`\`sql
     EXPLAIN SELECT * FROM orders WHERE customer_id = 100;
     \`\`\`

**Practice**:
- Create an index on a sample table.
- Run EXPLAIN on 2 queries.
- Summarize performance improvements in 150 words.
          `,
          duration: 600, // 10 minutes
          position: lessonPosition++,
          isPreview: true,
        },
        {
          title: "Optimizing Joins and Aggregations",
          description: "Improve performance of complex queries.",
          type: "TEXT",
          content: `
# Optimizing Joins and Aggregations

1. **Joins**:
   - Use indexes on join columns.
   - Example: Index on orders.customer_id.

2. **Aggregations**:
   - Filter early with WHERE.
   - Example: 
     \`\`\`sql
     SELECT region, SUM(sales) 
     FROM orders 
     WHERE order_date > '2024-01-01' 
     GROUP BY region;
     \`\`\`

**Practice**:
- Optimize 2 queries (1 join, 1 aggregation).
- Test with EXPLAIN and summarize in 150 words.
          `,
          duration: 600, // 10 minutes
          position: lessonPosition++,
          isPreview: false,
        },
        {
          title: "Assignment: Query Optimization",
          description: "Optimize SQL queries for performance.",
          type: "ASSIGNMENT",
          content: `
# Assignment: Query Optimization

**Objective**: Improve query performance.

**Requirements**:
- Use a sample dataset.
- Write 6 queries:
  - 2 original slow queries (join, aggregation).
  - 2 optimized versions (with indexes, filtering).
  - 2 using EXPLAIN to compare.
- Test and verify performance gains.
- Write a 300-word report on optimizations and results.

**Submission**:
- Submit your queries, EXPLAIN outputs, and report.
          `,
          duration: 2400, // 40 minutes
          position: lessonPosition++,
          isPreview: false,
        },
      ],
    },
    {
      title: "Capstone: Data Science Project with SQL",
      description: "Apply SQL to solve a real-world data science problem.",
      position: 12,
      lessons: [
        {
          title: "Planning a Data Science Project",
          description: "Learn how to structure a SQL-based project.",
          type: "VIDEO",
          videoUrl: "https://www.youtube.com/watch?v=5e3fXawSEJE", // Placeholder
          duration: 600, // 10 minutes
          position: lessonPosition++,
          isPreview: true,
        },
        {
          title: "Data Preparation and Analysis",
          description: "Collect, clean, and analyze data for insights.",
          type: "TEXT",
          content: `
# Data Preparation and Analysis

**Steps**:
1. **Define Problem**:
   - Example: Predict customer churn.
2. **Collect Data**:
   - Source from database or CSV.
3. **Clean Data**:
   - Handle missing values, duplicates.
4. **Analyze**:
   - Use joins, aggregations, window functions.
   - Example: 
     \`\`\`sql
     SELECT customer_id, 
            COUNT(*) AS order_count, 
            AVG(amount) AS avg_order 
     FROM orders 
     GROUP BY customer_id;
     \`\`\`

**Practice**:
- Define a problem and dataset.
- Write 2 queries for cleaning and 2 for analysis.
- Summarize in 150 words.
          `,
          duration: 600, // 10 minutes
          position: lessonPosition++,
          isPreview: true,
        },
        {
          title: "Presenting Insights",
          description: "Communicate findings effectively.",
          type: "TEXT",
          content: `
# Presenting Insights

1. **Visualization**:
   - Export SQL results to CSV for tools like Tableau.
   - Example: Bar chart of sales by region.

2. **Storytelling**:
   - Structure as problem, analysis, solution.
   - Example: “Churn is high in X; target with promotions.”

3. **Presentation**:
   - Use slides or reports.
   - Example: 5 slides with problem, queries, insights.

**Practice**:
- Export SQL results to CSV.
- Create a simple visualization (e.g., in Excel).
- Draft a 5-slide presentation outline and summarize in 150 words.
          `,
          duration: 600, // 10 minutes
          position: lessonPosition++,
          isPreview: false,
        },
        {
          title: "Final Project: Data Science Solution",
          description: "Develop a complete SQL-based data science project.",
          type: "ASSIGNMENT",
          content: `
# Final Project: Data Science Solution

**Objective**: Solve a data science problem with SQL.

**Requirements**:
- Choose a problem (e.g., sales analysis, churn prediction).
- Source a dataset (e.g., Kaggle, mock data).
- Write 10+ queries:
  - Cleaning (missing values, duplicates).
  - Analysis (joins, aggregations, window functions).
  - Feature engineering or optimization.
- Create 2 visualizations (export to Excel/Tableau).
- Develop a 5–7 slide presentation with problem, queries, insights, and recommendations.
- Write a 400-word reflection on your project and learnings.

**Submission**:
- Submit your queries, dataset, visualizations, presentation, and reflection.
          `,
          duration: 10800, // 180 minutes (3 hours)
          position: lessonPosition++,
          isPreview: false,
        },
        {
          title: "Quiz: Data Science Projects",
          description: "Test your knowledge of SQL data science workflows.",
          type: "QUIZ",
          content: `
# Quiz: Data Science Projects

**Instructions**: Answer the following questions.

1. **What is the first step in a data science project?**
   - A) Visualize data
   - B) Define the problem
   - C) Write queries
   - D) Present findings
   - **Answer**: B

2. **Why clean data before analysis?**
   - A) Reduces query speed
   - B) Ensures accurate results
   - C) Simplifies visualization
   - D) Limits data size
   - **Answer**: B

3. **What should a project presentation include?**
   - **Answer**: Problem, queries, insights, and recommendations.
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
