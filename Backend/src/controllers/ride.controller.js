import mongoose from 'mongoose';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiRes.js';
import { asyncHandler } from '../utils/AsyncHandels.js';
import { uploadResult } from '../utils/Cloudinary.js';
import { User } from '../models/user.model.js';
import {Ride} from '../models/ride.model.js';
import {ShareRide} from '../models/shareRide.model.js';
import { getIO,sendMessageToSocket } from '../utils/socket.js';

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

  await ShareRide.deleteMany({
  createdBy: userId,
  status: { $in: ["open", "accepted", "ongoing"] }
});

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
  }).populate("createdBy", "fullname avatar createdAt mobile_no"); 

  return res
    .status(200)
    .json(new ApiResponse(200, "Nearby rides fetched successfully", rides));
});

const reqbuddy = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const buddyride = req.body;

  // Buddy who created this ride
  const buddyId = buddyride?.createdBy?._id;
  if (!buddyId) {
    throw new ApiError(400, "Buddy ID not found in request");
  }

  // Fetch buddy user
  const buddy = await User.findById(buddyId).select("fullname email mobile_no socketId");
  if (!buddy) {
    throw new ApiError(404, "Buddy not found");
  }

  await ShareRide.findByIdAndUpdate(
    buddyride._id,
    { $addToSet: { request: { user: userId } } }, // Add requester to 'request' array
    { new: true }
  );

  // Current user (the requester)
  const user = await User.findById(userId).select("fullname email mobile_no");

  // Get buddy's socketId
  const buddysocketId = buddy?.socketId;

  if (buddysocketId) {
    sendMessageToSocket(buddysocketId, {
      type: "buddy_requested",
      ride: buddyride,
      user, // requester details
    });
  }

  return res.status(200).json(
    new ApiResponse(200, "Request sent to buddy",buddysocketId)
  );
});

const giveride =  asyncHandler(async(req,res)=>{
  if(!req.user || !req.user._id){
      throw new ApiError("unauthorised request");
  }

  const userId = req.user?._id;

  const rides = await ShareRide.find({
    createdBy: userId,
    status: { $in: ["open", "accepted", "ongoing", "endjourney"] }
  })
  .sort({ created_at: -1 })
  .limit(1)
  .populate({
      path: "request.user", // field in ShareRide schema
      select: "fullname mobile_no avatar", // only fetch these fields
    })
    .exec();

  if (rides.length === 0) {
    return res.status(200).json(
      new ApiResponse(
        200,
        "No ongoing shared ride found",
      )
    );
  }

  const ride = rides[0];

  if (!ride) {
    return res.status(200).json(
      new ApiResponse(
        200,
        "No ongoing shared ride found",
      )
    );
  }

  return res.status(200).json(
      new ApiResponse(
          200,
          "ride fetched successfully",
          ride
      )
  );
});

const giverequestride = asyncHandler(async (req, res) => {
  if (!req.user || !req.user._id) {
    throw new ApiError(401, "Unauthorized request");
  }

  const userId = new mongoose.Types.ObjectId(req.user._id);

  const ride = await ShareRide.findOne({
  $and: [
    {
      $or: [
        { request: { $elemMatch: { user: userId } } },
        { buddies: { $elemMatch: { user: userId } } },
      ],
    },
    { status: { $nin: ["completed"] } },
  ],
})
  .sort({ created_at: -1 })
  .populate("createdBy", "fullname mobile_no avatar")
  .populate("request.user", "fullname mobile_no avatar")
  .populate("buddies.user", "fullname mobile_no avatar")
  .populate("captain", "fullname avatar mobile_no vehicle");


  console.log(ride);

  if (!ride) {
    return res
      .status(200)
      .json(new ApiResponse(200, "No requested ride found"));
  }

  return res
    .status(200)
    .json(new ApiResponse(200, "Requested ride fetched successfully", ride));
});

