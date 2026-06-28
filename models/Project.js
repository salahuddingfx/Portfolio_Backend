import mongoose from 'mongoose';

const projectSchema = new mongoose.Schema({
  title: { type: String, required: true },
  desc: { type: String, required: true },
  image: { type: String, required: true },
  mobileImage: { type: String },
  category: { type: String, default: 'Other' },
  tags: [{ type: String }],
  links: {
    live: { type: String, default: '#' },
    source: { type: String, default: '#' }
  },
  order: { type: Number, default: 0 },
  featured: { type: Boolean, default: false }
}, { timestamps: true });

const Project = mongoose.model('Project', projectSchema);
export default Project;
