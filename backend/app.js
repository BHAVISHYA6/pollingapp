require('dotenv').config();

const express = require('express');
const cors = require('cors');
const app = express();

// Middleware - ADD port 3001
app.use(cors({
  origin: [
    'http://localhost:3000', 
    'http://localhost:3001',  // ← ADD THIS
    'https://main.dxbdkx306r9tq.amplifyapp.com'
  ],
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization', 'x-auth-token'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
}));

app.use(express.json());

// Routes
app.use('/api/polls', require('./routes/polls'));
app.use('/api/auth', require('./routes/auth'));

// Default route (only for "/")
app.get('/', (req, res) => {
  res.send('Hello World!');
});

module.exports = app;