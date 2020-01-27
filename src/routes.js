const { Router } = require('express');
const multer = require('multer');
const uploadConfig = require('./config/upload');

const BookController = require('./controllers/BookController');
const RatingController = require('./controllers/RatingController');
const CommentController = require('./controllers/CommentController');

const upload = multer(uploadConfig);
const routes = Router();

routes.get('/books', BookController.index);

routes.post('/books', upload.single('image'), BookController.store);
routes.post('/books/:book_id/rating', RatingController.store);
routes.post('/books/:book_id/comment', CommentController.store);

routes.put('/books/:id', upload.single('image'), BookController.update);

routes.delete('/books/:id', BookController.delete);

module.exports = routes;