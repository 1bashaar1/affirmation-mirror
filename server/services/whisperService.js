const axios = require('axios');
const FormData = require('form-data');
require('dotenv').config();

exports.transcribeAudio = async (audioBuffer) => {
  const formData = new FormData();
  formData.append('file', audioBuffer, 'audio.webm');
  formData.append('model', 'whisper-1');

  const headers = {
    ...formData.getHeaders(),
    Authorization: `Bearer ${process.env.OPENAI_API_KEY}`
  };

  const response = await axios.post('https://api.openai.com/v1/audio/transcriptions', formData, { headers });
  return response.data.text;
};
