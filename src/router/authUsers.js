import { Router } from 'express';
import { v4 as uuidv4 } from 'uuid';

import { authenticateJWT } from '../utils/userUtils.js';
import { doesExistWebsite } from '../utils/websiteUtils.js';
import { doesExistDiscount } from '../utils/discountUtils.js';
import {
  addDiscount,
  getDiscountsByWebsiteId,
  getDiscountByDiscountId,
  getDiscountByCountry,
  deleteDiscountByDiscountId,
  deleteDiscountsByWebsiteId,
} from '../services/discounts.js';
import {
  addWebsite,
  getWebsitesByUserId,
  getWebsiteByWebsiteId,
  getWebsiteByWebsite,
  deleteWebsiteByWebsiteId,
  deleteWebsitesByUserId,
} from '../services/websites.js';

const auth_users = Router();

// ------------------------------   Websites   ---------------------------------

// Add Website
auth_users.post('/auth/websites/add', authenticateJWT, async (req, res) => {
  const websiteId = uuidv4();
  const userId = req.user.user.userId;
  const website = req.body.website;
  const existWebsite = await doesExistWebsite(userId, website);

  if (existWebsite) {
    const result = await addWebsite({ websiteId, userId, website });
    if (result) {
      return res.status(200).json({ message: `A website successfully added.` });
    } else {
      return res.status(400).json({ message: 'Unable to add a website.' });
    }
  } else {
    return res.status(400).json({ message: `A website already exist` });
  }
});

// Get all Websites by UserId
auth_users.get('/auth/websites/', authenticateJWT, async (req, res) => {
  const userId = req.user.user.userId;
  const result = await getWebsitesByUserId(userId);
  if (!result || result.length == 0) {
    res.status(404).json({ error: 'Not found' });
  } else {
    res.status(200).json(result);
  }
});

// Get Website by WebsiteId
auth_users.get(
  '/auth/websites/:websiteId',
  authenticateJWT,
  async (req, res) => {
    const websiteId = req.params.websiteId;
    const result = await getWebsiteByWebsiteId(websiteId);
    if (!result) {
      res.status(404).json({ error: 'Not found' });
    } else {
      res.status(200).json(result);
    }
  }
);

// Get Website by Website
auth_users.get(
  '/auth/websites/website/:website',
  authenticateJWT,
  async (req, res) => {
    const website = req.params.website;
    const result = await getWebsiteByWebsite(website);
    if (!result || result.length == 0) {
      res.status(404).json({ error: 'Not found' });
    } else {
      res.status(200).json(result);
    }
  }
);

// Delete Website by WebsiteId
auth_users.delete(
  '/auth/websites/websiteId/:websiteId',
  authenticateJWT,
  async (req, res) => {
    const websiteId = req.params.websiteId;
    const result = await deleteWebsiteByWebsiteId(websiteId);
    if (result) {
      return res.status(200).json({ message: `Website successfully removed.` });
    } else {
      return res.status(400).json({ message: 'Unable to remove a website.' });
    }
  }
);

// Delete all Websites by UserId
auth_users.delete('/auth/websites', authenticateJWT, async (req, res) => {
  const userId = req.user.user.userId;
  const result = await deleteWebsitesByUserId(userId);
  if (result) {
    return res.status(200).json({ message: `Websites successfully removed.` });
  } else {
    return res.status(400).json({ message: 'Unable to remove websites.' });
  }
});

// ------------------------------   Discounts   ---------------------------------

// Add Discount
auth_users.post('/auth/discounts/add', authenticateJWT, async (req, res) => {
  const userId = req.user.user.userId;
  const websiteId = req.body.websiteId;
  const discountId = uuidv4();
  const country = req.body.country;
  const code = req.body.code;
  const text = req.body.text;
  const existDiscount = await doesExistDiscount(websiteId, country);

  if (existDiscount) {
    const result = await addDiscount({
      websiteId,
      userId,
      discountId,
      country,
      code,
      text,
    });
    if (result) {
      return res
        .status(200)
        .json({ message: `A discount successfully added.` });
    } else {
      return res.status(400).json({ message: 'Unable to add a discount.' });
    }
  } else {
    return res.status(400).json({ message: `A discount already exist` });
  }
});

// Get all Discounts by WebsiteId
auth_users.get(
  '/auth/discounts/websiteId/:websiteId',
  authenticateJWT,
  async (req, res) => {
    const websiteId = req.params.websiteId;
    const result = await getDiscountsByWebsiteId(websiteId);
    if (!result || result.length == 0) {
      res.status(404).json({ error: 'Not found' });
    } else {
      res.status(200).json(result);
    }
  }
);

// Get Discount by DiscountId
auth_users.get(
  '/auth/discounts/discountId/:discountId',
  authenticateJWT,
  async (req, res) => {
    const discountId = req.params.discountId;
    const result = await getDiscountByDiscountId(discountId);
    if (!result) {
      res.status(404).json({ error: 'Not found' });
    } else {
      res.status(200).json(result);
    }
  }
);

// Get Discount by Country
auth_users.get(
  '/auth/discounts/country/:country',
  authenticateJWT,
  async (req, res) => {
    const country = req.params.country;
    const result = await getDiscountByCountry(country);
    if (!result || result.length == 0) {
      res.status(404).json({ error: 'Not found' });
    } else {
      res.status(200).json(result);
    }
  }
);

// Delete Discount by DiscountId
auth_users.delete(
  '/auth/discounts/discountId/:discountId',
  authenticateJWT,
  async (req, res) => {
    const discountId = req.params.discountId;
    const result = await deleteDiscountByDiscountId(discountId);
    if (result) {
      return res
        .status(200)
        .json({ message: `Discount successfully removed.` });
    } else {
      return res.status(400).json({ message: 'Unable to remove a discount.' });
    }
  }
);

// Delete all Discounts by WebsiteId
auth_users.delete(
  '/auth/discounts/websiteId/:websiteId',
  authenticateJWT,
  async (req, res) => {
    const websiteId = req.params.websiteId;
    const result = await deleteDiscountsByWebsiteId(websiteId);
    if (result) {
      return res
        .status(200)
        .json({ message: `Discounts successfully removed.` });
    } else {
      return res.status(400).json({ message: 'Unable to remove discounts.' });
    }
  }
);

export const auth_routes = auth_users;
