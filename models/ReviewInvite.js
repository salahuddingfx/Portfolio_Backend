import mongoose from 'mongoose';

const reviewInviteSchema = new mongoose.Schema({
  tokenHash: { type: String, required: true, unique: true },
  label: { type: String },
  email: { type: String },
  expiresAt: { type: Date, required: true },
  usedAt: { type: Date, default: null },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Admin' }
}, { timestamps: true });

const ReviewInvite = mongoose.model('ReviewInvite', reviewInviteSchema);
export default ReviewInvite;
