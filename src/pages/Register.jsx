import React, { useState } from 'react';
import api from '../services/api';
import { useNavigate, Link } from 'react-router-dom';
import PosterSlider from '../components/PosterSlider';

export default function Register() {
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const passwordsMatch = password === confirmPassword;

  const handleSubmit = async e => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    if (!passwordsMatch) {
      setError('Passwords do not match');
      return;
    }
    try {
      await api.post('/auth/register', { email, password });
      setSuccess('Registration successful! Please log in.');
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      setError(err.response?.data || 'Registration failed');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
      <PosterSlider />
      <form
        onSubmit={handleSubmit}
        className="relative z-10 bg-white dark:bg-black/60 backdrop-blur-xl p-10 rounded-2xl shadow-2xl w-full max-w-md border border-gray-300 dark:border-white/20 text-black dark:text-white"
      >
        <h2 className="text-3xl font-bold text-center mb-6 drop-shadow-md tracking-wide text-black dark:text-white">
          Register
        </h2>

        <input
          type="email"
          placeholder="Email"
          required
          value={email}
          onChange={e => setEmail(e.target.value)}
          className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-black dark:bg-gray-800 dark:text-white"
        />

        {/* Password Input */}
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

        {/* Confirm Password Input */}
        <div className="relative mb-4">
          <input
            type={showPassword ? 'text' : 'password'}
            placeholder="Confirm Password"
            required
            value={confirmPassword}
            onChange={e => setConfirmPassword(e.target.value)}
            className={`w-full p-3 pr-12 border ${
              passwordsMatch ? 'border-gray-300 dark:border-gray-600' : 'border-red-500'
            } rounded focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-black dark:bg-gray-800 dark:text-white`}
          />
        </div>
        {!passwordsMatch && (
          <p className="text-red-500 text-sm mb-4">Passwords do not match.</p>
        )}

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-3 rounded hover:bg-blue-700 transition disabled:opacity-50"
          disabled={!passwordsMatch}
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

        <p className="mt-6 text-center text-sm text-gray-700 dark:text-gray-400">
          Already have an account?{' '}
          <Link to="/login" className="text-blue-600 hover:underline font-medium">
            Login here
          </Link>
        </p>
      </form>
    </div>
  );
}
