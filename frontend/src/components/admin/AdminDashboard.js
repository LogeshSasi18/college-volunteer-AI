import React, { useState, useEffect } from "react";
import axios from "axios";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";
import "./AdminDashboard.css";

// AI API Key (Replace with your actual key)
const API_KEY = ""; 
const genAI = new GoogleGenerativeAI(API_KEY);

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#AF19FF"];

const AdminDashboard = () => {
  const [events, setEvents] = useState([]);
  const [suggestions, setSuggestions] = useState({});
  const [loadingSuggestions, setLoadingSuggestions] = useState({});
  const [pieChartData, setPieChartData] = useState({});
  const token = localStorage.getItem("token");

  // Fetch Events from Backend
  useEffect(() => {
    if (!token) return;
    axios
      .get("http://localhost:5000/api/events", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => setEvents(response.data))
      .catch((error) => console.error("Error fetching events:", error));
  }, [token]);

  // Fetch AI Suggestions
  const fetchAISuggestions = async (event) => {
    if (suggestions[event._id]) return; // Prevent duplicate API calls

    setLoadingSuggestions((prev) => ({ ...prev, [event._id]: true }));

    // Ensure registered volunteers exist
    const appliedVolunteers = event.registeredVolunteers || [];

    if (appliedVolunteers.length === 0) {
      setSuggestions((prev) => ({
        ...prev,
        [event._id]: "No volunteers have registered for this event yet.",
      }));
      setLoadingSuggestions((prev) => ({ ...prev, [event._id]: false }));
      return;
    }

    try {
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-001" });

      const prompt = `
        Event Details:
        - Title: ${event.title}
        - Description: ${event.description}
        - Required Skills: ${event.requiredSkills?.join(", ") || "Not specified"}
  
        Registered Volunteers:
        ${appliedVolunteers.map(
          (vol) => `- ${vol.name}: ${vol.skills?.join(", ") || "No skills listed"}`
        ).join("\n")}

        Suggest the best matching volunteers based on their skills and event needs.
      `;

      console.log("Generated Prompt:", prompt); // Debugging AI prompt

      const result = await model.generateContent({
        contents: [{ parts: [{ text: prompt }] }],
      });

      console.log("AI Response:", result); // Debugging AI response

      const response = result.response;
      const suggestionText =
        response?.candidates?.[0]?.content?.parts?.[0]?.text || "No suggestions available.";

      setSuggestions((prev) => ({
        ...prev,
        [event._id]: suggestionText,
      }));

      // Pie chart data: Matched vs Unmatched volunteers
      const matchedCount = appliedVolunteers.length;
      const unmatchedCount = event.registeredVolunteers.length - matchedCount;

      setPieChartData((prev) => ({
        ...prev,
        [event._id]: [
          { name: "Matched Volunteers", value: matchedCount },
          { name: "Unmatched Volunteers", value: unmatchedCount },
        ],
      }));
    } catch (error) {
      console.error("Error generating AI suggestions:", error);
      setSuggestions((prev) => ({
        ...prev,
        [event._id]: "Error fetching AI suggestions.",
      }));
    } finally {
      setLoadingSuggestions((prev) => ({ ...prev, [event._id]: false }));
    }
  };

  return (
    <div className="admin-dashboard">
      <h2 className="dashboard-title">Admin Dashboard - Events Management</h2>
      {events.length === 0 ? (
        <p className="no-events">No events available.</p>
      ) : (
        <div className="event-grid">
          {events.map((event) => (
            <div key={event._id} className="event-card">
              <div className="event-header">
                <h3 className="event-title">{event.title}</h3>
                <span className="event-date">{new Date(event.date).toLocaleDateString()}</span>
              </div>
              <p className="event-description">{event.description}</p>
              <p className="event-info"><strong>Location:</strong> {event.location}</p>
              <p className="event-info"><strong>Organizer:</strong> {event.organizer?.name || "Unknown"}</p>

              <div className="volunteer-section">
                <h4 className="volunteer-title">Registered Volunteers</h4>
                {event.registeredVolunteers.length > 0 ? (
                  <ul className="volunteer-list">
                    {event.registeredVolunteers.map((volunteer, index) => (
                      <li key={volunteer._id || index} className="volunteer-item">
                        {volunteer.name} - {volunteer.skills?.join(", ") || "No skills listed"}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="no-volunteers">No volunteers registered yet.</p>
                )}
              </div>

              <button
                onClick={() => fetchAISuggestions(event)}
                disabled={loadingSuggestions[event._id]}
                className="ai-suggestion-btn"
              >
                {loadingSuggestions[event._id] ? "Fetching..." : "Get AI Suggestions"}
              </button>

              {suggestions[event._id] && (
                <div className="ai-suggestions">
                  <h4>AI Volunteer Suggestions</h4>
                  <p>{suggestions[event._id]}</p>
                </div>
              )}

              {pieChartData[event._id] && (
                <div className="chart-container">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={pieChartData[event._id]}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        label
                      >
                        {pieChartData[event._id].map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
