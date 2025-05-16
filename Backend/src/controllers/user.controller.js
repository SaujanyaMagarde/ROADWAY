import mongoose from 'mongoose';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiRes.js';
import { asyncHandler } from '../utils/AsyncHandels.js';
import { uploadResult } from '../utils/Cloudinary.js';
import { User } from '../models/user.model.js';
import {Ride} from '../models/ride.model.js'
import { Captain } from '../models/captain.model.js';

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

const genrateAccessAndRefreshTokens = async(userID) => {
    try{
        const user = await User.findById(userID)
        const accessToken = user.generateAccessToken()
        const refreshToken = user.generateRefreshToken()

        user.refreshToken = refreshToken

        await user.save({validateBeforeSave : false})

        return {accessToken,refreshToken}
    }
    catch(error){
        throw new ApiError(500,"something went wrong in refresh token")
    }
}

const loginUser = asyncHandler(async (req,res)=>{
    

    const {email,password} = req.body;

    if(!email){
        throw new ApiError(400,"something is missing please check all input fields")
    }
    if(!password){
        throw new ApiError(400,"password is missing")
    }

    const user = await User.findOne({email})

    if(!user){
        throw new ApiError(404,"user does not exist ")
    }

    const isValid = await user.isPasswordCorrect(password)

    if(!isValid){
        throw new ApiError(401,"password is not valid")
    }

    const {accessToken , refreshToken} = await genrateAccessAndRefreshTokens(user._id);

    const loggedUser = await User.findById(user._id).select(" -password -refreshToken")

    const options = {
        httpOnly : true,
        secure : true,
    }

    return res
    .status(200)
    .cookie("accessToken",accessToken,options)
    .cookie("refreshToken",refreshToken,options)
    .json(
        new ApiResponse(
            200,"user logged in succesfully",{
                user : loggedUser,accessToken,refreshToken
            },
        )
    )
})

const logoutUser = asyncHandler(async (req,res)=>{
    User.findByIdAndUpdate(req.user._id,{
        $set :{
            refreshToken : undefined
        }
    },{
        new : true
    })

    const options = {
        httpOnly : true,
        secure : true,
        sameSite : 'none',
    }

    return res
    .status(200)
    .clearCookie("accessToken",options)
    .clearCookie("refreshToken",options)
    .json(
        new ApiResponse(200,{},"user logged out")
    )
})

const getProfile = asyncHandler(async (req,res)=>{
    const userId = req.user._id;

    if(!userId){
        throw new ApiError(401 , "user not found please signup");
    }
    const user = await User.findById(userId).select(" -password -refreshToken")

    if(!user){
        throw  new ApiError(500,"server error ");
    }

    return res
    .status(200)
    .json(
        new ApiResponse(
            200,"user profile fetched successfully",{
                user : user
            },
        )
    )
})

const getOtp = asyncHandler(async (req,res)=>{
    const userId = req.user._id;

    if(!userId){
        throw new ApiError(401 , "user not found please signup");
    }

    const {rideId} = req.query;


    const ride = await Ride.findById(rideId);

    if(!ride){
        throw new ApiError(404,"ride not found");
    }

    if(!ride.otp){
        throw new ApiError(404,"otp is not genrated by user");
    }
    const otp = ride.otp;

    return res.status(200).json(new ApiResponse(200,"otp fetched succefully",otp));

})

const getcaptaindata = asyncHandler(async (req, res) => {
  if (!req || !req.body.captain_id) {
    throw new ApiError("data fetch error");
  }

  const captain_id = req.body.captain_id;

  if (!captain_id) {
    throw new ApiError("captain id missing");
  }

  const captain = await Captain.findById(captain_id).select("-password -refreshToken");

  if (!captain) {
    throw new ApiError("Captain not found");
  }

  return res.status(200).json(
    new ApiResponse(200, "Captain profile fetched successfully", {
      captain,
    })
  );
});

const getrideinfo = asyncHandler(async (req, res) => {
  if (!req || !req.body.ride_id) {
    throw new ApiError("data fetch error");
  }

  const ride_id = req.body.ride_id;

  if (!ride_id) {
    throw new ApiError("ride id missing");
  }

  const ride = await Ride.findById(ride_id).select("-password -refreshToken");

  if (!ride) {
    throw new ApiError("ride not found");
  }

  return res.status(200).json(
    new ApiResponse(200, "ride profile fetched successfully", {
      ride,
    })
  );
});



export { 
    registerUser ,
    loginUser,
    logoutUser,
    getProfile,
    getOtp,
    getcaptaindata,
    getrideinfo
};
