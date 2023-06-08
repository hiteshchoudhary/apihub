import mongoose from "mongoose";

const connectDB = async () => {
  try {
    const connectionInstance = await mongoose.connect(process.env.MONGODB_URI);
    // NOTE: command to drop mongo database
    // console.log(connectionInstance.connection.db.dropDatabase({
    //   dbName:"apihub"
    // }));
    console.log(`MongoDB Connected! ${connectionInstance.connection.host}`);
  } catch (error) {
    console.log("MongoDB connection error: ", error);
    process.exit(1);
  }
};

export default connectDB;
