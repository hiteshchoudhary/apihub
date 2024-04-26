import mongoose, { Schema } from "mongoose";
import {
  AvailableExpenseGroupTypes,
  ExpenseGroupTypes,
} from "../../../constants.js";

const expenseGroupSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    groupOwner: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },

    participants: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],

    groupCategory: {
      type: String,
      enum: ExpenseGroupTypes,
      default: AvailableExpenseGroupTypes.OTHERS,
    },
    groupTotal: { type: Number, default: 0 },
    split: { type: Array },
  },
  { timestamps: true }
);

export const ExpenseGroup = mongoose.model("ExpenseGroup", expenseGroupSchema);
