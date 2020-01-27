const fs = require('fs');
const path = require('path');

const Book = require('../models/Book');
const parseStringAsArray = require('../utils/parseStringAsArray');
const resizeImage = require('../utils/resizeImage');

module.exports = {
  async index(req, res) {
    const books = await Book.find(); 

    return res.json(books);
  },

  async store(req, res) {
    try {
      const { title, description, author, year, genres } = req.body;
      const { path: image_path, filename, destination } = req.file;

      let book = await Book.findOne({ title, author });

      if (!book) {
        const genres_array = parseStringAsArray(genres);

        resizeImage(image_path, path.resolve(destination, 'resized', filename));

        book = await Book.create({
          title,
          description,
          author,
          year,
          genres: genres_array,
          image: filename
        });
      } else {
        //Deleta a imagem salva na pasta 'uploads'
        fs.unlinkSync(image_path);
      }

      return res.json(book);
    } catch({ message }) {
      res.status(500).send(message);
    }
  },

  async update(req, res) {
    try {
      const { id } = req.params;
      const { description, genres } = req.body;
      
      let new_image_path, filename, destination;

      if (req.file) {
        new_image_path = req.file.path;
        filename = req.file.filename;
        destination = req.file.destination;
      }

      let book = await Book.findOne({ _id: id });

      if (book) {
        const genres_array = parseStringAsArray(genres);

        const new_book = await Book.findByIdAndUpdate(id, { 
          description,
          genres: genres_array,
          image: filename || book.image 
        }, (err, updated_book) => {
          if (!err) {
            if (req.file) {
              resizeImage(new_image_path, path.resolve(destination, 'resized', filename));

              const image_path = path.resolve(__dirname, '..', '..', 'uploads', 'resized', book.image);

              fs.exists(image_path, (exists) => {
                if (exists) { fs.unlinkSync(image_path) }
              });
            }

            return updated_book;
          }
        });

        return res.json(new_book);
      } else {
        return res.send("Registro não encontrado!");
      }
    } catch ({ message }) {
      return res.status(500).send(message);
    }
  },

  async delete(req, res) {
    try {
      const { id } = req.params;

      let book = await Book.findOne({ _id: id });

      if (book) {
        await Book.findByIdAndDelete(id, (err, result) => {
          if (!err) {
            const image_path = path.resolve(__dirname, '..', '..', 'uploads', 'resized', book.image);
            
            fs.exists(image_path, (exists) => {
              if (exists) { fs.unlinkSync(image_path) }
            });
          }
        });

        return res.send("Registro excluído com sucesso!");
      } else {
        return res.send("Registro não encontrado!");
      }
    } catch ({ message }) {
      return res.status(500).send(message);
    }
  }
}