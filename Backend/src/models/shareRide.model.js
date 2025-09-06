import mongoose, { Schema } from 'mongoose';

const shareRideSchema = new Schema(
  {
    createdBy: {
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
          type: [Number], // [lng, lat]
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
    departureTime: {
      type: String, // e.g. "18:30"
      required: true,
    },
    deprtureDate :{
      type: String,
      required: true,
    },
    rideType: {
      type: String,
      enum: ['Moto', 'UberGo', 'UberAuto'],
      default: 'Moto',
    },
    status: {
      type: String,
      enum: ['open', 'ongoing', 'completed', 'cancelled'],
      default: 'open',
    },
    duration: String,
    distance: Number,
    buddies: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
        },
      },
    ],
    fare: Number,
    isPaid: {
      type: Boolean,
      default: false,
    },
    paymentID: String,
    otp: String,
    signature: String,
  },
  {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
  }
);

// Geospatial index for searching nearby share rides
shareRideSchema.index({ 'pickup.coordinates': '2dsphere' });

export const ShareRide = mongoose.model('ShareRide', shareRideSchema);