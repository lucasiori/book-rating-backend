const mongoose = require('mongoose');

const RatingSchema = new mongoose.Schema({
  user_email: String,
  note: Number,
  book: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Book'
  }
});

module.exports = mongoose.model('Rating', RatingSchema);

