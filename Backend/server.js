require('dotenv').config(); // MUST BE AT THE VERY TOP

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const authRoutes = require('./routes/auth');

const app = express();

app.set('trust proxy', 1);
app.use(cors());
app.use(express.json());

// Fallback to hardcoded string if .env fails to load, preventing crashes during testing
const mongoURI = process.env.MONGO_URI;

// MongoDB connection
mongoose.connect(mongoURI)
  .then(() => console.log('MongoDB Connected Successfully!'))
  .catch(err => console.error('MongoDB Connection Error:', err));

// Routes
app.use('/api/auth', authRoutes);

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));