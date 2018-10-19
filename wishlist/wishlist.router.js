const mongoose = require('mongoose');
const express = require('express');
const Wishlist = require('./wishlist.model');

const wishListRouter = express.Router();
const passport = require('passport');
wishListRouter.use(
  passport.authenticate('jwt', { session: false, failWithError: true })
);

wishListRouter.post('/', (req, res, next) => {
  console.log(req.user.id);

  if (!mongoose.Types.ObjectId.isValid(req.user.id)) {
    const err = new Error('Invalid user id!');
    err.status = 400;
    next(err);
  }

  Wishlist.create({
    title: req.body.title,
    author: req.body.author,
    url: req.body.url,
    userId: req.user.id
  }).then(res => {
    console.log(res);
  });
});

wishListRouter.get('/', (req, res, next) => {
  const userId = req.user.id;
  console.log(req);

  Wishlist.find({
    userId
  }).then(response => {
    res.json(response);
  });
});

module.exports = { wishListRouter };
