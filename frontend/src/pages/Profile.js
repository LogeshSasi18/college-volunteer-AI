import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Profile.css";

const Profile = () => {
  const [volunteerProfiles, setVolunteerProfiles] = useState([]);
  const [newProfile, setNewProfile] = useState({ name: "", skills: "", availability: "" });
  const [editMode, setEditMode] = useState(null); // Track which profile is being edited
  const [updatedProfile, setUpdatedProfile] = useState({});
  const userId = localStorage.getItem("userId");

  //const userId = localStorage.getItem("userId");
    const token = localStorage.getItem("token"); // Add this line
    console.log("User ID:", userId);
console.log("Auth Token:", token);

  useEffect(() => {
    if (!userId) {
      console.error("No user ID found in localStorage!");
      return;
    }

    


    axios
    .get(`http://localhost:5000/api/volunteers/user/${userId}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    .then((res) => setVolunteerProfiles(res.data))
    .catch((err) => console.log("Error fetching profiles:", err));
}, [userId]);

  // Handle input changes for new profile
  const handleNewProfileChange = (e) => {
    setNewProfile({ ...newProfile, [e.target.name]: e.target.value });
  };

  // Handle input changes for updating profile
  const handleUpdateChange = (e) => {
    setUpdatedProfile({ ...updatedProfile, [e.target.name]: e.target.value });
  };

  // Create a new volunteer profile
  const handleCreateProfile = async (e) => {
    e.preventDefault();
    if (!userId) {
      alert("User not logged in.");
      return;
    }

    try {
      const res = await axios.post(
        "http://localhost:5000/api/volunteers",
        { userId, ...newProfile },
        { headers: { Authorization: `Bearer ${token}` } } // Add header
      );

      setVolunteerProfiles([...volunteerProfiles, res.data]);
      setNewProfile({ name: "", skills: "", availability: "" });
    } catch (err) {
      console.error("Error creating profile:", err.response?.data || err.message);
      alert("Failed to create profile.");
    }
  };

  // Update a volunteer profile
  const handleUpdateProfile = async (volunteerId) => {
    try {
      await axios.put(`http://localhost:5000/api/volunteers/${volunteerId}`, updatedProfile,{
        headers: { Authorization: `Bearer ${token}` },
      });
      setVolunteerProfiles(volunteerProfiles.map((profile) =>
        profile._id === volunteerId ? { ...profile, ...updatedProfile } : profile
      ));
      setEditMode(null);
    } catch (err) {
      console.error("Error updating profile:", err.response?.data || err.message);
      alert("Failed to update profile.");
    }
  };

  // Delete a volunteer profile
  const handleDeleteProfile = async (volunteerId) => {
    try {
      await axios.delete(`http://localhost:5000/api/volunteers/${volunteerId}`,{
        headers: { Authorization: `Bearer ${token}` },
      });
      setVolunteerProfiles(volunteerProfiles.filter((profile) => profile._id !== volunteerId));
    } catch (err) {
      console.error("Error deleting profile:", err.response?.data || err.message);
      alert("Failed to delete profile.");
    }
  };

  return(
    <div className="profile-container">
      <h2 className="profile-title">My Volunteer Profiles</h2>

      <form className="profile-form" onSubmit={handleCreateProfile}>
        <h3 className="profile-form-title">Create New Profile</h3>
        <label className="profile-label">Name:</label>
        <input type="text" className="profile-input" name="name" value={newProfile.name} onChange={handleNewProfileChange} required />

        <label className="profile-label">Skills:</label>
        <input type="text" className="profile-input" name="skills" value={newProfile.skills} onChange={handleNewProfileChange} required />

        <label className="profile-label">Availability:</label>
        <input type="text" className="profile-input" name="availability" value={newProfile.availability} onChange={handleNewProfileChange} required />

        <button type="submit" className="profile-button profile-button-primary">Add Profile</button>
      </form>

      {volunteerProfiles.length > 0 ? (
        volunteerProfiles.map((profile) => (
          <div key={profile._id} className="volunteer-profile">
            {editMode === profile._id ? (
              <div>
                <h3 className="volunteer-profile-title">Edit Profile</h3>
                <label className="profile-label">Name:</label>
                <input type="text" className="profile-input" name="name" defaultValue={profile.name} onChange={handleUpdateChange} required />

                <label className="profile-label">Skills:</label>
                <input type="text" className="profile-input" name="skills" defaultValue={profile.skills} onChange={handleUpdateChange} required />

                <label className="profile-label">Availability:</label>
                <input type="text" className="profile-input" name="availability" defaultValue={profile.availability} onChange={handleUpdateChange} required />

                <button onClick={() => handleUpdateProfile(profile._id)} className="profile-button profile-button-edit">Save</button>
                <button onClick={() => setEditMode(null)} className="profile-button profile-button-cancel">Cancel</button>
              </div>
            ) : (
              <div>
                <h3 className="volunteer-profile-title">{profile.name}</h3>
                <p className="volunteer-profile-text"><strong>Skills:</strong> {profile.skills}</p>
                <p className="volunteer-profile-text"><strong>Availability:</strong> {profile.availability}</p>
                <button onClick={() => setEditMode(profile._id)} className="profile-button profile-button-edit">Edit</button>
                <button onClick={() => handleDeleteProfile(profile._id)} className="profile-button profile-button-delete">Delete</button>
              </div>
            )}
          </div>
        ))
      ) : (
        <p className="volunteer-profile-text">No volunteer profiles found.</p>
      )}
    </div>
  );
};

export default Profile;
