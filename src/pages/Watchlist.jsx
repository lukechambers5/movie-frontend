import React, { useEffect, useState, useContext } from "react";
import api from "../services/api";
import { AuthContext } from "../context/AuthContext";

export default function Watchlist() {
  const { authenticated, logout } = useContext(AuthContext);

  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newTitle, setNewTitle] = useState("");
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    if (!authenticated) return;

    async function fetchWatchlist() {
      try {
        setLoading(true);
        const res = await api.get("/watchlist");
        setMovies(res.data);
      } catch (err) {
        setError("Failed to load watchlist.");
      } finally {
        setLoading(false);
      }
    }

    fetchWatchlist();
  }, [authenticated]);

  async function handleAddMovie(e) {
    e.preventDefault();
    if (!newTitle.trim()) return;

    try {
      setAdding(true);
      await api.post("/watchlist", null, {
        params: { title: newTitle.trim() },
      });
      setNewTitle("");
      const res = await api.get("/watchlist");
      setMovies(res.data);
    } catch {
      alert("Failed to add movie.");
    } finally {
      setAdding(false);
    }
  }

  async function handleDelete(movieId) {
    try {
      await api.delete(`/watchlist/${movieId}`);
      setMovies((prev) => prev.filter((movie) => movie.movieId !== movieId));
    } catch {
      alert("Failed to delete movie.");
    }
  }

  if (!authenticated) return <p className="text-center text-gray-600">Please log in to view your watchlist.</p>;
  if (loading) return <p className="text-center text-gray-600">Loading watchlist...</p>;
  if (error) return <p className="text-red-500 text-center">{error}</p>;

  return (
    <div className="max-w-5xl mx-auto px-4 py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">🎬 Your Watchlist</h1>
        <button
          onClick={logout}
          className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded-md transition"
        >
          Logout
        </button>
      </div>

      <form onSubmit={handleAddMovie} className="flex justify-center mb-6">
        <input
          type="text"
          placeholder="Search by title..."
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
          disabled={adding}
          className="px-4 py-2 border rounded-l-md w-64 focus:outline-none focus:ring"
        />
        <button
          type="submit"
          disabled={adding || !newTitle.trim()}
          className="bg-blue-600 text-white px-4 py-2 rounded-r-md hover:bg-blue-700 disabled:opacity-50"
        >
          {adding ? "Adding..." : "Add"}
        </button>
      </form>

      {movies.length === 0 ? (
        <p className="text-center text-gray-500">Your watchlist is empty.</p>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {movies.map((movie) => (
            <div
              key={movie.movieId}
              className="bg-white rounded-xl shadow-md overflow-hidden border hover:shadow-lg transition"
            >
              <img
                src={movie.thumbnailUrl || movie.posterUrl}
                alt={movie.title}
                className="w-full h-64 object-cover"
              />
              <div className="p-4">
                <h2 className="text-xl font-semibold">{movie.title}</h2>
                <p className="text-gray-600 text-sm mb-1">
                  <strong>Genres:</strong> {movie.genres}
                </p>
                <p className="text-gray-600 text-sm mb-1">
                  <strong>Actors:</strong> {movie.actors}
                </p>
                <p className="text-gray-600 text-sm mb-1">
                  <strong>Released:</strong> {movie.releaseDate}
                </p>
                <p className="text-gray-600 text-sm mb-1">
                  <strong>Popularity:</strong> {movie.popularityScore}
                </p>
                <p className="text-gray-600 text-sm mb-4">
                  <strong>Tier:</strong> {movie.actorClassification}
                </p>
                <button
                  onClick={() => handleDelete(movie.movieId)}
                  className="w-full bg-red-500 text-white py-2 rounded-md hover:bg-red-600"
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
