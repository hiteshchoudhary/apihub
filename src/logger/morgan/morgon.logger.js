import morgan from "morgan";
import logger from "../winston/index.js";
const morganMiddleWare = morgan(
  ":method :url :status :res[content-length] - :response-time ms",
  {
    stream: {
      write: (message) => {
        // Use the logger from winston to log http requests
        logger.http(message.trim());
      },
    },
  }
);

export default morganMiddleWare;
