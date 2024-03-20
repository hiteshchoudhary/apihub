import mongoose from "mongoose";
import { ChatEventEnum } from "../../../constants.js";
import { Chat } from "../../../models/apps/chat-app/chat.models.js";
import { ChatMessage } from "../../../models/apps/chat-app/message.models.js";
import { emitSocketEvent } from "../../../socket/index.js";
import { ApiError } from "../../../utils/ApiError.js";
import { ApiResponse } from "../../../utils/ApiResponse.js";
import { asyncHandler } from "../../../utils/asyncHandler.js";
import {
  getLocalPath,
  getStaticFilePath,
  removeLocalFile,
} from "../../../utils/helpers.js";

/**
 * @description Utility function which returns the pipeline stages to structure the chat message schema with common lookups
 * @returns {mongoose.PipelineStage[]}
 */
const chatMessageCommonAggregation = () => {
  return [
    {
      $lookup: {
        from: "users",
        foreignField: "_id",
        localField: "sender",
        as: "sender",
        pipeline: [
          {
            $project: {
              username: 1,
              avatar: 1,
              email: 1,
            },
          },
        ],
      },
    },
    {
      $addFields: {
        sender: { $first: "$sender" },
      },
    },
  ];
};

const getAllMessages = asyncHandler(async (req, res) => {
  const { chatId } = req.params;

  const selectedChat = await Chat.findById(chatId);

  if (!selectedChat) {
    throw new ApiError(404, "Chat does not exist");
  }

  // Only send messages if the logged in user is a part of the chat he is requesting messages of
  if (!selectedChat.participants?.includes(req.user?._id)) {
    throw new ApiError(400, "User is not a part of this chat");
  }

  const messages = await ChatMessage.aggregate([
    {
      $match: {
        chat: new mongoose.Types.ObjectId(chatId),
      },
    },
    ...chatMessageCommonAggregation(),
    {
      $sort: {
        createdAt: -1,
      },
    },
  ]);

  return res
    .status(200)
    .json(
      new ApiResponse(200, messages || [], "Messages fetched successfully")
    );
});

