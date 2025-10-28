const mongoose = require('mongoose');

const alertSchema = new mongoose.Schema({
  device: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Device',
    required: true
  },
  severity: {
    type: String,
    required: true,
    enum: ['low', 'medium', 'high', 'critical']
  },
  message: {
    type: String,
    required: true
  },
  status: {
    type: String,
    required: true,
    enum: ['active', 'acknowledged', 'resolved'],
    default: 'active'
  },
  resolvedAt: Date,
  acknowledgedBy: String
}, { timestamps: true });

module.exports = mongoose.model('Alert', alertSchema);