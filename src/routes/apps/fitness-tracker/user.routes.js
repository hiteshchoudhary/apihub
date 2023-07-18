import { Router } from "express";

import{
    getAllUsers,
    addUsers
} from "../../../controllers/apps/fitness-tracker/user.controller.js"

const router = Router();

router
    .route("/")
    .get(getAllUsers)

router
    .route("/add")
    .post(addUsers)

export default router;