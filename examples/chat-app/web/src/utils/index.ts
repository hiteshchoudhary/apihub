import { AxiosResponse } from "axios";
import { FreeAPISuccessResponseInterface } from "../interfaces/api";
import { ChatListItemInterface } from "../interfaces/chat";
import { UserInterface } from "../interfaces/user";

export const requestHandler = async (
  api: () => Promise<AxiosResponse<FreeAPISuccessResponseInterface, any>>,
  setLoading: (loading: boolean) => void,
  onSuccess: (data: FreeAPISuccessResponseInterface) => void,
  onError: (error: string) => void
) => {
  setLoading && setLoading(true);
  try {
    const response = await api();
    const { data } = response;
    if (data?.success) {
      onSuccess(data);
    }
  } catch (error: any) {
    if ([401, 403].includes(error?.response.data?.statusCode)) {
      localStorage.clear();
      if (isBrowser) window.location.href = "/login";
    }
    onError(error?.response?.data?.message || "Something went wrong");
  } finally {
    setLoading && setLoading(false);
  }
};

export const classNames = (...className: string[]) => {
  return className.filter(Boolean).join(" ");
};

export const isBrowser = typeof window !== "undefined";

export const getChatObjectMetadata = (
  chat: ChatListItemInterface,
  loggedInUser: UserInterface
) => {
  if (chat.isGroupChat) {
    return {
      avatar: "https://via.placeholder.com/100x100.png",
      title: chat.name,
      description: `${chat.participants.length} members in the chat`,
      lastMessage: chat.lastMessage?.content
        ? chat.lastMessage?.content
        : chat.lastMessage
        ? `${chat.lastMessage?.attachments?.length} attachment${
            chat.lastMessage.attachments.length > 1 ? "s" : ""
          }`
        : "No messages yet",
    };
  } else {
    const participant = chat.participants.find(
      (p) => p._id !== loggedInUser?._id
    );
    return {
      avatar: participant?.avatar.url,
      title: participant?.username,
      description: participant?.email,
      lastMessage: chat.lastMessage?.content
        ? chat.lastMessage?.content
        : chat.lastMessage
        ? `${chat.lastMessage?.attachments?.length} attachment${
            chat.lastMessage.attachments.length > 1 ? "s" : ""
          }`
        : "No messages yet",
    };
  }
};

export class LocalStorage {
  static get(key: string) {
    if (!isBrowser) return;
    const value = localStorage.getItem(key);
    if (value) {
      try {
        return JSON.parse(value);
      } catch (err) {
        return null;
      }
    }
    return null;
  }
  static set(key: string, value: any) {
    if (!isBrowser) return;
    localStorage.setItem(key, JSON.stringify(value));
  }

  static remove(key: string) {
    if (!isBrowser) return;
    localStorage.removeItem(key);
  }

  static clear() {
    if (!isBrowser) return;
    localStorage.clear();
  }
}
