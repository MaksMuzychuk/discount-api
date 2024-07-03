import Stripe from 'stripe';
import express from 'express';
import dotenv from 'dotenv';

import { createCustomerSubscription } from '../services/users.js';
import { getSecret } from '../utils/secrets.js';

dotenv.config();

const webhook_router = express.Router();

webhook_router.post(
  '/webhook',
  express.raw({ type: 'application/json' }),
  async (request, response) => {
    const sig = request.headers['stripe-signature'];
    const stripe = new Stripe(await getSecret('STRIPE_SK'));
    const endpointSecret = await getSecret('STRIPE_WEBHOOK');
    let event;

    try {
      event = stripe.webhooks.constructEvent(
        request.rawBody,
        sig,
        endpointSecret
      );
    } catch (err) {
      console.log(err);
      response.status(400).send(`Webhook Error: ${err.message}`);
      return;
    }

    // Handle the event
    switch (event.type) {
      case 'customer.subscription.created':
        const customerSubscriptionCreated = event.data.object;
        createCustomerSubscription(customerSubscriptionCreated);
        break;
      case 'customer.subscription.deleted':
        const customerSubscriptionDeleted = event.data.object;
        // Then define and call a function to handle the event customer.subscription.deleted
        break;
      // ... handle other event types
      default:
        console.log(`Unhandled event type ${event.type}`);
    }

    // Return a 200 response to acknowledge receipt of the event
    response.send();
  }
);

export { webhook_router };
