import { faker } from "@faker-js/faker";
import { User } from "../models/apps/auth/user.models.js";
import { Chat } from "../models/apps/chat-app/chat.models.js";
import { ChatMessage } from "../models/apps/chat-app/message.models.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { getRandomNumber } from "../utils/helpers.js";
import {
  GROUP_CHATS_COUNT,
  GROUP_CHAT_MAX_PARTICIPANTS_COUNT,
  ONE_ON_ONE_CHATS_COUNT,
} from "./_constants.js";

const seedOneOnOneChats = async () => {
  const users = await User.find();
  const chatsArray = new Array(ONE_ON_ONE_CHATS_COUNT)
    .fill("_")
    .map(async (_) => {
      let index1 = getRandomNumber(users.length);
      let index2 = getRandomNumber(users.length);
      if (index1 === index2) {
        // This shows that both participant indexes are the same
        index2 <= 0 ? index2++ : index2--; // avoid same participants
      }
      const participants = [
        users[index1]._id.toString(),
        users[index2]._id.toString(),
      ];
      await Chat.findOneAndUpdate(
        {
          $and: [
            {
              participants: {
                $elemMatch: { $eq: participants[0] },
              },
            },
            {
              participants: {
                $elemMatch: { $eq: participants[1] },
              },
            },
          ],
        },
        {
          $set: {
            name: "One on one chat",
            isGroupChat: false,
            participants,
            admin: participants[getRandomNumber(participants.length)],
          },
        },
        { upsert: true } // We don't want duplicate entries of the chat. So if found then update else insert
      );
    });
  await Promise.all([...chatsArray]);
};

const seedGroupChats = async () => {
  const users = await User.find();

  const groupChatsArray = new Array(GROUP_CHATS_COUNT).fill("_").map((_) => {
    let participants = [];
    const participantsCount = getRandomNumber(
      GROUP_CHAT_MAX_PARTICIPANTS_COUNT
    );

    new Array(participantsCount < 3 ? 3 : participantsCount)
      .fill("_")
      .forEach((_) =>
        participants.push(users[getRandomNumber(users.length)]._id.toString())
      );

    participants = [...new Set(participants)];

    return {
      name: faker.vehicle.vehicle() + faker.company.buzzNoun(),
      isGroupChat: true,
      participants,
      admin: participants[getRandomNumber(participants.length)],
    };
  });
  await Chat.insertMany(groupChatsArray);
};

const seedChatApp = asyncHandler(async (req, res) => {
  await Chat.deleteMany({});
  await ChatMessage.deleteMany({});
  await seedOneOnOneChats();
  await seedGroupChats();

  return res
    .status(201)
    .json(
      new ApiResponse(201, {}, "Database populated for chat app successfully")
    );
});

export { seedChatApp };
