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
        localField: "owner",
        foreignField: "_id",
        as: "owner",
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
    amount,
    category,
    expenseDate,
    participants,
    expenseMethod,
    owner,
  } = req.body;

  //To see if owner exists or not

  const ownerUser = await User.findOne({
    _id: new mongoose.Types.ObjectId(owner),
  });

  if (!ownerUser) {
    throw new ApiError(404, "Owner not found");
  }

  //To see if group exists or not

  const group = await ExpenseGroup.findById(groupId);

  if (!group) {
    throw new ApiError(404, "Group not found");
  }

  if (!group.participants.includes(req.user._id.toString())) {
    throw new ApiError(
      403,
      "You have to be a part of this group to add any expense"
    );
  }

  //Owner has to be participant of the group to add expense in the group
  if (!group.participants.includes(owner.toString())) {
    throw new ApiError(400, "Owner must be part of the group");
  }

  const members = [...new Set([...participants])]; //Checking for duplicate id's and removing them if present

  const invalidParticipants = members.filter(
    (participant) => !group.participants.includes(participant)
  );

  //Check if participant are present in the group all the particpants of expenses has to be particiapant of group

  if (invalidParticipants.length > 0) {
    throw new ApiError(400, "All participants must be part of the group");
  }

  const billFiles = [];

  //For photos of bills of expenses
  if (req.files && req.files.billAttachments?.length > 0) {
    req.files.billAttachments?.map((attachment) => {
      billFiles.push({
        url: getStaticFilePath(req, attachment.filename),
        localPath: getLocalPath(attachment.filename),
      });
    });
  }

  const expensePerMember = amount / members.length;
  const newExpense = await Expense.create({
    name,
    description,
    amount,
    category,
    expenseDate,
    expenseMethod,
    owner: new mongoose.Types.ObjectId(ownerUser._id),
    participants: members,
    expensePerMember,
    groupId: new mongoose.Types.ObjectId(groupId),
    billAttachments: billFiles,
  });

  if (!newExpense) {
    throw new ApiError(500, "Internal Server Error");
  }

  //New Expense is created we need to update the split values in the group and the group total

  addSplit(groupId, amount, owner, members);

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
    amount,
    category,
    expenseDate,
    participants,
    expenseMethod,
    owner,
  } = req.body;

  const oldExpense = await Expense.findById(expenseId);

  if (!oldExpense) {
    throw new ApiError(404, "Expense not found, Invalid expense Id");
  }

  const group = await ExpenseGroup.find({
    _id: new mongoose.Types.ObjectId(oldExpense.groupId),
  });

  if (!group) {
    throw new ApiError(404, "Group not found,Invalid expense to be ediited");
  }

  if (oldExpense.owner.toString() !== req.user._id.toString()) {
    throw new ApiError(403, "You are not authorised to perform this action");
  }

  //Clearing the split in group for the old expense
  await clearSplit(
    oldExpense.groupId,
    oldExpense.amount,
    oldExpense.owner,
    oldExpense.participants
  );

  if (name) {
    oldExpense.name = name;
  }
  if (description) {
    oldExpense.description = description;
  }
  if (amount) {
    oldExpense.amount = amount;
  }
  if (category) {
    oldExpense.category = category;
  }
  if (expenseDate) {
    oldExpense.expenseDate = expenseDate;
  }
  if (participants) {
    const members = [...new Set([...participants])]; //Checking for duplicate id's and removing them if present

    const invalidParticipants = members.filter(
      (participant) => !group.participants.includes(participant)
    );

    if (invalidParticipants.length > 0) {
      throw new ApiError(
        403,
        "Participants of expenses are not participants of group"
      );
    }

    oldExpense.participants = members;
  }
  if (expenseMethod) {
    oldExpense.expenseMethod = expenseMethod;
  }
  if (owner) {
    if (!group.participants.includes(owner)) {
      throw new ApiError(400, "Owner must be part of the group");
    }
    oldExpense.owner = owner;
  }

  //Redifining the expense per memeber if it was possibly changed

  const expensePerMember = (
    oldExpense.amount / oldExpense.participants.length
  ).toFixed(2);

  oldExpense.expensePerMember = expensePerMember;

  //Have to update the split values once again

  //Saving the new expense
  await oldExpense.save();

  //Adding the new split in group
  //Old expense is updated with new values
  await addSplit(
    oldExpense.groupId,
    oldExpense.amount,
    oldExpense.owner,
    oldExpense.participants
  );

  //Common expense aggregations

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

  //The logged in user has to be the owner of the expense to delete it

  if (expense.owner.toString() !== req.user._id.toString()) {
    throw new ApiError(403, "You are not authorised to perform this action");
  }

  await Expense.findByIdAndDelete(expenseId);

  await clearSplit(
    expense.groupId,
    expense.amount,
    expense.owner,
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

  const group = await ExpenseGroup.find({
    _id: new mongoose.Types.ObjectId(expense.groupId),
  });

  //Just a fall through case

  if (!group) {
    throw new ApiError(404, "Group to which this expense is does not exists");
  }

  if (!group.participants.includes(req.user._id.toString())) {
    throw new ApiError(
      403,
      "You are not participant of this group ,You cannot view this expense"
    );
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

  if (!group.participants.includes(req.user._id.toString())) {
    throw new ApiError(403, "You are not part of this group to see expenses");
  }

  const groupExpenses = await Expense.find({
    groupId: groupId,
  }).sort({
    updatedAt: -1,
  });

  if (groupExpenses.length < 1) {
    return res
      .status(200)
      .json(new ApiError(200, {}, "No expense in the group"));
  }

  var totalAmount = 0;

  for (let expense of groupExpenses) {
    totalAmount += Number(expense.amount);
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
const recentUserExpense = asyncHandler(async (req, res) => {
  //Top 5 recent user expense

  const recentExpense = await Expense.find({
    participants: req.user._id,
  })
    .sort({
      updatedAt: -1,
    })
    .limit(5);

  if (recentExpense.length === 0) {
    return res.status(200).json(new ApiResponse(200, {}, "No recent expenses"));
  }

  const aggregatedExpenses = recentExpense.map(async (expense) => {
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

  const payload = await Promise.all(aggregatedExpenses);

  return res
    .status(200)
    .json(
      new ApiResponse(200, { payload }, "Recent Expenses fetched succesfully")
    );
});
const groupCategoryExpense = asyncHandler(async (req, res) => {
  const { groupId } = req.params;

  const group = await ExpenseGroup.findById(groupId);

  if (!group) {
    throw new ApiError(404, "Group not found invalid group id");
  }

  if (!group.participants.includes(req.user._id.toString())) {
    throw new ApiError(
      403,
      "You must be a participant of this group to perform this action"
    );
  }

  const categoryWiseExpenses = await Expense.aggregate([
    {
      $match: {
        groupId: new mongoose.Types.ObjectId(groupId), // Replace this ObjectId with your actual groupId
      },
    },
    {
      $group: {
        _id: "$category",
        expenses: {
          $push: "$$ROOT",
        },
        total: {
          $sum: "$amount",
        },
      },
    },
    {
      $project: {
        _id: 1,
        expenses: 1,
        total: 1,
      },
    },
  ]);

  if (categoryWiseExpenses.length < 0) {
    return res
      .status(200)
      .json(new ApiResponse(200, {}, "Group has no expenses"));
  }

  const aggregatedExpenses = categoryWiseExpenses.map(async (expenseCat) => {
    const aggexp = expenseCat.expenses.map(async (expense) => {
      const payload = await Expense.aggregate([
        {
          $match: { _id: expense._id },
        },
        ...commonExpenseAggregations(),
      ]);

      return payload[0];
    });

    const awaitedReq = await Promise.all(aggexp);
    return { _id: expenseCat._id, expenses: awaitedReq };
  });

  const payload = await Promise.all(aggregatedExpenses);
  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { payload },
        "Category wise group expense fetched succesfully"
      )
    );
});
const userCategoryExpense = asyncHandler(async (req, res) => {
  const categoryWiseExpenses = await Expense.aggregate([
    {
      $match: {
        participants: new mongoose.Types.ObjectId(req.user._id),
      },
    },
    {
      $group: {
        _id: "$category",
        expenses: {
          $push: "$$ROOT",
        },
        total: {
          $sum: "$amount",
        },
      },
    },
    {
      $project: {
        _id: 1,
        expenses: 1,
        total: 1,
      },
    },
  ]);

  if (categoryWiseExpenses.length < 1) {
    return res
      .status(200)
      .json(new ApiResponse(200, {}, "User has no expense"));
  }

  const aggregatedExpenses = categoryWiseExpenses.map(async (expenseCat) => {
    const aggexp = expenseCat.expenses.map(async (expense) => {
      const payload = await Expense.aggregate([
        {
          $match: { _id: expense._id },
        },
        ...commonExpenseAggregations(),
      ]);

      return payload[0];
    });

    const awaitedReq = await Promise.all(aggexp);
    return { _id: expenseCat._id, expenses: awaitedReq };
  });

  const payload = await Promise.all(aggregatedExpenses);

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { payload },
        "User category expenses fetched succesfully"
      )
    );
});
const groupMonthlyExpense = asyncHandler(async (req, res) => {
  const { groupId } = req.params;

  const expenseGroup = await ExpenseGroup.findById(groupId);

  if (!expenseGroup) {
    throw new ApiError(404, "Group not found, invalid group Id");
  }

  if (!expenseGroup.participants.includes(req.user._id.toString())) {
    throw new ApiError(403, "You are not part of this group");
  }

  const monthlyExpenses = await Expense.aggregate([
    {
      $match: {
        groupId: new mongoose.Types.ObjectId(groupId), // Replace this ObjectId with your actual groupId
      },
    },
    {
      $group: {
        _id: {
          month: { $month: "$expenseDate" },
          year: { $year: "$expenseDate" },
        },
        amount: { $sum: "$amount" },
        expenses: { $push: "$$ROOT" },
      },
    },
    {
      $sort: { "_id.month": 1 },
    },
  ]);

  if (monthlyExpenses.length < 1) {
    return res
      .status(200)
      .json(new ApiResponse(200, {}, "No expenses found in this group"));
  }
  const aggregatedExpenses = monthlyExpenses.map(async (expenseMonthly) => {
    const aggexp = expenseMonthly.expenses.map(async (expense) => {
      const payload = await Expense.aggregate([
        {
          $match: { _id: expense._id },
        },
        ...commonExpenseAggregations(),
      ]);

      return payload[0];
    });

    const awaitedReq = await Promise.all(aggexp);
    return {
      _id: expenseMonthly._id,
      amount: expenseMonthly.amount,
      expenses: awaitedReq,
    };
  });

  const payload = await Promise.all(aggregatedExpenses);

  return res
    .status(200)
    .json(
      new ApiResponse(200, { payload }, "Monthly expenses fetched succesfully")
    );
});
const groupDailyExpense = asyncHandler(async (req, res) => {
  const { groupId } = req.params;

  const group = await ExpenseGroup.findById(groupId);
  if (!group) {
    throw new ApiError(404, "Group not found invalid group Id");
  }

  if (!group.participants.includes(req.user._id.toString())) {
    throw new ApiError(403, "You are not part of this group");
  }

  const dailyExpenses = await Expense.aggregate([
    {
      $match: {
        groupId: new mongoose.Types.ObjectId(groupId), // Replace this ObjectId with your actual groupId
      },
    },
    {
      $group: {
        _id: {
          day: { $dayOfMonth: "$expenseDate" },
          month: { $month: "$expenseDate" },
          year: { $year: "$expenseDate" },
        },
        amount: { $sum: "$amount" },
        expenses: { $push: "$$ROOT" },
      },
    },
    {
      $sort: { "_id.year": 1, "_id.month": 1, "_id.day": 1 },
    },
  ]);

  if (dailyExpenses.length < 1) {
    return res
      .status(200)
      .json(new ApiResponse(200, {}, "Group has no expenses"));
  }
  const aggregatedExpenses = dailyExpenses.map(async (expenseDaily) => {
    const aggexp = expenseDaily.expenses.map(async (expense) => {
      const payload = await Expense.aggregate([
        {
          $match: { _id: expense._id },
        },
        ...commonExpenseAggregations(),
      ]);

      return payload[0];
    });

    const awaitedReq = await Promise.all(aggexp);
    return {
      _id: expenseDaily._id,
      amount: expenseDaily.amount,
      expenses: awaitedReq,
    };
  });

  const payload = await Promise.all(aggregatedExpenses);

  return res
    .status(200)
    .json(
      new ApiResponse(200, { payload }, "Monthly expenses fetched succesfully")
    );
});
const userMonthlyExpense = asyncHandler(async (req, res) => {
  const monthlyExpenses = await Expense.aggregate([
    {
      $match: {
        participants: new mongoose.Types.ObjectId(req.user._id),
      },
    },
    {
      $group: {
        _id: {
          month: { $month: "$expenseDate" },
          year: { $year: "$expenseDate" },
        },
        amount: { $sum: "$amount" },
        expenses: { $push: "$$ROOT" },
      },
    },
    {
      $sort: { "_id.month": 1 },
    },
  ]);

  if (monthlyExpenses.length < 1) {
    return res
      .status(200)
      .json(new ApiResponse(200, {}, "User has no expenses"));
  }

  const aggregatedExpenses = monthlyExpenses.map(async (expenseMonthly) => {
    const aggexp = expenseMonthly.expenses.map(async (expense) => {
      const payload = await Expense.aggregate([
        {
          $match: { _id: expense._id },
        },
        ...commonExpenseAggregations(),
      ]);

      return payload[0];
    });

    const awaitedReq = await Promise.all(aggexp);
    return {
      _id: expenseMonthly._id,
      amount: expenseMonthly.amount,
      expenses: awaitedReq,
    };
  });

  const payload = await Promise.all(aggregatedExpenses);

  res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { payload },
        "User monthly expense fetched succesfully"
      )
    );
});
const userDailyExpense = asyncHandler(async (req, res) => {
  const dailyExpenses = await Expense.aggregate([
    {
      $match: {
        participants: new mongoose.Types.ObjectId(req.user._id),
      },
    },
    {
      $group: {
        _id: {
          day: { $dayOfMonth: "$expenseDate" },
          month: { $month: "$expenseDate" },
          year: { $year: "$expenseDate" },
        },
        amount: { $sum: "$amount" },
        expenses: { $push: "$$ROOT" },
      },
    },
    {
      $sort: { "_id.year": 1, "_id.month": 1, "_id.day": 1 },
    },
  ]);

  if (dailyExpenses.length < 1) {
    return res
      .status(200)
      .json(new ApiResponse(200, {}, "user has no expenses"));
  }
  const aggregatedExpenses = dailyExpenses.map(async (expenseDaily) => {
    const aggexp = expenseDaily.expenses.map(async (expense) => {
      const payload = await Expense.aggregate([
        {
          $match: { _id: expense._id },
        },
        ...commonExpenseAggregations(),
      ]);

      return payload[0];
    });

    const awaitedReq = await Promise.all(aggexp);
    return {
      _id: expenseDaily._id,
      amount: expenseDaily.amount,
      expenses: awaitedReq,
    };
  });

  const payload = await Promise.all(aggregatedExpenses);
  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { payload },
        "User daily expense fetched succesfully"
      )
    );
});
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
