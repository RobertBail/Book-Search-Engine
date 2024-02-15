const typeDefs = `
  type User {
    _id: ID
    username: String
    email: String
    password: String
    bookCount: Int
    savedBooks: [Book]
  }

  type Book {
    bookId: ID!
    authors: [String]
    description: String
    title: String!
    image: String
    link: String
    
  }

  type Auth {
    token: ID!
    user: User
  }

  input InputBook {
    bookId: String
    authors: [String]
    title: String
    description: String
    image: String
    link: String
  }

  type Query {
    me: User
  }

  type Mutation {
    addUser(username: String!, email: String!, password: String!): Auth
    login(email: String!, password: String!): Auth
    saveBook(newBook: InputBook!): User
    deleteBook(bookId: ID!): User
  }
`;

module.exports = typeDefs;
