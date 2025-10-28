const mongoose = require('mongoose');

const deviceSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  ip: {
    type: String,
    required: true
  },
  type: {
    type: String,
    required: true,
    enum: ['router', 'switch', 'server', 'workstation']
  },
  status: {
    type: String,
    required: true,
    enum: ['online', 'offline', 'warning', 'error'],
    default: 'offline'
  },
  lastSeen: {
    type: Date,
    default: Date.now
  },
  metrics: {
    cpu: Number,
    memory: Number,
    bandwidth: Number
  }
}, { timestamps: true });

module.exports = mongoose.model('Device', deviceSchema);