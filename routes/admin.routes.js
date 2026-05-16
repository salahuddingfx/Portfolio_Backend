const express = require('express');
const router = express.Router();
const adminController = require('../controllers/admin.controller');
const authMiddleware = require('../middleware/auth.middleware');
const upload = require('../middleware/upload.middleware');

const { sendContactEmails } = require('../utils/mail');

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

// Protected routes
router.post('/upload', authMiddleware, upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No file uploaded' });
  }
  res.json({ url: req.file.path });
});
router.get('/projects', adminController.getProjects);
router.post('/projects', authMiddleware, adminController.createProject);
router.put('/projects/:id', authMiddleware, adminController.updateProject);
router.delete('/projects/:id', authMiddleware, adminController.deleteProject);

router.get('/reviews', adminController.getReviews);
router.post('/reviews', authMiddleware, adminController.createReview);
router.put('/reviews/:id', authMiddleware, adminController.updateReview);
router.delete('/reviews/:id', authMiddleware, adminController.deleteReview);

module.exports = router;
