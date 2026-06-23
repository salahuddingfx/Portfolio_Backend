import mongoose from 'mongoose';

const serviceSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: String },
  icon: { type: String },
  tags: [{ type: String }],
  order: { type: Number, default: 0 }
}, { timestamps: true });

const Service = mongoose.model('Service', serviceSchema);
export default Service;
