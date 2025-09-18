import React, { useEffect, useState } from "react";
import axios from "axios";
import "./ManageEvents.css";

const ManageEvents = () => {
    const [events, setEvents] = useState([]);
    const [editEvent, setEditEvent] = useState(null);
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        date: "",
        location: "",
        requiredVolunteers: "",
    });

    useEffect(() => {
        fetchEvents();
    }, []);

    const fetchEvents = async () => {
        try {
            const token = localStorage.getItem("token");
            if (!token) {
                alert("Authentication required. Please log in.");
                return;
            }

            const response = await axios.get("http://localhost:5000/api/events", {
                headers: { Authorization: `Bearer ${token}` },
            });

            setEvents(response.data);
        } catch (error) {
            console.error("Error fetching events:", error);
            alert(error.response?.data?.error || "Failed to fetch events");
        }
    };

    const handleEdit = (event) => {
        setEditEvent(event);
        setFormData({
            title: event.title,
            description: event.description,
            date: event.date.split("T")[0], // Format date
            location: event.location,
            requiredVolunteers: event.requiredVolunteers,
        });
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const updateEvent = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem("token");
            if (!token) {
                alert("Authentication required. Please log in.");
                return;
            }

            const response = await axios.put(
                `http://localhost:5000/api/events/${editEvent._id}`,
                formData,
                { headers: { Authorization: `Bearer ${token}` } }
            );

            setEvents(events.map(event => event._id === editEvent._id ? response.data.event : event));
            setEditEvent(null);
            alert("Event updated successfully!");
        } catch (error) {
            console.error("Error updating event:", error);
            alert(error.response?.data?.error || "Failed to update event");
        }
    };

    const deleteEvent = async (eventId) => {
        try {
            const token = localStorage.getItem("token");
            if (!token) {
                alert("Authentication required. Please log in.");
                return;
            }

            await axios.delete(`http://localhost:5000/api/events/${eventId}`, {
                headers: { Authorization: `Bearer ${token}` },
            });

            setEvents(events.filter(event => event._id !== eventId));
            alert("Event deleted successfully!");
        } catch (error) {
            console.error("Error deleting event:", error);
            alert(error.response?.data?.error || "Failed to delete event");
        }
    };

    return (
        <div className="manage-events-container">
            <h2 className="manage-events-title">Manage Events</h2>
            {editEvent ? (
                <form className="manage-events-form" onSubmit={updateEvent}>
                    <input className="manage-events-input" type="text" name="title" value={formData.title} onChange={handleChange} required />
                    <textarea className="manage-events-textarea" name="description" value={formData.description} onChange={handleChange} required />
                    <input className="manage-events-input" type="date" name="date" value={formData.date} onChange={handleChange} required />
                    <input className="manage-events-input" type="text" name="location" value={formData.location} onChange={handleChange} required />
                    <input className="manage-events-input" type="number" name="requiredVolunteers" value={formData.requiredVolunteers} onChange={handleChange} required />
                    <button className="manage-events-button" type="submit">Update</button>
                    <button className="manage-events-button delete" onClick={() => setEditEvent(null)}>Cancel</button>
                </form>
            ) : (
                <ul className="manage-events-list">
                    {events.map(event => (
                        <li className="manage-events-item" key={event._id}>
                            <h3>{event.title}</h3>
                            <p>{event.description}</p>
                            <button className="manage-events-button" onClick={() => handleEdit(event)}>Edit</button>
                            <button className="manage-events-button delete" onClick={() => deleteEvent(event._id)}>Delete</button>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default ManageEvents;
