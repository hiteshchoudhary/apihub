import { Router } from "express";
import {
  createAExpenseGroupValidator,
  updateExpenseGroupNameValidator,
} from "../../../validators/apps/expense-split-app/expenseGroup.validator.js";
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
} from "../../../controllers/apps/expense-split-app/group.controller.js";
import { mongoIdPathVariableValidator } from "../../../validators/common/mongodb.validators.js";
import { verifyJWT } from "../../../middlewares/auth.middlewares.js";
const router = Router();
//All routes are secured routes
router.use(verifyJWT);

//Create a new group
router
  .route("/createGroup")
  .post(createAExpenseGroupValidator(), validate, createExpenseGroup);

router
  .route("/:groupId")
  .get(mongoIdPathVariableValidator("groupId"), validate, viewExpenseGroup) //Get all expenses in a group

  //Route to edit group name and description only
  .patch(mongoIdPathVariableValidator("groupId"), validate, editExpenseGroup)
  //Route to delete the whole group
  .delete(
    mongoIdPathVariableValidator("groupId"),
    validate,
    deleteExpenseGroup
  );

//Returns a group balance sheet who owes whom how much
router
  .route("/group-settlements/:groupId")
  .post(mongoIdPathVariableValidator("groupId"), validate, groupBalaceSheet);

//Makes settlement of owes in the group and creates a settlement transaction
router
  .route("/makeSettlement/:groupId")
  .post(mongoIdPathVariableValidator("groupId"), validate, makeSettlement);

router.route("/group").get(getUserExpenseGroups); //Gets all the expense group that user is a part of

router.route("/settlements").get(userSettlementRecords); //Get all user settlements
router.route("/settlements/:groupId").get(groupSettlementRecords); //Get all group settlements

export default router;
