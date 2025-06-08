const { transcribeAudio } = require('../services/whisperService');
const { generateAffirmation } = require('../services/gptService');
const User = require('../models/User');

exports.handleAffirmation = async (req, res) => {
  try {
    const audioBuffer = req.file?.buffer;

    if (!audioBuffer) return res.status(400).json({ error: 'No audio uploaded' });

    const transcribedText = await transcribeAudio(audioBuffer);
    const affirmations = await generateAffirmation(transcribedText);

    // Optional: save affirmations to user if email is sent
    const { email } = req.body;
    if (email) {
      let user = await User.findOne({ email });
      if (!user) user = new User({ email, affirmations: [] });

      user.affirmations.push(affirmations);
      await user.save();
    }

    res.json({ affirmations });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Something went wrong' });
  }
};

