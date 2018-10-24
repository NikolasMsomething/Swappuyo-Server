const app = require('../server');
const chai = require('chai');
const chaiHttp = require('chai-http');
const mongoose = require('mongoose');

const { TEST_MONGO_URL } = require('../config');

const { User } = require('../user/user.model');

const expect = chai.expect;

chai.use(chaiHttp);

describe('Swappuyo API - Users', function() {
  const username = 'exampleUser';
  const password = 'examplePass';
  const name = 'Example User';
  const email = 'example@gmail.com';

  before(function() {
    return mongoose.connect(TEST_MONGO_URL);
  });

  afterEach(function() {
    return mongoose.connection.db.dropDatabase();
  });

  after(function() {
    return mongoose.disconnect();
  });

  describe('/api/user', function() {
    describe('POST', function() {
      it('Should create a new user', function() {
        const testUser = { username, password, name, email };

        let res;
        return chai
          .request(app)
          .post('/api/user')
          .send(testUser)
          .then(_res => {
            res = _res;
            expect(res).to.have.status(201);
            expect(res.body).to.be.an('object');
            expect(res.body).to.have.keys('id', 'username', 'name', 'email');

            expect(res.body.id).to.exist;
            expect(res.body.username).to.equal(testUser.username);
            expect(res.body.name).to.equal(testUser.name);

            return User.findOne({ username });
          })
          .then(user => {
            expect(user).to.exist;
            expect(user.id).to.equal(res.body.id);
            expect(user.name).to.equal(testUser.name);
            return user.validatePassword(password);
          })
          .then(isValid => {
            expect(isValid).to.be.true;
          });
      });
      it('Should reject users with missing username', function() {
        const testUser = { password, name, email };
        return chai
          .request(app)
          .post('/api/user')
          .send(testUser)
          .then(res => {
            expect(res).to.have.status(400);
          });
      });

      /**
			 * COMPLETE ALL THE FOLLOWING TESTS
			 */
      it('Should reject users with missing password', function() {
        let res;
        return chai
          .request(app)
          .post('/api/user/')
          .send({ username, email, name })
          .then(res => {
            expect(res).to.have.status(400);
          });
      });
      it('Should reject users with non-string username', () => {
        return chai
          .request(app)
          .post('/api/user/')
          .send({
            username: 12301203,
            password: 'poop',
            name: 'Test Rejo',
            email: 'test@gmail.com'
          })
          .then(res => {
            expect(res).to.have.status(400);
            expect(res.body.error.details[0].message).to.include(
              '"username" must be a string'
            );
          });
      });
      it('Should reject users with non-string password', () => {
        return chai
          .request(app)
          .post('/api/user/')
          .send({ username: 'hello', password: 123123123213, email, name })
          .then(res => {
            expect(res).to.have.status(400);
            expect(res.body.error.details[0].message).to.include(
              '"password" must be a string'
            );
          });
      });
      it('Should reject users with non-trimmed username', () => {
        return chai
          .request(app)
          .post('/api/user/')
          .send({
            username: '    hello   ',
            password: 123123123213,
            email,
            name
          })
          .then(res => {
            console.log(res.body.error.details[0].message);
            expect(res).to.have.status(400);
            expect(res.body.error.details[0].message).to.include(
              '"username" must only contain alpha-numeric characters'
            );
          });
      });
    });
    it('Should reject users with non-trimmed password', () => {
      return chai
        .request(app)
        .post('/api/user/')
        .send({
          username: '    hello   ',
          password: 'dodfasidfjiofads',
          name,
          email
        })
        .then(res => {
          expect(res).to.have.status(400);

          expect(res.body.error.details[0].message).to.include(
            '"username" must only contain alpha-numeric characters'
          );
        });
    });
    it('Should reject users with empty username', () => {
      return chai
        .request(app)
        .post('/api/user/')
        .send({ username: '', password: 'poop123123', name, email })
        .then(res => {
          expect(res).to.have.status(400);
          expect(res.body.error.details[0].message).to.include(
            '"username" is not allowed to be empty'
          );
        });
    });
    it('Should reject users with password less than 8 characters', () => {
      return chai
        .request(app)
        .post('/api/user/')
        .send({ username: 'hellomojo', password: 'poop', name, email })
        .then(res => {
          expect(res).to.have.status(400);
          expect(res.body.error.details[0].message).to.include(
            '"password" length must be at least 8 characters long'
          );
        });
    });
    it('Should reject users with password greater than 72 characters', () => {
      return chai
        .request(app)
        .post('/api/user/')
        .send({
          username: 'thisisanewusername',
          password:
						'sahdfjkhdsajfhjksadhfjkhsadkjfjksadhfjkhksdhfkjhdsjkhkjsadhfkjhsakjdfhkjsadhfkjhsakjdfhkjasdhfkahskjdfhkjsadhfahkjsad',
          name,
          email
        })
        .then(res => {
          expect(res).to.have.status(400);
          expect(res.body.error.details[0].message).to.include(
            '"password" length must be less than or equal to 30 characters long'
          );
        });
    });
    it('Should reject users with duplicate username', () => {
      return User.create({
        username: 'doggydoggerson',
        password: 'theuejrarajfadsifj',
        email,
        name
      }).then(obj => {
        expect(obj.username).to.be.eql('doggydoggerson');
        return chai
          .request(app)
          .post('/api/user/')
          .send({
            username: 'doggydoggerson',
            password: 'poopopoopop',
            name,
            email
          })
          .then(res => {
            expect(res).to.have.status(400);
            expect(res.body.message).to.include(
              'A user with that username and/or email already exists.'
            );
          });
      });
    });
    it('Should trim name', () => {
      let res;
      return chai
        .request(app)
        .post('/api/user/')
        .send({
          username: 'jsdflajsdf',
          password: 'pooasdfasdp',
          name: ' Nikolas Melgarejo ',
          email
        })
        .then(_res => {
          res = _res;

          expect(res).to.have.status(201);
          return User.findOne({ _id: res.body.id });
        })
        .then(response => {
          expect(response).to.be.a('object');
          expect(response.username).to.eql(res.body.username);
          expect(response.name).to.eql(res.body.name);
        });
    });
  });
});
