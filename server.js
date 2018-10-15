const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const { PORT } = require('./config');
const fetch = require('node-fetch');
const { MONGO_URL, CLIENT_ORIGIN } = require('./config');
const { authRouter } = require('./auth/auth.router');
const { userRouter } = require('./user/user.router');
const { localStrategy, jwtStrategy } = require('./auth/auth.strategy');
const { dbConnect } = require('./db-mongoose');

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

app.get('/', (req, res, next) => {
  console.log('hello');
});

app.post('/', (req, res, next) => {
  console.log(req.body);
  next();
});

app.get('/test', (req, res, next) => {
  return fetch('https://www.reddit.com/r/videos').then(response =>
    res.json(response)
  );
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
