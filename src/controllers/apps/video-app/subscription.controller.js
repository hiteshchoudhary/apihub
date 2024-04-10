import mongoose, { isValidObjectId } from "mongoose";
import { Subscription } from "../../../models/apps/video-app/subcription.model.js";
import { ApiError } from "../../../utils/ApiError.js";
import { ApiResponse } from "../../../utils/ApiResponse.js";
import { asyncHandler } from "../../../utils/asyncHandler.js";

/**
 * Toggles the subscription status for a channel.
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {Promise<void>} - A promise that resolves with the subscription status.
 */
const toggleSubscription = asyncHandler(async (req, res) => {
  try {
    const { channelId } = req.params;

    if (!isValidObjectId(channelId)) {
      throw new ApiError(400, "Invalid Id");
    }

    // See if user has already subscription
    const isAlreadySubscription = await Subscription.findOne({
      subscriber: req.user._id,
      channel: channelId,
    });

    if (isAlreadySubscription) {
      await Subscription.findOneAndDelete({
        subscriber: req.user._id,
        channel: channelId,
      });
      return res.status(200).json(
        new ApiResponse(
          200,
          {
            Subscribed: false,
          },
          "UnSubscribed successfully"
        )
      );
    } else {
      await Subscription.create({
        subscriber: req.user._id,
        channel: channelId,
      });
      return res.status(200).json(
        new ApiResponse(
          200,
          {
            Subscribed: true,
          },
          "subscribed successfully"
        )
      );
    }
  } catch (error) {
    throw new ApiError(500, error.message);
  }
});

/**
 * Retrieves the list of subscribers for a given channel.
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {Promise<void>} - A promise that resolves with the response.
 */
const getUserChannelSubscribers = asyncHandler(async (req, res) => {
  try {
    const { subscriberId } = req.params;

    if (!isValidObjectId(subscriberId)) {
      throw new ApiError(400, "Invalid Id");
    }

    const channelSubscriberList = await Subscription.aggregate([
      {
        $match: {
          channel: new mongoose.Types.ObjectId(subscriberId),
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "subscriber",
          foreignField: "_id",
          as: "subscribeUser",
          pipeline: [
            {
              $project: {
                username: 1,
                email: 1,
                avatar: 1,
                fullname: 1,
              },
            },
          ],
        },
      },
      {
        $unwind: {
          path: "$subscribeUser",
        },
      },
      {
        $group: {
          _id: null,
          subscribeUsers: { $push: "$subscribeUser" },
        },
      },
      {
        $project: {
          _id: 0,
          subscribeUsers: 1,
        },
      },
    ]);
    if (channelSubscriberList.length === 0) {
      throw new ApiError(404, "No subscribers found");
    }

    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          channelSubscriberList,
          "channel all subscriber list fetched successfully"
        )
      );
  } catch (error) {
    throw new ApiError(500, error.message);
  }
});

/**
 * Retrieves the list of subscribed channels for a given channel ID.
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {Promise<void>} - A promise that resolves with the response.
 */
const getSubscribedChannels = asyncHandler(async (req, res) => {
  try {
    const { channelId } = req.params;

    if (!isValidObjectId(channelId)) {
      throw new ApiError(400, "Invalid Id");
    }

    const userSubscribedChannels = await Subscription.aggregate([
      {
        $match: {
          subscriber: new mongoose.Types.ObjectId(channelId),
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "channel",
          foreignField: "_id",
          as: "subscribedChannels",
          pipeline: [
            {
              $project: {
                fullName: 1,
                profileImage: 1,
                coverImage: 1,
              },
            },
          ],
        },
      },
      {
        $unwind: {
          path: "$subscribedChannels",
        },
      },
      {
        $group: {
          _id: null,
          subscribedChannels: { $push: "$subscribedChannels" },
        },
      },
      {
        $project: {
          _id: 0,
          subscribedChannels: 1,
        },
      },
    ]);

    if (userSubscribedChannels.length === 0) {
      throw new ApiError(404, "No found subscribed channel");
    }

    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          userSubscribedChannels,
          "user subscribed channels list fetched successfully"
        )
      );
  } catch (error) {
    throw new ApiError(500, error.message);
  }
});

export { toggleSubscription, getUserChannelSubscribers, getSubscribedChannels };
