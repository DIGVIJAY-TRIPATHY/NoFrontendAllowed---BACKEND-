import mongoose, { isValidObjectId } from "mongoose"
import {Tweet} from "../models/tweet.model.js"
import {User} from "../models/user.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"

const createTweet = asyncHandler(async (req, res) => {
    //TODO: create tweet
    const {content} = req.body;

    if(!content){
        throw new ApiError(400,"Content is required")
    }

    const tweet = await Tweet.create({
        content: content.trim(),
        owner: req.user?._id
    })

    if (!tweet) {
        throw new ApiError(500, "failed to create tweet please try again");
    }

    return res
    .status(201)
    .json(
        new ApiResponse(
            201,
            tweet,
            "tweet created successfully"
        )
    )
})

const getUserTweets = asyncHandler(async (req, res) => {
    // TODO: get user tweets

    const { userId } = req.params;

    if(!isValidObjectId(userId)){
        throw new ApiError(400, "Invalid userId")
    }

    const tweets = await Tweet.find({
        owner: userId
    })
    .populate("owner", "username fullname avatar")
    .sort({createdAt: -1});

    if(!tweets){
        throw new ApiError(500, "Failed to fetch tweets");
    }

    return res
    .status(200)
    .json(
        new ApiResponse(
            200,
            tweets,
            "Tweets fetched successfully"
        )
    )
})

const updateTweet = asyncHandler(async (req, res) => {
    //TODO: update tweet

    const { tweetId } = req.params;
    const { content } = req.body;

    if (!isValidObjectId(tweetId)) {
        throw new ApiError(400, "Invalid tweet id");
    }

    if (!content) {
        throw new ApiError(400, "Content is required");
    }

    const tweet = await Tweet.findById(tweetId);

    if(!tweet){
        throw new ApiError(404, "Tweet does not exists");
    }

    if(tweet?.owner.toString() !== req.user?._id.toString()){
        throw new ApiError(403, "Only owner can update the tweet");
    }

    tweet.content = content.trim();

    await tweet.save()

    return res
    .status(200)
    .json(
        new ApiResponse(
            200,
            tweet,
            "Tweet updated successfully"
        )
    )
})

const deleteTweet = asyncHandler(async (req, res) => {
    //TODO: delete tweet

    const { tweetId } = req.params;

    if (!isValidObjectId(tweetId)) {
        throw new ApiError(400, "Invalid tweet id");
    }

    const tweet = await Tweet.findById(tweetId);
    
    if(!tweet){
        throw new ApiError(400, "Tweet does not exists");
    }

    if (tweet.owner.toString() !== req.user._id.toString()) {
        throw new ApiError(403, "You are not authorized to delete this tweet");
    }

    await Tweet.findByIdAndDelete(tweetId)

    return res
    .status(200)
    .json(
        new ApiResponse(
            200,
            {},
            "Tweet deleted successfully"
        )
    )
})

export {
    createTweet,
    getUserTweets,
    updateTweet,
    deleteTweet
}