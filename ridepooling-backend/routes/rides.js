const express = require('express');
const auth = require('../middleware/auth');
const { createRide, getRides, getMyRides, joinRide } = require('../controllers/rideController');

const router = express.Router();
router.use(auth); // every ride route needs a logged-in user

router.post('/', createRide);
router.get('/', getRides);
router.get('/mine', getMyRides); // static paths (like /mine) go above any '/:id' routes
router.post('/join', joinRide);

module.exports = router;
