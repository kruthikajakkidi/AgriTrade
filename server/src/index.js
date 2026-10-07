import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dns from 'dns';
import apiRoutes from './routes/api.js';

// Ensure reliable DNS resolution for MongoDB Atlas SRV connection strings
try {
  dns.setServers(['8.8.8.8', '1.1.1.1']);
} catch (dnsErr) {
  // Use default OS resolver
}

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB Atlas (if URI provided)
const mongoURI = process.env.MONGODB_URI;
if (mongoURI && (process.env.USE_MONGODB === 'true' || process.env.USE_MONGODB === undefined)) {
  mongoose.connect(mongoURI, {
    dbName: 'AgriTrade',
    serverSelectionTimeoutMS: 6000
  })
  .then(() => {
    console.log('  🍃 MongoDB Atlas: Connected successfully to AgriTrade cluster');
  })
  .catch((err) => {
    console.warn(`  ⚠️ MongoDB Atlas connection notice: ${err.message}`);
    console.log('  📦 Resilient Dual-Engine: Local DataStore remains active');
  });
}

// Middleware - Enhanced CORS to support deployed domain, production frontends & local dev
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:3000',
  'http://localhost:4173',
  'https://agritrade-5oq3.onrender.com',
  process.env.CLIENT_URL
].filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    // Allow non-browser requests (mobile apps, server-to-server, curl)
    if (!origin) return callback(null, true);
    if (
      allowedOrigins.includes(origin) ||
      origin.endsWith('.onrender.com') ||
      origin.endsWith('.vercel.app') ||
      origin.endsWith('.netlify.app') ||
      origin.includes('localhost')
    ) {
      return callback(null, true);
    }
    return callback(null, true);
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Request logger
app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    if (process.env.NODE_ENV !== 'test') {
      console.log(`[API] ${req.method} ${req.originalUrl} - ${res.statusCode} (${duration}ms)`);
    }
  });
  next();
});

// Mount Routes
app.use('/api', apiRoutes);

// Root greeting
app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to AgriTrade Core API',
    description: 'Farm Produce Procurement & Supply Chain Management Platform',
    status: 'online',
    database: mongoose.connection.readyState === 1 ? 'MongoDB Atlas (Connected)' : 'Local Resilient DataStore',
    endpoints: '/api/health, /api/lots, /api/orders, /api/warehouse, /api/shipments, /api/upload'
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: `API endpoint '${req.originalUrl}' not found.` });
});

// Centralized error handler
app.use((err, req, res, next) => {
  console.error('🔥 Server Error:', err);
  res.status(err.status || 500).json({
    error: err.message || 'Internal Server Error',
    stack: process.env.NODE_ENV === 'production' ? undefined : err.stack
  });
});

// Start listening
const server = app.listen(PORT, () => {
  const isCloudinaryActive = Boolean(
    (process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_CLOUD_NAME !== 'your_cloudinary_cloud_name') ||
    process.env.CLOUDINARY_URL
  );

  console.log(`
  =============================================================
  🌾 AgriTrade Server Running Successfully!
  🚀 Port: http://localhost:${PORT}
  📡 API Health: http://localhost:${PORT}/api/health
  ☁️ Cloudinary Uploads: ${isCloudinaryActive ? 'Configured (' + (process.env.CLOUDINARY_CLOUD_NAME || 'URL') + ')' : 'Ready (Offline Fallback Active)'}
  🏬 Supply Chain State Machine: Active
  =============================================================
  `);
});

server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`\n❌ Error: Port ${PORT} is already in use by another process.`);
    console.error(`👉 Run: Stop-Process -Name "node" -Force   (PowerShell)`);
    console.error(`👉 Or kill the process using port ${PORT} before restarting.\n`);
    process.exit(1);
  } else {
    console.error('🔥 Server Error:', err);
    process.exit(1);
  }
});

export default app;
