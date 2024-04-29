import { asyncHandler } from "../../../utils/asyncHandler.js";
import { ExpenseGroup } from "../../../models/apps/expense-split-app/expensegroup.model.js";
import { Expense } from "../../../models/apps/expense-split-app/expense.model.js";
import { ApiResponse } from "../../../utils/ApiResponse.js";
import { ExpenseGroupTypes } from "../../../constants.js";
import { ApiError } from "../../../utils/ApiError.js";
import { Settlement } from "../../../models/apps/expense-split-app/settlement.model.js";
import { User } from "../../../models/apps/auth/user.models.js";
import { removeLocalFile } from "../../../utils/helpers.js";

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
    groupId: new mongoose.Types.ObjectId(chatId),
  });

  await Settlement.deleteMany({
    groupId: new mongoose.Types.ObjectId(chatId),
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

  //Name and Participants is already checke din validator no need to check here
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

  const balanceData = groupBalanceCalculator(expenseGroup.split);
  //! has to aggregate the group balaces for user ids
  return res
    .status(200)
    .json(
      new ApiResponse(200, { balanceData }, "Group balance fetched succesfully")
    );

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

  group.split[settleFrom] += settleAmount;
  group.split[settleTo] -= settleAmount;

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
const deleteExpenseGroup = asyncHandler(async (req, res) => {
  const { groupId } = req.params;
  const expenseGroup = await ExpenseGroup.findById(groupId);
  if (!expenseGroup) {
    throw new ApiError(404, "Group not found, Invalid group id");
  }

  await ExpenseGroup.findByIdAndDelete(groupId);
  await deleteCascadeExpenses(groupId);

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

const groupSettlementRecords = asyncHandler(async (req, res) => {});
const userSettlementRecords = asyncHandler(async (req, res) => {});

//Supporting function

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

//This works reverse of add split used for editting or clearing expense
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

//Responsible for finding out group balances
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
