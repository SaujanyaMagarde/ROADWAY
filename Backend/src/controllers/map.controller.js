import dotenv from 'dotenv'; 
import mongoose from 'mongoose';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiRes.js';
import { asyncHandler } from '../utils/AsyncHandels.js';
import { uploadResult } from '../utils/Cloudinary.js';
import { User } from '../models/user.model.js';
import axios from 'axios'

dotenv.config();

const searchRoute = asyncHandler(async (req,res)=>{
    const {pickup,destination} = req.body;
    console.log(pickup,destination);
    if (!pickup.lat || !pickup.lng || !destination.lat || !destination.lng) {
        return;
    }
    const url = `https://api.olamaps.io/routing/v1/directions?origin=${pickup.lat},${pickup.lng}&destination=${destination.lat},${destination.lng}&api_key=${process.env.OLA_MAP_API_KEY}`;
    try {
        const response = await axios.post(url, {}, {
            headers: { 
                "X-Request-Id": "XXX",
                "Origin": "http://localhost:5173"
            }
        });
        
        return res
        .status(200)
        .json(
            new ApiResponse(
                200,"direction api fetched succefully",{
                    data : response.data
                },
            )
        )
    } catch (error) {
        throw new ApiError(501,"server busy");
    }
})

export{
    searchRoute
}