import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Starting seed process for Data Science with Python...");

  // Fetch the Data Science with Python course
  const course = await prisma.course.findUnique({
    where: { slug: "data-science-python" },
  });

  if (!course) {
    console.error("Course with slug 'data-science-python' not found.");
    throw new Error("Course not found");
  }

  console.log(`Found course: ${course.title}`);

  let lessonPosition = 1; // Track lesson position across modules
  const modulesData = [
    {
      title: "Introduction to Data Science with Python",
      description: "Understand the role of Python in data science workflows.",
      position: 1,
      lessons: [
        {
          title: "Why Python for Data Science?",
          description: "Explore Python’s advantages for data science.",
          type: "VIDEO",
          videoUrl: "https://www.youtube.com/watch?v=7S_tz1z_5bA", // Placeholder
          duration: 420, // 7 minutes
          position: lessonPosition++,
          isPreview: true,
        },
        {
          title: "Python vs. Other Tools",
          description:
            "Compare Python with R, SQL, and Excel for data science.",
          type: "TEXT",
          content: `
# Python vs. Other Tools

1. **Python**:
   - General-purpose, with libraries like pandas, scikit-learn.
   - Example: Data cleaning with pandas.
   - Strengths: Versatile, large community.
   - Weaknesses: Slower for large-scale database queries.

2. **R**:
   - Statistical analysis and visualization.
   - Example: ggplot2 for plots.
   - Strengths: Statistical focus.
   - Weaknesses: Less general-purpose.

3. **SQL**:
   - Database querying.
   - Example: Aggregate sales data.
   - Strengths: Fast for structured data.
   - Weaknesses: Limited to databases.

4. **Excel**:
   - Simple analysis.
   - Example: Pivot tables.
   - Strengths: User-friendly.
   - Weaknesses: Limited scalability.

**Practice**:
- Install Python and Jupyter Notebook.
- List 2 use cases where Python excels over R or SQL.
- Write a 150-word explanation of Python’s role in data science.
          `,
          duration: 600, // 10 minutes
          position: lessonPosition++,
          isPreview: true,
        },
        {
          title: "Setting Up Your Python Environment",
          description: "Install Python and essential libraries.",
          type: "TEXT",
          content: `
# Setting Up Your Python Environment

1. **Install Python**:
   - Download Python 3.9+ from python.org or use Anaconda.
   - Verify: \`python --version\`.

2. **Install Libraries**:
   - Use pip: 
     \`\`\`bash
     pip install jupyter pandas numpy matplotlib seaborn scikit-learn
     \`\`\`

3. **Jupyter Notebook**:
   - Launch: 
     \`\`\`bash
     jupyter notebook
     \`\`\`
   - Create a notebook and run: 
     \`\`\`python
     import pandas as pd
     print(pd.__version__)
     \`\`\`

**Practice**:
- Install Python, pip, and Jupyter.
- Create a notebook and load a sample CSV (e.g., from Kaggle).
- Run a simple command (e.g., \`pd.read_csv('data.csv').head()\`).
- Summarize your setup in 100 words.
          `,
          duration: 600, // 10 minutes
          position: lessonPosition++,
          isPreview: true,
        },
        {
          title: "Quiz: Python Basics",
          description:
            "Test your understanding of Python’s role in data science.",
          type: "QUIZ",
          content: `
# Quiz: Python Basics

**Instructions**: Answer the following questions.

1. **Which library is used for data manipulation in Python?**
   - A) matplotlib
   - B) pandas
   - C) scikit-learn
   - D) numpy
   - **Answer**: B

2. **What is a strength of Python over SQL?**
   - A) Database querying
   - B) Versatility
   - C) Speed
   - D) Simplicity
   - **Answer**: B

3. **What tool is used to run Python notebooks?**
   - **Answer**: Jupyter Notebook
          `,
          duration: 300, // 5 minutes
          position: lessonPosition++,
          isPreview: false,
        },
      ],
    },
    {
      title: "Python Fundamentals for Data Science",
      description: "Learn Python basics for data science tasks.",
      position: 2,
      lessons: [
        {
          title: "Introduction to Python Programming",
          description: "Understand Python syntax and data structures.",
          type: "VIDEO",
          videoUrl: "https://www.youtube.com/watch?v=kqtD5dpn9C8", // Placeholder
          duration: 600, // 10 minutes
          position: lessonPosition++,
          isPreview: true,
        },
        {
          title: "Variables, Lists, and Dictionaries",
          description: "Work with Python data structures.",
          type: "TEXT",
          content: `
# Variables, Lists, and Dictionaries

1. **Variables**:
   - Store data: 
     \`\`\`python
     x = 10
     name = "Data Science"
     \`\`\`

2. **Lists**:
   - Ordered, mutable collections.
   - Example: 
     \`\`\`python
     sales = [100, 200, 300]
     sales.append(400)
     print(sales[0])  # Output: 100
     \`\`\`

3. **Dictionaries**:
   - Key-value pairs.
   - Example: 
     \`\`\`python
     customer = {"id": 1, "name": "Jane", "sales": 1000}
     print(customer["name"])  # Output: Jane
     \`\`\`

**Practice**:
- Create a list of 5 numbers and a dictionary with 3 customer records.
- Write code to add an item to the list and access a dictionary value.
- Summarize in 150 words.
          `,
          duration: 600, // 10 minutes
          position: lessonPosition++,
          isPreview: true,
        },
        {
          title: "Functions and Loops",
          description: "Use functions and loops for automation.",
          type: "TEXT",
          content: `
# Functions and Loops

1. **Functions**:
   - Reusable code blocks.
   - Example: 
     \`\`\`python
     def calculate_total(sales):
         return sum(sales)
     print(calculate_total([100, 200, 300]))  # Output: 600
     \`\`\`

2. **Loops**:
   - Iterate over data.
   - Example: 
     \`\`\`python
     for sale in [100, 200, 300]:
         print(sale * 1.1)
     \`\`\`

3. **List Comprehensions**:
   - Concise loops.
   - Example: 
     \`\`\`python
     sales = [100, 200, 300]
     taxed = [s * 1.1 for s in sales]
     \`\`\`

**Practice**:
- Write a function to calculate average sales.
- Use a loop to process a list of 5 sales.
- Summarize in 150 words.
          `,
          duration: 600, // 10 minutes
          position: lessonPosition++,
          isPreview: false,
        },
        {
          title: "Assignment: Python Basics",
          description: "Apply Python fundamentals to a dataset.",
          type: "ASSIGNMENT",
          content: `
# Assignment: Python Basics

**Objective**: Practice Python data structures and loops.

**Requirements**:
- Create a Jupyter notebook.
- Load a sample dataset (e.g., CSV from Kaggle).
- Write code to:
  - Store 5 records in a list and dictionary.
  - Create a function to compute a summary (e.g., average).
  - Use a loop to process data.
- Test and verify output.
- Write a 300-word report explaining your code and insights.

**Submission**:
- Submit your notebook and report.
          `,
          duration: 2400, // 40 minutes
          position: lessonPosition++,
          isPreview: false,
        },
      ],
    },
    {
      title: "Data Manipulation with pandas",
      description: "Master data manipulation using pandas.",
      position: 3,
      lessons: [
        {
          title: "Introduction to pandas",
          description: "Learn the basics of pandas for data handling.",
          type: "VIDEO",
          videoUrl: "https://www.youtube.com/watch?v=vmEHCJofslg", // Placeholder
          duration: 600, // 10 minutes
          position: lessonPosition++,
          isPreview: true,
        },
        {
          title: "DataFrames and Series",
          description: "Work with pandas DataFrames and Series.",
          type: "TEXT",
          content: `
# DataFrames and Series

1. **DataFrame**:
   - Table-like structure.
   - Example: 
     \`\`\`python
     import pandas as pd
     df = pd.read_csv('sales.csv')
     print(df.head())
     \`\`\`

2. **Series**:
   - Single column.
   - Example: 
     \`\`\`python
     sales = df['sales']
     print(sales.mean())
     \`\`\`

3. **Basic Operations**:
   - Filter: 
     \`\`\`python
     high_sales = df[df['sales'] > 1000]
     \`\`\`
   - Group: 
     \`\`\`python
     df.groupby('region')['sales'].sum()
     \`\`\`

**Practice**:
- Load a CSV into a DataFrame.
- Create a Series and compute its mean.
- Filter and group data, then summarize in 150 words.
          `,
          duration: 600, // 10 minutes
          position: lessonPosition++,
          isPreview: true,
        },
        {
          title: "Data Cleaning with pandas",
          description: "Clean data by handling missing values and duplicates.",
          type: "TEXT",
          content: `
# Data Cleaning with pandas

1. **Missing Values**:
   - Identify: 
     \`\`\`python
     df.isnull().sum()
     \`\`\`
   - Fill: 
     \`\`\`python
     df['sales'].fillna(df['sales'].mean(), inplace=True)
     \`\`\`

2. **Duplicates**:
   - Identify: 
     \`\`\`python
     df.duplicated().sum()
     \`\`\`
   - Remove: 
     \`\`\`python
     df.drop_duplicates(inplace=True)
     \`\`\`

3. **Outliers**:
   - Example: 
     \`\`\`python
     df = df[df['sales'] < df['sales'].quantile(0.99)]
     \`\`\`

**Practice**:
- Load a dataset and identify missing values and duplicates.
- Clean the data and summarize in 150 words.
          `,
          duration: 600, // 10 minutes
          position: lessonPosition++,
          isPreview: false,
        },
        {
          title: "Assignment: Data Cleaning",
          description: "Clean a dataset using pandas.",
          type: "ASSIGNMENT",
          content: `
# Assignment: Data Cleaning

**Objective**: Clean a dataset for analysis.

**Requirements**:
- Load a sample dataset (e.g., from Kaggle).
- Write code to:
  - Identify and handle missing values.
  - Remove duplicates.
  - Filter outliers.
- Test and verify cleaned data.
- Write a 300-word report on your cleaning process and impact.

**Submission**:
- Submit your notebook, original and cleaned datasets, and report.
          `,
          duration: 2400, // 40 minutes
          position: lessonPosition++,
          isPreview: false,
        },
      ],
    },
    {
      title: "Data Visualization with Python",
      description: "Create visualizations using matplotlib and seaborn.",
      position: 4,
      lessons: [
        {
          title: "Introduction to Data Visualization",
          description: "Learn the importance of visualization in data science.",
          type: "VIDEO",
          videoUrl: "https://www.youtube.com/watch?v=5e3fXawSEJE", // Placeholder
          duration: 600, // 10 minutes
          position: lessonPosition++,
          isPreview: true,
        },
        {
          title: "Plots with matplotlib",
          description: "Create basic plots using matplotlib.",
          type: "TEXT",
          content: `
# Plots with matplotlib

1. **Line Plot**:
   - Example: 
     \`\`\`python
     import matplotlib.pyplot as plt
     plt.plot(df['date'], df['sales'])
     plt.xlabel('Date')
     plt.ylabel('Sales')
     plt.show()
     \`\`\`

2. **Bar Plot**:
   - Example: 
     \`\`\`python
     plt.bar(df['region'], df['sales'])
     plt.show()
     \`\`\`

3. **Scatter Plot**:
   - Example: 
     \`\`\`python
     plt.scatter(df['sales'], df['profit'])
     plt.show()
     \`\`\`

**Practice**:
- Create 2 plots (bar, scatter) for a dataset.
- Save plots and summarize in 150 words.
          `,
          duration: 600, // 10 minutes
          position: lessonPosition++,
          isPreview: true,
        },
        {
          title: "Advanced Visualizations with seaborn",
          description: "Use seaborn for statistical plots.",
          type: "TEXT",
          content: `
# Advanced Visualizations with seaborn

1. **Histogram**:
   - Example: 
     \`\`\`python
     import seaborn as sns
     sns.histplot(df['sales'], bins=20)
     plt.show()
     \`\`\`

2. **Box Plot**:
   - Example: 
     \`\`\`python
     sns.boxplot(x='region', y='sales', data=df)
     plt.show()
     \`\`\`

3. **Heatmap**:
   - Example: 
     \`\`\`python
     sns.heatmap(df.corr(), annot=True)
     plt.show()
     \`\`\`

**Practice**:
- Create 2 seaborn plots (histogram, box).
- Save and summarize in 150 words.
          `,
          duration: 600, // 10 minutes
          position: lessonPosition++,
          isPreview: false,
        },
        {
          title: "Assignment: Visualization Project",
          description: "Create a set of visualizations for a dataset.",
          type: "ASSIGNMENT",
          content: `
# Assignment: Visualization Project

**Objective**: Visualize data insights.

**Requirements**:
- Load a sample dataset.
- Create 5 visualizations:
  - 2 matplotlib (e.g., bar, scatter).
  - 3 seaborn (e.g., histogram, box, heatmap).
- Save plots as PNGs.
- Write a 300-word report on insights from visualizations.

**Submission**:
- Submit your notebook, plots, and report.
          `,
          duration: 2400, // 40 minutes
          position: lessonPosition++,
          isPreview: false,
        },
      ],
    },
    {
      title: "Exploratory Data Analysis (EDA)",
      description: "Perform EDA to uncover patterns and insights.",
      position: 5,
      lessons: [
        {
          title: "Introduction to EDA",
          description: "Learn the goals and steps of EDA.",
          type: "VIDEO",
          videoUrl: "https://www.youtube.com/watch?v=5e3fXawSEJE", // Placeholder
          duration: 600, // 10 minutes
          position: lessonPosition++,
          isPreview: true,
        },
        {
          title: "Descriptive Statistics",
          description: "Compute summary statistics with pandas.",
          type: "TEXT",
          content: `
# Descriptive Statistics

1. **Basic Stats**:
   - Example: 
     \`\`\`python
     df.describe()
     \`\`\`

2. **Mean, Median, Std**:
   - Example: 
     \`\`\`python
     print(df['sales'].mean())
     print(df['sales'].median())
     print(df['sales'].std())
     \`\`\`

3. **Correlation**:
   - Example: 
     \`\`\`python
     df.corr()
     \`\`\`

**Practice**:
- Compute descriptive stats for a dataset.
- Identify key patterns and summarize in 150 words.
          `,
          duration: 600, // 10 minutes
          position: lessonPosition++,
          isPreview: true,
        },
        {
          title: "EDA with Visualizations",
          description: "Combine stats and plots for EDA.",
          type: "TEXT",
          content: `
# EDA with Visualizations

1. **Distribution**:
   - Example: 
     \`\`\`python
     sns.histplot(df['sales'])
     plt.show()
     \`\`\`

2. **Relationships**:
   - Example: 
     \`\`\`python
     sns.scatterplot(x='sales', y='profit', hue='region', data=df)
     plt.show()
     \`\`\`

3. **Outliers**:
   - Example: 
     \`\`\`python
     sns.boxplot(df['sales'])
     plt.show()
     \`\`\`

**Practice**:
- Perform EDA with 2 stats and 2 plots.
- Summarize findings in 150 words.
          `,
          duration: 600, // 10 minutes
          position: lessonPosition++,
          isPreview: false,
        },
        {
          title: "Assignment: EDA Report",
          description: "Conduct EDA on a dataset.",
          type: "ASSIGNMENT",
          content: `
# Assignment: EDA Report

**Objective**: Explore a dataset.

**Requirements**:
- Load a sample dataset.
- Compute 5 descriptive statistics.
- Create 3 visualizations (e.g., histogram, scatter).
- Write a 300-word report on patterns, outliers, and insights.

**Submission**:
- Submit your notebook, plots, and report.
          `,
          duration: 2400, // 40 minutes
          position: lessonPosition++,
          isPreview: false,
        },
      ],
    },
    {
      title: "Statistical Analysis with Python",
      description: "Perform statistical analysis using Python.",
      position: 6,
      lessons: [
        {
          title: "Introduction to Statistics",
          description: "Learn statistical concepts for data science.",
          type: "VIDEO",
          videoUrl: "https://www.youtube.com/watch?v=5e3fXawSEJE", // Placeholder
          duration: 600, // 10 minutes
          position: lessonPosition++,
          isPreview: true,
        },
        {
          title: "Hypothesis Testing",
          description: "Conduct hypothesis tests with scipy.",
          type: "TEXT",
          content: `
# Hypothesis Testing

1. **T-Test**:
   - Compare means.
   - Example: 
     \`\`\`python
     from scipy.stats import ttest_ind
     group1 = df[df['region'] == 'West']['sales']
     group2 = df[df['region'] == 'East']['sales']
     stat, p = ttest_ind(group1, group2)
     print(p)
     \`\`\`

2. **Chi-Square Test**:
   - Test independence.
   - Example: 
     \`\`\`python
     from scipy.stats import chi2_contingency
     table = pd.crosstab(df['region'], df['category'])
     stat, p, dof, expected = chi2_contingency(table)
     \`\`\`

**Practice**:
- Run a t-test and chi-square test.
- Summarize results in 150 words.
          `,
          duration: 600, // 10 minutes
          position: lessonPosition++,
          isPreview: true,
        },
        {
          title: "Correlation and Regression",
          description: "Analyze relationships with statsmodels.",
          type: "TEXT",
          content: `
# Correlation and Regression

1. **Correlation**:
   - Example: 
     \`\`\`python
     df['sales'].corr(df['profit'])
     \`\`\`

2. **Linear Regression**:
   - Example: 
     \`\`\`python
     import statsmodels.api as sm
     X = sm.add_constant(df['sales'])
     model = sm.OLS(df['profit'], X).fit()
     print(model.summary())
     \`\`\`

**Practice**:
- Compute correlation and run a regression.
- Interpret results in 150 words.
          `,
          duration: 600, // 10 minutes
          position: lessonPosition++,
          isPreview: false,
        },
        {
          title: "Assignment: Statistical Analysis",
          description: "Perform statistical analysis on a dataset.",
          type: "ASSIGNMENT",
          content: `
# Assignment: Statistical Analysis

**Objective**: Analyze data statistically.

**Requirements**:
- Load a sample dataset.
- Conduct:
  - 2 hypothesis tests (e.g., t-test, chi-square).
  - 1 correlation analysis.
  - 1 regression model.
- Write a 300-word report on findings and implications.

**Submission**:
- Submit your notebook and report.
          `,
          duration: 2400, // 40 minutes
          position: lessonPosition++,
          isPreview: false,
        },
      ],
    },
    {
      title: "Machine Learning with scikit-learn",
      description: "Build machine learning models using scikit-learn.",
      position: 7,
      lessons: [
        {
          title: "Introduction to Machine Learning",
          description: "Learn the basics of ML with Python.",
          type: "VIDEO",
          videoUrl: "https://www.youtube.com/watch?v=5e3fXawSEJE", // Placeholder
          duration: 600, // 10 minutes
          position: lessonPosition++,
          isPreview: true,
        },
        {
          title: "Supervised Learning",
          description: "Build classification and regression models.",
          type: "TEXT",
          content: `
# Supervised Learning

1. **Classification**:
   - Example: 
     \`\`\`python
     from sklearn.ensemble import RandomForestClassifier
     X = df[['sales', 'profit']]
     y = df['region']
     clf = RandomForestClassifier()
     clf.fit(X, y)
     \`\`\`

2. **Regression**:
   - Example: 
     \`\`\`python
     from sklearn.linear_model import LinearRegression
     X = df[['sales']]
     y = df['profit']
     reg = LinearRegression()
     reg.fit(X, y)
     \`\`\`

**Practice**:
- Build a classification and regression model.
- Summarize in 150 words.
          `,
          duration: 600, // 10 minutes
          position: lessonPosition++,
          isPreview: true,
        },
        {
          title: "Model Evaluation",
          description: "Evaluate ML models with metrics.",
          type: "TEXT",
          content: `
# Model Evaluation

1. **Classification Metrics**:
   - Accuracy, precision, recall.
   - Example: 
     \`\`\`python
     from sklearn.metrics import accuracy_score
     y_pred = clf.predict(X)
     print(accuracy_score(y, y_pred))
     \`\`\`

2. **Regression Metrics**:
   - MSE, R².
   - Example: 
     \`\`\`python
     from sklearn.metrics import mean_squared_error
     y_pred = reg.predict(X)
     print(mean_squared_error(y, y_pred))
     \`\`\`

**Practice**:
- Evaluate a model with 2 metrics.
- Summarize in 150 words.
          `,
          duration: 600, // 10 minutes
          position: lessonPosition++,
          isPreview: false,
        },
        {
          title: "Assignment: ML Model",
          description: "Build and evaluate an ML model.",
          type: "ASSIGNMENT",
          content: `
# Assignment: ML Model

**Objective**: Develop an ML model.

**Requirements**:
- Load a sample dataset.
- Build 2 models (classification, regression).
- Evaluate with 2 metrics per model.
- Write a 300-word report on performance and insights.

**Submission**:
- Submit your notebook and report.
          `,
          duration: 2400, // 40 minutes
          position: lessonPosition++,
          isPreview: false,
        },
      ],
    },
    {
      title: "Feature Engineering",
      description: "Create features to improve model performance.",
      position: 8,
      lessons: [
        {
          title: "Introduction to Feature Engineering",
          description: "Learn the importance of features in ML.",
          type: "VIDEO",
          videoUrl: "https://www.youtube.com/watch?v=5e3fXawSEJE", // Placeholder
          duration: 600, // 10 minutes
          position: lessonPosition++,
          isPreview: true,
        },
        {
          title: "Encoding and Scaling",
          description: "Encode categorical data and scale features.",
          type: "TEXT",
          content: `
# Encoding and Scaling

1. **Encoding**:
   - One-hot encoding: 
     \`\`\`python
     df = pd.get_dummies(df, columns=['region'])
     \`\`\`

2. **Scaling**:
   - StandardScaler: 
     \`\`\`python
     from sklearn.preprocessing import StandardScaler
     scaler = StandardScaler()
     df['sales'] = scaler.fit_transform(df[['sales']])
     \`\`\`

**Practice**:
- Encode a categorical column and scale a numerical column.
- Summarize in 150 words.
          `,
          duration: 600, // 10 minutes
          position: lessonPosition++,
          isPreview: true,
        },
        {
          title: "Feature Creation",
          description: "Create new features from existing data.",
          type: "TEXT",
          content: `
# Feature Creation

1. **Aggregations**:
   - Example: 
     \`\`\`python
     df['avg_sales_per_region'] = df.groupby('region')['sales'].transform('mean')
     \`\`\`

2. **Interactions**:
   - Example: 
     \`\`\`python
     df['sales_profit_ratio'] = df['sales'] / df['profit']
     \`\`\`

**Practice**:
- Create 2 new features (aggregation, interaction).
- Summarize in 150 words.
          `,
          duration: 600, // 10 minutes
          position: lessonPosition++,
          isPreview: false,
        },
        {
          title: "Assignment: Feature Engineering",
          description: "Engineer features for an ML model.",
          type: "ASSIGNMENT",
          content: `
# Assignment: Feature Engineering

**Objective**: Improve a dataset with features.

**Requirements**:
- Load a sample dataset.
- Create 5 features:
  - 2 encoded columns.
  - 2 scaled columns.
  - 1 new feature (e.g., ratio).
- Write a 300-word report on feature impact.

**Submission**:
- Submit your notebook and report.
          `,
          duration: 2400, // 40 minutes
          position: lessonPosition++,
          isPreview: false,
        },
      ],
    },
    {
      title: "Model Tuning and Selection",
      description: "Optimize and select the best ML models.",
      position: 9,
      lessons: [
        {
          title: "Introduction to Model Tuning",
          description: "Learn how to improve ML models.",
          type: "VIDEO",
          videoUrl: "https://www.youtube.com/watch?v=5e3fXawSEJE", // Placeholder
          duration: 600, // 10 minutes
          position: lessonPosition++,
          isPreview: true,
        },
        {
          title: "Hyperparameter Tuning",
          description: "Tune models with GridSearchCV.",
          type: "TEXT",
          content: `
# Hyperparameter Tuning

1. **GridSearchCV**:
   - Example: 
     \`\`\`python
     from sklearn.model_selection import GridSearchCV
     param_grid = {'n_estimators': [50, 100], 'max_depth': [None, 10]}
     grid = GridSearchCV(RandomForestClassifier(), param_grid, cv=5)
     grid.fit(X, y)
     print(grid.best_params_)
     \`\`\`

**Practice**:
- Tune a model with GridSearchCV.
- Summarize best parameters in 150 words.
          `,
          duration: 600, // 10 minutes
          position: lessonPosition++,
          isPreview: true,
        },
        {
          title: "Cross-Validation",
          description: "Validate models with cross-validation.",
          type: "TEXT",
          content: `
# Cross-Validation

1. **K-Fold CV**:
   - Example: 
     \`\`\`python
     from sklearn.model_selection import cross_val_score
     scores = cross_val_score(RandomForestClassifier(), X, y, cv=5)
     print(scores.mean())
     \`\`\`

**Practice**:
- Run 5-fold cross-validation.
- Summarize results in 150 words.
          `,
          duration: 600, // 10 minutes
          position: lessonPosition++,
          isPreview: false,
        },
        {
          title: "Assignment: Model Optimization",
          description: "Tune and validate an ML model.",
          type: "ASSIGNMENT",
          content: `
# Assignment: Model Optimization

**Objective**: Optimize an ML model.

**Requirements**:
- Load a sample dataset.
- Perform:
  - GridSearchCV on 1 model.
  - 5-fold cross-validation.
- Write a 300-word report on best model and performance.

**Submission**:
- Submit your notebook and report.
          `,
          duration: 2400, // 40 minutes
          position: lessonPosition++,
          isPreview: false,
        },
      ],
    },
    {
      title: "Working with Big Data",
      description: "Handle large datasets with Python.",
      position: 10,
      lessons: [
        {
          title: "Introduction to Big Data",
          description: "Learn how to manage large datasets.",
          type: "VIDEO",
          videoUrl: "https://www.youtube.com/watch?v=5e3fXawSEJE", // Placeholder
          duration: 600, // 10 minutes
          position: lessonPosition++,
          isPreview: true,
        },
        {
          title: "Efficient Data Processing",
          description: "Use pandas and dask for large datasets.",
          type: "TEXT",
          content: `
# Efficient Data Processing

1. **pandas Optimization**:
   - Example: 
     \`\`\`python
     df = pd.read_csv('large.csv', usecols=['sales', 'region'])
     \`\`\`

2. **Dask**:
   - Example: 
     \`\`\`python
     import dask.dataframe as dd
     ddf = dd.read_csv('large.csv')
     ddf['sales'].mean().compute()
     \`\`\`

**Practice**:
- Load a large CSV with pandas and dask.
- Compute a summary and summarize in 150 words.
          `,
          duration: 600, // 10 minutes
          position: lessonPosition++,
          isPreview: true,
        },
        {
          title: "Parallel Computing",
          description: "Use joblib for parallel processing.",
          type: "TEXT",
          content: `
# Parallel Computing

1. **joblib**:
   - Example: 
     \`\`\`python
     from joblib import Parallel, delayed
     def process_chunk(chunk):
         return chunk['sales'].mean()
     results = Parallel(n_jobs=2)(delayed(process_chunk)(chunk) for chunk in np.array_split(df, 4))
     \`\`\`

**Practice**:
- Process a dataset in parallel.
- Summarize in 150 words.
          `,
          duration: 600, // 10 minutes
          position: lessonPosition++,
          isPreview: false,
        },
        {
          title: "Assignment: Big Data Processing",
          description: "Process a large dataset efficiently.",
          type: "ASSIGNMENT",
          content: `
# Assignment: Big Data Processing

**Objective**: Handle large data.

**Requirements**:
- Load a large dataset (e.g., Kaggle).
- Use pandas and dask for 2 summaries.
- Apply parallel processing with joblib.
- Write a 300-word report on efficiency gains.

**Submission**:
- Submit your notebook and report.
          `,
          duration: 2400, // 40 minutes
          position: lessonPosition++,
          isPreview: false,
        },
      ],
    },
    {
      title: "Real-World Data Science Applications",
      description: "Apply Python to real-world problems.",
      position: 11,
      lessons: [
        {
          title: "Introduction to DS Applications",
          description: "Explore data science use cases.",
          type: "VIDEO",
          videoUrl: "https://www.youtube.com/watch?v=5e3fXawSEJE", // Placeholder
          duration: 600, // 10 minutes
          position: lessonPosition++,
          isPreview: true,
        },
        {
          title: "Customer Segmentation",
          description: "Segment customers with clustering.",
          type: "TEXT",
          content: `
# Customer Segmentation

1. **K-Means Clustering**:
   - Example: 
     \`\`\`python
     from sklearn.cluster import KMeans
     X = df[['sales', 'profit']]
     kmeans = KMeans(n_clusters=3)
     df['cluster'] = kmeans.fit_predict(X)
     \`\`\`

2. **Visualization**:
   - Example: 
     \`\`\`python
     sns.scatterplot(x='sales', y='profit', hue='cluster', data=df)
     plt.show()
     \`\`\`

**Practice**:
- Cluster a dataset and visualize.
- Summarize in 150 words.
          `,
          duration: 600, // 10 minutes
          position: lessonPosition++,
          isPreview: true,
        },
        {
          title: "Time Series Forecasting",
          description: "Forecast trends with Python.",
          type: "TEXT",
          content: `
# Time Series Forecasting

1. ** Prophet**:
   - Example: 
     \`\`\`python
     from fbprophet import Prophet
     df_prophet = df[['date', 'sales']].rename(columns={'date': 'ds', 'sales': 'y'})
     model = Prophet()
     model.fit(df_prophet)
     future = model.make_future_dataframe(periods=30)
     forecast = model.predict(future)
     \`\`\`

**Practice**:
- Forecast a time series.
- Summarize in 150 words.
          `,
          duration: 600, // 10 minutes
          position: lessonPosition++,
          isPreview: false,
        },
        {
          title: "Assignment: DS Application",
          description: "Solve a real-world problem.",
          type: "ASSIGNMENT",
          content: `
# Assignment: DS Application

**Objective**: Apply DS to a problem.

**Requirements**:
- Choose a use case (e.g., segmentation, forecasting).
- Load a dataset and apply a model.
- Create 2 visualizations.
- Write a 300-word report on results.

**Submission**:
- Submit your notebook, plots, and report.
          `,
          duration: 2400, // 40 minutes
          position: lessonPosition++,
          isPreview: false,
        },
      ],
    },
    {
      title: "Capstone: Data Science Project",
      description: "Build a complete data science project with Python.",
      position: 12,
      lessons: [
        {
          title: "Planning a DS Project",
          description: "Learn how to structure a data science project.",
          type: "VIDEO",
          videoUrl: "https://www.youtube.com/watch?v=5e3fXawSEJE", // Placeholder
          duration: 600, // 10 minutes
          position: lessonPosition++,
          isPreview: true,
        },
        {
          title: "Data Preparation and Modeling",
          description: "Clean, analyze, and model data.",
          type: "TEXT",
          content: `
# Data Preparation and Modeling

**Steps**:
1. **Define Problem**:
   - Example: Predict customer churn.
2. **Clean Data**:
   - Example: 
     \`\`\`python
     df.fillna(df.mean(), inplace=True)
     \`\`\`
3. **Model**:
   - Example: 
     \`\`\`python
     from sklearn.ensemble import RandomForestClassifier
     clf = RandomForestClassifier()
     clf.fit(X_train, y_train)
     \`\`\`

**Practice**:
- Define a problem and clean a dataset.
- Build a model and summarize in 150 words.
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
   - Example: 
     \`\`\`python
     sns.barplot(x='feature', y='importance', data=feature_importance)
     plt.show()
     \`\`\`

2. **Storytelling**:
   - Structure: Problem, analysis, solution.
   - Example: “High churn in X; target with promotions.”

3. **Presentation**:
   - Create 5 slides with insights.

**Practice**:
- Create 2 visualizations and a 5-slide outline.
- Summarize in 150 words.
          `,
          duration: 600, // 10 minutes
          position: lessonPosition++,
          isPreview: false,
        },
        {
          title: "Final Project: Data Science Solution",
          description: "Develop a complete DS project.",
          type: "ASSIGNMENT",
          content: `
# Final Project: Data Science Solution

**Objective**: Solve a DS problem.

**Requirements**:
- Choose a problem (e.g., churn prediction).
- Load a dataset (e.g., Kaggle).
- Perform:
  - Data cleaning.
  - EDA with 3 visualizations.
  - Build and tune an ML model.
- Create 3 visualizations.
- Develop a 5–7 slide presentation.
- Write a 400-word reflection.

**Submission**:
- Submit your notebook, plots, presentation, and reflection.
          `,
          duration: 10800, // 180 minutes (3 hours)
          position: lessonPosition++,
          isPreview: false,
        },
        {
          title: "Quiz: DS Projects",
          description: "Test your knowledge of DS workflows.",
          type: "QUIZ",
          content: `
# Quiz: DS Projects

**Instructions**: Answer the following questions.

1. **What is the first step in a DS project?**
   - A) Build model
   - B) Define problem
   - C) Visualize data
   - D) Present findings
   - **Answer**: B

2. **Why clean data?**
   - A) Improve visuals
   - B) Ensure accuracy
   - C) Reduce size
   - D) Simplify code
   - **Answer**: B

3. **What should a DS presentation include?**
   - **Answer**: Problem, analysis, insights, recommendations.
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
