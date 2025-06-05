import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Starting seed process for Big Data with Apache Spark...");

  // Fetch the Big Data with Apache Spark course
  const course = await prisma.course.findUnique({
    where: { slug: "big-data-apache-spark" },
  });

  if (!course) {
    console.error("Course with slug 'big-data-apache-spark' not found.");
    throw new Error("Course not found");
  }

  console.log(`Found course: ${course.title}`);

  let lessonPosition = 1; // Track lesson position across modules
  const modulesData = [
    {
      title: "Introduction to Big Data and Apache Spark",
      description:
        "Understand big data concepts and Spark’s role in processing it.",
      position: 1,
      lessons: [
        {
          title: "What is Big Data?",
          description:
            "Explore big data characteristics: volume, velocity, variety.",
          type: "VIDEO",
          videoUrl: "https://www.youtube.com/watch?v=5e3fXawSEJE", // Placeholder
          duration: 420, // 7 minutes
          position: lessonPosition++,
          isPreview: true,
        },
        {
          title: "Introduction to Apache Spark",
          description: "Learn Spark’s architecture and advantages.",
          type: "TEXT",
          content: `
# Introduction to Apache Spark

1. **What is Spark?**
   - In-memory, distributed computing framework.
   - Example: Process 1TB of data in minutes.

2. **Architecture**:
   - Driver, executors, cluster manager.
   - Example: SparkContext coordinates tasks.

3. **Advantages**:
   - Speed: In-memory processing.
   - Scalability: Runs on Hadoop, Kubernetes.
   - Libraries: SQL, MLlib, GraphX.

**Practice**:
- Install Spark locally or use Databricks Community Edition.
- List 2 use cases where Spark excels (e.g., real-time analytics).
- Write a 150-word explanation of Spark’s role in big data.
          `,
          duration: 600, // 10 minutes
          position: lessonPosition++,
          isPreview: true,
        },
        {
          title: "Setting Up Spark Environment",
          description: "Install Spark and PySpark for big data processing.",
          type: "TEXT",
          content: `
# Setting Up Spark Environment

1. **Install Spark**:
   - Download from spark.apache.org (e.g., Spark 3.5.0).
   - Set environment variables:
     \`\`\`bash
     export SPARK_HOME=/path/to/spark
     export PATH=$SPARK_HOME/bin:$PATH
     \`\`\`

2. **Install PySpark**:
   - Run:
     \`\`\`bash
     pip install pyspark
     \`\`\`

3. **Test Setup**:
   - Start PySpark shell:
     \`\`\`bash
     pyspark
     \`\`\`
   - Run:
     \`\`\`python
     from pyspark.sql import SparkSession
     spark = SparkSession.builder.appName("Test").getOrCreate()
     print(spark.version)
     \`\`\`

**Practice**:
- Install Spark and PySpark.
- Run a simple Spark job to read a CSV (e.g., from Kaggle).
- Summarize setup in 100 words.
          `,
          duration: 600, // 10 minutes
          position: lessonPosition++,
          isPreview: true,
        },
        {
          title: "Quiz: Big Data and Spark Basics",
          description: "Test your understanding of big data and Spark.",
          type: "QUIZ",
          content: `
# Quiz: Big Data and Spark Basics

**Instructions**: Answer the following questions.

1. **Which is a characteristic of big data?**
   - A) Small volume
   - B) High velocity
   - C) Simple structure
   - D) Low variety
   - **Answer**: B

2. **What is Spark’s primary advantage?**
   - A) In-memory processing
   - B) Single-node execution
   - C) Limited scalability
   - D) No SQL support
   - **Answer**: A

3. **What command starts a PySpark session?**
   - **Answer**: SparkSession.builder.appName("App").getOrCreate()
          `,
          duration: 300, // 5 minutes
          position: lessonPosition++,
          isPreview: false,
        },
      ],
    },
    {
      title: "Spark Core Concepts",
      description: "Master Spark’s core components and RDDs.",
      position: 2,
      lessons: [
        {
          title: "Understanding RDDs",
          description: "Learn Resilient Distributed Datasets (RDDs).",
          type: "VIDEO",
          videoUrl: "https://www.youtube.com/watch?v=5e3fXawSEJE", // Placeholder
          duration: 600, // 10 minutes
          position: lessonPosition++,
          isPreview: true,
        },
        {
          title: "RDD Operations",
          description: "Perform transformations and actions on RDDs.",
          type: "TEXT",
          content: `
# RDD Operations

1. **Transformations** (lazy):
   - Example:
     \`\`\`python
     from pyspark import SparkContext
     sc = SparkContext("local", "RDDTest")
     data = [1, 2, 3, 4, 5]
     rdd = sc.parallelize(data)
     squared = rdd.map(lambda x: x * x)
     \`\`\`

2. **Actions** (execute):
   - Example:
     \`\`\`python
     result = squared.collect()
     print(result)  # Output: [1, 4, 9, 16, 25]
     \`\`\`

3. **Persistence**:
   - Example:
     \`\`\`python
     rdd.persist()
     \`\`\`

**Practice**:
- Create an RDD from a list and square its elements.
- Use an action to collect results.
- Summarize in 150 words.
          `,
          duration: 600, // 10 minutes
          position: lessonPosition++,
          isPreview: true,
        },
        {
          title: "SparkContext and SparkSession",
          description: "Understand Spark’s entry points.",
          type: "TEXT",
          content: `
# SparkContext and SparkSession

1. **SparkContext**:
   - Entry point for RDD API.
   - Example:
     \`\`\`python
     from pyspark import SparkContext
     sc = SparkContext("local", "App")
     \`\`\`

2. **SparkSession**:
   - Unified entry point for DataFrame API.
   - Example:
     \`\`\`python
     from pyspark.sql import SparkSession
     spark = SparkSession.builder.appName("App").getOrCreate()
     \`\`\`

**Practice**:
- Create a SparkSession and load a CSV.
- Use SparkContext to create an RDD.
- Summarize in 150 words.
          `,
          duration: 600, // 10 minutes
          position: lessonPosition++,
          isPreview: false,
        },
        {
          title: "Assignment: RDD Basics",
          description: "Apply RDD operations to a dataset.",
          type: "ASSIGNMENT",
          content: `
# Assignment: RDD Basics

**Objective**: Practice RDD operations.

**Requirements**:
- Create a PySpark script.
- Load a sample dataset (e.g., CSV from Kaggle).
- Write code to:
  - Create an RDD.
  - Apply 2 transformations (e.g., map, filter).
  - Use an action (e.g., collect).
- Write a 300-word report explaining your code and results.

**Submission**:
- Submit your script and report.
          `,
          duration: 2400, // 40 minutes
          position: lessonPosition++,
          isPreview: false,
        },
      ],
    },
    {
      title: "Spark DataFrames and SQL",
      description: "Work with DataFrames and Spark SQL for structured data.",
      position: 3,
      lessons: [
        {
          title: "Introduction to DataFrames",
          description: "Learn Spark DataFrames for structured data.",
          type: "VIDEO",
          videoUrl: "https://www.youtube.com/watch?v=5e3fXawSEJE", // Placeholder
          duration: 600, // 10 minutes
          position: lessonPosition++,
          isPreview: true,
        },
        {
          title: "DataFrame Operations",
          description: "Perform operations on DataFrames.",
          type: "TEXT",
          content: `
# DataFrame Operations

1. **Loading Data**:
   - Example:
     \`\`\`python
     from pyspark.sql import SparkSession
     spark = SparkSession.builder.appName("DF").getOrCreate()
     df = spark.read.csv("sales.csv", header=True, inferSchema=True)
     df.show(5)
     \`\`\`

2. **Filtering and Grouping**:
   - Example:
     \`\`\`python
     df_filtered = df.filter(df.sales > 1000)
     df_grouped = df.groupBy("region").agg({"sales": "sum"})
     \`\`\`

**Practice**:
- Load a CSV into a DataFrame.
- Filter and group data.
- Summarize in 150 words.
          `,
          duration: 600, // 10 minutes
          position: lessonPosition++,
          isPreview: true,
        },
        {
          title: "Spark SQL",
          description: "Query data using Spark SQL.",
          type: "TEXT",
          content: `
# Spark SQL

1. **Create View**:
   - Example:
     \`\`\`python
     df.createOrReplaceTempView("sales")
     \`\`\`

2. **Query**:
   - Example:
     \`\`\`python
     result = spark.sql("SELECT region, SUM(sales) as total FROM sales GROUP BY region")
     result.show()
     \`\`\`

**Practice**:
- Load a dataset and create a temp view.
- Run 2 SQL queries (e.g., filter, aggregate).
- Summarize in 150 words.
          `,
          duration: 600, // 10 minutes
          position: lessonPosition++,
          isPreview: false,
        },
        {
          title: "Assignment: DataFrame and SQL",
          description: "Process data using DataFrames and SQL.",
          type: "ASSIGNMENT",
          content: `
# Assignment: DataFrame and SQL

**Objective**: Manipulate structured data.

**Requirements**:
- Load a sample dataset (e.g., Kaggle CSV).
- Use DataFrames to:
  - Filter and group data.
- Use Spark SQL to:
  - Run 2 queries (e.g., aggregate, join).
- Write a 300-word report on results.

**Submission**:
- Submit your script, output, and report.
          `,
          duration: 2400, // 40 minutes
          position: lessonPosition++,
          isPreview: false,
        },
      ],
    },
    {
      title: "Data Ingestion and Storage",
      description: "Ingest and store big data with Spark.",
      position: 4,
      lessons: [
        {
          title: "Data Ingestion",
          description: "Load data from various sources.",
          type: "VIDEO",
          videoUrl: "https://www.youtube.com/watch?v=5e3fXawSEJE", // Placeholder
          duration: 600, // 10 minutes
          position: lessonPosition++,
          isPreview: true,
        },
        {
          title: "Reading Multiple Formats",
          description: "Handle CSV, JSON, and Parquet files.",
          type: "TEXT",
          content: `
# Reading Multiple Formats

1. **CSV**:
   - Example:
     \`\`\`python
     df_csv = spark.read.csv("data.csv", header=True, inferSchema=True)
     \`\`\`

2. **JSON**:
   - Example:
     \`\`\`python
     df_json = spark.read.json("data.json")
     \`\`\`

3. **Parquet**:
   - Example:
     \`\`\`python
     df_parquet = spark.read.parquet("data.parquet")
     \`\`\`

**Practice**:
- Load a CSV and JSON dataset.
- Save as Parquet.
- Summarize in 150 words.
          `,
          duration: 600, // 10 minutes
          position: lessonPosition++,
          isPreview: true,
        },
        {
          title: "Integration with AWS S3",
          description: "Read and write data to S3.",
          type: "TEXT",
          content: `
# Integration with AWS S3

1. **Configure S3**:
   - Set credentials:
     \`\`\`python
     spark._jsc.hadoopConfiguration().set("fs.s3a.access.key", "YOUR_ACCESS_KEY")
     spark._jsc.hadoopConfiguration().set("fs.s3a.secret.key", "YOUR_SECRET_KEY")
     \`\`\`

2. **Read/Write**:
   - Example:
     \`\`\`python
     df = spark.read.csv("s3a://bucket/data.csv")
     df.write.parquet("s3a://bucket/output/")
     \`\`\`

**Practice**:
- Read a CSV from S3 and save as Parquet.
- Summarize in 150 words.
          `,
          duration: 600, // 10 minutes
          position: lessonPosition++,
          isPreview: false,
        },
        {
          title: "Assignment: Data Ingestion",
          description: "Ingest and store big data.",
          type: "ASSIGNMENT",
          content: `
# Assignment: Data Ingestion

**Objective**: Load and store data.

**Requirements**:
- Load 2 datasets (e.g., CSV, JSON).
- Save as Parquet.
- If possible, integrate with S3.
- Write a 300-word report on process and efficiency.

**Submission**:
- Submit your script, output, and report.
          `,
          duration: 2400, // 40 minutes
          position: lessonPosition++,
          isPreview: false,
        },
      ],
    },
    {
      title: "Data Cleaning and Transformation",
      description: "Clean and transform big data with Spark.",
      position: 5,
      lessons: [
        {
          title: "Introduction to Data Cleaning",
          description: "Learn data cleaning in Spark.",
          type: "VIDEO",
          videoUrl: "https://www.youtube.com/watch?v=5e3fXawSEJE", // Placeholder
          duration: 600, // 10 minutes
          position: lessonPosition++,
          isPreview: true,
        },
        {
          title: "Handling Missing Values",
          description: "Manage missing data in DataFrames.",
          type: "TEXT",
          content: `
# Handling Missing Values

1. **Identify**:
   - Example:
     \`\`\`python
     df.select([count(when(col(c).isNull(), c)).alias(c) for c in df.columns]).show()
     \`\`\`

2. **Fill**:
   - Example:
     \`\`\`python
     df = df.fillna({"sales": df.select(mean("sales")).collect()[0][0]})
     \`\`\`

3. **Drop**:
   - Example:
     \`\`\`python
     df = df.dropna(subset=["sales"])
     \`\`\`

**Practice**:
- Identify and handle missing values in a dataset.
- Summarize in 150 words.
          `,
          duration: 600, // 10 minutes
          position: lessonPosition++,
          isPreview: true,
        },
        {
          title: "Data Transformation",
          description: "Transform data with Spark.",
          type: "TEXT",
          content: `
# Data Transformation

1. **Add Columns**:
   - Example:
     \`\`\`python
     from pyspark.sql.functions import col
     df = df.withColumn("sales_tax", col("sales") * 0.1)
     \`\`\`

2. **Join Datasets**:
   - Example:
     \`\`\`python
     df_joined = df.join(df2, "id", "inner")
     \`\`\`

**Practice**:
- Add a column and join two datasets.
- Summarize in 150 words.
          `,
          duration: 600, // 10 minutes
          position: lessonPosition++,
          isPreview: false,
        },
        {
          title: "Assignment: Data Cleaning",
          description: "Clean and transform a dataset.",
          type: "ASSIGNMENT",
          content: `
# Assignment: Data Cleaning

**Objective**: Clean big data.

**Requirements**:
- Load a dataset.
- Handle missing values and duplicates.
- Perform 2 transformations (e.g., add column, join).
- Write a 300-word report on cleaning impact.

**Submission**:
- Submit your script, cleaned data, and report.
          `,
          duration: 2400, // 40 minutes
          position: lessonPosition++,
          isPreview: false,
        },
      ],
    },
    {
      title: "Spark Streaming",
      description: "Process real-time data with Spark Streaming.",
      position: 6,
      lessons: [
        {
          title: "Introduction to Spark Streaming",
          description: "Learn real-time processing with Spark.",
          type: "VIDEO",
          videoUrl: "https://www.youtube.com/watch?v=5e3fXawSEJE", // Placeholder
          duration: 600, // 10 minutes
          position: lessonPosition++,
          isPreview: true,
        },
        {
          title: "Structured Streaming",
          description: "Use Structured Streaming for real-time data.",
          type: "TEXT",
          content: `
# Structured Streaming

1. **Read Stream**:
   - Example:
     \`\`\`python
     df_stream = spark.readStream.format("csv").option("header", "true").schema(schema).load("path/to/stream")
     \`\`\`

2. **Process and Write**:
   - Example:
     \`\`\`python
     query = df_stream.groupBy("region").count().writeStream.outputMode("complete").format("console").start()
     \`\`\`

**Practice**:
- Simulate streaming data (e.g., CSV files).
- Process with Structured Streaming.
- Summarize in 150 words.
          `,
          duration: 600, // 10 minutes
          position: lessonPosition++,
          isPreview: true,
        },
        {
          title: "Kafka Integration",
          description: "Integrate Spark with Kafka.",
          type: "TEXT",
          content: `
# Kafka Integration

1. **Read from Kafka**:
   - Example:
     \`\`\`python
     df_kafka = spark.readStream.format("kafka") \\
       .option("kafka.bootstrap.servers", "localhost:9092") \\
       .option("subscribe", "topic").load()
     \`\`\`

2. **Write to Kafka**:
   - Example:
     \`\`\`python
     query = df_kafka.writeStream.format("kafka") \\
       .option("kafka.bootstrap.servers", "localhost:9092") \\
       .option("topic", "output").start()
     \`\`\`

**Practice**:
- Set up a local Kafka instance.
- Read and write streaming data.
- Summarize in 150 words.
          `,
          duration: 600, // 10 minutes
          position: lessonPosition++,
          isPreview: false,
        },
        {
          title: "Assignment: Streaming Pipeline",
          description: "Build a streaming data pipeline.",
          type: "ASSIGNMENT",
          content: `
# Assignment: Streaming Pipeline

**Objective**: Process real-time data.

**Requirements**:
- Simulate streaming data (e.g., CSV or Kafka).
- Build a Structured Streaming pipeline.
- Aggregate data and output to console.
- Write a 300-word report on pipeline performance.

**Submission**:
- Submit your script and report.
          `,
          duration: 2400, // 40 minutes
          position: lessonPosition++,
          isPreview: false,
        },
      ],
    },
    {
      title: "Machine Learning with Spark MLlib",
      description: "Build ML models with Spark MLlib.",
      position: 7,
      lessons: [
        {
          title: "Introduction to MLlib",
          description: "Learn Spark’s machine learning library.",
          type: "VIDEO",
          videoUrl: "https://www.youtube.com/watch?v=5e3fXawSEJE", // Placeholder
          duration: 600, // 10 minutes
          position: lessonPosition++,
          isPreview: true,
        },
        {
          title: "Classification Models",
          description: "Build classification models with MLlib.",
          type: "TEXT",
          content: `
# Classification Models

1. **Logistic Regression**:
   - Example:
     \`\`\`python
     from pyspark.ml.classification import LogisticRegression
     lr = LogisticRegression(featuresCol="features", labelCol="label")
     model = lr.fit(training_df)
     \`\`\`

2. **Random Forest**:
   - Example:
     \`\`\`python
     from pyspark.ml.classification import RandomForestClassifier
     rf = RandomForestClassifier(featuresCol="features", labelCol="label")
     model = rf.fit(training_df)
     \`\`\`

**Practice**:
- Build a classification model.
- Summarize in 150 words.
          `,
          duration: 600, // 10 minutes
          position: lessonPosition++,
          isPreview: true,
        },
        {
          title: "Model Evaluation",
          description: "Evaluate ML models.",
          type: "TEXT",
          content: `
# Model Evaluation

1. **Accuracy**:
   - Example:
     \`\`\`python
     from pyspark.ml.evaluation import MulticlassClassificationEvaluator
     evaluator = MulticlassClassificationEvaluator(labelCol="label", metricName="accuracy")
     accuracy = evaluator.evaluate(predictions)
     \`\`\`

2. **Confusion Matrix**:
   - Example:
     \`\`\`python
     predictions.groupBy("label", "prediction").count().show()
     \`\`\`

**Practice**:
- Evaluate a model with accuracy and confusion matrix.
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
- Load a dataset.
- Build a classification model with MLlib.
- Evaluate with 2 metrics.
- Write a 300-word report on performance.

**Submission**:
- Submit your script and report.
          `,
          duration: 2400, // 40 minutes
          position: lessonPosition++,
          isPreview: false,
        },
      ],
    },
    {
      title: "Feature Engineering in Spark",
      description: "Create features for ML models.",
      position: 8,
      lessons: [
        {
          title: "Introduction to Feature Engineering",
          description: "Learn feature engineering in Spark.",
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

1. **One-Hot Encoding**:
   - Example:
     \`\`\`python
     from pyspark.ml.feature import OneHotEncoder, StringIndexer
     indexer = StringIndexer(inputCol="region", outputCol="region_index")
     encoder = OneHotEncoder(inputCols=["region_index"], outputCols=["region_encoded"])
     \`\`\`

2. **Scaling**:
   - Example:
     \`\`\`python
     from pyspark.ml.feature import StandardScaler
     scaler = StandardScaler(inputCol="features", outputCol="scaled_features")
     \`\`\`

**Practice**:
- Encode a categorical column and scale a numerical one.
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
     \`\`\`python
     df = df.groupBy("region").agg({"sales": "mean"}).withColumnRenamed("avg(sales)", "avg_sales")
     \`\`\`

2. **Feature Interactions**:
   - Example:
     \`\`\`python
     df = df.withColumn("sales_profit_ratio", col("sales") / col("profit"))
     \`\`\`

**Practice**:
- Create 2 features (aggregation, interaction).
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
- Submit your script and report.
          `,
          duration: 2400, // 40 minutes
          position: lessonPosition++,
          isPreview: false,
        },
      ],
    },
    {
      title: "Spark with Scala",
      description: "Use Scala for Spark programming.",
      position: 9,
      lessons: [
        {
          title: "Introduction to Scala with Spark",
          description: "Learn Scala for Spark applications.",
          type: "VIDEO",
          videoUrl: "https://www.youtube.com/watch?v=5e3fXawSEJE", // Placeholder
          duration: 600, // 10 minutes
          position: lessonPosition++,
          isPreview: true,
        },
        {
          title: "Scala Basics for Spark",
          description: "Master Scala syntax for Spark.",
          type: "TEXT",
          content: `
# Scala Basics for Spark

1. **Variables and Functions**:
   - Example:
     \`\`\`scala
     val data = Seq(1, 2, 3, 4, 5)
     def square(x: Int): Int = x * x
     \`\`\`

2. **RDD Operations**:
   - Example:
     \`\`\`scala
     import org.apache.spark.SparkContext
     val sc = new SparkContext("local", "ScalaApp")
     val rdd = sc.parallelize(data)
     val squared = rdd.map(square)
     squared.collect().foreach(println)
     \`\`\`

**Practice**:
- Write a Scala function and apply it to an RDD.
- Summarize in 150 words.
          `,
          duration: 600, // 10 minutes
          position: lessonPosition++,
          isPreview: true,
        },
        {
          title: "DataFrames in Scala",
          description: "Work with DataFrames in Scala.",
          type: "TEXT",
          content: `
# DataFrames in Scala

1. **Create DataFrame**:
   - Example:
     \`\`\`scala
     import org.apache.spark.sql.SparkSession
     val spark = SparkSession.builder.appName("ScalaDF").getOrCreate()
     import spark.implicits._
     val df = spark.read.option("header", "true").csv("data.csv")
     \`\`\`

2. **Operations**:
   - Example:
     \`\`\`scala
     df.filter($"sales" > 1000).groupBy("region").agg(sum("sales")).show()
     \`\`\`

**Practice**:
- Load a CSV and perform a filter/group operation.
- Summarize in 150 words.
          `,
          duration: 600, // 10 minutes
          position: lessonPosition++,
          isPreview: false,
        },
        {
          title: "Assignment: Scala with Spark",
          description: "Build a Spark application in Scala.",
          type: "ASSIGNMENT",
          content: `
# Assignment: Scala with Spark

**Objective**: Use Scala for Spark.

**Requirements**:
- Write a Scala Spark script.
- Load a dataset and perform:
  - 1 RDD operation.
  - 1 DataFrame operation.
- Write a 300-word report on Scala vs. PySpark.

**Submission**:
- Submit your script and report.
          `,
          duration: 2400, // 40 minutes
          position: lessonPosition++,
          isPreview: false,
        },
      ],
    },
    {
      title: "Optimizing Spark Applications",
      description: "Optimize Spark jobs for performance.",
      position: 10,
      lessons: [
        {
          title: "Introduction to Spark Optimization",
          description: "Learn optimization techniques.",
          type: "VIDEO",
          videoUrl: "https://www.youtube.com/watch?v=5e3fXawSEJE", // Placeholder
          duration: 600, // 10 minutes
          position: lessonPosition++,
          isPreview: true,
        },
        {
          title: "Partitioning and Caching",
          description: "Optimize with partitioning and caching.",
          type: "TEXT",
          content: `
# Partitioning and Caching

1. **Partitioning**:
   - Example:
     \`\`\`python
     df = df.repartition(10, "region")
     \`\`\`

2. **Caching**:
   - Example:
     \`\`\`python
     df.cache()
     \`\`\`

**Practice**:
- Repartition a DataFrame and cache it.
- Summarize performance impact in 150 words.
          `,
          duration: 600, // 10 minutes
          position: lessonPosition++,
          isPreview: true,
        },
        {
          title: "Tuning Configurations",
          description: "Adjust Spark configurations.",
          type: "TEXT",
          content: `
# Tuning Configurations

1. **Executor Memory**:
   - Example:
     \`\`\`python
     spark = SparkSession.builder.appName("App") \\
       .config("spark.executor.memory", "4g").getOrCreate()
     \`\`\`

2. **Parallelism**:
   - Example:
     \`\`\`python
     spark.conf.set("spark.default.parallelism", 100)
     \`\`\`

**Practice**:
- Adjust memory and parallelism settings.
- Summarize in 150 words.
          `,
          duration: 600, // 10 minutes
          position: lessonPosition++,
          isPreview: false,
        },
        {
          title: "Assignment: Optimize Spark Job",
          description: "Optimize a Spark application.",
          type: "ASSIGNMENT",
          content: `
# Assignment: Optimize Spark Job

**Objective**: Improve performance.

**Requirements**:
- Load a large dataset.
- Apply partitioning, caching, and 1 config tweak.
- Write a 300-word report on performance gains.

**Submission**:
- Submit your script and report.
          `,
          duration: 2400, // 40 minutes
          position: lessonPosition++,
          isPreview: false,
        },
      ],
    },
    {
      title: "Real-World Spark Applications",
      description: "Apply Spark to real-world problems.",
      position: 11,
      lessons: [
        {
          title: "Introduction to Spark Applications",
          description: "Explore real-world use cases.",
          type: "VIDEO",
          videoUrl: "https://www.youtube.com/watch?v=5e3fXawSEJE", // Placeholder
          duration: 600, // 10 minutes
          position: lessonPosition++,
          isPreview: true,
        },
        {
          title: "Log Analytics",
          description: "Analyze logs with Spark.",
          type: "TEXT",
          content: `
# Log Analytics

1. **Load Logs**:
   - Example:
     \`\`\`python
     df_logs = spark.read.json("logs.json")
     \`\`\`

2. **Analyze**:
   - Example:
     \`\`\`python
     df_logs.groupBy("status").count().show()
     \`\`\`

**Practice**:
- Load and analyze a log dataset.
- Summarize insights in 150 words.
          `,
          duration: 600, // 10 minutes
          position: lessonPosition++,
          isPreview: true,
        },
        {
          title: "Recommendation System",
          description: "Build a recommendation system.",
          type: "TEXT",
          content: `
# Recommendation System

1. **ALS Model**:
   - Example:
     \`\`\`python
     from pyspark.ml.recommendation import ALS
     als = ALS(userCol="userId", itemCol="itemId", ratingCol="rating")
     model = als.fit(df_ratings)
     \`\`\`

2. **Recommendations**:
   - Example:
     \`\`\`python
     recommendations = model.recommendForAllUsers(10)
     \`\`\`

**Practice**:
- Build a simple ALS recommender.
- Summarize in 150 words.
          `,
          duration: 600, // 10 minutes
          position: lessonPosition++,
          isPreview: false,
        },
        {
          title: "Assignment: Spark Application",
          description: "Build a real-world application.",
          type: "ASSIGNMENT",
          content: `
# Assignment: Spark Application

**Objective**: Solve a real-world problem.

**Requirements**:
- Choose a use case (e.g., log analytics, recommender).
- Load a dataset and build a Spark pipeline.
- Write a 300-word report on results.

**Submission**:
- Submit your script and report.
          `,
          duration: 2400, // 40 minutes
          position: lessonPosition++,
          isPreview: false,
        },
      ],
    },
    {
      title: "Capstone: Big Data Pipeline",
      description: "Build a complete big data pipeline with Spark.",
      position: 12,
      lessons: [
        {
          title: "Planning a Big Data Pipeline",
          description: "Structure a Spark pipeline.",
          type: "VIDEO",
          videoUrl: "https://www.youtube.com/watch?v=5e3fXawSEJE", // Placeholder
          duration: 600, // 10 minutes
          position: lessonPosition++,
          isPreview: true,
        },
        {
          title: "Data Ingestion and Cleaning",
          description: "Ingest and clean data.",
          type: "TEXT",
          content: `
# Data Ingestion and Cleaning

**Steps**:
1. **Ingest**:
   - Example:
     \`\`\`python
     df = spark.read.csv("s3a://bucket/data.csv", header=True)
     \`\`\`
2. **Clean**:
   - Example:
     \`\`\`python
     df = df.dropna().filter(col("sales") < col("sales").quantile(0.99))
     \`\`\`

**Practice**:
- Ingest and clean a dataset.
- Summarize in 150 words.
          `,
          duration: 600, // 10 minutes
          position: lessonPosition++,
          isPreview: true,
        },
        {
          title: "Analysis and Visualization",
          description: "Analyze and visualize results.",
          type: "TEXT",
          content: `
# Analysis and Visualization

1. **Analysis**:
   - Example:
     \`\`\`python
     df_agg = df.groupBy("region").agg({"sales": "sum"})
     \`\`\`

2. **Visualization**:
   - Example:
     \`\`\`python
     import matplotlib.pyplot as plt
     pandas_df = df_agg.toPandas()
     plt.bar(pandas_df["region"], pandas_df["sum(sales)"])
     plt.savefig("sales.png")
     \`\`\`

**Practice**:
- Analyze data and create a visualization.
- Summarize in 150 words.
          `,
          duration: 600, // 10 minutes
          position: lessonPosition++,
          isPreview: false,
        },
        {
          title: "Final Project: Big Data Pipeline",
          description: "Develop a complete pipeline.",
          type: "ASSIGNMENT",
          content: `
# Final Project: Big Data Pipeline

**Objective**: Build a pipeline.

**Requirements**:
- Choose a use case (e.g., sales analysis).
- Load a dataset (e.g., Kaggle).
- Perform:
  - Ingestion and cleaning.
  - Analysis with DataFrames/SQL.
  - Build an ML model or streaming pipeline.
- Create 2 visualizations.
- Develop a 5–7 slide presentation.
- Write a 400-word reflection.

**Submission**:
- Submit your script, visualizations, presentation, and reflection.
          `,
          duration: 10800, // 180 minutes (3 hours)
          position: lessonPosition++,
          isPreview: false,
        },
        {
          title: "Quiz: Big Data Pipelines",
          description: "Test your knowledge of Spark pipelines.",
          type: "QUIZ",
          content: `
# Quiz: Big Data Pipelines

**Instructions**: Answer the following questions.

1. **What is the first step in a Spark pipeline?**
   - A) Build model
   - B) Ingest data
   - C) Visualize data
   - D) Optimize job
   - **Answer**: B

2. **Why clean data in Spark?**
   - A) Improve visuals
   - B) Ensure accuracy
   - C) Reduce size
   - D) Simplify code
   - **Answer**: B

3. **What should a pipeline presentation include?**
   - **Answer**: Problem, pipeline, insights, recommendations.
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
