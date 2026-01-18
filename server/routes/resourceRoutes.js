const express = require('express');
const router = express.Router();
const { getNearbyHospitals, getNearbyDonors, updateInventory } = require('../controllers/resourceController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.get('/hospitals', protect, getNearbyHospitals);
router.get('/donors', protect, getNearbyDonors);
router.put('/inventory', protect, authorize('hospital', 'admin'), updateInventory);

module.exports = router;
