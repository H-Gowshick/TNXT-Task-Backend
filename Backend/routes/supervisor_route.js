// routes/supervisor_route.js

const express = require("express");
const router = express.Router();
const Supervisor = require("../models/Supervisor_model");

// Route to get the count of supervisor accounts for a specific admin email
router.get("/count", async (req, res) => {
  try {
    const adminEmail = req.query.adminEmail;
    // Find all supervisors with the specified admin email
    const count = await Supervisor.countDocuments({ adminEmail });
    res.json({ count });
  } catch (error) {
    console.error("Error fetching supervisor count:", error);
    res.status(500).json({ message: "Server error" });
  }
});

router.post("/create", async (req, res) => {
  try {
    const { adminEmail, supervisorEmail, supervisorPassword } = req.body;

    // Check if the supervisor account already exists
    const existingSupervisor = await Supervisor.findOne({ supervisorEmail });
    if (existingSupervisor) {
      return res
        .status(400)
        .json({ message: "Supervisor account already exists" });
    }

    // Create a new supervisor instance
    const newSupervisor = new Supervisor({
      adminEmail,
      supervisorEmail,
      supervisorPassword,
    });

    // Save the new supervisor to the database
    await newSupervisor.save();

    res
      .status(201)
      .json({ message: "Supervisor account created successfully" });
  } catch (error) {
    console.error("Error creating supervisor account:", error);
    res.status(500).json({ message: "Server error" });
  }
});

router.get("/view", async (req, res) => {
  try {
    const { adminEmail } = req.query;

    // Find supervisor accounts associated with admin's email
    const supervisorAccounts = await Supervisor.find({ adminEmail });

    res.status(200).json(supervisorAccounts);
  } catch (error) {
    console.error("Error fetching supervisor accounts:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Route to handle supervisor login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    // Find supervisor by email
    const supervisor = await Supervisor.findOne({ supervisorEmail: email });
    if (!supervisor) {
      return res.status(404).json({ message: "Supervisor not found" });
    }
    // Check password
    if (supervisor.supervisorPassword !== password) {
      return res.status(401).json({ message: "Invalid password" });
    }
    // Supervisor authenticated successfully
    res.status(200).json({ message: "Supervisor authenticated successfully" });
  } catch (error) {
    console.error("Error logging in supervisor:", error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
