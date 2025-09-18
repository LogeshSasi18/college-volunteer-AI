import React, { useState } from "react";
import axios from "axios";
import "./AddEvent.css";

const AddEvent = () => {
    const [eventData, setEventData] = useState({
        title: "",  // Changed from `name` to `title`
        description: "",
        date: "",
        location: "",
        requiredVolunteers: "",
    });

    const handleChange = (e) => {
        setEventData({ ...eventData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
    
        const token = localStorage.getItem("token");
        console.log("Retrieved Token:", token); // Debugging step
    
        if (!token) {
            alert("No token found! Please log in again.");
            return;
        }
    
        try {
            const headers = {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            };
            console.log("Sending headers:", headers); // Debugging step

            const formattedEventData = {
                title: eventData.title,  //  Ensure correct key
                description: eventData.description,
                date: new Date(eventData.date).toISOString(),  //  Convert date
                location: eventData.location,
                requiredVolunteers: Number(eventData.requiredVolunteers),  //  Convert to number
            };

            console.log("Sending event data:", formattedEventData);
    
            const response = await axios.post(
                "http://localhost:5000/api/events",
                formattedEventData,
                { headers }
            );
    
            console.log("Event added successfully:", response.data);
            alert("Event added successfully!");
        } catch (error) {
            console.error("Error adding event", error);
            alert(error.response?.data?.error || "Failed to add event");
        }
    };
    

    return (
        <div className="add-event-container">
            <h2 className="form-title">Create a New Event</h2>
            <form onSubmit={handleSubmit} className="custom-form">
                <div className="form-group">
                    <label>Event Title</label>
                    <input
                        type="text"
                        name="title"
                        value={eventData.title}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label>Description</label>
                    <textarea
                        name="description"
                        value={eventData.description}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label>Date</label>
                    <input
                        type="date"
                        name="date"
                        value={eventData.date}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label>Location</label>
                    <input
                        type="text"
                        name="location"
                        value={eventData.location}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label>Required Volunteers</label>
                    <input
                        type="number"
                        name="requiredVolunteers"
                        value={eventData.requiredVolunteers}
                        onChange={handleChange}
                        required
                    />
                </div>
                <button type="submit" className="submit-btn">Add Event</button>
            </form>
        </div>
    );
};

export default AddEvent;
