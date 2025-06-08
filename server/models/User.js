const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  isPro: { type: Boolean, default: false },
  dailyQuota: { type: Number, default: 3 },
  lastUsed: { type: Date, default: null },
  affirmations: [{ text: String, date: Date }]
});

module.exports = mongoose.model('User', userSchema);