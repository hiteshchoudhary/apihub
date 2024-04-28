import { User } from "../../../models/apps/auth/user.models.js";
import { Expense } from "../../../models/apps/expense-split-app/expense.model.js";
import { ApiError } from "../../../utils/ApiError.js";
import { asyncHandler } from "../../../utils/asyncHandler.js";
import { ApiResponse } from "../../../utils/ApiResponse.js";
import { ExpenseGroup } from "../../../models/apps/expense-split-app/expensegroup.model.js";
import { addSplit, clearSplit } from "./group.controller.js";
import mongoose from "mongoose";
import { getLocalPath, getStaticFilePath } from "../../../utils/helpers.js";
const commonExpenseAggregations = () => {
  return [{}];
};

const addExpense = asyncHandler(async (req, res) => {
  const { groupId } = req.params;
  const {
    name,
    description,
    Amount,
    Category,
    expenseDate,
    participants,
    expenseMethod,
    Owner,
  } = req.body;
  const ownerUser = await User.findOne({
    _id: new mongoose.Types.ObjectId(Owner),
  });

  //! have to check if expense participants are present in the group or not
  if (!ownerUser) {
    throw new ApiError(404, "Owner not found");
  }

  const group = await ExpenseGroup.findById(groupId);

  if (!group) {
    throw new ApiError(404, "Group not found");
  }

  const members = [...new Set([...participants])]; //Checking for duplicate id's and removing them if present
  const billFiles = [];
  console.log(req.files);

  if (req.files && req.files.billAttachments?.length > 0) {
    req.files.billAttachments?.map((attachment) => {
      billFiles.push({
        url: getStaticFilePath(req, attachment.filename),
        localPath: getLocalPath(attachment.filename),
      });
    });
  }

  const expensePerMember = Amount / members.length;
  const newExpense = await Expense.create({
    name,
    description,
    Amount,
    Category,
    expenseDate,
    expenseMethod,
    Owner: new mongoose.Types.ObjectId(ownerUser._id),
    participants,
    expensePerMember,
    groupId: new mongoose.Types.ObjectId(groupId),
    billAttachments: billFiles,
  });

  if (!newExpense) {
    throw new ApiError(500, "Internal Server Error");
  }

  //New Expense is created we need to update the split values in the group and the group total

  addSplit(groupId, Amount, Owner, members);

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { expense: newExpense },
        "new Expense created succesfully"
      )
    );
});

const editExpense = asyncHandler(async (req, res) => {
  const { expenseId } = req.params;

  const {
    name,
    description,
    Amount,
    Category,
    expenseDate,
    participants,
    expenseMethod,
    Owner,
  } = req.body;

  const oldExpense = Expense.findById(expenseId);

  if (!oldExpense) {
    throw new ApiError(404, "Expense not found, Invalid expense Id");
  }

  //Clearing the split in group for the old expense
  await clearSplit(
    oldExpense.groupId,
    oldExpense.Amount,
    oldExpense.Owner,
    oldExpense.participants
  );

  if (name) {
    oldExpense.name = name;
  }
  if (description) {
    oldExpense.description = description;
  }
  if (Amount) {
    oldExpense.Amount = Amount;
  }
  if (Category) {
    oldExpense.Category = Category;
  }
  if (expenseDate) {
    oldExpense.expenseDate = expenseDate;
  }
  if (participants) {
    oldExpense.participants = participants;
    const expensePerMember = Amount / participants.length;
    oldExpense.expensePerMember = expensePerMember;
  }
  if (expenseMethod) {
    oldExpense.expenseMethod = expenseMethod;
  }
  if (Owner) {
    oldExpense.Owner = Owner;
  }

  //Have to update the split values once again

  //Saving the new expense
  await oldExpense.save();

  //Adding the new split in group
  //Old expense is updated with new values
  await addSplit(
    oldExpense.groupId,
    oldExpense.Amount,
    oldExpense.Owner,
    oldExpense.participants
  );

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { expense: oldExpense },
        "Expense updated succesfully"
      )
    );
});
const deleteExpense = asyncHandler(async (req, res) => {
  const { expenseId } = req.params;

  const expense = await Expense.findById(expenseId);
  if (!expense) {
    throw new ApiError(404, "expense not found, Invalid expense Id");
  }

  await Expense.findByIdAndDelete(expenseId);

  await clearSplit(
    expense.groupId,
    expense.Amount,
    expense.Owner,
    expense.participants
  );

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Expense Deleted successfully"));
});
const viewExpense = asyncHandler(async (req, res) => {
  const { expenseId } = req.params;

  const expense = await Expense.findById(expenseId);

  if (!expense) {
    throw new ApiError(404, "Expense not found, invalid expense Id");
  }

  return res
    .status(200)
    .json(
      new ApiError(200, { expense: expense }, "Expense Fetched succesfully")
    );
});
const viewGroupExpense = asyncHandler(async (req, res) => {
  const { groupId } = req.params;
  const groupExpenses = await Expense.find({
    groupId: groupId,
  }).sort({
    expenseDate: -1,
  });

  if (groupExpenses.length === 0) {
    throw new ApiError(400, "There is no expense in the group");
  }

  var totalAmount = 0;

  for (let expense of groupExpenses) {
    totalAmount += expense;
  }

  res.status(200).json(
    new ApiResponse(
      200,
      {
        expenses: groupExpenses,
        totalAmount: totalAmount,
      },
      "Group expenses fetched succesfully"
    )
  );
});
const recentUserExpense = asyncHandler(async (req, res) => {});
const groupCategoryExpense = asyncHandler(async (req, res) => {});
const userCategoryExpense = asyncHandler(async (req, res) => {});
const groupMonthlyExpense = asyncHandler(async (req, res) => {});
const groupDailyExpense = asyncHandler(async (req, res) => {});
const userMonthlyExpense = asyncHandler(async (req, res) => {});
const userDailyExpense = asyncHandler(async (req, res) => {});
const viewUserExpense = asyncHandler(async (req, res) => {});

export {
  addExpense,
  editExpense,
  deleteExpense,
  viewExpense,
  viewGroupExpense,
  recentUserExpense,
  groupCategoryExpense,
  userCategoryExpense,
  groupMonthlyExpense,
  groupDailyExpense,
  userMonthlyExpense,
  userDailyExpense,
  viewUserExpense,
};
