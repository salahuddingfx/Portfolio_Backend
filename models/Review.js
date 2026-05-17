import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema({
  name: { type: String, required: true },
  role: { type: String, required: true },
  company: { type: String },
  text: { type: String, required: true },
  avatar: { type: String },
  rating: { type: Number, default: 5 },
  order: { type: Number, default: 0 },
  status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'approved' }
}, { timestamps: true });

const Review = mongoose.model('Review', reviewSchema);
export default Review;
