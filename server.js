const express = require('express');
const ENV = require('dotenv');
ENV.config();
const cors = require('cors');
const morgan = require('morgan');
const { PORT } = require('./config');
const fetch = require('node-fetch');
const {
  MONGODB_URI,
  CLIENT_ORIGIN,
  clientId,
  clientSecret
} = require('./config');
const { authRouter } = require('./auth/auth.router');
const { userRouter } = require('./user/user.router');
const { wishListRouter } = require('./wishlist/wishlist.router');
const { gameSwapRouter } = require('./tradeSwap/gameswapRouter');
const { avExchangeRouter } = require('./tradeSwap/avExchangeRouter');
const { hwSwapRouter } = require('./tradeSwap/hardwareSwapRouter');
const { mechMarketRouter } = require('./tradeSwap/mechmarketRouter');
const { localStrategy, jwtStrategy } = require('./auth/auth.strategy');
const { dbConnect } = require('./db-mongoose');
const snoowrap = require('snoowrap');
const btoa = require('btoa');
// const r = new snoowrap({
//   userAgent: 'Test app by /u/niconi123',
//   clientId: process.env.clientId,
//   clientSecret: process.env.clientSecret,
//   accessToken: process.env.accessToken
// });

const app = express();

app.use(morgan('combined'));

app.use(express.json());

app.use(
  cors({
    origin: CLIENT_ORIGIN
  })
);

const passport = require('passport');

passport.use(localStrategy);
passport.use(jwtStrategy);

app.use('/api/user', userRouter);
app.use('/api', authRouter);
app.use('/api/hardwareswap', hwSwapRouter);
app.use('/api/gameswap', gameSwapRouter);
app.use('/api/AVexchange', avExchangeRouter);
app.use('/api/wishlist', wishListRouter);
app.use('/api/mechmarket', mechMarketRouter);

app.get('/test', (req, res, next) => {
  res.json({ dog: 'works' });
});

app.post('/api/code', (req, res, next) => {
  const code = req.body.code;
  console.log(req.body);
  console.log('Here');
  console.log(clientId, clientSecret);

  console.log(btoa(`${clientId}:${clientSecret}`));

  return fetch('https://www.reddit.com/api/v1/access_token', {
    method: 'POST', // or 'PUT',
    mode: 'no-cors',
    headers: {
      Authorization: 'Basic ' + btoa(`${clientId}:${clientSecret}`),
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: `grant_type=authorization_code&code=${code}&redirect_uri=http://localhost:3000/RedditTokenRedirect`
  })
    .then(data => {
      return data.json();
    })
    .then(data => {
      res.json(data);
    })
    .catch(err => console.log(err));
});

app.use((req, res, next) => {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});

app.use((err, req, res, next) => {
  if (err.status) {
    const errBody = Object.assign({}, err, { message: err.message });
    res.status(err.status).json(errBody);
  } else {
    console.error(err);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

dbConnect(MONGODB_URI);

app.listen(PORT, () => {
  console.log(`Server is listening on ${PORT}`);
});
