import MD5 from '../../src/utils/MD5.js';

export const generateRandomPassword = () => {
  return MD5(Math.random()).slice(0, 6);
};
