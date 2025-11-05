import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import { withAuthenticator } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';
import PollList from './components/PollList';
import CreatePoll from './components/CreatePoll';

function App({ user, signOut }) {
  const isAdmin = user?.signInUserSession?.idToken?.payload?.['cognito:groups']?.includes('Admins');

  return (
    <Router>
      <div className="app">
        <header>
          <h1>PollMaster {isAdmin && <span className="admin-badge">ADMIN</span>}</h1>
          <nav>
            <Link to="/">Home</Link>
            {isAdmin && <Link to="/create">Create Poll</Link>}
            <button onClick={signOut}>Logout</button>
          </nav>
        </header>
        <main>
          <Routes>
            <Route path="/" element={<PollList />} />
            <Route path="/create" element={isAdmin ? <CreatePoll /> : <Navigate to="/" />} />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default withAuthenticator(App);