const express = require('express');
const router = express.Router();
const Poll = require('../models/Poll');
const cognitoAuth = require('../middleware/cognitoAuth');
const adminCheck = require('../middleware/adminCheck');

// Get all polls (public)
router.get('/', async (req, res) => {
  try {
    const polls = await Poll.find().populate('creator', 'username');
    res.json(polls);
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});

// Create poll (admin only)
router.post('/', cognitoAuth, adminCheck, async (req, res) => {
  const { question, options } = req.body;
  try {
    const poll = new Poll({
      question,
      options: options.map(opt => ({ text: opt, votes: 0 })),
      creator: req.user.id,
    });
    await poll.save();
    res.json(poll);
  } catch (err) {
    console.error('Error creating poll:', err);
    res.status(500).json({ msg: 'Server error' });
  }
});

// Vote (logged-in user)
router.post('/:id/vote', cognitoAuth, async (req, res) => {
  const { optionIndex } = req.body;
  try {
    const poll = await Poll.findById(req.params.id);
    if (!poll) return res.status(404).json({ msg: 'Poll not found' });

    if (poll.voters.includes(req.user.id)) {
      return res.status(400).json({ msg: 'Already voted' });
    }

    poll.options[optionIndex].votes += 1;
    poll.voters.push(req.user.id);
    await poll.save();
    res.json(poll);
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});

// Delete poll (admin only)
router.delete('/:id', cognitoAuth, adminCheck, async (req, res) => {
  try {
    const poll = await Poll.findById(req.params.id);
    if (!poll) return res.status(404).json({ msg: 'Poll not found' });

    await poll.deleteOne();
    res.json({ msg: 'Poll deleted successfully' });
  } catch (err) {
    console.error('Error deleting poll:', err);
    res.status(500).json({ msg: 'Server error' });
  }
});

module.exports = router;