import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Poll from './Poll';
import API_BASE_URL from '../config';

const PollList = ({ isAdmin, currentUser }) => {
  const [polls, setPolls] = useState([]);

  useEffect(() => {
    const fetchPolls = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/api/polls`);
        console.log(res.data)
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
      {polls && polls?.length === 0 ? (
        <p>No polls yet. Login as admin to create one!</p>
      ) : (
       polls && polls?.map(poll => (
          <Poll 
            key={poll._id} 
            poll={poll}
            isAdmin={isAdmin}
            currentUser={currentUser}
          />
        ))
      )}
    </div>
  );
};

export default PollList;