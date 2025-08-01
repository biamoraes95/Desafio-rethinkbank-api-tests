require('dotenv').config(); 

const supertest = require('supertest');

const api = supertest(process.env.BASE_URL);

module.exports = api;
