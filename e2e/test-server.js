import dotenv from "dotenv";
dotenv.config({
  path: "../.env",
});
import { httpServer } from "../src/app.js";
import connectDB from "./db.js";

const PORT = process.env.PORT || 8080;

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
