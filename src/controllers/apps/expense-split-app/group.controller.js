import { asyncHandler } from "../../../utils/asyncHandler";

const createExpenseGroup = asyncHandler(async (req, res) => {});
const viewExpenseGroup = asyncHandler(async (req, res) => {});
const getUserExpenseGroups = asyncHandler(async (req, res) => {});
const groupBalaceSheet = asyncHandler(async (req, res) => {});
const makeSettlement = asyncHandler(async (req, res) => {});
const deleteExpenseGroup = asyncHandler(async (req, res) => {});
const changeExpenseGroupName = asyncHandler(async (req, res) => {});
const addMembersInExpenseGroup = asyncHandler(async (req, res) => {});
const removeMembersFromExpenseGroups = asyncHandler(async (req, res) => {});
const leaveExpenseGroup = asyncHandler(async (req, res) => {});

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
