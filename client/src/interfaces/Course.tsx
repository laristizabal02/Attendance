export interface Course {
    _id: string;
    title: string;
    instructor: {
      _id: string;
      username: string;
    };
    students: {
      _id: string;
      username: string;
    }[];
  }