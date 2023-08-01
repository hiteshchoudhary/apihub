/**
 * @type {{ ADMIN: "ADMIN"; USER: "USER"} as const}
 */
export const UserRolesEnum = {
  ADMIN: "ADMIN",
  USER: "USER",
};

export const AvailableUserRoles = Object.values(UserRolesEnum);

/**
 * @type {{ PENDING: "PENDING"; CANCELLED: "CANCELLED"; DELIVERED: "DELIVERED" } as const}
 */
export const OrderStatusEnum = {
  PENDING: "PENDING",
  CANCELLED: "CANCELLED",
  DELIVERED: "DELIVERED",
};

export const AvailableOrderStatuses = Object.values(OrderStatusEnum);

/**
 * @type {{ UNKNOWN:"UNKNOWN"; RAZORPAY: "RAZORPAY"; PAYPAL: "PAYPAL"; } as const}
 */
export const PaymentProviderEnum = {
  UNKNOWN: "UNKNOWN",
  RAZORPAY: "RAZORPAY",
  PAYPAL: "PAYPAL",
};

export const AvailablePaymentProviders = Object.values(PaymentProviderEnum);

/**
 * @type {{ FLAT:"FLAT"; } as const}
 */
export const CouponTypeEnum = {
  FLAT: "FLAT",
  // PERCENTAGE: "PERCENTAGE",
};

export const AvailableCouponTypes = Object.values(CouponTypeEnum);

/**
 * @type {{ GOOGLE: "GOOGLE"; GITHUB: "GITHUB"; EMAIL_PASSWORD: "EMAIL_PASSWORD"} as const}
 */
export const UserLoginType = {
  GOOGLE: "GOOGLE",
  GITHUB: "GITHUB",
  EMAIL_PASSWORD: "EMAIL_PASSWORD",
};

export const AvailableSocialLogins = Object.values(UserLoginType);

/**
 * @type {{ MOST_VIEWED: "mostViewed"; MOST_LIKED: "mostLiked"; LATEST: "latest"; OLDEST: "oldest"} as const}
 */
export const YouTubeFilterEnum = {
  MOST_VIEWED: "mostViewed",
  MOST_LIKED: "mostLiked",
  LATEST: "latest",
  OLDEST: "oldest",
};

export const AvailableYouTubeFilters = Object.values(YouTubeFilterEnum);

export const USER_TEMPORARY_TOKEN_EXPIRY = 20 * 60 * 1000; // 20 minutes

export const MAXIMUM_SUB_IMAGE_COUNT = 4;
export const MAXIMUM_SOCIAL_POST_IMAGE_COUNT = 6;

export const DB_NAME = "freeapi";

export const paypalBaseUrl = {
  sandbox: "https://api-m.sandbox.paypal.com",
};

/**
 * @description set of events that we are using in chat app. more to be added as we develop the chat app
 */
export const ChatEventEnum = {
  SETUP_EVENT: "setup", // ? get socket ready for user
  CONNECTED_EVENT: "connected", // ? once user is ready to go
  JOIN_CHAT_EVENT: "joinChat", // ? when new chat or group chat get's added
  NEW_CHAT_EVENT: "newChat", // ? when user selects an existing user to chat with
  TYPING_EVENT: "typing", // ? when participant starts typing
  STOP_TYPING_EVENT: "stopTyping", // ? when participant stops typing
  MESSAGE_RECEIVED_EVENT: "messageReceived", // ? when new message is received
  DISCONNECT_EVENT: "disconnect", // ? when user gets disconnected
};
