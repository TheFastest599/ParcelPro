const mongoose = require('mongoose');
const path = require('path');
const dotenv = require('dotenv');
// Try to load .env from root, fallback to backend/.env
const rootEnv = path.resolve(__dirname, '../.env.backend');
const rootEnvDefault = path.resolve(__dirname, '../.env');
const backendEnv = path.resolve(__dirname, './.env');
if (
  !dotenv.config({ path: rootEnv }).error ||
  !dotenv.config({ path: rootEnvDefault }).error
) {
  // Loaded from root
} else {
  dotenv.config({ path: backendEnv });
}
const mongoURI = process.env.MONGO_URI;

const connectToMongo = async () => {
  await mongoose.connect(mongoURI);
  console.log('Connected to Mongo Successfully');
};

module.exports = connectToMongo;
