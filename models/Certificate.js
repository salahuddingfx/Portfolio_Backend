import mongoose from 'mongoose';

const certificateSchema = new mongoose.Schema({
  title: { type: String, required: true },
  issuer: { type: String, required: true },
  year: { type: String },
  category: { type: String, default: 'General' },
  image: { type: String, required: true },
  credentialUrl: { type: String },
  description: { type: String },
  order: { type: Number, default: 0 }
}, { timestamps: true });

const Certificate = mongoose.model('Certificate', certificateSchema);
export default Certificate;
