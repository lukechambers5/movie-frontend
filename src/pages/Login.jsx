import React, { useState, useContext } from 'react';
import api from '../services/api';
import { AuthContext } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import PosterSlider from '../components/PosterSlider';

export default function Login() {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async e => {
    e.preventDefault();
    setError(null);
    try {
      await api.post('/auth/login', { email, password });
      login();
      navigate('/trending');
    } catch (err) {
      setError(err.response?.data || 'Login failed');
    }
  };

  return (
    <div className="relative flex items-center justify-center min-h-screen bg-gray-900 overflow-hidden">
      <PosterSlider />
      <form
        onSubmit={handleSubmit}
        className="relative z-10 bg-white dark:bg-black/60 backdrop-blur-xl p-10 rounded-2xl shadow-2xl w-full max-w-md border border-gray-300 dark:border-white/20 text-black dark:text-white"
      >
        <h2 className="text-3xl font-bold text-center mb-6 drop-shadow-md tracking-wide text-black dark:text-white">
          Login
        </h2>

        <input
          type="email"
          placeholder="Email"
          required
          value={email}
          onChange={e => setEmail(e.target.value)}
          className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-black dark:bg-gray-800 dark:text-white"
        />

        <div className="relative mb-4">
          <input
            type={showPassword ? 'text' : 'password'}
            placeholder="Password"
            required
            value={password}
            onChange={e => setPassword(e.target.value)}
            className="w-full p-3 pr-12 border border-gray-300 dark:border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-black dark:bg-gray-800 dark:text-white"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute top-1/2 right-3 transform -translate-y-1/2 text-sm text-gray-600 dark:text-gray-300 hover:underline focus:outline-none"
          >
            {showPassword ? 'Hide' : 'Show'}
          </button>
        </div>


        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-3 rounded hover:bg-blue-700 transition"
        >
          Login
        </button>

        {error && <p className="text-red-500 mt-4 text-center">{error}</p>}

        <p className="mt-6 text-center text-sm text-gray-700 dark:text-gray-400">
          Don’t have an account?{' '}
          <Link to="/register" className="text-blue-600 hover:underline font-medium">
            Register here
          </Link>
        </p>
      </form>

    </div>
  );
}
