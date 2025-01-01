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
import { addAnExpenseValidator } from "../../../validators/apps/expense-split-app/expense.validator.js";
import { validate } from "../../../validators/validate.js";
import { mongoIdPathVariableValidator } from "../../../validators/common/mongodb.validators.js";
import { verifyJWT } from "../../../middlewares/auth.middlewares.js";
import { upload } from "../../../middlewares/multer.middlewares.js";
const router = Router();

router.use(verifyJWT);

router
  .route("/addexpense/:groupId")
  .post(
    upload.fields([{ name: "billAttachments", maxCount: 5 }]),
    addAnExpenseValidator(),
    mongoIdPathVariableValidator("groupId"),
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

router.route("/user/recentexpense").get(recentUserExpense);

router.route("/monthlyexpense/user").get(userMonthlyExpense);

router.route("/categoryexpense/user").get(userCategoryExpense);

router.route("/dailyexpense/user").get(userDailyExpense);

router
  .route("/monthlyexpense/group/:groupId")
  .get(mongoIdPathVariableValidator("groupId"), validate, groupMonthlyExpense);

router
  .route("/dailyexpense/group/:groupId")
  .get(mongoIdPathVariableValidator("groupId"), validate, groupDailyExpense);

router
  .route("/categoryexpense/group/:groupId")
  .get(mongoIdPathVariableValidator("groupId"), validate, groupCategoryExpense);

export default router;
