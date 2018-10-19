const mongoose = require('mongoose');

const wishListSchema = new mongoose.Schema({
  title: { type: String, required: true },
  url: { type: String, required: true },
  author: { type: String, required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
});

wishListSchema.set('toObject', {
  virtuals: true, //returns regular id in this scenario
  versionKey: false,
  transform: (doc, result) => {
    delete result._id;
    delete result.__v;
    delete result.password;
  }
});

module.exports = mongoose.model('Wishlist', wishListSchema);
