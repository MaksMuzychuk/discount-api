import { Router } from 'express';
import { v4 as uuidv4 } from 'uuid';

import {
  addDiscount,
  getAllDiscounts,
  getDiscountByCountry,
  getDiscountsByWebsite,
  deleteDiscount,
} from '../services/discounts.js';
import { authenticateJWT } from '../utils/userUtils.js';
import { addWebsite } from '../services/websites.js';

const auth_users = Router();

// Add Website
auth_users.post('/auth/website/add', authenticateJWT, async (req, res) => {
  const websiteId = uuidv4();
  const userId = req.user.user.userId;
  const website = req.body.website;

  const result = await addWebsite({ websiteId, userId, website });
  if (result) {
    return res.status(200).json({ message: `A website successfully added.` });
  } else {
    return res.status(400).json({ message: 'Unable to add a website.' });
  }
});

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

export const auth_routes = auth_users;
