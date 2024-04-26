import { Router } from "express";
import {
  createAExpenseGroupValidator,
  updateExpenseGroupNameValidator,
} from "../../../validators/apps/expense-split-app/expenseGroup.validator";
import { validate } from "../../../validators/validate.js";
import {
  addMembersInExpenseGroup,
  changeExpenseGroupName,
  createExpenseGroup,
  deleteExpenseGroup,
  getUserExpenseGroups,
  groupBalaceSheet,
  leaveExpenseGroup,
  makeSettlement,
  removeMembersFromExpenseGroups,
  viewExpenseGroup,
} from "../../../controllers/apps/expense-split-app/group.controller.js";
import { mongoIdPathVariableValidator } from "../../../validators/common/mongodb.validators.js";

const router = Router();

router
  .route("/createGroup")
  .post(createAExpenseGroupValidator, validate, createExpenseGroup);

router
  .route("/:groupId")
  .get(mongoIdPathVariableValidator("groupId"), validate, viewExpenseGroup)
  .patch(
    mongoIdPathVariableValidator("groupId"),
    updateExpenseGroupNameValidator,
    validate,
    changeExpenseGroupName
  )
  .delete(
    mongoIdPathVariableValidator("groupId"),
    validate,
    deleteExpenseGroup
  );

router
  .route("/:groupId/:participantId")
  .post(
    mongoIdPathVariableValidator("groupId"),
    mongoIdPathVariableValidator("participantId"),
    validate,
    addMembersInExpenseGroup
  )
  .delete(
    mongoIdPathVariableValidator("groupId"),
    mongoIdPathVariableValidator("participantId"),
    validate,
    removeMembersFromExpenseGroups
  );

router.route("/group-settlements").post(groupBalaceSheet);
router.route("/makeSettlement", makeSettlement);
router
  .route("/leave/group/:groupId")
  .post(mongoIdPathVariableValidator("groupId"), validate, leaveExpenseGroup);

router.route("/group").get(getUserExpenseGroups);
