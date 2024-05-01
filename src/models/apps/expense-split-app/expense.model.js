import mongoose, { Schema } from "mongoose";
import {
  AvailableExpenseTypes,
  AvailablePaymentMethods,
  ExpenseTypes,
  PaymentMethods,
} from "../../../constants.js";

const expenseSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    groupId: {
      type: Schema.Types.ObjectId,
      ref: "ExpenseGroup",
    },
    Amount: {
      type: Number,
      required: true,
    },
    Category: {
      type: String,
      enum: AvailableExpenseTypes,
      default: ExpenseTypes.OTHERS,
    },
    expenseDate: {
      type: Date,
      default: Date.now,
    },
    Owner: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    participants: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    expensePerMember: {
      type: Number,
      required: true,
    },
    expenseMethod: {
      type: String,
      enum: AvailablePaymentMethods,
      default: PaymentMethods.CASH,
    },
    billAttachments: {
      type: [
        {
          url: String,
          localPath: String,
        },
      ],
      default: [],
    },
  },
  { timestamps: true }
);

export const Expense = mongoose.model("Expense", expenseSchema);
