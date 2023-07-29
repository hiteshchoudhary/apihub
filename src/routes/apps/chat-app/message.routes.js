import { Router } from "express";
import {
  getAllMessages,
  sendMessage,
} from "../../../controllers/apps/chat-app/message.controllers.js";
import { verifyJWT } from "../../../middlewares/auth.middlewares.js";
import { chatIdPathVariableValidator } from "../../../validators/apps/chat-app/chat.validators.js";
import { validate } from "../../../validators/validate.js";
import { sendMessageValidator } from "../../../validators/apps/chat-app/message.validators.js";

const router = Router();

router.use(verifyJWT);

router
  .route("/:chatId")
  .get(chatIdPathVariableValidator(), validate, getAllMessages)
  .post(
    chatIdPathVariableValidator(),
    sendMessageValidator(),
    validate,
    sendMessage
  );

export default router;
