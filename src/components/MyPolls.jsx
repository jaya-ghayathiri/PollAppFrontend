import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './MyPolls.css'
function MyPolls() {
  const [polls, setPolls] = useState([]);
  const userId = localStorage.getItem('userId');

  useEffect(() => {
    const fetchPolls = async () => {
      try {
        
        const { data } = await axios.get(
          `http://localhost:8000/polls/${userId}`
        );
        setPolls(data);
      } catch {
        const { data } = await axios.get('http://localhost:8000/polls');
        const mine = data.filter((p) => {
          const creatorId =
            typeof p.createdBy === 'object' ? p.createdBy._id : p.createdBy;
          return creatorId === userId;
        });
        setPolls(mine);
      } finally {
        setLoad(false);
      }
    };
    fetchPolls();
  }, [userId]);
  
const handleDelete = async (id) => {
    if (!window.confirm('Delete this poll?')) return;
    try {
      await axios.delete(`http://localhost:8000/polls/${id}`);
      setPolls((prev) => prev.filter((p) => p._id !== id)); // remove locally
      alert('Poll deleted');
    } catch (err) {
      alert(err.response?.data?.msg || 'Failed to delete poll');
    }
  };
   return (
    <div className="mypolls-container">
      <Link to="/create">Back</Link>
      <h2>My Created Polls</h2>
      {polls.length === 0 ? (
        <p>No polls created yet.</p>
      ) : (
        <div className="poll-list">
          {polls.map((poll) => (
            <div key={poll._id} className="poll-card">
              <h3>{poll.question}</h3>
              <ul>
                {poll.options.map((opt) => (
                  <li key={opt._id}>{opt.text} — Votes: {opt.votes}</li>
                ))}
              </ul>
              <div className="button-group">
                <button onClick={() => handleEdit(poll._id)} className="edit-btn">✏️ Edit</button>
                <button onClick={() => handleDelete(poll._id)} className="delete-btn">🗑️ Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

}

export default MyPolls;
