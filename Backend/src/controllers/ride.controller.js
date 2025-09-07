import mongoose from 'mongoose';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiRes.js';
import { asyncHandler } from '../utils/AsyncHandels.js';
import { uploadResult } from '../utils/Cloudinary.js';
import { User } from '../models/user.model.js';
import {Ride} from '../models/ride.model.js';
import {ShareRide} from '../models/shareRide.model.js';

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

    await Ride.deleteMany({
      user: userId,
      status: { $in: ['pending', 'accepted', 'ongoing'] }
    });

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

const fetchOngoingRides = asyncHandler(async (req, res) => {
    if (!req.user || !req.user._id) {
        throw new ApiError(401, "Unauthorized request");
    }

    const userId = req.user._id;

    const ride = await Ride.findOne({
      user: userId,
  status: { $in: ['pending', 'accepted', 'ongoing'] }
}).sort({ createdAt: -1 });

    return res.status(200).json(
        new ApiResponse(
            200,
            "rides fetched successfully",
            ride
        )
    );
});

const shareRide = asyncHandler(async (req, res) => {
  if (!req.user || !req.user._id) {
    throw new ApiError(401, "Unauthorized request");
  }

  const userId = req.user._id;
  const {
    pickup,
    destination,
    departureDate,
    departureTime,
    fare,
    rideType,
    duration,
    distance,
    polyline,
  } = req.body;

  // --- VALIDATION ---
  if (
    !pickup?.location ||
    !Array.isArray(pickup?.coordinates?.coordinates) ||
    pickup.coordinates.coordinates.length !== 2
  ) {
    throw new ApiError(400, "Pickup location and coordinates are required");
  }

  if (
    !destination?.location ||
    !Array.isArray(destination?.coordinates?.coordinates) ||
    destination.coordinates.coordinates.length !== 2
  ) {
    throw new ApiError(400, "Destination location and coordinates are required");
  }

  if (!departureDate) throw new ApiError(400, "Departure date is required");
  if (!departureTime) throw new ApiError(400, "Departure time is required");

  // --- CREATE RIDE ---
  const newShareRide = await ShareRide.create({
    createdBy: userId,

    pickup: {
      location: pickup.location,
      coordinates: {
        type: "Point",
        coordinates: [
          parseFloat(pickup.coordinates.coordinates[0]), // longitude
          parseFloat(pickup.coordinates.coordinates[1]), // latitude
        ],
      },
    },

    destination: {
      location: destination.location,
      coordinates: {
        type: "Point",
        coordinates: [
          parseFloat(destination.coordinates.coordinates[0]), // longitude
          parseFloat(destination.coordinates.coordinates[1]), // latitude
        ],
      },
    },

    departureDate,
    departureTime,
    fare,
    rideType,
    duration,
    distance,
    polyline,
    signature: "@roadway#all$right&reserved#",
    isPaid: false,
    status: "open",
  });

  return res
    .status(200)
    .json(new ApiResponse(200, "Ride shared successfully", newShareRide));
});


const getBuddy = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const { pickup, destination, departureTime, departureDate, rideType } = req.body;

  const [pickupLng, pickupLat] = pickup?.coordinates?.coordinates || [];
  const [destLng, destLat] = destination?.coordinates?.coordinates || [];

  if (
    !pickupLat ||
    !pickupLng ||
    !destLat ||
    !destLng ||
    !departureTime ||
    !departureDate ||
    !rideType
  ) {
    throw new ApiError(400, "All fields are required");
  }

  // --- Convert departureTime (string like "18:30") into Date objects with ±5 minutes ---
  const [hours, minutes] = departureTime.split(":").map(Number);
  const userDateTime = new Date(`${departureDate}T${departureTime}:00Z`);

  const minTime = new Date(userDateTime.getTime() - 5 * 60000); // -5 min
  const maxTime = new Date(userDateTime.getTime() + 5 * 60000); // +5 min

  // --- Query for buddies ---
  const rides = await ShareRide.find({
    // 1. Within 1 km radius of pickup
    "pickup.coordinates": {
      $near: {
        $geometry: { type: "Point", coordinates: [pickupLng, pickupLat] },
        $maxDistance: 1000, // 1 km
      },
    },

    // 2. Destination must match exactly (both lng & lat)
    "destination.coordinates.coordinates": [destLng, destLat],

    // 3. Departure date exact match
    departureDate,

    // 4. Departure time within ±5 min
    departureTime: {
      $gte: minTime.toISOString().slice(11, 16), // "HH:MM"
      $lte: maxTime.toISOString().slice(11, 16),
    },

    // 5. Ride type match
    rideType,
  });

  return res
    .status(200)
    .json(new ApiResponse(200, "Nearby rides fetched successfully", rides));
});


export {
    createRide,
    deleteRide,
    deleteExpiredRides,
    fetchOngoingRides,
    shareRide,
    getBuddy
}

