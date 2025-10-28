const router = require('express').Router();
const Alert = require('../models/alert');
const nodemailer = require('nodemailer');

// Email configuration
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// Get all active alerts
router.get('/', async (req, res) => {
  try {
    const alerts = await Alert.find({ status: 'active' })
      .sort({ createdAt: -1 })
      .populate('device', 'name ip');
    res.json(alerts);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create new alert
router.post('/', async (req, res) => {
  const alert = new Alert(req.body);
  try {
    const newAlert = await alert.save();
    
    // Send email notification for critical alerts
    if (alert.severity === 'critical') {
      await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: process.env.ALERT_RECIPIENTS,
        subject: `Critical Alert: ${alert.message}`,
        text: `Device: ${alert.device.name}\nMessage: ${alert.message}\nTime: ${new Date().toLocaleString()}`
      });
    }
    
    res.status(201).json(newAlert);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Acknowledge alert
router.patch('/:id/acknowledge', async (req, res) => {
  try {
    const alert = await Alert.findById(req.params.id);
    if (!alert) {
      return res.status(404).json({ message: 'Alert not found' });
    }
    
    alert.status = 'acknowledged';
    alert.acknowledgedBy = req.body.user;
    const updatedAlert = await alert.save();
    res.json(updatedAlert);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Resolve alert
router.patch('/:id/resolve', async (req, res) => {
  try {
    const alert = await Alert.findById(req.params.id);
    if (!alert) {
      return res.status(404).json({ message: 'Alert not found' });
    }
    
    alert.status = 'resolved';
    alert.resolvedAt = Date.now();
    const updatedAlert = await alert.save();
    res.json(updatedAlert);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;