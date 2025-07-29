import React, { useEffect, useState, useContext } from "react";
import api from "../services/api";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function Suggested() {
  const { authenticated, loading: authLoading } = useContext(AuthContext);
  const navigate = useNavigate();

  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedMovieId, setExpandedMovieId] = useState(null);
  const [addingId, setAddingId] = useState(null);
  const [addedIds, setAddedIds] = useState(new Set());

  useEffect(() => {
    if (!loading && !authenticated) {
      navigate("/login");
    }
  }, [authenticated, loading, navigate]);

  useEffect(() => {
    if (authLoading) return; 
    if (!authenticated) {
      setError("You must be logged in to see suggestions.");
      setLoading(false);
      return;
    }

    async function fetchSuggestions() {
      try {
        const res = await api.get("/recommendation/suggested");
        setSuggestions(res.data);
      } catch (err) {
        console.error("Error fetching suggestions:", err);
        setError("Failed to load suggestions.");
      } finally {
        setLoading(false);
      }
    }

    fetchSuggestions();
  }, [authLoading, authenticated]);

  async function handleAdd(movieId) {
    try {
      setAddingId(movieId);
      await api.post("/watchlist", null, {
        params: { movieId },
      });
      setAddedIds((prev) => new Set(prev).add(movieId));
      setSuggestions((prev) => prev.filter(movie => movie.movieId !== movieId));
    } catch (err) {
      alert("Failed to add movie to watchlist.");
    } finally {
      setAddingId(null);
    }
  }

  if (!authenticated) return <p className="text-center text-gray-600">Please log in to view suggestions.</p>;
  if (loading) return <p className="text-center text-gray-600">Loading suggestions...</p>;
  if (error) return <p className="text-red-500 text-center">{error}</p>;

  return (
    <div className="max-w-5xl mx-auto px-4 py-6">

      {suggestions.length === 0 ? (
        <p className="text-center text-gray-500">No suggestions available at this time.</p>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {suggestions.map((movie) => (
            <div
              key={movie.movieId}
              className="relative bg-white rounded-xl shadow-md overflow-hidden border transition transform hover:scale-105 cursor-pointer"
              onClick={() =>
                setExpandedMovieId((prev) => (prev === movie.movieId ? null : movie.movieId))
              }
            >
              <img
                src={movie.posterUrl}
                alt={movie.title}
                className="w-full h-[450px] object-cover object-top"
              />

              {expandedMovieId === movie.movieId && (
                <div className="p-4 border-t bg-gray-50 text-sm text-gray-700">
                  <p><strong>Overview:</strong> {movie.overview || "No overview available."}</p>
                </div>
              )}

              <div className="p-4">
                <h2 className="text-xl font-semibold">{movie.title}</h2>
                <p className="text-gray-600 text-sm mb-1">
                  <strong>Released:</strong>{" "}
                  {movie.releaseDate
                    ? new Date(movie.releaseDate).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })
                    : "Unknown"}
                </p>
                <p className="text-gray-600 text-sm mb-2">
                  <strong>Rating:</strong> {movie.rating?.toFixed(1) || "N/A"}/10
                </p>

                <button
                  onClick={(e) => {
                    e.stopPropagation(); // Prevent card expand
                    handleAdd(movie.movieId);
                  }}
                  disabled={addingId === movie.movieId || addedIds.has(movie.movieId)}
                  className={`px-3 py-1 rounded text-white text-sm ${
                    addedIds.has(movie.movieId)
                      ? "bg-green-600 cursor-not-allowed"
                      : "bg-blue-600 hover:bg-blue-700"
                  }`}
                >
                  {addedIds.has(movie.movieId)
                    ? "Added"
                    : addingId === movie.movieId
                    ? "Adding..."
                    : "+ Add to Watchlist"}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
