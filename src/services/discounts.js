import {
  QueryCommand,
  PutCommand,
  GetCommand,
  DeleteCommand,
} from '@aws-sdk/lib-dynamodb';

import { docClient } from '../utils/dynamodb.js';

const discounts = 'Discounts';

// Add Discount
export const addDiscount = async (discount) => {
  const command = new PutCommand({
    TableName: discounts,
    Item: {
      DiscountId: discount.discountId,
      WebsiteId: discount.websiteId,
      UserId: discount.userId,
      Product: discount.product,
      Country: discount.country,
      Code: discount.code,
      Text: discount.text,
    },
  });

  const response = await docClient.send(command);
  return response;
};

// Get all Discounts by WebsiteId
export const getDiscountsByWebsiteId = async (websiteId) => {
  const command = new QueryCommand({
    IndexName: 'WebsiteId-Index',
    TableName: discounts,
    KeyConditionExpression: 'WebsiteId = :websiteId',
    ExpressionAttributeValues: {
      ':websiteId': websiteId,
    },
    ConsistentRead: false,
  });

  const response = await docClient.send(command);
  return response.Items;
};

// Get Discount by DiscountId
export const getDiscountByDiscountId = async (discountId) => {
  const command = new GetCommand({
    TableName: discounts,
    Key: {
      DiscountId: discountId,
    },
  });

  const response = await docClient.send(command);
  return response.Item;
};

// Get Discount by Country
export const getDiscountByCountry = async (country) => {
  const command = new QueryCommand({
    IndexName: 'Country-Index',
    TableName: discounts,
    KeyConditionExpression: 'Country = :country',
    ExpressionAttributeValues: {
      ':country': country,
    },
    ConsistentRead: false,
  });

  const response = await docClient.send(command);
  return response.Items;
};

// Get Discount by Product
export const getDiscountByProduct = async (product) => {
  const command = new QueryCommand({
    IndexName: 'Product-Index',
    TableName: discounts,
    KeyConditionExpression: 'Product = :product',
    ExpressionAttributeValues: {
      ':product': product,
    },
    ConsistentRead: false,
  });

  const response = await docClient.send(command);
  return response.Items;
};

// Get Discount by WebsiteId and Country
export const getDiscountByWebsiteIdByCountry = async (websiteId, country) => {
  const command = new QueryCommand({
    IndexName: 'Country-Index',
    TableName: discounts,
    KeyConditionExpression: 'WebsiteId = :websiteId and Country = :country',
    ExpressionAttributeValues: {
      ':websiteId': websiteId,
      ':country': country,
    },
    ConsistentRead: false,
  });

  const response = await docClient.send(command);
  return response.Items;
};

// Delete Discount by DiscountId
export const deleteDiscountByDiscountId = async (discountId) => {
  const discount = await getDiscountByDiscountId(discountId);
  if (discount === undefined) {
    return false;
  } else {
    const command = new DeleteCommand({
      TableName: discounts,
      Key: {
        DiscountId: discountId,
      },
    });

    await docClient.send(command);
    return true;
  }
};

// Delete all Discounts by WebsiteId
export const deleteDiscountsByWebsiteId = async (websiteId) => {
  const discounts = await getDiscountsByWebsiteId(websiteId);
  if (discounts.length === 0) {
    return false;
  } else {
    for (let i = 0; i < discounts.length; i++) {
      const discountId = discounts[i].DiscountId;
      await deleteDiscountByDiscountId(discountId);
    }
    return true;
  }
};
