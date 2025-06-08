const { sendAffirmationEmail } = require('./emailService');
const { generateAffirmation } = require('../services/gptService');
const mongoose = require('mongoose');
const User = require('../models/User');
require('dotenv').config();

mongoose.connect(process.env.MONGO_URI);

(async () => {
  const users = await User.find({}); // Optionally filter Pro users here
  for (const user of users) {
    const affirmations = await generateAffirmation("Daily encouragement");
    await sendAffirmationEmail(user.email, affirmations);
    console.log(`Sent to ${user.email}`);
  }

  mongoose.disconnect();
})();
