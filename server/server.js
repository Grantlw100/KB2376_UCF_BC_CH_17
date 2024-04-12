const express = require('express');
require('dotenv').config();
const path = require('path');
const { ApolloServer } = require('apollo-server-express');
const db = require('./config/connection');
const { typeDefs, resolvers } = require('./schemas');
const { authMiddleware } = require('./utils/auth');
const app = express();
const PORT = process.env.PORT;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/dist')));
}

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: async ({ req }) => {
    // The authMiddleware now returns { user: data } or null
    const auth = authMiddleware({ req });
    return {
      // Spread the user info (if any) directly into the context
      ...auth,
    };
  },
});

// Correctly starting the Apollo Server before applying middleware
async function startServer() {
  await server.start();
  server.applyMiddleware({ app, path: '/graphql' });
  
  db.once('open', () => {
    app.listen(PORT, () => {
      console.log(`🌍 Now listening on localhost:${PORT}`);
      console.log(`Use GraphQL at http://localhost:${PORT}${server.graphqlPath}`);
    });
  });
}

startServer();
