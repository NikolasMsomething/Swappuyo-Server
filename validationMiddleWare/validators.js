const mongoose = require('mongoose');

const validateMongooseId = (req, res, next) => {
  if (!mongoose.Types.ObjectId.isValid(req.user.id)) {
    const err = new Error('Invalid user id!');
    err.status = 400;
    next(err);
  }

  next();
};

const requiredFields = (req, res, next) => {
  const required = ['title', 'author', 'url'];

  required.forEach(field => {
    if (!(field in req.body)) {
      const error = new Error(`You're missing a(n) ${field}!`);
      error.status = 400;
      next(error);
    }
  });

  next();
};

module.exports = { validateMongooseId, requiredFields };
