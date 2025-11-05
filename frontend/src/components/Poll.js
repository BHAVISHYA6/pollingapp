import React, { useState } from 'react';
import axios from 'axios';
import API_BASE_URL from '../config';

const Poll = ({ poll, isAdmin, currentUser }) => {
  const [selectedOption, setSelectedOption] = useState(null);

  const handleVote = async () => {
    const token = localStorage.getItem('cognito-token');
    if (!token) return alert('Login to vote');
    try {
      await axios.post(`${API_BASE_URL}/api/polls/${poll._id}/vote`, 
        { optionIndex: selectedOption }, 
        {
          headers: { 
            'Authorization': `Bearer ${token}`,
            'x-auth-token': token 
          }
        }
      );
      window.location.reload();
    } catch (err) {
      alert(err.response?.data?.msg || 'Vote failed');
    }
  };

  const totalVotes = poll.options.reduce((acc, opt) => acc + opt.votes, 0);
  const token = localStorage.getItem('cognito-token');

  return (
    <div className="poll">
      <h3>{poll.question}</h3>
      <p>By: {poll.creator?.username}</p>
      {poll.options.map((opt, i) => (
        <div key={i} className="option">
          <input
            type="radio"
            name={`poll-${poll._id}`}
            onChange={() => setSelectedOption(i)}
            disabled={!token}
          />
          {opt.text} ({opt.votes} votes - {totalVotes > 0 ? ((opt.votes / totalVotes) * 100).toFixed(1) : 0}%)
        </div>
      ))}
      {token ? (
        <button onClick={handleVote} disabled={selectedOption === null}>
          Vote
        </button>
      ) : (
        <p><a href="/login">Login to vote</a></p>
      )}
    </div>
  );
};

export default Poll;