const sendMessage = asyncHandler(async (req, res) => {
  const { chatId } = req.params;
  const { content } = req.body;

  if (!content && !req.files?.attachments?.length) {
    throw new ApiError(400, "Message content or attachment is required");
  }

  const selectedChat = await Chat.findById(chatId);

  if (!selectedChat) {
    throw new ApiError(404, "Chat does not exist");
  }

  const messageFiles = [];

  if (req.files && req.files.attachments?.length > 0) {
    req.files.attachments?.map((attachment) => {
      messageFiles.push({
        url: getStaticFilePath(req, attachment.filename),
        localPath: getLocalPath(attachment.filename),
      });
    });
  }

  // Create a new message instance with appropriate metadata
  const message = await ChatMessage.create({
    sender: new mongoose.Types.ObjectId(req.user._id),
    content: content || "",
    chat: new mongoose.Types.ObjectId(chatId),
    attachments: messageFiles,
  });

  // update the chat's last message which could be utilized to show last message in the list item
  const chat = await Chat.findByIdAndUpdate(
    chatId,
    {
      $set: {
        lastMessage: message._id,
      },
    },
    { new: true }
  );

  // structure the message
  const messages = await ChatMessage.aggregate([
    {
      $match: {
        _id: new mongoose.Types.ObjectId(message._id),
      },
    },
    ...chatMessageCommonAggregation(),
  ]);

  // Store the aggregation result
  const receivedMessage = messages[0];

  if (!receivedMessage) {
    throw new ApiError(500, "Internal server error");
  }

  // logic to emit socket event about the new message created to the other participants
  chat.participants.forEach((participantObjectId) => {
    // here the chat is the raw instance of the chat in which participants is the array of object ids of users
    // avoid emitting event to the user who is sending the message
    if (participantObjectId.toString() === req.user._id.toString()) return;

    // emit the receive message event to the other participants with received message as the payload
    emitSocketEvent(
      req,
      participantObjectId.toString(),
      ChatEventEnum.MESSAGE_RECEIVED_EVENT,
      receivedMessage
    );
  });

  return res
    .status(201)
    .json(new ApiResponse(201, receivedMessage, "Message saved successfully"));
});
const deleteMessage = asyncHandler(async (req, res) => {
  //controller to delete chat messages and attachments

  const { chatId, messageId, attachmentId } = req.params;

  //Find the chat based on chatId

  const chat = await Chat.findOne({
    _id: new mongoose.Types.ObjectId(chatId),
  });

  if (!chat) {
    throw new ApiError(404, "Chat does not exist");
  }
  //Find the message based on message id

  const message = await ChatMessage.findOne({
    _id: new mongoose.Types.ObjectId(messageId),
  });

  if (!message) {
    throw new ApiError(404, "Message does not exist");
  }

  // Check if user is the sender of the message
  if (message.sender.toString() !== req.user._id.toString()) {
    throw new ApiError(
      401,
      "You are not authorised to delete the message ,you are not the sender"
    );
  }

  //Checking if 15 mins has passed since the message sent or not

  const currentTime = new Date();
  const messageCreatedAt = message.createdAt;
  const timeDifferenceMinutes = (currentTime - messageCreatedAt) / (1000 * 60); //calculating the time difference in minutes

  if (timeDifferenceMinutes > 15) {
    throw new ApiError(
      400,
      "15 mins have passed you cannot delete this message"
    );
  }

  // If frontend sends the attachment id and message has more than one attachment
  //Then delete only the attachment sent by the user otherwise delete the whole message
  if (attachmentId && message.attachments.length > 1) {
    const attachmentIndex = message.attachments.findIndex(
      (attachment) => attachment._id.toString() === attachmentId
    );

    if (attachmentIndex === -1) {
      throw new ApiError(404, "Attachment not found");
    }

    const deletedAttachment = message.attachments.splice(attachmentIndex, 1);
    removeLocalFile(deletedAttachment[0].localPath);

    await message.save({ validateBeforeSave: false });
    // logic to emit socket event about the message attachment deleted  to the other participants
    chat.participants.forEach((participantObjectId) => {
      // here the chat is the raw instance of the chat in which participants is the array of object ids of users
      // avoid emitting event to the user who is deleting the message
      if (participantObjectId.toString() === req.user._id.toString()) return;

      // emit the delete message attachment event to the other participants frontend with messageId as the payload
      emitSocketEvent(
        req,
        participantObjectId.toString(),
        ChatEventEnum.MESSAGE_DELETED_EVENT,
        message._id
      );
    });

    return res
      .status(200)
      .json(new ApiResponse(200, {}, "Message attachment deleted succesfully"));
  }
  //If the message is attachment  remove the attachments from the server
  if (message.attachments.length > 0) {
    message.attachments.map((asset) => {
      removeLocalFile(asset.localPath);
    });
  }
  //deleting the message from DB
  try {
    await ChatMessage.deleteOne({
      _id: new mongoose.Types.ObjectId(messageId),
    });
  } catch (error) {
    throw new ApiError(500, "Internal Server Error");
  }

  //Updating the last message of the chat to the previous message after deletion
  const lastMessage = await ChatMessage.findOne(
    { chat: chatId },
    {},
    { sort: { createdAt: -1 } }
  );

  await Chat.findByIdAndUpdate(chatId, {
    lastMessage: lastMessage ? lastMessage?._id : null,
  });
  // logic to emit socket event about the message deleted  to the other participants
  chat.participants.forEach((participantObjectId) => {
    // here the chat is the raw instance of the chat in which participants is the array of object ids of users
    // avoid emitting event to the user who is deleting the message
    if (participantObjectId.toString() === req.user._id.toString()) return;

    // emit the delete message event to the other participants frontend with delete messageId as the payload
    emitSocketEvent(
      req,
      participantObjectId.toString(),
      ChatEventEnum.MESSAGE_DELETED_EVENT,
      message._id
    );
  });

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Message deleted succesfully"));
});

export { getAllMessages, sendMessage, deleteMessage };
