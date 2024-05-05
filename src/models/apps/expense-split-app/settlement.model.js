import mongoose, { Schema } from "mongoose";

const settlementSchema = new Schema(
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
    settlementDate: {
      type: Date,
      required: true,
      default: Date.now,
    },
    amount: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

export const Settlement = mongoose.model("Settlement", settlementSchema);
