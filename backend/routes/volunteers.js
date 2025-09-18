const express = require("express");
const router = express.Router();
const { verifyToken } = require("../middleware/authMiddleware"); // Correct Import
const Volunteer = require("../models/Volunteer");

// Create a new volunteer profile
router.post("/", verifyToken, async (req, res) => {
  try {
    const { name, skills, availability } = req.body;
    const userId = req.user._id; // Extract from authenticated user

    const volunteer = new Volunteer({ userId, name, skills, availability });
    await volunteer.save();
    
    res.status(201).json(volunteer);
  } catch (err) {
    console.error("Error creating volunteer profile:", err);
    res.status(500).json({ error: "Error creating volunteer profile" });
  }
});

//  Get all volunteer profiles for the authenticated user
router.get("/user/:userId", verifyToken, async (req, res) => {
  try {
    const { userId } = req.params;
    
    if (req.user._id.toString() !== userId) {
      return res.status(403).json({ message: "Unauthorized access" });
    }

    const volunteers = await Volunteer.find({ userId });

    if (!volunteers.length) {
      return res.status(404).json({ message: "No volunteer profiles found" });
    }

    res.status(200).json(volunteers);
  } catch (err) {
    console.error("Error fetching volunteer profiles:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Update a specific volunteer profile
router.put("/:volunteerId", verifyToken, async (req, res) => {
  try {
    const volunteer = await Volunteer.findById(req.params.volunteerId);

    if (!volunteer) {
      return res.status(404).json({ message: "Volunteer profile not found" });
    }

    if (volunteer.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Unauthorized access" });
    }

    const updatedProfile = await Volunteer.findByIdAndUpdate(
      req.params.volunteerId,
      req.body,
      { new: true }
    );

    res.json(updatedProfile);
  } catch (err) {
    console.error("Error updating volunteer profile:", err);
    res.status(500).json({ error: "Error updating volunteer profile" });
  }
});

// Delete a volunteer profile
router.delete("/:volunteerId", verifyToken, async (req, res) => {
  try {
    const volunteer = await Volunteer.findById(req.params.volunteerId);

    if (!volunteer) {
      return res.status(404).json({ message: "Volunteer profile not found" });
    }

    if (volunteer.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Unauthorized access" });
    }

    await Volunteer.findByIdAndDelete(req.params.volunteerId);
    res.json({ message: "Volunteer profile deleted" });
  } catch (err) {
    console.error("Error deleting volunteer profile:", err);
    res.status(500).json({ error: "Error deleting volunteer profile" });
  }
});

module.exports = router;
