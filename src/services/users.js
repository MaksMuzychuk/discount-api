import {
  QueryCommand,
  UpdateCommand,
  PutCommand,
  ScanCommand,
  GetCommand,
  DeleteCommand,
} from '@aws-sdk/lib-dynamodb';

import MD5 from '../utils/MD5.js';
import { docClient } from '../utils/dynamodb.js';
import { addWebsite, deleteWebsitesByUserId } from './websites.js';

const users = 'Users';

// Add User
export const addUser = async (
  userId,
  email,
  password,
  company,
  websiteId,
  website,
  plan,
  discountCount
) => {
  const passwordHash = MD5(password);

  const command = new PutCommand({
    TableName: users,
    Item: {
      UserId: userId,
      Email: email,
      Password: passwordHash,
      Company: company,
      Plan: plan,
      DiscountCount: discountCount,
    },
  });

  const response = await docClient.send(command);

  await addWebsite({ websiteId, userId, website });
  return response;
};

// Authentification User
export const authenticatedUser = async (email, password) => {
  const queryPassword = MD5(password);
  const user = await getUserByEmail(email);
  if (user) {
    if (email == user[0].Email && queryPassword == user[0].Password) {
      return true;
    } else {
      return false;
    }
  } else {
    return false;
  }
};

// Get all Users
export const getAllUsers = async () => {
  const command = new ScanCommand({
    ProjectionExpression: '#Name, Email, Company',
    ExpressionAttributeNames: { '#Name': 'UserId' },
    TableName: users,
  });

  const response = await docClient.send(command);
  return response.Items;
};

// Get User by UserId
export const getUserByUserId = async (userId) => {
  const command = new GetCommand({
    TableName: users,
    Key: {
      UserId: userId,
    },
  });

  const response = await docClient.send(command);
  return response.Item;
};

// Get User by Email
export const getUserByEmail = async (email) => {
  const command = new QueryCommand({
    IndexName: 'Email-Index',
    TableName: users,
    KeyConditionExpression: 'Email = :email',
    ExpressionAttributeValues: {
      ':email': email,
    },
    ConsistentRead: false,
  });

  const response = await docClient.send(command);
  return response.Items;
};

// Delete User by UserId
export const deleteUser = async (userId) => {
  const user = await getUserByUserId(userId);
  if (user === undefined) {
    return false;
  } else {
    const command = new DeleteCommand({
      TableName: users,
      Key: {
        UserId: userId,
      },
    });

    const response = await docClient.send(command);
    await deleteWebsitesByUserId(userId);
    return true;
  }
};

// Update Discount Count
export const updateDiscountCount = async (userId) => {
  const user = await getUserByUserId(userId);
  if (user === undefined) {
    return false;
  } else {
    const command = new UpdateCommand({
      TableName: users,
      Key: {
        UserId: userId,
      },
      UpdateExpression:
        'set DiscountCount = if_not_exists(DiscountCount, :start) + :inc',
      ExpressionAttributeValues: {
        ':start': 0,
        ':inc': 1,
      },
    });

    await docClient.send(command);
    return true;
  }
};
