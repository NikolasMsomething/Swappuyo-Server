const express = require('express');
const hwSwapRouter = express.Router();
const snoowrap = require('snoowrap');

const r = new snoowrap({
  userAgent: 'Test app by /u/niconi123',
  clientId: process.env.clientId,
  clientSecret: process.env.clientSecret,
  accessToken: process.env.accessToken
});

hwSwapRouter.get('/', (req, res, next) => {
  r.getSubreddit('hardwareswap')
    .getHot()
    .then(response => res.json(response));
  // console.log('hello');
});

module.exports = { hwSwapRouter };
