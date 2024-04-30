import { Router } from "express";
import { createAExpenseGroupValidator } from "../../../validators/apps/expense-split-app/expenseGroup.validator.js";
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

//All routes are secured routes

router.use(verifyJWT);

//Create a new group

// ! validated

router
  .route("/creategroup")
  .post(createAExpenseGroupValidator(), validate, createExpenseGroup);

router
  .route("/:groupId")

  //Get all expenses in a group

  // !validated

  .get(mongoIdPathVariableValidator("groupId"), validate, viewExpenseGroup)

  //Route to edit group name and description only

  // ! validated

  .patch(mongoIdPathVariableValidator("groupId"), validate, editExpenseGroup)

  //Route to delete the whole group

  // ! Not yet validated

  .delete(
    mongoIdPathVariableValidator("groupId"),
    validate,
    deleteExpenseGroup
  );

//Returns a group balance sheet who owes whom how much

// !validated

router
  .route("/group-settlements/:groupId")
  .post(mongoIdPathVariableValidator("groupId"), validate, groupBalaceSheet);

//Makes settlement of owes in the group and creates a settlement transaction

// ! validated aggregation left

router
  .route("/makeSettlement/:groupId")
  .post(mongoIdPathVariableValidator("groupId"), validate, makeSettlement);

//Gets all the expense group that user is a part of

//!validated

router.route("/").get(getUserExpenseGroups);

//Get all user settlements

//! validated aggreagation

router.route("/settlements/user").get(userSettlementRecords);

//Get all group settlements

//! validated aggregation left

router.route("/settlements/group/:groupId").get(groupSettlementRecords);

//Responsible for adding members in group

// ! Validated

router
  .route("/group/:groupId/:userId")
  .post(
    mongoIdPathVariableValidator("groupId"),
    mongoIdPathVariableValidator("userId"),
    validate,
    addMembersInExpenseGroup
  );
export default router;
