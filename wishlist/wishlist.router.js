const mongoose = require('mongoose');
const express = require('express');
const Wishlist = require('./wishlist.model');
const {
	validateMongooseId,
	requiredFields
} = require('../validationMiddleWare/validators');
const wishListRouter = express.Router();
const passport = require('passport');
wishListRouter.use(
	passport.authenticate('jwt', { session: false, failWithError: true })
);

wishListRouter.post(
	'/',
	validateMongooseId,
	requiredFields,
	async (req, res, next) => {
		console.log(req.user.id);

		try {
			const createResponse = await Wishlist.create({
				title: req.body.title,
				author: req.body.author,
				url: req.body.url,
				userId: req.user.id
			});
			res.status(201).json(createResponse);
		} catch (e) {
			next(e);
		}
	}
);

wishListRouter.get('/', validateMongooseId, async (req, res, next) => {
	const userId = req.user.id;
	console.log(req);

	try {
		const wishItems = await Wishlist.find({ userId });
		return res.status(200).json(wishItems);
	} catch (e) {
		next(e);
	}
});

module.exports = { wishListRouter };
