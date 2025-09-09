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
          type: [Number], // [longitude, latitude]
          required: true,
        },
      },
    },
    destination: {
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
          type: [Number], // [longitude, latitude]
          required: true,
        },
      },
    },
    departureTime: {
      type: String, // e.g. "18:30"
      required: true,
    },
    departureDate: {
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
      enum: ['open','accepted','ongoing','endjouney','completed', 'cancelled'],
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
    request : [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
        },
      },
    ],
  },
  {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
  }
);

// ✅ Geospatial indexes for pickup & destination
shareRideSchema.index({ 'pickup.coordinates': '2dsphere' });
shareRideSchema.index({ 'destination.coordinates': '2dsphere' });

export const ShareRide = mongoose.model('ShareRide', shareRideSchema);
