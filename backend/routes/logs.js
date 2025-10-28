const router = require('express').Router();
const Log = require('../models/log');

// Get all logs with pagination
router.get('/', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 50;
    const logs = await Log.find()
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .populate('device', 'name ip');
    res.json(logs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Add a new log
router.post('/', async (req, res) => {
  const log = new Log(req.body);
  try {
    const newLog = await log.save();
    res.status(201).json(newLog);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Get logs for a specific device
router.get('/device/:deviceId', async (req, res) => {
  try {
    const logs = await Log.find({ device: req.params.deviceId })
      .sort({ createdAt: -1 })
      .limit(100);
    res.json(logs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;