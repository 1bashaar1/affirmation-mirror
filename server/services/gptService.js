const { Configuration, OpenAIApi } = require('openai');
require('dotenv').config();

const openai = new OpenAIApi(
  new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
  })
);

exports.generateAffirmation = async (input) => {
  const messages = [
    {
      role: 'system',
      content: 'You are an AI life coach that gives short, emotionally uplifting affirmations.'
    },
    {
      role: 'user',
      content: `Someone said: "${input}". Please return 3 short, gentle affirmations to help them feel stronger.`
    }
  ];

  const response = await openai.createChatCompletion({
    model: 'gpt-4',
    messages,
    temperature: 0.7
  });

  const result = response.data.choices[0].message.content;
  return result.trim();
};
