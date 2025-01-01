import { asyncHandler } from "../../../utils/asyncHandler.js";
import { ExpenseGroup } from "../../../models/apps/expense-split-app/expensegroup.model.js";
import { Expense } from "../../../models/apps/expense-split-app/expense.model.js";
import { ApiResponse } from "../../../utils/ApiResponse.js";
import { ExpenseGroupTypes } from "../../../constants.js";
import { ApiError } from "../../../utils/ApiError.js";
import { Settlement } from "../../../models/apps/expense-split-app/settlement.model.js";
import { User } from "../../../models/apps/auth/user.models.js";
import { removeLocalFile } from "../../../utils/helpers.js";
import mongoose from "mongoose";
const commonSettlementAggregations = () => {
  return [
    {
      $lookup: {
        from: "users",
        localField: "settleTo",
        foreignField: "_id",
        as: "settleTo",
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
        localField: "settleFrom",
        foreignField: "_id",
        as: "settleFrom",
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
        localField: "groupId",
        foreignField: "_id",
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
        ],
      },
    },
  ];
};
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

  let attachments = [];

  attachments = attachments.concat(
    ...expenses.map((expense) => expense.billAttachments)
  );

  attachments.forEach((attachment) => {
    removeLocalFile(attachment.localPath);
  });

  await Expense.deleteMany({
    groupId: new mongoose.Types.ObjectId(groupId),
  });

  await Settlement.deleteMany({
    groupId: new mongoose.Types.ObjectId(groupId),
  });
};

const searchAvailableUsers = asyncHandler(async (req, res) => {
  const users = await User.aggregate([
    {
      $match: {
        _id: {
          $ne: req.user._id, // avoid logged in user
        },
      },
    },
    {
      $project: {
        avatar: 1,
        username: 1,
        email: 1,
      },
    },
  ]);

  return res
    .status(200)
    .json(new ApiResponse(200, users, "Users fetched successfully"));
});

const createExpenseGroup = asyncHandler(async (req, res) => {
  const { name, description, participants, groupCategory } = req.body;

  // Check if user is not sending himself as a participant. This will be done manually
  if (participants.includes(req.user._id.toString())) {
    throw new ApiError(
      400,
      "Participants array should not contain the group creator"
    );
  }
  //Name and Participants is already checked in validator no need to check here
  const members = [...new Set([...participants, req.user._id.toString()])]; //Prevents duplications

  async function isValidUser(members) {
    for (const user of members) {
      const foundUser = await User.findById(user);
      if (!foundUser) {
        return false;
      }
    }
    return true;
  }
  //Checking if all the users exists or not
  const isValid = await isValidUser(members);
  if (!isValid) {
    throw new ApiError(
      400,
      "Invalid participant Id, Participant does not exist"
    );
  }

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

  const payload = newGroup[0];
  return res
    .status(200)
    .json(new ApiResponse(200, { payload }, "Group created succesfully"));
});
const viewExpenseGroup = asyncHandler(async (req, res) => {
  const { groupId } = req.params;

  const group = await ExpenseGroup.findById(groupId);

  if (!group) {
    throw new ApiError(404, "Group not found, Invalid group id");
  }

  if (!group.participants.includes(req.user._id.toString())) {
    throw new ApiError(403, "You are not part of the group");
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
  }).sort({
    createdAt: -1,
  }); //Will have to sort with aggregations for newer first

  if (userGroups.length < 1) {
    return res
      .status(200)
      .json(new ApiResponse(200, {}, "User is not part of any expense groups"));
  }

  const aggregatedGroups = userGroups.map(async (group) => {
    const aggregatedGroup = await ExpenseGroup.aggregate([
      {
        $match: {
          _id: group._id,
        },
      },
      ...commonGroupAggregation(),
    ]);
    return aggregatedGroup[0];
  });

  const groups = await Promise.all(aggregatedGroups);

  return res
    .status(200)
    .json(new ApiResponse(200, { groups }, "User groups fetched succesfully"));
});
const groupBalaceSheet = asyncHandler(async (req, res) => {
  const { groupId } = req.params;

  const expenseGroup = await ExpenseGroup.findById(groupId);

  if (!expenseGroup) {
    throw new ApiError(404, "Group not found, Invalid group ID");
  }

  if (!expenseGroup.participants.includes(req.user._id.toString())) {
    throw new ApiError(403, "You are not participant of this group");
  }

  const balanceData = groupBalanceCalculator(expenseGroup.split);

  const agrregatedData = balanceData.map(async (data) => {
    let array = [];
    for (let i = 0; i <= 1; i++) {
      const user = await User.findById(data[i]).select(
        " -password -refreshToken -forgotPasswordToken -forgotPasswordExpiry -emailVerificationToken -emailVerificationExpiry"
      );
      if (i === 0) {
        array.push({ settleFrom: user });
      } else {
        array.push({ settleTo: user });
      }
    }

    array.push({ value: data[2] });

    return array;
  });

  const payload = await Promise.all(agrregatedData);

  return res
    .status(200)
    .json(
      new ApiResponse(200, { payload }, "Group balance fetched succesfully")
    );

  //This will return all the balances accumulated in a group who owes whom and how much by analyzing the group split and expenses
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
  if (!group.participants.includes(req.user._id.toString())) {
    throw new ApiError(403, "You are not part of this group");
  }

  if (
    settleTo.toString() !== req.user._id.toString() &&
    settleFrom !== req.user._id.toString()
  ) {
    throw new ApiError(
      403,
      "You can only settle with yourself or the other participant"
    );
  }

  const updatedSplit = group.split;

  updatedSplit.set(
    String(settleFrom),
    updatedSplit.get(settleFrom) + settleAmount
  );
  updatedSplit.set(
    String(settleTo),
    Number(updatedSplit.get(settleTo)) - Number(settleAmount)
  );

  // Save the updated split back to the group
  group.split = updatedSplit;

  const settlement = await Settlement.create({
    settleTo,
    settleFrom,
    settlementDate: settleDate || Date.now(),
    amount: settleAmount,
    groupId,
  });

  await group.save();

  const aggregatedSettlement = await Settlement.aggregate([
    {
      $match: {
        _id: settlement._id,
      },
    },
    ...commonSettlementAggregations(),
  ]);

  const payload = aggregatedSettlement[0];

  res
    .status(200)
    .json(new ApiResponse(200, { payload }, "Settlement done succesfully"));
});
const deleteExpenseGroup = asyncHandler(async (req, res) => {
  const { groupId } = req.params;
  const expenseGroup = await ExpenseGroup.findById(groupId);
  if (!expenseGroup) {
    throw new ApiError(404, "Group not found, Invalid group id");
  }

  if (expenseGroup.groupOwner.toString() !== req.user._id.toString()) {
    throw new ApiError(
      403,
      "you are not the owner of this group to perform this action"
    );
  }

  await deleteCascadeExpenses(groupId); //deleting expenses and settlement
  await ExpenseGroup.findByIdAndDelete(groupId);
  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Expense Group deleted succesfully"));
});
const editExpenseGroup = asyncHandler(async (req, res) => {
  const { groupId } = req.params;
  const group = await ExpenseGroup.findById(groupId);
  const { name, description } = req.body;
  if (!group) {
    throw new ApiError(404, "Group not found, Invalid group Id");
  }

  if (!name && !description) {
    throw new ApiError(400, "Enter something that needs to be updated");
  }

  if (group.groupOwner.toString() !== req.user?._id.toString()) {
    throw new ApiError(403, "You are not authorised to perform this action");
  }

  if (name) {
    group.name = name;
  }

  if (description) {
    group.description = description;
  }

  await group.save();

  const updatedGroup = await ExpenseGroup.aggregate([
    {
      $match: {
        _id: group._id,
      },
    },
    ...commonGroupAggregation(),
  ]);
  const payload = updatedGroup[0];
  return res
    .status(200)
    .json(new ApiResponse(200, { payload }, "Group updated succesfully"));
});

