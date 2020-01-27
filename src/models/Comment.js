const mongoose = require('mongoose');

const CommentSchema = new mongoose.Schema({
  user_email: String,
  comment: String,
  book: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Book'
  }
});

module.exports = mongoose.model('Comment', CommentSchema);