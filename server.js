const express = require('express');
const morgan = require('morgan');
const app = express();
const { PORT } = require('./config');

app.use(express.json());
app.use(morgan('combined'));

app.get('/', (req, res, next) => {
  console.log('hello');
});

app.listen(PORT, () => {
  console.log(`Server is listening on ${PORT}`);
});
