import Project from '../models/Project.js';
import Review from '../models/Review.js';
import Admin from '../models/Admin.js';
import Settings from '../models/Settings.js';
import Visitor from '../models/Visitor.js';
import jwt from 'jsonwebtoken';
import axios from 'axios';

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
    const settings = await Settings.findOneAndUpdate({}, req.body, { new: true, upsert: true });
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
    const reviews = await Review.find().sort({ order: 1 });
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
