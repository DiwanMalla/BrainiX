export interface Student {
  id: string; // Matches User.id
  name: string; // User.name
  email: string; // User.email
  image?: string; // User.image
  studentProfile: {
    id: string; // StudentProfile.id
    interests: string[]; // StudentProfile.interests
    totalCourses: number; // StudentProfile.totalCourses
    completedCourses: number; // StudentProfile.completedCourses
    createdAt: string; // StudentProfile.createdAt (ISO string)
  };
  enrollments: {
    courseId: string; // Enrollment.courseId
    courseTitle: string; // Derived from Course.title
    status: "ACTIVE" | "COMPLETED" | "EXPIRED" | "REFUNDED"; // Enrollment.status
    progress: number; // Derived from Progress (average % completed)
    enrollmentDate: string; // Enrollment.createdAt (ISO string)
    lastActive: string; // Last Progress.updatedAt (ISO string)
  }[];
  country?: string; // Optional field for display
}

const studentsData: Student[] = [
  {
    id: "student-1",
    name: "Alex Johnson",
    email: "alex.johnson@example.com",
    image:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&auto=format&fit=crop&w=634&q=80",
    studentProfile: {
      id: "sp-1",
      interests: ["Web Development", "React"],
      totalCourses: 2,
      completedCourses: 0,
      createdAt: "2023-05-15T00:00:00Z",
    },
    enrollments: [
      {
        courseId: "1",
        courseTitle: "Web Development Bootcamp",
        status: "ACTIVE",
        progress: 65,
        enrollmentDate: "2023-05-15T00:00:00Z",
        lastActive: "2023-06-10T00:00:00Z",
      },
      {
        courseId: "5",
        courseTitle: "React and Redux in Depth",
        status: "ACTIVE",
        progress: 30,
        enrollmentDate: "2023-05-20T00:00:00Z",
        lastActive: "2023-06-08T00:00:00Z",
      },
    ],
    country: "United States",
  },
  {
    id: "student-2",
    name: "Maria Garcia",
    email: "maria.garcia@example.com",
    image:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=crop&w=634&q=80",
    studentProfile: {
      id: "sp-2",
      interests: ["Data Science"],
      totalCourses: 1,
      completedCourses: 0,
      createdAt: "2023-04-22T00:00:00Z",
    },
    enrollments: [
      {
        courseId: "2",
        courseTitle: "Data Science Fundamentals",
        status: "ACTIVE",
        progress: 42,
        enrollmentDate: "2023-04-22T00:00:00Z",
        lastActive: "2023-06-12T00:00:00Z",
      },
    ],
    country: "Spain",
  },
  {
    id: "student-3",
    name: "John Smith",
    email: "john.smith@example.com",
    image:
      "https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-1.2.1&auto=format&fit=crop&w=634&q=80",
    studentProfile: {
      id: "sp-3",
      interests: ["Web Development"],
      totalCourses: 1,
      completedCourses: 1,
      createdAt: "2023-03-10T00:00:00Z",
    },
    enrollments: [
      {
        courseId: "1",
        courseTitle: "Web Development Bootcamp",
        status: "COMPLETED",
        progress: 89,
        enrollmentDate: "2023-03-10T00:00:00Z",
        lastActive: "2023-06-08T00:00:00Z",
      },
    ],
    country: "Canada",
  },
  {
    id: "student-4",
    name: "Priya Patel",
    email: "priya.patel@example.com",
    image:
      "https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-1.2.1&auto=format&fit=crop&w=634&q=80",
    studentProfile: {
      id: "sp-4",
      interests: ["UX/UI Design", "Web Development"],
      totalCourses: 2,
      completedCourses: 0,
      createdAt: "2023-05-30T00:00:00Z",
    },
    enrollments: [
      {
        courseId: "3",
        courseTitle: "UX/UI Design Masterclass",
        status: "ACTIVE",
        progress: 23,
        enrollmentDate: "2023-05-30T00:00:00Z",
        lastActive: "2023-06-11T00:00:00Z",
      },
      {
        courseId: "1",
        courseTitle: "Web Development Bootcamp",
        status: "ACTIVE",
        progress: 15,
        enrollmentDate: "2023-06-01T00:00:00Z",
        lastActive: "2023-06-10T00:00:00Z",
      },
    ],
    country: "India",
  },
  {
    id: "student-5",
    name: "David Kim",
    email: "david.kim@example.com",
    image:
      "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-1.2.1&auto=format&fit=crop&w=634&q=80",
    studentProfile: {
      id: "sp-5",
      interests: ["Data Science", "Python"],
      totalCourses: 1,
      completedCourses: 1,
      createdAt: "2023-02-18T00:00:00Z",
    },
    enrollments: [
      {
        courseId: "4",
        courseTitle: "Python for Data Analysis",
        status: "COMPLETED",
        progress: 95,
        enrollmentDate: "2023-02-18T00:00:00Z",
        lastActive: "2023-06-09T00:00:00Z",
      },
    ],
    country: "South Korea",
  },
];

export function getAllStudents(): Student[] {
  return studentsData;
}

export function getStudentById(id: string): Student | undefined {
  return studentsData.find((student) => student.id === id);
}

export function getStudentsByInstructorCourses(
  instructorCourses: string[]
): Student[] {
  return studentsData.filter((student) =>
    student.enrollments.some((enrollment) =>
      instructorCourses.includes(enrollment.courseId)
    )
  );
}
