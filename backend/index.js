const express = require('express');
const connectDB = require('./config/db');
const dotenv = require('dotenv');
const cors = require('cors'); // Ensure this line is present

dotenv.config();
connectDB();

const app = express();
app.use(express.json()); // Parse JSON bodies
app.use(cors()); // Enable CORS for all routes

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/tasks', require('./routes/tasks'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));