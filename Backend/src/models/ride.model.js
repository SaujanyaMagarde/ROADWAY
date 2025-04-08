import mongoose, { Schema } from 'mongoose';

const rideSchema = new Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  captain: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Captain',
  },
  pickup: {
    location: {
      type: String,
      required: true,
    },
    coordinates: {
      type: {
        type: String,
        enum: ['Point'],
        default: 'Point',
      },
      coordinates: {
        type: [Number],
        required: true,
      },
    },
  },
  destination: {
    location: {
      type: String,
      required: true,
    },
    lat: Number,
    lng: Number,
  },
  fare: Number,
  isPaid: {
    type: Boolean,
    default: false,
  },
  rideType: {
    type: String,
    enum: ['bike', 'auto', 'car'],
    default: 'car',
  },
  status: {
    type: String,
    enum: ['pending', 'accepted', 'ongoing', 'completed', 'cancelled'],
    default: 'pending',
  },
  duration: Number, // in seconds
  distance: Number, // in meters
  paymentID: String,
  otp : String,
  signature: String,
}, {
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
});

rideSchema.index({ "pickup.coordinates": "2dsphere" });

export const Ride = mongoose.model("Ride", rideSchema);

