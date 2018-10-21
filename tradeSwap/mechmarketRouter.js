const express = require('express');
const mechMarketRouter = express.Router();
const snoowrap = require('snoowrap');

function createSnooWrap(refresh) {
	//WE CREATE THIS HIGHER ORDER FUNCTION TO PASS IN PARAMATER OF REFRESH TOKEN PARSED THROUGH THE REQUEST QUERY!!!
	return new snoowrap({
		userAgent: 'Test app by /u/niconi123',
		clientId: process.env.clientId,
		clientSecret: process.env.clientSecret,
		refreshToken: refresh
	});
}

mechMarketRouter.get('/', async (req, res, next) => {
	console.log('h');
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
		let mechMarketItems = await reddit
			.getSubreddit('mechmarket')
			.getHot({ limit: 45 });
		res.status(200).json(mechMarketItems);
	} catch (error) {
		next(error);
	}
});

module.exports = { mechMarketRouter };
