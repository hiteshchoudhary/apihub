import dotenv from "dotenv";
import { app } from "./app.js";
import connectDB from "./db/index.js";

dotenv.config({
  path: "./.env",
});
/**
 * Starting from Node.js v14 top-level await is available and it is only available in ES modules.
 * This means you can not use it with common js modules or Node version < 14.
 */
const majorNodeVersion = +process.env.NODE_VERSION?.split(".")[0] || 0;

if (majorNodeVersion >= 14) {
  try {
    await connectDB();
    app.listen(process.env.PORT || 8080, () =>
      console.log("Server is running on port: " + process.env.PORT)
    );
  } catch (err) {
    console.log("Mongo db connect error: ", err);
  }
} else {
  connectDB()
    .then(() => {
      app.listen(process.env.PORT || 8080, () =>
        console.log("Server is running on port: " + process.env.PORT)
      );
    })
    .catch((err) => {
      console.log("Mongo db connect error: ", err);
    });
}
