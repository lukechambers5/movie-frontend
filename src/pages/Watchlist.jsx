import React, { useEffect, useState, useContext } from "react";
import api from "../services/api";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";


export default function Watchlist() {
  const { authenticated } = useContext(AuthContext);

  const navigate = useNavigate();


  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [query, setQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [searching, setSearching] = useState(false);
  const [addingId, setAddingId] = useState(null);
  const [expandedMovieId, setExpandedMovieId] = useState(null);
  console.log("authenticated:", authenticated, "| loading:", loading);

  useEffect(() => {
    if (!loading && !authenticated) {
      navigate("/login");
    }
  }, [authenticated, loading, navigate]);

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

  useEffect(() => {
    const delayDebounce = setTimeout(async () => {
      if (query.trim().length === 0) {
        setSearchResults([]);
        return;
      }

      try {
        setSearching(true);
        const res = await api.get("/watchlist/search", {
          params: { title: query.trim() },
        });
        const filtered = res.data.filter((movie) => movie.poster_path);
        setSearchResults(filtered);

      } catch {
        setSearchResults([]);
      } finally {
        setSearching(false);
      }
    }, 400);

    return () => clearTimeout(delayDebounce);
  }, [query]);

  async function handleAddMovie(movieId) {
    try {
      setAddingId(movieId);
      await api.post("/watchlist", null, {
        params: { movieId },
      });
      setQuery("");
      setSearchResults([]);
      const res = await api.get("/watchlist");
      setMovies(res.data);
    } catch {
      alert("Failed to add movie.");
    } finally {
      setAddingId(null);
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
      {/* Search bar */}
      <div className="flex flex-col mb-6 items-center">
        <input
          type="text"
          placeholder="Search for a movie..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="px-4 py-2 border rounded-md w-72 focus:outline-none focus:ring mb-2"
        />
        {searching && <p className="text-sm text-gray-500">Searching...</p>}
        {searchResults.length > 0 && (
          <div className="w-full max-w-xl border rounded-md shadow-sm bg-white mt-2">
            {searchResults.map((movie) => (
              <div
                key={movie.id}
                className="flex items-center gap-4 p-3 border-b hover:bg-gray-50 transition cursor-pointer"
                onClick={() => handleAddMovie(movie.id)}
              >
                <img
                  src={
                    movie.poster_path
                      ? `https://image.tmdb.org/t/p/w92${movie.poster_path}`
                      : "https://via.placeholder.com/92x138?text=No+Image"
                  }
                  alt={movie.title}
                  className="w-16 h-24 object-cover rounded"
                />
                <div className="flex-1">
                  <p className="font-semibold">{movie.title}</p>
                  <p className="text-sm text-gray-500">
                    {movie.release_date
                      ? new Date(movie.release_date).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })
                      : "Unknown release date"}
                  </p>
                  {addingId === movie.id && (
                    <p className="text-blue-600 text-sm mt-1">Adding...</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Watchlist display */}
      {movies.length === 0 ? (
        <p className="text-center text-gray-500">Your watchlist is empty.</p>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {movies.map((movie) => (
            <div
              key={movie.movieId}
              className="relative bg-white rounded-xl shadow-md overflow-hidden border transition transform hover:scale-105 cursor-pointer"
              onClick={() =>
                setExpandedMovieId((prev) => (prev === movie.movieId ? null : movie.movieId))
              }

            >
              <img
                src={movie.thumbnailUrl || movie.posterUrl}
                alt={movie.title}
                className="w-full h-450px] object-cover object-top"
              />

              {expandedMovieId === movie.movieId && (
                <div className="p-4 border-t bg-gray-50 text-sm text-gray-700">
                  <p><strong>Overview:</strong> {movie.overview || "No overview available."}</p>
                </div>
              )}

              <div className="p-4">
                <h2 className="text-xl font-semibold">{movie.title}</h2>
                <p className="text-gray-600 text-sm mb-1">
                  <strong>Genres:</strong> {movie.genres}
                </p>
                <p className="text-gray-600 text-sm mb-1">
                  <strong>Actors:</strong> {movie.actors}
                </p>
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
                <p className="text-gray-600 text-sm mb-1">
                  <strong>Rating:</strong> {movie.popularityScore.toFixed(1)}/10
                </p>
                <button
                  onClick={(e) => {
                    e.stopPropagation(); // Prevent card click
                    handleDelete(movie.movieId);
                  }}
                  className="absolute top-2 right-2 text-white bg-red-500 rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600 z-10 shadow"
                  title="Remove"
                >
                  &times;
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
