const mongoose = require('mongoose');
const Ride = require('../models/Ride');

const VEHICLES = ['Bike', 'Auto', 'Car', 'Van'];

// Shape a ride for the browse list. NO phone numbers here - only after joining.
function toListItem(ride, userId) {
  const isMine = String(ride.creator._id) === userId;
  const joined = ride.participants.some((p) => String(p._id || p) === userId);
  return {
    id: ride._id,
    source: ride.source,
    destination: ride.destination,
    departureTime: ride.departureTime,
    price: ride.price,
    vehicleType: ride.vehicleType,
    allowedCount: ride.allowedCount,
    seatsLeft: ride.allowedCount - ride.participants.length,
    creatorName: ride.creator.name,
    isMine,
    joined,
  };
}

// Shape a ride for "My Rides". Phones of the other side are included.
function toMyRide(ride, userId) {
  const isMine = String(ride.creator._id) === userId;
  return {
    ...toListItem(ride, userId),
    role: isMine ? 'driver' : 'passenger',
    // Creator sees passengers' phones; a passenger sees the creator's phone
    contacts: isMine
      ? ride.participants.map((p) => ({ name: p.name, phone: p.phone, role: 'passenger' }))
      : [{ name: ride.creator.name, phone: ride.creator.phone, role: 'driver' }],
  };
}

// POST /api/rides  - create a ride
exports.createRide = async (req, res) => {
  const { source, destination, departureTime, price, vehicleType, allowedCount } = req.body;

  if (!source || !destination || !departureTime || price === undefined || !vehicleType || !allowedCount) {
    return res.status(400).json({ message: 'All fields are required' });
  }
  if (!VEHICLES.includes(vehicleType)) return res.status(400).json({ message: 'Invalid vehicle type' });
  if (new Date(departureTime) <= new Date()) {
    return res.status(400).json({ message: 'Departure time must be in the future' });
  }
  if (Number(price) < 0 || Number(allowedCount) < 1) {
    return res.status(400).json({ message: 'Price and allowed count must be valid numbers' });
  }

  const ride = await Ride.create({
    creator: req.userId,
    source,
    destination,
    departureTime,
    price: Number(price),
    vehicleType,
    allowedCount: Number(allowedCount),
  });
  res.status(201).json({ id: ride._id });
};

// GET /api/rides?source=&destination=  - upcoming rides anyone can join
exports.getRides = async (req, res) => {
  const filter = { departureTime: { $gt: new Date() } };
  // case-insensitive "contains" search; escape user text so it is not treated as regex
  const esc = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  if (req.query.source) filter.source = new RegExp(esc(req.query.source), 'i');
  if (req.query.destination) filter.destination = new RegExp(esc(req.query.destination), 'i');

  const rides = await Ride.find(filter).sort({ departureTime: 1 }).populate('creator', 'name');
  res.json(rides.map((r) => toListItem(r, req.userId)));
};

// GET /api/rides/mine  - rides I posted or joined, split into upcoming + history
exports.getMyRides = async (req, res) => {
  const rides = await Ride.find({
    $or: [{ creator: req.userId }, { participants: req.userId }],
  })
    .sort({ departureTime: 1 })
    .populate('creator', 'name phone')
    .populate('participants', 'name phone');

  const now = new Date();
  const mapped = rides.map((r) => ({ ride: r, data: toMyRide(r, req.userId) }));
  res.json({
    upcoming: mapped.filter((m) => m.ride.departureTime > now).map((m) => m.data),
    history: mapped.filter((m) => m.ride.departureTime <= now).map((m) => m.data).reverse(),
  });
};

// POST /api/rides/join   body: { id }  - opt in to a ride
exports.joinRide = async (req, res) => {
  const { id } = req.body; // ride id comes in the request body, not the URL
  if (!id || !mongoose.isValidObjectId(id)) {
    return res.status(400).json({ message: 'A valid ride id is required' });
  }

  // One atomic update that only succeeds if ALL conditions hold, so two people
  // can never grab the last seat at the same time.
  const ride = await Ride.findOneAndUpdate(
    {
      _id: id,
      creator: { $ne: req.userId },
      participants: { $ne: req.userId },
      departureTime: { $gt: new Date() },
      $expr: { $lt: [{ $size: '$participants' }, '$allowedCount'] },
    },
    { $push: { participants: req.userId } },
    { returnDocument: 'after' }
  );

  if (ride) return res.json({ message: 'You joined the ride!' });

  // Update failed - work out why so we can show a helpful message
  const existing = await Ride.findById(id);
  let message = 'Ride not found';
  if (existing) {
    if (String(existing.creator) === req.userId) message = 'You cannot join your own ride';
    else if (existing.participants.some((p) => String(p) === req.userId)) message = 'You already joined this ride';
    else if (existing.departureTime <= new Date()) message = 'This ride has already departed';
    else message = 'Ride is full';
  }
  res.status(400).json({ message });
};
