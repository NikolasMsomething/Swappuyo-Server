const express = require('express');
const hwSwapRouter = express.Router();
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

hwSwapRouter.get('/', async (req, res, next) => {
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

	if (!redditFilter) {
		try {
			let hardWareSwapItems = await reddit
				.getSubreddit('hardwareswap')
				.getHot({ limit: 45 });
			res.status(200).json(hardWareSwapItems);
		} catch (error) {
			next(error);
		}
	} else {
		try {
			switch (redditFilter) {
				case 'hot': {
					let hardWareSwapItems = await reddit.getHot('hardwareswap', {
						limit: 45
					});
					console.log(redditFilter);
					res.status(201).json(hardWareSwapItems);
				}
				case 'new': {
					let hardWareSwapItems = await reddit.getNew('hardwareswap', {
						limit: 45
					});
					console.log(redditFilter);
					res.status(200).json(hardWareSwapItems);
				}
				case 'rising': {
					let hardWareSwapItems = await reddit.getRising('hardwareswap', {
						limit: 45
					});
					console.log(redditFilter);
					res.status(200).json(hardWareSwapItems);
				}
			}
		} catch (error) {
			next(error);
		}
	}
});

module.exports = { hwSwapRouter };
