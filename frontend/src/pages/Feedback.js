import React, { useState } from 'react';
import axios from 'axios';

const Feedback = ({ eventId }) => {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/feedback', {
        userId: localStorage.getItem('userId'),
        eventId,
        rating,
        comment
      });
      alert('Feedback submitted');
    } catch (error) {
      alert('Error submitting feedback');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input type="number" value={rating} onChange={(e) => setRating(e.target.value)} min="1" max="5" required />
      <textarea value={comment} onChange={(e) => setComment(e.target.value)} required />
      <button type="submit">Submit Feedback</button>
    </form>
  );
};

export default Feedback;