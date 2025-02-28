import { gql } from '@apollo/client';

export const LOGIN_USER = gql`
  mutation login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      token
      user {
        _id
        username
      }
    }
  }
`;

export const ADD_USER = gql`
  mutation Mutation($input: UserInput!) {
  addUser(input: $input) {
    user {
      username
      _id
    }
    token
  }
}
`;

export const ADD_COURSE = gql`
  mutation addCourse($input: CourseInput!) {
    addCourse(input: $input) {
      _id
      title
      instructor {
        _id
        username
      }
    }
  }
`;

export const UPDATE_COURSE = gql`
  mutation updateCourse($_id: ID!, $title: String) {
    updateCourse(_id: $_id, title: $title) {
      _id
      title
    }
  }
`;

export const DELETE_COURSE = gql`
  mutation deleteCourse($_id: ID!) {
    deleteCourse(_id: $_id) {
      _id
      title
    }
  }
`;