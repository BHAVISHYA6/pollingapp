import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';  // CORRECT
import Login from './components/Login';
import Register from './components/Register';
import CreatePoll from './components/CreatePoll';
import PollList from './components/PollList';

const App = () => {
  const [isAdmin, setIsAdmin] = useState(false);
  const token = localStorage.getItem('token');

  useEffect(() => {
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setIsAdmin(!!decoded.isAdmin);
      } catch (e) {}
    }
  }, [token]);

  const logout = () => {
    localStorage.removeItem('token');
    window.location.href = '/';
  };

  return (
    <Router>
      <div className="app">
        <header>
          <h1>Polling App {isAdmin && <span className="admin-badge">ADMIN</span>}</h1>
          <nav>
            <Link to="/">Home</Link>
            {!token ? (
              <>
                <Link to="/login">Login</Link>
                <Link to="/register">Register</Link>
              </>
            ) : (
              <>
                {isAdmin && <Link to="/create">Create Poll</Link>}
                <button onClick={logout}>Logout</button>
              </>
            )}
          </nav>
        </header>
        <main>
          <Routes>
            <Route path="/" element={<PollList />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            {isAdmin && <Route path="/create" element={<CreatePoll />} />}
          </Routes>
        </main>
      </div>
    </Router>
  );
};

export default App;