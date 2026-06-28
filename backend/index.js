const express = require('express');
require('dotenv').config();
const cors = require('cors');
const cookieParser = require('cookie-parser');
const rateLimit = require('express-rate-limit');
const redisClient = require('./src/config/redisClient');
const connectDB = require('./src/config/db');

// Routes 
const authRoutes = require('./src/routes/authRoutes');
const workRoutes = require('./src/routes/workRoutes');
const projectRoutes = require('./src/routes/projectRoutes');
const blogRoutes = require('./src/routes/blogRoutes');

const app = express();
const PORT = process.env.PORT;

// Middleware
app.use(cors({
  origin: process.env.CORS_ORIGIN,
  credentials: true, // allows cookies/headers to be sent back and forth
}));
app.use(express.json());
app.use(cookieParser());

// Global Rate Limiting
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  limit: 100, // Limit each IP to 100 requests per `window`
  standardHeaders: true, 
  legacyHeaders: false,
  message: { message: "Too many requests from this IP, please try again later." }
});
app.use(globalLimiter);

// Routes
app.use('/user', authRoutes);
app.use('/work', workRoutes);
app.use('/project', projectRoutes);
app.use('/blog', blogRoutes);

async function main() {
  try {
    console.log('Starting backend initialization...');

    // 1. Database Connection (MongoDB)
    await connectDB();

    // 2. Redis Connection
    await redisClient.ping();
    console.log('Redis Connected successfully');

    // 3. Start Port Listening
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });

    app.get('/', (req, res) => {
      res.send('Backend API is running...');
    });

  } catch (error) {
    console.error('Backend initialization failed:', error);
    process.exit(1);
  }
}

main();
