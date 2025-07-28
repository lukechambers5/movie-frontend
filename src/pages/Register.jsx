import React, { useState } from 'react';
import api from '../services/api';
import { useNavigate, Link } from 'react-router-dom';
import PosterSlider from '../components/PosterSlider';


export default function Register() {
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const handleSubmit = async e => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    try {
      await api.post('/auth/register', { email, password });
      setSuccess('Registration successful! Please log in.');
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      setError(err.response?.data || 'Registration failed');
    }
  };


  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900">
      <PosterSlider />
      <form
        onSubmit={handleSubmit}
        className="relative z-10 bg-black/60 backdrop-blur-xl p-10 rounded-2xl shadow-2xl w-full max-w-md border border-white/20 text-white"
      >

        <h2 className="text-3xl font-bold text-center mb-6 text-white drop-shadow-md tracking-wide">
          Register
        </h2>
        <input
          type="email"
          placeholder="Email"
          required
          value={email}
          onChange={e => setEmail(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <input
          type="password"
          placeholder="Password"
          required
          value={password}
          onChange={e => setPassword(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-3 rounded hover:bg-blue-700 transition"
        >
          Register
        </button>
        {error && <p className="text-red-500 mt-4 text-center">{error}</p>}
        {success && (
          <p className="text-green-500 mt-4 text-center flex items-center justify-center gap-2">
            {success}
            <span className="animate-bounce text-xl">.</span>
            <span className="animate-bounce [animation-delay:0.2s] text-xl">.</span>
            <span className="animate-bounce [animation-delay:0.4s] text-xl">.</span>
          </p>
        )}



        <p className="mt-6 text-center text-sm text-gray-600">
          Already have an account?{' '}
          <Link to="/login" className="text-blue-600 hover:underline font-medium">
            Login here
          </Link>
        </p>
      </form>
    </div>
  );
}
