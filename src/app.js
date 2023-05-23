import cors from "cors";
import dotenv from "dotenv";
import express from "express";

dotenv.config({
  path: "./.env",
});

const app = express();

// global middlewares
app.use(
  cors({
    origin: "*",
    credentials: true,
  })
);
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));

// api routes
import { errorHandler } from "./middlewares/error.middlewares.js";
import healthcheckRouter from "./routes/healthcheck.routes.js";
import randomuserRouter from "./routes/public/randomuser.routes.js";
import randomproductRouter from "./routes/public/randomproduct.routes.js";
import randomjokeRouter from "./routes/public/randomjoke.routes.js";
import bookRouter from "./routes/public/book.routes.js";

app.use("/api/v1/healthcheck", healthcheckRouter);
app.use("/api/v1/public/randomusers", randomuserRouter);
app.use("/api/v1/public/randomproducts", randomproductRouter);
app.use("/api/v1/public/randomjokes", randomjokeRouter);
app.use("/api/v1/public/books", bookRouter);

// common error handling middleware
app.use(errorHandler);

export { app };
