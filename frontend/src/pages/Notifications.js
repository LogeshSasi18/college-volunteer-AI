import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    axios.get(`http://localhost:5000/api/notifications/${localStorage.getItem('userId')}`)
      .then(res => setNotifications(res.data))
      .catch(err => console.log(err));
  }, []);

  return (
    <div className="notifications-container">
      <h2>Notifications</h2>
      {notifications.length === 0 ? (
        <p>No new notifications</p>
      ) : (
        <ul>
          {notifications.map(notif => (
            <li key={notif._id} className={notif.seen ? "seen" : "unseen"}>
              {notif.message}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Notifications;