const conformbuddy = asyncHandler(async (req, res) => {
  if (!req.user || !req.user._id) {
    throw new ApiError(401, "Unauthorized request");
  }
  console.log(req.body);
  const userId = req.user._id;
  const { rideId, buddyId } = req.body;

  if (!rideId || !buddyId) {
    throw new ApiError(400, "rideId and buddyId are required");
  }

  const ride = await ShareRide.findById(rideId);
  if (!ride) {
    throw new ApiError(404, "Ride not found");
  }

  // Remove buddy from request array
  ride.request = ride.request.filter(r => r.user.toString() !== buddyId.toString());

  // Add buddy to buddies array if not already added
  if (!ride.buddies.includes(buddyId)) {
    ride.buddies.push({ user: buddyId });
  }

  ride.status = "accepted";

  await ride.save();

  // Fetch buddy & creator
  const budd = await User.findById(buddyId);
  const creat = await User.findById(ride.createdBy);

  // Extract socketIds
  const buddsocketId = budd?.socketId;
  const creatsocketId = creat?.socketId;

  // Notify buddy
  if (buddsocketId) {
    sendMessageToSocket(buddsocketId, {
      type: "ride_confirmed",
      ride,
      buddy: budd,
    });
  }

  // Notify ride creator
  if (creatsocketId) {
    sendMessageToSocket(creatsocketId, {
      type: "ride_confirmed",
      ride,
      creator: creat,
    });
  }

  return res.status(200).json(
    new ApiResponse(200, "Buddy added successfully", ride)
  );
});

const cancelRide = asyncHandler(async (req,res) =>{
  if (!req.user || !req.user._id) {
    throw new ApiError(401, "Unauthorized request");
  } 
  const userId = req.user._id;
  const { rideId } = req.body;
  
  if (!rideId) {
    throw new ApiError(400, "rideId is required");
  }
  const ride = await ShareRide.findById(rideId);  
  if (!ride) {
    throw new ApiError(404, "Ride not found");
  }

  await ShareRide.findByIdAndDelete(rideId);

  return res.status(200).json(
    new ApiResponse(200, "Ride cancelled successfully")
  );
})

const rejectRequest = asyncHandler(async (req, res) => {
  if (!req.user || !req.user._id) {
    throw new ApiError(401, "Unauthorized request");
  }

  const userId = req.user._id;
  const { rideId, buddyId } = req.body;

  if (!rideId || !buddyId) {
    throw new ApiError(400, "rideId and buddyId are required");
  }

  const ride = await ShareRide.findById(rideId);
  if (!ride) {
    throw new ApiError(404, "Ride not found");
  }

  // Remove buddy from request array
  ride.request = ride.request.filter(r => r.user.toString() !== buddyId.toString());

  await ride.save();

  // Fetch buddy
  const budd = await User.findById(buddyId);
  const buddsocketId = budd?.socketId;

  // Notify buddy
  if (buddsocketId) {
    sendMessageToSocket(buddsocketId, {
      type: "request_rejected",
      ride,
      buddy: budd,
    });
  }

  return res.status(200).json(
    new ApiResponse(200, "Request rejected successfully", ride  )
  );
});

const removeRequestFromRide = asyncHandler(async (req, res) => {
  const { rideId} = req.body;
  const buddyId = req?.user?._id;

  if (!rideId || !buddyId) {
    throw new ApiError(400, "rideId and buddyId are required");
  }

  const ride = await ShareRide.findById(rideId);
  if (!ride) {
    throw new ApiError(404, "Ride not found");
  }

  const createdby = ride?.createdBy;

  const user = User.findById(createdby);

  const socketId = user?.socketId;

  // Remove buddy from request array
  ride.request = ride.request.filter(r => r.user.toString() !== buddyId.toString());

  await ride.save();

  if(socketId){
    sendMessageToSocket(socketId, {
      type: "request_removed",
      ride,
    });
  }


  return res.status(200).json(
    new ApiResponse(200, "Request removed successfully", ride)
  );
});



export {
    createRide,
    deleteRide,
    deleteExpiredRides,
    fetchOngoingRides,
    shareRide,
    getBuddy,
    reqbuddy,
    giveride,
    giverequestride,
    conformbuddy,
    cancelRide,
    rejectRequest,
    removeRequestFromRide,
}

