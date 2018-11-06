const express = require('express');
const tokenRefreshRouter = express.Router();
const { User } = require('../user/user.model');
const passport = require('passport');
const SimpleCrypto = require('simple-crypto-js').default;
const { clientId, clientSecret, TOKEN_SECRET } = require('../config');

const btoa = require('btoa');
const fetch = require('node-fetch');
tokenRefreshRouter.use(
	passport.authenticate('jwt', { session: false, failWithError: true })
);

tokenRefreshRouter.post('/', async (req, res, next) => {
	let simpleCrypto = new SimpleCrypto(TOKEN_SECRET);
	let id = req.user.id;
	console.log('hello');
	console.log(req.user);
	console.log('HI IN REFRESH');
	console.log(clientId, clientSecret);

	console.log(btoa(`${clientId}:${clientSecret}`));

	try {
		let user = await User.findById(id);
		console.log(user, 'LINE 33');
		let refreshToken = await simpleCrypto.decrypt(user.refreshToken);
		console.log(refreshToken, 'LINE 35');

		let response = await fetch('https://www.reddit.com/api/v1/access_token', {
			method: 'POST', // or 'PUT',
			mode: 'no-cors',
			headers: {
				Authorization: 'Basic ' + btoa(`${clientId}:${clientSecret}`),
				'Content-Type': 'application/x-www-form-urlencoded'
			},
			body: `grant_type=refresh_token&refresh_token=${refreshToken}`
		}); //WORKED

		console.log(refreshToken);
		let data = await response.json();
		console.log(data);
		let encryptedAccess = simpleCrypto.encrypt(data.access_token);
		let tokens = {
			access_token: encryptedAccess,
			expires_in: data.expires_in,
			type: data.token_type
		};
		res.status(200).json(tokens);
	} catch (e) {
		next(e);
	}
});

module.exports = { tokenRefreshRouter };
