import 'dotenv/config';
import express from 'express';
import morgan from 'morgan';
import connectDB from './config/db.js';
import adminRoutes from './routes/admin.routes.js';
import { startupSequence } from './utils/logger.js';

const app = express();

// Trust the first proxy (Render load balancer) for accurate rate limiting and client IP extraction
app.set('trust proxy', 1);

// Connect to Database
connectDB();

// Manual CORS middleware (Express 5 compatible — replaces cors package)
const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:3001',
  'http://localhost:5173',
  'https://salahuddin.codes',
  'https://admin.salahuddin.codes',
  process.env.FRONTEND_URL,
  process.env.ADMIN_URL
].filter(Boolean);

app.use((req, res, next) => {
  const origin = req.headers.origin;
  if (!origin || allowedOrigins.includes(origin)) {
    if (origin) res.setHeader('Access-Control-Allow-Origin', origin);
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.setHeader('Access-Control-Max-Age', '86400');
  }
  if (req.method === 'OPTIONS') {
    return res.sendStatus(204);
  }
  next();
});

app.use(express.json());
app.use(morgan('dev'));

// Routes
app.use('/api/admin', adminRoutes);

app.get('/', (req, res) => {
  res.send('API is running...');
});

// Global error handler — ensures CORS headers are always present even on500s
app.use((err, req, res, next) => {
  const origin = req.headers.origin;
  if (!origin || allowedOrigins.includes(origin)) {
    if (origin) res.setHeader('Access-Control-Allow-Origin', origin);
    res.setHeader('Access-Control-Allow-Credentials', 'true');
  }
  console.error('Unhandled error:', err);
  res.status(500).json({ message: err.message || 'Internal Server Error' });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, async () => {
  await startupSequence(PORT);
});
