const express = require('express');
const avExchangeRouter = express.Router();
const snoowrap = require('snoowrap');

function createSnooWrap(refresh) {
  //WE CREATE THIS HIGHER ORDER FUNCTION TO PASS IN PARAMATER OF REFRESH TOKEN PARSED THROUGH THE REQUEST QUERY!!!
  return new snoowrap({
    userAgent: 'Test app by /u/niconi123',
    clientId: process.env.clientId,
    clientSecret: process.env.clientSecret,
    refreshToken: refresh
  });
}

avExchangeRouter.get('/', (req, res, next) => {
  let { refreshToken } = req.query;
  console.log(req.query);
  console.log('QUERY ABOVE');
  if (!refreshToken) {
    const err = new Error('Wheres your token bruh?');
    err.status = 400;
    next(err);
  }

  const reddit = createSnooWrap(refreshToken);

  reddit
    .getSubreddit('AVexchange')

    .getHot({ limit: 45 })
    .then(data => {
      console.log(data);
      res.json(data);
    })
    .catch(err => console.log(err));
  // console.log('hello');
});

module.exports = { avExchangeRouter };
