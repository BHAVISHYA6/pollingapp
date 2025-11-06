const mongoose = require('mongoose');

const optionSchema = new mongoose.Schema({
  text: { type: String, required: true },
  votes: { type: Number, default: 0 }
});

const pollSchema = new mongoose.Schema({
  question: { type: String, required: true },
  options: [optionSchema],

  // Store Cognito UUID instead of Mongo ObjectId
  creator: { type: String, required: true },  

  // Also store voter IDs (UUIDs) as strings
  voters: [{ type: String }],

}, { timestamps: true });

module.exports = mongoose.model('Poll', pollSchema);