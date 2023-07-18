import mongoose, { Schema } from "mongoose";

const usersSchema = new Schema({
    username:{
        type: String,
        required: true,
        unique: true
    }
},{
    timestamps:true
});

export const User = mongoose.model("Users",usersSchema);