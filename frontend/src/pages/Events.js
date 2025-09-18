import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Events.css";

const Events = () => {
  const [events, setEvents] = useState([]);
  const [volunteers, setVolunteers] = useState([]);
  const [selectedVolunteers, setSelectedVolunteers] = useState({}); // Store per event

  useEffect(() => {
    const userId = localStorage.getItem("userId");
    const token = localStorage.getItem("token");

    if (!userId || !token) {
      console.error("User ID or token missing from localStorage!");
      return;
    }

    // Fetch Events
    axios
      .get("http://localhost:5000/api/events", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => setEvents(response.data))
      .catch((error) => console.error("Error fetching events:", error));

    // Fetch Volunteer Profiles
    axios
      .get(`http://localhost:5000/api/volunteers/user/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => setVolunteers(response.data))
      .catch((error) => console.error("Error fetching volunteers:", error));
  }, []);

  const handleSelectVolunteer = (eventId, volunteerId) => {
    setSelectedVolunteers((prev) => ({
      ...prev,
      [eventId]: volunteerId, // Associate selected volunteer with a specific event
    }));
  };

  const handleRegister = async (eventId) => {
    const selectedVolunteer = selectedVolunteers[eventId];

    if (!selectedVolunteer) {
      alert("Please select a volunteer before registering.");
      return;
    }

    try {
      await axios.post(
        `http://localhost:5000/api/events/${eventId}/register`,
        { volunteerId: selectedVolunteer },
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
      );

      alert("Successfully registered!");

      // Update local event list
      setEvents((prevEvents) =>
        prevEvents.map((event) => ({
          ...event,
          registeredVolunteers: Array.isArray(event.registeredVolunteers) ? event.registeredVolunteers : [], // ✅ Ensure array
        }))
      );
      
    } catch (error) {
      console.error("Error registering:", error);
      alert("Failed to register for the event.");
    }
  };

  return (
    <div className="events-container">
      <h2>Upcoming Events</h2>

      {events.length === 0 ? (
        <p>No events available.</p>
      ) : (
        <ul>
          {events.map((event) => (
            <li key={event._id}>
              <h3>{event.title}</h3>
              <p>{event.description}</p>
              <p>
                <strong>Date:</strong> {new Date(event.date).toLocaleDateString()}
              </p>
              <p>
                <strong>Location:</strong> {event.location}
              </p>
              <p>
                <strong>Organizer:</strong> {event.organizer?.name || "Unknown"}
              </p>

              {volunteers.length > 0 ? (
                <div>
                  <select
                    onChange={(e) => handleSelectVolunteer(event._id, e.target.value)}
                    value={selectedVolunteers[event._id] || ""}
                  >
                    <option value="">Select a Volunteer</option>
                    {volunteers.map((vol) => (
                      <option key={vol._id} value={vol._id}>
                        {vol.name} ({vol.skills.join(", ")})
                      </option>
                    ))}
                  </select>
                  <button onClick={() => handleRegister(event._id)} className="register-btn">
                    Register
                  </button>
                </div>
              ) : (
                <p>No volunteer profiles found. Create a volunteer profile first.</p>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Events;
