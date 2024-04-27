import { model } from "mongoose";
import { asyncHandler } from "../../../utils/asyncHandler.js";
import { ExpenseGroup } from "../../../models/apps/expense-split-app/expenseGroup.model.js";
import { Expense } from "../../../models/apps/expense-split-app/expense.model.js";
import { ApiResponse } from "../../../utils/ApiResponse.js";
import { ExpenseGroupTypes } from "../../../constants.js";
import { ApiError } from "../../../utils/ApiError.js";
import { Settlement } from "../../../models/apps/expense-split-app/settlement.model.js";

const commonGroupAggregation = () => {
  //This is the common aggregation for Response structure of group
  // ! Have to figure out the split lookup [work in progress]
  return [
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
  ];
};

const deleteCascadeExpenses = async (groupId) => {
  // Helper function to delete the expenses when a group is deleted along with its settlements

  const expenses = await Expense.find({
    groupId: groupId,
  });
};

const createExpenseGroup = asyncHandler(async (req, res) => {
  const { name, description, participants, groupCategory } = req.body;
  const members = [...new Set([...participants])]; //Prevents duplications
  let splitJson = {}; // Initializing the split of the group
  for (let user of members) {
    splitJson[user] = 0;
  }
  let split = splitJson;

  var group = await ExpenseGroup.create({
    name,
    description,
    groupOwner: req.user._id,
    participants: members,
    groupCategory: groupCategory ? groupCategory : ExpenseGroupTypes.OTHERS,
    split: split,
  });

  const newGroup = await ExpenseGroup.aggregate([
    {
      $match: {
        _id: group._id,
      },
    },
    ...commonGroupAggregation(),
  ]);

  return res
    .status(200)
    .json(new ApiResponse(200, { newGroup }, "Group created succesfully"));
});
const viewExpenseGroup = asyncHandler(async (req, res) => {
  const { groupId } = req.params;

  const group = await ExpenseGroup.findById(groupId);

  if (!group) {
    throw new ApiError(404, "Group not found, Invalid group id");
  }

  //Doing the common aggregations

  const Group = await ExpenseGroup.aggregate([
    {
      $match: {
        _id: group._id,
      },
    },
    ...commonGroupAggregation(),
  ]);

  return res
    .status(200)
    .json(new ApiResponse(200, { Group }, "Group fetched succesfully"));
});
const getUserExpenseGroups = asyncHandler(async (req, res) => {
  const userGroups = await ExpenseGroup.find({
    participants: req.user._id,
  }); //Will have to sort with aggregations for newer first
  //And also have to give every group common group aggregations

  if (userGroups.length < 1) {
    return res
      .status(200)
      .json(new ApiResponse(200, {}, "User is not part of any expense groups"));
  }

  return res
    .status(200)
    .json(
      new ApiResponse(200, { userGroups }, "User groups fetched succesfully")
    );
});
const groupBalaceSheet = asyncHandler(async (req, res) => {
  const { groupId } = req.params;

  //Validations

  //Work in progress

  //This will return all the balances accumulate din a group who owes whom and how much by analyzing the group split and expenses
});
const makeSettlement = asyncHandler(async (req, res) => {
  const { groupId } = req.params;

  const { settleTo, settleFrom, settleAmount, settleDate } = req.body;

  if (!settleTo || !settleFrom || !settleAmount || !settleDate) {
    throw new ApiError(400, "All the fields are required");
  }

  const group = await ExpenseGroup.findById(groupId);
  if (!group) {
    throw new ApiError(404, "Group not found, Invalid group Id");
  }

  group.split[0][settleFrom] += settleAmount;
  group.split[0][settleTo] -= settleAmount;

  const settlement = await Settlement.create({
    settleTo,
    settleFrom,
    SettlementDate: settleDate || Date.now(),
    settleAmount,
    groupId,
  });

  const updateGroup = await ExpenseGroup.updateOne(
    {
      _id: groupId,
    },
    { $set: { split: group.split } }
  );

  res.status(200).json(new ApiResponse(200, {}, "Settlement done succesfully"));
});
const deleteExpenseGroup = asyncHandler(async (req, res) => {});
const editExpenseGroup = asyncHandler(async (req, res) => {});
const addMembersInExpenseGroup = asyncHandler(async (req, res) => {});
const removeMembersFromExpenseGroups = asyncHandler(async (req, res) => {});
const leaveExpenseGroup = asyncHandler(async (req, res) => {});

//Supporting function

