import devLogger from "./dev.logger.js";
let logger = null;

//create the logger and set them according to the environment

// If the environment is development, use the devLogger
if (process.env.NODE_ENV === "development") {
  logger = devLogger();
}

export default logger;
