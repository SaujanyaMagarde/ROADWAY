import { asyncHandler } from "../utils/AsyncHandels.js";
import { ApiError } from "../utils/ApiError.js";
import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";

// Helper: generate new access & refresh tokens
const generateUserTokens = async (userID) => {
    const user = await User.findById(userID);
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };
};

export const verifyJWTUser = asyncHandler(async (req, res, next) => {
    try {
        let token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "").trim();
        let decodedToken;

        try {
            decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        } catch (err) {
            // Handle expired or invalid token
            const refresh = req.cookies?.refreshToken;
            if (!refresh) throw new ApiError(401, "Session expired, please log in again");

            let decodedRefresh;
            try {
                decodedRefresh = jwt.verify(refresh, process.env.REFRESH_TOKEN_SECRET);
            } catch (refreshErr) {
                throw new ApiError(401, "Invalid refresh token");
            }

            // Generate new tokens
            const { accessToken, refreshToken } = await generateUserTokens(decodedRefresh._id);

            const cookieOptions = {
                httpOnly: true,
                secure: false, // Not in production
                sameSite: "Lax", // Or "Strict" for more security
                maxAge: 1000 * 60 * 60 * 4, // 4 hours
            };

            // Set new cookies in the response
            res.cookie("accessToken", accessToken, cookieOptions);
            res.cookie("refreshToken", refreshToken, {
                ...cookieOptions,
                maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
            });

            // Re-verify the new access token
            token = accessToken;
            decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        }

        const user = await User.findById(decodedToken._id).select("-password -refreshToken");
        if (!user) {
            throw new ApiError(401, "Invalid access token: user not found");
        }

        req.user = user;
        next();
    } catch (error) {
        throw new ApiError(401, error?.message || "Invalid access token");
    }
});
