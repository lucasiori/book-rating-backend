const mongoose = require('mongoose');

const BookSchema = new mongoose.Schema({
  title: String,
  description: String,
  author: String,
  year: Number,
  genres: [String],
  image: String,
  rating: {
    type: Number,
    default: null
  }
});

module.exports = mongoose.model('Book', BookSchema);

