import {
  PaperAirplaneIcon,
  PaperClipIcon,
  XCircleIcon,
} from "@heroicons/react/20/solid";
import { useEffect, useRef, useState } from "react";
import { getChatMessages, getUserChats, sendMessage } from "../api";
import AddChatModal from "../components/chat/AddChatModal";
import ChatItem from "../components/chat/ChatItem";
import MessageItem from "../components/chat/MessageItem";
import Typing from "../components/chat/Typing";
import Input from "../components/Input";
import { useAuth } from "../context/AuthContext";
import { useSocket } from "../context/SocketContext";
import {
  ChatListItemInterface,
  ChatMessageInterface,
} from "../interfaces/chat";
import {
  LocalStorage,
  classNames,
  getChatObjectMetadata,
  requestHandler,
} from "../utils";

const CONNECTED_EVENT = "connected";
const DISCONNECT_EVENT = "disconnect";
const JOIN_CHAT_EVENT = "joinChat";
const NEW_CHAT_EVENT = "newChat";
const TYPING_EVENT = "typing";
const STOP_TYPING_EVENT = "stopTyping";
const MESSAGE_RECEIVED_EVENT = "messageReceived";
const LEAVE_CHAT_EVENT = "leaveChat";
const UPDATE_GROUP_NAME_EVENT = "updateGroupName";
// const SOCKET_ERROR_EVENT = "socketError";

