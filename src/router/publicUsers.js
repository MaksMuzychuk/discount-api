import { Router } from 'express';
import pkg from 'jsonwebtoken';
import {
  isValidEmail,
  doesExist,
  authenticatedUser,
} from '../services/users.js';
import { createUser } from '../services/users.js';
import { accessTokenSecret } from '../utils/accessTokenSecret.js';

const { sign } = pkg;

const public_users = Router();

// Register new User
public_users.post('/register', async (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  const company = req.body.company;
  const website = req.body.website;

  if (isValidEmail(email) && password) {
    if (!(await doesExist(email))) {
      createUser(email, password, company, website);
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

  if (!email || !password) {
    return res.status(404).json({ message: 'Error loging in.' });
  }

  if (await authenticatedUser(email, password)) {
    let accessToken = sign(
      {
        user: {
          id: 'unknown',
          email: email,
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
