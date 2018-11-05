const express = require('express');
const gameSwapRouter = express.Router();
const snoowrap = require('snoowrap');
const { clientId, clientSecret } = require('../config.js');
const SimpleCrypto = require('simple-crypto-js').default;
const { TOKEN_SECRET } = require('../config');

function createSnooWrap(access) {
	//WE CREATE THIS HIGHER ORDER FUNCTION TO PASS IN PARAMATER OF REFRESH TOKEN PARSED THROUGH THE REQUEST QUERY!!!
	return new snoowrap({
		userAgent: 'Test app by /u/niconi123',
		clientId: clientId,
		clientSecret: clientSecret,
		accessToken: access
	});
}

gameSwapRouter.get('/', async (req, res, next) => {
	let simpleCrypto = new SimpleCrypto(TOKEN_SECRET);

	let { accessToken } = req.query;
	let redditFilter = req.query.redditFilter;
	console.log(req.query);
	console.log('QUERY ABOVE');
	if (!accessToken) {
		const err = new Error('Wheres your token bruh?');
		err.status = 400;
		return next(err);
	}

	let accessTokenDecrypted = await simpleCrypto.decrypt(accessToken);

	const reddit = createSnooWrap(accessTokenDecrypted);

	try {
		switch (redditFilter) {
			case 'hot': {
				let gameswapItems = await reddit.getHot('gameswap', { limit: 45 });
				console.log(redditFilter);
				return res.status(200).json(gameswapItems);
			}
			case 'new': {
				let gameswapItems = await reddit.getNew('gameswap', { limit: 45 });
				console.log(redditFilter);
				return res.status(200).json(gameswapItems);
			}
			case 'rising': {
				let gameswapItems = await reddit.getRising('gameswap', {
					limit: 45
				});
				console.log(redditFilter);
				return res.status(200).json(gameswapItems);
			}
		}
	} catch (error) {
		return next(error);
	}
});

module.exports = { gameSwapRouter };
