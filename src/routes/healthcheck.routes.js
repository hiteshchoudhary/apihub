import { Router } from "express";
import { healthcheck } from "../controllers/healthcheck.controllers.js";

const router = Router();

router.route("/").get((req, res) => {
  const error = new Error("An example error occurred");
  error.status = 500; // Set the status code of the error
  next(error); // Pass the error to the next middleware
});

export default router;
