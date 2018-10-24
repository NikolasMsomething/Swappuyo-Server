const express = require('express');
// To learn more about the Joi NPM module, see official docs
// https://www.npmjs.com/package/joi
const Joi = require('joi');

const { HTTP_STATUS_CODES } = require('../config.js');
const { User, UserJoiSchema } = require('./user.model.js');

const userRouter = express.Router();

userRouter.post('/', (request, response) => {
  console.log(request.body);
  const newUser = {
    name: request.body.name,
    email: request.body.email,
    username: request.body.username,
    password: request.body.password
  };

  const validation = Joi.validate(newUser, UserJoiSchema);
  if (validation.error) {
    return response
      .status(HTTP_STATUS_CODES.BAD_REQUEST)
      .json({ error: validation.error });
  }

  console.log(validation);

  User.findOne({
    $or: [{ email: newUser.email }, { username: newUser.username }]
  })
    .then(user => {
      if (user) {
        return response.status(HTTP_STATUS_CODES.BAD_REQUEST).json({
          message: 'A user with that username and/or email already exists.'
        });
      }

      return User.hashPassword(newUser.password);
    })
    .then(passwordHash => {
      newUser.password = passwordHash;

      User.create(newUser)
        .then(createdUser => {
          return response
            .status(HTTP_STATUS_CODES.CREATED)
            .json(createdUser.serialize());
        })
        .catch(error => {
          return response
            .status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR)
            .json(error);
        });
    });
});

userRouter.get('/', (request, response) => {
  User.find()
    .then(users => {
      return response
        .status(HTTP_STATUS_CODES.OK)
        .json(users.map(user => user.serialize()));
    })
    .catch(error => {
      return response
        .status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR)
        .json(error);
    });
});

userRouter.get('/:userid', (request, response) => {
  User.findById(request.params.userid)
    .then(user => {
      return response.status(HTTP_STATUS_CODES.OK).json(user.serialize());
    })
    .catch(error => {
      return response
        .status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR)
        .json(error);
    });
});

module.exports = { userRouter };
