import { Router } from "express";
import {
  deleteMessage,
  getAllMessages,
  sendMessage,
} from "../../../controllers/apps/chat-app/message.controllers.js";
import { verifyJWT } from "../../../middlewares/auth.middlewares.js";
import { upload } from "../../../middlewares/multer.middlewares.js";
import { sendMessageValidator } from "../../../validators/apps/chat-app/message.validators.js";
import { mongoIdPathVariableValidator } from "../../../validators/common/mongodb.validators.js";
import { validate } from "../../../validators/validate.js";

const router = Router();

router.use(verifyJWT);

router
  .route("/:chatId")
  .get(mongoIdPathVariableValidator("chatId"), validate, getAllMessages)
  .post(
    upload.fields([{ name: "attachments", maxCount: 5 }]),
    mongoIdPathVariableValidator("chatId"),
    sendMessageValidator(),
    validate,
    sendMessage
  );

//attachment id is optional for multiple attachments in a single message

router.route("/:chatId/:messageId/:attachmentId?").delete(
  mongoIdPathVariableValidator("chatId"),
  mongoIdPathVariableValidator("messageId"),
  (req, res, next) => {
    if (!req.params.attachmentId) {
      return next();
    }
    mongoIdPathVariableValidator("attachmentId")[0](req, res, next);
  },
  validate,
  deleteMessage
);

export default router;
