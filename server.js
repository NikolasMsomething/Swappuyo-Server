const express = require('express');
const ENV = require('dotenv');
ENV.config();
const cors = require('cors');
const morgan = require('morgan');
const { PORT } = require('./config');
const fetch = require('node-fetch');
const { MONGO_URL, CLIENT_ORIGIN } = require('./config');
const { authRouter } = require('./auth/auth.router');
const { userRouter } = require('./user/user.router');
const { wishListRouter } = require('./wishlist/wishlist.router');
const { hwSwapRouter } = require('./tradeSwap/hardwareSwapRouter');
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
app.use('/api/wishList', wishListRouter);

app.get('/test', (req, res, next) => {
  return fetch('https://www.reddit.com/r/videos').then(response =>
    res.json(response)
  );
});

app.post('/api/code', (req, res, next) => {
  const code = req.body.code;
  console.log(req.body);
  console.log('Here');
  console.log(process.env.clientId, process.env.clientSecret);

  console.log(btoa(`${process.env.clientId}:${process.env.clientSecret}`));

  return fetch('https://www.reddit.com/api/v1/access_token', {
    method: 'POST', // or 'PUT',
    mode: 'no-cors',
    headers: {
      Authorization:
				'Basic ' + btoa(`${process.env.clientId}:${process.env.clientSecret}`),
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: `grant_type=authorization_code&code=${code}&redirect_uri=http://localhost:3000/RedditTokenRedirect`
  })
    .then(res => {
      return res.json();
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

dbConnect(MONGO_URL);

app.listen(PORT, () => {
  console.log(`Server is listening on ${PORT}`);
});
