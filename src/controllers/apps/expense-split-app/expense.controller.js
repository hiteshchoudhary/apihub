import { asyncHandler } from "../../../utils/asyncHandler";

const addExpense = asyncHandler(async (req, res) => {});
const editExpense = asyncHandler(async (req, res) => {});
const deleteExpense = asyncHandler(async (req, res) => {});
const viewExpense = asyncHandler(async (req, res) => {});
const viewGroupExpense = asyncHandler(async (req, res) => {});
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
