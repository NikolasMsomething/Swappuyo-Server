const express = require('express');
const avExchangeRouter = express.Router();
const snoowrap = require('snoowrap');

const { clientId, clientSecret } = require('../config.js');

function createSnooWrap(refresh) {
	//WE CREATE THIS HIGHER ORDER FUNCTION TO PASS IN PARAMATER OF REFRESH TOKEN PARSED THROUGH THE REQUEST QUERY!!!
	return new snoowrap({
		userAgent: 'Test app by /u/niconi123',
		clientId: clientId,
		clientSecret: clientSecret,
		refreshToken: refresh
	});
}

avExchangeRouter.get('/', async (req, res, next) => {
	let { refreshToken } = req.query;
	let redditFilter = req.query.redditFilter;

	console.log(req.query);
	console.log(refreshToken);
	console.log(redditFilter);
	console.log('QUERY ABOVE');
	if (!refreshToken) {
		const err = new Error('Wheres your token bruh?');
		err.status = 400;
		next(err);
	}

	const reddit = createSnooWrap(refreshToken);

	try {
		switch (redditFilter) {
			case 'hot': {
				let avExchangeItems = await reddit.getHot('AVexchange', { limit: 45 });
				console.log(avExchangeItems);
				res.status(200).json(avExchangeItems);
			}
			case 'new': {
				let avExchangeItems = await reddit.getNew('AVexchange', { limit: 45 });
				console.log(avExchangeItems);
				res.status(200).json(avExchangeItems);
			}
			case 'rising': {
				let avExchangeItems = await reddit.getRising('AVexchange', {
					limit: 45
				});
				console.log(avExchangeItems);
				res.status(200).json(avExchangeItems);
			}
		}
	} catch (error) {
		next(error);
	}
});

module.exports = { avExchangeRouter };
