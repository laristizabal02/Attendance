const typeDefs = `

type Instructor {
  _id: ID!
  username: String!
  email: String!
}

type Student {
  _id: ID!
  username: String!
  email: String!
}

input InstructorInput {
  username: String!
  email: String!
}

input StudentInput {
  username: String!
  email: String!
}

  type User {
    _id: ID
    username: String
    email: String
    password: String
  }

  input UserInput {
    username: String!
    email: String!
    password: String!
  }

   type Course {
    _id: ID
    title: String
    instructor: Instructor
    students: [Student]
  }

  input CourseInput {
    title: String!
    instructor: ID!
    students: [ID!]
  }
  
 type Attendance {
  date: String!
  status: String!
  student: Student!
}
  
  input AttendanceInput {
  studentId: ID!
  status: String!
}

type ResponseMessage {
  success: Boolean!
  message: String!
}


  type Auth {
    token: ID!
    user: User
  }

  type Query {
    users: [User]
    user(username: String!): User
    me: User
    courses: [Course]
    course(_id: ID!): Course
    getInstructor(id: ID!): Instructor
  getStudent(id: ID!): Student
  allStudents: [Student]
  attendanceByCourseAndDate(courseId: ID!, date: String!): [Attendance]!
  attendance(courseId: ID!, date: String!): [Attendance!]!
  getAttendanceByDate(courseId: ID!, date: String!): [Attendance]
  }

  type Query {
  users: [User]
  user(username: String!): User
  me: User
  courses: [Course]
  course(_id: ID!): Course
  getInstructor(id: ID!): Instructor
  getStudent(id: ID!): Student
  courseStudents(courseId: ID!): [Student] 
  allStudents: [Student]
  attendanceByCourseAndDate(courseId: ID!, date: String!): [Attendance]!
  attendance(courseId: ID!, date: String!): [Attendance!]!
  getAttendanceByDate(courseId: ID!, date: String!): [Attendance]
}

  type Mutation {
    addUser(input: UserInput!): Auth
    login(email: String!, password: String!): Auth
    addCourse(input: CourseInput!): Course
    updateCourse(_id: ID!, title: String): Course
    deleteCourse(_id: ID!): Course
    addInstructor(input: InstructorInput!): Instructor
    addStudentToCourse(courseId: ID!, studentId: ID!): Course
    addStudent(username: String!, email: String!): Student
    addAttendance(courseId: ID!, date: String!, attendance: [AttendanceInput!]!): [Attendance!]! 
  }
`;

export default typeDefs;
