import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import { withAuthenticator } from '@aws-amplify/ui-react';
import { fetchAuthSession, getCurrentUser } from 'aws-amplify/auth';
import '@aws-amplify/ui-react/styles.css';
import './styles.css';
import PollList from './components/PollList';
import CreatePoll from './components/CreatePoll';
import { Amplify } from 'aws-amplify';
import awsExports from './aws-exports';

Amplify.configure(awsExports);

function App({ signOut }) {
  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkUser();
  }, []);

  const checkUser = async () => {
    try {
      const currentUser = await getCurrentUser();
      setUser(currentUser);

      const session = await fetchAuthSession();
      const groups = session.tokens?.idToken?.payload['cognito:groups'] || [];
      
      // Store token for API calls
      const token = session.tokens?.idToken?.toString();
      if (token) {
        localStorage.setItem('cognito-token', token);
      }
      
      console.log('=== AUTH DEBUG ===');
      console.log('Username:', currentUser.username);
      console.log('Groups:', groups);
      console.log('Is Admin:', groups.includes('Admins'));
      console.log('================');

      setIsAdmin(groups.includes('Admins'));
    } catch (error) {
      console.error('Error fetching user:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="app">
        <div style={{ textAlign: 'center', padding: '50px' }}>
          Loading...
        </div>
      </div>
    );
  }

  return (
    <Router>
      <div className="app">
        <header>
          <h1>
            PollMaster {isAdmin && <span className="admin-badge">ADMIN</span>}
          </h1>
          <nav>
            <Link to="/">Home</Link>
            {isAdmin && <Link to="/create">Create Poll</Link>}
            <button onClick={signOut}>
              Logout {user?.username && `(${user.username})`}
            </button>
          </nav>
        </header>
        <main>
          <Routes>
            <Route path="/" element={<PollList isAdmin={isAdmin} currentUser={user} />} />
            <Route 
              path="/create" 
              element={isAdmin ? <CreatePoll /> : <Navigate to="/" replace />} 
            />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default withAuthenticator(App);