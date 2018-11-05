const express = require('express');
const codeRouter = express.Router();
const passport = require('passport');
const { User } = require('../user/user.model');
const SimpleCrypto = require('simple-crypto-js').default;
const {
  clientId,
  clientSecret,
  redditRedirect,
  TOKEN_SECRET
} = require('../config');
const btoa = require('btoa');
const fetch = require('node-fetch');
codeRouter.use(
  passport.authenticate('jwt', { session: false, failWithError: true })
);

codeRouter.post('/', (req, res, next) => {
  const code = req.body.code;
  const id = req.user.id;
  console.log(req.body);
  console.log(req.user);
  console.log(clientId, clientSecret);
  let simpleCrypto = new SimpleCrypto(TOKEN_SECRET);
  console.log(btoa(`${clientId}:${clientSecret}`));

  return fetch('https://www.reddit.com/api/v1/access_token', {
    method: 'POST', // or 'PUT',
    mode: 'no-cors',
    headers: {
      Authorization: 'Basic ' + btoa(`${clientId}:${clientSecret}`),
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: `grant_type=authorization_code&code=${code}&redirect_uri=${redditRedirect}` //http://localhost:3000/RedditTokenRedirect
  })
    .then(data => {
      return data.json();
    })
    .then(data => {
      console.log(data, 'HERE IS DATA');
      let refreshTokenReceived = data.refresh_token;
      let accessTokenReceived = data.access_token;
      //   const encrytedAes = CryptoJS.AES.encrypt(
      //     refreshTokenReceived,
      //     REFRESH_SECRET
      //   );
      let encryptedRefresh = simpleCrypto.encrypt(refreshTokenReceived);
      let encryptedAccess = simpleCrypto.encrypt(accessTokenReceived);
      console.log(encryptedAccess, 'here encrypted access');
      console.log;
      User.findOneAndUpdate({ _id: id }, { refreshToken: encryptedRefresh })
        .then(() => {
          console.log('success!!');
          let sendBack = {
            access_token: encryptedAccess,
            token_type: data.token_type,
            expires_in: data.expires_in
          };
          res.status(200).json(sendBack);
        })
        .catch(err => {
          console.log(err);
        });
    })
    .catch(err => console.log(err));
});

module.exports = { codeRouter };
