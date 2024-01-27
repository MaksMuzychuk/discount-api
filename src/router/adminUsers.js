import { Router } from 'express';

import { authenticateJWT } from '../utils/userUtils.js';
import {
  getAllUsers,
  getUserByUserId,
  getUserByEmail,
  deleteUser,
} from '../services/users.js';

const admin_users = Router();

// Get all Users
admin_users.get('/admin/users', authenticateJWT, async (req, res) => {
  const results = await getAllUsers();
  return res.status(200).json(results);
});

// Get User by UserId
admin_users.get('/admin/user/:userId', authenticateJWT, async (req, res) => {
  const userId = req.params.userId;
  const result = await getUserByUserId(userId);
  if (!result) {
    res.status(404).json({ error: 'Not found' });
  } else {
    res.status(200).json(result);
  }
});

// Get User by Email
admin_users.get(
  '/admin/user/email/:email',
  authenticateJWT,
  async (req, res) => {
    const email = req.params.email;
    const result = await getUserByEmail(email);
    if (!result || result.length == 0) {
      res.status(404).json({ error: 'Not found' });
    } else {
      res.status(200).json(result);
    }
  }
);

// Delete User
admin_users.delete('/admin/user/:userId', authenticateJWT, async (req, res) => {
  const userId = req.params.userId;
  const result = await deleteUser(userId);
  if (result) {
    res.status(200).json({ result: 'User has been removed.' });
  } else {
    res.status(404).json({ error: 'User does not exist.' });
  }
});

export const admin_routes = admin_users;
