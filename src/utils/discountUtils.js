import { getDiscountByWebsiteIdByCountry } from '../services/discounts.js';

// Does Exist Website by User
export const doesExistDiscount = async (websiteId, country) => {
  const discounts = await getDiscountByWebsiteIdByCountry(websiteId, country);
  if (discounts[0] === undefined) {
    return true;
  } else {
    return false;
  }
};
