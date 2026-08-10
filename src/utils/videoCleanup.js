import { Like } from "../models/like.model.js";
import { Comment } from "../models/comment.model.js";
import { Playlist } from "../models/playlist.model.js";
import { User } from "../models/user.model.js";
import { deleteFromCloudinary } from "./cloudinary.js";

// removes every trace of a video: likes, comments, playlist entries,
// watch history entries, and its cloudinary files.
// does NOT delete the Video document itself, caller handles that.
const purgeVideoTraces = async (video) => {
    const videoId = video._id;

    await Like.deleteMany({ video: videoId });
    await Comment.deleteMany({ video: videoId });

    await Playlist.updateMany(
        { videos: videoId },
        { $pull: { videos: videoId } }
    );

    await User.updateMany(
        { watchHistory: videoId },
        { $pull: { watchHistory: videoId } }
    );

    await deleteFromCloudinary(video.videoFile, "video");
    await deleteFromCloudinary(video.thumbnail, "image");
}

export { purgeVideoTraces };