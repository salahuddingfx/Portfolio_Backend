import express from 'express';
import * as adminController from '../controllers/admin.controller.js';
import authMiddleware from '../middleware/auth.middleware.js';
import upload from '../middleware/upload.middleware.js';
import { sendContactEmails } from '../utils/mail.js';

const router = express.Router();

// Public routes (for testing or initial login)
router.post('/login', adminController.login);

router.post('/contact', async (req, res) => {
  try {
    await sendContactEmails(req.body);
    res.json({ message: 'Message sent successfully' });
  } catch (error) {
    console.error('Email error:', error);
    res.status(500).json({ message: 'Failed to send message' });
  }
});

router.post('/log-visit', adminController.logVisit);

// Protected routes
router.get('/analytics', authMiddleware, adminController.getAnalytics);
router.get('/visitors', authMiddleware, adminController.getRecentVisitors);
router.post('/upload', authMiddleware, upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No file uploaded' });
  }
  res.json({ url: req.file.path });
});

router.get('/projects', adminController.getProjects);
router.get('/projects/:id', adminController.getProject);
router.post('/projects', authMiddleware, adminController.createProject);
router.put('/projects/:id', authMiddleware, adminController.updateProject);
router.delete('/projects/:id', authMiddleware, adminController.deleteProject);

router.get('/reviews', adminController.getReviews);
router.post('/reviews', authMiddleware, adminController.createReview);
router.put('/reviews/:id', authMiddleware, adminController.updateReview);
router.delete('/reviews/:id', authMiddleware, adminController.deleteReview);

router.get('/certificates', adminController.getCertificates);
router.post('/certificates', authMiddleware, adminController.createCertificate);
router.put('/certificates/:id', authMiddleware, adminController.updateCertificate);
router.delete('/certificates/:id', authMiddleware, adminController.deleteCertificate);
router.get('/blog-posts', adminController.getBlogPosts);
router.get('/blog-posts/slug/:slug', adminController.getBlogPostBySlug);
router.post('/blog-posts', authMiddleware, adminController.createBlogPost);
router.put('/blog-posts/:id', authMiddleware, adminController.updateBlogPost);
router.delete('/blog-posts/:id', authMiddleware, adminController.deleteBlogPost);
router.get('/services', adminController.getServices);
router.post('/services', authMiddleware, adminController.createService);
router.put('/services/:id', authMiddleware, adminController.updateService);
router.delete('/services/:id', authMiddleware, adminController.deleteService);
router.get('/timeline', adminController.getTimelineEntries);
router.post('/timeline', authMiddleware, adminController.createTimelineEntry);
router.put('/timeline/:id', authMiddleware, adminController.updateTimelineEntry);
router.delete('/timeline/:id', authMiddleware, adminController.deleteTimelineEntry);
router.get('/settings', adminController.getSettings);
router.put('/settings', authMiddleware, adminController.updateSettings);

export default router;
