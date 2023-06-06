/**
 * @type {{ ADMIN: "ADMIN"; USER: "USER"} as const}
 */
export const UserRolesEnum = {
  ADMIN: "ADMIN",
  USER: "USER",
};

/**
 * @type {{ PENDING: "PENDING"; CANCELLED: "CANCELLED"; COMPLETED: "COMPLETED" } as const}
 */
export const OrderStatusEnum = {
  PENDING: "PENDING",
  CANCELLED: "CANCELLED",
  COMPLETED: "COMPLETED",
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