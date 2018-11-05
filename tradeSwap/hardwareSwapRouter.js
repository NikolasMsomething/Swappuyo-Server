const express = require('express');
const hwSwapRouter = express.Router();
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

hwSwapRouter.get('/', async (req, res, next) => {
	let simpleCrypto = new SimpleCrypto(TOKEN_SECRET);

	let { accessToken } = req.query;
	let redditFilter = req.query.redditFilter;

	if (!accessToken) {
		const err = new Error('Wheres your token bruh?');
		err.status = 400;
		return next(err);
	}

	let accessTokenDecrypted = simpleCrypto.decrypt(accessToken);
	console.log(accessTokenDecrypted, 'line 33');

	const reddit = await createSnooWrap(accessTokenDecrypted);

	if (!redditFilter) {
		try {
			let hardWareSwapItems = await reddit
				.getSubreddit('hardwareswap')
				.getHot({ limit: 45 });
			return res.status(200).json(hardWareSwapItems);
		} catch (error) {
			return next(error);
		}
	} else {
		try {
			switch (redditFilter) {
				case 'hot': {
					let hardWareSwapItems = await reddit.getHot('hardwareswap', {
						limit: 45
					});
					console.log(redditFilter);
					return res.status(201).json(hardWareSwapItems);
				}
				case 'new': {
					let hardWareSwapItems = await reddit.getNew('hardwareswap', {
						limit: 45
					});
					console.log(redditFilter);
					return res.status(200).json(hardWareSwapItems);
				}
				case 'rising': {
					let hardWareSwapItems = await reddit.getRising('hardwareswap', {
						limit: 45
					});
					console.log(redditFilter);
					return res.status(200).json(hardWareSwapItems);
				}
			}
		} catch (error) {
			return next(error);
		}
	}
});

module.exports = { hwSwapRouter };
