import mongoose, {isValidObjectId} from "mongoose"
import {Like} from "../models/like.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"

const toggleVideoLike = asyncHandler(async (req, res) => {
    const {videoId} = req.params
    //TODO: toggle like on video

    if (!isValidObjectId(videoId)) {
        throw new ApiError(400, "Invalid video ID")
    }

    const existingLike = await Like.findOne({
        video: videoId,
        likedBy: req.user._id
    })

    if (existingLike) {
        await Like.findByIdAndDelete(existingLike._id)

        return res
        .status(200)
        .json(new ApiResponse(
            200,
            {},
            "Video unliked successfully"
        ))
    }
    await Like.create({
        video: videoId,
        likedBy: req.user._id
    })

    return res
    .status(200)
    .json(new ApiResponse(
        200,
        {},
        "Video liked successfully"
    ))
})

const toggleCommentLike = asyncHandler(async (req, res) => {
    const {commentId} = req.params
    //TODO: toggle like on comment

    if (!isValidObjectId(commentId)) {
        throw new ApiError(400, "Invalid comment ID")
    }

    const existingLike = await Like.findOne({
        comment: commentId,
        likedBy: req.user._id,
    });

    if (existingLike) {
        await Like.findByIdAndDelete(existingLike._id);

        return res.status(200).json(
            new ApiResponse(
                200,
                {},
                "Comment unliked successfully"
            )
        );
    }

    await Like.create({
        comment: commentId,
        likedBy: req.user._id,
    });

    return res.status(200).json(
        new ApiResponse(
            200,
            {},
            "Comment liked successfully"
        )
    );

})

const toggleTweetLike = asyncHandler(async (req, res) => {
    const {tweetId} = req.params
    //TODO: toggle like on tweet

    if (!isValidObjectId(tweetId)) {
        throw new ApiError(400, "Invalid tweet id");
    }

    const existingLike = await Like.findOne({
        tweet: tweetId,
        likedBy: req.user._id,
    });

    if (existingLike) {
        await Like.findByIdAndDelete(existingLike._id);

        return res.status(200).json(
            new ApiResponse(
                200,
                {},
                "Tweet unliked successfully"
            )
        );
    }

    await Like.create({
        tweet: tweetId,
        likedBy: req.user._id,
    });

    return res.status(200).json(
        new ApiResponse(
            200,
            {},
            "Tweet liked successfully"
        )
    );
}
)

const getLikedVideos = asyncHandler(async (req, res) => {
    //TODO: get all liked videos

    const likedVideosAggregate = await Like.aggregate([
        {
            $match: {
                likedBy: new mongoose.Types.ObjectId(req.user._id),
                video: { $ne: null }
            }
        },
        {
            $lookup: {
                from: "videos",
                localField: "video",
                foreignField: "_id",
                as: "likedVideo",
                pipeline: [
                    {
                        $lookup: {
                            from: "users",
                            localField: "owner",
                            foreignField: "_id",
                            as: "ownerDetails"
                        }
                    },
                    {
                        $unwind: "$ownerDetails"
                    },
                    {
                        $project: {
                            videoFile: 1,
                            thumbnail: 1,
                            title: 1,
                            description: 1,
                            duration: 1,
                            views: 1,
                            isPublished: 1,
                            createdAt: 1,
                            owner: 1,
                            ownerDetails: {
                                _id: "$ownerDetails._id",
                                username: "$ownerDetails.username",
                                fullName: "$ownerDetails.fullName",
                                avatar: "$ownerDetails.avatar"
                            }
                        }
                    }
                ]
            }
        },
        {
            $unwind: "$likedVideo"
        },
        {
            $replaceRoot: {
                newRoot: "$likedVideo"
            }
        },
        {
            $sort: {
                createdAt: -1
            }
        }
    ]);

    return res
    .status(200)
    .json(new ApiResponse(
        200,
        likedVideosAggregate,
        "Liked videos fetched successfully"
    ))
})

export {
    toggleCommentLike,
    toggleTweetLike,
    toggleVideoLike,
    getLikedVideos
}