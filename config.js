
require('dotenv').config();

export const config = {
  baseURL: process.env.BASE_URL || 'http://localhost:10600',

    // baseURL: process.env.BASE_URL || 'https://vmlabackend.dkut.ac.ke',
  };
