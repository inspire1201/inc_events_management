require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const db = require('./config/db'); // Import database connection
require('./config/cloudinary'); // Initialize Cloudinary configuration

const authRoutes = require('./routes/authRoutes');
const eventRoutes = require('./routes/eventRoutes');

const app = express();

const allowedOrigins = [
  'http://44.197.21.241',        // ✅ your live frontend via NGINX
  'http://44.197.21.241:3000',   // dev frontend (optional)
  'http://localhost:3000',       // local dev
  'http://172.31.86.89:3000'     // internal EC2 IP (optional)
];

// ✅ CORS config
const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.error('❌ Blocked by CORS:', origin);
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
};

// ✅ Apply CORS before routes
app.use(cors(corsOptions));



// ✅ Parse incoming JSON requests
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ Serve uploaded files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ✅ API routes
app.use('/api', authRoutes);
app.use('/api', eventRoutes);

// ✅ Test route
app.get('/', (req, res) => {
  res.send('API is working!');
});

// ✅ Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
