import mongoose, {Schema} from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";

const videoSchema = new Schema(
    {
        videoFile: {
            type: String, // URL to the video file on cloudinary
            required: true,
        },
        thumbnail: {
            type: String, 
            required: true,
        },
        title: {
            type: String, 
            required: true,
        },
        description: {
            type: String, 
            required: true,
        },
        duration: {
            type: Number, 
            required: true,
        },
        views: {
            type: Number,
            default: 0
        },
        isPublished: {
            type: Boolean,
            default: true
        },
        status: {
            type: String,
            enum: ["pending", "approved"], // pending videos need highCommand approval before going public
            default: "pending",
        },
        owner: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true
        }
    },
    {
        timestamps: true
    }
)


videoSchema.plugin(mongooseAggregatePaginate);

export const Video = mongoose.model("Video", videoSchema);