import { body, param } from "express-validator";

const createAGroupChatValidator = () => {
  return [
    body("name").trim().notEmpty().withMessage("Group name is required"),
    body("participants")
      .isArray({
        min: 2,
        max: 100,
      })
      .withMessage(
        "Participants must be an array with more than 2 members and less than 100 members"
      ),
  ];
};

const receiverPathVariableValidator = () => {
  return [
    param("receiverId").notEmpty().isMongoId().withMessage("Invalid user id"),
  ];
};

const participantIdPathVariableValidator = () => {
  return [
    param("participantId")
      .notEmpty()
      .isMongoId()
      .withMessage("Invalid user id"),
  ];
};

const chatIdPathVariableValidator = () => {
  return [
    param("chatId").notEmpty().isMongoId().withMessage("Invalid user id"),
  ];
};

const updateGroupChatNameValidator = () => {
  return [body("name").trim().notEmpty().withMessage("Group name is required")];
};

export {
  chatIdPathVariableValidator,
  createAGroupChatValidator,
  participantIdPathVariableValidator,
  receiverPathVariableValidator,
  updateGroupChatNameValidator,
};
