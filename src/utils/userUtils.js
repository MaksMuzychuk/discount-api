import pkg from 'jsonwebtoken';

import { getUserByEmail, getUserByUserId } from '../services/users.js';
import { accessTokenSecret } from './accessTokenSecret.js';

const { verify } = pkg;

// Validation Email
export const isValidEmail = (email) => {
  return email && typeof email === 'string' && email.length > 2;
};

// Does Exist User Email
export const doesExistEmail = async (email) => {
  const user = await getUserByEmail(email);
  if (user[0] === undefined) {
    return true;
  } else {
    return false;
  }
};

// Does Exist UserId
export const doesExistUserId = async (userId) => {
  const user = await getUserByUserId(userId);
  if (user === undefined) {
    return true;
  } else {
    return false;
  }
};

// Authenticate JWT
export const authenticateJWT = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (authHeader) {
    const token = authHeader.split(' ')[1];

    verify(token, accessTokenSecret, (err, user) => {
      if (err) {
        return res.sendStatus(403);
      }

      req.user = user;
      next();
    });
  } else {
    res.sendStatus(401);
  }
};