export const addSplit = async (groupId, Amount, Owner, members) => {
  /*
  
  *+ve = Amount for recieveables
  *-ve = Amount for payables
  
  */

  const group = await ExpenseGroup.findById(groupId);
  //Adding the expense amount in group total

  group.groupTotal += Amount;

  //Adding positive value to owner of the expense

  group.split[0][Owner] += Amount;

  let expensePerPerson = Amount / members.length;

  expensePerPerson = expensePerPerson.toFixed(2);

  //Updating the split values payable per user

  for (let user of members) {
    group.split[0][user] -= expensePerPerson;
  }

  //Nullyfing split -check if the group balance is zero else added the diff to owner
  //Total sum of values both negative and postive has to be zero

  let bal = 0;

  for (val of Object.entries(group.split[0])) {
    bal += val[1];
  }
  group.split[0][Owner] -= bal;
  group.split[0][Owner] = group.split[0][Owner].toFixed(2);

  await ExpenseGroup.updateOne(
    {
      _id: groupId,
    },
    group
  );
};

//This works reverse of add split used for editting or clearing expense
export const clearSplit = async (groupId, Amount, Owner, participants) => {
  let group = await ExpenseGroup.findById({ groupId });
  group.groupTotal -= Amount;
  group.split[0][Owner] -= Amount;
  let expensePerPerson = expenseAmount / participants.length;
  expensePerPerson = expensePerPerson.toFixed(2);

  for (var user of participants) {
    group.split[0][user] += expensePerPerson;
  }

  //Nullyfying split -check if the group balance is zero else add the diff to owner

  let bal = 0;

  for (val of Object.entries(group.split[0])) {
    bal += val[1];
  }

  group.split[0] -= bal;
  group.split[0] = group.split[0].toFixed(2);

  return await ExpenseGroup.updateOne(
    {
      _id: groupId,
    },
    group
  );
};
//Responsible for finding out group balances
const groupBalanceCalculator = (split) => {
  var splits = new Array();
  var transaction_map = new Map(Object.entries(split)); //converting JSON to map object

  //This function finds simialr +ve -ve figures and matches them if present

  function settleSimilarFigures() {
    let vis = new Map();
    for (let transaction1 of transaction_map.keys()) {
      vis.set(transaction1, 1);
      for (let transaction2 of transaction_map.keys()) {
        if (!vis.has(transaction2) && transaction1 != transaction2) {
          if (
            transaction_map.get(transaction2) ==
            -transaction_map.get(transaction1)
          ) {
            if (
              transaction_map.get(transaction2) >
              transaction_map.get(transaction1)
            ) {
              splits.push([
                transaction1,
                transaction2,
                transaction_map.get(transaction2),
              ]);
            } else {
              splits.push([
                transaction2,
                transaction1,
                transaction_map.get(transaction1),
              ]);
            }
            transaction_map.set(transaction2, 0);
            transaction_map.set(transaction1, 0);
          }
        }
      }
    }
  }

  /**
   *
   * This is a helper function for founction helper that returns maximum and minimum values in the split
   */

  function getMaxMinCredit() {
    let max_ob,
      min_ob,
      max = Number.MIN_VALUE,
      min = Number.MAX_VALUE;
    for (let transaction of transaction_map.keys()) {
      if (transaction_map.get(transaction) < min) {
        min = transaction_map.get(transaction);
        min_ob = transaction;
      }
      if (transaction_map.get(transaction) > max) {
        max = transaction_map.get(transaction);
        max_ob = transaction;
      }
    }
    return [min_ob, max_ob];
  }

  //This function creates the settlement figures between uneven +ve and -ve values to create the balances of users in the group

  function helper() {
    let minMax = getMaxMinCredit();
    if (minMax[0] == undefined || minMax[1] == undefined) return;
    let min_value = Math.min(
      -transaction_map.get(minMax[0]),
      transaction_map.get(minMax[1])
    );
    transaction_map.set(minMax[0], transaction_map.get(minMax[0]) + min_value);
    transaction_map.set(minMax[1], transaction_map.get(minMax[1]) - min_value);
    min_value = Math.round((min_value + Number.EPSILON) * 100) / 100;
    let res = [minMax[0], minMax[1], min_value];
    splits.push(res);
    helper();
  }

  settleSimilarFigures();
  helper();
  return splits;
};
export {
  createExpenseGroup,
  viewExpenseGroup,
  getUserExpenseGroups,
  groupBalaceSheet,
  makeSettlement,
  deleteExpenseGroup,
  editExpenseGroup,
  addMembersInExpenseGroup,
  removeMembersFromExpenseGroups,
  leaveExpenseGroup,
};
