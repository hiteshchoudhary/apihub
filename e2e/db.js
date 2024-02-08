import mongoose, { mongo } from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";

let mongoServer = null;
let dbInstance = undefined;
let MONGO_PORT = process.env.MONGODB_PORT || 10000;
let MONGO_URL = `mongodb://127.0.0.1:${MONGO_PORT}/`;

const connectDB = async () => {
  try {
    await mongoose.disconnect();
    mongoServer = await MongoMemoryServer.create({
      instance: {
        port: +MONGO_PORT,
      },
    });
    dbInstance = await mongoose.connect(MONGO_URL);
  } catch (error) {
    console.log("Mongo db connect error: ", error);
    process.exit(1);
  }
};
export const clearDB = async (collectionName = null) => {
  if (!dbInstance) {
    dbInstance = await mongoose.connect(MONGO_URL);
  }
  const connection = mongoose.connection;
  if (collectionName) {
    await connection.db.collection(collectionName).deleteMany({});
  } else {
    const collections = await connection.db.listCollections().toArray();
    const collectionNames = collections.map((col) => col.name);
    for (let name of collectionNames) {
      await connection.db.collection(name).deleteMany({});
    }
  }
};

export default connectDB;
