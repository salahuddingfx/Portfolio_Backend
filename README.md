# Salahuddin's Portfolio — Backend API

Express.js REST API server for the portfolio. Handles blog posts, projects, reviews, services, certificates, visitor tracking, and contact form submissions.

## Tech Stack

- **Runtime:** Node.js (Express 5)
- **Database:** MongoDB (Mongoose 9)
- **Auth:** JWT + bcryptjs
- **File Upload:** Cloudinary + Multer
- **Email:** Nodemailer (Gmail SMTP)
- **Logging:** Morgan + Chalk

## Getting Started

```bash
npm install
```

Create a `.env` file:

```env
PORT=5000
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
ADMIN_EMAIL=admin@example.com
```

```bash
npm run dev
```

## API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/login` | Admin login |
| POST | `/api/contact` | Contact form submission |
| POST | `/api/log-visit` | Visitor tracking |
| GET/PUT | `/api/settings` | Site settings |
| CRUD | `/api/projects` | Projects |
| CRUD | `/api/reviews` | Client reviews |
| CRUD | `/api/certificates` | Certificates |
| CRUD | `/api/blog-posts` | Blog posts |
| GET | `/api/blog-posts/slug/:slug` | Single post by slug |
| CRUD | `/api/services` | Services |
| CRUD | `/api/timeline` | Timeline entries |
| GET | `/api/analytics` | Analytics (protected) |
| POST | `/api/upload` | Image upload (protected) |

## Models

Admin, BlogPost, Certificate, Project, Review, Service, Settings, TimelineEntry, Visitor

## License

MIT — see [LICENSE](LICENSE).
