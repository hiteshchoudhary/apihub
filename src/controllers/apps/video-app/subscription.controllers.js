import mongoose from "mongoose";
import { Subscription } from "../../../models/apps/video-app/subcription.models.js";
import { ApiError } from "../../../utils/ApiError.js";
import { ApiResponse } from "../../../utils/ApiResponse.js";
import { asyncHandler } from "../../../utils/asyncHandler.js";

const toggleSubscription = asyncHandler(async (req, res) => {
  const { channelId } = req.params;

  // See if user has already subscribed to the channel
  const isSubscribed = await Subscription.findOne({
    subscriber: req.user._id,
    channel: channelId,
  });

  if (isSubscribed) {
    await Subscription.findOneAndDelete({
      subscriber: req.user._id,
      channel: channelId,
    });
    return res.status(200).json(
      new ApiResponse(
        200,
        {
          subscribed: false,
        },
        "channel unsubscribed successfully"
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
          subscribed: true,
        },
        "channel subscribed successfully"
      )
    );
  }
});

const getUserChannelSubscribers = asyncHandler(async (req, res) => {
  const { subscriberId } = req.params;

  const channelSubscriberListAggregate = await Subscription.aggregate([
    {
      $match: {
        channel: new mongoose.Types.ObjectId(subscriberId),
      },
    },
    {
      $lookup: {
        from: "videoappprofiles",
        localField: "subscriber",
        foreignField: "owner",
        as: "subscribeUser",
        pipeline: [
          {
            $project: {
              fullname: 1,
              username: 1,
              avatar: 1,
              coverImage: 1,
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
  const channelSubscriberList = channelSubscriberListAggregate[0];

  if (!channelSubscriberList) {
    throw new ApiError(404, "channel has no subscribers");
  }

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        channelSubscriberList,
        "channel subscribers list fetched successfully"
      )
    );
});

const getSubscribedChannels = asyncHandler(async (req, res) => {
  const { channelId } = req.params;

  const userSubscribedChannelsAggregate = await Subscription.aggregate([
    {
      $match: {
        subscriber: new mongoose.Types.ObjectId(channelId),
      },
    },
    {
      $lookup: {
        from: "videoappprofiles",
        localField: "channel",
        foreignField: "owner",
        as: "subscribedChannels",
        pipeline: [
          {
            $project: {
              fullname: 1,
              username: 1,
              avatar: 1,
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

  const userSubscribedChannels = userSubscribedChannelsAggregate[0];

  if (!userSubscribedChannels) {
    throw new ApiError(404, "user has no subscribed channels");
  }

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        userSubscribedChannels,
        "user subscribed channels fetched successfully"
      )
    );
});

export { toggleSubscription, getUserChannelSubscribers, getSubscribedChannels };
