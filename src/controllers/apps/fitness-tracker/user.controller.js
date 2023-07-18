import express from 'express';
import { User } from '../../../models/apps/fitness-tracker/user.model.js';
import { asyncHandler } from '../../../utils/asyncHandler.js';
import { ApiError } from "../../../utils/ApiError.js";
import { ApiResponse } from "../../../utils/ApiResponse.js";


const getAllUsers = asyncHandler(async (req, res) => {
    User.find()
        .then(users => res.json(new ApiResponse(200, users, 'Fetched all users')))
        .catch(err => res.json(new ApiError(400, err, 'Could not fetch all users')))
})

const addUsers = asyncHandler(async (req, res) => {
    const username = req.body.username;
    const newUser = new User({username});
    newUser.save()
        .then(() => res.json(new ApiResponse(200, newUser, 'User got added!')))
        .catch(err => res.json(new ApiError(400, err, 'Could not add user')))
})



export {
    getAllUsers,
    addUsers
}