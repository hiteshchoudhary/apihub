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
      enum: AvailableExpenseGroupTypes.OTHERS,
      default: ExpenseGroupTypes.OTHERS,
      required: true,
    },
    groupTotal: { type: Number, default: 0 },
    split: {
      type: Map,
      of: Number,
      default: {},
    },
  },
  { timestamps: true }
);

// Middleware to convert split keys to ObjectId
expenseGroupSchema.pre("save", function (next) {
  const split = this.split;
  const updatedSplit = new Map();

  for (const key of split.keys()) {
    updatedSplit.set(new mongoose.Types.ObjectId(key), split.get(key));
  }

  this.split = updatedSplit;
  next();
});
export const ExpenseGroup = mongoose.model("ExpenseGroup", expenseGroupSchema);
