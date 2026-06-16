import mongoose, {isValidObjectId} from "mongoose"
import {Playlist} from "../models/playlist.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"


const createPlaylist = asyncHandler(async (req, res) => {
    //TODO: create playlist

    const {name, description} = req.body

    if (!name || !description) {
        throw new ApiError(400, "Name and description fields are required")
    }

    const playlist = await Playlist.create({
        name,
        description,
        owner: req.user?._id
    })

    return res
    .status(201)
    .json(
        new ApiResponse(
            201,
            playlist,
            "Playlist created successfully"
        )
    )
})

const getUserPlaylists = asyncHandler(async (req, res) => {
    //TODO: get user playlists

    const {userId} = req.params

    if (!isValidObjectId(userId)) {
        throw new ApiError(400, "Invalid userId")
    }

    const playlists = await Playlist.aggregate([
        {
            $match: {
                owner: new mongoose.Types.ObjectId(userId)
            }
        },
        {
            $lookup: {
                from: "videos",
                localField: "videos",
                foreignField: "_id",
                as: "videos"
            }
        },
        {
            $addFields: {
                totalVideos: {
                    $size: "$videos"
                },
                totalViews: {
                    $sum: "$videos.views"
                }
            }
        },
        {
            $project: {
                _id: 1,
                name: 1,
                description: 1,
                totalVideos: 1,
                totalViews: 1,
                updatedAt: 1
            }
        }
    ])

    return res
    .status(200)
    .json(
        new ApiResponse(
            200,
            playlists,
            "User playlists fetched successfully"
        )
    )
})

const getPlaylistById = asyncHandler(async (req, res) => {
    //TODO: get playlist by id

    const {playlistId} = req.params

    if(!isValidObjectId(playlistId)) {
        throw new ApiError(400, "Invalid playlistId")
    }

    const playlist = await Playlist.aggregate([
    {
        $match: {
            _id: new mongoose.Types.ObjectId(playlistId)
        }
    },
    {
        $lookup: {
            from: "videos",
            localField: "videos",
            foreignField: "_id",
            as: "videos",
            pipeline: [
                {
                    $match: {
                        isPublished: true
                    }
                }
            ]
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
                        "avatar.url": 1
                    }
                }
            ]
        }
    },
    {
        $addFields: {
            owner: {
                $first: "$owner"
            },
            totalVideos: {
                $size: "$videos"
            },
            totalViews: {
                $sum: "$videos.views"
            }
        }
    },
    {
        $project: {
            name: 1,
            description: 1,
            createdAt: 1,
            updatedAt: 1,
            totalVideos: 1,
            totalViews: 1,
            owner: 1,
            videos: {
                $map: {
                    input: "$videos",
                    as: "video",
                    in: {
                        _id: "$$video._id",
                        title: "$$video.title",
                        description: "$$video.description",
                        duration: "$$video.duration",
                        views: "$$video.views",
                        createdAt: "$$video.createdAt",
                        videoFile: {
                            url: "$$video.videoFile.url"
                        },
                        thumbnail: {
                            url: "$$video.thumbnail.url"
                        }
                    }
                }
            }
        }
    }
    ])

    if(!playlist.length) {
        throw new ApiError(400, "Playlist does not exists")
    }

    return res
    .status(200)
    .json(
        new ApiResponse(
            200,
            playlist[0],
            "Playlist fetched successfully"
        )
    )
})

const addVideoToPlaylist = asyncHandler(async (req, res) => {
    const {playlistId, videoId} = req.params

    if (!isValidObjectId(playlistId) || !isValidObjectId(videoId)) {
        throw new ApiError(400, "Invalid playlistId or videoId")
    }

    const playlist = await Playlist.findById(playlistId)

    if (!playlist) {
        throw new ApiError(404, "playlist not found")
    }

    if (playlist.owner.toString() !== req.user?._id.toString()) {
        throw new ApiError(400, "Only owner can update the playlist")
    }

    const video = await playlist.findById(videoId)

    if(!video) {
        throw new ApiError(404, "video not found")
    }

    const updatedPlaylist = await Playlist.findByIdAndUpdate(
        playlistId,
        {
            $addToSet: {
                videos: videoId
            }
        },
        {
            new: true
        }
    )

    return res
    .status(200)
    .json(
        new ApiResponse(
            200,
            updatedPlaylist,
            "Video added to playlist successfully"
        )
    )
})

const removeVideoFromPlaylist = asyncHandler(async (req, res) => {
    const {playlistId, videoId} = req.params
    // TODO: remove video from playlist

})

const deletePlaylist = asyncHandler(async (req, res) => {
    const {playlistId} = req.params
    // TODO: delete playlist
})

const updatePlaylist = asyncHandler(async (req, res) => {
    const {playlistId} = req.params
    const {name, description} = req.body
    //TODO: update playlist
})

export {
    createPlaylist,
    getUserPlaylists,
    getPlaylistById,
    addVideoToPlaylist,
    removeVideoFromPlaylist,
    deletePlaylist,
    updatePlaylist
}