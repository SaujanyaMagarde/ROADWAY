import mongoose from 'mongoose';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiRes.js';
import { asyncHandler } from '../utils/AsyncHandels.js';
import { uploadResult } from '../utils/Cloudinary.js';
import { User } from '../models/user.model.js';

const registerUser = asyncHandler(async (req, res) => {
    const { firstname, lastname, email, password, mobile_no } = req.body;

    // Check if all fields are provided
    if ([firstname, lastname, email, password, mobile_no].some(field => !field || !field.trim())) {
        throw new ApiError(400, "All fields are required");
    }

    if (firstname.trim().length < 3 || lastname.trim().length < 3) {
        throw new ApiError(400, "Firstname and Lastname must be at least 3 characters long");
    }

    // Check if user already exists
    const existedUser = await User.findOne({
        $or: [{ mobile_no }, { email }]
    });
    if (existedUser) {
        throw new ApiError(400, "User already exists");
    }

    let avatar = "";
    const avatarLocalPath = req.files?.avatar?.[0]?.path;
    if (avatarLocalPath) {
        console.log(avatarLocalPath);
        const uploadResponse = await uploadResult(avatarLocalPath);
        if (!uploadResponse) {
            throw new ApiError(500, "Something went wrong with image upload");
        }
        avatar = uploadResponse.url;
    }

    // Create user
    const user = await User.create({
        fullname: {
            firstname,
            lastname
        },
        password,
        email,
        mobile_no,
        avatar
    });

    const createdUser = await User.findById(user._id).select("-password -refreshToken");

    if (!createdUser) {
        throw new ApiError(500, "User can't be registered");
    }

    return res.status(201).json(new ApiResponse(200, "User registered successfully", createdUser));
});





export { registerUser };
