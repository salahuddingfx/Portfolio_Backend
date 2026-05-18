import mongoose from 'mongoose';

/**
 * Partner / Company logo shown on the About page.
 * Fields: name, logo (image URL), website (optional), order (display sort).
 */
const partnerSchema = new mongoose.Schema(
  {
    name:    { type: String, required: true, trim: true },
    logo:    { type: String, required: true },
    website: { type: String, default: '' },
    order:   { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default mongoose.model('Partner', partnerSchema);
