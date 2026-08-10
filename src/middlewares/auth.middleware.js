import { asyncHandler } from "../utils/asyncHandler.js"
import { ApiError } from "../utils/ApiError.js"
import jwt from "jsonwebtoken"
import {User} from "../models/user.model.js"


export const verifyJWT= asyncHandler(async(req, _, next)=>{
    try {



        const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "")

    
        if (!token) {
            throw new ApiError(401, "Unauthorized request")
        }
    
        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
    
        const user = await User.findById(decodedToken?._id).select("-password -refreshToken")
    
        if (!user) {
            throw new ApiError(401, "Invalid Access Token")
        }
    
        req.user = user;
        next()
    } catch (error) {
        throw new ApiError(401, error?.message || "Invalid access token")

    }
    
})



export const verifyHighCommand = asyncHandler(async(req, _, next) => {
    //TODO: allow only highCommand role past this point

    if (!req.user) {
        throw new ApiError(401, "Unauthorized request")
    }

    if (req.user.role !== "highCommand") {
        throw new ApiError(403, "You do not have permission to access this resource")
    }

    next()
})


// For public routes that behave differently when a user IS logged in
// (e.g. showing "Subscribed" instead of "Subscribe", or an accurate
// isLiked state) without requiring login to view the page at all.
// Unlike verifyJWT, this never throws - it just leaves req.user as
// null for guests or invalid/expired tokens, and lets the request
// continue either way.
export const verifyJWTOptional = asyncHandler(async(req, _, next) => {
    try {
        const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "")

        if (!token) {
            req.user = null;
            return next();
        }

        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
        const user = await User.findById(decodedToken?._id).select("-password -refreshToken")

        req.user = user || null;
        next();
    } catch (error) {
        // Invalid/expired token on a public route - treat as a guest
        // instead of failing the whole request.
        req.user = null;
        next();
    }
})