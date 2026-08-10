import { isValidObjectId } from "mongoose"
import { Video } from "../models/video.model.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { asyncHandler } from "../utils/asyncHandler.js"
import { purgeVideoTraces } from "../utils/videoCleanup.js"

const getPendingVideos = asyncHandler(async (req, res) => {
    //TODO: get all videos that are waiting for highCommand review

    const pendingVideos = await Video.aggregate([
        {
            $match: {
                status: "pending"
            }
        },
        {
            $lookup: {
                from: "users",
                localField: "owner",
                foreignField: "_id",
                as: "owner",
                pipeline: [
                    {
                        $project: {
                            username: 1,
                            fullName: 1,
                            email: 1,
                            avatar: 1
                        }
                    }
                ]
            }
        },
        {
            $addFields: {
                owner: {
                    $first: "$owner"
                }
            }
        },
        {
            $sort: {
                createdAt: 1
            }
        }
    ])

    return res
    .status(200)
    .json(
        new ApiResponse(
            200,
            pendingVideos,
            "Pending videos fetched successfully"
        )
    )
})

const approveVideo = asyncHandler(async (req, res) => {
    //TODO: approve a pending video and make it public

    const { videoId } = req.params

    if (!isValidObjectId(videoId)) {
        throw new ApiError(400, "Invalid video id")
    }

    const video = await Video.findByIdAndUpdate(
        videoId,
        {
            $set: {
                status: "approved",
                isPublished: true
            }
        },
        { new: true }
    )

    if (!video) {
        throw new ApiError(404, "Video not found")
    }

    return res
    .status(200)
    .json(
        new ApiResponse(
            200,
            video,
            "Video approved and published"
        )
    )
})

const rejectVideo = asyncHandler(async (req, res) => {
    //TODO: reject a pending video, delete it and all its traces

    const { videoId } = req.params

    if (!isValidObjectId(videoId)) {
        throw new ApiError(400, "Invalid video id")
    }

    const video = await Video.findByIdAndDelete(videoId)

    if (!video) {
        throw new ApiError(404, "Video not found")
    }

    await purgeVideoTraces(video)

    return res
    .status(200)
    .json(
        new ApiResponse(
            200,
            {},
            "Video rejected and removed"
        )
    )
})

export {
    getPendingVideos,
    approveVideo,
    rejectVideo
}