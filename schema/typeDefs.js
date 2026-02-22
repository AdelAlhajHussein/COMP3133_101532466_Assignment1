const { gql } = require("apollo-server-express");

const typeDefs = gql`
  type User {
    _id: ID!
    username: String!
    email: String!
    created_at: String
    updated_at: String
  }

  type Employee {
    _id: ID!
    first_name: String!
    last_name: String!
    email: String!
    gender: String!
    designation: String!
    salary: Float!
    date_of_joining: String!
    department: String!
    employee_photo: String
    created_at: String
    updated_at: String
  }

  type AuthPayload {
  status: Boolean!
  message: String!
  token: String
  user: User
  }
  
  type Query {
  test: String
  login(usernameOrEmail: String!, password: String!): AuthPayload!
  employees: [Employee]
  }

  type Mutation {
  signup(username: String!, email: String!, password: String!): AuthPayload!
  addEmployee(input: EmployeeInput!): Employee
  }
  
  input EmployeeInput {
  first_name: String!
  last_name: String!
  email: String!
  gender: String!
  designation: String!
  salary: Float!
  date_of_joining: String!
  department: String!
  employee_photo: String
  }
`;

module.exports = typeDefs;