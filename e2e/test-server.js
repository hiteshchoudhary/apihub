import dotenv from "dotenv";
import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import { httpServer } from "../src/app.js";

dotenv.config({
  path: "../.env",
});

let mongoServer = null;
let dbInstance = undefined;
const PORT = process.env.PORT || 8080;

const connectDB = async () => {
  try {
    await mongoose.disconnect();
    mongoServer = await MongoMemoryServer.create();
    dbInstance = await mongoose.connect(`${mongoServer.getUri()}`);
    await clearDB();
  } catch (error) {
    console.log("Mongo db connect error: ", error);
    process.exit(1);
  }
};
export const clearDB = async () => {
  const collections = mongoose.connection.collections;

  for (const key in collections) {
    const collection = collections[key];
    await collection.deleteMany({});
  }
};

/**
 * Starting from Node.js v14 top-level await is available and it is only available in ES modules.
 * This means you can not use it with common js modules or Node version < 14.
 */
const majorNodeVersion = +process.env.NODE_VERSION?.split(".")[0] || 0;

const startServer = () => {
  httpServer.listen(PORT, () => {
    console.info(`📑 Visit the documentation at: http://localhost:${PORT}`);
    console.log("⚙️  Server is running on port: " + PORT);
  });
};

if (majorNodeVersion >= 14) {
  try {
    await connectDB();
    startServer();
  } catch (err) {
    console.log("Mongo db connect error: ", err);
  }
} else {
  connectDB()
    .then(() => {
      startServer();
    })
    .catch((err) => {
      console.log("Mongo db connect error: ", err);
    });
}
