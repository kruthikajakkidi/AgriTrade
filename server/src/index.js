import express from 'express';
import cors from 'cors';
import apiRoutes from './routes/api.js';

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
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
    endpoints: '/api/health, /api/lots, /api/orders, /api/warehouse, /api/shipments, /api/analytics'
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
  console.log(`
  =============================================================
  🌾 AgriTrade Server Running Successfully!
  🚀 Port: http://localhost:${PORT}
  📡 API Health: http://localhost:${PORT}/api/health
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
