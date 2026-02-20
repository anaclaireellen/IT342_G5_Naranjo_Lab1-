import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Landing from './components/Landing';
import Login from './components/Login';
import Register from './components/Register';
import Dashboard from './components/Dashboard';

function App() {
  // Authentication state to protect the Dashboard route
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  return (
    <Router>
      <Routes>
        {/* 1. The Landing Page is now the default view */}
        <Route path="/" element={<Landing />} />

        {/* 2. Authentication Routes */}
        <Route path="/login" element={<Login setAuth={setIsAuthenticated} />} />
        <Route path="/register" element={<Register />} />

        {/* 3. Protected Dashboard Route */}
        <Route 
          path="/dashboard" 
          element={isAuthenticated ? <Dashboard setAuth={setIsAuthenticated} /> : <Navigate to="/login" />} 
        />

        {/* 4. Catch-all: Redirect unknown paths back to Landing */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;