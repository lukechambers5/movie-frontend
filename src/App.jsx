import React, { useContext } from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import { AuthProvider, AuthContext } from './context/AuthContext';
import Login from './pages/Login';
import Register from './pages/Register';
import Watchlist from './pages/Watchlist';
import Trending from './pages/Trending';
import Layout from './components/Layout';
import Suggested from './pages/Suggested';

function PrivateRoute({ children }) {
  const { authenticated, loading } = useContext(AuthContext);

  if (loading) return <p>Loading...</p>;

  return authenticated ? children : <Navigate to="/login" />;
}

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route 
            path="/trending" 
            element={
              <PrivateRoute>
                <Layout>
                  <Trending />
                </Layout>
              </PrivateRoute>
            } 
          />
          <Route
            path="/watchlist"
            element={
              <PrivateRoute>
                <Layout>
                  <Watchlist />
                </Layout>
              </PrivateRoute>
            }
          />
          <Route
            path="/suggested"
            element={
              <PrivateRoute>
                <Layout>
                  <Suggested />
                </Layout>
              </PrivateRoute>
            }
          />
          <Route path="/" element={<Navigate to="/trending" />} />
          <Route path="*" element={<Navigate to="/trending" />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}