const addMembersInExpenseGroup = asyncHandler(async (req, res) => {
  const { groupId, userId } = req.params;
  const group = await ExpenseGroup.findById(groupId);
  if (!group) {
    throw new ApiError(404, "Group not found , Invalid group Id");
  }
  const user = await User.findById(userId);

  if (!user) {
    throw new ApiError(404, "User not found ,Invalid user id");
  }
  if (group.groupOwner.toString() !== req.user?._id.toString()) {
    throw new ApiError(403, "You are not authorised to perform this action");
  }

  const existingParticipants = group.participants;

  if (existingParticipants?.includes(userId)) {
    throw new ApiError(409, "Participants already in group chat");
  }
  //Updating the split of group with new member
  group.set(`split.${userId.toString()}`, 0);
  //Updating the participant id
  group.participants.push(userId);

  await group.save();

  const edittedGroup = await ExpenseGroup.aggregate([
    {
      $match: {
        _id: group._id,
      },
    },
    ...commonGroupAggregation(),
  ]);
  const payload = edittedGroup[0];

  return res
    .status(200)
    .json(new ApiResponse(200, { payload }, "Memeber added succesfully"));
});

const groupSettlementRecords = asyncHandler(async (req, res) => {
  const { groupId } = req.params;

  const group = await ExpenseGroup.findById(groupId);
  if (!group) {
    throw new ApiError(404, "Group not found invalid group Id");
  }

  if (!group.participants.includes(req.user._id.toString())) {
    throw new ApiError(403, "You are not part of this group");
  }

  const settlements = await Settlement.find({
    groupId: new mongoose.Types.ObjectId(groupId),
  });

  if (settlements.length < 1) {
    return res
      .status(200)
      .json(new ApiResponse(200, {}, "No group settlement records found"));
  }

  const aggregatedSettlements = settlements.map(async (settlement) => {
    const pipelineData = await Settlement.aggregate([
      {
        $match: {
          _id: settlement._id,
        },
      },
      ...commonSettlementAggregations(),
    ]);
    return pipelineData[0];
  });

  const payload = await Promise.all(aggregatedSettlements);

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { payload },
        "Group settlement records fetched succesfully"
      )
    );
});
const userSettlementRecords = asyncHandler(async (req, res) => {
  const settlements = await Settlement.find({
    $or: [{ settleTo: req.user._id }, { settleFrom: req.user._id }],
  });

  if (settlements.length < 1) {
    return res
      .status(200)
      .json(new ApiResponse(200, {}, "No user settlement records found"));
  }

  const aggregatedSettlements = settlements.map(async (settlement) => {
    const pipelineData = await Settlement.aggregate([
      {
        $match: {
          _id: settlement._id,
        },
      },
      ...commonSettlementAggregations(),
    ]);
    return pipelineData[0];
  });

  const payload = await Promise.all(aggregatedSettlements);

  return res
    .status(200)
    .json(new ApiResponse(200, { payload }, "Settlement records"));
});

