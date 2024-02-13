const express = require('express');
const { ApolloServer } = require('@apollo/server');
const { expressMiddleware } = require('@apollo/server/express4');
const path = require('path');
//const routes = require('./routes/index');

const { typeDefs, resolvers } = require('./schemas');
const db = require('./config/connection');
const { authMiddleware } = require('./utils/auth');

const PORT = process.env.PORT || 3001;
const app = express();
const server = new ApolloServer({
  typeDefs,
  resolvers,
  //context: ({ req }) => {
    // Apply the auth middleware to every request
    //const auth = authMiddleware({ req });
    //return { auth };
  //},
});
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Create a new instance of an Apollo server with the GraphQL schema
const startApolloServer = async () => {
  await server.start();
 // server.applyMiddleware({ app });
  //app.use(routes);
  
  //require('./routes/index')(app);
 

  app.use('/graphql', expressMiddleware(server, {
    context: authMiddleware
  }));
 

if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/build')));

  //app.get('*', (req, res) => {
  //  res.sendFile(path.join(__dirname, '../client/build'));
 // });
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/build/index.html'));
  });
} 

  db.once('open', () => {
    app.listen(PORT, () => {
      console.log(`Now listening on: ${PORT}!`);
      console.log(`Use GraphQL at http://localhost:${PORT}/graphql`);
    })
  })
};

// Call the async function to start the server
startApolloServer();

