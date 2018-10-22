const mongoose = require('mongoose');
const express = require('express');
const Wishlist = require('./wishlist.model');
const {
	validateMongooseId,
	requiredFieldsInReqBody
} = require('../validationMiddleWare/validators');
const wishListRouter = express.Router();
const passport = require('passport');
wishListRouter.use(
	passport.authenticate('jwt', { session: false, failWithError: true })
);

wishListRouter.post(
	'/',
	validateMongooseId,
	requiredFieldsInReqBody(['title', 'url', 'author']),
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

wishListRouter.delete('/:id', validateMongooseId, async (req, res, next) => {
	let { id } = req.params;
	let userId = req.user.id;

	console.log(id, userId, 'hello', req.body);

	try {
		const deleteSuccess = await Wishlist.findByIdAndDelete({
			_id: id,
			userId
		});
		return res.status(204).json(deleteSuccess);
	} catch (e) {
		next(e);
	}
});

module.exports = { wishListRouter };
