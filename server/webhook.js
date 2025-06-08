const express = require('express');
const router = express.Router();
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const User = require('./models/User');

router.post('/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  const sig = req.headers['stripe-signature'];
  try {
    const event = stripe.webhooks.constructEvent(req.body, sig, process.env.WEBHOOK_SECRET);
    if (event.type === 'checkout.session.completed') {
      const { customer_email: email } = event.data.object;
      await User.findOneAndUpdate(
        { email },
        { $set: { isPro: true, dailyQuota: 9999 } },
        { upsert: true }
      );
    }
    res.json({ received: true });
  } catch (err) {
    res.status(400).send(`Webhook error: ${err.message}`);
  }
});

module.exports = router;