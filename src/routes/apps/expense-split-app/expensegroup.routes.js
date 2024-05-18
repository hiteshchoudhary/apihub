import { Router } from "express";
import { createAExpenseGroupValidator } from "../../../validators/apps/expense-split-app/expensegroup.validator.js";
import { validate } from "../../../validators/validate.js";
import {
  editExpenseGroup,
  createExpenseGroup,
  deleteExpenseGroup,
  getUserExpenseGroups,
  groupBalaceSheet,
  makeSettlement,
  viewExpenseGroup,
  userSettlementRecords,
  groupSettlementRecords,
  addMembersInExpenseGroup,
} from "../../../controllers/apps/expense-split-app/group.controller.js";
import { mongoIdPathVariableValidator } from "../../../validators/common/mongodb.validators.js";
import { verifyJWT } from "../../../middlewares/auth.middlewares.js";
const router = Router();

router.use(verifyJWT);

router
  .route("/creategroup")
  .post(createAExpenseGroupValidator(), validate, createExpenseGroup);

router
  .route("/:groupId")

  .get(mongoIdPathVariableValidator("groupId"), validate, viewExpenseGroup)

  .patch(mongoIdPathVariableValidator("groupId"), validate, editExpenseGroup)

  .delete(
    mongoIdPathVariableValidator("groupId"),
    validate,
    deleteExpenseGroup
  );

router
  .route("/group-settlements/:groupId")
  .post(mongoIdPathVariableValidator("groupId"), validate, groupBalaceSheet);

router
  .route("/makesettlement/:groupId")
  .post(mongoIdPathVariableValidator("groupId"), validate, makeSettlement);

router.route("/").get(getUserExpenseGroups);

router.route("/settlements/user").get(userSettlementRecords);

router.route("/settlements/group/:groupId").get(groupSettlementRecords);

router
  .route("/group/:groupId/:userId")
  .post(
    mongoIdPathVariableValidator("groupId"),
    mongoIdPathVariableValidator("userId"),
    validate,
    addMembersInExpenseGroup
  );
export default router;
