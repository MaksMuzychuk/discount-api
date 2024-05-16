import test from 'ava';
import axios from 'axios';
import dotenv from 'dotenv';
import { generateRandomPassword } from './utils/generatePassword.js';

dotenv.config();

const API_BASE_URL = `http://${process.env.SERVER_IP}:5000/`;
// const API_BASE_URL = `http://localhost:5000/`;

// -------------------------------   Tests Before   ----------------------------------

test.before(async (t) => {
  t.context.API = axios.create({
    baseURL: API_BASE_URL,
    timeout: 30000,
  });

  t.context.user = {
    email: 'maks' + Math.ceil(Math.random() * 100).toString() + '@gmail.com',
    password: generateRandomPassword(),
    company: 'Qwerty' + Math.ceil(Math.random() * 100).toString(),
    website: 'qwerty' + Math.ceil(Math.random() * 100).toString() + '.com',
  };

  const registerUser = await t.context.API.post(`/register`, t.context.user);
  t.is(registerUser.status, 200);

  // const loginUser = await t.context.API.post('/login', t.context.user);
  // t.is(loginUser.status, 200);

  // t.context.accessToken = {
  //   headers: {
  //     authorization: `Bearer ${loginUser.data.accessToken}`,
  //   },
  // };

  const getUserId = await t.context.API.get(
    `/admin/user/email/${t.context.user.email}`
    // t.context.accessToken
  );
  t.context.userId = getUserId.data[0].UserId;

  t.context.website = {
    website: t.context.user.website,
    userId: t.context.userId,
  };

  const getWebsiteId = await t.context.API.get(
    `/auth/websites/website/${t.context.user.website}`
    // t.context.accessToken
  );
  t.context.websiteId = getWebsiteId.data[0].WebsiteId;

  t.context.discount = {
    country: 'India' + +Math.ceil(Math.random() * 100).toString(),
    code: `testprefix-${Math.ceil(Math.random() * 10000).toString()}`,
    text: 'Random text',
    product: 'Random product',
    websiteId: t.context.websiteId,
    userId: t.context.userId,
  };

  const responseAddDiscount = await t.context.API.post(
    '/auth/discounts/add',
    t.context.discount
    // t.context.accessToken
  );
  t.is(responseAddDiscount.status, 200);

  const getDiscountId = await t.context.API.get(
    `/auth/discounts/country/${t.context.discount.country}`
    // t.context.accessToken
  );
  t.context.discountId = getDiscountId.data[0].DiscountId;
});

// -------------------------------   Tests Users   ----------------------------------

test('[e2e] Get all Users', async (t) => {
  const response = await t.context.API.get(
    `/admin/users`
    // t.context.accessToken
  );
  t.is(response.status, 200);
  t.truthy(response.data.length > 0);
});

test('[e2e] Get User by UserId', async (t) => {
  const response = await t.context.API.get(
    `/admin/user/${t.context.userId}`
    // t.context.accessToken
  );
  t.is(response.status, 200);

  const user = {
    userId: response.data.UserId,
    email: response.data.Email,
    password: t.context.user.password,
    company: response.data.Company,
    website: t.context.user.website,
  };
  t.like(user, t.context.user);
});

test('[e2e] Get User by Email', async (t) => {
  const response = await t.context.API.get(
    `/admin/user/email/${t.context.user.email}`
    // t.context.accessToken
  );
  t.is(response.status, 200);
  t.truthy(response.data.length > 0);
});

// -------------------------------   Tests Websites   ----------------------------------

test('[e2e] Get all Websites by UserId', async (t) => {
  const response = await t.context.API.get(
    `/auth/websites/${t.context.userId}`
    // t.context.accessToken
  );
  t.is(response.status, 200);
  t.truthy(response.data.length > 0);
});

test('[e2e] Get Website by WebsiteId', async (t) => {
  const response = await t.context.API.get(
    `/auth/websites/websiteId/${t.context.websiteId}`
    // t.context.accessToken
  );
  t.is(response.status, 200);

  const website = {
    website: response.data.Website,
    userId: response.data.UserId,
  };
  t.like(website, t.context.website);
});

test('[e2e] Get Website by Website', async (t) => {
  const response = await t.context.API.get(
    `/auth/websites/website/${t.context.website.website}`
    // t.context.accessToken
  );
  t.is(response.status, 200);

  const website = {
    website: response.data[0].Website,
    userId: response.data[0].UserId,
  };
  t.like(website, t.context.website);
});

// -------------------------------   Tests Discounts   ----------------------------------

test('[e2e] Get all Discounts by WebsiteId', async (t) => {
  const response = await t.context.API.get(
    `/auth/discounts/websiteId/${t.context.websiteId}`
    // t.context.accessToken
  );
  t.is(response.status, 200);
  t.truthy(response.data.length > 0);
});

test('[e2e] Get Discount by DiscountId', async (t) => {
  const response = await t.context.API.get(
    `/auth/discounts/discountId/${t.context.discountId}`
    // t.context.accessToken
  );
  t.is(response.status, 200);

  const discount = {
    country: response.data.Country,
    code: response.data.Code,
    text: response.data.Text,
    product: response.data.Product,
    websiteId: response.data.WebsiteId,
    userId: response.data.UserId,
  };
  t.like(discount, t.context.discount);
});

test('[e2e] Get Discount by Country', async (t) => {
  const response = await t.context.API.get(
    `/auth/discounts/country/${t.context.discount.country}`
    // t.context.accessToken
  );
  t.is(response.status, 200);

  const discount = {
    country: response.data[0].Country,
    code: response.data[0].Code,
    text: response.data[0].Text,
    product: response.data[0].Product,
    websiteId: response.data[0].WebsiteId,
    userId: response.data[0].UserId,
  };
  t.like(discount, t.context.discount);
});

test('[e2e] Get Discount by Product', async (t) => {
  const response = await t.context.API.get(
    `/auth/discounts/product/${t.context.discount.product}`
    // t.context.accessToken
  );
  t.is(response.status, 200);

  const discount = {
    country: response.data[0].Country,
    code: response.data[0].Code,
    text: response.data[0].Text,
    product: response.data[0].Product,
    websiteId: response.data[0].WebsiteId,
    userId: response.data[0].UserId,
  };
  t.like(discount, t.context.discount);
});

// -------------------------------   Tests After   ----------------------------------

test.after.always(async (t) => {
  const deleteDiscount = await t.context.API.delete(
    `/auth/discounts/discountId/${t.context.discountId}`
    // t.context.accessToken
  );
  t.is(deleteDiscount.status, 200);

  const deleteWebsite = await t.context.API.delete(
    `/auth/websites/websiteId/${t.context.websiteId}`
    // t.context.accessToken
  );
  t.is(deleteWebsite.status, 200);

  const deleteUser = await t.context.API.delete(
    `/admin/user/${t.context.userId}`
    // t.context.accessToken
  );
  t.is(deleteUser.status, 200);
});
