/**
 * @type {{ ADMIN: "ADMIN"; USER: "USER"} as const}
 */
export const UserRolesEnum = {
  ADMIN: "ADMIN",
  USER: "USER",
};

/**
 * @type {{ PENDING: "PENDING"; CANCELLED: "CANCELLED"; FULFILLED: "FULFILLED" } as const}
 */
export const OrderStatusEnum = {
  PENDING: "PENDING",
  CANCELLED: "CANCELLED",
  FULFILLED: "FULFILLED",
};

/**
 * @type {{ UNKNOWN:"UNKNOWN"; RAZORPAY: "RAZORPAY"; STRIPE: "STRIPE"; } as const}
 */
export const PaymentProviderEnum = {
  UNKNOWN: "UNKNOWN",
  RAZORPAY: "RAZORPAY",
  STRIPE: "STRIPE",
};

export const MAXIMUM_SUB_IMAGE_COUNT = 4;
