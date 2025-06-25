import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './MyPolls.css'; // reuse styles

function AllPolls() {
  const [polls, setPolls] = useState([]);
  const [voted, setVoted] = useState(
    () => JSON.parse(localStorage.getItem('votedPolls') || '{}')
  );

  useEffect(() => {
    const fetchPolls = async () => {
      try {
        const { data } = await axios.get('http://localhost:8000/polls');
        setPolls(data);
      } catch (err) {
        console.error('Error fetching polls:', err);
      }
    };
    fetchPolls();
  }, []);
const handleVote = async (pollId, optionId) => {
    if (voted[pollId]) return; // already voted (UI-level guard)

    try {
      const { data: updatedPoll } = await axios.patch(
        `http://localhost:8000/polls/${pollId}/vote`,
        { optionId }
      );

      // update local polls array with new vote counts
      setPolls((prev) =>
        prev.map((p) => (p._id === pollId ? updatedPoll : p))
      );
      setVoted((prev) => ({ ...prev, [pollId]: true })); // mark as voted
    } catch (err) {
      alert(err.response?.data?.msg || 'Vote failed');
    }
  };
  return (
    <div className="mypolls-container">
      <h2>All Public Polls</h2>
      {polls.length === 0 ? (
        <p>No polls found.</p>
      ) : (
        <div className="poll-list">
          {polls.map((poll) => (
            <div key={poll._id} className="poll-card">
              <h3>{poll.question}</h3>
              <p style={{ fontSize: '0.85rem', color: '#666' }}>
                Created by: {poll.createdBy?.email || 'Unknown'}
              </p>
               <ul className="items" style={{ listStyle: 'none', padding: 0 }}>
                {poll.options.map((opt) => (
                  <li key={opt._id} style={{ marginBottom: '8px' }}>
                    <label>
                      <input
                        type="radio"
                        name={`poll-${poll._id}`}
                        disabled={voted[poll._id]}
                        onChange={() => handleVote(poll._id, opt._id)}
                        style={{ marginRight: '8px' }}
                      />
                      {opt.text} — Votes: {opt.votes}
                    </label>
                  </li>
                ))}
              </ul>
              {voted[poll._id] && (
                <p style={{ fontSize: '0.8rem', color: '#0f9d58' }}>
                  Thanks for voting!
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default AllPolls;
