import mongoose, { Schema } from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";

const memberSchema = new Schema(
  {
    memberEmailId: {
      type: String,
      require: true,
    },

    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: false,
    },

    projectId: {
      type: Schema.Types.ObjectId,
      ref: "Project",
      required: true,
    },

    invitationStatus: {
      type: String,
      enum: ["pending", "accepted", "rejected", "banned"],
      required: true,
    },

    role: {
      type: String,
      enum: ["admin", "member", "owner"],
      required: true,
    },
  },

  { timestamps: true }
);

memberSchema.plugin(mongooseAggregatePaginate);

export const Member = mongoose.model("Member", memberSchema);
