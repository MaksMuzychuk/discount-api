import { getWebsitesByUserIdByWebsite } from '../services/websites.js';

// Does Exist Website by User
export const doesExistWebsite = async (userId, website) => {
  const websites = await getWebsitesByUserIdByWebsite(userId, website);
  if (websites[0] === undefined) {
    return true;
  } else {
    return false;
  }
};
