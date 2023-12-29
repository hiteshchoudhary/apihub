import { Router } from "express";
import { chatController } from "../../../controllers/apps/chat-app/index.js";
import { verifyJWT } from "../../../middlewares/auth.middlewares.js";
import {
  createAGroupChatValidator,
  updateGroupChatNameValidator,
} from "../../../validators/apps/chat-app/chat.validators.js";
import { mongoIdPathVariableValidator } from "../../../validators/common/mongodb.validators.js";
import { validate } from "../../../validators/validate.js";

const router = Router();

router.use(verifyJWT);

router.route("/").get(chatController.getAllChats);

router.route("/users").get(chatController.searchAvailableUsers);

router
  .route("/c/:receiverId")
  .post(
    mongoIdPathVariableValidator("receiverId"),
    validate,
    chatController.createOrGetAOneOnOneChat
  );

router
  .route("/group")
  .post(createAGroupChatValidator(), validate, chatController.createAGroupChat);

router
  .route("/group/:chatId")
  .get(
    mongoIdPathVariableValidator("chatId"),
    validate,
    chatController.getGroupChatDetails
  )
  .patch(
    mongoIdPathVariableValidator("chatId"),
    updateGroupChatNameValidator(),
    validate,
    chatController.renameGroupChat
  )
  .delete(
    mongoIdPathVariableValidator("chatId"),
    validate,
    chatController.deleteGroupChat
  );

router
  .route("/group/:chatId/:participantId")
  .post(
    mongoIdPathVariableValidator("chatId"),
    mongoIdPathVariableValidator("participantId"),
    validate,
    chatController.addNewParticipantInGroupChat
  )
  .delete(
    mongoIdPathVariableValidator("chatId"),
    mongoIdPathVariableValidator("participantId"),
    validate,
    chatController.removeParticipantFromGroupChat
  );

router
  .route("/leave/group/:chatId")
  .delete(
    mongoIdPathVariableValidator("chatId"),
    validate,
    chatController.leaveGroupChat
  );

router
  .route("/remove/:chatId")
  .delete(
    mongoIdPathVariableValidator("chatId"),
    validate,
    chatController.deleteOneOnOneChat
  );

export default router;
