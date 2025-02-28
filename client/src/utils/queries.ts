import { gql } from '@apollo/client';

export const QUERY_USER = gql`
  query user($username: String!) {
    user(username: $username) {
      _id
      username
      email
      }
    }
  
`;

export const QUERY_COURSES = gql`
  query courses {
    courses {
      _id
      title
      instructor {
        _id
        username
      }
      students {
        _id
        username
      }
    }
  }
`;

export const QUERY_COURSE_STUDENTS = gql`
  query getCourseStudents($courseId: ID!) {
    courseStudents(courseId: $courseId) {
      _id
      username
      email
    }
  }
`;