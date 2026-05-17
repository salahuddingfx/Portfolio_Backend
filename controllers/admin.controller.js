import Project from '../models/Project.js';
import Review from '../models/Review.js';
import Admin from '../models/Admin.js';
import Settings from '../models/Settings.js';
import Visitor from '../models/Visitor.js';
import Certificate from '../models/Certificate.js';
import BlogPost from '../models/BlogPost.js';
import Service from '../models/Service.js';
import TimelineEntry from '../models/TimelineEntry.js';
import ReviewInvite from '../models/ReviewInvite.js';
import jwt from 'jsonwebtoken';
import axios from 'axios';
import crypto from 'crypto';
import { sendPasswordResetEmail } from '../utils/mail.js';

// Analytics & Visitors
export const logVisit = async (req, res) => {
  const { path, referrer } = req.body;
  const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
  const userAgent = req.headers['user-agent'];

  try {
    // Basic IP lookup (using ip-api.com for free)
    let country = 'Unknown';
    let city = 'Unknown';
    
    try {
      const geoRes = await axios.get(`http://ip-api.com/json/${ip}`);
      if (geoRes.data.status === 'success') {
        country = geoRes.data.country;
        city = geoRes.data.city;
      }
    } catch (err) {
      console.error('Geo lookup failed:', err.message);
    }

    await Visitor.create({
      ip,
      userAgent,
      referrer,
      path,
      country,
      city
    });

    res.sendStatus(200);
  } catch (error) {
    console.error('Log visit error:', error);
    res.sendStatus(500);
  }
};

