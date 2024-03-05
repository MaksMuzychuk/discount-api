import express from 'express';
import cors from 'cors';
import jwt from 'jsonwebtoken';
import session from 'express-session';
import { auth_routes } from './router/authUsers.js';
import { public_routes } from './router/publicUsers.js';
import { admin_routes } from './router/adminUsers.js';

const app = express();

app.use(cors());
app.use(
  session({
    secret: '23h4kjsgdfjhdhd',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: true },
  })
);

app.use(
  '/customer',
  session({
    secret: 'fingerprint_customer',
    resave: true,
    saveUninitialized: true,
  })
);

app.use('/customer/auth/*', function auth(req, res, next) {
  if (req.session.authorization) {
    token = req.session.authorization['accessToken'];
    jwt.verify(token, 'access', (err, user) => {
      if (!err) {
        req.user = user;
        next();
      } else {
        return res.status(403).json({ message: 'User not authenticated.' });
      }
    });
  } else {
    return res.status(403).json({ message: 'User not logged in.' });
  }
});

const PORT = 5000;

app.use('/', auth_routes);
app.use('/', public_routes);
app.use('/', admin_routes);

app.listen(PORT, () => console.log('Server is running'));
