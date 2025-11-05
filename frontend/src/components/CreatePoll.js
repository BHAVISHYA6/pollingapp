import React, { useState } from 'react';
import axios from 'axios';

const CreatePoll = () => {
  const [question, setQuestion] = useState('');
  const [options, setOptions] = useState(['', '']);

  const addOption = () => setOptions([...options, '']);
  const handleOptionChange = (i, val) => {
    const newOpts = [...options];
    newOpts[i] = val;
    setOptions(newOpts);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/api/polls', { question, options }, {
        headers: { 'x-auth-token': localStorage.getItem('token') }
      });
      window.location.href = '/';
    } catch (err) {
      alert(err.response?.data?.msg || 'Failed to create poll');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="form">
      <h2>Create Poll</h2>
      <input type="text" placeholder="Question" value={question} onChange={e => setQuestion(e.target.value)} required />
      {options.map((opt, i) => (
        <input key={i} type="text" placeholder={`Option ${i+1}`} value={opt} onChange={e => handleOptionChange(i, e.target.value)} required />
      ))}
      <button type="button" onClick={addOption}>Add Option</button>
      <button type="submit">Create Poll</button>
    </form>
  );
};

export default CreatePoll;