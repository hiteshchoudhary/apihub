import { param } from "express-validator";

const toBeFollowedUserIdValidator = () => {
  return [
    param("toBeFollowedUserId")
      .trim()
      .notEmpty()
      .isMongoId()
      .withMessage("Invalid user id"),
  ];
};

export { toBeFollowedUserIdValidator };
