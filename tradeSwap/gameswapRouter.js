const express = require('express');
const gameSwapRouter = express.Router();
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

gameSwapRouter.get('/', async (req, res, next) => {
	let { refreshToken } = req.query;
	let redditFilter = req.query.redditFilter;
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
				let gameswapItems = await reddit.getHot('gameswap', { limit: 45 });
				console.log(redditFilter);
				res.status(200).json(gameswapItems);
			}
			case 'new': {
				let gameswapItems = await reddit.getNew('gameswap', { limit: 45 });
				console.log(redditFilter);
				res.status(200).json(gameswapItems);
			}
			case 'rising': {
				let avExchangeItems = await reddit.getRising('gameswap', {
					limit: 45
				});
				console.log(redditFilter);
				res.status(200).json(gameswapItems);
			}
		}
	} catch (error) {
		next(error);
	}
});

module.exports = { gameSwapRouter };
