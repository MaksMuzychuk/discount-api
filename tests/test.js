import test from 'ava';
import axios from 'axios';
import { generateRandomPassword } from '../src/services/utils.js';
import dotenv from 'dotenv';
dotenv.config();

const API_BASE_URL = `http://${process.env.SERVER_IP}:5000/`;

test.before(async (t) => {
  t.context.API = axios.create({
    baseURL: API_BASE_URL,
    timeout: 30000,
  });

  t.context.user = {
    username: 'Maks' + Math.ceil(Math.random() * 100).toString(),
    password: generateRandomPassword(),
    company: 'Qwerty',
    website: 'qwerty.com',
  };

  t.context.discount = {
    country: 'Japan' + +Math.ceil(Math.random() * 100).toString(),
    code: `testprefix-${Math.ceil(Math.random() * 10000).toString()}`,
    message: 'Random text',
    website: 'Anyone',
  };

  const responseRegister = await t.context.API.post(
    `/register`,
    t.context.user
  );
  t.is(responseRegister.status, 200);
  const responseLogin = await t.context.API.post('/login', t.context.user);
  t.is(responseLogin.status, 200);
  t.context.accessToken = responseLogin.data.accessToken;

  const config = {
    headers: {
      authorization: `Bearer ${t.context.accessToken}`,
    },
  };

  const responseAddDiscount = await t.context.API.post(
    '/auth/discounts/new',
    t.context.discount,
    config
  );
  t.is(responseAddDiscount.status, 200);
});

test('[e2e] Get all Users', async (t) => {
  const config = {
    headers: {
      authorization: `Bearer ${t.context.accessToken}`,
    },
  };

  const response = await t.context.API.get(`/auth/users`, config);
  t.is(response.status, 200);
  t.truthy(response.data.length > 0);
});

test('[e2e] Get User by Username', async (t) => {
  const config = {
    headers: {
      authorization: `Bearer ${t.context.accessToken}`,
    },
  };

  const response = await t.context.API.get(
    `/auth/user/${t.context.user.username}`,
    config
  );
  t.is(response.status, 200);
  const user = {
    username: response.data.Username,
    password: t.context.user.password,
    company: response.data.Company,
    website: response.data.Website,
  };
  t.like(user, t.context.user);
});

test('[e2e] Get Users by Website', async (t) => {
  const config = {
    headers: {
      authorization: `Bearer ${t.context.accessToken}`,
    },
  };

  const response = await t.context.API.get(
    `/auth/user/website/${t.context.user.website}`,
    config
  );
  t.is(response.status, 200);
  t.truthy(response.data.length > 0);
});

test('[e2e] Get all Discounts', async (t) => {
  const config = {
    headers: {
      authorization: `Bearer ${t.context.accessToken}`,
    },
  };

  const response = await t.context.API.get(`/auth/discounts`, config);
  t.is(response.status, 200);
  t.truthy(response.data.length > 0);
});

test('[e2e] Get Discount by Country', async (t) => {
  const config = {
    headers: {
      authorization: `Bearer ${t.context.accessToken}`,
    },
  };

  const response = await t.context.API.get(
    `/auth/discounts/country/${t.context.discount.country}`,
    config
  );
  t.is(response.status, 200);
  const discount = {
    country: response.data.Country,
    code: response.data.Code,
    message: response.data.Message,
    website: response.data.Website,
  };
  t.like(discount, t.context.discount);
});

test('[e2e] Get Discounts by Website', async (t) => {
  const config = {
    headers: {
      authorization: `Bearer ${t.context.accessToken}`,
    },
  };

  const response = await t.context.API.get(
    `/auth/discounts/website/${t.context.discount.website}`,
    config
  );
  t.is(response.status, 200);
  t.truthy(response.data.length > 0);
});

test.after.always(async (t) => {
  const config = {
    headers: {
      authorization: `Bearer ${t.context.accessToken}`,
    },
  };

  const deleteDiscount = await t.context.API.delete(
    `/auth/discounts/country/${t.context.discount.country}`,
    config
  );
  t.is(deleteDiscount.status, 200);

  const deleteUser = await t.context.API.delete(
    `/auth/user/${t.context.user.username}`,
    config
  );
  t.is(deleteUser.status, 200);
});
