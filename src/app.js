import cookieParser from "cookie-parser";
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

// TODO: resolve issue with parsing the form data
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public")); // configure static file to save images locally
app.use(cookieParser());

// api routes
import { errorHandler } from "./middlewares/error.middlewares.js";
import healthcheckRouter from "./routes/healthcheck.routes.js";

// * Public routes
import bookRouter from "./routes/public/book.routes.js";
import catRouter from "./routes/public/cat.routes.js";
import dogRouter from "./routes/public/dog.routes.js";
import mealRouter from "./routes/public/meal.routes.js";
import quoteRouter from "./routes/public/quote.routes.js";
import randomjokeRouter from "./routes/public/randomjoke.routes.js";
import randomproductRouter from "./routes/public/randomproduct.routes.js";
import randomuserRouter from "./routes/public/randomuser.routes.js";

// * App routes
import userRouter from "./routes/apps/auth/user.routes.js";
import categoryRouter from "./routes/apps/ecommerce/category.routes.js";
import addressRouter from "./routes/apps/ecommerce/address.routes.js";
import profileRouter from "./routes/apps/ecommerce/profile.routes.js";
import productRouter from "./routes/apps/ecommerce/product.routes.js";
import cartRouter from "./routes/apps/ecommerce/cart.routes.js";
import orderRouter from "./routes/apps/ecommerce/order.routes.js";

app.use("/api/v1/healthcheck", healthcheckRouter);

// * Public apis
// TODO: More functionality specific to the type of api, can be added in the future
app.use("/api/v1/public/randomusers", randomuserRouter);
app.use("/api/v1/public/randomproducts", randomproductRouter);
app.use("/api/v1/public/randomjokes", randomjokeRouter);
app.use("/api/v1/public/books", bookRouter);
app.use("/api/v1/public/quotes", quoteRouter);
app.use("/api/v1/public/meals", mealRouter);
app.use("/api/v1/public/dogs", dogRouter);
app.use("/api/v1/public/cats", catRouter);

// * App apis
app.use("/api/v1/users", userRouter);
app.use("/api/v1/ecommerce/categories", categoryRouter);
app.use("/api/v1/ecommerce/addresses", addressRouter);
app.use("/api/v1/ecommerce/products", productRouter);
app.use("/api/v1/ecommerce/profile", profileRouter);
app.use("/api/v1/ecommerce/cart", cartRouter);
app.use("/api/v1/ecommerce/orders", orderRouter);

// common error handling middleware
app.use(errorHandler);

export { app };
