import morgan from "morgan";
import logger from "../winston/index.js";

const morganMiddleware = morgan(
  ":method :url :status :res[content-length] - :response-time ms",
  {
    stream: {
      write: (message) => {
        logger.http(message.trim());
      },
    },
    skip: (req, res) => res.statusCode < 400,
  }
);

export default morganMiddleware;
