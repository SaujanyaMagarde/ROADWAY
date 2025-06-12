import mongoose from 'mongoose';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiRes.js';
import { asyncHandler } from '../utils/AsyncHandels.js';
import { uploadResult } from '../utils/Cloudinary.js';
import { User } from '../models/user.model.js';
import {Ride} from '../models/ride.model.js';


async function deleteExpiredRides() {
  try {
    const now = new Date();
    
    const result = await Ride.deleteMany({
      $or: [
        // Rides that took more than 3 minutes from pending to accepted
        {
          status: "accepted",
          pendingTime: { $exists: true },
          acceptedTime: { $exists: true },
          $expr: {
            $gt: [
              { $subtract: ["$acceptedTime", "$pendingTime"] },
              180000 // 3 minutes in milliseconds
            ]
          }
        },
        // Rides in accepted status for more than 1 hour
        {
          status: "accepted",
          acceptedTime: { $exists: true },
          $expr: {
            $gt: [
              { $subtract: [now, "$acceptedTime"] },
              3600000 // 1 hour in milliseconds
            ]
          }
        },
        // Rides in ongoing status for more than 5 hours
        {
          status: "ongoing",
          ongoingTime: { $exists: true },
          $expr: {
            $gt: [
              { $subtract: [now, "$ongoingTime"] },
              18000000 // 5 hours in milliseconds
            ]
          }
        }
      ]
    });
    
    console.log(`Deleted ${result.deletedCount} expired rides`);
    return result.deletedCount;
    
  } catch (error) {
    console.error('Error deleting rides:', error);
    throw error;
  }
}


const createRide = asyncHandler(async (req, res) => {
    
    if(!req.user || !req.user._id){
        throw new ApiError("unauthorised request");
    }

    const userId = req.user?._id;
    
    const {
      pickup,
      destination,
      fare,
      rideType,
      duration,
      distance,
    } = req.body;
  
    // Basic validation
    if (
      !pickup ||
      !pickup.location ||
      pickup.lat === undefined ||
      pickup.lng === undefined ||
      !destination ||
      !destination.location ||
      destination.lat === undefined ||
      destination.lng === undefined
    ) {
        throw new ApiError("parameter missing to book a ride");
    }

    if (!fare || !duration || !distance) {
        throw new ApiError("parameter of ride is missing to book a ride");
    }


    const newRide = await Ride.create({
      user: userId,
      pickup: {
        location: pickup.location,
        coordinates: {
          type: "Point",
          coordinates: [pickup.lng, pickup.lat]
        }
      },
      destination,
      fare,
      rideType,
      duration,
      distance,
      signature: "@roadway#all$right&reserved#",
      isPaid: false,
      status: "pending",
    });  
    res.status(201).json(new ApiResponse(201,"ride created successfully",newRide));
});

const deleteRide = asyncHandler(async (req, res) => {
  if (!req.user || !req.user._id) {
      throw new ApiError(401, "Unauthorized request");
  }

  const userId = req.user._id;

  const result = await Ride.deleteMany({
      user: userId,
      status: "pending"
  });

  return res.status(200).json(
      new ApiResponse(
          200,
          `${result.deletedCount} pending ride(s) deleted successfully`
      )
  );
});

export {
    createRide,
    deleteRide,
    deleteExpiredRides,
}

