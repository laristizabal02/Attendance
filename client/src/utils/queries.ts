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