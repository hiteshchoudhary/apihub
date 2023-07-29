import { Router } from "express";
import {
  addNewParticipantInGroupChat,
  createAGroupChat,
  deleteGroupChat,
  getAOneOnOneChat,
  getAllChats,
  removeParticipantFromGroupChat,
  renameGroupChat,
  searchAvailableUsers,
} from "../../../controllers/apps/chat-app/chat.controllers.js";
import { verifyJWT } from "../../../middlewares/auth.middlewares.js";
import {
  chatIdPathVariableValidator,
  createAGroupChatValidator,
  participantIdPathVariableValidator,
  receiverPathVariableValidator,
  updateGroupChatNameValidator,
} from "../../../validators/apps/chat-app/chat.validators.js";
import { validate } from "../../../validators/validate.js";

const router = Router();

router.use(verifyJWT);

router.route("/").get(getAllChats);

router.route("/users").get(searchAvailableUsers);

router
  .route("/group")
  .post(createAGroupChatValidator(), validate, createAGroupChat);

router
  .route("/group/:chatId")
  .patch(
    chatIdPathVariableValidator(),
    updateGroupChatNameValidator(),
    validate,
    renameGroupChat
  )
  .delete(chatIdPathVariableValidator(), validate, deleteGroupChat);

router
  .route("/group/:chatId/:participantId")
  .post(
    chatIdPathVariableValidator(),
    participantIdPathVariableValidator(),
    validate,
    addNewParticipantInGroupChat
  )
  .delete(
    chatIdPathVariableValidator(),
    participantIdPathVariableValidator(),
    validate,
    removeParticipantFromGroupChat
  );

router
  .route("/c/:receiverId")
  .get(receiverPathVariableValidator(), validate, getAOneOnOneChat);

export default router;
