import { createLogger, format, transports } from "winston";

const { combine, timestamp, simple, errors, align, printf } = format;
const devLogger = () => {
  return createLogger({
    level: process.env.LOG_LEVEL || "info",
    format: combine(
      timestamp({
        format: "YYYY-MM-DD hh:mm:ss.SSS A",
      }),
      printf((info) => `[${info.timestamp}] ${info.level}: ${info.message}`)
    ),
    transports: [new transports.Console()],
  });
};

export default devLogger;
