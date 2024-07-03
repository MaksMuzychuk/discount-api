import {
  QueryCommand,
  UpdateCommand,
  PutCommand,
  ScanCommand,
  GetCommand,
  DeleteCommand,
} from '@aws-sdk/lib-dynamodb';
import Stripe from 'stripe';

import MD5 from '../utils/MD5.js';
import { docClient } from '../utils/dynamodb.js';
import { addWebsite, deleteWebsitesByUserId } from './websites.js';
import { getSecret } from '../utils/secrets.js';

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
  const stripeCustomer = await createStripeCustomer({ email });
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
      StripeID: stripeCustomer.id,
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

export const createStripeCustomer = async (user) => {
  const stripe = new Stripe(await getSecret('STRIPE_SK'));
  const customer = await stripe.customers.create({
    email: user.email,
    name: user.email,
  });
  return customer;
};

export const updateUserPlan = async (userId, planId) => {
  const user = await getUserByUserId(userId);
  if (user === undefined) {
    return false;
  } else {
    const command = new UpdateCommand({
      TableName: users,
      Key: {
        UserId: userId,
      },
      UpdateExpression: 'set PlanName = :planId',
      ExpressionAttributeValues: {
        ':planId': planId,
      },
    });

    await docClient.send(command);
    return true;
  }
};

const getPlanIdByStripePlanId = (stripePlanId) => {
  const mapper = {
    price_1PJDf5DxaOiCj0kY9wPzimGh: 'Pro',
    '...': 'Standart',
  };
  return mapper[stripePlanId];
};

const getUserIdByStripeCustomerId = async (stripeId) => {
  const command = new QueryCommand({
    IndexName: 'StripeID-index',
    TableName: users,
    KeyConditionExpression: 'StripeID = :stripeId',
    ExpressionAttributeValues: {
      ':stripeId': stripeId,
    },
    ConsistentRead: false,
  });

  const response = await docClient.send(command);
  return response.Items[0].UserId;
};

export const createCustomerSubscription = async function (event) {
  const userId = await getUserIdByStripeCustomerId(event.customer);
  const planId = getPlanIdByStripePlanId(event.plan.id);
  await updateUserPlan(userId, planId);
  console.log(event);
  return;
};

export const deleteCustomerSubscription = async function (event) {
  const userId = await getUserIdByStripeCustomerId(event.customer);
  const planId = getPlanIdByStripePlanId(event.plan.id);
  await updateUserPlan(userId, planId);
  console.log(event);
  return;
};