const express = require('express');
const mechMarketRouter = express.Router();
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

mechMarketRouter.get('/', async (req, res, next) => {
	console.log('h');
	let redditFilter = req.query.redditFilter;
	let { refreshToken } = req.query;
	console.log(req.query);
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
				let mechMarketItems = await reddit.getHot('mechmarket', { limit: 45 });
				console.log(redditFilter);
				res.status(201).json(mechMarketItems);
			}
			case 'new': {
				let mechMarketItems = await reddit.getNew('mechmarket', { limit: 45 });
				console.log(redditFilter);
				res.status(200).json(mechMarketItems);
			}
			case 'rising': {
				let mechMarketItems = await reddit.getRising('mechmarket', {
					limit: 45
				});
				console.log(redditFilter);
				res.status(200).json(mechMarketItems);
			}
		}
	} catch (error) {
		next(error);
	}
});

module.exports = { mechMarketRouter };
