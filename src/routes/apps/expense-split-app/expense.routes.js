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
const router = Router();
//all routes are secured routes
router.use(verifyJWT);
router
  .route("/addExpense/:groupId")
  .post(
    mongoIdPathVariableValidator("groupId"),
    addAExpenseValidator,
    validate,
    addExpense
  );
router
  .route("/:expenseId")
  .get(mongoIdPathVariableValidator("expenseId"), validate, viewExpense)
  .patch(mongoIdPathVariableValidator("expenseId"), validate, editExpense)
  .delete(mongoIdPathVariableValidator("expenseId"), validate, deleteExpense);

router
  .route("/group/:groupId")
  .get(mongoIdPathVariableValidator("groupId"), validate, viewGroupExpense);

router.route("/user/expense").get(viewUserExpense);

router.route("/user/recentExpense").get(recentUserExpense);
router.route("monthlyExpense/user").get(userMonthlyExpense);

router.route("/categoryExp/user").get(userCategoryExpense);
router.route("/dailyExpense/user").get(userDailyExpense);

router
  .route("/monthlyExpense/group/:groupId")
  .get(mongoIdPathVariableValidator("groupId"), validate, groupMonthlyExpense);

router
  .route("/dailyExpense/group/:groupId")
  .get(mongoIdPathVariableValidator("groupId"), validate, groupDailyExpense);
router
  .route("/categoryExpense/group/:groupId")
  .get(mongoIdPathVariableValidator("groupId"), validate, groupCategoryExpense);

export default router;