//Supporting function

//Adding the split in group when creating or ediiting expense

export const addSplit = async (groupId, Amount, Owner, members) => {
  const group = await ExpenseGroup.findById(groupId);

  // Adding the expense amount in group total
  group.groupTotal = Number(group.groupTotal) + Number(Amount);

  // Initialize split if it doesn't exist
  if (!group.split || !(group.split instanceof Map)) {
    group.split = new Map();
  }

  // Adding positive value to owner of the expense
  if (!group.split.has(Owner)) {
    group.split.set(Owner, 0);
  }
  group.split.set(Owner, group.split.get(Owner) + Amount);

  // Calculate expense per person
  let expensePerPerson = Amount / members.length;

  // Updating the split values payable per user
  members.forEach((user) => {
    if (!group.split.has(user)) {
      group.split.set(user, 0);
    }
    group.split.set(user, group.split.get(user) - expensePerPerson);
  });

  // Update group split for the owner
  let bal = 0;
  group.split.forEach((val) => {
    bal += val;
  });
  group.split.set(Owner, group.split.get(Owner) - bal);

  // Save the updated group
  await group.save();
};

//This works reverse of add split used for editting or deleting expense
export const clearSplit = async (groupId, Amount, Owner, participants) => {
  let group = await ExpenseGroup.findById(groupId);

  // Subtract the expense amount from group total
  group.groupTotal -= Amount;

  // Subtract the expense amount from owner's split
  group.split.set(Owner, (group.split.get(Owner) || 0) - Amount);

  // Calculate expense per person
  let expensePerPerson = Amount / participants.length;
  expensePerPerson = expensePerPerson.toFixed(2);

  // Update split values for each participant
  participants.forEach((user) => {
    group.split.set(
      user,
      (group.split.get(user) || 0) + parseFloat(expensePerPerson)
    );
  });

  // Recalculate balance
  let bal = 0;
  group.split.forEach((val) => {
    bal += val;
  });

  // Adjust owner's split to make the total balance zero
  group.split.set(Owner, (group.split.get(Owner) || 0) - bal);
  group.split.set(Owner, group.split.get(Owner).toFixed(2));

  // Save the updated group
  await group.save();
};

//Responsible for finding out group balances who owes whom and how much a aggregated balance of all the split in group
const groupBalanceCalculator = (split) => {
  const splits = [];
  const transactionMap = split;

  // Function to settle similar figures
  function settleSimilarFigures() {
    const vis = new Map();
    for (let [transaction1, value1] of transactionMap.entries()) {
      vis.set(transaction1, 1);
      for (let [transaction2, value2] of transactionMap.entries()) {
        if (!vis.has(transaction2) && transaction1 !== transaction2) {
          if (value2 === -value1) {
            if (value2 > value1) {
              splits.push([transaction1, transaction2, value2]);
            } else {
              splits.push([transaction2, transaction1, value1]);
            }
            transactionMap.set(transaction2, 0);
            transactionMap.set(transaction1, 0);
          }
        }
      }
    }
  }

  // Helper function to find maximum and minimum values in the split
  function getMaxMinCredit() {
    let maxKey, minKey;
    let max = Number.MIN_VALUE;
    let min = Number.MAX_VALUE;
    for (let [key, value] of transactionMap.entries()) {
      if (value < min) {
        min = value;
        minKey = key;
      }
      if (value > max) {
        max = value;
        maxKey = key;
      }
    }
    return [minKey, maxKey];
  }

  // Function to create settlement figures between uneven +ve and -ve values
  function helper() {
    const [minKey, maxKey] = getMaxMinCredit();
    if (!minKey || !maxKey) return;
    const minValue = Math.min(
      -transactionMap.get(minKey),
      transactionMap.get(maxKey)
    );
    transactionMap.set(minKey, transactionMap.get(minKey) + minValue);
    transactionMap.set(maxKey, transactionMap.get(maxKey) - minValue);
    const roundedMinValue = Math.round((minValue + Number.EPSILON) * 100) / 100;
    const res = [minKey, maxKey, roundedMinValue];
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
  groupSettlementRecords,
  userSettlementRecords,
};
