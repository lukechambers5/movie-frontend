import React, { useEffect, useState } from 'react';
import api from '../services/api'; 

export default function Trending() {
  const [trending, setTrending] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchTrending() {
      try {
        const res = await api.get('/trending');
        setTrending(res.data.results || []); 
      } catch (err) {
        console.error('Failed to fetch trending movies:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchTrending();
  }, []);

  if (loading) return <p className="text-center mt-4">Loading trending movies...</p>;

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      <h1 className="text-3xl font-bold mb-4">Trending Movies</h1>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {trending.map(movie => (
          <div
            key={movie.id}
            className="bg-white rounded-lg shadow overflow-hidden hover:shadow-lg transition"
          >
            <img
              src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
              alt={movie.title}
              className="w-full h-[450px] object-cover"
            />
            <div className="p-4">
              <h2 className="text-lg font-semibold">{movie.title}</h2>
              <p className="text-sm text-gray-500">Rating: {movie.vote_average.toFixed(1)}/10</p>
              <p className="text-sm text-gray-500">{movie.release_date
                      ? new Date(movie.release_date).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })
                      : "Unknown release date"}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
