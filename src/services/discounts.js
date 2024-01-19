import { docClient } from '../utils/dynamodb.js';

import {
  QueryCommand,
  PutCommand,
  ScanCommand,
  GetCommand,
  DeleteCommand,
} from '@aws-sdk/lib-dynamodb';

const discounts = 'Discounts';

// Add new Discount
export const addDiscount = async (discount) => {
  const command = new PutCommand({
    TableName: discounts,
    Item: {
      Country: discount.country,
      Code: discount.code,
      Message: discount.message,
      Website: discount.website,
    },
  });

  const response = await docClient.send(command);
  return true;
};

// Get all Discounts
export const getAllDiscounts = async () => {
  const command = new ScanCommand({
    ProjectionExpression: '#Name, Code, Message, Website',
    ExpressionAttributeNames: { '#Name': 'Country' },
    TableName: discounts,
  });

  const response = await docClient.send(command);
  return response.Items;
};

// Get Discount by Country
export const getDiscountByCountry = async (country) => {
  const command = new GetCommand({
    TableName: discounts,
    Key: {
      Country: country,
    },
  });

  const response = await docClient.send(command);
  return response.Item;
};

// Get Discounts by Website
export const getDiscountsByWebsite = async (website) => {
  const command = new QueryCommand({
    IndexName: 'WebsiteIndex',
    TableName: discounts,
    KeyConditionExpression: 'Website = :website',
    ExpressionAttributeValues: {
      ':website': website,
    },
    ConsistentRead: false,
  });
  const response = await docClient.send(command);
  return response.Items;
};

// Delete Discount
export const deleteDiscount = async (country) => {
  const discount = await getDiscountByCountry(country);
  if (discount === undefined) {
    return false;
  } else {
    const command = new DeleteCommand({
      TableName: discounts,
      Key: {
        Country: country,
      },
    });

    await docClient.send(command);
    return true;
  }
};
