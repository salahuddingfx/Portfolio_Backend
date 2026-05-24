# 🧠 Salahuddin's Portfolio — Backend REST API Engine

This is the Express.js REST API server that powers the backend of the portfolio. It manages MongoDB database storage, admin session authentications, blog posts CRUD, projects listing, dynamic visitor traffic tracking, client reviews, and direct SMTP contact form mailers.

---

## ⚡ Core Features

- **🔒 Admin Authentication:** Secure JWT-based route protection with hashed passwords using `bcryptjs`.
- **📂 Media Pipelines:** Direct Cloudinary storage interface integrated with `Multer` for secure, lightning-fast dashboard image uploads.
- **🚀 Advanced Security:** Integrated IP rate-limiting (`express-rate-limit`) to defend APIs against spam and malicious bots.
- **📧 Automated Mailer:** Integrated SMTP gateway utilizing `Nodemailer` for immediate contact form routing.
- **📊 Traffic Logging:** Custom database analytics tracking site hits, geo-visits, and user-agent details.
- **🛠️ Automated Database Seeding:** Integrated seed scripts for projects (StudyFlow, SalahUddin OS, Aether 3D Engine, NoteSphere, Memory Master, Habit-OS) and professional timeline journey checkpoints.

---

## 🛠️ The Tech Stack

- **Runtime Environment:** `Node.js` with `Express 5` (type: module ES6)
- **Database System:** `MongoDB` utilizing `Mongoose 9` schemas
- **Security & Session:** `JSONWebTokens` + `Bcrypt.js` + `Express Rate Limit`
- **Asset Upload Pipelines:** `Cloudinary` + `Multer` + `Multer Storage Cloudinary`
- **Mailers:** `Nodemailer` (SMTP configuration)
- **Development & Logging:** `Nodemon`, `Morgan` API requests tracer, `Chalk` console colorizer

---

## 🚀 Getting Started

### Installation
```bash
# Clone and install dependencies
npm install
```

### Environment Settings
Create a `.env` file in the root of the `backend` folder:
```env
PORT=5000
MONGO_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_jwt_signing_token
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
EMAIL_USER=your_smtp_sender_email@gmail.com
EMAIL_PASS=your_smtp_sender_app_password
ADMIN_EMAIL=salahuddin_receive_email@example.com
```

### Database Seeding
Execute the seeders to populate your collections:
```bash
# Seed basic site contents (Projects, Blog, Reviews, Services, Admin User)
npm run seed

# Seed Professional Journey Timeline checkpoints
node seedTimeline.js
```

### Running Server
```bash
# Run in development mode (with Nodemon hot reloading)
npm run dev

# Run in production mode
npm start
```

---

## 📂 Project Architecture

```
backend/
├── config/             # Cloudinary, database connectors, and app configurations
├── controllers/        # Route controllers containing business logic
├── middleware/         # Security validation and JWT token verification layers
├── models/             # Mongoose database schemas (Admin, Projects, Visitor, etc.)
├── routes/             # Express API routing tables
├── utils/              # Helper utilities (Nodemailer gateways, controllers, etc.)
├── seed.js             # Data seeder for core items (Projects, Reviews, Services)
└── seedTimeline.js     # Professional timeline seeder
```

---

## 🔌 API Route Map

### Public API Endpoints
- **POST** `/api/login` - Authenticates admin and returns JWT
- **POST** `/api/contact` - Accepts contact form details and dispatches email
- **POST** `/api/log-visit` - Registers a page view for dashboard traffic charts
- **GET** `/api/blog-posts` - Lists all blog articles
- **GET** `/api/blog-posts/slug/:slug` - Fetches single article by slug
- **GET** `/api/projects` - Retrieves seeded projects list
- **GET** `/api/reviews` - Lists client reviews & testimonials
- **GET** `/api/services` - Fetches active service listings
- **GET** `/api/timeline` - Retrieves professional milestones

### Protected Admin Endpoints (Requires `Authorization: Bearer <Token>`)
- **GET/PUT** `/api/settings` - Modifies core metadata, avatars, and socials
- **POST/PUT/DELETE** `/api/projects` - Manage projects in portfolio database
- **POST/PUT/DELETE** `/api/reviews` - Manage client testimonials
- **POST/PUT/DELETE** `/api/certificates` - Manage certificates list
- **POST/PUT/DELETE** `/api/blog-posts` - Admin blog control panel
- **GET** `/api/analytics` - Fetches traffic statistics, visits count, and metrics
- **POST** `/api/upload` - Uploads project/blog thumbnail to Cloudinary

---

## 📜 Custom License

This backend codebase is protected under the **Creative Practice License (CPL)**.
- Cloned copies may only be run and modified locally **for educational and personal practice purposes**.
- Hosting or deploying this backend API to run a production website or portfolio for commercial use or copying the structure to claim authorship is forbidden.

See full terms in the [LICENSE](LICENSE) file.
