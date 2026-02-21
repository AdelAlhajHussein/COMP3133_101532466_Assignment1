const express = require("express");
const { ApolloServer, gql } = require("apollo-server-express");
const mongoose = require("mongoose");
require("dotenv").config();

const app = express();

const typeDefs = gql`
  type Query {
    test: String
  }
`;

const resolvers = {
    Query: {
        test: () => "Server working",
    },
};

async function startServer() {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB connected");

    const server = new ApolloServer({ typeDefs, resolvers });
    await server.start();
    server.applyMiddleware({ app });

    app.listen(process.env.PORT || 4000, () => {
        console.log(`Server running on http://localhost:${process.env.PORT || 4000}/graphql`);
    });
}

startServer().catch((err) => console.error(err));