const { MongoClient,ServerApiVersion  } = require('mongodb');
const env = require("dotenv").config()
const uri = process.env.MONGODB_URI;

const client = new MongoClient(uri,{
    serverApi: {
      version: ServerApiVersion.v1,
      strict: true,
      deprecationErrors: true,
    }
  });

module.exports = client;