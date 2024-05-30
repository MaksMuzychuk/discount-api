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
  getDiscountByProduct,
} from '../services/discounts.js';
import {
  addWebsite,
  getWebsitesByUserId,
  getWebsiteByWebsiteId,
  getWebsiteByWebsite,
  deleteWebsiteByWebsiteId,
  deleteWebsitesByUserId,
} from '../services/websites.js';
import { getUserByUserId, updateDiscountCount } from '../services/users.js';

const auth_users = Router();

// ------------------------------   Websites   ---------------------------------

// Add Website
auth_users.post('/auth/websites/add', async (req, res) => {
  const websiteId = uuidv4();
  const userId = req.body.userId;
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
auth_users.get('/auth/websites/:userId', async (req, res) => {
  const userId = req.params.userId;
  const result = await getWebsitesByUserId(userId);
  if (!result || result.length == 0) {
    res.status(404).json({ error: 'Not found' });
  } else {
    res.status(200).json(result);
  }
});

// Get Website by WebsiteId
auth_users.get('/auth/websites/websiteId/:websiteId', async (req, res) => {
  const websiteId = req.params.websiteId;
  const result = await getWebsiteByWebsiteId(websiteId);
  if (!result) {
    res.status(404).json({ error: 'Not found' });
  } else {
    res.status(200).json(result);
  }
});

// Get Website by Website
auth_users.get('/auth/websites/website/:website', async (req, res) => {
  const website = req.params.website;
  const result = await getWebsiteByWebsite(website);
  if (!result || result.length == 0) {
    res.status(404).json({ error: 'Not found' });
  } else {
    res.status(200).json(result);
  }
});

// Delete Website by WebsiteId
auth_users.delete('/auth/websites/websiteId/:websiteId', async (req, res) => {
  const websiteId = req.params.websiteId;
  const result = await deleteWebsiteByWebsiteId(websiteId);
  if (result) {
    return res.status(200).json({ message: `Website successfully removed.` });
  } else {
    return res.status(400).json({ message: 'Unable to remove a website.' });
  }
});

// Delete all Websites by UserId
auth_users.delete('/auth/websites/:userId', async (req, res) => {
  const userId = req.params.userId;
  const result = await deleteWebsitesByUserId(userId);
  if (result) {
    return res.status(200).json({ message: `Websites successfully removed.` });
  } else {
    return res.status(400).json({ message: 'Unable to remove websites.' });
  }
});

// ------------------------------   Discounts   ---------------------------------

// Add Discount
auth_users.post('/auth/discounts/add', async (req, res) => {
  const userId = req.body.userId;
  const websiteId = req.body.websiteId;
  const discountId = uuidv4();
  const product = req.body.product;
  const country = req.body.country;
  const code = req.body.code;
  const text = req.body.text;
  const existDiscount = await doesExistDiscount(websiteId, country, product);

  if (existDiscount) {
    const result = await addDiscount({
      websiteId,
      userId,
      discountId,
      product,
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
auth_users.get('/auth/discounts/websiteId/:websiteId', async (req, res) => {
  const websiteId = req.params.websiteId;
  const result = await getDiscountsByWebsiteId(websiteId);
  if (!result || result.length == 0) {
    res.status(404).json({ error: 'Not found' });
  } else {
    res.status(200).json(result);
  }
});

// Get Discount by DiscountId
auth_users.get('/auth/discounts/discountId/:discountId', async (req, res) => {
  const discountId = req.params.discountId;
  const result = await getDiscountByDiscountId(discountId);
  const userId = result.UserId;
  const user = await getUserByUserId(userId);
  const discountCount = user.DiscountCount;
  const userPlan = user.Plan;
  if (
    (discountCount >= 100000 && userPlan == 'Pro') ||
    (discountCount >= 100 && userPlan == 'Standart')
  ) {
    return res.status(403).json({ error: 'Requests Limit' });
  }
  if (!result) {
    return res.status(404).json({ error: 'Not found' });
  }
  await updateDiscountCount(userId);
  return res.status(200).json(result);
});

// Get Discount by Country
auth_users.get('/auth/discounts/country/:country', async (req, res) => {
  const country = req.params.country;
  const result = await getDiscountByCountry(country);
  if (!result || result.length == 0) {
    res.status(404).json({ error: 'Not found' });
  } else {
    res.status(200).json(result);
  }
});

// Get Discount by Product
auth_users.get('/auth/discounts/product/:product', async (req, res) => {
  const product = req.params.product;
  const result = await getDiscountByProduct(product);
  if (!result || result.length == 0) {
    res.status(404).json({ error: 'Not found' });
  } else {
    res.status(200).json(result);
  }
});

// Delete Discount by DiscountId
auth_users.delete(
  '/auth/discounts/discountId/:discountId',
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
auth_users.delete('/auth/discounts/websiteId/:websiteId', async (req, res) => {
  const websiteId = req.params.websiteId;
  const result = await deleteDiscountsByWebsiteId(websiteId);
  if (result) {
    return res.status(200).json({ message: `Discounts successfully removed.` });
  } else {
    return res.status(400).json({ message: 'Unable to remove discounts.' });
  }
});

export const auth_routes = auth_users;
