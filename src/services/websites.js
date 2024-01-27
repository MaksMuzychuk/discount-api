import {
  QueryCommand,
  PutCommand,
  GetCommand,
  DeleteCommand,
} from '@aws-sdk/lib-dynamodb';

import { docClient } from '../utils/dynamodb.js';
import { deleteDiscountsByWebsiteId } from './discounts.js';

const websites = 'Websites';

// Add Website
export const addWebsite = async (website) => {
  const command = new PutCommand({
    TableName: websites,
    Item: {
      WebsiteId: website.websiteId,
      UserId: website.userId,
      Website: website.website,
    },
  });

  const response = await docClient.send(command);
  return response;
};

// Get all Websites by UserId
export const getWebsitesByUserId = async (userId) => {
  const command = new QueryCommand({
    IndexName: 'UserId-Index',
    TableName: websites,
    KeyConditionExpression: 'UserId = :userId',
    ExpressionAttributeValues: {
      ':userId': userId,
    },
    ConsistentRead: false,
  });
  const response = await docClient.send(command);
  return response.Items;
};

// Get Website by WebsiteId
export const getWebsiteByWebsiteId = async (websiteId) => {
  const command = new GetCommand({
    TableName: websites,
    Key: {
      WebsiteId: websiteId,
    },
  });

  const response = await docClient.send(command);
  return response.Item;
};

// Get Website by Website
export const getWebsiteByWebsite = async (website) => {
  const command = new QueryCommand({
    IndexName: 'Website-Index',
    TableName: websites,
    KeyConditionExpression: 'Website = :website',
    ExpressionAttributeValues: {
      ':website': website,
    },
    ConsistentRead: false,
  });
  const response = await docClient.send(command);
  return response.Items;
};

// Get Website by UserId by Website
export const getWebsitesByUserIdByWebsite = async (userId, website) => {
  const command = new QueryCommand({
    IndexName: 'Website-Index',
    TableName: websites,
    KeyConditionExpression: 'Website = :website and UserId = :userId',
    ExpressionAttributeValues: {
      ':website': website,
      ':userId': userId,
    },
    ConsistentRead: false,
  });
  const response = await docClient.send(command);
  return response.Items;
};

// Delete Website by WebsiteId
export const deleteWebsiteByWebsiteId = async (websiteId) => {
  const website = await getWebsiteByWebsiteId(websiteId);
  if (website === undefined) {
    return false;
  } else {
    const command = new DeleteCommand({
      TableName: websites,
      Key: {
        WebsiteId: websiteId,
      },
    });

    await docClient.send(command);
    await deleteDiscountsByWebsiteId(websiteId);
    return true;
  }
};

// Delete all Websites by UserId
export const deleteWebsitesByUserId = async (userId) => {
  const websites = await getWebsitesByUserId(userId);
  if (websites.length === 0) {
    return false;
  } else {
    for (let i = 0; i < websites.length; i++) {
      const websiteId = websites[i].WebsiteId;
      await deleteWebsiteByWebsiteId(websiteId);
    }
    return true;
  }
};
