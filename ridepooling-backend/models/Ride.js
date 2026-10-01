const mongoose = require('mongoose');

const rideSchema = new mongoose.Schema(
  {
    creator: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    source: { type: String, required: true, trim: true },
    destination: { type: String, required: true, trim: true },
    departureTime: { type: Date, required: true },
    price: { type: Number, required: true, min: 0 }, // price per person
    vehicleType: { type: String, enum: ['Bike', 'Auto', 'Car', 'Van'], required: true },
    allowedCount: { type: Number, required: true, min: 1 }, // how many people can join
    participants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  },
  { timestamps: true }
);

module.exports = mongoose.model('Ride', rideSchema);