export const getAnalytics = async (req, res) => {
  try {
    const totalVisits = await Visitor.countDocuments();
    const uniqueVisitors = await Visitor.distinct('ip').then(ips => ips.length);
    
    // Top Countries
    const topCountries = await Visitor.aggregate([
      { $group: { _id: '$country', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 5 }
    ]);

    // Visits over last 7 days
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    
    const visitsByDay = await Visitor.aggregate([
      { $match: { createdAt: { $gte: sevenDaysAgo } } },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    res.json({
      totalVisits,
      uniqueVisitors,
      topCountries,
      visitsByDay
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getRecentVisitors = async (req, res) => {
  try {
    const visitors = await Visitor.find().sort({ createdAt: -1 }).limit(50);
    res.json(visitors);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ... (previous exports)

// Settings
export const getSettings = async (req, res) => {
  try {
    let settings = await Settings.findOne();
    if (!settings) {
      settings = await Settings.create({
        bio: 'Full Stack Developer based in Cox\'s Bazar',
        aboutTitle: 'I craft digital experiences.',
        aboutText: 'I specialize in building modern web applications with a focus on performance.',
        experienceYears: '4+',
        projectsCompleted: '50+',
        email: 'salahuddinkaderappy@gmail.com',
        location: 'Cox\'s Bazar, Bangladesh',
        socials: { github: '#', linkedin: '#', twitter: '#' }
      });
    }
    res.json(settings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateSettings = async (req, res) => {
  try {
    const settings = await Settings.findOneAndUpdate({}, req.body, { returnDocument: 'after', upsert: true });
    res.json(settings);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Auth
export const login = async (req, res) => {
  const { username, password } = req.body;
  try {
    const admin = await Admin.findOne({ username });
    if (!admin || !(await admin.comparePassword(password))) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    const token = jwt.sign({ id: admin._id }, process.env.JWT_SECRET, { expiresIn: '1d' });
    res.json({ token });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getAdminProfile = async (req, res) => {
  try {
    const admin = await Admin.findById(req.adminId).select('username email');
    if (!admin) return res.status(404).json({ message: 'Admin not found' });
    res.json(admin);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateAdminProfile = async (req, res) => {
  try {
    const admin = await Admin.findById(req.adminId);
    if (!admin) return res.status(404).json({ message: 'Admin not found' });

    const { username, email, currentPassword, newPassword } = req.body;

    if (username && username !== admin.username) {
      const exists = await Admin.findOne({ username, _id: { $ne: admin._id } });
      if (exists) return res.status(409).json({ message: 'Username already in use' });
      admin.username = username;
    }

    if (email && email !== admin.email) {
      const exists = await Admin.findOne({ email, _id: { $ne: admin._id } });
      if (exists) return res.status(409).json({ message: 'Email already in use' });
      admin.email = email;
    }

    if (newPassword) {
      if (!currentPassword) {
        return res.status(400).json({ message: 'Current password is required' });
      }
      const valid = await admin.comparePassword(currentPassword);
      if (!valid) return res.status(401).json({ message: 'Current password is incorrect' });
      admin.password = newPassword;
    }

    await admin.save();
    res.json({ username: admin.username, email: admin.email });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const requestPasswordReset = async (req, res) => {
  const { email } = req.body;
  try {
    const admin = await Admin.findOne({ email });
    if (!admin) {
      return res.json({ message: 'If the email exists, a reset link was sent.' });
    }

    const resetToken = crypto.randomBytes(32).toString('hex');
    const hashedToken = crypto.createHash('sha256').update(resetToken).digest('hex');

    admin.resetToken = hashedToken;
    admin.resetTokenExpires = new Date(Date.now() + 60 * 60 * 1000);
    await admin.save();

    const baseUrl = process.env.ADMIN_APP_URL || process.env.FRONTEND_URL || 'http://localhost:3001';
    const resetUrl = `${baseUrl}/reset-password?token=${resetToken}`;

    await sendPasswordResetEmail({ to: admin.email, resetUrl });

    res.json({ message: 'If the email exists, a reset link was sent.' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const resetPassword = async (req, res) => {
  const { token, password } = req.body;
  try {
    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');
    const admin = await Admin.findOne({
      resetToken: hashedToken,
      resetTokenExpires: { $gt: new Date() }
    });

    if (!admin) {
      return res.status(400).json({ message: 'Reset token is invalid or expired' });
    }

    admin.password = password;
    admin.resetToken = undefined;
    admin.resetTokenExpires = undefined;
    await admin.save();

    res.json({ message: 'Password updated successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Projects
export const getProjects = async (req, res) => {
  try {
    const projects = await Project.find().sort({ order: 1 });
    res.json(projects);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createProject = async (req, res) => {
  try {
    const project = await Project.create(req.body);
    res.status(201).json(project);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const updateProject = async (req, res) => {
  try {
    const project = await Project.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(project);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const deleteProject = async (req, res) => {
  try {
    await Project.findByIdAndDelete(req.params.id);
    res.json({ message: 'Project deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Reviews
export const getReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ status: 'approved' }).sort({ order: 1 });
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getReviewsForAdmin = async (req, res) => {
  try {
    const reviews = await Review.find().sort({ createdAt: -1 });
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createReview = async (req, res) => {
  try {
    const review = await Review.create(req.body);
    res.status(201).json(review);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const updateReview = async (req, res) => {
  try {
    const review = await Review.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(review);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const deleteReview = async (req, res) => {
  try {
    await Review.findByIdAndDelete(req.params.id);
    res.json({ message: 'Review deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createReviewInvite = async (req, res) => {
  try {
    const { label, email, expiresInDays } = req.body;
    const rawToken = crypto.randomBytes(32).toString('hex');
    const tokenHash = crypto.createHash('sha256').update(rawToken).digest('hex');
    const days = Number(expiresInDays) || 7;

    const invite = await ReviewInvite.create({
      tokenHash,
      label: label?.trim() || undefined,
      email: email?.trim() || undefined,
      expiresAt: new Date(Date.now() + days * 24 * 60 * 60 * 1000),
      createdBy: req.adminId
    });

    const baseUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
    const shareUrl = `${baseUrl}/review/${rawToken}`;

    res.json({ shareUrl, expiresAt: invite.expiresAt });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getReviewInvite = async (req, res) => {
  try {
    const tokenHash = crypto.createHash('sha256').update(req.params.token).digest('hex');
    const invite = await ReviewInvite.findOne({
      tokenHash,
      expiresAt: { $gt: new Date() },
      usedAt: null
    });

    if (!invite) {
      return res.status(404).json({ message: 'Invite not found or expired' });
    }

    res.json({ label: invite.label, expiresAt: invite.expiresAt });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const submitReviewWithInvite = async (req, res) => {
  try {
    const { token, name, role, company, text, rating, avatar } = req.body;
    if (!token || !name || !role || !text) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const tokenHash = crypto.createHash('sha256').update(token).digest('hex');
    const invite = await ReviewInvite.findOne({
      tokenHash,
      expiresAt: { $gt: new Date() },
      usedAt: null
    });

    if (!invite) {
      return res.status(400).json({ message: 'Invite is invalid or expired' });
    }

    const normalizedRating = Math.min(5, Math.max(1, Number(rating || 5)));
    const review = await Review.create({
      name,
      role,
      company,
      text,
      rating: normalizedRating,
      avatar,
      status: 'pending'
    });

    invite.usedAt = new Date();
    await invite.save();

    res.status(201).json({ message: 'Review submitted', reviewId: review._id });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Certificates
export const getCertificates = async (req, res) => {
  try {
    const certificates = await Certificate.find().sort({ order: 1 });
    res.json(certificates);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createCertificate = async (req, res) => {
  try {
    const certificate = await Certificate.create(req.body);
    res.status(201).json(certificate);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const updateCertificate = async (req, res) => {
  try {
    const certificate = await Certificate.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(certificate);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const deleteCertificate = async (req, res) => {
  try {
    await Certificate.findByIdAndDelete(req.params.id);
    res.json({ message: 'Certificate deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Single Project
export const getProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ message: 'Project not found' });
    res.json(project);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Blog Posts
export const getBlogPosts = async (req, res) => {
  try {
    const posts = await BlogPost.find().sort({ order: 1 });
    res.json(posts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createBlogPost = async (req, res) => {
  try {
    const post = await BlogPost.create(req.body);
    res.status(201).json(post);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const updateBlogPost = async (req, res) => {
  try {
    const post = await BlogPost.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(post);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const getBlogPostBySlug = async (req, res) => {
  try {
    const post = await BlogPost.findOne({ slug: req.params.slug });
    if (!post) return res.status(404).json({ message: 'Blog post not found' });
    res.json(post);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteBlogPost = async (req, res) => {
  try {
    await BlogPost.findByIdAndDelete(req.params.id);
    res.json({ message: 'Blog post deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Services
export const getServices = async (req, res) => {
  try {
    const services = await Service.find().sort({ order: 1 });
    res.json(services);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createService = async (req, res) => {
  try {
    const service = await Service.create(req.body);
    res.status(201).json(service);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const updateService = async (req, res) => {
  try {
    const service = await Service.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(service);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const deleteService = async (req, res) => {
  try {
    await Service.findByIdAndDelete(req.params.id);
    res.json({ message: 'Service deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Timeline
export const getTimelineEntries = async (req, res) => {
  try {
    const entries = await TimelineEntry.find().sort({ order: 1 });
    res.json(entries);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createTimelineEntry = async (req, res) => {
  try {
    const entry = await TimelineEntry.create(req.body);
    res.status(201).json(entry);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const updateTimelineEntry = async (req, res) => {
  try {
    const entry = await TimelineEntry.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(entry);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const deleteTimelineEntry = async (req, res) => {
  try {
    await TimelineEntry.findByIdAndDelete(req.params.id);
    res.json({ message: 'Timeline entry deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
