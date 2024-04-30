import mongoose, { Schema } from "mongoose";

const settlementSchema = mongoose.Schema(
  {
    groupId: {
      type: Schema.Types.ObjectId,
      ref: "ExpenseGroup",
      required: true,
    },
    settleTo: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    settleFrom: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    SettlementDate: {
      type: String,
      required: true,
    },
    Amount: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

export const Settlement = mongoose.model("Settlement", settlementSchema);