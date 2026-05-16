import mongoose from 'mongoose';

const settingsSchema = new mongoose.Schema({
  // Bio / About
  bio: { type: String },
  aboutTitle: { type: String },
  aboutText: { type: String },
  experienceYears: { type: String },
  projectsCompleted: { type: String },
  cvUrl: { type: String },

  // Contact Info
  email: { type: String },
  phone: { type: String },
  whatsapp: { type: String },
  location: { type: String },

  // Social Links
  socials: {
    github: { type: String },
    linkedin: { type: String },
    twitter: { type: String },
    instagram: { type: String },
    facebook: { type: String },
  }
}, { timestamps: true });

const Settings = mongoose.model('Settings', settingsSchema);
export default Settings;
