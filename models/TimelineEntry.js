import mongoose from 'mongoose';

const timelineEntrySchema = new mongoose.Schema({
  year: { type: String, required: true },
  title: { type: String, required: true },
  subtitle: { type: String },
  description: { type: String },
  icon: { type: String, default: 'graduation' },
  order: { type: Number, default: 0 }
}, { timestamps: true });

const TimelineEntry = mongoose.model('TimelineEntry', timelineEntrySchema);
export default TimelineEntry;
