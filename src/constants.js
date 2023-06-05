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

export const MAXIMUM_SUB_IMAGE_COUNT = 4;
