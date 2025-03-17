import { asyncHandler } from "../utils/AsyncHandels.js"
import { ApiError } from "../utils/ApiError.js"
import jwt from "jsonwebtoken"
import {Captain} from "../models/captain.model.js"


export const verifyJWTCaptain = asyncHandler(async(req,res,next)=>{
    try {
        const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer","")

        if(!token){
            throw new ApiError(401,"unothorised request")
        }

        const decodedToken = jwt.verify(token,process.env.ACCESS_TOKEN_SECRET)

        const captain = await Captain.findById(decodedToken?._id).select("-password -refreshToken")

        if(!captain){
            throw new ApiError("401","invalid access token")
        }

        req.captain = captain;
        next();

    } catch (error) {
        throw new ApiError(401,error?.message || "invalid access token")
    }
})