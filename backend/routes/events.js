const express = require("express");
const router = express.Router();
const Event = require("../models/Event");
const { verifyToken, verifyAdmin } = require("../middleware/authMiddleware");



// Create an event (Admins only)
router.post("/", verifyToken, verifyAdmin, async (req, res) => {
  try {
    console.log("Received request to create event:", req.body);
    const { title, description, date, location, requiredVolunteers } = req.body;
    const organizer = req.user._id; 

    if (!title || !description || !date || !location || !requiredVolunteers) {
      return res.status(400).json({ error: "All fields are required" });
    }


    const newEvent = new Event({
      title,
      description,
      date,
      location,
      requiredVolunteers,
      organizer,
    });
    await newEvent.save();
    res.status(201).json(newEvent);
  } catch (err) {
    res.status(500).json({ error: "Error creating event" });
  }
});

// Get all events
// router.get("/", verifyToken, async (req, res) => {
//   try {
//       const events = await Event.find();
//       res.json(events);
//   } catch (error) {
//       res.status(500).json({ error: "Error fetching events" });
//   }
// });


// Get a single event by ID
router.get("/:id", async (req, res) => {
  try {
    const event = await Event.findById(req.params.id).populate("organizer", "name email");
    if (!event) return res.status(404).json({ error: "Event not found" });
    res.json(event);
  } catch (err) {
    res.status(500).json({ error: "Error fetching event" });
  }
});

//Update an event (Admins only)
router.put("/:id", verifyToken, verifyAdmin, async (req, res) => {
  try {
      const { title, description, date, location, requiredVolunteers } = req.body;
      const updatedEvent = await Event.findByIdAndUpdate(req.params.id, { title, description, date, location, requiredVolunteers }, { new: true });
      res.json({ message: "Event updated successfully", event: updatedEvent });
  } catch (error) {
      res.status(500).json({ error: "Error updating event" });
  }
});

// Register a volunteer for an event
router.post("/:eventId/register", verifyToken, async (req, res) => {
  try {
    const { volunteerId } = req.body;
    if (!volunteerId) return res.status(400).json({ message: "Volunteer ID is required" });

    const event = await Event.findById(req.params.eventId);
    if (!event) return res.status(404).json({ message: "Event not found" });

    if (!event.registeredVolunteers.includes(volunteerId)) {
      event.registeredVolunteers.push(volunteerId);
      await event.save();
    }

    const updatedEvent = await Event.findById(req.params.eventId)
      .populate("registeredVolunteers", "name skills");

    res.json({ message: "Registered successfully", event });
  } catch (err) {
    res.status(500).json({ error: "Error registering for event" });
  }
});



// Fetch all events (populate organizer details)
router.get("/", verifyToken, async (req, res) => {
  try {
    const events = await Event.find()
      .populate("organizer", "name role")
      .populate({
        path: "registeredVolunteers",
        select: "name skills",
      });

    // Check if the user is an admin
    if (req.user.role === "admin") {
      console.log("Admin fetching events with volunteers:", events);
      return res.json(events); // Admin gets full event details
    }

    // For regular users, exclude registeredVolunteers
    const filteredEvents = events.map(event => ({
      _id: event._id,
      title: event.title,
      description: event.description,
      date: event.date,
      location: event.location,
      organizer: event.organizer.name,
    }));

    console.log("User fetching events (without volunteers):", filteredEvents);
    res.json(filteredEvents);
  } catch (error) {
    console.error("Error fetching events:", error);
    res.status(500).json({ error: "Failed to fetch events" });
  }
});




// Delete an event
router.delete("/:id", verifyToken, verifyAdmin, async (req, res) => {
  try {
      await Event.findByIdAndDelete(req.params.id);
      res.json({ message: "Event deleted successfully" });
  } catch (error) {
      res.status(500).json({ error: "Error deleting event" });
  }
});

router.get("/current", verifyToken, async (req, res) => {
  try {
      const events = await Event.find({ date: { $gte: new Date() } }).sort("date");
      res.json(events);
  } catch (error) {
      res.status(500).json({ error: "Failed to fetch events" });
  }
});

module.exports = router;
