const express = require('express');
const mechMarketRouter = express.Router();
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

mechMarketRouter.get('/', async (req, res, next) => {
	let simpleCrypto = new SimpleCrypto(TOKEN_SECRET);

	console.log('h');
	let redditFilter = req.query.redditFilter;
	let { accessToken } = req.query;
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
				let mechMarketItems = await reddit.getHot('mechmarket', { limit: 45 });
				console.log(redditFilter);
				return res.status(201).json(mechMarketItems);
			}
			case 'new': {
				let mechMarketItems = await reddit.getNew('mechmarket', { limit: 45 });
				console.log(redditFilter);
				return res.status(200).json(mechMarketItems);
			}
			case 'rising': {
				let mechMarketItems = await reddit.getRising('mechmarket', {
					limit: 45
				});
				console.log(redditFilter);
				return res.status(200).json(mechMarketItems);
			}
		}
	} catch (error) {
		next(error);
	}
});

module.exports = { mechMarketRouter };
