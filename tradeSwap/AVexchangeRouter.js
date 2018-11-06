const express = require('express');
const avExchangeRouter = express.Router();
const snoowrap = require('snoowrap');
const SimpleCrypto = require('simple-crypto-js').default;
const { TOKEN_SECRET } = require('../config');

const { clientId, clientSecret } = require('../config.js');

function createSnooWrap(access) {
	//WE CREATE THIS HIGHER ORDER FUNCTION TO PASS IN PARAMATER OF REFRESH TOKEN PARSED THROUGH THE REQUEST QUERY!!!
	return new snoowrap({
		userAgent: 'Test app by /u/niconi123',
		clientId: clientId,
		clientSecret: clientSecret,
		accessToken: access
	});
}

avExchangeRouter.get('/', async (req, res, next) => {
	let simpleCrypto = new SimpleCrypto(TOKEN_SECRET);

	let { accessToken } = req.query;
	let redditFilter = req.query.redditFilter;

	if (!accessToken) {
		const err = new Error('Wheres your token bruh?');
		err.status = 400;
		return next(err);
	}
	console.log(accessToken, 'HERE AVEXCHANGE');

	let accessTokenDecrypted = simpleCrypto.decrypt(accessToken);

	const reddit = createSnooWrap(accessTokenDecrypted);

	try {
		switch (redditFilter) {
			case 'hot': {
				let avExchangeItems = await reddit.getHot('AVexchange', { limit: 45 });

				return res.status(200).json(avExchangeItems);
			}
			case 'new': {
				let avExchangeItems = await reddit.getNew('AVexchange', { limit: 45 });

				return res.status(200).json(avExchangeItems);
			}
			case 'rising': {
				let avExchangeItems = await reddit.getRising('AVexchange', {
					limit: 45
				});

				return res.status(200).json(avExchangeItems);
			}
		}
	} catch (error) {
		next(error);
	}
});

module.exports = { avExchangeRouter };
