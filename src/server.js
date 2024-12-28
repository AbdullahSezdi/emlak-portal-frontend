const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const path = require('path');
require('dotenv').config();

const sequelize = require('./config/database');
const authRoutes = require('./routes/authRoutes');
const propertyRoutes = require('./routes/propertyRoutes');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Database connection
console.log('Attempting to connect to PostgreSQL...');
sequelize.authenticate()
  .then(() => {
    console.log('Successfully connected to PostgreSQL');
    return sequelize.sync({ alter: true });
  })
  .then(() => {
    console.log('Database synchronized');
  })
  .catch(err => {
    console.error('PostgreSQL connection error:', err.message);
  });

// Routes
app.use('/api/auth', authRoutes);
app.use('/api', propertyRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 