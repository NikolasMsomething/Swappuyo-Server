const express = require('express');
const ENV = require('dotenv');
ENV.config();
const cors = require('cors');
const morgan = require('morgan');
const { PORT } = require('./config');
const fetch = require('node-fetch');
const { MONGODB_URI, CLIENT_ORIGIN } = require('./config');
const { authRouter } = require('./auth/auth.router');
const { userRouter } = require('./user/user.router');
const { wishListRouter } = require('./wishlist/wishlist.router');
const { gameSwapRouter } = require('./tradeSwap/gameswapRouter'); //WEIRD NODE ERROR SOMETIMES ACCEPTS BAD PATH NAMES
const { avExchangeRouter } = require('./tradeSwap/AVexchangeRouter');
const { hwSwapRouter } = require('./tradeSwap/hardwareSwapRouter');
const { mechMarketRouter } = require('./tradeSwap/mechmarketRouter');
const { codeRouter } = require('./redditTokens/code.router');
const { tokenRefreshRouter } = require('./redditTokens/tokenRefresh.router');
const { localStrategy, jwtStrategy } = require('./auth/auth.strategy');
const { dbConnect } = require('./db-mongoose');
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
app.use('/api/code', codeRouter);
app.use('/api/redditrefresh', tokenRefreshRouter);

app.get('/test', (req, res, next) => {
  res.json({ dog: 'works' });
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

if (require.main === module) {
  dbConnect(MONGODB_URI);

  app
    .listen(PORT, function() {
      console.info(`Server listening on ${this.address().port}`);
    })
    .on('error', err => {
      console.error(err);
    });
}

module.exports = app;
