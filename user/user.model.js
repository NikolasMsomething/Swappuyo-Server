const mongoose = require('mongoose');
// To learn more about the Joi NPM module, see official docs

const Joi = require('joi');

const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  username: { type: String, required: true },
  password: { type: String, required: true },
  refreshToken: { type: String }
});

userSchema.methods.serialize = function() {
  return {
    id: this._id,
    name: this.name,
    email: this.email,
    username: this.username,
    refreshToken: this.refreshToken
  };
};

userSchema.statics.hashPassword = function(password) {
  return bcrypt.hash(password, 10);
};

userSchema.methods.validatePassword = function(password) {
  return bcrypt.compare(password, this.password);
};

//CRUCIAL// JOI ERRORS LIE ON THE RES.BODY

const UserJoiSchema = Joi.object().keys({
  name: Joi.string()
    .min(1)
    .trim()
    .required(),
  username: Joi.string()
    .alphanum()
    .min(4)
    .max(30)
    .trim()
    .required()
    .options({ convert: false }),
  password: Joi.string()
    .min(8)
    .max(30)
    .trim()
    .required()
    .options({ convert: false }),
  email: Joi.string()
    .email()
    .trim()
    .required()
    .options({ convert: false })
});

const User = mongoose.model('user', userSchema);

module.exports = { User, UserJoiSchema };
