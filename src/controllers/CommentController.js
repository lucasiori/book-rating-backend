const Comment = require('../models/Comment');

module.exports = {
  async index(req, res) {
    const comments = await Comment.find();

    await comments.populate('book', '_id title').execPopulate();

    return res.json(comments);
  },

  async store(req, res) {
    try {
      const { book_id } = req.params;
      const { user_email, comment: comment_text } = req.body;

      let comment = await Comment.findOne({ user_email, book: book_id });

      if (!comment) {
        comment = await Comment.create({
          user_email,
          comment: comment_text,
          book: book_id
        });
      }

      await comment.populate('book', '_id title').execPopulate();
            
      return res.json(comment);
    } catch({ message }) {
      return res.status(500).send(message);
    }
  }
}