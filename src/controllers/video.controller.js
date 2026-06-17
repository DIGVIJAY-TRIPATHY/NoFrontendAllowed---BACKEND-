import mongoose, {isValidObjectId} from "mongoose"
import {Video} from "../models/video.model.js"
import {User} from "../models/user.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"
import {uploadOnCloudinary} from "../utils/cloudinary.js"


const getAllVideos = asyncHandler(async (req, res) => {
    const {
        page = 1,
        limit = 10,
        query,
        sortBy,
        sortType,
        userId
    } = req.query;

    const pipeline = [];

    if (query?.trim()) {
        pipeline.push({
            $search: {
                index: "search-videos",
                text: {
                    query,
                    path: ["title", "description"]
                }
            }
        });
    }

    if (userId) {
        if (!isValidObjectId(userId)) {
            throw new ApiError(400, "Invalid userId");
        }

        pipeline.push({
            $match: {
                owner: new mongoose.Types.ObjectId(userId)
            }
        });
    }

    pipeline.push({
        $match: {
            isPublished: true
        }
    });

    const allowedSortFields = [
        "views",
        "createdAt",
        "duration",
        "title"
    ];

    const sortField = allowedSortFields.includes(sortBy)
        ? sortBy
        : "createdAt";

    pipeline.push({
        $sort: {
            [sortField]:
                sortType === "asc" ? 1 : -1
        }
    });

    pipeline.push(
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
        }
    );

    const aggregate = Video.aggregate(pipeline);

    const videos =
        await Video.aggregatePaginate(
            aggregate,
            {
                page: Number(page),
                limit: Number(limit)
            }
        );

    return res.status(200).json(
        new ApiResponse(
            200,
            videos,
            "Videos fetched successfully"
        )
    );
});

const publishAVideo = asyncHandler(async (req, res) => {
    // TODO: get video, upload to cloudinary, create video

    const { title, description} = req.body

    if(!title?.trim() || !description?.trim()) {
        throw new ApiError(400, "Title and description are required")
    }
    
    const videoFileLocalPath = req.files?.videoFile[0]?.path;

    const thumbnailLocalPath = req.files?.thumbnail[0]?.path;

    if(!videoFileLocalPath){
        throw new ApiError(400, "Video file is required")
    }

    if(!thumbnailLocalPath){
        throw new ApiError(400, "Thumbnail is required")
    }

    const uploadedVideo = await uploadOnCloudinary(videoFileLocalPath)
    const uploadedThumbnail = await uploadOnCloudinary(thumbnailLocalPath)

    if(!uploadedVideo || !uploadedThumbnail){
        throw new ApiError(500, "Error while uploading video or thumbnail")
    }

    const video = await Video.create({
        title,
        description,
        videoFile: uploadedVideo.url,
        thumbnail: uploadedThumbnail.url,
        duration: uploadedVideo.duration,
        owner: req.user._id
    })

    return res
    .status(201)
    .json(
        new ApiResponse(
            201,
            video,
            "Video published successfully"
        )
    )
})

const getVideoById = asyncHandler(async (req, res) => {
    //TODO: get video by id

    const { videoId } = req.params

    if (!isValidObjectId(videoId)) {
        throw new ApiError(400,"Invalid video id");
    }

    const video = await Video.aggregate([
        {
            $match: {
                _id: new mongoose.Types.ObjectId(videoId)
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
                            avatar: 1
                        }
                    }
                ]
            }
        },
        {
            $lookup: {
                from: "likes",
                localField: "_id",
                foreignField: "video",
                as: "likes"
            }
        },
        {
            $addFields: {
                owner: {
                    $first: "$owner"
                },
                likesCount: {
                    $size: "$likes"
                }
            }
        }
    ])

    if(!video.length){
        throw new ApiError(404, "Video not found")
    }

    await Video.findByIdAndUpdate(
        videoId,
        {
            $inc: {
                views: 1
            }
        }
    )

    await User.findByIdAndUpdate(
        req.user._id,
        {
            $addToSet: {
                watchHistory: videoId
            }
        }
    )

    return res
    .status(200)
    .json(
        new ApiResponse(
            200,
            video[0],
            "Video fetched successfully"
        )
    )
})

const updateVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    //TODO: update video details like title, description, thumbnail

})

const deleteVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    //TODO: delete video
})

const togglePublishStatus = asyncHandler(async (req, res) => {
    const { videoId } = req.params
})

export {
    getAllVideos,
    publishAVideo,
    getVideoById,
    updateVideo,
    deleteVideo,
    togglePublishStatus
}