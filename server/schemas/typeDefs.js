const { gql } = require('apollo-server-express');

const typeDefs = gql`
  type User {
    _id: ID
    username: String
    email: String
    password: String
    savedBooks: [Book]
  }

  type Book {
    bookId: String
    authors: [String]
    description: String
    title: String
    image: String
    link: String
  }

  type Auth {
    token: ID!
    user: User
  }

  type Query {
    me(userId: ID, username: String): User
    # Consider implementing more queries as needed for your application
  }

  type Mutation {
    createUser(username: String!, email: String!, password: String!): Auth
    login(username: String, email: String, password: String!): Auth
    saveBook(bookData: BookInput!): User
    deleteBook(bookId: ID!): User
  }

  input BookInput {
    bookId: String!
    authors: [String]
    description: String
    title: String
    image: String
    link: String
  }
`;

module.exports = typeDefs;