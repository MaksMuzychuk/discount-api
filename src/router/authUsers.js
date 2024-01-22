import { Router } from 'express';
import {
  authenticateJWT,
  getAllUsers,
  getUserByEmail,
  getUserByWebsite,
  deleteUser,
} from '../services/users.js';

import {
  getAllDiscounts,
  getDiscountByCountry,
  getDiscountsByWebsite,
  addDiscount,
  deleteDiscount,
} from '../services/discounts.js';

const auth_users = Router();

// Add new Discount
auth_users.post('/auth/discounts/new', authenticateJWT, async (req, res) => {
  const country = req.body.country;
  const code = req.body.code;
  const message = req.body.message;
  const website = req.body.website;

  const result = await addDiscount({ country, code, message, website });
  if (result) {
    return res.status(200).json({ message: `A discount successfully added.` });
  } else {
    return res.status(400).json({ message: 'Unable to add a discount.' });
  }
});

// Get all Discounts
auth_users.get('/auth/discounts', authenticateJWT, async (req, res) => {
  const results = await getAllDiscounts();
  return res.status(200).json(results);
});

// Get Discount by Country
auth_users.get(
  '/auth/discounts/country/:country',
  authenticateJWT,
  async (req, res) => {
    const country = req.params.country;
    const result = await getDiscountByCountry(country);
    if (!result) {
      res.status(404).json({ error: 'Not found' });
    } else {
      res.status(200).json(result);
    }
  }
);

// Get Discounts by Website
auth_users.get(
  '/auth/discounts/website/:website',
  authenticateJWT,
  async (req, res) => {
    const website = req.params.website;
    const result = await getDiscountsByWebsite(website);
    if (!result || result.length == 0) {
      res.status(404).json({ error: 'Not found' });
    } else {
      res.status(200).json(result);
    }
  }
);

// Delete a Discount
auth_users.delete(
  '/auth/discounts/country/:country',
  authenticateJWT,
  async (req, res) => {
    const country = req.params.country;
    const result = await deleteDiscount(country);
    if (result) {
      return res
        .status(200)
        .json({ message: `Discount successfully removed.` });
    } else {
      return res.status(400).json({ message: 'Unable to remove a discount.' });
    }
  }
);

// Get User by Website
auth_users.get(
  '/auth/user/website/:website',
  authenticateJWT,
  async (req, res) => {
    const website = req.params.website;
    const result = await getUserByWebsite(website);
    if (!result || result.length == 0) {
      res.status(404).json({ error: 'Not found' });
    } else {
      res.status(200).json(result);
    }
  }
);

// Remove User
auth_users.delete('/auth/user/:email', authenticateJWT, async (req, res) => {
  const email = req.params.email;
  const result = await deleteUser(email);
  if (result) {
    res.status(200).json({ result: 'User has been removed.' });
  } else {
    res.status(404).json({ error: 'User does not exist.' });
  }
});

// ------------------ For Tests -----------------------

// Get all Users
auth_users.get('/auth/users', authenticateJWT, async (req, res) => {
  const results = await getAllUsers();
  return res.status(200).json(results);
});

// Get User by Email
auth_users.get('/auth/user/:email', authenticateJWT, async (req, res) => {
  const email = req.params.email;
  const result = await getUserByEmail(email);
  if (!result) {
    res.status(404).json({ error: 'Not found' });
  } else {
    res.status(200).json(result);
  }
});

export const auth_routes = auth_users;
