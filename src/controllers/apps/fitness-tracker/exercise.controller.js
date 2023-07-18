import { Exercise } from '../../../models/apps/fitness-tracker/exercise.model.js'
import { asyncHandler } from '../../../utils/asyncHandler.js';
import { ApiError } from "../../../utils/ApiError.js";
import { ApiResponse } from "../../../utils/ApiResponse.js";


const getAllExercises = asyncHandler(async (req, res) => {
    Exercise.find()
        .then(exercises => res.json(new ApiResponse(200, exercises, "All exercises fetched successfully")))
        .catch(err => res.json(new ApiError (400, err, "Unable to fetch all the exercises")))
})

const addExercise = asyncHandler(async (req, res) => {
    const username = req.body.username;
    const description = req.body.description;
    const duration = Number(req.body.duration);
    const date = Date.parse(req.body.date);

    const newExercise = new Exercise({
        username, description, duration, date
    });
   newExercise.save()
        .then(() => res.json(new ApiResponse(200, newExercise, "Exercise added!")))
        .catch(err => res.json(new ApiError(400, err, "Failed to add Exercise")))
})




const getExerciseById = asyncHandler(async (req, res) => {
    Exercise.findById(req.params.id)
    .then(exercises => res.json(new ApiResponse(200, exercises, "Fetched Exercise by Id")))
    .catch(err => res.json(new ApiError(400, err, "Unable to find Exercise")))
})



const deleteExercise = asyncHandler(async (req, res) => {
    Exercise.findByIdAndDelete(req.params.id)
        .then(() => res.json(new ApiResponse(200,"Exercise deleted!")))
        .catch(err => res.json(new ApiError(400, err)))
})



const updateExercise = asyncHandler(async (req, res) => {
    Exercise.findById(req.params.id)
        .then(exercise => {
            exercise.username = req.body.username;
            exercise.description = req.body.description;
            exercise.duration = Number(req.body.duration);
            exercise.date = Date.parse(req.body.date)
         exercise.save()
        .then(() => res.json(new ApiResponse(200, exercise, "Exercise updated!")))
        .catch(err => res.json(new ApiError(400, err)))
    });
})





export {
    getAllExercises,
    addExercise,
    getExerciseById,
    deleteExercise,
    updateExercise,
};