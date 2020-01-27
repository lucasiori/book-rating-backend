const Rating = require('../models/Rating');
const Book = require('../models/Book');

module.exports = {
  async index(req, res) {
    const rating_list = await Rating.find();

    await rating_list.populate('book', '_id title').execPopulate();

    return res.json(rating_list);
  },

  async store(req, res) {
    try {
      const { book_id } = req.params;
      const { user_email, note } = req.body;

      let rating = await Rating.findOne({ user_email, book: book_id });

      if (!rating) {
        rating = await Rating.create({
          user_email,
          note,
          book: book_id
        });

        const book = await Book.findById(book_id);
        const amount_book_rating = await Rating.find({ book: book_id }).countDocuments();

        const new_rating_book = ((book.rating || 0) + note) / amount_book_rating;

        await Book.findByIdAndUpdate(book_id, { 
          rating: parseFloat(new_rating_book.toFixed(1))
        });
      }

      await rating.populate('book', '_id title').execPopulate();
            
      return res.json(rating);
    } catch({ message }) {
      return res.status(500).send(message);
    }
  }
}