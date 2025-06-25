import React, { useState } from 'react';
import axios from 'axios';
import './CreatePoll.css';
import { Link, useNavigate } from 'react-router-dom';


function CreatePoll() {
  const [question, setQuestion] = useState('');
  const [options, setOptions] = useState(['', '']);
  const userId = localStorage.getItem('userId');
const navigate = useNavigate();
  const handleOptionChange = (index, value) => {
    const updatedOptions = [...options];
    updatedOptions[index] = value;
    setOptions(updatedOptions);
  };

  const addOption = () => {
    if (options.length < 4) {
      setOptions([...options, '']);
    }
  };

  const removeOption = (index) => {
    if (options.length > 2) {
      const updatedOptions = [...options];
      updatedOptions.splice(index, 1);
      setOptions(updatedOptions);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      question,
      options: options.map((text) => ({ text })),
      createdBy: userId,
    };

    try {
      console.log('Creating poll with payload:', payload);

      await axios.post('http://localhost:8000/polls', payload);
      alert('Poll created successfully!');
      setQuestion('');
      setOptions(['', '']);
      navigate('/mypolls');
    } catch (err) {
      alert(err.response?.data?.msg || 'Failed to create poll');
    }
  };

  return (
    <div className="create-poll-container">
      
      <h2>Create a Poll</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Enter your question"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          required
        />

        <h4>Options (2 to 4)</h4>
        {options.map((opt, index) => (
          <div key={index} className="option-row">
            <input
              type="text"
              placeholder={`Option ${index + 1}`}
              value={opt}
              onChange={(e) => handleOptionChange(index, e.target.value)}
              required
            />
            {options.length > 2 && (
              <button type="button" onClick={() => removeOption(index)} className="remove-btn">
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
        <button type="submit" className="submit-btn">Create Poll</button>
        <button
  type="button"
  onClick={() => navigate('/allpolls')}
  className="submit-btn"
  style={{ backgroundColor: '#7f5af0', marginTop: '1rem' }}
>
  🌍 View All Polls
</button>

      </form>
    </div>
  );
}

export default CreatePoll;
