const chai = require('chai');
const chaiHttp = require('chai-http');
const mongoose = require('mongoose');
const { TEST_MONGO_URL } = require('../config');
const app = require('../server');
const { User } = require('../user/user.model');
const Wishlist = require('../wishlist/wishlist.model');
const expect = chai.expect;
const jwt = require('jsonwebtoken');
const { JWT_SECRET, JWT_EXPIRY } = require('../config');
const { users } = require('../seed/users');
const wishListItems = require('../seed/wishlist');

chai.use(chaiHttp);

describe('Swappuyo API - Wishlist', function() {
  let user = {};
  let token;

  before(function() {
    return mongoose.connect(TEST_MONGO_URL);
  });

  beforeEach(function() {
    return Promise.all([
      User.insertMany(users),
      Wishlist.insertMany(wishListItems)
    ]).then(([users]) => {
      user = users[0];
      token = jwt.sign({ user: user.serialize() }, JWT_SECRET, {
        subject: user.username,
        expiresIn: JWT_EXPIRY,
        algorithm: 'HS256'
      });
    });
  });

  afterEach(function() {
    return Promise.all([User.deleteMany(), Wishlist.deleteMany()]);
  });

  after(function() {
    return mongoose.connection.db
      .dropDatabase()
      .then(() => mongoose.disconnect());
  });

  describe('/api/wishlist', function() {
    describe('GET', function() {
      it('should return wish items for particular user', function() {
        let res;
        return chai
          .request(app)
          .get('/api/wishlist')
          .set('Authorization', `Bearer ${token}`)
          .then(_res => {
            res = _res;

            expect(res.body).to.be.a('array');
            expect(res).to.have.status(200);
            console.log(res.body);
            return Wishlist.find({ userId: user.id });
          })
          .then(dbData => {
            expect(dbData.length).to.equal(res.body.length);
          });
      });

      it('should throw error if userId is not valid', function() {});
    });
  });
});
