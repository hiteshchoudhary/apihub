import { Server, Socket } from "socket.io";
import { ChatEventEnum } from "../constants.js";

/**
 * @description This function is responsible to setup the socket with appropriate user id. Once done user will be allowed to use and join multiple rooms based on chat id.
 * @param {Socket<import("socket.io/dist/typed-events").DefaultEventsMap, import("socket.io/dist/typed-events").DefaultEventsMap, import("socket.io/dist/typed-events").DefaultEventsMap, any>} socket
 */
const mountSetupSocketIOEvent = (socket) => {
  socket.on(ChatEventEnum.SETUP_EVENT, (payload) => {
    console.log("User connected 🗼");
    socket.join(payload._id);
    socket.emit(ChatEventEnum.CONNECTED_EVENT);
  });
};

/**
 * @description This function is responsible to allow user to join the chat represented by room (chatId). event happens when user switches between the chats
 * @param {Socket<import("socket.io/dist/typed-events").DefaultEventsMap, import("socket.io/dist/typed-events").DefaultEventsMap, import("socket.io/dist/typed-events").DefaultEventsMap, any>} socket
 */
const mountJoinChatEvent = (socket) => {
  socket.on(ChatEventEnum.JOIN_CHAT_EVENT, (room) => {
    console.log("User joined the chat 🤝");
    socket.join(room);
  });
};

/**
 * @description This function is responsible to emit the typing event to the other participants of the chat
 * @param {Socket<import("socket.io/dist/typed-events").DefaultEventsMap, import("socket.io/dist/typed-events").DefaultEventsMap, import("socket.io/dist/typed-events").DefaultEventsMap, any>} socket
 */
const mountParticipantTypingEvent = (socket) => {
  socket.on(ChatEventEnum.TYPING_EVENT, (room) =>
    socket.in(room).emit(ChatEventEnum.TYPING_EVENT, room)
  );
};

/**
 * @description This function is responsible to emit the stopped typing event to the other participants of the chat
 * @param {Socket<import("socket.io/dist/typed-events").DefaultEventsMap, import("socket.io/dist/typed-events").DefaultEventsMap, import("socket.io/dist/typed-events").DefaultEventsMap, any>} socket
 */
const mountParticipantStoppedTypingEvent = (socket) => {
  socket.on(ChatEventEnum.STOP_TYPING_EVENT, (room) =>
    socket.in(room).emit(ChatEventEnum.STOP_TYPING_EVENT, room)
  );
};

/**
 * @description This function is responsible to disconnect user from the room
 * @param {Socket<import("socket.io/dist/typed-events").DefaultEventsMap, import("socket.io/dist/typed-events").DefaultEventsMap, import("socket.io/dist/typed-events").DefaultEventsMap, any>} socket
 */
const mountDisconnectTheRoom = (socket) => {
  socket.off(ChatEventEnum.SETUP_EVENT, (payload) => {
    console.log("User disconnected 🚫");
    socket.leave(payload._id); // leave the socket for the user
  });
};

/**
 *
 * @param {Server<import("socket.io/dist/typed-events").DefaultEventsMap, import("socket.io/dist/typed-events").DefaultEventsMap, import("socket.io/dist/typed-events").DefaultEventsMap, any>} io
 */
const initializeSocketIO = (io) => {
  return io.on("connection", (socket) => {
    // Common events that needs to be mounted on the initialization
    mountSetupSocketIOEvent(socket);
    mountJoinChatEvent(socket);
    mountParticipantTypingEvent(socket);
    mountParticipantStoppedTypingEvent(socket);
    mountDisconnectTheRoom(socket);
  });
};

export { initializeSocketIO };
