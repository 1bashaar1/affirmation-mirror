const Stripe = require('stripe');
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

async function createCheckoutSession(email) {
  return await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    mode: 'subscription',
    line_items: [
      {
        price_data: {
          currency: 'usd',
          product_data: { name: 'Pro Mirror Subscription' },
          unit_amount: 500,
          recurring: { interval: 'month' },
        },
        quantity: 1,
      },
    ],
    success_url: `${process.env.CLIENT_URL}/success`,
    cancel_url: `${process.env.CLIENT_URL}/cancel`,
    customer_email: email,
  });
}

module.exports = { createCheckoutSession };