const ChatPage = () => {
  const { user } = useAuth();
  const { socket } = useSocket();

  const currentChat = useRef<ChatListItemInterface | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [openAddChat, setOpenAddChat] = useState(false);
  const [localSearchQuery, setLocalSearchQuery] = useState("");
  const [loadingChats, setLoadingChats] = useState(false);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [chats, setChats] = useState<ChatListItemInterface[]>([]);
  const [messages, setMessages] = useState<ChatMessageInterface[]>([]);
  const [unreadMessages, setUnreadMessages] = useState<ChatMessageInterface[]>(
    []
  );
  const [isTyping, setIsTyping] = useState(false);
  const [selfTyping, setSelfTyping] = useState(false);
  const [message, setMessage] = useState("");
  const [attachedFiles, setAttachedFiles] = useState<File[]>([]);

  const updateChatLastMessage = (
    chatToUpdateId: string,
    message: ChatMessageInterface
  ) => {
    // get chat that to be updated with latest message
    const chatToUpdate = chats.find((chat) => chat._id === chatToUpdateId)!;
    chatToUpdate.lastMessage = message; // attach last message to be the provided one
    chatToUpdate.updatedAt = message?.updatedAt;
    setChats([
      // bring the updated chat at the top
      chatToUpdate,
      ...chats.filter((chat) => chat._id !== chatToUpdateId),
    ]);
  };

  const getChats = async () => {
    requestHandler(
      async () => await getUserChats(),
      setLoadingChats,
      (res) => {
        const { data } = res;
        setChats(data || []);
      },
      alert
    );
  };

  const getMessages = async () => {
    if (!currentChat.current?._id) return alert("No chat is selected");
    if (!socket) return alert("Socket not available");
    socket.emit(JOIN_CHAT_EVENT, currentChat.current?._id);
    setUnreadMessages(
      unreadMessages.filter((not) => not.chat !== currentChat.current?._id)
    );
    requestHandler(
      async () => await getChatMessages(currentChat.current?._id || ""),
      setLoadingMessages,
      (res) => {
        const { data } = res;
        setMessages(data || []);
      },
      alert
    );
  };

  const sendChatMessage = async () => {
    if (!currentChat.current?._id || !socket) return;
    socket.emit(STOP_TYPING_EVENT, currentChat.current?._id);
    await requestHandler(
      async () =>
        await sendMessage(
          currentChat.current?._id || "",
          message,
          attachedFiles
        ),
      () => {},
      (res) => {
        setMessage("");
        setAttachedFiles([]);
        setMessages((prev) => [res.data, ...prev]);
        updateChatLastMessage(currentChat.current?._id || "", res.data);
      },
      (err) => console.log(err)
    );
  };

  const handleOnMessageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMessage(e.target.value);

    if (!socket || !isConnected) return;

    if (!selfTyping) {
      setSelfTyping(true);
      socket.emit(TYPING_EVENT, currentChat.current?._id);
    }

    const lastTypingTime = new Date().getTime();
    const timerLength = 3000;

    setTimeout(() => {
      const timeNow = new Date().getTime();
      const timeDiff = timeNow - lastTypingTime;
      if (timeDiff >= timerLength && selfTyping) {
        socket.emit(STOP_TYPING_EVENT, currentChat.current?._id);
        setSelfTyping(false);
      }
    }, timerLength);
  };

  const onConnect = () => {
    setIsConnected(true);
  };

  const onDisconnect = () => {
    setIsConnected(false);
  };

  const handleOnSocketTyping = (chatId: string) => {
    if (chatId !== currentChat.current?._id) return;
    setIsTyping(true);
  };

  const handleOnSocketStopTyping = (chatId: string) => {
    if (chatId !== currentChat.current?._id) return;
    setIsTyping(false);
  };

  const onMessageReceived = (message: ChatMessageInterface) => {
    if (message?.chat !== currentChat.current?._id) {
      setUnreadMessages((prev) => [message, ...prev]);
    } else {
      setMessages((prev) => [message, ...prev]);
    }
    updateChatLastMessage(message.chat || "", message);
  };

  const onNewChat = (chat: ChatListItemInterface) => {
    setChats((prev) => [chat, ...prev]);
  };

  const onChatLeave = (chat: ChatListItemInterface) => {
    if (chat._id === currentChat.current?._id) {
      // if user is active in group chat from which he is leaving, simply close the chat window
      currentChat.current = null;
      LocalStorage.remove("currentChat");
    }
    setChats((prev) => prev.filter((c) => c._id !== chat._id));
  };

  const onGroupNameChange = (chat: ChatListItemInterface) => {
    if (chat._id === currentChat.current?._id) {
      // if user is active in group chat from which he is leaving, simply close the chat window
      currentChat.current = chat;
      LocalStorage.set("currentChat", chat);
    }
    setChats((prev) => [
      ...prev.map((c) => {
        if (c._id === chat._id) {
          return chat;
        }
        return c;
      }),
    ]);
  };

  useEffect(() => {
    getChats();
    const _currentChat = LocalStorage.get("currentChat");
    if (_currentChat) {
      currentChat.current = _currentChat;
      socket?.emit(JOIN_CHAT_EVENT, _currentChat.current?._id);
      getMessages();
    }
  }, []);

  useEffect(() => {
    if (!socket) return;
    socket.on(CONNECTED_EVENT, onConnect);
    socket.on(DISCONNECT_EVENT, onDisconnect);
    socket.on(TYPING_EVENT, handleOnSocketTyping);
    socket.on(STOP_TYPING_EVENT, handleOnSocketStopTyping);
    socket.on(MESSAGE_RECEIVED_EVENT, onMessageReceived);
    socket.on(NEW_CHAT_EVENT, onNewChat);
    socket.on(LEAVE_CHAT_EVENT, onChatLeave);
    socket.on(UPDATE_GROUP_NAME_EVENT, onGroupNameChange);

    return () => {
      socket.off(CONNECTED_EVENT, onConnect);
      socket.off(DISCONNECT_EVENT, onDisconnect);
      socket.off(TYPING_EVENT, handleOnSocketTyping);
      socket.off(STOP_TYPING_EVENT, handleOnSocketStopTyping);
      socket.off(MESSAGE_RECEIVED_EVENT, onMessageReceived);
      socket.off(NEW_CHAT_EVENT, onNewChat);
      socket.off(LEAVE_CHAT_EVENT, onChatLeave);
      socket.off(UPDATE_GROUP_NAME_EVENT, onGroupNameChange);
    };
    // chats array being used in onMessageReceived function. we need latest state value of chats
    // if we don't pass chats in dep array the onMessageReceived will consider initial value of chats array that us empty
    // ! This will not cause the infinite render as the function in the socket ar getting mounted and not getting executed
    // ! so even if some socket callbacks are updating the chats state it's not updating on useEffect call but on socket call
  }, [socket, chats]);

  return (
    <>
      <AddChatModal
        open={openAddChat}
        onClose={() => {
          setOpenAddChat(false);
        }}
        onSuccess={() => {
          getChats();
        }}
      />

      <div className="w-full justify-between items-stretch h-screen flex flex-shrink-0">
        <div className="w-1/3 relative ring-white overflow-y-auto px-4">
          <div className="z-10 w-full sticky top-0 bg-dark py-4 flex justify-between items-center gap-4">
            <Input
              placeholder="Search user or group..."
              value={localSearchQuery}
              onChange={(e) =>
                setLocalSearchQuery(e.target.value.toLowerCase())
              }
            />
            <button
              onClick={() => setOpenAddChat(true)}
              className="rounded-xl border-none bg-primary text-white py-4 px-5 flex flex-shrink-0"
            >
              + Add chat
            </button>
          </div>
          {loadingChats ? (
            <div className="flex justify-center items-center h-[calc(100%-88px)]">
              <Typing />
            </div>
          ) : (
            [...chats]
              .filter((chat) =>
                localSearchQuery
                  ? getChatObjectMetadata(chat, user!)
                      .title?.toLocaleLowerCase()
                      ?.includes(localSearchQuery)
                  : true
              )
              .map((chat) => {
                return (
                  <ChatItem
                    chat={chat}
                    isActive={chat._id === currentChat.current?._id}
                    unreadCount={
                      unreadMessages.filter((n) => n.chat === chat._id).length
                    }
                    onClick={(chat) => {
                      LocalStorage.set("currentChat", chat);
                      currentChat.current = chat;
                      getMessages();
                    }}
                    key={chat._id}
                    onChatDelete={(chatId) => {
                      setChats((prev) =>
                        prev.filter((chat) => chat._id !== chatId)
                      );
                      if (currentChat.current?._id === chatId) {
                        currentChat.current = null;
                        LocalStorage.remove("currentChat");
                      }
                    }}
                  />
                );
              })
          )}
        </div>
        <div className="w-2/3 border-l-[0.1px] border-secondary">
          {currentChat.current && currentChat.current?._id ? (
            <>
              <div className="p-4 sticky top-0 bg-dark z-20 flex justify-between items-center w-full border-b-[0.1px] border-secondary">
                <div className="flex justify-start items-center w-max gap-3">
                  {currentChat.current.isGroupChat ? (
                    <div className="w-12 relative h-12 flex-shrink-0 flex justify-start items-center flex-nowrap">
                      {currentChat.current.participants
                        .slice(0, 3)
                        .map((participant, i) => {
                          return (
                            <img
                              key={participant._id}
                              src={participant.avatar.url}
                              className={classNames(
                                "w-9 h-9 border-[1px] border-white rounded-full absolute outline outline-4 outline-dark",
                                i === 0
                                  ? "left-0 z-30"
                                  : i === 1
                                  ? "left-2 z-20"
                                  : i === 2
                                  ? "left-4 z-10"
                                  : ""
                              )}
                            />
                          );
                        })}
                    </div>
                  ) : (
                    <img
                      className="h-14 w-14 rounded-full flex flex-shrink-0 object-cover"
                      src={
                        getChatObjectMetadata(currentChat.current, user!).avatar
                      }
                    />
                  )}
                  <div>
                    <p className="font-bold">
                      {getChatObjectMetadata(currentChat.current, user!).title}
                    </p>
                    <small className="text-zinc-400">
                      {
                        getChatObjectMetadata(currentChat.current, user!)
                          .description
                      }
                    </small>
                  </div>
                </div>
              </div>
              <div
                className={classNames(
                  "p-8 overflow-y-auto flex flex-col-reverse gap-6 w-full",
                  attachedFiles.length > 0
                    ? "h-[calc(100vh-336px)]"
                    : "h-[calc(100vh-176px)]"
                )}
                id="message-window"
              >
                {loadingMessages ? (
                  <div className="flex justify-center items-center h-[calc(100%-88px)]">
                    <Typing />
                  </div>
                ) : (
                  <>
                    {isTyping ? <Typing /> : null}
                    {messages?.map((msg) => {
                      return (
                        <MessageItem
                          key={msg._id}
                          isOwnMessage={msg.sender?._id === user?._id}
                          isGroupChatMessage={currentChat.current?.isGroupChat}
                          message={msg}
                        />
                      );
                    })}
                  </>
                )}
              </div>
              {attachedFiles.length > 0 ? (
                <div className="grid gap-4 grid-cols-5 p-4 justify-start max-w-fit">
                  {attachedFiles.map((file, i) => {
                    return (
                      <div
                        key={i}
                        className="group w-32 h-32 relative aspect-square rounded-xl cursor-pointer"
                      >
                        <div className="absolute inset-0 flex justify-center items-center w-full h-full bg-black/40 group-hover:opacity-100 opacity-0 transition-opacity ease-in-out duration-150">
                          <button
                            onClick={() => {
                              setAttachedFiles(
                                attachedFiles.filter((_, ind) => ind !== i)
                              );
                            }}
                            className="absolute -top-2 -right-2"
                          >
                            <XCircleIcon className="h-6 w-6 text-white" />
                          </button>
                        </div>
                        <img
                          className="h-full rounded-xl w-full object-cover"
                          src={URL.createObjectURL(file)}
                          alt="attachment"
                        />
                      </div>
                    );
                  })}
                </div>
              ) : null}
              <div className="sticky top-full p-4 flex justify-between items-center w-full gap-2 border-t-[0.1px] border-secondary">
                <input
                  hidden
                  id="attachments"
                  type="file"
                  value=""
                  multiple
                  max={5}
                  onChange={(e) => {
                    if (e.target.files) {
                      setAttachedFiles([...e.target.files]);
                    }
                  }}
                />
                <label
                  htmlFor="attachments"
                  className="p-4 rounded-full bg-dark hover:bg-secondary"
                >
                  <PaperClipIcon className="w-6 h-6" />
                </label>

                <Input
                  placeholder="Message"
                  value={message}
                  onChange={handleOnMessageChange}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      sendChatMessage();
                    }
                  }}
                />
                <button
                  onClick={sendChatMessage}
                  disabled={!message && attachedFiles.length <= 0}
                  className="p-4 rounded-full bg-dark hover:bg-secondary disabled:opacity-50"
                >
                  <PaperAirplaneIcon className="w-6 h-6" />
                </button>
              </div>
            </>
          ) : (
            <div className="w-full h-full flex justify-center items-center">
              No chat selected
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default ChatPage;
