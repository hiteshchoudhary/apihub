import { model } from "mongoose";
import { asyncHandler } from "../../../utils/asyncHandler.js";
import { ExpenseGroup } from "../../../models/apps/expense-split-app/expenseGroup.model.js";
import { Expense } from "../../../models/apps/expense-split-app/expense.model.js";

const createExpenseGroup = asyncHandler(async (req, res) => {
  const { name, description, groupOwner, participants, groupCategory } =
    req.body;

  const members = [...new Set([...participants])]; //Prevents duplications

  for (user of members) {
    splitJson[user] = 0;
  }

  let split = splitJson;

  var group = await ExpenseGroup.create({
    name,
    description,
    groupOwner,
    participants: members,
    groupCategory: groupCategory,
    split: split,
  });
});
const viewExpenseGroup = asyncHandler(async (req, res) => {});
const getUserExpenseGroups = asyncHandler(async (req, res) => {});
const groupBalaceSheet = asyncHandler(async (req, res) => {
  const { groupId } = req.params;

  //Validations

  //Invalid
});
const makeSettlement = asyncHandler(async (req, res) => {});
const deleteExpenseGroup = asyncHandler(async (req, res) => {});
const changeExpenseGroupName = asyncHandler(async (req, res) => {});
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

export {
  createExpenseGroup,
  viewExpenseGroup,
  getUserExpenseGroups,
  groupBalaceSheet,
  makeSettlement,
  deleteExpenseGroup,
  changeExpenseGroupName,
  addMembersInExpenseGroup,
  removeMembersFromExpenseGroups,
  leaveExpenseGroup,
};
