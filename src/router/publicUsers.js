import { Router } from 'express';
import { v4 as uuidv4 } from 'uuid';
import pkg from 'jsonwebtoken';

import {
  authenticatedUser,
  addUser,
  getUserByEmail,
} from '../services/users.js';
import {
  isValidEmail,
  doesExistEmail,
  doesExistUserId,
} from '../utils/userUtils.js';
import { accessTokenSecret } from '../utils/accessTokenSecret.js';

const { sign } = pkg;

const public_users = Router();

// Register new User
public_users.post('/register', async (req, res) => {
  const userId = uuidv4();
  const email = req.body.email;
  const password = req.body.password;
  const company = req.body.company;
  const websiteId = uuidv4();
  const website = req.body.website;

  if (isValidEmail(email) && password) {
    const existEmail = await doesExistEmail(email);
    const existUserId = await doesExistUserId(userId);
    if (existEmail && existUserId) {
      addUser(userId, email, password, company, websiteId, website);
      return res
        .status(200)
        .json({ message: `${email} successfully registred.` });
    } else {
      return res.status(404).json({ message: `${email} already exists.` });
    }
  }
  return res.status(404).json({ message: 'Unable to register user.' });
});

// Login public User
public_users.post('/login', async (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  const user = await getUserByEmail(email);

  if (!email || !password) {
    return res.status(404).json({ message: 'Error loging in.' });
  }

  if (await authenticatedUser(email, password)) {
    let accessToken = sign(
      {
        user: {
          id: 'unknown',
          email: email,
          userId: user[0].UserId,
        },
      },
      accessTokenSecret,
      { expiresIn: 3600 }
    );
    return res.status(200).send({ accessToken });
  } else {
    return res.status(208).json({ message: 'Invalid Login.' });
  }
});

export const public_routes = public_users;
