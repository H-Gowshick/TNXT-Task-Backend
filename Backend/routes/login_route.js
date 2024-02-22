// routes/login_route.js

const express = require('express');
const router = express.Router();
const Admin = require('../models/Admin_model');

// Route to handle admin login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    // Find admin by email
    const admin = await Admin.findOne({ email });
    if (!admin) {
      return res.status(404).json({ message: 'Admin not found' });
    }
    // Check password
    if (admin.password !== password) {
      return res.status(401).json({ message: 'Invalid password' });
    }
    // Admin authenticated successfully
    res.status(200).json({ message: 'Admin authenticated successfully' });
  } catch (error) {
    console.error('Error logging in admin:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
