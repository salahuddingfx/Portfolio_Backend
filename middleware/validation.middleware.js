// Regex for basic email format validation
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Predefined allowed inquiry subjects
const ALLOWED_SUBJECTS = [
  "Web Development",
  "UI/UX Design",
  "Full Stack Application",
  "Other Collaboration",
];

// Helper to check if value is a valid HTTP/HTTPS URL
const isValidUrl = (str) => {
  if (!str) return true; // Optional field
  try {
    const url = new URL(str);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch (_) {
    return false;
  }
};

// 1. Validation for Contact Form Submission
export const validateContact = (req, res, next) => {
  const errors = {};
  const { name, email, subject, message } = req.body;

  // Validate Name
  if (!name || typeof name !== 'string' || !name.trim()) {
    errors.name = 'Name is required.';
  } else if (name.trim().length < 2) {
    errors.name = 'Name must be at least 2 characters long.';
  } else if (name.trim().length > 100) {
    errors.name = 'Name cannot exceed 100 characters.';
  }

  // Validate Email
  if (!email || typeof email !== 'string' || !email.trim()) {
    errors.email = 'Email is required.';
  } else if (!emailRegex.test(email.trim())) {
    errors.email = 'Please provide a valid email address.';
  }

  // Validate Subject
  if (!subject || typeof subject !== 'string' || !subject.trim()) {
    errors.subject = 'Subject is required.';
  } else if (!ALLOWED_SUBJECTS.includes(subject.trim())) {
    errors.subject = 'Please select a valid subject from the list.';
  }

  // Validate Message
  if (!message || typeof message !== 'string' || !message.trim()) {
    errors.message = 'Message is required.';
  } else if (message.trim().length < 10) {
    errors.message = 'Message must be at least 10 characters long.';
  } else if (message.trim().length > 5000) {
    errors.message = 'Message cannot exceed 5000 characters.';
  }

  // If there are errors, return 400 Bad Request
  if (Object.keys(errors).length > 0) {
    return res.status(400).json({
      message: 'Validation failed.',
      errors
    });
  }

  // Sanitize values
  req.body.name = name.trim();
  req.body.email = email.trim();
  req.body.subject = subject.trim();
  req.body.message = message.trim();

  next();
};

// 2. Validation for Testimonial Submission
export const validateReviewSubmit = (req, res, next) => {
  const errors = {};
  const { token, name, role, company, text, rating, avatar } = req.body;

  // Validate Token
  if (!token || typeof token !== 'string' || !token.trim()) {
    errors.token = 'Invite token is required.';
  }

  // Validate Name
  if (!name || typeof name !== 'string' || !name.trim()) {
    errors.name = 'Your name is required.';
  } else if (name.trim().length < 2) {
    errors.name = 'Name must be at least 2 characters long.';
  } else if (name.trim().length > 100) {
    errors.name = 'Name cannot exceed 100 characters.';
  }

  // Validate Role
  if (!role || typeof role !== 'string' || !role.trim()) {
    errors.role = 'Your role/position is required.';
  } else if (role.trim().length < 2) {
    errors.role = 'Role must be at least 2 characters long.';
  } else if (role.trim().length > 100) {
    errors.role = 'Role cannot exceed 100 characters.';
  }

  // Validate Company
  if (company && (typeof company !== 'string' || company.trim().length > 100)) {
    errors.company = 'Company name cannot exceed 100 characters.';
  }

  // Validate Review Text
  if (!text || typeof text !== 'string' || !text.trim()) {
    errors.text = 'Review content is required.';
  } else if (text.trim().length < 10) {
    errors.text = 'Review must be at least 10 characters long.';
  } else if (text.trim().length > 2000) {
    errors.text = 'Review cannot exceed 2000 characters.';
  }

  // Validate Rating
  const numRating = Number(rating);
  if (rating === undefined || isNaN(numRating) || !Number.isInteger(numRating) || numRating < 1 || numRating > 5) {
    errors.rating = 'Rating must be an integer between 1 and 5.';
  }

  // Validate Avatar URL
  if (avatar && avatar.trim() && !isValidUrl(avatar.trim())) {
    errors.avatar = 'Please provide a valid avatar image URL.';
  }

  // If there are errors, return 400 Bad Request
  if (Object.keys(errors).length > 0) {
    return res.status(400).json({
      message: 'Validation failed.',
      errors
    });
  }

  // Sanitize values
  req.body.name = name.trim();
  req.body.role = role.trim();
  req.body.company = company ? company.trim() : undefined;
  req.body.text = text.trim();
  req.body.rating = numRating;
  req.body.avatar = avatar && avatar.trim() ? avatar.trim() : undefined;

  next();
};
