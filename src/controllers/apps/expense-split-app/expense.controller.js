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
  return [
    {
      $lookup: {
        from: "users",
        localField: "Owner",
        foreignField: "_id",
        as: "Owner",
        pipeline: [
          {
            $project: {
              password: 0,
              refreshToken: 0,
              forgotPasswordToken: 0,
              forgotPasswordExpiry: 0,
              emailVerificationToken: 0,
              emailVerificationExpiry: 0,
            },
          },
        ],
      },
    },
    {
      $lookup: {
        from: "users",
        foreignField: "_id",
        localField: "participants",
        as: "participants",
        pipeline: [
          {
            $project: {
              password: 0,
              refreshToken: 0,
              forgotPasswordToken: 0,
              forgotPasswordExpiry: 0,
              emailVerificationToken: 0,
              emailVerificationExpiry: 0,
            },
          },
        ],
      },
    },
    {
      $lookup: {
        from: "expensegroups",
        foreignField: "_id",
        localField: "groupId",
        as: "groupId",
        pipeline: [
          {
            $lookup: {
              from: "users",
              foreignField: "_id",
              localField: "participants",
              as: "participants",
              pipeline: [
                {
                  $project: {
                    password: 0,
                    refreshToken: 0,
                    forgotPasswordToken: 0,
                    forgotPasswordExpiry: 0,
                    emailVerificationToken: 0,
                    emailVerificationExpiry: 0,
                  },
                },
              ],
            },
          },
          {
            $lookup: {
              from: "users",
              localField: "groupOwner",
              foreignField: "_id",
              as: "groupOwner",
              pipeline: [
                {
                  $project: {
                    password: 0,
                    refreshToken: 0,
                    forgotPasswordToken: 0,
                    forgotPasswordExpiry: 0,
                    emailVerificationToken: 0,
                    emailVerificationExpiry: 0,
                  },
                },
              ],
            },
          },
        ],
      },
    },
  ];
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

  if (!ownerUser) {
    throw new ApiError(404, "Owner not found");
  }

  const group = await ExpenseGroup.findById(groupId);

  if (!group) {
    throw new ApiError(404, "Group not found");
  }

  if (!group.participants.includes(Owner)) {
    throw new ApiError(400, "Owner must be part of the group");
  }

  const members = [...new Set([...participants])]; //Checking for duplicate id's and removing them if present
  const invalidParticipants = participants.filter(
    (participant) => !group.participants.includes(participant)
  ); //Check if participant are present in the group
  if (invalidParticipants.length > 0) {
    throw new ApiError(400, "All participants must be part of the group");
  }

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

  const aggregatedExpense = await Expense.aggregate([
    {
      $match: {
        _id: newExpense._id,
      },
    },
    ...commonExpenseAggregations(),
  ]);
  const payload = aggregatedExpense[0];
  return res
    .status(200)
    .json(new ApiResponse(200, { payload }, "new Expense created succesfully"));
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

  const oldExpense = await Expense.findById(expenseId);

  if (!oldExpense) {
    throw new ApiError(404, "Expense not found, Invalid expense Id");
  }

  if (oldExpense.Owner.toString() !== req.user._id.toString()) {
    throw new ApiError(403, "You are not authorised to perform this action");
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
  }
  if (expenseMethod) {
    oldExpense.expenseMethod = expenseMethod;
  }
  if (Owner) {
    oldExpense.Owner = Owner;
  }

  const expensePerMember = (
    oldExpense.Amount / oldExpense.participants.length
  ).toFixed(2);

  oldExpense.expensePerMember = expensePerMember;

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

  const aggregatedExpense = await Expense.aggregate([
    {
      $match: {
        _id: oldExpense._id,
      },
    },
    ...commonExpenseAggregations(),
  ]);

  const payload = aggregatedExpense[0];

  return res
    .status(200)
    .json(new ApiResponse(200, { payload }, "Expense updated succesfully"));
});
const deleteExpense = asyncHandler(async (req, res) => {
  const { expenseId } = req.params;

  const expense = await Expense.findById(expenseId);
  if (!expense) {
    throw new ApiError(404, "expense not found, Invalid expense Id");
  }
  console.log(expense.Owner);
  console.log(req.user._id);
  if (expense.Owner.toString() !== req.user._id.toString()) {
    throw new ApiError(403, "You are not authorised to perform this action");
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

  //! should i check if req._id is a part of group or expense ?? or anyone logged in user can fetch expense with expense Id??

  const expense = await Expense.findById(expenseId);

  if (!expense) {
    throw new ApiError(404, "Expense not found, invalid expense Id");
  }

  const aggregatedExpense = await Expense.aggregate([
    {
      $match: { _id: expense._id },
    },
    ...commonExpenseAggregations(),
  ]);

  const payload = aggregatedExpense[0];

  return res
    .status(200)
    .json(new ApiResponse(200, { payload }, "Expense Fetched succesfully"));
});
const viewGroupExpense = asyncHandler(async (req, res) => {
  const { groupId } = req.params;

  const group = await ExpenseGroup.findById(groupId);
  if (!group) {
    throw new ApiError(404, "Group not found, Invalid group Id");
  }

  if (!group.participants.includes(req.user._id)) {
    throw new ApiError(403, "You are not part of this group to see expenses");
  }

  const groupExpenses = await Expense.find({
    groupId: groupId,
  }).sort({
    expenseDate: -1,
  });

  if (groupExpenses.length === 0) {
    return res
      .status(200)
      .json(new ApiError(200, {}, "No expense in the group"));
  }

  var totalAmount = 0;

  for (let expense of groupExpenses) {
    totalAmount += Number(expense.Amount);
  }

  const agrregatedExpenses = groupExpenses.map(async (expense) => {
    const agrregatedExpense = await Expense.aggregate([
      {
        $match: {
          _id: expense._id,
        },
      },
      ...commonExpenseAggregations(),
    ]);
    return agrregatedExpense[0];
  });

  const expenses = await Promise.all(agrregatedExpenses);

  res.status(200).json(
    new ApiResponse(
      200,
      {
        payload: { expenses, totalAmount: totalAmount },
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
const viewUserExpense = asyncHandler(async (req, res) => {
  const userExpenses = await Expense.find({
    participants: req.user?._id,
  }).sort({
    updatedAt: -1, //to get the newest first
  });

  if (userExpenses.length < 1) {
    return res
      .status(200)
      .json(new ApiResponse(200, {}, "User has no expense"));
  }

  var totalAmount = 0;

  for (let expense of userExpenses) {
    totalAmount += Number(expense.expensePerMember);
  }

  const agrregatedExpenses = userExpenses.map(async (expense) => {
    const agrregatedExpense = await Expense.aggregate([
      {
        $match: {
          _id: expense._id,
        },
      },
      ...commonExpenseAggregations(),
    ]);
    return agrregatedExpense[0];
  });

  const expenses = await Promise.all(agrregatedExpenses);

  res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { payload: { expenses: expenses, total: totalAmount } },
        "User expenses fetched succesfully"
      )
    );
});

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
