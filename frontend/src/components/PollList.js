import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Poll from './Poll';

const PollList = () => {
  const [polls, setPolls] = useState([]);

  useEffect(() => {
    const fetchPolls = async () => {
      try {
        const res = await axios.get('/api/polls');
        setPolls(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchPolls();
  }, []);

  return (
    <div className="poll-list">
      <h2>Available Polls</h2>
      {polls.length === 0 ? (
        <p>No polls yet. Login as admin to create one!</p>
      ) : (
        polls.map(poll => <Poll key={poll._id} poll={poll} />)
      )}
    </div>
  );
};

export default PollList;