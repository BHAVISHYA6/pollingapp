const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const Poll = require('../models/Poll');

const JWT_SECRET = process.env.JWT_SECRET;

// Auth middleware
const auth = (req, res, next) => {
  const token = req.header('x-auth-token');
  if (!token) return res.status(401).json({ msg: 'No token' });

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ msg: 'Invalid token' });
  }
};

// Get all polls
router.get('/', async (req, res) => {
  try {
    const polls = await Poll.find().populate('creator', 'username');
    res.json(polls);
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});

// Create poll - ADMIN ONLY
router.post('/', auth, async (req, res) => {
  if (!req.user.isAdmin) {
    return res.status(403).json({ msg: 'Only admin can create polls' });
  }

  const { question, options } = req.body;
  try {
    const poll = new Poll({
      question,
      options: options.map(opt => ({ text: opt })),
      creator: req.user.id,
    });
    await poll.save();
    res.json(poll);
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});

// Vote - LOGGED-IN USER
router.post('/:id/vote', auth, async (req, res) => {
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

module.exports = router;