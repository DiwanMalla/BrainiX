model User {
  id        Int         @id @default(autoincrement())
  clerkId   String      @unique
  enrollments Enrollment[]
}

model Course {
  id            String      @id @default(uuid())
  slug          String      @unique
  title         String
  thumbnail     String?
  price         Float
  discountPrice Float?
  instructorId  Int
  instructor    Instructor  @relation(fields: [instructorId], references: [id])
  enrollments   Enrollment[]
  lessons       Lesson[]
}

model Instructor {
  id      Int      @id @default(autoincrement())
  name    String
  courses Course[]
}

model Enrollment {
  id        Int      @id @default(autoincrement())
  userId    Int
  courseId  String
  createdAt DateTime @default(now())
  user      User     @relation(fields: [userId], references: [id])
  course    Course   @relation(fields: [courseId], references: [id])
  progress  Progress[]
}

model Lesson {
  id        String   @id @default(uuid())
  courseId  String
  title     String
  duration  Int
  course    Course   @relation(fields: [courseId], references: [id])
  progress  Progress[]
}

model Progress {
  id        Int      @id @default(autoincrement())
  enrollmentId Int
  lessonId  String
  completed Boolean  @default(false)
  enrollment Enrollment @relation(fields: [enrollmentId], references: [id])
  lesson    Lesson   @relation(fields: [lessonId], references: [id])
}