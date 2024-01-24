import { docClient } from '../utils/dynamodb.js';

import {
  QueryCommand,
  PutCommand,
  ScanCommand,
  GetCommand,
  DeleteCommand,
} from '@aws-sdk/lib-dynamodb';

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
