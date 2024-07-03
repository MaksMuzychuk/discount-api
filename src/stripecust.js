import { createStripeCustomer } from './services/users.js';
(async () => {
  console.log(await createStripeCustomer({ email: 'maks@Qgmail.com' }));
})();
