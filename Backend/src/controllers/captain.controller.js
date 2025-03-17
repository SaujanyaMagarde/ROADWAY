import mongoose from 'mongoose';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiRes.js';
import { asyncHandler } from '../utils/AsyncHandels.js';
import { uploadResult } from '../utils/Cloudinary.js';
import { Captain } from '../models/captain.model.js';

const registerCaptain = asyncHandler(async (req, res) => {
    const { firstname, lastname, email, password, mobile_no, color, plate, capacity, vehicleType } = req.body;

    // Validate required fields
    if (![firstname, lastname, email, password, mobile_no, color, plate, capacity, vehicleType].every(field => field && field.toString().trim())) {
        throw new ApiError(400, "All fields are required");
    }

    if (firstname.trim().length < 3 || lastname.trim().length < 3) {
        throw new ApiError(400, "Firstname and Lastname must be at least 3 characters long");
    }

    if (!/^\S+@\S+\.\S+$/.test(email)) {
        throw new ApiError(400, "Invalid email format");
    }

    if (!/^[0-9]{10}$/.test(mobile_no)) {
        throw new ApiError(400, "Mobile number must be 10 digits");
    }

    if (color.trim().length < 3 || plate.trim().length < 3) {
        throw new ApiError(400, "Color and Plate must be at least 3 characters long");
    }

    if (capacity < 1) {
        throw new ApiError(400, "Capacity must be at least 1");
    }

    if (!['car', 'motorcycle', 'auto'].includes(vehicleType)) {
        throw new ApiError(400, "Invalid vehicle type");
    }

    // Check if user already exists
    const existedCaptain = await Captain.findOne({
        $or: [{ mobile_no }, { email }]
    });

    if (existedCaptain) {
        throw new ApiError(400, "Captain already exists");
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
    const captain = await Captain.create({
        fullname: {
            firstname: firstname.trim(),
            lastname: lastname.trim()
        },
        password,
        email: email.trim(),
        mobile_no: mobile_no.trim(),
        avatar,
        vehicle: {
            color: color.trim(),
            plate: plate.trim(),
            capacity,
            vehicleType,
        },
    });

    const createdCaptain = await Captain.findById(captain._id).select("-password -refreshToken");

    if (!createdCaptain) {
        throw new ApiError(500, "Captain can't be registered");
    }

    return res.status(201).json(new ApiResponse(200, "Captain registered successfully", createdCaptain));
});

const genrateAccessAndRefreshTokens = async(captainID) => {
    try{
        const captain = await Captain.findById(captainID)
        const accessToken = captain.generateAccessToken()
        const refreshToken = captain.generateRefreshToken()

        captain.refreshToken = refreshToken

        await captain.save({validateBeforeSave : false})

        return {accessToken,refreshToken}
    }
    catch(error){
        throw new ApiError(500,"something went wrong in refresh token")
    }
}

const loginCaptain = asyncHandler(async (req,res)=>{
    

    const {email,password} = req.body;

    if(!email){
        throw new ApiError(400,"something is missing please check all input fields")
    }
    if(!password){
        throw new ApiError(400,"password is missing")
    }

    const captain = await Captain.findOne({email})

    if(!captain){
        throw new ApiError(404,"Captain does not exist ")
    }

    const isValid = await captain.isPasswordCorrect(password)

    if(!isValid){
        throw new ApiError(401,"password is not valid")
    }

    const {accessToken , refreshToken} = await genrateAccessAndRefreshTokens(captain._id);

    const loggedCaptain = await Captain.findById(captain._id).select(" -password -refreshToken")

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
            200,"Captain logged in succesfully",{
                Captain : loggedCaptain,accessToken,refreshToken
            },
        )
    )
})

const logoutCaptain = asyncHandler(async (req,res)=>{
    Captain.findByIdAndUpdate(req.captain._id,{
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
        new ApiResponse(200,{},"captain logged out")
    )
})


const getProfileCaptain = asyncHandler(async (req,res)=>{
    const captainId = req.captain._id;

    if(!captainId){
        throw new ApiError(401 , "user not found please signup");
    }
    const captain = await Captain.findById(captainId).select(" -password -refreshToken")

    if(!captain){
        throw  new ApiError(500,"server error ");
    }

    return res
    .status(200)
    .json(
        new ApiResponse(
            200,"captain profile fetched successfully",{
                cpatain : captain
            },
        )
    )
})

export { 
    registerCaptain,
    loginCaptain,
    logoutCaptain,
    getProfileCaptain
 };
