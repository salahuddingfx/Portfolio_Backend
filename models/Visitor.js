import mongoose from 'mongoose';

const visitorSchema = new mongoose.Schema({
  ip: { type: String },
  userAgent: { type: String },
  referrer: { type: String },
  country: { type: String, default: 'Unknown' },
  city: { type: String, default: 'Unknown' },
  path: { type: String },
  device: { type: String },
  browser: { type: String },
  timestamp: { type: Date, default: Date.now }
}, { timestamps: true });

const Visitor = mongoose.model('Visitor', visitorSchema);
export default Visitor;
