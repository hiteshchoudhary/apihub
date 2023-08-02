import { Router } from "express";
import {
  getAllMessages,
  sendMessage,
} from "../../../controllers/apps/chat-app/message.controllers.js";
import { verifyJWT } from "../../../middlewares/auth.middlewares.js";
import { sendMessageValidator } from "../../../validators/apps/chat-app/message.validators.js";
import { mongoIdPathVariableValidator } from "../../../validators/common/mongodb.validators.js";
import { validate } from "../../../validators/validate.js";

const router = Router();

router.use(verifyJWT);

router
  .route("/:chatId")
  .get(mongoIdPathVariableValidator("chatId"), validate, getAllMessages)
  .post(
    mongoIdPathVariableValidator("chatId"),
    sendMessageValidator(),
    validate,
    sendMessage
  );

export default router;
