import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import "./Auth.css"
function Auth() {
  const [isRegister, setIsRegister] = useState(true); 
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const url = isRegister ? 'http://localhost:8000/register' : 'http://localhost:8000/login';

    try {
      const res = await axios.post(url, { email, password });
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('userId', res.data.userId);
      

      alert(`${isRegister ? 'Registered' : 'Logged in'} successfully!`);
      navigate('/create');
    } catch (err) {
      alert(err.response?.data?.msg || 'Something went wrong');
    }
  };

  return (
  <div className="auth-container">
    <h2>{isRegister ? 'Register' : 'Login'}</h2>
    <form onSubmit={handleSubmit}>
      <input
        type="email"
        placeholder="Enter Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <input
        type="password"
        placeholder="Enter Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />
      <button type="submit">{isRegister ? 'Register' : 'Login'}</button>
    </form>
    <button onClick={() => setIsRegister(!isRegister)} className="auth-toggle">
      {isRegister ? 'Already have an account? Login' : 'New user? Register'}
    </button>
  </div>
);

}

export default Auth;
