import React, { useContext } from "react";
import { Link, useLocation } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

export default function Layout({ children }) {
  const { logout, authenticated } = useContext(AuthContext);
  const location = useLocation();

  const isActive = (path) =>
    location.pathname === path
      ? "underline font-semibold"
      : "text-gray-300 hover:text-white";

  return (
    <div>
      <nav className="bg-gray-900 text-white px-6 py-4 flex justify-between items-center shadow">
        <h1 className="text-xl font-bold">CineScope</h1>
        <div className="flex items-center space-x-6">
          <Link to="/trending" className={isActive("/trending")}>
            Trending
          </Link>
          <Link to="/watchlist" className={isActive("/watchlist")}>
            My Watchlist
          </Link>
          <Link to="/suggested" className={isActive("/suggested")}>
            Suggested
          </Link>
          {authenticated && (
            <button
              onClick={logout}
              className="ml-4 bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded"
            >
              Logout
            </button>
          )}
        </div>
      </nav>
      <main>{children}</main>
    </div>
  );
}
