import { Router } from "express";
import {
  addExpense,
  deleteExpense,
  editExpense,
  groupCategoryExpense,
  groupDailyExpense,
  groupMonthlyExpense,
  recentUserExpense,
  userCategoryExpense,
  userDailyExpense,
  userMonthlyExpense,
  viewExpense,
  viewGroupExpense,
  viewUserExpense,
} from "../../../controllers/apps/expense-split-app/expense.controller.js";
import { addAExpenseValidator } from "../../../validators/apps/expense-split-app/expense.validator.js";
import { validate } from "../../../validators/validate.js";
import { mongoIdPathVariableValidator } from "../../../validators/common/mongodb.validators.js";
import { verifyJWT } from "../../../middlewares/auth.middlewares.js";
import { upload } from "../../../middlewares/multer.middlewares.js";
const router = Router();

//all routes are secured routes

router.use(verifyJWT);

//Creates a new expense accepts bill photos also

//! Validated

router
  .route("/addexpense/:groupId")
  .post(
    upload.fields([{ name: "billAttachments", maxCount: 5 }]),
    addAExpenseValidator(),
    mongoIdPathVariableValidator("groupId"),
    validate,
    addExpense
  );

router
  .route("/:expenseId")

  // gets expense details

  //! Validated

  .get(mongoIdPathVariableValidator("expenseId"), validate, viewExpense)

  //edit expense details not the bills attachments

  //!Validated

  .patch(mongoIdPathVariableValidator("expenseId"), validate, editExpense)

  //Deletes expenses

  //! Validated

  .delete(mongoIdPathVariableValidator("expenseId"), validate, deleteExpense);

router
  .route("/group/:groupId")

  //shows all the expense in a group

  //! validated

  .get(mongoIdPathVariableValidator("groupId"), validate, viewGroupExpense);

//View all the expense of the user

//!validated

router.route("/user/expense").get(viewUserExpense);

//Gives top 5 recent user expenses

router.route("/user/recentexpense").get(recentUserExpense);

//Sorts all the expenses of user month wise and displays recent first

router.route("monthlyexpense/user").get(userMonthlyExpense);

//shows all user expenses category wise

//!validated aggregations left

router.route("/categoryexpense/user").get(userCategoryExpense);

//Shows the daily expense of user of that day

router.route("/dailyexpense/user").get(userDailyExpense);

//Shows all the expense in a group month wise

router
  .route("/monthlyexpense/group/:groupId")
  .get(mongoIdPathVariableValidator("groupId"), validate, groupMonthlyExpense);

//Shows all the expense in a group daily

router
  .route("/dailyexpense/group/:groupId")
  .get(mongoIdPathVariableValidator("groupId"), validate, groupDailyExpense);

//Shows all the expense in a group category wise
//! validated aggregation left
router
  .route("/categoryexpense/group/:groupId")
  .get(mongoIdPathVariableValidator("groupId"), validate, groupCategoryExpense);

export default router;
