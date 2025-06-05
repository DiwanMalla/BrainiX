import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Starting seed process for Machine Learning with R...");

  // Fetch the Machine Learning with R course
  const course = await prisma.course.findUnique({
    where: { slug: "machine-learning-r" },
  });

  if (!course) {
    console.error("Course with slug 'machine-learning-r' not found.");
    throw new Error("Course not found");
  }

  console.log(`Found course: ${course.title}`);

  let lessonPosition = 1; // Track lesson position across modules
  const modulesData = [
    {
      title: "Introduction to Machine Learning with R",
      description: "Understand the role of R in machine learning workflows.",
      position: 1,
      lessons: [
        {
          title: "Why R for Machine Learning?",
          description: "Explore R’s strengths for machine learning.",
          type: "VIDEO",
          videoUrl: "https://www.youtube.com/watch?v=2HVMiDqlyMU", // Placeholder
          duration: 420, // 7 minutes
          position: lessonPosition++,
          isPreview: true,
        },
        {
          title: "R vs. Other Tools",
          description: "Compare R with Python, MATLAB, and Excel for ML.",
          type: "TEXT",
          content: `
# R vs. Other Tools

1. **R**:
   - Statistical computing and visualization.
   - Example: Build a regression model with caret.
   - Strengths: Statistical packages, ggplot2.
   - Weaknesses: Slower for large-scale processing.

2. **Python**:
   - General-purpose, with scikit-learn.
   - Example: Deep learning with TensorFlow.
   - Strengths: Versatility, scalability.
   - Weaknesses: Less statistical focus.

3. **MATLAB**:
   - Numerical computing.
   - Example: Signal processing.
   - Strengths: Engineering focus.
   - Weaknesses: Costly, less open-source.

4. **Excel**:
   - Simple analysis.
   - Example: Basic regression.
   - Strengths: User-friendly.
   - Weaknesses: Limited scalability.

**Practice**:
- Install R and RStudio.
- List 2 ML use cases where R excels.
- Write a 150-word explanation of R’s role in ML.
          `,
          duration: 600, // 10 minutes
          position: lessonPosition++,
          isPreview: true,
        },
        {
          title: "Setting Up Your R Environment",
          description: "Install R, RStudio, and key packages.",
          type: "TEXT",
          content: `
# Setting Up Your R Environment

1. **Install R**:
   - Download from CRAN (cran.r-project.org).
   - Verify: 
     \`\`\`R
     R.version.string
     \`\`\`

2. **Install RStudio**:
   - Download from posit.co.
   - Launch and create a new script.

3. **Install Packages**:
   - Run: 
     \`\`\`R
     install.packages(c("tidyverse", "caret", "ggplot2", "randomForest"))
     \`\`\`

4. **Test Setup**:
   - Run: 
     \`\`\`R
     library(tidyverse)
     data(mtcars)
     head(mtcars)
     \`\`\`

**Practice**:
- Install R, RStudio, and packages.
- Load a sample dataset (e.g., mtcars) and print first 5 rows.
- Summarize setup in 100 words.
          `,
          duration: 600, // 10 minutes
          position: lessonPosition++,
          isPreview: true,
        },
        {
          title: "Quiz: R Basics",
          description: "Test your understanding of R’s role in ML.",
          type: "QUIZ",
          content: `
# Quiz: R Basics

**Instructions**: Answer the following questions.

1. **Which R package is used for machine learning?**
   - A) ggplot2
   - B) caret
   - C) dplyr
   - D) tidyr
   - **Answer**: B

2. **What is a strength of R over Python for ML?**
   - A) Scalability
   - B) Statistical packages
   - C) Deep learning
   - D) Speed
   - **Answer**: B

3. **What tool is used to run R scripts?**
   - **Answer**: RStudio
          `,
          duration: 300, // 5 minutes
          position: lessonPosition++,
          isPreview: false,
        },
      ],
    },
    {
      title: "R Fundamentals for Machine Learning",
      description: "Master R basics for ML tasks.",
      position: 2,
      lessons: [
        {
          title: "Introduction to R Programming",
          description: "Learn R syntax and data structures.",
          type: "VIDEO",
          videoUrl: "https://www.youtube.com/watch?v=9r5k3zXw1cU", // Placeholder
          duration: 600, // 10 minutes
          position: lessonPosition++,
          isPreview: true,
        },
        {
          title: "Vectors, Data Frames, and Lists",
          description: "Work with R data structures.",
          type: "TEXT",
          content: `
# Vectors, Data Frames, and Lists

1. **Vectors**:
   - Ordered collections.
   - Example: 
     \`\`\`R
     sales <- c(100, 200, 300)
     sales[1]  # Output: 100
     \`\`\`

2. **Data Frames**:
   - Table-like structures.
   - Example: 
     \`\`\`R
     df <- data.frame(id = 1:3, name = c("A", "B", "C"), sales = c(100, 200, 300))
     print(df)
     \`\`\`

3. **Lists**:
   - Heterogeneous collections.
   - Example: 
     \`\`\`R
     my_list <- list(name = "A", scores = c(10, 20))
     my_list$name  # Output: A
     \`\`\`

**Practice**:
- Create a vector, data frame, and list with sample data.
- Access elements and summarize in 150 words.
          `,
          duration: 600, // 10 minutes
          position: lessonPosition++,
          isPreview: true,
        },
        {
          title: "Functions and Loops",
          description: "Automate tasks with functions and loops.",
          type: "TEXT",
          content: `
# Functions and Loops

1. **Functions**:
   - Reusable code.
   - Example: 
     \`\`\`R
     calc_avg <- function(x) mean(x, na.rm = TRUE)
     calc_avg(c(100, 200, 300))  # Output: 200
     \`\`\`

2. **Loops**:
   - Iterate over data.
   - Example: 
     \`\`\`R
     for (s in c(100, 200, 300)) {
       print(s * 1.1)
     }
     \`\`\`

3. **Apply Functions**:
   - Efficient iteration.
   - Example: 
     \`\`\`R
     sapply(c(100, 200, 300), function(x) x * 1.1)
     \`\`\`

**Practice**:
- Write a function to compute variance.
- Use a loop or apply to process data.
- Summarize in 150 words.
          `,
          duration: 600, // 10 minutes
          position: lessonPosition++,
          isPreview: false,
        },
        {
          title: "Assignment: R Basics",
          description: "Apply R fundamentals to a dataset.",
          type: "ASSIGNMENT",
          content: `
# Assignment: R Basics

**Objective**: Practice R data structures and functions.

**Requirements**:
- Create an R script in RStudio.
- Load a sample dataset (e.g., mtcars).
- Write code to:
  - Create a data frame and vector.
  - Write a function for a summary statistic.
  - Use a loop or apply function.
- Write a 300-word report explaining your code and insights.

**Submission**:
- Submit your R script and report.
          `,
          duration: 2400, // 40 minutes
          position: lessonPosition++,
          isPreview: false,
        },
      ],
    },
    {
      title: "Data Manipulation with tidyverse",
      description: "Master data manipulation using tidyverse.",
      position: 3,
      lessons: [
        {
          title: "Introduction to tidyverse",
          description: "Learn tidyverse for data handling.",
          type: "VIDEO",
          videoUrl: "https://www.youtube.com/watch?v=5e3fXawSEJE", // Placeholder
          duration: 600, // 10 minutes
          position: lessonPosition++,
          isPreview: true,
        },
        {
          title: "dplyr and tidyr",
          description: "Manipulate data with dplyr and tidyr.",
          type: "TEXT",
          content: `
# dplyr and tidyr

1. **dplyr**:
   - Filter, group, and summarize.
   - Example: 
     \`\`\`R
     library(dplyr)
     df <- mtcars
     df %>% 
       filter(mpg > 20) %>% 
       group_by(cyl) %>% 
       summarise(avg_hp = mean(hp))
     \`\`\`

2. **tidyr**:
   - Reshape data.
   - Example: 
     \`\`\`R
     library(tidyr)
     df_long <- pivot_longer(df, cols = c(mpg, hp), names_to = "metric")
     \`\`\`

**Practice**:
- Load a dataset and use dplyr to filter and summarize.
- Reshape with tidyr and summarize in 150 words.
          `,
          duration: 600, // 10 minutes
          position: lessonPosition++,
          isPreview: true,
        },
        {
          title: "Data Cleaning",
          description: "Clean data with tidyverse.",
          type: "TEXT",
          content: `
# Data Cleaning

1. **Missing Values**:
   - Identify and handle: 
     \`\`\`R
     sum(is.na(df))
     df <- df %>% mutate(sales = replace_na(sales, mean(sales, na.rm = TRUE)))
     \`\`\`

2. **Duplicates**:
   - Remove: 
     \`\`\`R
     df <- distinct(df)
     \`\`\`

3. **Outliers**:
   - Filter: 
     \`\`\`R
     df <- df %>% filter(sales < quantile(sales, 0.99, na.rm = TRUE))
     \`\`\`

**Practice**:
- Clean a dataset for missing values and outliers.
- Summarize in 150 words.
          `,
          duration: 600, // 10 minutes
          position: lessonPosition++,
          isPreview: false,
        },
        {
          title: "Assignment: Data Cleaning",
          description: "Clean a dataset using tidyverse.",
          type: "ASSIGNMENT",
          content: `
# Assignment: Data Cleaning

**Objective**: Clean a dataset.

**Requirements**:
- Load a sample dataset (e.g., from Kaggle).
- Use tidyverse to:
  - Handle missing values.
  - Remove duplicates.
  - Filter outliers.
- Write a 300-word report on cleaning process and impact.

**Submission**:
- Submit your R script, cleaned dataset, and report.
          `,
          duration: 2400, // 40 minutes
          position: lessonPosition++,
          isPreview: false,
        },
      ],
    },
    {
      title: "Data Visualization with ggplot2",
      description: "Create visualizations using ggplot2.",
      position: 4,
      lessons: [
        {
          title: "Introduction to ggplot2",
          description: "Learn ggplot2 for visualization.",
          type: "VIDEO",
          videoUrl: "https://www.youtube.com/watch?v=5e3fXawSEJE", // Placeholder
          duration: 600, // 10 minutes
          position: lessonPosition++,
          isPreview: true,
        },
        {
          title: "Basic Plots",
          description: "Create scatter and bar plots.",
          type: "TEXT",
          content: `
# Basic Plots

1. **Scatter Plot**:
   - Example: 
     \`\`\`R
     library(ggplot2)
     ggplot(mtcars, aes(x = mpg, y = hp)) +
       geom_point() +
       labs(x = "MPG", y = "Horsepower")
     \`\`\`

2. **Bar Plot**:
   - Example: 
     \`\`\`R
     ggplot(mtcars, aes(x = factor(cyl))) +
       geom_bar() +
       labs(x = "Cylinders")
     \`\`\`

**Practice**:
- Create a scatter and bar plot for a dataset.
- Save plots and summarize in 150 words.
          `,
          duration: 600, // 10 minutes
          position: lessonPosition++,
          isPreview: true,
        },
        {
          title: "Advanced Visualizations",
          description: "Create histograms and boxplots.",
          type: "TEXT",
          content: `
# Advanced Visualizations

1. **Histogram**:
   - Example: 
     \`\`\`R
     ggplot(mtcars, aes(x = mpg)) +
       geom_histogram(bins = 20) +
       labs(x = "MPG")
     \`\`\`

2. **Boxplot**:
   - Example: 
     \`\`\`R
     ggplot(mtcars, aes(x = factor(cyl), y = hp)) +
       geom_boxplot() +
       labs(x = "Cylinders", y = "Horsepower")
     \`\`\`

**Practice**:
- Create a histogram and boxplot.
- Save and summarize in 150 words.
          `,
          duration: 600, // 10 minutes
          position: lessonPosition++,
          isPreview: false,
        },
        {
          title: "Assignment: Visualization Project",
          description: "Create visualizations for a dataset.",
          type: "ASSIGNMENT",
          content: `
# Assignment: Visualization Project

**Objective**: Visualize data insights.

**Requirements**:
- Load a sample dataset.
- Create 5 ggplot2 visualizations:
  - 2 scatter or bar plots.
  - 2 histograms or boxplots.
  - 1 customized plot (e.g., with facets).
- Save plots.
- Write a 300-word report on insights.

**Submission**:
- Submit your R script, plots, and report.
          `,
          duration: 2400, // 40 minutes
          position: lessonPosition++,
          isPreview: false,
        },
      ],
    },
    {
      title: "Exploratory Data Analysis (EDA)",
      description: "Perform EDA to uncover patterns.",
      position: 5,
      lessons: [
        {
          title: "Introduction to EDA",
          description: "Learn EDA goals and steps.",
          type: "VIDEO",
          videoUrl: "https://www.youtube.com/watch?v=5e3fXawSEJE", // Placeholder
          duration: 600, // 10 minutes
          position: lessonPosition++,
          isPreview: true,
        },
        {
          title: "Descriptive Statistics",
          description: "Compute summary statistics.",
          type: "TEXT",
          content: `
# Descriptive Statistics

1. **Basic Stats**:
   - Example: 
     \`\`\`R
     summary(mtcars$mpg)
     \`\`\`

2. **Mean, Median, SD**:
   - Example: 
     \`\`\`R
     mean(mtcars$mpg)
     median(mtcars$mpg)
     sd(mtcars$mpg)
     \`\`\`

3. **Correlation**:
   - Example: 
     \`\`\`R
     cor(mtcars$mpg, mtcars$hp)
     \`\`\`

**Practice**:
- Compute stats for a dataset.
- Summarize patterns in 150 words.
          `,
          duration: 600, // 10 minutes
          position: lessonPosition++,
          isPreview: true,
        },
        {
          title: "EDA with Visualizations",
          description: "Combine stats and plots.",
          type: "TEXT",
          content: `
# EDA with Visualizations

1. **Distribution**:
   - Example: 
     \`\`\`R
     ggplot(mtcars, aes(x = mpg)) +
       geom_histogram(bins = 20)
     \`\`\`

2. **Relationships**:
   - Example: 
     \`\`\`R
     ggplot(mtcars, aes(x = mpg, y = hp, color = factor(cyl))) +
       geom_point()
     \`\`\`

**Practice**:
- Perform EDA with 2 stats and 2 plots.
- Summarize in 150 words.
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
- Create 3 ggplot2 visualizations.
- Write a 300-word report on patterns and insights.

**Submission**:
- Submit your R script, plots, and report.
          `,
          duration: 2400, // 40 minutes
          position: lessonPosition++,
          isPreview: false,
        },
      ],
    },
    {
      title: "Supervised Learning: Regression",
      description: "Build regression models with R.",
      position: 6,
      lessons: [
        {
          title: "Introduction to Regression",
          description: "Learn regression concepts.",
          type: "VIDEO",
          videoUrl: "https://www.youtube.com/watch?v=5e3fXawSEJE", // Placeholder
          duration: 600, // 10 minutes
          position: lessonPosition++,
          isPreview: true,
        },
        {
          title: "Linear Regression",
          description: "Build and interpret linear models.",
          type: "TEXT",
          content: `
# Linear Regression

1. **Model**:
   - Example: 
     \`\`\`R
     model <- lm(mpg ~ hp + wt, data = mtcars)
     summary(model)
     \`\`\`

2. **Predictions**:
   - Example: 
     \`\`\`R
     predict(model, newdata = data.frame(hp = 150, wt = 3))
     \`\`\`

**Practice**:
- Build a linear regression model.
- Summarize coefficients in 150 words.
          `,
          duration: 600, // 10 minutes
          position: lessonPosition++,
          isPreview: true,
        },
        {
          title: "Model Evaluation",
          description: "Evaluate regression models.",
          type: "TEXT",
          content: `
# Model Evaluation

1. **R² and Adjusted R²**:
   - Example: 
     \`\`\`R
     summary(model)$r.squared
     \`\`\`

2. **RMSE**:
   - Example: 
     \`\`\`R
     sqrt(mean((predict(model) - mtcars$mpg)^2))
     \`\`\`

**Practice**:
- Compute R² and RMSE for a model.
- Summarize in 150 words.
          `,
          duration: 600, // 10 minutes
          position: lessonPosition++,
          isPreview: false,
        },
        {
          title: "Assignment: Regression Analysis",
          description: "Build and evaluate a regression model.",
          type: "ASSIGNMENT",
          content: `
# Assignment: Regression Analysis

**Objective**: Develop a regression model.

**Requirements**:
- Load a dataset (e.g., mtcars).
- Build a linear regression model.
- Compute R² and RMSE.
- Write a 300-word report on model performance.

**Submission**:
- Submit your R script and report.
          `,
          duration: 2400, // 40 minutes
          position: lessonPosition++,
          isPreview: false,
        },
      ],
    },
    {
      title: "Supervised Learning: Classification",
      description: "Build classification models with R.",
      position: 7,
      lessons: [
        {
          title: "Introduction to Classification",
          description: "Learn classification concepts.",
          type: "VIDEO",
          videoUrl: "https://www.youtube.com/watch?v=5e3fXawSEJE", // Placeholder
          duration: 600, // 10 minutes
          position: lessonPosition++,
          isPreview: true,
        },
        {
          title: "Logistic Regression",
          description: "Build logistic regression models.",
          type: "TEXT",
          content: `
# Logistic Regression

1. **Model**:
   - Example: 
     \`\`\`R
     library(caret)
     data(iris)
     model <- glm(Species ~ Sepal.Length + Sepal.Width, data = iris, family = "binomial")
     summary(model)
     \`\`\`

2. **Predictions**:
   - Example: 
     \`\`\`R
     predict(model, newdata = data.frame(Sepal.Length = 5, Sepal.Width = 3), type = "response")
     \`\`\`

**Practice**:
- Build a logistic regression model.
- Summarize in 150 words.
          `,
          duration: 600, // 10 minutes
          position: lessonPosition++,
          isPreview: true,
        },
        {
          title: "Random Forests",
          description: "Build random forest models.",
          type: "TEXT",
          content: `
# Random Forests

1. **Model**:
   - Example: 
     \`\`\`R
     library(randomForest)
     model <- randomForest(Species ~ ., data = iris)
     \`\`\`

2. **Importance**:
   - Example: 
     \`\`\`R
     varImpPlot(model)
     \`\`\`

**Practice**:
- Build a random forest model.
- Summarize feature importance in 150 words.
          `,
          duration: 600, // 10 minutes
          position: lessonPosition++,
          isPreview: false,
        },
        {
          title: "Assignment: Classification Models",
          description: "Build and evaluate classification models.",
          type: "ASSIGNMENT",
          content: `
# Assignment: Classification Models

**Objective**: Develop classification models.

**Requirements**:
- Load a dataset (e.g., iris).
- Build logistic regression and random forest models.
- Evaluate with accuracy and confusion matrix.
- Write a 300-word report on performance.

**Submission**:
- Submit your R script and report.
          `,
          duration: 2400, // 40 minutes
          position: lessonPosition++,
          isPreview: false,
        },
      ],
    },
    {
      title: "Unsupervised Learning",
      description: "Explore clustering and dimensionality reduction.",
      position: 8,
      lessons: [
        {
          title: "Introduction to Unsupervised Learning",
          description: "Learn unsupervised learning concepts.",
          type: "VIDEO",
          videoUrl: "https://www.youtube.com/watch?v=5e3fXawSEJE", // Placeholder
          duration: 600, // 10 minutes
          position: lessonPosition++,
          isPreview: true,
        },
        {
          title: "K-Means Clustering",
          description: "Perform clustering with k-means.",
          type: "TEXT",
          content: `
# K-Means Clustering

1. **Model**:
   - Example: 
     \`\`\`R
     set.seed(123)
     clusters <- kmeans(mtcars[, c("mpg", "hp")], centers = 3)
     \`\`\`

2. **Visualization**:
   - Example: 
     \`\`\`R
     mtcars$cluster <- factor(clusters$cluster)
     ggplot(mtcars, aes(x = mpg, y = hp, color = cluster)) +
       geom_point()
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
          title: "PCA",
          description: "Reduce dimensionality with PCA.",
          type: "TEXT",
          content: `
# PCA

1. **Model**:
   - Example: 
     \`\`\`R
     pca <- prcomp(mtcars[, c("mpg", "hp", "wt")], scale. = TRUE)
     summary(pca)
     \`\`\`

2. **Visualization**:
   - Example: 
     \`\`\`R
     library(ggfortify)
     autoplot(pca, data = mtcars, colour = "cyl")
     \`\`\`

**Practice**:
- Apply PCA and visualize.
- Summarize in 150 words.
          `,
          duration: 600, // 10 minutes
          position: lessonPosition++,
          isPreview: false,
        },
        {
          title: "Assignment: Unsupervised Learning",
          description: "Apply clustering and PCA.",
          type: "ASSIGNMENT",
          content: `
# Assignment: Unsupervised Learning

**Objective**: Explore unsupervised methods.

**Requirements**:
- Load a dataset.
- Perform k-means clustering and PCA.
- Create 2 visualizations.
- Write a 300-word report on insights.

**Submission**:
- Submit your R script, plots, and report.
          `,
          duration: 2400, // 40 minutes
          position: lessonPosition++,
          isPreview: false,
        },
      ],
    },
    {
      title: "Model Evaluation and Tuning",
      description: "Evaluate and optimize ML models.",
      position: 9,
      lessons: [
        {
          title: "Introduction to Model Evaluation",
          description: "Learn evaluation techniques.",
          type: "VIDEO",
          videoUrl: "https://www.youtube.com/watch?v=5e3fXawSEJE", // Placeholder
          duration: 600, // 10 minutes
          position: lessonPosition++,
          isPreview: true,
        },
        {
          title: "Cross-Validation",
          description: "Use cross-validation with caret.",
          type: "TEXT",
          content: `
# Cross-Validation

1. **K-Fold CV**:
   - Example: 
     \`\`\`R
     library(caret)
     ctrl <- trainControl(method = "cv", number = 5)
     model <- train(mpg ~ hp + wt, data = mtcars, method = "lm", trControl = ctrl)
     \`\`\`

**Practice**:
- Run 5-fold CV on a model.
- Summarize in 150 words.
          `,
          duration: 600, // 10 minutes
          position: lessonPosition++,
          isPreview: true,
        },
        {
          title: "Hyperparameter Tuning",
          description: "Tune models with caret.",
          type: "TEXT",
          content: `
# Hyperparameter Tuning

1. **Grid Search**:
   - Example: 
     \`\`\`R
     grid <- expand.grid(mtry = c(2, 3, 4))
     model <- train(Species ~ ., data = iris, method = "rf", tuneGrid = grid)
     \`\`\`

**Practice**:
- Tune a random forest model.
- Summarize best parameters in 150 words.
          `,
          duration: 600, // 10 minutes
          position: lessonPosition++,
          isPreview: false,
        },
        {
          title: "Assignment: Model Tuning",
          description: "Optimize an ML model.",
          type: "ASSIGNMENT",
          content: `
# Assignment: Model Tuning

**Objective**: Optimize a model.

**Requirements**:
- Load a dataset.
- Perform 5-fold CV and grid search.
- Write a 300-word report on best model performance.

**Submission**:
- Submit your R script and report.
          `,
          duration: 2400, // 40 minutes
          position: lessonPosition++,
          isPreview: false,
        },
      ],
    },
    {
      title: "Feature Engineering",
      description: "Create features to improve models.",
      position: 10,
      lessons: [
        {
          title: "Introduction to Feature Engineering",
          description: "Learn feature engineering concepts.",
          type: "VIDEO",
          videoUrl: "https://www.youtube.com/watch?v=5e3fXawSEJE", // Placeholder
          duration: 600, // 10 minutes
          position: lessonPosition++,
          isPreview: true,
        },
        {
          title: "Encoding and Scaling",
          description: "Encode and scale features.",
          type: "TEXT",
          content: `
# Encoding and Scaling

1. **Encoding**:
   - Example: 
     \`\`\`R
     df$region <- as.factor(df$region)
     \`\`\`

2. **Scaling**:
   - Example: 
     \`\`\`R
     df$sales <- scale(df$sales)
     \`\`\`

**Practice**:
- Encode a categorical variable and scale a numeric one.
- Summarize in 150 words.
          `,
          duration: 600, // 10 minutes
          position: lessonPosition++,
          isPreview: true,
        },
        {
          title: "Feature Creation",
          description: "Create new features.",
          type: "TEXT",
          content: `
# Feature Creation

1. **Aggregations**:
   - Example: 
     \`\`\`R
     df <- df %>% 
       group_by(region) %>% 
       mutate(avg_sales = mean(sales, na.rm = TRUE))
     \`\`\`

2. **Interactions**:
   - Example: 
     \`\`\`R
     df$sales_hp <- df$sales * df$hp
     \`\`\`

**Practice**:
- Create 2 new features.
- Summarize in 150 words.
          `,
          duration: 600, // 10 minutes
          position: lessonPosition++,
          isPreview: false,
        },
        {
          title: "Assignment: Feature Engineering",
          description: "Engineer features for ML.",
          type: "ASSIGNMENT",
          content: `
# Assignment: Feature Engineering

**Objective**: Improve a dataset.

**Requirements**:
- Load a dataset.
- Create 5 features (encoding, scaling, aggregations).
- Write a 300-word report on feature impact.

**Submission**:
- Submit your R script and report.
          `,
          duration: 2400, // 40 minutes
          position: lessonPosition++,
          isPreview: false,
        },
      ],
    },
    {
      title: "Real-World ML Applications",
      description: "Apply ML to real-world problems.",
      position: 11,
      lessons: [
        {
          title: "Introduction to ML Applications",
          description: "Explore ML use cases.",
          type: "VIDEO",
          videoUrl: "https://www.youtube.com/watch?v=5e3fXawSEJE", // Placeholder
          duration: 600, // 10 minutes
          position: lessonPosition++,
          isPreview: true,
        },
        {
          title: "Customer Churn Prediction",
          description: "Predict churn with classification.",
          type: "TEXT",
          content: `
# Customer Churn Prediction

1. **Model**:
   - Example: 
     \`\`\`R
     library(caret)
     model <- train(churn ~ ., data = df, method = "rf")
     \`\`\`

2. **Visualization**:
   - Example: 
     \`\`\`R
     ggplot(df, aes(x = sales, y = tenure, color = churn)) +
       geom_point()
     \`\`\`

**Practice**:
- Build a churn model and visualize.
- Summarize in 150 words.
          `,
          duration: 600, // 10 minutes
          position: lessonPosition++,
          isPreview: true,
        },
        {
          title: "Time Series Forecasting",
          description: "Forecast trends with R.",
          type: "TEXT",
          content: `
# Time Series Forecasting

1. **Prophet**:
   - Example: 
     \`\`\`R
     library(prophet)
     df_prophet <- data.frame(ds = df$date, y = df$sales)
     model <- prophet(df_prophet)
     future <- make_future_dataframe(model, periods = 30)
     forecast <- predict(model, future)
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
          title: "Assignment: ML Application",
          description: "Solve a real-world problem.",
          type: "ASSIGNMENT",
          content: `
# Assignment: ML Application

**Objective**: Apply ML to a problem.

**Requirements**:
- Choose a use case (e.g., churn, forecasting).
- Build a model and create 2 visualizations.
- Write a 300-word report on results.

**Submission**:
- Submit your R script, plots, and report.
          `,
          duration: 2400, // 40 minutes
          position: lessonPosition++,
          isPreview: false,
        },
      ],
    },
    {
      title: "Capstone: Machine Learning Project",
      description: "Build a complete ML project with R.",
      position: 12,
      lessons: [
        {
          title: "Planning an ML Project",
          description: "Structure an ML project.",
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
     \`\`\`R
     df <- df %>% 
       mutate(sales = replace_na(sales, mean(sales, na.rm = TRUE)))
     \`\`\`
3. **Model**:
   - Example: 
     \`\`\`R
     library(caret)
     model <- train(churn ~ ., data = df, method = "rf")
     \`\`\`

**Practice**:
- Define a problem, clean data, and build a model.
- Summarize in 150 words.
          `,
          duration: 600, // 10 minutes
          position: lessonPosition++,
          isPreview: true,
        },
        {
          title: "Presenting Insights",
          description: "Communicate findings.",
          type: "TEXT",
          content: `
# Presenting Insights

1. **Visualization**:
   - Example: 
     \`\`\`R
     ggplot(df, aes(x = sales, y = tenure, color = churn)) +
       geom_point()
     ggsave("churn_plot.png")
     \`\`\`

2. **Storytelling**:
   - Structure: Problem, analysis, solution.

3. **Presentation**:
   - Create 5 slides.

**Practice**:
- Create 2 visualizations and a 5-slide outline.
- Summarize in 150 words.
          `,
          duration: 600, // 10 minutes
          position: lessonPosition++,
          isPreview: false,
        },
        {
          title: "Final Project: ML Solution",
          description: "Develop a complete ML project.",
          type: "ASSIGNMENT",
          content: `
# Final Project: ML Solution

**Objective**: Solve an ML problem.

**Requirements**:
- Choose a problem (e.g., churn prediction).
- Load a dataset (e.g., Kaggle).
- Perform:
  - Data cleaning and EDA.
  - Build and tune a model.
  - Create 3 visualizations.
- Develop a 5–7 slide presentation.
- Write a 400-word reflection.

**Submission**:
- Submit your R script, plots, presentation, and reflection.
          `,
          duration: 10800, // 180 minutes (3 hours)
          position: lessonPosition++,
          isPreview: false,
        },
        {
          title: "Quiz: ML Projects",
          description: "Test your knowledge of ML workflows.",
          type: "QUIZ",
          content: `
# Quiz: ML Projects

**Instructions**: Answer the following questions.

1. **What is the first step in an ML project?**
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

3. **What should an ML presentation include?**
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
