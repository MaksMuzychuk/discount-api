import { Router } from 'express';
import pkg from 'jsonwebtoken';
import {
  isValidUsername,
  doesExist,
  authenticatedUser,
} from '../services/users.js';
import { createUser } from '../services/users.js';
import { accessTokenSecret } from '../services/accessTokenSecret.js';

const { sign } = pkg;

const public_users = Router();

// Register new User
public_users.post('/register', async (req, res) => {
  const username = req.body.username;
  const password = req.body.password;
  const company = req.body.company;
  const website = req.body.website;

  if (isValidUsername(username) && password) {
    if (!(await doesExist(username))) {
      createUser(username, password, company, website);
      return res
        .status(200)
        .json({ message: `${username} successfully registred.` });
    } else {
      return res.status(404).json({ message: `${username} already exists.` });
    }
  }
  return res.status(404).json({ message: 'Unable to register user.' });
});

// Login public User
public_users.post('/login', async (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (!username || !password) {
    return res.status(404).json({ message: 'Error loging in.' });
  }

  if (await authenticatedUser(username, password)) {
    let accessToken = sign(
      {
        user: {
          id: 'unknown',
          username: username,
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
