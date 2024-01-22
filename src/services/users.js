import MD5 from '../utils/MD5.js';
import { accessTokenSecret } from '../utils/accessTokenSecret.js';
import pkg from 'jsonwebtoken';
import { docClient } from '../utils/dynamodb.js';
const { verify } = pkg;

import {
  QueryCommand,
  PutCommand,
  ScanCommand,
  GetCommand,
  DeleteCommand,
} from '@aws-sdk/lib-dynamodb';

const users = 'Users';

// Validation Email
export const isValidEmail = (email) => {
  return email && typeof email === 'string' && email.length > 2;
};

// Does Exist User
export const doesExist = async (email) => {
  const user = await getUserByEmail(email);
  if (user === undefined) {
    return false;
  } else {
    return true;
  }
};

// Create new User
export const createUser = async (email, password, company, website) => {
  const passwordHash = MD5(password);
  const command = new PutCommand({
    TableName: users,
    Item: {
      Email: email,
      Password: passwordHash,
      Company: company,
      Website: website,
    },
  });

  await docClient.send(command);
  return true;
};

// Get all Users
export const getAllUsers = async () => {
  const command = new ScanCommand({
    ProjectionExpression: '#Name, Company, Website',
    ExpressionAttributeNames: { '#Name': 'Email' },
    TableName: users,
  });

  const response = await docClient.send(command);
  return response.Items;
};

// Get User by Email
export const getUserByEmail = async (email) => {
  const command = new GetCommand({
    TableName: users,
    Key: {
      Email: email,
    },
  });

  const response = await docClient.send(command);
  return response.Item;
};

// Get User by Email and Password
export const authenticatedUser = async (email, password) => {
  const queryPassword = MD5(password);
  const user = await getUserByEmail(email);
  if (user) {
    if (email == user.Email && queryPassword == user.Password) {
      return true;
    } else {
      return false;
    }
  } else {
    return false;
  }
};

// Get User by Website
export const getUserByWebsite = async (website) => {
  const command = new QueryCommand({
    IndexName: 'WebsiteIndex',
    TableName: users,
    KeyConditionExpression: 'Website = :website',
    ExpressionAttributeValues: {
      ':website': website,
    },
    ConsistentRead: false,
  });
  const response = await docClient.send(command);
  return response.Items;
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

// Delete User  by Email
export const deleteUser = async (email) => {
  const user = await getUserByEmail(email);

  if (user === undefined) {
    return false;
  } else {
    const command = new DeleteCommand({
      TableName: users,
      Key: {
        Email: email,
      },
    });

    const response = await docClient.send(command);
    return true;
  }
};
