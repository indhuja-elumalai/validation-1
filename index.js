const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const dotenv = require('dotenv');
const User = require('./models/User');

dotenv.config(); // Load env variables

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URL)
.then(() => console.log('✅ MongoDB connected'))
.catch((err) => console.log('❌ DB Connection Error:', err));

// Registration Endpoint
app.post('/register', (req, res) => {
  const { username, email, password } = req.body;

  // Basic field validation
  if (!username || !email || !password) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  // Hash password
  bcrypt.hash(password, 10)
    .then((hashedPassword) => {
      const newUser = new User({
        username,
        email,
        password: hashedPassword
      });

      newUser.save()
        .then(() => {
          res.status(201).json({ message: 'Registration successful' });
        })
        .catch((err) => {
          console.error(err);
          res.status(500).json({ message: 'Database save error' });
        });
    })
    .catch((err) => {
      console.error(err);
      res.status(500).json({ message: 'Password hashing failed' });
    });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
