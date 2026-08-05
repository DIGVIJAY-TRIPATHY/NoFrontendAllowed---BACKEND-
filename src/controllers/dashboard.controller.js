import mongoose from "mongoose"
import {Video} from "../models/video.model.js"
import {Subscription} from "../models/subscription.model.js"
import {Like} from "../models/like.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"

const getChannelStats = asyncHandler(async (req, res) => {
    // TODO: Get the channel stats like total video views, total subscribers, total videos, total likes etc.

    const userId = req.user?._id;

    if (!userId) {
        throw new ApiError(401, "Unauthorized request");
    }

    //total videos
    const totalVideos = await Video.countDocuments({
        owner: userId
    })

    //total views
    const viewResult = await Video.aggregate([
        {
            $match: {
                owner: new mongoose.Types.ObjectId(userId)
            }
        },
        {
            $group: {
                _id: null,
                totalViews: {
                    $sum: "$views"
                }
            }
        }
    ])
    const totalViews = viewResult[0]?.totalViews || 0;

    //total subscribers
    const totalSubscribers = await Subscription.countDocuments({
        channel: userId
    })

    //total likes
    const likeResult = await Video.aggregate([
        {
            $match: {
                owner: new mongoose.Types.ObjectId(userId)
            }
        },
        {
            $lookup: {
                from: "likes",
                localField: "_id",
                foreignField: "video",
                as: "likeCount"
            }
        },
        {
            $project: {
                likesCount: {
                    $size: "$likeCount"
                }
            }
        },
        {
            $group: {
                _id: null,
                totalLikes: {
                    $sum: "$likesCount"
                }
            }
        }
    ]);
    const totalLikes = likeResult[0]?.totalLikes || 0;

    return res
    .status(200)
    .json(new ApiResponse(
        200,
        {
            totalVideos,
            totalViews,
            totalSubscribers,
            totalLikes
        },
        "Channel stats fetched successfully"
    ))
})


const getChannelVideos = asyncHandler(async (req, res) => {
    // TODO: Get all the videos uploaded by the channel

    const userId = req.user?._id;

    if(!userId){
        throw new ApiError(401, "Unauthorized request");
    }

    const videos = await Video.find({
        owner: userId
    })
    .sort({createdAt: -1})
    .select("-__v")

    return res
    .status(200)
    .json(
        new ApiResponse(
            200,
            videos,
            "channel videos fetched successfully"
        )
    )
})

export {
    getChannelStats, 
    getChannelVideos
    }