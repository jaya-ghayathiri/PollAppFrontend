import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './CreatePoll.css';      // reuse the styling

function EditPoll() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [question, setQuestion] = useState('');
  const [options, setOptions] = useState(['', '']);
  const [loading, setLoading] = useState(true);

  // fetch the poll once
  useEffect(() => {
    axios
      .get(`http://localhost:8000/polls/${id}`)
      .then(({ data }) => {
        setQuestion(data.question);
        setOptions(data.options.map((o) => ({ ...o }))); // keep _id & votes
      })
      .catch(() => alert('Failed to load poll'))
      .finally(() => setLoading(false));
  }, [id]);

  /* ---------- handlers ---------- */
  const handleOptionChange = (idx, value) => {
    setOptions((prev) =>
      prev.map((o, i) => (i === idx ? { ...o, text: value } : o)),
    );
  };

  const addOption = () => {
    if (options.length < 4) setOptions([...options, { text: '', votes: 0 }]);
  };

  const removeOption = (idx) => {
    if (options.length > 2) setOptions(options.filter((_, i) => i !== idx));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.patch(`http://localhost:8000/polls/${id}`, {
        question,
        options,
      });
      alert('Poll updated!');
      navigate('/mypolls');
    } catch (err) {
      alert(err.response?.data?.msg || 'Update failed');
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div className="create-poll-container">
      <h2>Edit Poll</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          required
        />

        <h4>Options (2 – 4)</h4>
        {options.map((opt, idx) => (
          <div key={opt._id ?? idx} className="option-row">
            <input
              type="text"
              value={opt.text}
              onChange={(e) => handleOptionChange(idx, e.target.value)}
              required
            />
            {options.length > 2 && (
              <button
                type="button"
                className="remove-btn"
                onClick={() => removeOption(idx)}
              >
                ✖
              </button>
            )}
          </div>
        ))}

        {options.length < 4 && (
          <button type="button" onClick={addOption} className="add-btn">
            ➕ Add Option
          </button>
        )}

        <br />
        <button type="submit" className="submit-btn">
          Save Changes
        </button>
      </form>
    </div>
  );
}

export default EditPoll;
